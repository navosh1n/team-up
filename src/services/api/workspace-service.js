import { ApiService } from '@/services/api/api-service';

export class WorkspaceService extends ApiService {
  constructor() {
    super('workspaces');
  }

  async getById(id) {
    const doc = await this.collection.doc(id).get();
    if (doc.exists) return { id: doc.id, ...doc.data() };
    throw Error('Not Found');
  }
}

export default new WorkspaceService();
