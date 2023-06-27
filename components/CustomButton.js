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

const CustomButton = ({ onPress, title, icon }) => {
  const TouchableComponent =
    Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

  const buttonContent = (
    <LinearGradient
      colors={[styles.colors.primary, styles.colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={buttonStyles.button}
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
        <Text
          style={[styles.typography.primaryButton, buttonStyles.buttonText]}
        >
          {title.toUpperCase()}
        </Text>
      </View>
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
    color: '#FFFFFF',
  },
  androidWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default CustomButton;
