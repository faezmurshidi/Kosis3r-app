import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CustomButton from '../components/CustomButton';

const VoucherRedeemSuccess = ({ route, navigation }) => {
  const { code, logoUrl } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Baucar Berjaya Ditebus</Text>
      <View style={styles.qrCodeContainer}>
        <QRCode
          value={code}
          size={200}
          logo={{
            uri: logoUrl,
          }}
        />
      </View>
      <Text style={styles.code}>{code}</Text>
      <View style={styles.attention}>
        <FontAwesome5 name="exclamation-triangle" size={20} color="red" />
        <Text style={{ marginLeft: 8 }}>
          Sila simpan tangkapan skrin ini untuk ditunjukkan kepada penjual. Kod
          ini tidak akan dijana semula.
        </Text>
      </View>
      <CustomButton
        title="Kembali ke Akaun"
        onPress={() => navigation.navigate('Akaun')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  qrCodeContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  code: {
    fontSize: 16,
    margin: 20,
  },
  attention: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    margin: 20,
    padding: 12,
    borderRadius: 8,
    borderColor: 'red',
    borderWidth: 1,
  },
});

export default VoucherRedeemSuccess;
