/* eslint-disable react-native/no-inline-styles */
import React, { useContext } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Text } from 'react-native-paper';
import CustomButton from '../components/CustomButton';
import style from '../styles';
import NearestCentre from '../components/NearestCentre';
import i18n from '../i18n';
import { AuthContext } from '../App';

const Dashboard = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  console.log('user', user);
  const handlePress = () => {
    navigation.navigate('Jualan');
  };

  const goToAccount = () => {
    navigation.navigate('Akaun');
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={style.colors.secondary} // Change the background color of the status bar
        barStyle="light-content" // Change the text/icons color (options: 'light-content', 'dark-content', or 'default')
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Text
            variant="headlineLarge"
            style={{ margin: 4, color: style.colors.primary }}
          >
            KitaKitar
          </Text>
          <View style={styles.welcomeCard}>
            <Text variant="titleMedium" style={{ alignSelf: 'center' }}>
              Selamat Datang, {user.displayName}!
            </Text>
            <Text
              variant="bodySmall"
              style={{
                alignSelf: 'center',
                fontWeight: 'bold',
                color: style.colors.background.light.offwhite,
              }}
            >
              Level 1 | 65.8KG Dikitar Semula | 1.3 tan CO2 Dijimatkan{' '}
            </Text>
            <View style={styles.section}>
              <Text variant="titleMedium">{i18n.t('Dashboard.balance')}</Text>
              <Text variant="headlineSmall" style={{ color: 'white' }}>
                RM 35
              </Text>
            </View>
          </View>
        </View>

        {/* nearest recycling centre */}

        <NearestCentre />
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <View style={{ flex: 1 }}>
            <CustomButton
              onPress={handlePress}
              title="Jualan"
              icon={'recycle'}
            />
          </View>
          <View style={{ flex: 1 }}>
            <CustomButton
              onPress={goToAccount}
              title="Akaun"
              icon={'file-invoice'}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: style.colors.background.light.offwhite,
  },
  welcomeCard: {
    backgroundColor: '#ACCEF7',
    padding: 6,
    borderRadius: 9,
    marginTop: 4,
  },
  profileSection: {
    marginBottom: 16,
  },
  greetingText: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: style.colors.text.primary,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    color: style.colors.text.primary,
  },
  carouselItem: {
    backgroundColor: style.colors.primary,
    borderRadius: 10,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselText: {
    color: style.colors.background.light.offwhite,
  },
  nearestRecyclingCenterText: {
    padding: 8,
    color: style.colors.text.secondary,
    alignSelf: 'center',
  },
  section: {
    marginTop: 8,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: style.colors.background.light.lightBlue,
    borderRadius: 8,
  },
});

export default Dashboard;
