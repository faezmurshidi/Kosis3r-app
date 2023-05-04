import firebase from './firebaseConfig';
import firestore from '@react-native-firebase/firestore';

// Firebase Authentication utility functions
export const signInWithEmailPassword = async (
  email: string,
  password: string,
) => {
  return await firebase.auth().signInWithEmailAndPassword(email, password);
};

export const signUpWithEmailPassword = async (
  email: string,
  password: string,
) => {
  return await firebase.auth().createUserWithEmailAndPassword(email, password);
};

export const signOut = async () => {
  return await firebase.auth().signOut();
};

// Firebase Firestore utility functions
export const getDocument = async (collection: string, documentId: string) => {
  const docRef = firebase.firestore().collection(collection).doc(documentId);
  const docSnapshot = await docRef.get();
  if (docSnapshot.exists) {
    return docSnapshot.data();
  } else {
    throw new Error(`Document ${documentId} not found in ${collection}`);
  }
};

// Firebase Storage utility functions
export const uploadFileToStorage = async (path: string, file: Blob) => {
  const storageRef = firebase.storage().ref();
  const fileRef = storageRef.child(path);
  await fileRef.put(file);
  return await fileRef.getDownloadURL();
};

export const addUserToFirestore = async (user) => {
  const userRef = firestore().collection('users').doc(user.uid);

  try {
    await userRef.set({
      name: user.name,
      email: user.email,
      address: {
        line1: user.address.line1,
        line2: user.address.line2,
        postcode: user.address.postcode,
        city: user.address.city,
        state: user.address.state,
      },
    });
    console.log('User added to Firestore');
  } catch (error) {
    console.log('Error adding user to Firestore:', error);
  }
};
