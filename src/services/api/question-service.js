import { ApiService } from '@/services/api/api-service';
import isEqual from 'lodash/isEqual';

export class QuestionService extends ApiService {
  #cache = {
    lastUpdate: null,
    workspaceId: null,
    data: [],
    params: {},
  };

  constructor() {
    super('questions');
  }

  async get({ limit = 5, offset = 0, workspaceId, query, ...params } = {}) {
    const { level, categoryId, type, status } = params;

    if (!workspaceId) throw Error('Workspace is required param');

    const { lastUpdate } = this.#cache;

    if (
      !lastUpdate
      || lastUpdate > new Date() + 300000
      || workspaceId !== this.#cache.workspaceId
      || !isEqual(this.#cache.params, params)
    ) {
      let ref = this.collection;

      ref = ref.where('workspaceId', '==', workspaceId);

      if (level || categoryId || status || type) {
        level && (ref = ref.where('level', '==', +level));
        categoryId && (ref = ref.where('categoryId', '==', categoryId));
        status && (ref = ref.where('status', '==', status));
        type && (ref = ref.where('type', '==', type));
      }

      const snapshots = await ref.orderBy('created', 'desc').get();

      this.#cache = {
        data: snapshots.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        workspaceId,
        params,
        lastUpdate: +new Date(),
      };
    }

    const data = this.#cache.data.filter(question => {
      let result = true;

      if (query) {
        const regExp = new RegExp(query, 'im');
        result = (question.title + question.description).match(regExp);
      }

      return result;
    });

    return {
      meta: {
        total: data.length,
      },
      data: data.slice(offset, offset + limit),
    };
  }

  async getById(id) {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  deleteById(id) {
    this.#cache.lastUpdate = null;
    return this.collection.doc(id).delete();
  }

  create(data) {
    this.#cache.lastUpdate = null;
    return this.collection.doc().set({
      description: '',
      answer: '',
      ...data,
      created: this.getServerTimestamp(),
    });
  }

  update({ id, ...data }) {
    delete data.created;
    delete data.authorId;
    delete data.workspaceId;
    this.#cache.lastUpdate = null;
    return this.collection.doc(id).update(data);
  }

  async createSharedQuestion(data) {
    const ref = this.database.ref().child('questions').push();

    await ref.set({
      ...data,
    });

    return ref.key;
  }

  async getSharedQuestion(id) {
    if (!id) throw new Error('Shared question id is required');

    const snapshot = await this.database.ref(`/questions/${id}`).once('value');

    if (!snapshot.exists()) throw new Error('Shared question not found');

    return snapshot.val();
  }

  updateSharedQuestion({ id, ...data }) {
    return this.database.ref(`/questions/${id}/`).update(data);
  }

  subscribeSharedQuestion(id, cb) {
    const ref = this.database.ref(`/questions/${id}`);
    ref.on('value', (snapshot) => cb(snapshot.val()));
    return () => ref.off();
  }
}

export default new QuestionService();
