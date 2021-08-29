import { ApiService } from '@/services/api/api-service';

export class CategoryService extends ApiService {
  constructor() {
    super('categories');
  }

  async get({ workspaceId }) {
    if (!workspaceId) throw Error('Workspace is required param');

    const snapshots = await this.collection.where('workspaceId', '==', workspaceId).get();

    return snapshots.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async create({ workspaceId, name }) {
    const doc = await this.collection.add({ workspaceId, name });
    return { id: doc.id, workspaceId, name };
  }
}

export default new CategoryService();
