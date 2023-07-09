import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import style from '../styles';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    console.log('forgotPassword');

    try {
      await auth().sendPasswordResetEmail(email);
      ToastAndroid.show(
        'Password reset email sent. Please check your email.',
        ToastAndroid.LONG,
      );
    } catch (error) {
      // Handle login errors
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    } finally {
      //navigate back
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={{}}>
          Kami akan hantarkan email untuk reset kata laluan
        </Text>
        <TextInput
          style={{
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 20,
            width: '100%',
          }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Enter your email"
        />
        <TouchableOpacity
          style={{ backgroundColor: '#007BFF', padding: 10, borderRadius: 5 }}
          onPress={handleForgotPassword}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            Reset Password
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: style.colors.tertiary,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  card: {
    backgroundColor: style.colors.background.light.offwhite,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 20,
  },
});
