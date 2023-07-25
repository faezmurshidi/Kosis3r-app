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
  Linking,
  RefreshControl,
} from 'react-native';
import { Text, Card } from 'react-native-paper';
import CustomButton from '../components/CustomButton';
import style from '../styles';
import NearestCentre from '../components/NearestCentre';
import i18n from '../i18n';
import { AuthContext } from '../context/AuthContext';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Carousel, { Pagination } from 'react-native-snap-carousel';
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
  const [activeSlide, setActiveSlide] = useState(0);

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
    if (!user?.name) {
      navigation.navigate('EditProfile');
    }
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

  const handleLinkPress = (link) => {
    Linking.openURL(link);
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => item.link && handleLinkPress(item.link)}>
        <View
          style={{
            backgroundColor: style.colors.secondary,
            elevation: 2,
            borderRadius: 10,
            marginHorizontal: 10,
          }}
        >
          <Image
            source={{ uri: item.img }}
            style={{
              height: 300,
              borderRadius: 10,
              margin: 10,
              resizeMode: 'contain',
            }}
          />
          <Text
            style={{
              color: style.colors.text.primary,
              fontWeight: 'bold',
              fontSize: 16,
              margin: 10,
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              color: style.colors.text.secondary,
              fontSize: 14,
              padding: 10,
            }}
          >
            {item.body}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const pagination = () => {
    return (
      <Pagination
        dotsLength={news.length}
        activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor: 'transparent' }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: style.colors.tertiary,
        }}
        inactiveDotStyle={{
          backgroundColor: style.colors.gray,
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  };

  const userStatistic = () => {
    if (user?.stat?.totalWeight) {
      const totalWeight = user?.stat?.totalWeight;
      const co2saved = totalWeight * 0.23;
      return (
        <View style={styles.section}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <TouchableOpacity
                style={{ alignItems: 'center', paddingHorizontal: 6 }}
                onPress={goToAccount}
              >
                <FontAwesome5
                  name={'level-up-alt'}
                  color={style.colors.background.light.offwhite}
                  size={18}
                  padding={6}
                />
                <Text
                  style={{
                    color: style.colors.background.light.offwhite,
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}
                >
                  {Math.floor(totalWeight / 50) + 1}
                </Text>
                <Text variant="labelMedium">Tahap</Text>
              </TouchableOpacity>
            </View>
            {/* add seperator */}
            <View
              style={{
                height: '100%',
                width: 1,
                backgroundColor: style.colors.background.light.offwhite,
              }}
            />
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <TouchableOpacity
                style={{ alignItems: 'center', paddingHorizontal: 6 }}
                onPress={goToAccount}
              >
                <FontAwesome5
                  name={'recycle'}
                  color={style.colors.background.light.offwhite}
                  size={18}
                  padding={6}
                />
                <Text
                  style={{
                    color: style.colors.background.light.offwhite,
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}
                >
                  {totalWeight}Kg
                </Text>
                <Text variant="labelMedium">Dikitar Semula</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: '100%',
                width: 1,
                backgroundColor: style.colors.background.light.offwhite,
              }}
            />
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <TouchableOpacity
                style={{ alignItems: 'center', paddingHorizontal: 6 }}
                onPress={goToAccount}
              >
                <FontAwesome5
                  name={'tree'}
                  color={style.colors.background.light.offwhite}
                  size={18}
                  padding={6}
                />
                <Text
                  style={{
                    color: style.colors.background.light.offwhite,
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}
                >
                  {co2saved.toFixed(1)}Kg
                </Text>
                <Text variant="labelMedium">CO2 Jimat</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: style.colors.background.light.offwhite,
              marginTop: 8,
              borderRadius: 8,
              width: '100%',
            }}
          >
            <TouchableOpacity
              style={{ alignItems: 'center', paddingHorizontal: 6 }}
              onPress={goToAccount}
            >
              <Text variant="labelLarge">BAKI TERKUMPUL</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FontAwesome5 name={'money-bill-wave'} size={23} padding={6} />
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 25,
                  }}
                >
                  RM {user?.wallet?.toFixed(2) || 0}
                </Text>
              </View>
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
                style={{
                  alignItems: 'center',
                  fontWeight: 'bold',
                  paddingLeft: 2,
                }}
              >
                {i18n.t('Dashboard.greeting')}
                {user.name} {'\u{1F44B}'}
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
                color={style.colors.text.primary}
                size={20}
                paddingHorizontal={6}
              />
              <Text
                style={{
                  color: style.colors.text.primary,
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
              >
                Berita KOSIS
              </Text>
              {/* create line */}
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: style.colors.primaryDark,
                  marginLeft: 12,
                }}
              />
            </View>

            <Carousel
              data={news}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={Dimensions.get('window').width - 10}
              renderItem={renderItem}
              onSnapToItem={(index) => setActiveSlide(index)}
            />
            {pagination()}
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
    backgroundColor: style.colors.primaryDark,
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

    padding: 8,
    elevation: 12,
  },
  carouselContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
});

export default Dashboard;
