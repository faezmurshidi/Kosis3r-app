import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import style from '../styles';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    console.log('forgotPassword');

    try {
      await auth().sendPasswordResetEmail(email);
      ToastAndroid.show(
        'Kami telah hantarkan email untuk reset kata laluan',
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
        <Text variant="labelLarge" style={{ paddingBottom: 12 }}>
          Kami akan hantarkan email untuk reset kata laluan
        </Text>
        <TextInput
          label={'Email'}
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          style={styles.input}
          activeOutlineColor={style.colors.accent}
          outlineColor={style.colors.primaryDark}
          returnKeyType="next"
          onSubmitEditing={handleForgotPassword}
        />

        <TouchableOpacity
          style={{
            backgroundColor: style.colors.tertiary,
            padding: 10,
            borderRadius: 5,
          }}
          onPress={handleForgotPassword}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            Reset Kata Laluan
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
  input: {
    marginBottom: 16,
    outlineStyle: style.colors.primaryDark,
    borderRadius: 10,
    width: '100%',
  },
});
