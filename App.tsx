import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Linking, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Providers } from './src/common/providers/Providers';
import { AlertModals } from './src/common/components/alertmodal/AlertModals';

import { AuthScreen, Home, RecoverPass, ChangePass } from './src/screens';
import { ConfirmModal } from './src/common/components/confirmmodal/ConfirmModals';
import { store } from './src/redux/store';
import { Provider } from 'react-redux';

const Stack = createStackNavigator();

const LoadingIndicator = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const GlobalModals = () => {
  return (
    <View style={{ zIndex: 1000 }}>
      <AlertModals />
      <ConfirmModal />
    </View>
  );
};

export default function App() {
  const [initialRoute, setInitalRoute] = useState('Home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleDeepLinking = async () => {
      try {
        const url = await Linking.getInitialURL();
        if (url) {
          const route = url.replace(/.*?:\/\//g, '');
          if (route.toLowerCase().includes('changepass')) {
            setInitalRoute('changePass');
          }
        }
      } catch (error) {
        console.error('Error fetching initial URL: ', error);
      } finally {
        setLoading(false);
      }
    };
    handleDeepLinking();
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <Providers>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{ presentation: 'modal' }}
          >
            <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen
              name="RecoverPass"
              component={RecoverPass}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="changePass"
              component={ChangePass}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
        <GlobalModals />
      </Provider>
    </Providers>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
