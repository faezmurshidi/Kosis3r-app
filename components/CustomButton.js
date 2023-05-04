// CustomButton.js
import React from 'react';
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  Text,
  StyleSheet,
  Platform,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles';

const CustomButton = ({ onPress, title }) => {
  const TouchableComponent =
    Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

  const buttonContent = (
    <LinearGradient
      colors={[styles.colors.primary, styles.colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={buttonStyles.button}
    >
      <Text style={[styles.typography.primaryButton, buttonStyles.buttonText]}>
        {title}
      </Text>
    </LinearGradient>
  );

  return (
    <TouchableComponent onPress={onPress} useForeground>
      {Platform.OS === 'android' ? (
        <View style={buttonStyles.androidWrapper}>{buttonContent}</View>
      ) : (
        buttonContent
      )}
    </TouchableComponent>
  );
};

const buttonStyles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: styles.colors.tertiary,
  },
  androidWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default CustomButton;
