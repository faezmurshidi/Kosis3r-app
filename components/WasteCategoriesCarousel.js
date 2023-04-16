// src/components/WasteCategoryCarousel.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const wasteCategories = [
  { name: 'Paper', under5kg: 'RM2', over5kg: 'RM2.20' },
  { name: 'Glass', under5kg: 'RM1.50', over5kg: 'RM1.70' },
  { name: 'Plastic', under5kg: 'RM3', over5kg: 'RM3.50' },
  { name: 'Metals', under5kg: 'RM4', over5kg: 'RM4.50' },
  { name: 'E-waste', under5kg: 'RM5', over5kg: 'RM6' },
  { name: 'Textiles', under5kg: 'RM1', over5kg: 'RM1.50' },
  { name: 'Batteries', under5kg: 'RM7', over5kg: 'RM8' },
  { name: 'Light bulbs', under5kg: 'RM2', over5kg: 'RM2.50' },
  { name: 'Organic waste', under5kg: 'RM0.50', over5kg: 'RM0.80' },
  {
    name: 'Construction and demolition waste',
    under5kg: 'RM3',
    over5kg: 'RM3.50',
  },
  { name: 'Hazardous waste', under5kg: 'RM10', over5kg: 'RM12' },
];

const WasteCategoryCard = ({ category }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{category.name}</Text>
    <Text style={styles.cardPrice}>
      <Text>&lt; 5kg:</Text> {category.under5kg}
    </Text>
    <Text style={styles.cardPrice}>
      <Text>&gt; 5Kg:</Text> {category.over5kg}
    </Text>
  </View>
);

const WasteCategoryCarousel = () => {
  const renderItem = ({ item }) => {
    return <WasteCategoryCard category={item} />;
  };

  return (
    <Carousel
      data={wasteCategories}
      renderItem={renderItem}
      sliderWidth={Dimensions.get('window').width}
      itemWidth={Dimensions.get('window').width * 0.8}
      containerCustomStyle={styles.carouselContainer}
    />
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 16,
  },
});

export default WasteCategoryCarousel;
