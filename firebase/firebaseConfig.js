import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import '@react-native-firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBogzppBraqyA4O-cJKTJud8r-Xj2J-tr8',
  authDomain: 'kosis-dev.firebaseapp.com',
  projectId: 'kosis-dev',
  storageBucket: 'kosis-dev.appspot.com',
  messagingSenderId: '234848359612',
  appId: '1:234848359612:android:8b732fe6ea975222a8acb9',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
