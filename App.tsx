// App.tsx
import React, { createContext, useState } from 'react';
import AppNavigation from './navigation/AppNavigation';

export const AuthContext = createContext({});

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <AppNavigation />
    </AuthContext.Provider>
  );
}
