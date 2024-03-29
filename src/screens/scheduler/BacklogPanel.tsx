import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ViewStyle } from 'react-native';

import BasicLayout from '../../common/components/CustomLayout/BasicLayout';
import Backloglist from './Backloglist';

interface Props {
  lists: {deliveries:any; swaps:any; pickups:any};
  style?: ViewStyle;
}

const BacklogPanel = ({ lists, style }: Props) => {

  return (
    <View  style={style}>
      <View style={styles.container}>
        <Backloglist title={'Deliveries'} backloglist={lists.deliveries} style={[styles.list, styles.delivery]} color='#721c24' bgColor={'#f8d7da'} borderColor={'#f5c6cb'}/>
        <Backloglist title={'Swaps'} backloglist={lists.swaps} style={[styles.list, styles.swap]} color='#856404' bgColor={'#fff3cd'} borderColor={'#ffeeba'}/>
        <Backloglist title={'Pickups'} backloglist={lists.pickups} style={[styles.list, styles.pickup]} color='#0c5460' bgColor={'#d1ecf1'} borderColor={'#bee5eb'}/>
        {/* <Backloglist title={'Pickups'} backloglist={backloglist} style={[styles.list, styles.pickup]} color='#004085' bgColor={'#CCE5FF'} borderColor={'#b8daff'}/> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height:'100%',
  },
  list: {
    height: '100%',
    width: '32%',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  delivery: {
    borderColor: '#b3b3b3',
    // backgroundColor: '#f7f7f7',
  },
  swap: {
    borderColor: '#b3b3b3',
    // backgroundColor: '#f7f7f7',
  },
  pickup: {
    borderColor: '#b3b3b3',
    // backgroundColor: '#f7f7f7',
  },
});

export default BacklogPanel;
