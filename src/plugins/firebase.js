import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import { firebaseConfig } from '@/constants/config';

if (!firebaseConfig) throw Error('Firebase config is required! Create app: https://firebase.google.com/docs/web/setup');

firebase.initializeApp(firebaseConfig);

export default firebase;
