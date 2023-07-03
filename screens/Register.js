import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import {
  TextInput,
  Button,
  Title,
  Text,
  RadioButton,
} from 'react-native-paper';
import { addUserToFirestore } from '../firebase/firebaseUtils';
import style from '../styles';
import { AuthContext } from '../context/AuthContext';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';

const RegisterScreen = ({ navigation }) => {
  const { user, setUser } = useContext(AuthContext);
  console.log('user@RegisterScreen', user);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [dob, setDob] = useState(new Date());
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [isPPR, setIsPPR] = useState(false);
  const [ppr, setPpr] = useState(null);
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState({
    unitNo: '',
    blockNo: '',
    line1: '',
    line2: '',
    postcode: '',
    city: '',
    state: '',
  });

  const pprList = [
    { label: 'PPR Hiliran', value: 'PPR Hiliran' },
    { label: 'PPR Kempas', value: 'PPR Kempas' },
    { label: 'Lain-lain', value: 'others' },
  ];

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

  const handleRadioPress = (value) => {
    setIsPPR(value);
  };

  const handleOptionSelect = (option) => {
    setPpr(option.value);
  };

  const updateUser = async () => {
    try {
      // await user.updateProfile({ displayName: name });
      const userData = {
        uid: user.uid,
        name,
        email,
        phoneNumber,
        dob,
        isPPR,
        ppr,
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
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'MainTabs',
              state: {
                routes: [{ name: 'Dashboard' }],
              },
            },
          ],
        });
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

        <Text style={{ color: style.colors.text.secondary, padding: 2 }}>
          Date of birth
        </Text>
        <View style={{ alignItems: 'center' }}>
          <DatePicker
            date={dob}
            onDateChange={setDob}
            mode={'date'}
            maximumDate={new Date()}
          />
        </View>
        {/* <TextInput
          label="Date of birth"
          value={dob}
          style={styles.input}
          onChangeText={setDob}
          mode="outlined"
          activeOutlineColor={style.colors.accent}
          outlineColor={style.colors.secondary}
          disabled={true}
        /> */}

        <View>
          <Text style={{ color: style.colors.text.secondary, padding: 2 }}>
            Adakah anda penghuni PPR?
          </Text>
          <RadioButton.Group onValueChange={handleRadioPress} value={isPPR}>
            <View style={{ flexDirection: 'row' }}>
              <RadioButton.Item label="Yes" value={true} />
              <RadioButton.Item label="No" value={false} />
            </View>
          </RadioButton.Group>
        </View>

        {isPPR ? (
          <View>
            <View style={{ paddingVertical: 8 }}>
              <Text style={{ color: style.colors.text.secondary, padding: 2 }}>
                PPR
              </Text>
              {/* <DropDownPicker
                items={pprList}
                defaultValue={ppr}
                open={open}
                setOpen={setOpen}
                placeholder="Pilih PPR"
                containerStyle={{ height: 40 }}
                style={{ backgroundColor: '#fafafa' }}
                itemStyle={{ justifyContent: 'flex-start' }}
                dropDownStyle={{ backgroundColor: 'black' }}
                onChangeItem={handleOptionSelect}
              /> */}
            </View>
            <TextInput
              label="No. Rumah"
              value={address.unitNo}
              onChangeText={(text) => setAddress({ ...address, unitNo: text })}
              style={styles.input}
              mode="outlined"
              activeOutlineColor={style.colors.accent}
              outlineColor={style.colors.secondary}
            />
            <TextInput
              label="Blok"
              value={address.blockNo}
              onChangeText={(text) => setAddress({ ...address, blockNo: text })}
              style={styles.input}
              mode="outlined"
              activeOutlineColor={style.colors.accent}
              outlineColor={style.colors.secondary}
            />
          </View>
        ) : (
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
              onChangeText={(text) =>
                setAddress({ ...address, postcode: text })
              }
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
        )}
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
