import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ViewStyle } from 'react-native';

import BasicLayout from '../../common/components/CustomLayout/BasicLayout';
import Backloglist from './Backloglist';

interface Props {
  style?: ViewStyle;
}

const BacklogPanel = ({ style, }: Props) => {

  const [backloglist, setBackloglist] = useState([
    { id: 3, location: 'home location' },
    { id: 3, location: 'home location' },
    { id: 3, location: 'home location' },
    { id: 3, location: 'home location' },
    { id: 3, location: 'home location' },
    { id: 3, location: 'home location' },
  ]);


  return (
    <View  style={style}>
      <View style={styles.container}>
        <Backloglist title={'Deliveries'} backloglist={backloglist} style={{height:'100%', width:'32%'}}/>
        <Backloglist title={'Swaps'} backloglist={backloglist} style={{height:'100%', width:'32%'}}/>
        <Backloglist title={'Pickups'} backloglist={backloglist} style={{height:'100%', width:'32%'}}/>
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
});

export default BacklogPanel;
