import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const BasicLayout = ({ navigation, goHome, goBack, screenName, children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        { (navigation && navigation.toggleDrawer) && (
          <TouchableOpacity style={[styles.Icon, {marginRight: 8}]} onPress={navigation.toggleDrawer}>
            <FontAwesome5 name="bars" size={20} color="#000" />
          </TouchableOpacity>
        )}
        { goHome && (
          <TouchableOpacity style={styles.Icon} onPress={goHome}>
            <FontAwesome5 name="home" size={20} color="#000" />
          </TouchableOpacity>
        )}
        { goBack && (
          <TouchableOpacity style={styles.Icon} onPress={goBack}>
            <FontAwesome5 name="arrow-left" size={15} color="#000" />
          </TouchableOpacity>
        )}
        <Text style={styles.screenName}>{screenName}</Text>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height:"100%",
    paddingTop:0,
  },
  header: {
    alignItems: 'flex-start', padding:20, backgroundColor: 'white',
    flexDirection: 'row', alignItems: 'center',
  },
  Icon: {
    paddingRight: 16,
  },
  screenName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default BasicLayout;
