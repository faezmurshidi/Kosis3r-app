import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Button,
  TextInput,
  Title,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';
import { AuthContext } from '../App';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const { setUser } = useContext(AuthContext);

  const loginUser = async () => {
    try {
      // Perform the login process here (e.g., Firebase Auth)
      const user = {
        uid: '123456',
        displayName: 'John Doe',
      };

      // Update the user state in AuthContext
      setUser(user);
    } catch (error) {
      // Handle login errors
    }
  };

  const skipLogin = () => {
    const mockUser = {
      uid: '123456',
      displayName: 'John Doe',
    };
    setUser(mockUser);
  };

  return (
    <PaperProvider theme={theme}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Title style={styles.title}>Login</Title>
        <TextInput
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
        />
        <Button mode="contained" onPress={loginUser} style={styles.button}>
          Login
        </Button>
        {__DEV__ && (
          <Button mode="outlined" onPress={skipLogin} style={styles.button}>
            Skip Login (Dev Only)
          </Button>
        )}
      </KeyboardAvoidingView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 8,
  },
});

export default LoginScreen;
