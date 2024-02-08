import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { getTransactionsData } from '../../../api/Reservation';

interface Props {
  reservationId: number;
  openAddTransactionModal: ()=>void;
}

const TransactionList = ({reservationId, openAddTransactionModal}:Props) => {
  // const
  // // console.log(reservationId);
  // const transactionData = [
  //   // { id: 1, date: '2022-01-15', amount: 100.00, method: 'Stripe' },
  //   // { id: 2, date: '2022-01-16', amount: 50.00, method: 'Credit' },
  //   // { id: 3, date: '2022-01-17', amount: 200.00, method: 'PayPal' },
  //   // { id: 3, date: '2022-01-17', amount: 200.00, method: 'PayPal' },
  //   // { id: 3, date: '2022-01-17', amount: 200.00, method: 'PayPal' },
  //   // { id: 3, date: '2022-01-17', amount: 200.00, method: 'PayPal' },
  // ];

  const [transactionData, setTransactionData] = useState([]);

  useEffect(()=>{
    getTransactionsData({reservation_id:reservationId}, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          setTransactionData(jsonRes);
          break;
        default:
          setTransactionData([]);
          break;
      }
    });
  }, [reservationId, openAddTransactionModal])
  
  const renderItems = () => {
    return transactionData.map((transaction) => (
      <View key={transaction.id} style={styles.transactionItem}>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:8}}>
          <Text>{'User@gmail.com'}</Text>
          <Text>{new Date(transaction.createdAt).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}</Text>
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text>{transaction.method}</Text>
          <Text>{"$" + transaction.amount}</Text>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={{alignItems:'flex-end', paddingHorizontal:6, marginBottom:12}}>
        <TouchableOpacity style={[styles.outLineButton, {borderColor:'#28A745'}]} onPress={()=>{openAddTransactionModal()}}>
          <View style={{flexDirection:'row'}}>
            <FontAwesome5 name={'plus'} size={14} color="#28A745" style={{marginRight:10, marginTop:3}}/>
            <Text style={[styles.outlineBtnText, {color:'#28A745'}]}>Add Transaction</Text>
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{paddingHorizontal:6, height:250}}>
        <View>
          {renderItems()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 18,
    // paddingHorizontal: 2,
    width:'100%',
    height:'100%',
  },
  transactionItem: {
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  outLineButton: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    // alignItems: 'center',
    // justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#6c757d',
    marginLeft: 13,
  },
  outlineBtnText: {
    fontSize: 14,
    letterSpacing: 1,
    textAlign: 'center',
    // color:'#6c757d',
    // marginLeft: 10,
  },
});

export default TransactionList;
