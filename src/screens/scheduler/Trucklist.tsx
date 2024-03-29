import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ViewStyle } from 'react-native';

import { TextdefaultSize } from '../../common/constants/Fonts';

interface Props {
  trucks: Array<{ name: string, ticketCount: number, orderCount: number }>;
  style?: ViewStyle;
}

const Trucklist = ({ trucks, style }: Props) => {
  
  const renderTableHeader = () => {
    return(
      <View style={styles.thead}>
        <View style={styles.tr}>
          <Text style={[styles.th, {width:250}]}>{'Truck Name'}</Text>
          <Text style={[styles.th, {width:100}]}>{'Tickets'}</Text>
          <Text style={[styles.th, {width:100}]}>{'Orders'}</Text>
        </View>
      </View>
    );
  };

  const renderTableData = () => {
    const rows = [];
    if (trucks.length > 0) {
      trucks.map((item, index) => {
        rows.push(
          <TouchableOpacity key={index} style={[styles.tr, (index == 1 && styles.selectedRow)]}>
            <Text style={[styles.td, {width:250}]}>{item.name}</Text>
            <Text style={[styles.td, {width:100}, styles.alignRight]}>{item.ticketCount}</Text>
            <Text style={[styles.td, {width:100}, styles.alignRight]}>{item.orderCount}</Text>
          </TouchableOpacity>
        );
      });
    } else {
      <></>;
    }
    return <>{rows}</>;
  };
  return (
    <View style={style}>
      <View style={styles.table}>
        {renderTableHeader()}
        <ScrollView>
          {renderTableData()}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    // height: '100%',
    flex:1,
    borderWidth: 1,
    borderColor: '#b3b3b3',
  },
  tr: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  thead: {
    backgroundColor: '#f5f5f5',
  },
  th: {
    fontWeight: 'bold',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 8,
    // fontSize: TextdefaultSize,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  td: {
    position: 'relative',
    padding: 2,
    paddingHorizontal: 8,
    paddingVertical: 8,
    // fontSize: TextdefaultSize,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  selectedRow: {
    backgroundColor: '#d6d8d9',
    color: '#1b1e21',
  },
  alignRight:{
    textAlign:'right',
  }
});
export default Trucklist;
