import React from 'react';
import { TouchableOpacity, Text, Linking } from 'react-native';

const NavigationButton = ({ location }) => {
  const openNavigationApp = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log("Can't open navigation app");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <TouchableOpacity onPress={openNavigationApp}>
      <Text>Take me there</Text>
    </TouchableOpacity>
  );
};

export default NavigationButton;
