import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
// import Tab1View from './Tab1View';
// import Tab2View from './Tab2View';

interface Props {
  width?: number;
}

export const ReservationExtensionPanel = ({width}:Props) => {
  const [activeTab, setActiveTab] = useState(0);

  const renderTab = (index, title, icon) => {
    return (
      <TouchableOpacity
        style={[styles.tabItem, activeTab === index && styles.activeTab]}
        onPress={() => handlePress(index)}
        key={index}
      >
        <FontAwesome5 name={icon} size={20} color="black" style={{marginBottom:2}}/>
        <Text style={styles.tabText}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const handlePress = (index) => {
    setActiveTab(index);
  };

  const renderTabContent = () => {
    switch(activeTab) {
      // case 0:
      //   return (<View>
      //     <Text>000</Text>
      //   </View>);
      // case 1:
      //   return (<View>
      //     <Text>000</Text>
      //   </View>);
      default:
        return (<View>
          <Text>{"No Content  :("}</Text>
        </View>);
    }
  };

  return (
    <View style={[styles.container, {width:width || null}]}>
      <View style={styles.tabBar}>
        {renderTab(0, 'Notes', 'sticky-note')}
        {renderTab(1, 'Events', 'calendar-check')}
        {renderTab(2, 'Transactions', 'money-bill-alt')}
        {renderTab(3, 'Comms', 'comment-dots')}
        {renderTab(4, 'Delivery', 'truck')}
        {renderTab(5, 'Docs', 'folder-open')}
        {renderTab(6, 'Extras', 'bookmark')}
      </View>
      <View style={styles.tabContent}>
        {renderTabContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#cccccc',
    // borderLeftWidth: 1,
    borderWidth: 1,
    paddingHorizontal:30,
    paddingTop:6,
    paddingBottom:12,
    marginLeft:16,
    marginBottom: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap-reverse',
    // backgroundColor: '#f2f2f2',
    // width: '100%',
  },
  tabItem: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 6,
    borderBottomColor: '#808080',
    borderBottomWidth: 1,
    alignItems:'center',
  },
  tabText: {
    fontSize:14,
    letterSpacing:1,
  },
  activeTab: {
    borderBottomWidth: 4,
    borderBottomColor: '#009999',
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});