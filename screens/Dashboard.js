/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Card, Text } from 'react-native-paper';
import Carousel from 'react-native-snap-carousel';
import CustomButton from '../components/CustomButton';
import TimeBasedLottie from '../components/TimeBasedLottie';
import kosiscentre from '../assets/pusatkosis.json';
import NearestCentre from '../components/NearestCentre';

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

  kosiscentre.forEach((state) => {
    console.log('test', state);
  });

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#E0E0E0" // Change the background color of the status bar
        barStyle="light-content" // Change the text/icons color (options: 'light-content', 'dark-content', or 'default')
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Text variant="headlineLarge" style={{ margin: 4 }}>
            KitaKitar
          </Text>
          <View
            style={{
              backgroundColor: '#87CEEB',
              padding: 6,
              borderRadius: 9,
              marginTop: 4,
            }}
          >
            <Text variant="titleMedium">Selamat Datang, {mockUserName}!</Text>
            <Text variant="bodySmall">
              Level 1 | 65.8KG Dikitar Semula | 1.3 tan CO2 Dijimatkan{' '}
            </Text>
            <View style={styles.section}>
              <Text variant="titleMedium">Baki Semasa</Text>
              <Text variant="headlineSmall">RM 35</Text>
            </View>
          </View>
        </View>

        {/* nearest recycling centre */}

        <NearestCentre />
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <View style={{ flex: 1 }}>
            <CustomButton onPress={handlePress} title="Jualan" />
          </View>
          <View style={{ flex: 1 }}>
            <CustomButton onPress={handlePress} title="Akaun" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Promos & Marketing Banners</Text>

        <Carousel
          data={mockPromos}
          renderItem={renderPromoItem}
          sliderWidth={screenWidth}
          itemWidth={screenWidth * 0.8}
          inactiveSlideOpacity={0.6}
          inactiveSlideScale={0.85}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    color: '#4A4A4A',
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
    padding: 8,
    color: '#2C2C2C',
    alignSelf: 'center',
  },
  section: {
    marginTop: 8,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#AFEEEE',
    borderRadius: 8,
  },
});

export default Dashboard;
