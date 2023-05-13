import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
  Button,
} from 'react-native';
import { TextInput, Text, Divider, Portal, Dialog } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { openPicker } from '@baronha/react-native-multiple-image-picker';
import i18n from '../i18n';
import style from '../styles';
import { generateTransactionId } from '../util';
import {
  createTransactionFirestore,
  getCurrentRate,
  saveImageToStorage,
} from '../firebase/firebaseUtils';
import { AuthContext } from '../App';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const TransactionsScreen = ({ route, navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [weight, setWeight] = useState('');
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const defaultCategory =
      i18n.t('recycleCategories', { returnObjects: true })[0]?.value || '';
    setSelectedCategory(defaultCategory);
  }, []);

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
        doneTitle: 'Done',
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

  const submit = async (currentRate, totalSale) => {
    setLoading(true);
    const txId = generateTransactionId('test');
    const imageUrl = await saveImageToStorage(txId, 'file://' + photo.path);

    const transaction = {
      id: txId,
      timestamp: Date.now(),
      centerId: 'test',
      imageUrl,
      status: 'pending',
      items: {
        category: selectedCategory,
        weight,
        price: totalSale,
        rate: currentRate,
      },
      userId: user.uid,
    };

    console.log('transaction', transaction);

    try {
      await createTransactionFirestore(transaction);
      setLoading(false); // Set loading state to false when the submit process is complete
    } catch (error) {
      setLoading(false); // Set loading state to false if there is an error during the submit process
      console.log('Error:', error);
    } finally {
      setIsModalVisible(true);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    navigation.pop(2);
  };

  console.log('selectedCategory', selectedCategory);
  const currentRate = todaysRates[selectedCategory] || 0;
  console.log('currentRate', currentRate);

  const totalSale = (currentRate * weight).toFixed(2);

  const nearestCenter = route.params?.nearestCenter;

  console.log('photo', photo);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {nearestCenter && (
          <View style={styles.header}>
            <View style={{ alignItems: 'center' }}>
              <FontAwesome5Icon
                name="warehouse"
                size={18}
                color={style.colors.accent}
                style={{ margin: 5, marginTop: 20 }}
              />
            </View>
            <View style={{ padding: 2 }}>
              <Text variant="labelLarge">Anda kini berada di</Text>
              <Text variant="titleMedium">{nearestCenter.fasiliti}</Text>
              <Text>{nearestCenter.alamat}</Text>
            </View>
          </View>
        )}
        <Text variant="labelLarge" style={{ marginBottom: 2 }}>
          Jenis Barang Kitar Semula
        </Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          {i18n
            .t('recycleCategories', { returnObjects: true })
            .map((category, index) => (
              <Picker.Item
                key={index}
                label={category.label}
                value={category.value}
              />
            ))}
        </Picker>
        <Text variant="labelLarge" style={{ marginBottom: 2 }}>
          Berat (KG)
        </Text>

        <TextInput
          placeholder="Weight (KG)"
          value={weight}
          onChangeText={setWeight}
          style={styles.input}
          keyboardType="numeric"
          mode="outlined"
          activeOutlineColor={style.colors.accent}
          outlineColor={style.colors.secondary}
        />

        {selectedCategory && (
          <View style={styles.todaysPrice}>
            <Text>Harga Hari Ini:</Text>
            <Text style={{ fontWeight: 'bold' }}>{currentRate}/g</Text>
          </View>
        )}
        <TouchableOpacity onPress={onPicker} style={styles.photoButton}>
          <Text style={styles.photoButtonText}>Tambah Gambar</Text>
        </TouchableOpacity>
        {photo && (
          <Image
            source={{ uri: 'file://' + photo.path }}
            style={styles.image}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalSale}>
          <Text>Jumlah Jualan</Text>
          <Text style={{ fontWeight: 'bold' }}>RM {totalSale}</Text>
        </View>
        <Divider />
        <TouchableOpacity
          onPress={() => submit(currentRate, totalSale)}
          style={[
            weight && photo && selectedCategory
              ? styles.doneButton
              : styles.disabledButton,
          ]}
          disabled={weight && photo && selectedCategory ? false : true}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.doneButtonText}>Selesai</Text>
          )}
        </TouchableOpacity>

        <Portal>
          <Dialog visible={isModalVisible} onDismiss={closeModal}>
            <Dialog.Title>Kitar Semula Berjaya</Dialog.Title>
            <Dialog.Actions style={{ alignSelf: 'center' }}>
              <Button
                onPress={closeModal}
                title="Okay"
                color={style.colors.primary}
              />
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: style.colors.background.light.offwhite,
    paddingTop: 2,
  },
  header: {
    padding: 12,
    backgroundColor: style.colors.background.light.lightGray,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: 'row',
  },
  todaysPrice: {
    alignItems: 'center',
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
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  image: {
    width: '80%',
    height: 150,
    resizeMode: 'contain',
    marginTop: 16,
    borderRadius: 8,
  },
  scrollViewContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    backgroundColor: style.colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 14,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  doneButton: {
    backgroundColor: style.colors.primary,
    width: '80%',
    paddingVertical: 16,
    margin: 14,
    borderRadius: 12,
  },
  doneButtonText: {
    color: style.colors.background.light.offwhite,
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: style.colors.background.light.lightGray,
    width: '80%',
    paddingVertical: 16,
    margin: 14,
    borderRadius: 12,
    // additional styles for the disabled button
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionsScreen;
