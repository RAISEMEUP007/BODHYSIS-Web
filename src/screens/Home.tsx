import React, { useState, useEffect } from 'react';
import { View, Image, Platform, Linking, ScrollView } from 'react-native';
import { createDrawerNavigator, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useScreenSize } from '../common/hooks/UseScreenDimention';
import Dashboard from './dashboard/Dashboard';
import Inventory from './Inventory/Inventory';
import Settings from './settings/Settings';
import Customers from './customer/customers/Customers';
import Reservations from './reservations/Reservations';
import { logout } from '../api/Auth';
import Orders from './orders/Orders';
import Scheduler from './scheduler/Scheduler';
import { useHambugerMenuHistory } from '../common/hooks/UseHambugerMenuHistory';
import { appLinking } from '../common/constants/AppLinking';

const MainDrawer = ({ navigation }) => {

  const initialRouteName = '';

  const { isLargeScreen } = useScreenSize();
  const { addMenuHistory } = useHambugerMenuHistory();

  const Drawer = createDrawerNavigator();

  useEffect(() => {
    const handleDeepLinking = async () => {
      try {
        const url = await Linking.getInitialURL();
        if (url) {
          const route = url.replace(/.*?:\/\//g, '');
          if (route.toLowerCase().includes('dashboard')) {
            navigation.navigate('Dashboard');
          }else if (route.toLowerCase().includes('reservation')) {
            navigation.navigate('Reservation');
          }else if (route.toLowerCase().includes('delivery')) {
            navigation.navigate('Delivery Order');
          }else if (route.toLowerCase().includes('inventory')) {
            navigation.navigate('Inventory');
          }else if (route.toLowerCase().includes('customer')) {
            navigation.navigate('Customer');
          }else if (route.toLowerCase().includes('scheduler')) {
            navigation.navigate('Scheduler');
          }else if (route.toLowerCase().includes('settings')) {
            navigation.navigate('Settings');
          }
        }
      } catch (error) {
        console.error('Error fetching initial URL: ', error);
      }
    };
    handleDeepLinking();
  }, []);

  const DashboardScreen = ({ navigation }) => {
    return <Dashboard />;
  };

  const ReservationScreen = ({ navigation, route }) => {
    return <Reservations navigation={navigation} initialData={route.params} />;
  };

  const InventoryScreen = ({ navigation }) => {
    return <Inventory navigation={navigation} />;
  };

  const CustomerScreen = ({ navigation }) => {
    return <Customers navigation={navigation} />;
  };

  const SchedulerScreen = ({ navigation }) => {
    return <Scheduler navigation={navigation} />;
  };

  const SettingsScreen = ({ navigation }) => {
    return <Settings navigation={navigation} />;
  };

  const DeliveryOrderScreen = ({ navigation }) => {
    return <Orders navigation={navigation} />;
  };

  useEffect(()=>{
    addMenuHistory(initialRouteName);
  }, []);

  const DrawerContent = (props) => {
    const { navigation } = props;

    return (
      <ScrollView>
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
        />
        <DrawerItemList {...props} />
        <DrawerItem
          label="Log out"
          onPress={async () => {
            await logout(() => {});
            await AsyncStorage.setItem('access-token', '');
            navigation.navigate('Auth');
          }}
        />
      </ScrollView>
    );
  };

  return (
    <>
      <Drawer.Navigator
        initialRouteName={initialRouteName}
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          drawerType: Platform.OS == 'web' && isLargeScreen ? 'permanent' : 'front',
        }}
      >
        <Drawer.Screen
          name="Dashboard"
          component={DashboardScreen}
          listeners={{
            drawerItemPress: (e) => {
              addMenuHistory('Dashboard');
            },
          }}
          options={{
            drawerLabel: 'Dashboard',
            unmountOnBlur: true,
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="Reservation"
          component={ReservationScreen}
          listeners={{
            drawerItemPress: (e) => {
              addMenuHistory('Reservation');
            },
          }}
          options={{
            drawerLabel: 'Reservation',
            unmountOnBlur: true,
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="Delivery Order"
          component={DeliveryOrderScreen}
          listeners={{
            drawerItemPress: (e) => {
              addMenuHistory('Delivery Order');
            },
          }}
          options={{
            drawerLabel: 'Delivery Order',
            unmountOnBlur: true,
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="Inventory"
          component={InventoryScreen}
          listeners={{
            drawerItemPress: (e) => {
              addMenuHistory('Inventory');
            },
          }}
          options={{
            drawerLabel: 'Inventory',
            unmountOnBlur: true,
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="Customer"
          component={CustomerScreen}
          listeners={{
            drawerItemPress: (e) => {
              addMenuHistory('Customer');
            },
          }}
          options={{
            drawerLabel: 'Customer',
            unmountOnBlur: true,
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="Scheduler"
          component={SchedulerScreen}
          listeners={{
            drawerItemPress: (e) => {
              addMenuHistory('Scheduler');
            },
          }}
          options={{
            drawerLabel: 'Scheduler',
            unmountOnBlur: true,
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          listeners={{
            drawerItemPress: (e) => {
              addMenuHistory('Settings');
            },
          }}
          options={{
            drawerLabel: 'Settings',
            unmountOnBlur: true,
            headerShown: false,
          }}
        />
      </Drawer.Navigator>
    </>
  );
};

const Home = ({ navigation }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      setRefreshKey((prevKey) => prevKey + 1);
    });

    return unsubscribe();
  }, [navigation]);

  return <MainDrawer key={refreshKey} navigation={navigation} />;
};

export default Home;
