/* eslint-disable react/no-unstable-nested-components */
// src/navigation/AppNavigation.tsx
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  HeaderBackButton,
} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/Login';
import EditProfile from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';
import ProfileScreen from '../screens/Profile';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DashboardScreen from '../screens/Dashboard';
import TransactionsScreen from '../screens/Transactions';
import HelpScreen from '../screens/Help';
import PaymentScreen from '../screens/Payments';
import RNBootSplash from 'react-native-bootsplash';
import VoucherScreen from '../screens/VoucherScreen';
import VoucherRedeemSuccess from '../screens/VoucherRedeemSuccess';
import styles from '../styles';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{
          headerShown: true,
          headerTitle: 'Lupa Kata Laluan',
          headerTitleStyle: {
            color: styles.colors.primary,
          },
          headerStyle: {
            backgroundColor: styles.colors.tertiary,
          },
          headerTintColor: styles.colors.primary,
        }}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
};

const DashboardStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Utama"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ title: 'Daftar Profil' }}
      />
      <Stack.Screen name="Jualan" component={TransactionsScreen} />
    </Stack.Navigator>
  );
};

const PaymentStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Akaun"
        component={PaymentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Voucher"
        component={VoucherScreen}
        options={{ title: 'Tebus Baucar' }}
      />
      <Stack.Screen
        name="VoucherRedeemSuccess"
        component={VoucherRedeemSuccess}
        options={{ title: 'Tebus Baucar Berjaya' }}
      />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: styles.colors.accent,
        tabBarInactiveTintColor: styles.colors.gray,
        tabBarStyle: {
          backgroundColor: styles.colors.primary,
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 8,
          height: 65, // Add custom height
          elevation: 14,
        },
      }}
    >
      <Tab.Screen
        name="Utama"
        component={DashboardStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name={'home'} color={color} size={size + 4} />
          ),
        }}
      />

      <Tab.Screen
        name="Akaun"
        component={PaymentStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="credit-card" color={color} size={size + 4} />
          ),
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" color={color} size={size + 4} />
          ),
        }}
      />
      <Tab.Screen
        name="Bantuan"
        component={HelpScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="headset" color={color} size={size + 4} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigation = () => {
  const { loggedIn } = useContext(AuthContext);
  console.log('loggedIn', loggedIn);

  return (
    <NavigationContainer onReady={() => RNBootSplash.hide()}>
      {loggedIn ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigation;
