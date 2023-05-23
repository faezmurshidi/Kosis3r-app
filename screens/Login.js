import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  ToastAndroid,
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
import logo from '../assets/header.png';
import { TouchableOpacity } from 'react-native-gesture-handler';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};

const windowWidth = Dimensions.get('window').width;
const paddingValue = (windowWidth - 24) / 12; // Adjust the value as per your needs

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('+60');
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const [language, setLanguage] = useState('en');
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [loginMethod, setLoginMethod] = useState('phone');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const codeInputRef = useRef(null);

  // Handle login
  const onAuthStateChanged = useCallback(
    (user) => {
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
    },
    [navigation, setUser],
  );

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => subscriber(); // unsubscribe on unmount
  }, [onAuthStateChanged]);

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
    } catch (error) {
      // Handle login errors
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async () => {
    console.log('loginWithEmail');
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      // Handle login errors
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async () => {
    console.log('registerWithEmail');
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        ToastAndroid.show(
          'Password and confirm password do not match.',
          ToastAndroid.LONG,
        );
        return;
      }
      await auth().createUserWithEmailAndPassword(email, password);
      setLoginMethod('email');
    } catch (error) {
      // Handle login errors
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async () => {
    try {
      await confirm.confirm(code);
    } catch (error) {
      ToastAndroid.show('Invalid code.', ToastAndroid.LONG);
    }
  };

  const skipLogin = () => {
    const mockUser = {
      uid: '123456',
      displayName: 'Faez',
    };
    setUser(mockUser);
  };

  console.log('loginMethod', loginMethod);

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        backgroundColor={style.colors.paper.offwhite}
        barStyle="dark-content"
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Image
          source={logo}
          style={{
            alignSelf: 'center',
            height: 100,
            width: 300,
          }}
          resizeMode="contain"
        />
        <Text variant="labelLarge" style={{ margin: 12, alignSelf: 'center' }}>
          {loginMethod !== 'register' ? i18n.t('login') : i18n.t('register')}
        </Text>

        {loginMethod === 'phone' && (
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
            disabled={confirm}
          />
        )}
        {!confirm && loginMethod === 'phone' && (
          <Button mode="contained" onPress={loginUser} style={styles.button}>
            {i18n.t('requestOtP')}
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

        {loginMethod !== 'phone' && (
          <TextInput
            label={i18n.t('email')}
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            style={styles.input}
            activeOutlineColor={style.colors.accent}
            outlineColor={style.colors.secondary}
            returnKeyType="next"
            onSubmitEditing={loginUser}
            disabled={confirm}
          />
        )}

        {loginMethod !== 'phone' && (
          <TextInput
            label={i18n.t('password')}
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            activeOutlineColor={style.colors.accent}
            outlineColor={style.colors.secondary}
            returnKeyType="done"
            onSubmitEditing={
              loginMethod === 'phone' ? setLoginMethod('email') : loginWithEmail
            }
          />
        )}

        {loginMethod === 'register' && (
          <TextInput
            label={i18n.t('confirmPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            activeOutlineColor={style.colors.accent}
            outlineColor={style.colors.secondary}
            returnKeyType="done"
            onSubmitEditing={registerWithEmail}
          />
        )}

        {confirm && loginMethod === 'phone' && (
          <Button mode="contained" onPress={loginUser} style={styles.button}>
            {'Login'}
          </Button>
        )}

        {loginMethod === 'email' && (
          <Button
            mode="contained"
            onPress={loginWithEmail}
            style={styles.button}
          >
            Login
          </Button>
        )}

        {loginMethod !== 'register' && (
          <Text
            variant="labelSmall"
            style={{ margin: 12, alignSelf: 'center' }}
          >
            OR
          </Text>
        )}

        {loginMethod === 'phone' && (
          <Button
            mode="contained"
            onPress={() => setLoginMethod('email')}
            style={styles.button}
          >
            Login with Email
          </Button>
        )}

        {loginMethod !== 'phone' && (
          <Button
            mode="contained"
            onPress={() =>
              loginMethod !== 'register'
                ? setLoginMethod('register')
                : registerWithEmail()
            }
            style={styles.button}
          >
            Register
          </Button>
        )}

        {loginMethod !== 'phone' && (
          <TouchableOpacity
            onPress={() => setLoginMethod('phone')}
            style={{ alignSelf: 'center' }}
          >
            <Text variant="labelMedium" style={{ margin: 16 }}>
              {loginMethod === 'email'
                ? 'Use Phone Number Instead'
                : 'Login Instead'}
            </Text>
          </TouchableOpacity>
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
