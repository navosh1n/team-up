import { ApiService } from '@/services/api/api-service';

export class UserService extends ApiService {
  #cache = {
    lastUpdate: null,
    workspaceId: null,
    data: [],
  };

  constructor() {
    super('users');
  }

  async get({ limit = 5, offset = 0, workspaceId, ...params } = {}) {
    const { cityId, email, fio, roleId } = params;

    if (!workspaceId) {
      throw Error('Workspace is required param');
    }

    const { lastUpdate } = this.#cache;
    if (
      !lastUpdate
      || lastUpdate > new Date() + 300000
      || workspaceId !== this.#cache.workspaceId
    ) {
      const snapshots = await this.collection.orderBy('created', 'desc').get();

      this.#cache = {
        data: snapshots.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(user => user.workspaces[workspaceId]),
        workspaceId,
        lastUpdate: +new Date(),
      };
    }

    const data = this.#cache.data.filter(user => {
      let result = true;

      if (cityId) {
        result = result && user.cityId === cityId;
      }

      if (roleId) {
        const roles = user.workspaces[workspaceId]?.roles || [];
        result = result && roles.includes(roleId);
      }

      if (fio) {
        result = result && new RegExp(fio, 'i').test(user.firstName + user.lastName);
      }

      if (email) {
        result = result && user.email === email;
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

  async getAll({ workspaceId } = {}) {
    if (!workspaceId) throw Error('Workspace is required param');

    const { lastUpdate } = this.#cache;
    if (
      !lastUpdate
      || lastUpdate > new Date() + 300000
      || workspaceId !== this.#cache.workspaceId
    ) {
      const snapshots = await this.collection.orderBy('created', 'desc').get();

      this.#cache = {
        data: snapshots.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(user => user.workspaces[workspaceId]),
        workspaceId,
        lastUpdate: +new Date(),
      };
    }

    const { data } = this.#cache;

    return {
      data,
      meta: {
        total: data.length,
      },
    };
  }

  async create(data) {
    const doc = await this.collection.add({
      middleName: '',
      email: '',
      ...data,
      created: this.getServerTimestamp(),
    });
    this.#cache.lastUpdate = null;
    return { id: doc.id, ...data };
  }

  async update({ id, created, ...data }) {
    await this.collection.doc(id).update(data);
    this.#cache.lastUpdate = null;
    return this.getById(id);
  }

  async getById(id) {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  deleteById(id) {
    this.#cache.lastUpdate = null;
    return this.collection.doc(id).delete();
  }

  async getByEmail(email) {
    if (!email) throw Error('Email is required');

    const ref = this.collection.where('email', '==', email);

    const snapshots = await super.get(ref, { limit: 1 });
    const userDoc = snapshots.docs[0];
    return snapshots.size ? { id: userDoc.id, ...userDoc.data() } : null;
  }
}

export default new UserService();
