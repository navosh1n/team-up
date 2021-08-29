export class StorageService {
  constructor(storage = localStorage) {
    this.storage = storage;
  }

  getItem(key) {
    return this.storage.getItem(key);
  }

  setItem(key, value) {
    value = typeof value === 'object' ? JSON.stringify(value) : String(value);
    this.storage.setItem(key, value);
  }

  removeItem(key) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }
}

export default new StorageService();
