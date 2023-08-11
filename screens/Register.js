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
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';

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
    floorNo: '',
    blockNo: '',
    line1: '',
    line2: '',
    postcode: '',
    city: '',
    state: '',
  });

  const floorNoRef = React.createRef();
  const unitNoRef = React.createRef();
  const line2Ref = React.createRef();
  const postcodeRef = React.createRef();
  const cityRef = React.createRef();

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
    if (user?.isPPR) {
      setIsPPR(user.isPPR);
    }
    if (user?.dob) {
      setDob(user.dob.toDate ? user.dob.toDate() : user.dob);
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
        ppr: 'PPR Hiliran',
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
                routes: [{ name: 'Utama' }],
              },
            },
          ],
        });
      }
    }
  };

  const dateOfBirth = user?.dob
    ? moment(user.dob.toDate ? user.dob.toDate() : user.dob).format(
        'DD MMMM YYYY',
      )
    : '';
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text
          style={{
            color: style.colors.text.primary,
            padding: 2,
            paddingTop: 8,
            fontSize: 22,
            fontWeight: 'bold',
          }}
        >
          Maklumat peribadi
        </Text>

        <TextInput
          label="Nama"
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
          // disabled={email ? true : false}
        />
        <TextInput
          label="No telefon"
          value={phoneNumber}
          style={styles.input}
          onChangeText={setPhoneNumber}
          mode="outlined"
          activeOutlineColor={style.colors.accent}
          outlineColor={style.colors.secondary}
          disabled={phoneNumber ? true : false}
        />

        <Text
          style={{
            color: style.colors.text.secondary,
            padding: 2,
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          Tarikh Lahir
        </Text>

        <View style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: style.colors.text.secondary, padding: 12 }}>
              {dateOfBirth}
            </Text>
            <Button mode="contained" onPress={() => setOpen(true)}>
              Pilih
            </Button>
          </View>
          <DatePicker
            modal
            title={'Pilih tarikh lahir'}
            confirmText="Sahkan"
            cancelText="Batal"
            open={open}
            onConfirm={(date) => {
              setOpen(false);
              setDob(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
            date={dob}
            mode={'date'}
            locale={'ms'}
            maximumDate={new Date(new Date().getFullYear() - 10, 11, 31)}
            minimumDate={new Date(new Date().getFullYear() - 90, 0, 1)}
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
          <Text
            style={{
              color: style.colors.text.secondary,
              padding: 2,
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            Adakah anda penghuni PPR?
          </Text>
          <RadioButton.Group onValueChange={handleRadioPress} value={isPPR}>
            <View style={{ flexDirection: 'row' }}>
              <RadioButton.Item label="Ya" value={true} />
              <RadioButton.Item label="Tidak" value={false} />
            </View>
          </RadioButton.Group>
        </View>

        {isPPR ? (
          <View>
            <View style={{ paddingVertical: 8 }}>
              <Text
                style={{
                  color: style.colors.text.primary,
                  padding: 4,
                  fontSize: 15,
                  fontWeight: 'bold',
                }}
              >
                PPR Padang Hiliran
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

            {/* select blok: A, B or C */}
            <View style={{ paddingVertical: 8 }}>
              <Text style={{ color: style.colors.text.secondary, padding: 2 }}>
                Blok
              </Text>
              <RadioButton.Group
                onValueChange={(value) =>
                  setAddress({ ...address, blockNo: value })
                }
                value={address.blockNo}
              >
                <View style={{ flexDirection: 'row' }}>
                  <RadioButton.Item label="A" value="A" />
                  <RadioButton.Item label="B" value="B" />
                  <RadioButton.Item label="C" value="C" />
                </View>
              </RadioButton.Group>
            </View>

            {/* floor */}
            <TextInput
              label="Tingkat"
              value={address.floorNo}
              onChangeText={(text) => setAddress({ ...address, floorNo: text })}
              style={styles.input}
              mode="outlined"
              activeOutlineColor={style.colors.accent}
              outlineColor={style.colors.secondary}
              keyboardType="numeric"
              ref={floorNoRef}
              onSubmitEditing={() => {
                unitNoRef.current.focus();
              }}
            />

            <TextInput
              label="No. Rumah"
              value={address.unitNo}
              onChangeText={(text) => setAddress({ ...address, unitNo: text })}
              style={styles.input}
              mode="outlined"
              activeOutlineColor={style.colors.accent}
              outlineColor={style.colors.secondary}
              keyboardType="numeric"
              ref={unitNoRef}
              onSubmitEditing={() => updateUser()}
            />

            {/* <TextInput
              label="Blok"
              value={address.blockNo}
              onChangeText={(text) => setAddress({ ...address, blockNo: text })}
              style={styles.input}
              mode="outlined"
              activeOutlineColor={style.colors.accent}
              outlineColor={style.colors.secondary}
            /> */}
          </View>
        ) : (
          <View>
            <TextInput
              label="No Unit"
              value={address.line1}
              onChangeText={(text) => setAddress({ ...address, line1: text })}
              style={styles.input}
              mode="outlined"
              activeOutlineColor={style.colors.accent}
              outlineColor={style.colors.secondary}
              onSubmitEditing={() => {
                line2Ref.current.focus();
              }}
            />
            <TextInput
              label="Jalan"
              ref={line2Ref}
              value={address.line2}
              onChangeText={(text) => setAddress({ ...address, line2: text })}
              style={styles.input}
              mode="outlined"
              activeOutlineColor={style.colors.accent}
              outlineColor={style.colors.secondary}
              onSubmitEditing={() => {
                postcodeRef.current.focus();
              }}
            />
            <TextInput
              label="Poskod"
              ref={postcodeRef}
              value={address.postcode}
              onChangeText={(text) =>
                setAddress({ ...address, postcode: text })
              }
              style={styles.input}
              mode="outlined"
              activeOutlineColor={style.colors.accent}
              outlineColor={style.colors.secondary}
              keyboardType="numeric"
              onSubmitEditing={() => {
                cityRef.current.focus();
              }}
            />
            <TextInput
              label="Bandar"
              ref={cityRef}
              value={address.city}
              onChangeText={(text) => setAddress({ ...address, city: text })}
              style={styles.input}
              mode="outlined"
              activeOutlineColor={style.colors.accent}
              outlineColor={style.colors.secondary}
            />
            <Picker
              selectedValue={address.state}
              onValueChange={(itemValue) =>
                setAddress({ ...address, state: itemValue })
              }
            >
              <Picker.Item label="Johor" value="johor" />
              <Picker.Item label="Kedah" value="kedah" />
              <Picker.Item label="Kelantan" value="kelantan" />
              <Picker.Item label="Melaka" value="melaka" />
              <Picker.Item label="Negeri Sembilan" value="negeri_sembilan" />
              <Picker.Item label="Pahang" value="pahang" />
              <Picker.Item label="Perak" value="perak" />
              <Picker.Item label="Perlis" value="perlis" />
              <Picker.Item label="Pulau Pinang" value="pulau_pinang" />
              <Picker.Item label="Sabah" value="sabah" />
              <Picker.Item label="Sarawak" value="sarawak" />
              <Picker.Item label="Selangor" value="selangor" />
              <Picker.Item label="Terengganu" value="terengganu" />
              <Picker.Item
                label="Wilayah Persekutuan Kuala Lumpur"
                value="kuala_lumpur"
              />
              <Picker.Item label="Wilayah Persekutuan Labuan" value="labuan" />
              <Picker.Item
                label="Wilayah Persekutuan Putrajaya"
                value="putrajaya"
              />
            </Picker>
          </View>
        )}
      </ScrollView>
      <TouchableOpacity onPress={updateUser} style={styles.button}>
        <Text style={styles.buttonText}>Simpan Profil</Text>
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
    backgroundColor: style.colors.tertiary,
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
