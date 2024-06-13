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
import DemandsList from './reservations/DemansList';
import LocationManager from './marketing/locationmanager/Locations';
import Avaiable from './marketing/avaiable/Avaiable';
import Forecasting from './marketing/forecasting/Forecasting';

const MainDrawer = ({ navigation }) => {

  const initialRouteName = 'Settings';

  const { isLargeScreen } = useScreenSize();
  const { addMenuHistory } = useHambugerMenuHistory();

  const Drawer = createDrawerNavigator();

  // useEffect(()=>{
  //   addMenuHistory(initialRouteName);
  // }, []);

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
          }else if (route.toLowerCase().includes('demand')) {
            navigation.navigate('DemandsList');
          }else if (route.toLowerCase().includes('walkup')) {
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

  const screensConfig = [
    {
      name: "Dashboard",
      component: ({navigation})=>{return <Dashboard navigation={navigation} />},
      iconName: "dashboard.png",
      label: "Dashboard",
    },
    {
      name: "Reservation",
      component: ({navigation})=>{return <Reservations navigation={navigation} />},
      iconName: "reservations.png",
      label: "Reservation",
    },
    {
      name: "Walkup Order",
      component: ({navigation})=>{return <Orders navigation={navigation} />},
      iconName: "walk-up-order.png",
      label: "Walkup Order",
    },
    {
      name: "Inventory",
      component: ({navigation})=>{return <Inventory navigation={navigation} />},
      iconName: "inventory.png",
      label: "Inventory",
    },
    {
      name: "Customers",
      component: ({navigation})=>{return <Customers navigation={navigation} />},
      iconName: "customers.png",
      label: "Customers",
    },
    {
      name: "Scheduler",
      component: ({navigation})=>{return <Scheduler navigation={navigation} />},
      iconName: "scheduler.png",
      label: "Scheduler",
      hidden: true,
    },
    {
      name: "Marketing",
      component: ({navigation})=>{return <Marketing navigation={navigation} />},
      iconName: "marketing.png",
      label: "Marketing",
    },
    {
      name: "Locations",
      component: ({navigation})=>{return <LocationManager navigation={navigation} />},
      iconName: "marketing.png",
      label: "Locations",
      hidden: true,
    },
    {
      name: "Forecasting",
      component: ({navigation})=>{return <Forecasting navigation={navigation} />},
      iconName: "marketing.png",
      label: "Forecasting",
      hidden: true,
    },
    {
      name: "Demands Summary",
      component: ({navigation})=>{return <Avaiable navigation={navigation} />},
      iconName: "marketing.png",
      label: "Demands Summary",
      hidden: true,
    },
    {
      name: "Settings",
      component: ({navigation})=>{return <Settings navigation={navigation} />},
      iconName: "settings.png",
      label: "Settings",
    },   
    {
      name: "DemandsList",
      component: ({navigation})=>{return <DemandsList navigation={navigation} />},
      iconName: "reservations.png",
      label: "DemandsList",
      hidden: true,
    },
  ];
  
  const drawerScreens = screensConfig.map((screen) => (
    <Drawer.Screen
      key={screen.name}
      name={screen.name}
      component={screen.component}
      options={{
        drawerLabel: screen.label,
        unmountOnBlur: true,
        headerShown: false,
        drawerIcon: ({ focused, size }) => (
          <Image
            style={{ width: 25, height: 25, resizeMode: 'contain' }}
            source={require(`../assets/nav-icons/${screen.iconName}`)}
          />
        ),
        drawerItemStyle: {
          display: screen.hidden ? 'none' : 'flex',
        },
      }}
    />
  ));

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
        <View style={{position:"absolute", bottom:0, paddingBottom:10, width:'100%' }}><Text style={{textAlign:'center'}}>{`Version 1.0 - Commit ID {COMMIT}`}</Text></View>
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
        {drawerScreens}
      </Drawer.Navigator>
    </>
  );
};

const Home = ({ navigation }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
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
