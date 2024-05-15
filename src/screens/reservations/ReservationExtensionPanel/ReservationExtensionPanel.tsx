import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import TransactionList from './TransactionList';

interface Props {
  reservationId: number;
  openAddTransactionModal: ()=>void;
  openRefundModal: (refundDetails)=>void;
  width?: number;
}

export const ReservationExtensionPanel = ({reservationId, openAddTransactionModal, openRefundModal, width}:Props) => {
  
  const [activeTab, setActiveTab] = useState(2);

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
    return (
      <View style={styles.tabContent}>
        {activeTab === 0 && (
          <View>
            <Text>Content for Notes</Text>
          </View>
        )}
        {activeTab === 1 && (
          <View>
            <Text>Content for Events</Text>
          </View>
        )}
        {activeTab === 2 && (
          <TransactionList 
            reservationId={reservationId} 
            openAddTransactionModal={openAddTransactionModal}
            openRefundModal={openRefundModal}
          />
        )}
        {activeTab === 3 && (
          <View>
            <Text>Content for Comments</Text>
          </View>
        )}
        {activeTab === 4 && (
          <View>
            <Text>Content for Delivery</Text>
          </View>
        )}
        {activeTab === 5 && (
          <View>
            <Text>Content for Docs</Text>
          </View>
        )}
        {activeTab === 6 && (
          <View>
            <Text>Content for Extras</Text>
          </View>
        )}

      </View>
    );
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
    // minWidth: 550,
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
    width: '100%',
    height: 400,
  },
});