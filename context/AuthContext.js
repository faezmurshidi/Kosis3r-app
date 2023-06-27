// AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const restoreUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUserState(JSON.parse(userData));
          setLoggedIn(true);
        }
      } catch (error) {
        console.log('Error restoring user data:', error);
      }
    };
    restoreUser();
  }, []);

  const setUser = async (newUser) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUserState(newUser);
      if (!newUser) {
        console.log('User logged out');
        setLoggedIn(false);
      }
    } catch (error) {
      console.log('Error storing user data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loggedIn, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
