import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const ProfileScreen = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevState) => !prevState);
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.profileImage}
        source={{
          uri: 'https://www.example.com/path/to/profile/image.jpg',
        }}
      />
      <Text style={styles.displayName}>John Doe</Text>
      <View style={styles.darkModeContainer}>
        <Text style={styles.darkModeLabel}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => auth().signOut()}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  darkModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  darkModeLabel: {
    marginRight: 8,
  },
  logoutButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 16,
  },
  logoutText: {
    color: '#fff',
  },
});

export default ProfileScreen;
