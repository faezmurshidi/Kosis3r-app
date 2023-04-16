import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WasteCategoryCarousel from '../components/WasteCategoriesCarousel';

const PaymentScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Screen</Text>
      <WasteCategoryCarousel />
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
});

export default PaymentScreen;
