import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import CustomButton from '../components/CustomButton';
import TimeBasedLottie from '../components/TimeBasedLottie';

const { width: screenWidth } = Dimensions.get('window');

const Dashboard = () => {
  const handlePress = () => {
    console.log('Button pressed');
  };
  const mockUserName = 'John';
  const mockPromos = [
    { id: 1, title: 'Promo 1' },
    { id: 2, title: 'Promo 2' },
    { id: 3, title: 'Promo 3' },
  ];
  const mockNearestRecyclingCenter = 'Recycling Center A';

  const renderPromoItem = ({ item }) => {
    return (
      <View style={styles.carouselItem}>
        <Text style={styles.carouselText}>{item.title}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greetingText}>Good morning, {mockUserName}!</Text>
      <CustomButton onPress={handlePress} title="Get Started" />
      <TimeBasedLottie />
      <Text style={styles.sectionTitle}>Promos & Marketing Banners</Text>

      <Carousel
        data={mockPromos}
        renderItem={renderPromoItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth * 0.8}
        inactiveSlideOpacity={0.6}
        inactiveSlideScale={0.85}
      />
      <Text style={styles.sectionTitle}>Nearest Recycling Center</Text>
      <Text style={styles.nearestRecyclingCenterText}>
        {mockNearestRecyclingCenter}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  carouselItem: {
    backgroundColor: '#1e88e5',
    borderRadius: 10,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselText: {
    color: 'white',
    fontSize: 18,
  },
  nearestRecyclingCenterText: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default Dashboard;
