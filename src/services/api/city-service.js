import { ApiService } from '@/services/api/api-service';

export class CityService extends ApiService {
  constructor() {
    super('cities');
  }

  async get({ name } = {}) {
    let ref = this.collection;

    if (name) {
      ref = ref.where('name', '==', name);
    }

    const snapshots = await ref.get();

    return snapshots.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
    }));
  }

  async create(name) {
    const doc = await this.collection.add({ name });
    return { id: doc.id, name };
  }
}

export default new CityService();
