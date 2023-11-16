import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import DashboardScreen from './DashboardScreen';

function Dashboard() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Feed Screen</Text>
    </View>
  );
}

function Inventory() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Inventory</Text>
    </View>
  );
}

function Settings() {
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
        component={Inventory}
        options={{ drawerLabel: 'Inventory' }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{ drawerLabel: 'Settings' }}
      />
      <Drawer.Screen
        name="Logout"
        component={Logout}
        options={{ drawerLabel: 'Log out' }}
      />
    </Drawer.Navigator>
  );
}

const Home = ({ navigation }) => {
  return (
      <MyDrawer />
  );
};

export default Home;