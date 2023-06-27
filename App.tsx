// App.tsx
import React from 'react';
import AppNavigation from './navigation/AppNavigation';
import { Provider } from 'react-native-paper';
import { LogBox } from 'react-native';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  LogBox.ignoreAllLogs();

  return (
    <Provider>
      <AuthProvider>
        <AppNavigation />
      </AuthProvider>
    </Provider>
  );
}
