import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
    },
  });

  const onSubmit = (data) => console.log('test', data);

  console.log('user@RegisterScreen', user);

  const [isPPR, setIsPPR] = useState(false);
  const [dob, setDob] = useState(new Date());
  const [ppr, setPpr] = useState(null);
  const [owner, setOwner] = useState(false); // ['owner', 'renter'
  const [sex, setSex] = useState('Lelaki');
  const [race, setRace] = useState('Melayu');
  const [citizenship, setCitizenship] = useState('Warganegara');
  const [householdNumber, setHouseholdNumber] = useState(0);
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

  const emailRef = React.createRef();
  const phoneNumberRef = React.createRef();
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
    if (user?.address) {
      setAddress(user.address);
    }

    if (user?.isPPR) {
      setIsPPR(user.isPPR);
    }
    if (user?.dob) {
      setDob(user.dob.toDate ? user.dob.toDate() : user.dob);
    }
    if (user?.sex) {
      setSex(user.sex);
    }
    if (user?.citizenship) {
      setCitizenship(user.citizenship);
    }
    if (user?.householdNumber) {
      setHouseholdNumber(user.householdNumber);
    }
    if (user?.owner) {
      setOwner(user.owner);
    }
    if (user?.race) {
      setRace(user.race);
    }
  }, [user]);

  const handleRadioPress = (value) => {
    setIsPPR(value);
  };

  const handleOwnerSelect = (value) => {
    setOwner(value);
  };

  const handleSexSelect = (value) => {
    setSex(value);
  };

  const handleCitizenshipSelect = (value) => {
    setCitizenship(value);
  };

  const handleOptionSelect = (option) => {
    setPpr(option.value);
  };

  const updateUser = async (data) => {
    try {
      // await user.updateProfile({ displayName: name });
      const userData = {
        uid: user.uid,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        sex,
        citizenship,
        race,
        dob,
        isPPR,
        owner,
        householdNumber,
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
            paddingVertical: 8,
            fontSize: 22,
            fontWeight: 'bold',
          }}
        >
          Maklumat peribadi
        </Text>

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Nama"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={styles.input}
              mode="outlined"
              textColor="black"
              activeOutlineColor={style.colors.accent}
              outlineColor={style.colors.darkGray}
              onSubmitEditing={() => {
                emailRef.current.focus();
              }}
            />
          )}
          name="name"
        />
        {errors.name && <Text style={styles.error}>* Mesti diisi</Text>}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              ref={emailRef}
              label="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={styles.input}
              mode="outlined"
              textColor="black"
              activeOutlineColor={style.colors.accent}
              outlineColor={style.colors.darkGray}
              onSubmitEditing={() => {
                phoneNumberRef.current.focus();
              }}
            />
          )}
          name="email"
        />
        {errors.email && <Text style={styles.error}>* Mesti diisi</Text>}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              ref={phoneNumberRef}
              label="No telefon"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
              textColor="black"
              activeOutlineColor={style.colors.accent}
              outlineColor={style.colors.darkGray}
              onSubmitEditing={() => {
                emailRef.current.focus();
              }}
            />
          )}
          name="phoneNumber"
        />
        {errors.phoneNumber && <Text style={styles.error}>* Mesti diisi</Text>}

        <Text
          style={{
            color: style.colors.text.secondary,
            padding: 2,
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          Jantina
        </Text>
        <RadioButton.Group onValueChange={handleSexSelect} value={sex}>
          <View style={{ flexDirection: 'row' }}>
            <RadioButton.Item label="Lelaki" value={'Lelaki'} />
            <RadioButton.Item label="Perempuan" value={'Perempuan'} />
          </View>
        </RadioButton.Group>

        <Text
          style={{
            color: style.colors.text.secondary,
            padding: 2,
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          Kerakyatan
        </Text>
        <RadioButton.Group
          onValueChange={handleCitizenshipSelect}
          value={citizenship}
        >
          <View style={{ flexDirection: 'row' }}>
            <RadioButton.Item label="Malaysia" value={'Warganegara'} />
            <RadioButton.Item label="Lain-lain" value={'Bukan Warganegara'} />
          </View>
        </RadioButton.Group>

        {citizenship === 'Warganegara' && (
          <View>
            <Text
              style={{
                color: style.colors.text.secondary,
                padding: 2,
                fontWeight: 'bold',
                fontSize: 16,
              }}
            >
              Bangsa
            </Text>
            <Picker
              selectedValue={race}
              onValueChange={(itemValue) => setRace(itemValue)}
            >
              <Picker.Item label="Melayu" value="Melayu" />
              <Picker.Item label="Cina" value="Cina" />
              <Picker.Item label="India" value="India" />
              <Picker.Item label="Lain-lain" value="Lain-lain" />
            </Picker>
          </View>
        )}

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
                  color: style.colors.text.secondary,
                  padding: 2,
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
              >
                Adakah anda pemilik atau penyewa PPR?
              </Text>
              <RadioButton.Group
                onValueChange={handleOwnerSelect}
                value={owner}
              >
                <View style={{ flexDirection: 'row' }}>
                  <RadioButton.Item label="Pemilik" value={true} />
                  <RadioButton.Item label="Penyewa" value={false} />
                </View>
              </RadioButton.Group>

              <TextInput
                label="Jumlah Isi Rumah"
                value={householdNumber}
                onChangeText={(text) => setHouseholdNumber(text)}
                style={styles.input}
                mode="outlined"
                textColor="black"
                activeOutlineColor={style.colors.accent}
                outlineColor={style.colors.darkGray}
                keyboardType="numeric"
                ref={floorNoRef}
                onSubmitEditing={() => {
                  unitNoRef.current.focus();
                }}
              />

              <Text
                style={{
                  color: style.colors.text.primary,
                  padding: 4,
                  fontSize: 18,
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
              textColor="black"
              activeOutlineColor={style.colors.accent}
              outlineColor={style.colors.darkGray}
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
              textColor="black"
              activeOutlineColor={style.colors.accent}
              outlineColor={style.colors.darkGray}
              keyboardType="numeric"
              ref={unitNoRef}
              onSubmitEditing={() => updateUser()}
            />
          </View>
        ) : (
          <View>
            <TextInput
              label="No Unit"
              value={address.line1}
              onChangeText={(text) => setAddress({ ...address, line1: text })}
              style={styles.input}
              mode="outlined"
              textColor="black"
              activeOutlineColor={style.colors.accent}
              outlineColor={style.colors.darkGray}
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
              textColor="black"
              activeOutlineColor={style.colors.accent}
              outlineColor={style.colors.darkGray}
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
              textColor="black"
              activeOutlineColor={style.colors.accent}
              outlineColor={style.colors.darkGray}
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
              textColor="black"
              activeOutlineColor={style.colors.accent}
              outlineColor={style.colors.darkGray}
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
      <TouchableOpacity
        onPress={handleSubmit(updateUser)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Simpan Profil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: style.colors.background.light.offwhite,
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
    backgroundColor: style.colors.background.light.offwhite,
    height: 50,
    borderRadius: 8,
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 16,
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
