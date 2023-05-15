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
      uid: user.uid,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      wallet: user.wallet || 0,
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

export const fetchUserFromFirestore = async (user, setUser) => {
  console.log('Fetching user from Firestore:', user.uid);
  const userRef = firestore().collection('users').doc(user.uid);
  console.log('User ref:', userRef);
  try {
    const userSnapshot = await userRef.get();
    if (userSnapshot.exists) {
      console.log('User found in Firestore');
      console.log('User data:', userSnapshot.data());
      setUser(userSnapshot.data());
      return true;
    } else {
      console.log('User not found in Firestore');
      setUser({ uid: user.uid, phoneNumber: user.phoneNumber });
      return false;
    }
  } catch (error) {
    console.log('Error fetching user from Firestore:', error);
  }
};

export const createTransactionFirestore = async (transaction) => {
  console.log('Creating tx:', transaction);
  const transactionsRef = firestore().collection('transactions');
  console.log('Transactions ref:', transactionsRef);
  try {
    await transactionsRef.doc(transaction.id).set(transaction);
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

export const getTransactions = async (uid) => {
  console.log('Fetching transactions for:', uid);
  const transactionsRef = firestore()
    .collection('transactions')
    .where('userId', '==', uid);
  const transactionsSnapshot = await transactionsRef.get();
  const transactions = transactionsSnapshot.docs.map((doc) => doc.data());
  console.log('Transactions snapshot:', transactionsSnapshot);
  return transactions;
};

export const getNews = async () => {
  const newsRef = firestore().collection('news');
  const newsSnapshot = await newsRef.get();
  if (newsSnapshot.empty) {
    return [];
  } else {
    return newsSnapshot.docs.map((doc) => doc.data());
  }
};

export const saveImageToStorage = async (path, image) => {
  const storageRef = firebase.storage().ref('transactionImage');
  const imageRef = storageRef.child(path);
  await imageRef.putFile(image);
  return await imageRef.getDownloadURL();
};
