import React, { useContext } from 'react';
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
} from 'react-native';
import auth from '@react-native-firebase/auth';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../App';
import style from '../styles';

const ProfileScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const { setUser } = useContext(AuthContext);

  const toggleDarkMode = () => {
    setIsDarkMode((prevState) => !prevState);
  };
  const user = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+60123456789',
  };

  const sections = [
    {
      title: 'User Details',
      data: [
        { title: 'Name', value: user.name },
        { title: 'Email', value: user.email },
        { title: 'Phone', value: user.phone },
      ],
    },
    {
      title: 'Account',
      data: [
        {
          title: 'Edit Details',
          icon: 'edit',
          onPress: () => navigation.navigate('EditProfile'),
        },
        { title: 'Dark Mode', icon: 'gear' },
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
            <Text style={styles.sectionItemTitle}>{item.value}</Text>
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
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profileContainer}>
          <Image
            style={styles.profileImage}
            source={{
              uri: 'https://www.example.com/path/to/profile/image.jpg',
            }}
          />
          <Text style={styles.displayName}>{user.name}</Text>
        </View>
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item + index}
          renderItem={renderSectionItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={false}
        />
      </ScrollView>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
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
