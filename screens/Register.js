import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
import { addUserToFirestore } from '../firebase/firebaseUtils';
import style from '../styles';
import { AuthContext } from '../App';

const RegisterScreen = ({ navigation }) => {
  const { user, setUser } = useContext(AuthContext);
  console.log('user@RegisterScreen', user);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [dob, setDob] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    postcode: '',
    city: '',
    state: '',
  });

  useEffect(() => {
    if (user?.phoneNumber) {
      setPhoneNumber(user.phoneNumber);
    }
    if (user?.address) {
      setAddress(user.address);
    }
    if (user?.email) {
      setEmail(user.email);
    }
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const updateUser = async () => {
    try {
      // await user.updateProfile({ displayName: name });
      const userData = {
        uid: user.uid,
        name,
        email,
        phoneNumber,
        address,
      };

      console.log('User data:', userData);
      setUser(userData);
      await addUserToFirestore(userData);
    } catch (error) {
      console.log('Error registering user:', error);
    } finally {
      ToastAndroid.show('Profile updated!', ToastAndroid.LONG);
      console.log('navigation', navigation);
      const canGoBack = navigation.canGoBack();
      if (canGoBack) {
        // There is a screen to go back to
        console.log('Can go back');
        navigation.goBack();
      } else {
        // There is no screen to go back to (at the root of the stack)
        console.log('Cannot go back');
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text
          style={{
            color: style.colors.text.secondary,
            padding: 2,
            paddingTop: 8,
          }}
        >
          Tell us more about yourself...
        </Text>

        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
          activeOutlineColor={style.colors.accent}
          outlineColor={style.colors.secondary}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          mode="outlined"
          activeOutlineColor={style.colors.accent}
          outlineColor={style.colors.secondary}
          disabled={email ? true : false}
        />
        <TextInput
          label="Phone number"
          value={phoneNumber}
          style={styles.input}
          onChangeText={setPhoneNumber}
          mode="outlined"
          activeOutlineColor={style.colors.accent}
          outlineColor={style.colors.secondary}
          disabled={phoneNumber ? true : false}
        />
        <TextInput
          label="Date of birth"
          value={dob}
          style={styles.input}
          onChangeText={setDob}
          mode="outlined"
          activeOutlineColor={style.colors.accent}
          outlineColor={style.colors.secondary}
        />
        <View>
          <TextInput
            label="Address Line 1"
            value={address.line1}
            onChangeText={(text) => setAddress({ ...address, line1: text })}
            style={styles.input}
            mode="outlined"
            activeOutlineColor={style.colors.accent}
            outlineColor={style.colors.secondary}
          />
          <TextInput
            label="Address Line 2"
            value={address.line2}
            onChangeText={(text) => setAddress({ ...address, line2: text })}
            style={styles.input}
            mode="outlined"
            activeOutlineColor={style.colors.accent}
            outlineColor={style.colors.secondary}
          />
          <TextInput
            label="Postcode"
            value={address.postcode}
            onChangeText={(text) => setAddress({ ...address, postcode: text })}
            style={styles.input}
            mode="outlined"
            activeOutlineColor={style.colors.accent}
            outlineColor={style.colors.secondary}
          />
          <TextInput
            label="City"
            value={address.city}
            onChangeText={(text) => setAddress({ ...address, city: text })}
            style={styles.input}
            mode="outlined"
            activeOutlineColor={style.colors.accent}
            outlineColor={style.colors.secondary}
          />
          <TextInput
            label="State"
            value={address.state}
            onChangeText={(text) => setAddress({ ...address, state: text })}
            style={styles.input}
            mode="outlined"
            activeOutlineColor={style.colors.accent}
            outlineColor={style.colors.secondary}
          />
        </View>
      </ScrollView>
      <TouchableOpacity onPress={updateUser} style={styles.button}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollView: {
    flexGrow: 1,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    outlineStyle: '#FFC0CB',
  },
  button: {
    backgroundColor: style.colors.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default RegisterScreen;
