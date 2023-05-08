import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Button,
  TextInput,
  Title,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';
import { AuthContext } from '../App';
import auth from '@react-native-firebase/auth';
import { Picker } from '@react-native-picker/picker';
import i18n from '../i18n';
import LanguageSelector from '../components/LanguageSelector';

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
  const [language, setLanguage] = useState('en');
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState(null);

  // Handle login
  function onAuthStateChanged(user) {
    if (user) {
      console.log('user', user);
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
      setUser(user);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const changeLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  const loginUser = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      console.log('confirmation', confirmation);
      setConfirm(confirmation);
    } catch (error) {
      // Handle login errors
    }
  };

  async function confirmCode() {
    try {
      await confirm.confirm(code);
    } catch (error) {
      console.log('Invalid code.');
    }
  }

  const skipLogin = () => {
    const mockUser = {
      uid: '123456',
      displayName: 'Faez',
    };
    setUser(mockUser);
  };

  return (
    <PaperProvider theme={theme}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Title style={styles.title}>KitaKitar</Title>
        <LanguageSelector
          selectedLanguage={language}
          onSelectLanguage={changeLanguage}
        />
        <TextInput
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
        />
        {!confirm && (
          <Button mode="contained" onPress={loginUser} style={styles.button}>
            Log Masuk
          </Button>
        )}
        {confirm && (
          <>
            <TextInput
              label="Confirmation Code"
              value={code}
              onChangeText={setCode}
              mode="outlined"
              keyboardType="number-pad"
              style={styles.input}
            />
            <Button
              mode="contained"
              onPress={confirmCode}
              style={styles.button}
            >
              Confirm Code
            </Button>
          </>
        )}
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
