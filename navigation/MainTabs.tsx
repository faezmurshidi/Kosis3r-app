// src/navigation/MainTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/Dashboard';
import ProfileScreen from '../screens/Profile';
import TransactionsScreen from '../screens/Transactions';
import PaymentScreen from '../screens/Payments';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#1e88e5', // Update the active tint color
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 8,
          elevation: 10,
          borderRadius: 10,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name={'recycle'} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="receipt" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="credit-card" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
