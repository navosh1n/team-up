import { ApiService } from '@/services/api/api-service';

export class RoleService extends ApiService {
  constructor() {
    super('roles');
  }

  async get({ workspaceId } = {}) {
    if (!workspaceId) throw new Error('workspaceId is required');

    const snapshots = await this.collection.where('workspaceId', '==', workspaceId).get();

    return snapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

export default new RoleService();
