import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

import BasicLayout from '../../common/components/CustomLayout/BasicLayout';
import DailyOrderPanel from './DailyOrderPanel';
import BacklogPanel from './BacklogPanel';

interface Props {
  navigation: any;
}

const Scheduler = ({ navigation }: Props) => {

  const [contentHeight, setContentHeight] = useState<number>();

  return (
    <BasicLayout navigation={navigation} screenName={'Scheduler'}>
      <View style={{flex:1, paddingVertical:20, paddingHorizontal:30, justifyContent:'center'}}>
        <View 
        style={{height:'100%', maxWidth:1600, backgroundColor:'white', padding:24}}
        onLayout={(event)=>{
          const { height } = event.nativeEvent.layout;
          console.log(height);
          setContentHeight(height);
        }}>
          <DailyOrderPanel style={{height:'50%'}}/>
          <BacklogPanel style={{height:'50%'}}/>
        </View>
      </View>
    </BasicLayout>
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

export default Scheduler;
