import React, { useEffect } from 'react';
import { View, Text, Image, Platform, useWindowDimensions } from 'react-native';
import { createDrawerNavigator, DrawerItemList,  DrawerItem,} from '@react-navigation/drawer';

import Dashboard from './Dashboard';
import Inventory from './Inventory/Inventory';
import Settings from './settings/Settings';

const MainDrawer = ({navigation}) => {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 1080;

  const Drawer = createDrawerNavigator();

  const DashboardScreen = ({ navigation }) => {
    return <Dashboard/>
  }
  
  const InventoryScreen = ({ navigation }) => {
    return <Inventory/>;
  }
  
  const SettingsScreen = ({ navigation }) => {
    return (
      <Settings/>
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
        )
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

const Home = ({navigation}) => {
  return (
      <MainDrawer navigation={navigation}/>
  );
};

export default Home;