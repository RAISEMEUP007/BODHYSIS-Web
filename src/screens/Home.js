import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { createDrawerNavigator} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

import Dashboard from './Dashboard';
import Inventory from './Inventory/Inventory';

function DashboardScreen(props) {
  return <Dashboard/>
}

function InventoryScreen(props) {
  return <Inventory/>
}

function SettingsScreen(props) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings</Text>
    </View>
  );
}

function Logout() {

  const navigation = useNavigation();

  useEffect(() => {
    navigation.navigate('Auth');
  }, [navigation]);

  return null;
}

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator useLegacyImplementation initialRouteName="Dashboard">
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ drawerLabel: 'Dashboard' }}
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
      >
      </Drawer.Screen>
      <Drawer.Screen
        name="Logout"
        component={Logout}
        options={{ drawerLabel: 'Log out' }}
      />
    </Drawer.Navigator>
  );
}

const Home = () => {
  return (
      <MyDrawer />
  );
};

export default Home;