import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { openPicker } from '@baronha/react-native-multiple-image-picker';
import i18n from '../i18n';
import style from '../styles';
import { generateTransactionId } from '../util';
import {
  createTransactionFirestore,
  getCurrentRate,
} from '../firebase/firebaseUtils';
import { AuthContext } from '../App';

const TransactionsScreen = ({ route }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [weight, setWeight] = useState('');
  const { user } = useContext(AuthContext);

  const todaysRates = {
    paper: 0.15,
    cardboard: 0.1,
    'plastic bottles': 0.2,
    'plastic containers': 0.1,
    'glass bottles': 0.25,
    'glass jars': 0.15,
    'aluminum cans': 0.3,
    'steel cans': 0.2,
    'tin cans': 0.1,
    electronics: 1,
    batteries: 0.5,
    textiles: 0.2,
    furniture: 5,
    'yard waste': 0.1,
    'food waste': 0.05,
    'metal scrap': 0.1,
    'ink cartridges': 0.5,
    'fluorescent bulbs': 0.75,
    appliances: 10,
  };

  const onPicker = async () => {
    try {
      const singleSelectedMode = true;

      const response = await openPicker({
        selectedAssets: photo,
        mediaType: 'image',
        doneTitle: 'Xong',
        singleSelectedMode,
        isCrop: true,
      });

      const crop = response.crop;

      if (crop) {
        response.path = crop.path;
        response.width = crop.width;
        response.height = crop.height;
      }

      setPhoto(response);
    } catch (e) {}
  };

  const submit = async () => {
    const txId = generateTransactionId('test');
    const mockItems = [
      {
        category: selectedCategory,
        weight,
        photo,
        price: 0.5,
        rate: 0.5,
      },
    ];

    const mocktransaction = {
      id: txId,
      timestamp: Date.now(),
      centerId: 'test',
      status: 'pending',
      items: mockItems,
      user,
    };

    await createTransactionFirestore(mocktransaction, 'test');
  };

  console.log('selectedCategory', selectedCategory);
  const currentRate = todaysRates[selectedCategory] || 0;
  console.log('currentRate', currentRate);

  const totalSale = (currentRate * weight).toFixed(2);

  const nearestCenter = route.params?.nearestCenter;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {nearestCenter && (
          <View style={styles.header}>
            <Text>Anda kini berada di</Text>
            <Text>{nearestCenter.fasiliti}</Text>
            <Text>{nearestCenter.alamat}</Text>
          </View>
        )}
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          {i18n
            .t('recycleCategories', { returnObjects: true })
            .map((category) => (
              <Picker.Item label={category.label} value={category.value} />
            ))}
        </Picker>
        <TextInput
          placeholder="Weight (KG)"
          value={weight}
          onChangeText={setWeight}
          style={styles.input}
          keyboardType="numeric"
        />
        <View style={styles.todaysPrice}>
          <Text>Harga Hari Ini:</Text>
          <Text>{currentRate}</Text>
        </View>
        <TouchableOpacity onPress={onPicker} style={styles.photoButton}>
          <Text style={styles.photoButtonText}>Tambah Gambar</Text>
        </TouchableOpacity>
        {photo && <Image source={{ uri: photo.uri }} style={styles.image} />}
      </ScrollView>
      <TouchableOpacity onPress={submit} style={styles.doneButton}>
        <View style={styles.totalSale}>
          <Text>Jumlah Jualan:</Text>
          <Text>RM {totalSale}</Text>
        </View>
        <Text style={styles.doneButtonText}>Selesai</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: style.colors.background.light.offwhite,
    paddingTop: 30,
  },
  todaysPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
  },
  title: {
    ...style.typography.title,
    color: style.colors.text.primary,
    marginBottom: 20,
  },
  picker: {
    width: '80%',
    height: 50,
    backgroundColor: style.colors.background.light.lightGray,
    borderRadius: 8,
    marginBottom: 20,
  },
  input: {
    backgroundColor: style.colors.background.light.lightGray,
    width: '80%',
    height: 50,
    borderRadius: 8,
    marginBottom: 20,
  },
  photoButton: {
    backgroundColor: style.colors.primary,
    width: '80%',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  photoButtonText: {
    color: style.colors.background.light.offwhite,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  totalSale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginVertical: 20,
    backgroundColor: style.colors.primary,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 16,
    borderRadius: 8,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButton: {
    backgroundColor: style.colors.primary,
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: style.colors.background.light.offwhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionsScreen;
