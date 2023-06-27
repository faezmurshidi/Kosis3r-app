import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import firebase from './firebaseConfig';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase Authentication utility functions
export const signInWithEmailPassword = async (email, password) => {
  return await firebase.auth().signInWithEmailAndPassword(email, password);
};

export const signUpWithEmailPassword = async (email, password) => {
  return await firebase.auth().createUserWithEmailAndPassword(email, password);
};

export const signOut = async () => {
  return await firebase.auth().signOut();
};

// Firebase Firestore utility functions
export const getDocument = async (collection, documentId) => {
  const docRef = firebase.firestore().collection(collection).doc(documentId);
  const docSnapshot = await docRef.get();
  if (docSnapshot.exists) {
    return docSnapshot.data();
  } else {
    throw new Error(`Document ${documentId} not found in ${collection}`);
  }
};

// Firebase Storage utility functions
export const uploadFileToStorage = async (path, file) => {
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
    await userRef.update({
      uid: user.uid,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
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

export const updateFCMToken = async (uid, fcmToken) => {
  console.log('Updating FCM token:', fcmToken);
  const userRef = firestore().collection('users').doc(uid);
  console.log('User ref:', userRef);
  try {
    await userRef.update({ fcmToken: fcmToken });
    console.log('FCM token updated in Firestore');
  } catch (error) {
    console.log('Error updating FCM token in Firestore:', error);
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
      setUser({
        uid: user.uid,
        phoneNumber: user.phoneNumber,
        email: user.email,
      });
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

export const updateWalletFirestore = async (uid, wallet) => {
  console.log('Updating wallet:', wallet);
  const userRef = firestore().collection('users').doc(uid);
  console.log('User ref:', userRef);
  try {
    await userRef.update({ wallet: wallet });
    console.log('Wallet updated in Firestore');
  } catch (error) {
    console.log('Error updating wallet in Firestore:', error);
  }
};

export const createWithdrawalRequest = async (withdrawalRequest) => {
  console.log('Creating withdrawal request:', withdrawalRequest);
  const withdrawalRequestsRef = firestore().collection('withdrawal');
  console.log('Withdrawal requests ref:', withdrawalRequestsRef);
  try {
    await withdrawalRequestsRef
      .doc(withdrawalRequest.id)
      .set(withdrawalRequest);
    console.log('Adding withdrawal request to Firestore');

    updateWalletFirestore(
      withdrawalRequest.user.uid,
      withdrawalRequest.user.wallet - withdrawalRequest.amount,
    );
  } catch (error) {
    console.log('Error adding withdrawal request to Firestore:', error);
  }
};

export const getCurrentRate = async (kosisId) => {
  const ratesRef = firestore().collection('rate').doc(kosisId);
  const ratesSnapshot = await ratesRef.get();
  if (ratesSnapshot.exists) {
    return ratesSnapshot.data();
  } else {
    throw new Error(`Rates for ${kosisId} not found. Using default`);
  }
};

export const getTransactions = async (uid) => {
  console.log('Fetching transactions for:', uid);
  const transactionsRef = firestore()
    .collection('transactions')
    .where('user.uid', '==', uid);
  const transactionsSnapshot = await transactionsRef.get();
  const transactions = transactionsSnapshot.docs.map((doc) => doc.data());
  console.log('Transactions snapshot:', transactionsSnapshot);
  return transactions;
};

export const getWithdrawals = async (uid) => {
  console.log('Fetching withdrawal for:', uid);
  const transactionsRef = firestore()
    .collection('withdrawal')
    .where('user.uid', '==', uid);
  const transactionsSnapshot = await transactionsRef.get();
  const transactions = transactionsSnapshot.docs.map((doc) => doc.data());
  console.log('withdrawal snapshot:', transactionsSnapshot);
  return transactions;
};

export const getNews = async () => {
  const CACHE_KEY = 'newsCache';
  const CACHE_EXPIRATION = 30 * 60 * 1000; // 30 minutes in milliseconds

  // Check if the cached news exists and is not expired
  const cachedNews = await AsyncStorage.getItem(CACHE_KEY);
  const cachedTimestamp = await AsyncStorage.getItem(`${CACHE_KEY}_timestamp`);
  const currentTimestamp = new Date().getTime();

  if (
    cachedNews &&
    cachedTimestamp &&
    currentTimestamp - parseInt(cachedTimestamp, 10) < CACHE_EXPIRATION
  ) {
    // Return cached news if it exists and is not expired
    return JSON.parse(cachedNews);
  } else {
    const newsRef = firestore().collection('news');
    const newsSnapshot = await newsRef.get();
    if (newsSnapshot.empty) {
      return [];
    } else {
      const newsData = newsSnapshot.docs.map((doc) => doc.data());
      // Cache the news and timestamp
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(newsData));
      await AsyncStorage.setItem(
        `${CACHE_KEY}_timestamp`,
        currentTimestamp.toString(),
      );
      return newsData;
    }
  }
};

export const saveImageToStorage = async (path, image) => {
  const storageRef = firebase.storage().ref('transactionImage');
  const imageRef = storageRef.child(path);
  await imageRef.putFile(image);
  return await imageRef.getDownloadURL();
};
