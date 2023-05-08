// src/navigation/MainTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/Dashboard';
import ProfileScreen from '../screens/Profile';
import TransactionsScreen from '../screens/Transactions';
import PaymentScreen from '../screens/Payments';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#1e88e5',
        tabBarStyle: {
          backgroundColor: '#F5F5F5',
          borderTopWidth: 0,
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60, // Add custom height
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 10,
        },
      }}
    >
      <Tab.Screen
        name="Utama"
        component={DashboardScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name={'home'} color={color} size={size + 4} />
          ),
        }}
      />
      <Tab.Screen
        name="Jualan"
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="receipt" color={color} size={size + 4} />
          ),
        }}
      />
      <Tab.Screen
        name="Akaun"
        component={PaymentScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="credit-card" color={color} size={size + 4} />
          ),
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" color={color} size={size + 4} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;