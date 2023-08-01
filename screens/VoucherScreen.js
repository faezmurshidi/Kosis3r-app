import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import style from '../styles';
import { Modal } from 'react-native-paper';
import {
  fetchVouchers,
  deleteVoucherCode,
  updateWalletFirestore,
} from '../firebase/firebaseUtils';
import CustomButton from '../components/CustomButton';

const VoucherScreen = ({ route, navigation }) => {
  const { user } = route.params;
  const [vouchers, setVouchers] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const handleConfirm = async () => {
    // Handle confirm logic here
    console.log('Confirmed!', selectedVoucher);
    //take one code from the voucher
    const code = selectedVoucher.code[0];
    //delete the code from the voucher
    await deleteVoucherCode(selectedVoucher.id, code);
    await updateWalletFirestore(user.uid, user.wallet - selectedVoucher.amount);

    setModalVisible(false);
    navigation.navigate('VoucherRedeemSuccess', {
      code,
    });
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'VoucherRedeemSuccess',
          params: { code, logoUrl: selectedVoucher.imageUrl },
        },
      ],
    });
  };

  const renderConfirmationModal = () => {
    if (selectedVoucher && user?.wallet >= selectedVoucher.amount) {
      return (
        <Modal
          visible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
          }}
          contentContainerStyle={styles.modalContainer}
          onBackdropPress={() => setModalVisible(false)}
        >
          <Text style={styles.modalTitle}>
            Adakah anda pasti mahu menebus baucar ini?
          </Text>
          <Text style={styles.modalText}>
            RM{selectedVoucher?.amount} akan ditolak dari baki terkumpul anda
          </Text>
          <CustomButton title="Sahkan" onPress={handleConfirm} />
        </Modal>
      );
    } else {
      return (
        <Modal
          visible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
          }}
          contentContainerStyle={styles.modalContainer}
          onBackdropPress={() => setModalVisible(false)}
        >
          <Text style={styles.modalTitle}>
            Baki terkumpul anda tidak mencukupi untuk menebus baucar ini.
          </Text>
          <Text style={styles.modalText}>
            Sila lakukan jualan kitar semula untuk menambah baki terkumpul anda.
          </Text>
          <CustomButton
            title="Kembali"
            onPress={() => setModalVisible(false)}
          />
        </Modal>
      );
    }
  };
  const fetchVoucherData = async () => {
    setRefreshing(true);
    const data = await fetchVouchers();
    setVouchers(data);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchVoucherData();
  }, []);

  const renderEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Tiada Baucar </Text>
      </View>
    );
  };

  const renderVoucherItem = ({ item }) => {
    if (item.quantity === 0) return null;
    return (
      <LinearGradient
        colors={['#B00A2C', 'white']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.voucherContainer}
      >
        <TouchableOpacity
          style={{ flex: 1, flexDirection: 'row' }}
          onPress={() => {
            setModalVisible(true);
            setSelectedVoucher(item);
          }}
        >
          <View style={styles.voucherInfoContainer}>
            <View style={{ flex: 1 }}>
              <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
                {item.title}
              </Text>
              <Text style={{ color: style.colors.gray, fontSize: 13 }}>
                {item.description}
              </Text>
            </View>
            <View style={{ flex: 1, marginTop: 4 }}>
              <Text style={{ color: style.colors.gray, fontSize: 10 }}>
                Sah sehingga
              </Text>
              <Text
                style={{
                  color: style.colors.text.primary,
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
              >
                {item.expiry}
              </Text>
            </View>
          </View>

          <View style={styles.voucherImageContainer}>
            <Text
              style={{
                color: style.colors.text.accent,
                fontSize: 14,
                fontWeight: 'bold',
              }}
            >
              Baucer tersedia : {item.quantity}x
            </Text>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.voucherImage}
            />
          </View>
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={vouchers}
        renderItem={renderVoucherItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchVoucherData}
          />
        }
      />
      {renderConfirmationModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  voucherContainer: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 4,
  },
  voucherInfoContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  voucherImageContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  voucherImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default VoucherScreen;
