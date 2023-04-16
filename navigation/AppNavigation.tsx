// src/navigation/AppNavigation.tsx
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import { AuthContext } from '../App';

const AppNavigation = () => {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigation;
