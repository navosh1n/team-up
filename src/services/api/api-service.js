import firebase from '@/plugins/firebase';
import userStorage from '@/services/storage/user-storage';
import { goTo } from '@/utils/location';

export class ApiService {
  constructor(collection) {
    this.db = firebase.firestore();
    this.collection = this.db.collection(collection);
  }

  get database() {
    return firebase.database();
  }

  getServerTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  get(collection = this.collection, { limit } = {}) {
    try {
      let ref = collection;

      if (limit) {
        ref = ref.limit(limit);
      }

      return ref.get();
    } catch (e) {
      this._errorHandler(e);
    }
  }

  _errorHandler(e) {
    if (e.name !== 'FirebaseError') {
      throw e;
    } else {
      switch (e.code) {
        case 'permission-denied':
          userStorage.clearData();
          goTo('/');
          throw e;
        default:
          throw e;
      }
    }
  }
}
