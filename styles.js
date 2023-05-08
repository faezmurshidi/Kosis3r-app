import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Colors
  // colors: {
  //   primary: '#4CAF50',
  //   secondary: '#8BC34A',
  //   tertiary: '#F5F5F5',
  //   text: '#333333',
  //   accent: '#FFC107',
  //   background: {
  //     light: {
  //       offwhite: '#F5F5F5',
  //       lightGray: '#E0E0E0',
  //       lightBeige: '#F5F5F5',
  //     },
  //     dark: {
  //       offBlack: '#333333',
  //       darkGray: '#424242',
  //       darkerGray: '#212121',
  //     },
  //   },
  // },

  colors: {
    primary: '#4CAF50',
    secondary: '#8BC34A',
    tertiary: '#FFFFFF',
    text: {
      primary: '#333333',
      secondary: '#5C5C5C',
      light: '#FFFFFF',
    },
    accent: '#FFC107',
    background: {
      light: {
        offwhite: '#FFFFFF',
        lightGray: '#F0F0F0',
        lightBeige: '#F5F5F5',
      },
      dark: {
        offBlack: '#333333',
        darkGray: '#424242',
        darkerGray: '#212121',
      },
    },
    error: '#F44336',
    success: '#81C784',
    info: '#2196F3',
    warning: '#FF9800',
  },

  // Typography
  typography: {
    h1: {
      fontFamily: 'Roboto-Bold',
      fontSize: 36,
    },
    h2: {
      fontFamily: 'Roboto-Medium',
      fontSize: 30,
    },
    h3: {
      fontFamily: 'Roboto-Medium',
      fontSize: 24,
    },
    h4: {
      fontFamily: 'Roboto-Regular',
      fontSize: 20,
    },
    paragraph: {
      fontFamily: 'Roboto-Regular',
      fontSize: 16,
    },
    secondaryText: {
      fontFamily: 'Roboto-Light',
      fontSize: 14,
    },
    caption: {
      fontFamily: 'Roboto-Regular',
      fontSize: 12,
    },
    primaryButton: {
      fontFamily: 'Roboto-Medium',
      fontSize: 16,
    },
    secondaryButton: {
      fontFamily: 'Roboto-Regular',
      fontSize: 16,
    },
    label: {
      fontFamily: 'Roboto-Medium',
      fontSize: 14,
    },
    inputText: {
      fontFamily: 'Roboto-Regular',
      fontSize: 16,
    },
    placeholder: {
      fontFamily: 'Roboto-Light',
      fontSize: 14,
    },
    menuItems: {
      fontFamily: 'Roboto-Medium',
      fontSize: 16,
    },
    submenuItems: {
      fontFamily: 'Roboto-Regular',
      fontSize: 14,
    },
    quotes: {
      fontFamily: 'OpenSans-Italic',
      fontSize: 18,
    },
    legalText: {
      fontFamily: 'OpenSans-Regular',
      fontSize: 12,
    },
  },
});

export default styles;
