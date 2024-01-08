import React, { useState, useEffect } from 'react';
import { View, Text, Image, Platform } from 'react-native';
import { createDrawerNavigator, DrawerItemList, DrawerItem } from '@react-navigation/drawer';

import { useScreenSize } from '../common/hooks/UseScreenDimention';
import Dashboard from './Dashboard';
import Inventory from './Inventory/Inventory';
import Settings from './settings/Settings';
import Customers from './customer/customers/Customers';
import CreateReservation from './Inventory/reservations/CreateReservation';

const MainDrawer = ({ navigation }) => {
  const { isLargeScreen } = useScreenSize();

  const Drawer = createDrawerNavigator();

  const DashboardScreen = ({ navigation }) => {
    return <Dashboard />;
  };

  const InventoryScreen = ({ navigation }) => {
    return <Inventory navigation={navigation} />;
  };

  const CustomerScreen = ({ navigation }) => {
    return <Customers navigation={navigation} />;
  };

  const SettingsScreen = ({ navigation }) => {
    return <Settings navigation={navigation} />;
  };

  const DrawerContent = (props) => {
    const { navigation } = props;

    return (
      <>
        <DrawerItem
          label="#"
          onPress={() => navigation.navigate('Home')}
          icon={() => (
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Image source={require('../assets/icon.png')} style={{ width: 70, height: 70 }} />
            </View>
          )}
          style={{ marginTop: 20 }}
          labelStyle={{ color: 'black', fontWeight: 'bold' }}
          iconContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
        />
        <DrawerItemList {...props} />
        <DrawerItem label="Log out" onPress={() => navigation.navigate('Auth')} />
      </>
    );
  };

  return (
    <Drawer.Navigator
      initialRouteName="Inventory"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerType: Platform.OS == 'web' && isLargeScreen ? 'permanent' : 'front',
      }}
      options={{
        drawerLabel: 'Dashboard',
        drawerIcon: ({ focused, color, size }) => (
          <Icon
            name={focused ? 'menu-open' : 'menu-close'}
            size={size}
            color={color}
            onPress={() => {
              // Handle click event here
              console.log('Drawer icon clicked');
            }}
          />
        ),
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          drawerLabel: 'Dashboard',
          unmountOnBlur: true,
          headerShown: false,
        }}
        onPress={() => {
          console.log('ddd');
        }}
      />
      <Drawer.Screen
        name="Reservation"
        component={CreateReservation}
        options={{
          drawerLabel: 'Reservation',
          unmountOnBlur: true,
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          drawerLabel: 'Inventory',
          unmountOnBlur: true,
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Customer"
        component={CustomerScreen}
        options={{
          drawerLabel: 'Customer',
          unmountOnBlur: true,
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerLabel: 'Settings',
          unmountOnBlur: true,
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};

const Home = ({ navigation }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      setRefreshKey((prevKey) => prevKey + 1);
    });

    return unsubscribe();
  }, [navigation]); // Ensure that navigation is listed as a dependency

  return <MainDrawer key={refreshKey} navigation={navigation} />;
};

export default Home;
