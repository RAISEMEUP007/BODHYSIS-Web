import React, { useState, useEffect } from 'react';
import { View, Image, Platform, Linking, ScrollView, Text } from 'react-native';
import { createDrawerNavigator, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useScreenSize } from '../common/hooks/UseScreenDimention';
import Dashboard from './dashboard/Dashboard';
import Inventory from './Inventory/Inventory';
import Settings from './settings/Settings';
import Customers from './customer/customers/Customers';
import Reservations from './reservations/Reservations';
import { logout, testTokenValid } from '../api/Auth';
import Orders from './orders/Orders';
import Scheduler from './scheduler/Scheduler';
import { useHambugerMenuHistory } from '../common/hooks/UseHambugerMenuHistory';
import Marketing from './marketing/Marketing';

const MainDrawer = ({ navigation }) => {

  const initialRouteName = 'Settings';

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
            navigation.navigate('Walkup Order');
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
    return <Dashboard navigation={navigation} />;
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

  const MarketingScreen = ({ navigation }) => {
    return <Marketing navigation={navigation} />;
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
      <View style={{height:'100%', paddingBottom:50}}>
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
        <View style={{position:"absolute", bottom:0, paddingBottom:10, width:'100%' }}><Text style={{textAlign:'center'}}>{`Version 1.0 - 0135`}</Text></View>
      </View>
    );
  };

  return (
    <>
      <Drawer.Navigator
        initialRouteName={initialRouteName}
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          drawerType: Platform.OS == 'web' && isLargeScreen ? 'permanent' : 'front',
          drawerStyle: { backgroundColor: '#f1f3fc', },
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
            drawerIcon: ({focused, size}) => (
              <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../assets/nav-icons/dashboard.png')}></Image>
           ),
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
            drawerIcon: ({focused, size}) => (
              <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../assets/nav-icons/reservations.png')}></Image>
           ),
            drawerLabel: 'Reservation',
            unmountOnBlur: true,
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="Walkup Order"
          component={DeliveryOrderScreen}
          listeners={{
            drawerItemPress: (e) => {
              addMenuHistory('Walkup Order');
            },
          }}
          options={{
            drawerIcon: ({focused, size}) => (
              <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../assets/nav-icons/walk-up-order.png')}></Image>
           ),
            drawerLabel: 'Walkup Order',
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
            drawerIcon: ({focused, size}) => (
              <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../assets/nav-icons/inventory.png')}></Image>
           ),
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
            drawerIcon: ({focused, size}) => (
              <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../assets/nav-icons/customers.png')}></Image>
           ),
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
            drawerIcon: ({focused, size}) => (
              <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../assets/nav-icons/scheduler.png')}></Image>
           ),
            drawerLabel: 'Scheduler',
            unmountOnBlur: true,
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="Marketing"
          component={MarketingScreen}
          listeners={{
            drawerItemPress: (e) => {
              addMenuHistory('Marketing');
            },
          }}
          options={{
            drawerIcon: ({focused, size}) => (
              <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../assets/nav-icons/marketing.png')}></Image>
           ),
            drawerLabel: 'Marketing',
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
            drawerIcon: ({focused, size}) => (
              <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../assets/nav-icons/settings.png')}></Image>
           ),
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
    console.log('111');
    const checkTokenValidity = async () => {
      await testTokenValid((jsonRes, status)=>{
        if(status != 200) navigation.navigate('Auth');
      });
    };

    checkTokenValidity();
  }, []);

  useEffect(() => {

    const unsubscribe = navigation.addListener('state', () => {
      setRefreshKey((prevKey) => prevKey + 1);
    });

    return unsubscribe();
  }, [navigation]);

  return <MainDrawer key={refreshKey} navigation={navigation} />;
};

export default Home;
