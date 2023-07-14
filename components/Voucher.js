// Voucher.js
import React from 'react';
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  Text,
  StyleSheet,
  Platform,
  View,
  FlatList,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import style from '../styles';

const Voucher = ({ vouchers }) => {
  const TouchableComponent =
    Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

  const renderVoucherItem = ({ item, index }) => {
    return (
      <LinearGradient
        colors={['#B00A2C', 'white']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.voucherContainer}
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
          <Image source={{ uri: item.imageUrl }} style={styles.voucherImage} />
        </View>
      </LinearGradient>
    );
  };

  return (
    <View style={{ flex: 1, margin: 12 }}>
      <Text variant="titleSmall" style={{ marginHorizontal: 16 }}>
        Tebus Baucar
      </Text>
      <FlatList
        style={styles.transactionsList}
        data={vouchers}
        renderItem={renderVoucherItem}
        keyExtractor={(item) => item.id}
        // ListEmptyComponent={renderEmptyComponent}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={fetchVouchers} />
        // }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  voucherContainer: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: style.colors.background.light.gray,
    borderRadius: 8,
    marginBottom: 2,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderColor: style.colors.gray,
    borderWidth: 1,
  },
  voucherInfoContainer: {
    flex: 1,
  },
  voucherImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
  },
  voucherImage: {
    width: '100%',
    height: '100%',
  },
});

export default Voucher;
