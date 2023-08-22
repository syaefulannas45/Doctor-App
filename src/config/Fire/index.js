import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getDatabase, ref, push, set, update,get} from 'firebase/database';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCx2u5fU8MTL9vdOj9Eb4ChkxgaNPyf8Ss',
  authDomain: 'my-doctor-01-da016.firebaseapp.com',
  projectId: 'my-doctor-01-da016',
  storageBucket: 'my-doctor-01-da016.appspot.com',
  messagingSenderId: '191123530340',
  appId: '1:191123530340:web:9df99d1e58787349f6b571',
  measurementId: 'G-Q10G7BRY0N',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);
export {ref, push, auth, db, set, update, storage,get};
