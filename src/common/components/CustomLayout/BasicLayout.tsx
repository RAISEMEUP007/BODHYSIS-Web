import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, Platform, Linking } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  navigation?: any;
  goHome?: () => void;
  goBack?: () => void;
  screenName: string;
  children?: string | JSX.Element | JSX.Element[];
  containerStyle?: ViewStyle;
  backKeyboard?: boolean;
}

const BasicLayout = ({
  navigation,
  goHome,
  goBack,
  screenName,
  children,
  containerStyle,
  backKeyboard,
}: Props) => {

  useEffect(() => {
    if(Platform.OS === 'web' && backKeyboard){
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Backspace' && goBack) {
          goBack();
        }
      };
  
      window.addEventListener('keydown', handleKeyDown);
  
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [goBack]);

  useEffect(() => {
    if(Platform.OS === 'web'){
      const handleBrowserBack = (event) => {
        event.preventDefault();
        if (goBack) {
          goBack();
        }
        else {
          window.history.go(1);
        }
      };
    
      if(!goBack){
        window.history.pushState(null, null, window.location.href);
      }
    
      window.onpopstate = handleBrowserBack;
  
      return () => {
        window.onpopstate = null;
      };
    }
  }, [goBack]);

  return (
    <View style={{ ...styles.container, ...containerStyle }}>
      <View style={styles.header}>
        {navigation && navigation.toggleDrawer && (
          <TouchableOpacity
            style={[styles.Icon, { marginRight: 8 }]}
            onPress={() => navigation.toggleDrawer()}
          >
            <FontAwesome5 name="bars" size={20} color="#000" />
          </TouchableOpacity>
        )}
        {goHome && (
          <TouchableOpacity style={styles.Icon} onPress={goHome}>
            <FontAwesome5 name="home" size={20} color="#000" />
          </TouchableOpacity>
        )}
        {goBack && (
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
    height: '100%',
    paddingTop: 0,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
    backgroundColor: '#f2f2f2',
    shadowColor:'#b3b3b3',
    shadowOffset: {
      width: -1,
      height: 3,
    },
    // shadowOpacity: 0.4,
    shadowRadius: 10,
    flexDirection: 'row',
  },
  Icon: {
    paddingRight: 16,
    paddingTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default BasicLayout;