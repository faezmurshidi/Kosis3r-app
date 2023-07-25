import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import style from '../styles';

import { Linking } from 'react-native';

const HelpScreen = () => {
  const helpNumber = '+60123630744';
  const handleWhatsAppPress = () => {
    const url = `whatsapp://send?phone=${helpNumber}&text=Halo%20Kosis3r!`;
    Linking.openURL(url);
  };

  const handleCallPress = () => {
    const url = `tel:${helpNumber}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dapatkan Bantuan</Text>
      <TouchableOpacity onPress={handleWhatsAppPress} style={styles.button}>
        <FontAwesome5 name="whatsapp" size={24} color="white" />
        <Text style={styles.buttonText}>Hubungi melalui WhatsApp</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleCallPress}
        style={[styles.button, { backgroundColor: style.colors.primary }]}
      >
        <FontAwesome5 name="phone" size={24} color="black" />
        <Text style={[styles.buttonText, { color: 'black' }]}>
          Hubungi Kami
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HelpScreen;

const styles = {
  container: {
    backgroundColor: style.colors.secondary,
    flex: 1,
    padding: 18,
  },
  title: {
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: style.colors.tertiary,
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 18,
    marginLeft: 12,
    color: 'white',
  },
};
