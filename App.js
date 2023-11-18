import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Providers } from './common/providers/providers';
import { AuthScreen, Home } from './screens';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Providers>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Auth">
          <Stack.Screen
              name="Auth"
              component={AuthScreen}
              options={{ headerShown: false }}
            />
          <Stack.Screen name="Home" component={Home}  options={{ headerShown: false }}/>
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </Providers>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
