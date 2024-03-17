import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  title: string;
  backloglist: Array<{ id: number, location: string }>;
  style?: object;
  color?: string;
  bgColor?: string;
  borderColor?: string;
}

const Backloglist = ({ title, backloglist, style, color, bgColor, borderColor}: Props) => {

  const renderList = () => {
    const rows = [];
    if (backloglist.length > 0) {
      backloglist.map((item, index) => {
        rows.push(
          <View
            key={index}
            style={[
              styles.row,
              (bgColor ? { backgroundColor: bgColor } : null),
              (borderColor ? { borderColor: borderColor } : null)
            ]}
          >
            <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
              <Text style={[{color: color || 'white'}]}>{String(item.id).padStart(8, '0')}</Text>
              <Text style={[{color: color || 'white'}]}>{item.location}</Text>
            </View>
            <TouchableOpacity style={{marginLeft:20}}>
              <FontAwesome5 name="plus-circle" size={18} color={color || 'white'}></FontAwesome5>
            </TouchableOpacity>
          </View>
        );
      });
    } else {
      <></>;
    }
    return <>{rows}</>;
  };

  return (
    <View  style={style}>
      {/* <View style={styles.container}> */}
        <Text style={[styles.title]}>{title}</Text>
        <ScrollView contentContainerStyle={styles.scrollBoard}>
          {renderList()}
        </ScrollView>
      {/* </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#999',
    marginVertical: 20,
    height: '100%',
  },
  title:{
    fontWeight: 'bold',
    paddingTop: 14,
    paddingBottom: 8,
    paddingLeft: 10,
    backgroundColor: 'white',
  },
  scrollBoard: {
    paddingVertical:10, 
    paddingHorizontal:6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 10,
  },
});

export default Backloglist;
