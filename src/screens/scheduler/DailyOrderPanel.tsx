import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ViewStyle } from 'react-native';

import BasicLayout from '../../common/components/CustomLayout/BasicLayout';
import BacklogPanel from './BacklogPanel';
import Trucklist from './Trucklist';
import TruckTrips from './TruckTrips';

interface Props {
  style?: ViewStyle;
}

const DailyOrderPanel = ({ style }: Props) => {

  const [trucks, setTrucks] = useState([
    { name: 'truck1', ticketCount: 3, orderCount: 0 },
    { name: 'truck2', ticketCount: 3, orderCount: 0 },
    { name: 'truck3', ticketCount: 3, orderCount: 0 },
    { name: 'truck3', ticketCount: 3, orderCount: 0 },
    { name: 'truck3', ticketCount: 3, orderCount: 0 },
    { name: 'truck3', ticketCount: 3, orderCount: 0 },
  ]);

  return (
    <View  style={style}>
      <View style={{flexDirection:'row', height:'100%'}}>
        <Trucklist trucks={trucks} style={{height:'100%', marginRight:16}}/>
        <TruckTrips style={{flex:1, height:'100%'}}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: '90%',
    maxWidth: 1000,
    margin: 'auto',
    marginTop: 40,
  },
});

export default DailyOrderPanel;
