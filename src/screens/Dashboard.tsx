import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BasicLayout from '../common/components/CustomLayout/BasicLayout';

const Dashboard = () => {
  const navigation = useNavigation();

  const onLogout = () => {
    navigation.navigate('Auth');
  };

  return (
    <BasicLayout navigation={navigation} screenName={'Dashboard'}>
      <View style={styles.container}>
        <Text style={styles.heading}>Dashboard</Text>
        <TouchableOpacity onPress={onLogout} style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </BasicLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Dashboard;
