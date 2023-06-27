/* eslint-disable react/no-unstable-nested-components */
// src/navigation/AppNavigation.tsx
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/Login';
import EditProfile from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';
import ProfileScreen from '../screens/Profile';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DashboardScreen from '../screens/Dashboard';
import TransactionsScreen from '../screens/Transactions';
import PaymentScreen from '../screens/Payments';

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
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
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
      <Stack.Screen name="Jualan" component={TransactionsScreen} />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#1e88e5',
        tabBarActiveBackgroundColor: '#F5F5F5',
        tabBarStyle: {
          backgroundColor: '#F5F5F5',
          borderTopWidth: 0,
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60, // Add custom height
          elevation: 14,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 10,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
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
        component={PaymentScreen}
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
    </Tab.Navigator>
  );
};

const AppNavigation = () => {
  const { loggedIn } = useContext(AuthContext);
  console.log('loggedIn', loggedIn);

  return (
    <NavigationContainer>
      {loggedIn ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigation;
