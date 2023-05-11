// App.tsx
import React, { createContext, useState, useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import AppNavigation from './navigation/AppNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from 'react-native-paper';
import { getNews } from './firebase/firebaseUtils';

export const AuthContext = createContext({});

export default function App() {
  const [user, setUser] = useState(null);
  const [news, setNews] = useState([]);
  useEffect(() => {
    const restoreUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.log('Error restoring user data:', error);
      }
    };
    restoreUser();
  }, []);

  useEffect(() => {
    const restoreNews = async () => {
      try {
        const newsData = await getNews();
        if (newsData) {
          setNews(newsData);
        }
      } catch (error) {
        console.log('Error restoring news data:', error);
      }
    };
    restoreNews();
  }, []);

  const updateUser = async (newUser) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.log('Error storing user data:', error);
    }
  };

  useEffect(() => {
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    };

    requestUserPermission();
  }, []);

  useEffect(() => {
    const onTokenRefreshListener = messaging().onTokenRefresh(async (token) => {
      // Save the new token in your database
      console.log('New FCM token:', token);
    });

    return () => {
      onTokenRefreshListener();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground message:', remoteMessage);
      // Show a local notification or update the UI
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Provider>
      <AuthContext.Provider value={{ user, setUser: updateUser, news }}>
        <AppNavigation />
      </AuthContext.Provider>
    </Provider>
  );
}
