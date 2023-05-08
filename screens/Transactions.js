import React, { useState } from 'react';
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

const TransactionsScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(
    i18n.t('recycleCategories')[0],
  );
  const [photo, setPhoto] = useState(null);
  const [weight, setWeight] = useState('');

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

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          {i18n
            .t('recycleCategories', { returnObjects: true })
            .map((category) => (
              <Picker.Item label={category} value={category} />
            ))}
        </Picker>
        <TextInput
          placeholder="Weight (KG)"
          value={weight}
          onChangeText={setWeight}
          style={styles.input}
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={onPicker} style={styles.photoButton}>
          <Text style={styles.photoButtonText}>Tambah Gambar</Text>
        </TouchableOpacity>
        <View style={styles.totalSale}>
          <Text>Jumlah Jualan:</Text>
          <Text>RM 0.00</Text>
        </View>
        {photo && <Image source={{ uri: photo.uri }} style={styles.image} />}
      </ScrollView>
      <TouchableOpacity onPress={() => {}} style={styles.doneButton}>
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
