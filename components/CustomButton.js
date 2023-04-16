// CustomButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles';

const CustomButton = ({ onPress, title }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <LinearGradient
        colors={[styles.colors.primary, styles.colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={buttonStyles.button}
      >
        <Text
          style={[styles.typography.primaryButton, buttonStyles.buttonText]}
        >
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const buttonStyles = StyleSheet.create({
  button: {
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
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
});

export default CustomButton;
