import firebase from '@/plugins/firebase';
import userStorage from '@/services/storage/user-storage';
import { goTo } from '@/utils/location';

export class AuthService {
  constructor() {
    firebase.auth().useDeviceLanguage();
    this.provider = new firebase.auth.GoogleAuthProvider();
  }

  async signInGoogle() {
    try {
      const { credential, user } = await firebase.auth().signInWithPopup(this.provider);
      const { accessToken } = credential;
      return { accessToken, ...user };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async signOutGoogle(redirect = true) {
    try {
      await firebase.auth().signOut();
      userStorage.clearData();
      redirect && goTo('/');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async checkAuth() {
    let unsubscribe;

    const isAuth = await new Promise(resolve => {
      unsubscribe = firebase.auth().onAuthStateChanged(user => {
        resolve(!!user);
      });
    });

    unsubscribe && unsubscribe();

    return isAuth;
  }
}

export default new AuthService();
