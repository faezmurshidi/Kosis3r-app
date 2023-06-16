import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import auth from '@react-native-firebase/auth';

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
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Forgot Password</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 20,
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
  );
}
