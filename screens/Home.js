import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { createDrawerNavigator} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import DashboardScreen from './DashboardScreen';
import Inventory from './Inventory/Inventory';

function Settings(props) {
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
    <Drawer.Navigator useLegacyImplementation initialRouteName="Inventory">
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ drawerLabel: 'Dashboard' }}
      />
      <Drawer.Screen
        name="Inventory"
        component={Inventory}
        options={{ drawerLabel: 'Inventory' }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
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