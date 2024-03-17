import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  title: string;
  backloglist: Array<{ id: number, location: string }>;
  style?: ViewStyle;
}

const Backloglist = ({ title, backloglist, style, }: Props) => {

  const renderList = () => {
    const rows = [];
    if (backloglist.length > 0) {
      backloglist.map((item, index) => {
        rows.push(
          <View key={index} style={styles.row}>
            <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
              <Text style={[]}>{String(item.id).padStart(8, '0')}</Text>
              <Text style={[]}>{item.location}</Text>
            </View>
            <TouchableOpacity style={{marginLeft:20}}>
              <FontAwesome5 name="plus-circle" size={20} color="#333333"></FontAwesome5>
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
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <ScrollView contentContainerStyle={styles.scrollBoard}>
          {renderList()}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#999',
    marginVertical: 20,
    height: '100%',
    backgroundColor:'#e6e6e6', 
  },
  title:{
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
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
    borderWidth:1,
    borderColor: '#999999',
    borderRadius: 10,
  },
});

export default Backloglist;
