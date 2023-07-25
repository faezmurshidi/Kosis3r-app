/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import style from '../styles';
import ConfettiCannon from 'react-native-confetti-cannon';

const SuccessBottomSheet = ({ txReceipt, navigation, modal }) => {
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

  const transactionToBank = async () => {
    try {
      //await updateTransactionPaymentMethodFirestore(txId, 'bank');
    } catch (error) {
      console.log('Error:', error);
    } finally {
      //closeBottomSheet
      bottomSheetModalRef.current?.close();
      modal(true);
    }
  };

  const transactionToWallet = () => {
    bottomSheetModalRef.current?.close();
    modal(true);
  };

  const backToHome = () => {
    bottomSheetModalRef.current?.close();
    navigation.pop(2);
  };

  const goToPayment = () => {
    bottomSheetModalRef.current?.close();
    navigation.navigate('Akaun');
  };

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

  if (!txReceipt) {
    return null;
  }

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
    >
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
            {txReceipt.center.fasiliti}. Berikut merupakan ringkasan transaksi:
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
            <Text>Kategori: {txReceipt.items.category}</Text>
            <Text>Berat: {txReceipt.items.weight}</Text>

            <Text>Jumlah: RM{txReceipt.items.price}</Text>
          </View>
          <Text
            variant="labelSmall"
            style={{ color: 'white', marginHorizontal: 6 }}
          >
            Transaksi anda sedang menunggu pengesahan. Anda boleh lihat status
            transaksi anda di tab "Akaun".
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
    </BottomSheetModal>
  );
};

export default SuccessBottomSheet;
