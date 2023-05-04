import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { openPicker } from '@baronha/react-native-multiple-image-picker';
import i18n from '../i18n';

const TransactionsScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(
    i18n.t('recycleCategories')[0],
  );
  const [photo, setPhoto] = useState(null);

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
      <Text style={styles.title}>Transactions Screen</Text>

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
      <TouchableOpacity onPress={onPicker} style={styles.photoButton}>
        <Text>Select Photo</Text>
      </TouchableOpacity>
      {photo && <Image source={{ uri: photo.uri }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  picker: {
    width: '80%',
    height: 50,
  },
  photoButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 16,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 16,
  },
});

export default TransactionsScreen;
