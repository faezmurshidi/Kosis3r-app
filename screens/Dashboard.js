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
import logo from '../assets/header.png';

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
          <Image
            source={logo}
            style={{
              height: 60,
              width: 180,
              marginLeft: 6,
            }}
            resizeMode="contain"
          />
          <View style={styles.welcomeCard}>
            {user?.name && (
              <Text variant="headlineSmall" style={{ alignSelf: 'center' }}>
                {i18n.t('Dashboard.greeting')}
                {user.name}
              </Text>
            )}
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
                  color={style.colors.background.light.offwhite}
                  size={16}
                  paddingHorizontal={6}
                />
                <Text
                  variant="headlineSmall"
                  style={{ color: style.colors.background.light.offwhite }}
                >
                  RM {user?.wallet || 0}
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
            <View
              style={[
                { flexDirection: 'row', alignItems: 'center' },
                styles.sectionTitle,
              ]}
            >
              <FontAwesome5
                name={'newspaper'}
                color={style.colors.background.light.offwhite}
                size={20}
                paddingHorizontal={6}
              />
              <Text
                variant="titleMedium"
                style={{ color: style.colors.background.light.offwhite }}
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
    backgroundColor: '#6B9080',
  },
  welcomeCard: {
    padding: 6,
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
