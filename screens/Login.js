import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import {
  Button,
  TextInput,
  Title,
  Provider as PaperProvider,
  DefaultTheme,
  Text,
} from 'react-native-paper';
import { AuthContext } from '../App';
import auth from '@react-native-firebase/auth';
import { Picker } from '@react-native-picker/picker';
import i18n from '../i18n';
import LanguageSelector from '../components/LanguageSelector';
import style from '../styles';
import { fetchUserFromFirestore } from '../firebase/firebaseUtils';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('+60');
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const [language, setLanguage] = useState('en');
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState(null);

  const codeInputRef = useRef(null);

  // Handle login
  function onAuthStateChanged(user) {
    setLoading(true);
    if (user) {
      console.log('user@Firebase', user);
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
      // setUser({ uid: user.uid, phoneNumber: user.phoneNumber });
      fetchUserFromFirestore(user, setUser).then((hasRegistered) => {
        console.log('hasRegistered', hasRegistered);
        setLoading(false);
        if (hasRegistered) {
          navigation.navigate('MainTabs', { screen: 'Dashboard' });
        } else {
          navigation.replace('EditProfile');
        }
      });
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
    setLoading(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      console.log('confirmation', confirmation);
      setConfirm(confirmation);
      codeInputRef.current.focus();
    } catch (error) {
      // Handle login errors
    } finally {
      setLoading(false);
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
      <StatusBar
        backgroundColor={style.colors.background.light.offwhite} // Change the background color of the status bar
        barStyle="dark-content" // Change the text/icons color (options: 'light-content', 'dark-content', or 'default')
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Title style={styles.title}>KitaKitar</Title>

        <Text variant="labelLarge" style={{ margin: 12, alignSelf: 'center' }}>
          {i18n.t('loginRegister')}
        </Text>

        <TextInput
          label={i18n.t('phoneNo')}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
          activeOutlineColor={style.colors.accent}
          outlineColor={style.colors.secondary}
          returnKeyType="next"
          onSubmitEditing={loginUser}
        />
        {!confirm && (
          <Button mode="contained" onPress={loginUser} style={styles.button}>
            {i18n.t('login')}
          </Button>
        )}
        {confirm && (
          <>
            <TextInput
              ref={codeInputRef}
              label="Confirmation Code"
              value={code}
              onChangeText={setCode}
              mode="outlined"
              keyboardType="number-pad"
              style={styles.input}
              activeOutlineColor={style.colors.accent}
              outlineColor={style.colors.secondary}
            />
            <Button
              mode="contained"
              onPress={confirmCode}
              style={styles.button}
              loading={loading}
            >
              Confirm Code
            </Button>
          </>
        )}
        {__DEV__ && (
          <Button mode="outlined" onPress={skipLogin} style={styles.skip}>
            Skip Login (Dev Only)
          </Button>
        )}
        <LanguageSelector
          selectedLanguage={language}
          onSelectLanguage={changeLanguage}
        />
      </KeyboardAvoidingView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: style.colors.paper.offwhite,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  input: {
    marginBottom: 16,
    outlineStyle: '#FFC0CB',
  },
  button: {
    marginBottom: 8,
    backgroundColor: style.colors.primary,
  },
  skip: {
    backgroundColor: style.colors.accent,
  },
});

export default LoginScreen;
