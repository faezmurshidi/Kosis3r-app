import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
  SectionList,
  RefreshControl,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../context/AuthContext';
import style from '../styles';
import { fetchUserFromFirestore } from '../firebase/firebaseUtils';
import { Avatar } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import i18n from '../i18n';
import moment from 'moment';

const ProfileScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [language, setLanguage] = useState(i18n.language);

  console.log(i18n);

  const fetchUserDetails = async () => {
    setRefreshing(true);
    fetchUserFromFirestore(user, setUser);
    setRefreshing(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevState) => !prevState);
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ms' : 'en');
    setLanguage(i18n.language);
    // Reset all screens to the initial screen
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }], // Replace 'MainTabs' with the name of your main screen component
      }),
    );
  };

  const dateOfBirth = user?.dob
    ? moment(user.dob.toDate ? user.dob.toDate() : user.dob).format(
        'DD MMMM YYYY',
      )
    : '';

  const address = user?.isPPR
    ? user?.address?.unitNo +
      ', ' +
      user?.address?.floorNo +
      ', ' +
      user?.address?.blockNo +
      ', ' +
      user?.ppr
    : user?.address?.line1 +
      ', ' +
      user?.address?.line2 +
      ', ' +
      user?.address?.postcode +
      ' ' +
      user?.address?.city +
      ', ' +
      user?.address?.state;

  const sections = [
    {
      title: i18n.t('Profile.userDetails'),
      data: [
        { title: i18n.t('Profile.name'), value: user?.name },
        { title: i18n.t('Profile.email'), value: user?.email },
        { title: i18n.t('Profile.phone'), value: user?.phoneNumber },
        { title: 'Alamat', value: address },
        { title: 'Tarikh Lahir', value: dateOfBirth },
        // {
        //   title: i18n.t('Profile.language'),
        //   value: language === 'en' ? 'English' : 'Bahasa',
        //   onPress: toggleLanguage,
        // },
      ],
    },
    {
      title: i18n.t('Profile.account'),
      data: [
        {
          title: i18n.t('Profile.editDetails'),
          icon: 'edit',
          onPress: () => navigation.navigate('EditProfile'),
        },
        // {
        //   title: 'Bank Account Details',
        //   icon: 'bank',
        //   onPress: () => navigation.navigate('EditProfile'),
        // },
      ],
    },
  ];

  const handleLogout = () => {
    auth().signOut();
    setUser(null);
  };

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  const renderSectionItem = ({ item }) => (
    <TouchableOpacity style={styles.sectionItem} onPress={item.onPress}>
      <View style={styles.sectionItemContent}>
        {item.icon && (
          <FontAwesome
            name={item.icon}
            size={24}
            style={styles.sectionItemIcon}
          />
        )}
        <View style={styles.sectionItemText}>
          <Text style={styles.sectionItemTitle}>{item.title}</Text>
          {item.value && (
            <Text style={styles.sectionItemValue}>{item.value}</Text>
          )}
        </View>
      </View>
      {!item.value && item.title !== 'Dark Mode' && (
        <FontAwesome
          name="angle-right"
          size={24}
          style={styles.sectionItemIcon}
        />
      )}
      {item.title === 'Dark Mode' && (
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
          color: 'black',
          padding: 18,
        }}
      >
        Profil
      </Text>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item + index}
        renderItem={renderSectionItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchUserDetails}
          />
        }
      />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>{i18n.t('Profile.logout')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: style.colors.background.light.offwhite,
  },
  container: {
    flex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: style.colors.text.primary,
  },
  sectionHeader: {
    backgroundColor: style.colors.background.light.offwhite,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: style.colors.text.primary,
  },
  sectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: style.colors.background.light.lightGray,
  },
  sectionItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionItemIcon: {
    marginRight: 20,
    color: style.colors.text.primary,
  },
  sectionItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: style.colors.text.primary,
  },
  sectionItemValue: {
    fontSize: 16,
    color: style.colors.text.secondary,
  },
  sectionItemText: {
    flexDirection: 'column',
  },
  logoutButton: {
    backgroundColor: style.colors.error,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: style.colors.background.light.offwhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
