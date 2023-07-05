/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { Text, Card } from 'react-native-paper';
import CustomButton from '../components/CustomButton';
import style from '../styles';
import NearestCentre from '../components/NearestCentre';
import i18n from '../i18n';
import { AuthContext } from '../context/AuthContext';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Carousel from 'react-native-snap-carousel';
import {
  updateFCMToken,
  getNews,
  fetchUserFromFirestore,
} from '../firebase/firebaseUtils';
import logo from '../assets/logo.png';

const Dashboard = ({ navigation }) => {
  const { user, setUser } = useContext(AuthContext);
  const [news, setNews] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = async () => {
    const newsData = await getNews();
    setNews(newsData);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    fetchNews();
    await fetchUserFromFirestore(user, setUser);
    setRefreshing(false);
  };

  useEffect(() => {
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      console.log('Auth status:', authStatus);
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    };

    requestUserPermission();
  }, []);

  useEffect(() => {
    const onTokenRefreshListener = messaging().onTokenRefresh(async (token) => {
      console.log('New FCM token:', token);
      updateFCMToken(user.uid, token);
    });

    return () => {
      onTokenRefreshListener();
    };
  }, [user]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground message:', remoteMessage);
      // Show a local notification or update the UI
    });
    return () => {
      unsubscribe();
    };
  }, []);

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

  const userStatistic = () => {
    if (user?.stat?.totalWeight) {
      const totalWeight = user?.stat?.totalWeight;
      const co2saved = totalWeight * 0.5;
      return (
        <View style={styles.section}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <TouchableOpacity
              style={{ alignItems: 'center', paddingHorizontal: 6 }}
              onPress={goToAccount}
            >
              <FontAwesome5
                name={'money-bill-wave'}
                color={style.colors.background.light.offwhite}
                size={14}
                paddingHorizontal={6}
              />
              <Text
                style={{
                  color: style.colors.background.light.offwhite,
                  fontWeight: 'bold',
                }}
              >
                RM {user?.wallet || 0}
              </Text>
              <Text variant="labelSmall">Wallet</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <TouchableOpacity
              style={{ alignItems: 'center', paddingHorizontal: 6 }}
              onPress={goToAccount}
            >
              <FontAwesome5
                name={'recycle'}
                color={style.colors.background.light.offwhite}
                size={16}
                paddingHorizontal={6}
              />
              <Text
                style={{
                  color: style.colors.background.light.offwhite,
                  fontWeight: 'bold',
                }}
              >
                {totalWeight}kg
              </Text>
              <Text variant="labelSmall">Dikitar Semula</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <TouchableOpacity
              style={{ alignItems: 'center', paddingHorizontal: 6 }}
              onPress={goToAccount}
            >
              <FontAwesome5
                name={'tree'}
                color={style.colors.background.light.offwhite}
                size={16}
                paddingHorizontal={6}
              />
              <Text
                style={{
                  color: style.colors.background.light.offwhite,
                  fontWeight: 'bold',
                }}
              >
                {co2saved}g
              </Text>
              <Text variant="labelSmall">CO2 Jimat</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={style.colors.background.light.offwhite} // Change the background color of the status bar
        barStyle="dark-content" // Change the text/icons color (options: 'light-content', 'dark-content', or 'default')
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.profileSection}>
          <View style={styles.welcomeCard}>
            <Image
              source={logo}
              style={{
                height: 50,
                width: 50,
                marginLeft: 6,
              }}
              resizeMode="contain"
            />
            {user?.name && (
              <Text
                variant="titleLarge"
                style={{ alignItems: 'center', fontWeight: 'bold' }}
              >
                {i18n.t('Dashboard.greeting')}
                {user.name}
              </Text>
            )}
          </View>
          {userStatistic()}
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
            <View
              style={[
                { flexDirection: 'row', alignItems: 'center' },
                styles.sectionTitle,
              ]}
            >
              <FontAwesome5
                name={'newspaper'}
                color={style.colors.tertiary}
                size={20}
                paddingHorizontal={6}
              />
              <Text
                variant="titleMedium"
                style={{ color: style.colors.tertiary }}
              >
                {i18n.t('Dashboard.news')}
              </Text>
              {/* create line */}
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: style.colors.background.light.offwhite,
                  marginLeft: 12,
                }}
              />
            </View>

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
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileSection: {
    marginBottom: 4,
    backgroundColor: style.colors.background.light.offwhite,
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
    margin: 2,
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: style.colors.tertiary,
    borderRadius: 8,
    flexDirection: 'row',
    padding: 8,
  },
  carouselContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
});

export default Dashboard;
