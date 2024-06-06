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

const BankingDetails = ({ navigation }) => {
  const { user, setUser } = useContext(AuthContext);
  

  const bankList = [
    { label: 'AFFIN BANK BHD', value: 'PABB' },
    { label: 'ALLIANCE BANK MALAYSIA BHD', value: 'ALBB' },
    { label: 'AL RAJHI BANK', value: 'ARB' },
    { label: 'BANK ISLAM BHD', value: 'BIMB' },
    { label: 'BANK KERJASAMA RAKYAT MALAYSIA', value: 'BKRM' },
    { label: 'BANK MUAMALAT MALAYSIA BERHAD', value: 'BMMB' },
    { label: 'BANK OF AMERICA BHD', value: 'BOFA' },
    { label: 'BANK OF CHINA (M) BHD', value: 'BOCM' },
    { label: 'BANK PERTANIAN MALAYSIA BHD', value: 'AGRO' },
    { label: 'BANK SIMPANAN NASIONAL', value: 'BSNB' },
    { label: 'BIGPAY', value: 'BGPY' },
    { label: 'BNP PARIBAS MALAYSIA BERHAD', value: 'BNPM' },
    { label: 'BOOST', value: 'BOST' },
    { label: 'CIMB BANK BHD', value: 'CIMB' },
    { label: 'CHINA CONSTRUCTION BANK (MALAYSIA) BERHAD', value: 'CCB' },
    { label: 'CITIBANK BHD', value: 'CITI' },
    { label: 'DEUTSCHE BANK (M) BHD', value: 'DEUM' },
    { label: 'FINEXUS CARDS SDN BHD', value: 'FNXS' },
    { label: 'HONG LEONG BANK', value: 'HLBB' },
    { label: 'HONGKONG BANK MALAYSIA BHD', value: 'HSBC' },
    { label: 'INDUSTRIAL & COMMERCIAL BANK OF CHINA (M) BHD', value: 'ICBC' },
    { label: 'J.P. MORGAN CHASE BANK BHD', value: 'JPMC' },
    { label: 'KUWAIT FINANCE HOUSE', value: 'KFHB' },
    { label: 'MALAYAN BANKING BHD', value: 'MBBB' },
    { label: 'MBSB BANK BERHAD', value: 'MBSB' },
    { label: 'MIZUHO BANK (M) BERHAD', value: 'MHCB' },
    { label: 'MUFG BANK (MALAYSIA) BERHAD', value: 'MUFG' },
    { label: 'OCBC BANK (M) BHD', value: 'OCBC' },
    { label: 'PUBLIC BANK BHD', value: 'PBBB' },
    { label: 'RHB BANK BHD', value: 'RHBB' },
    { label: 'STANDARD CHARTERED BANK BHD', value: 'SCBB' },
    { label: 'SUMITOMO MITSUI BANK BHD', value: 'SMBC' },
    { label: 'TOUCH N GO EWALLET', value: 'TNGD' },
    { label: 'UNITED OVERSEAS BANK M BHD', value: 'UOBB' },
    { label: 'MERCHANTRADE', value: 'MASBMYNB' },
    { label: 'GXBANK', value: 'GXSPMYKL' },
  ];

  const [selectedBank, setSelectedBank] = useState(bankList[0].value);
  // const [bankAccount, setBankAccount] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      accountNumber: user?.bankDetails?.accountNumber || '',
    },
  });

  const onSubmit = (data) => console.log('test', data);

  

  
  const accountNumberRef = React.createRef();
  

  

  useEffect(() => {
    if (user?.bankDetails) {
      setSelectedBank(user.bankDetails.bank);
      
    }
  }, [user]);

 

  const updateUser = async (data) => {
    console.log('selectedBank', selectedBank);
    
    try {
      // await user.updateProfile({ displayName: name });
      const userData = {
        ...user,
        bankDetails: {
          bank: selectedBank,
          accountNumber: data.accountNumber,
        },
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
          Maklumat Perbankan
        </Text>

        <Text style={styles.label}>Pilih Bank:</Text>
      <Picker
        selectedValue={selectedBank}
        onValueChange={(itemValue) => setSelectedBank(itemValue)}
        style={styles.picker}
      >
        {bankList.map((bank) => (
          <Picker.Item key={bank.value} label={bank.label} value={bank.value} />
        ))}
      </Picker>


        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              ref={accountNumberRef}
              label="No Akaun"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
              textColor="black"
              activeOutlineColor={style.colors.accent}
              outlineColor={style.colors.darkGray}
             
            />
          )}
          name="accountNumber"
        />
        {errors.accountNumber && <Text style={styles.error}>* Mesti diisi</Text>}



   
      </ScrollView>
      <TouchableOpacity
        onPress={handleSubmit(updateUser)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Simpan Maklumat Perbankan</Text>
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
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  selectedBankText: {
    marginTop: 16,
    fontSize: 18,
  },
});

export default BankingDetails;
