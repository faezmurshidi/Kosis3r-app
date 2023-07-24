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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const CustomButton = ({ onPress, title, icon, disabled, style }) => {
  const TouchableComponent =
    Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

  const buttonContent = (
    <LinearGradient
      colors={
        disabled
          ? ['#A9A9A9', '#A9A9A9']
          : [styles.colors.tertiary, styles.colors.tertiary]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[buttonStyles.button, style]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {icon && (
          <FontAwesome5
            name={icon}
            color={'white'}
            size={16}
            paddingHorizontal={6}
          />
        )}
        <Text style={[styles.typography.label, buttonStyles.buttonText]}>
          {title.toUpperCase()}
        </Text>
      </View>
    </LinearGradient>
  );

  return (
    <TouchableComponent onPress={!disabled ? onPress : null} useForeground>
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
    paddingVertical: 8,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
  },
  androidWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default CustomButton;
