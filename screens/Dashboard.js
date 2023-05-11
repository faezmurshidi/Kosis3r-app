/* eslint-disable react-native/no-inline-styles */
import React, { useContext } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Text, Card } from 'react-native-paper';
import CustomButton from '../components/CustomButton';
import style from '../styles';
import NearestCentre from '../components/NearestCentre';
import i18n from '../i18n';
import { AuthContext } from '../App';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Carousel from 'react-native-snap-carousel';

const Dashboard = ({ navigation }) => {
  const { user, news } = useContext(AuthContext);
  console.log('user@AuthContext', user);
  console.log('news@AuthContext', news);
  const handlePress = (nearestCenter) => {
    navigation.navigate('Jualan', { nearestCenter: nearestCenter });
  };

  const goToAccount = () => {
    navigation.navigate('Akaun');
  };

  const renderItem = ({ item, index }) => {
    return (
      <Card>
        <Card.Cover source={{ uri: item.img }} />
        <Card.Content>
          <Text>{item.body}</Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={style.colors.gray} // Change the background color of the status bar
        barStyle="dark-content" // Change the text/icons color (options: 'light-content', 'dark-content', or 'default')
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          {/* <Text
            variant="headlineLarge"
            style={{ margin: 4, color: style.colors.primary }}
          >
            KitaKitar
          </Text> */}
          <View style={styles.welcomeCard}>
            <Text variant="headlineSmall" style={{ alignSelf: 'center' }}>
              Selamat Datang, {user.name}
            </Text>
            <Text
              variant="bodySmall"
              style={{
                alignSelf: 'center',
                fontWeight: 'bold',
                color: style.colors.text.secondary,
              }}
            >
              Level 1 | 65.8KG Dikitar Semula | 1.3 tan CO2 Dijimatkan{' '}
            </Text>
            <TouchableOpacity style={styles.section} onPress={goToAccount}>
              <Text variant="titleMedium">{i18n.t('Dashboard.balance')}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome5
                  name={'money-bill-wave'}
                  color={style.colors.primary}
                  size={16}
                  paddingHorizontal={6}
                />
                <Text
                  variant="headlineSmall"
                  style={{ color: style.colors.secondary }}
                >
                  RM {user.wallet}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* nearest recycling centre */}

        <NearestCentre showMyLocation={false} onPress={handlePress} />

        {/* news */}

        {news && (
          <SafeAreaView
            style={{
              flex: 1,
              paddingTop: 8,
            }}
          >
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {i18n.t('Dashboard.news')}
            </Text>
            <Carousel
              data={news}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={Dimensions.get('window').width * 0.8}
              renderItem={renderItem}
            />
          </SafeAreaView>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: style.colors.background.light.offwhite,
  },
  welcomeCard: {
    padding: 6,
    marginTop: 4,
  },
  profileSection: {
    marginBottom: 4,
    backgroundColor: style.colors.gray,
    paddingBottom: 8,
  },
  greetingText: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 2,
    color: style.colors.gray,
  },
  sectionTitle: {
    fontWeight: 'bold',
    padding: 16,

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
    marginHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: style.colors.tertiary,
    borderRadius: 8,
  },
  carouselContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
});

export default Dashboard;
