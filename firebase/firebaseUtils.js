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
  console.log('Adding user to Firestore:', user);
  const userRef = firestore().collection('users').doc(user.uid);
  console.log('User ref:', userRef);
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

export const createTransactionFirestore = async (transaction, centerId) => {
  console.log('Creating tx:', transaction);
  const transactionsRef = firestore()
    .collection('transactions')
    .doc(centerId)
    .collection('list');
  console.log('Transactions ref:', transactionsRef);
  try {
    await transactionsRef.doc(transaction.id).set({
      id: transaction.id,
      timestamp: transaction.timestamp,
      status: 'CREATED',
      items: transaction.items,
      user: transaction.user,
    });
    console.log('Adding tx to Firestore');
  } catch (error) {
    console.log('Error adding tx to Firestore:', error);
  }
};

export const getCurrentRate = async (category) => {
  const ratesRef = firestore().collection('rate').doc(category);
  const ratesSnapshot = await ratesRef.get();
  if (ratesSnapshot.exists) {
    return ratesSnapshot.data();
  } else {
    throw new Error(`Rates for ${category} not found`);
  }
};

export const getTransactions = async (centerId) => {
  const transactionsRef = firestore()
    .collection('transactions')
    .doc(centerId)
    .collection('list');
  const transactionsSnapshot = await transactionsRef.get();
  if (transactionsSnapshot.empty) {
    return [];
  } else {
    return transactionsSnapshot.docs.map((doc) => doc.data());
  }
};
