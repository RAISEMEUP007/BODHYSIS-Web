import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Providers } from './common/providers/providers';
import { AlertModals } from './common/components/alertmodal/AlertModals';
import { AuthScreen, Home, RecoverPass } from './screens';

const Stack = createStackNavigator();

export default function App() {

  return (
    <Providers>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Auth" screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="RecoverPass" component={RecoverPass} options={{ headerShown: false }} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
      <AlertModals/>
    </Providers>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
