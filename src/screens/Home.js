import React, { useEffect } from 'react';
import { View, Text, Image, Platform } from 'react-native';
import { createDrawerNavigator, DrawerItemList,  DrawerItem,} from '@react-navigation/drawer';
import { useWindowDimensions } from 'react-native';

import Dashboard from './Dashboard';
import Inventory from './Inventory/Inventory';




const MainDrawer = () => {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 1080;

  const Drawer = createDrawerNavigator();

  const DashboardScreen = ({ navigation }) => {
    return <Dashboard/>
  }
  
  const InventoryScreen = ({ navigation }) => {
    return <Inventory navigation={navigation} />;
  }
  
  const SettingsScreen = ({ navigation }) => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings</Text>
      </View>
    );
  }
  
  const DrawerContent = (props) => {
    const { navigation } = props;
  
    return (
      <>
        <DrawerItem
          label="#"
          onPress={() => navigation.navigate('Home')}
          icon={() => (
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Image
                source={require('../assets/icon.png')}
                style={{ width: 70, height: 70 }}
              />
            </View>
          )}
          style={{ marginTop: 20}}
          labelStyle={{ color: 'black', fontWeight: 'bold' }}
          iconContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
        />
        <DrawerItemList {...props} />
        <DrawerItem
          label="Log out"
          onPress={() => navigation.navigate('Auth')}
        />
      </>
    );
  }

  return (
    <Drawer.Navigator 
      useLegacyImplementation
      initialRouteName="Inventory" 
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerType: (Platform.OS == 'web' && isLargeScreen) ? 'permanent' : 'front',
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ drawerLabel: 'Dashboard' }}
        onPress={()=>{console.log('ddd');}}
      />
      <Drawer.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{ drawerLabel: 'Inventory', unmountOnBlur: true }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ drawerLabel: 'Settings' }}
      />
    </Drawer.Navigator>
  );
}

const Home = () => {
  return (
      <MainDrawer />
  );
};

export default Home;