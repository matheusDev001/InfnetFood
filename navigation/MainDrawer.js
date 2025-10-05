import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ThemeContext } from '../App';

import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import CartScreen from '../screens/CartScreen';
import ConfigScreen from '../screens/ConfigScreen';


const Drawer = createDrawerNavigator();

export default function MainDrawer() {
  const { colors, isDarkMode } = useContext(ThemeContext);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        drawerStyle: {
          backgroundColor: colors.background,
        },
        drawerActiveTintColor: '#2196F3',
        drawerInactiveTintColor: colors.text,
      }}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Products" component={ProductsScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Cart" component={CartScreen} />
      <Drawer.Screen name="Checkout" component={CheckoutScreen} />
      <Drawer.Screen name="Config" component={ConfigScreen} />
    </Drawer.Navigator>
  );
}
