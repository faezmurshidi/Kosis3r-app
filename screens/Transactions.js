/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
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
  updateTransactionPaymentMethodFirestore,
} from '../firebase/firebaseUtils';
import { AuthContext } from '../context/AuthContext';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import CustomButton from '../components/CustomButton';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import ConfettiCannon from 'react-native-confetti-cannon';
import Modal from 'react-native-modal';
import moment from 'moment';

const TransactionsScreen = ({ route, navigation }) => {
  const nearestCenter = route.params?.nearestCenter;
  const category = i18n.t('recycleCategories', { returnObjects: true });
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [weight, setWeight] = useState(0);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rate, setRate] = useState(0);
  const [txReceipt, setTxReceipt] = useState(null);

  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['65%', '75%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  useEffect(() => {
    const getRate = async () => {
      const latestRate = await getCurrentRate('default');
      console.log('latestRate', latestRate);
      setRate(latestRate);
    };

    getRate();
  }, []);

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

  const renderSuccessModal = () => (
    <Modal
      isVisible={isModalVisible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={500}
      animationOutTiming={500}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={500}
    >
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 10,
          padding: 20,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
          Transaksi berjaya!
        </Text>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 12,
            width: '100%',
          }}
        >
          <TouchableOpacity
            onPress={() => closeModal()}
            style={{
              backgroundColor: style.colors.accent,
              borderRadius: 10,
              paddingVertical: 12,
              paddingHorizontal: 20,
              justifyItem: 'center',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Transaksi Baru
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => backToHome()}
            style={{
              backgroundColor: style.colors.tertiaryDark,
              borderRadius: 10,
              paddingVertical: 12,
              justifyItem: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              Kembali ke laman utama
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const submit = async (currentRate, totalSale) => {
    setLoading(true);
    const transactionId = generateTransactionId(nearestCenter.id);

    try {
      let resized = await ImageResizer.createResizedImage(
        photo.path,
        photo.width / 2,
        photo.height / 2,
        'JPEG',
        50, // reduce quality to compress image
        0,
        undefined,
      );

      console.log('resized:', resized);

      const imageUrl = await saveImageToStorage(transactionId, resized.uri);
      console.log('imageUrl:', imageUrl);
      const transaction = {
        id: transactionId,
        timestamp: Date.now(),
        center: nearestCenter,
        imageUrl,
        status: 'pending', // approved, pending, rejected
        paymentMethod: 'wallet', //default
        items: {
          category: category[selectedCategory].id,
          weight: Number(weight),
          price: totalSale,
          rate: currentRate,
        },
        user: user,
      };

      try {
        await createTransactionFirestore(transaction);
        setLoading(false); // Set loading state to false when the submit process is complete
      } catch (error) {
        setLoading(false); // Set loading state to false if there is an error during the submit process
        console.log('Error:', error);
      } finally {
        setTxReceipt(transaction);
        //clear form
        setPhoto(null);
        setWeight(0);
        setSelectedCategory(0);

        handlePresentModalPress();
      }
    } catch (error) {
      console.log('Unable to resize the photo', error);
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const currentRate = category[selectedCategory].id
    ? rate[category[selectedCategory].id]
    : null;

  const totalSale = (currentRate * weight).toFixed(2);

  const transactionToBank = async () => {
    try {
      await updateTransactionPaymentMethodFirestore(txReceipt.id, 'bank');
    } catch (error) {
      console.log('Error:', error);
    } finally {
      //closeBottomSheet
      bottomSheetModalRef.current?.close();
      setIsModalVisible(true);
    }
  };

  const transactionToWallet = () => {
    bottomSheetModalRef.current?.close();
    setIsModalVisible(true);
  };

  const backToHome = () => {
    bottomSheetModalRef.current?.close();
    navigation.pop(2);
  };

  const goToPayment = () => {
    bottomSheetModalRef.current?.close();
    navigation.navigate('Akaun');
  };

  // console.log('photo', photo);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
        opacity={0.7}
      >
        <ConfettiCannon
          count={100}
          origin={{ x: -10, y: 0 }}
          autoStart={true}
          fadeOut={true}
          fallSpeed={2000}
          colors={[
            style.colors.error,
            style.colors.secondary,
            style.colors.tertiary,
          ]}
        />
      </BottomSheetBackdrop>
    ),
    [],
  );

  return (
    <BottomSheetModalProvider>
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
          <Text variant="labelLarge" style={{ marginBottom: 4 }}>
            Jenis Barang Kitar Semula
          </Text>
          <Picker
            selectedValue={category[selectedCategory].id}
            onValueChange={(value, index) => {
              setSelectedCategory(index);
            }}
            style={styles.picker}
          >
            {category.map((list, index) => {
              return (
                <Picker.Item key={index} label={list.label} value={list.id} />
              );
            })}
          </Picker>
          <Text variant="labelLarge" style={{ marginBottom: 2 }}>
            Berat (KG)
          </Text>

          <TextInput
            placeholder="Berat (KG)"
            value={weight}
            onChangeText={(value) => setWeight(value)}
            style={styles.input}
            keyboardType="numeric"
            mode="outlined"
            activeOutlineColor={style.colors.accent}
            outlineColor={style.colors.secondary}
          />

          {/* {category[selectedCategory] && (
            <View style={styles.todaysPrice}>
              <Text>Kadar Hari Ini:</Text>
              <Text style={{ fontWeight: 'bold' }}>RM{currentRate} per KG</Text>
            </View>
          )} */}
          <TouchableOpacity onPress={onPicker} style={styles.photoButton}>
            <Text style={styles.photoButtonText}>Tambah Gambar</Text>
          </TouchableOpacity>
          {photo && (
            <Image
              source={{ uri: 'file://' + photo.path }}
              style={styles.image}
            />
          )}
          {/* image info */}
          <View style={styles.imageInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome5Icon
                name="info-circle"
                size={18}
                color={style.colors.accent}
                style={{ margin: 5 }}
              />
              <Text variant="labelSmall" style={{ color: style.colors.accent }}>
                Sila pastikan bacaan penimbang serta barang kitar semula masuk
                di dalam gambar
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.totalSale}>
            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>
              Jumlah Jualan
            </Text>
            <Text style={{ fontWeight: 'bold', fontSize: 30 }}>
              RM {totalSale}
            </Text>
          </View>
          <Divider />
          <TouchableOpacity
            onPress={() => submit(currentRate, totalSale)}
            // onPress={handlePresentModalPress}
            style={[
              weight && photo ? styles.doneButton : styles.disabledButton,
            ]}
            disabled={weight && photo ? false : true}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.doneButtonText}>Selesai</Text>
            )}
          </TouchableOpacity>
        </View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backdropComponent={renderBackdrop}
        >
          {txReceipt && (
            <View style={{ margin: 12 }}>
              <View
                style={{
                  padding: 8,
                  backgroundColor: style.colors.tertiary,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    marginBottom: 10,
                    alignSelf: 'center',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}
                >
                  Kitar Semula Berjaya 🎉
                </Text>
                <Text style={{ color: 'white', marginHorizontal: 6 }}>
                  Anda telah berjaya menjual barang kitar semula kepada{' '}
                  {txReceipt.center.fasiliti}. Berikut merupakan ringkasan
                  transaksi:
                </Text>

                <View
                  style={{
                    margin: 4,
                    padding: 8,
                    backgroundColor: style.colors.primary,
                    elevation: 2,
                    borderRadius: 8,
                    marginVertical: 12,
                  }}
                >
                  <Text style={{ color: 'gray' }}>{txReceipt.id}</Text>
                  {/* <Text>
                  Kategori: {category[txReceipt.items.category].label}
                </Text> */}
                  <Text>Berat: {txReceipt.items.weight}Kg</Text>
                  <Text>
                    Masa:{' '}
                    {moment(txReceipt.timestamp).format('D MMMM YYYY hh:mm a')}
                  </Text>

                  <Text>Jumlah: RM{txReceipt.items.price}</Text>
                </View>
                <Text
                  variant="labelSmall"
                  style={{ color: 'white', marginHorizontal: 6 }}
                >
                  Transaksi anda sedang menunggu pengesahan. Anda boleh lihat
                  status transaksi anda di tab "Akaun".
                </Text>
              </View>
              <Text style={{ alignSelf: 'center', marginVertical: 12 }}>
                Pilih cara untuk menerima wang anda
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}
              >
                <TouchableOpacity
                  onPress={() => transactionToBank()}
                  style={{
                    backgroundColor: style.colors.accent,
                    borderRadius: 10,
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    justifyItem: 'center',
                    alignItems: 'center',
                    width: '46%',
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    🏦 Bayaran Terus
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => transactionToWallet()}
                  style={{
                    backgroundColor: style.colors.tertiaryDark,
                    borderRadius: 10,
                    paddingVertical: 12,
                    justifyItem: 'center',
                    alignItems: 'center',
                    width: '46%',
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  >
                    Simpan 💰
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </BottomSheetModal>
        {renderSuccessModal()}
      </View>
    </BottomSheetModalProvider>
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
    backgroundColor: style.colors.tertiary,
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
    alignContent: 'center',
    width: '80%',
  },
  image: {
    width: '80%',
    height: 250,
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
    backgroundColor: style.colors.tertiary,
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
  imageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    padding: 8,
  },
});

export default TransactionsScreen;
