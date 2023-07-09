// App.tsx
import React from 'react';
import AppNavigation from './navigation/AppNavigation';
import { Provider } from 'react-native-paper';
import { LogBox } from 'react-native';
import { AuthProvider } from './context/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  LogBox.ignoreAllLogs();

  return (
    <Provider>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppNavigation />
        </GestureHandlerRootView>
      </AuthProvider>
    </Provider>
  );
}
