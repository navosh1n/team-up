import { StorageService } from '@/services/storage/storage-service';

export class UserStorage extends StorageService {
  #keys = {
    userId: 'userId',
  };

  get userId() {
    return this.getItem(this.#keys.userId);
  }

  set userId(id) {
    this.setItem(this.#keys.userId, id);
  }

  clearData() {
    Object.keys(this.#keys).forEach(key => this.removeItem(key));
  }
}

export default new UserStorage();
