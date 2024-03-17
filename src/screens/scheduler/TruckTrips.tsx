import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { TextSmallSize } from '../../common/constants/Fonts';

interface Props {
  style?: ViewStyle;
}

const TruckTrips = ({ style }: Props) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const data = [
    {
      id: 1,
      truck_id: 2,
      orderedList: [
        { id: '1', truck: 'A1', driver_id: 'D1', reservation_id: '1', location: 'Location A' },
        { id: '2', truck: 'B1', driver_id: 'D2', reservation_id: '2', location: 'Location B' },
      ]
    },
    {
      id: 2,
      truck_id: 2,
      orderedList: [
        { id: '1', truck: 'C1', driver_id: 'D3', reservation_id: '3', location: 'Location C' },
        { id: '2', truck: 'D1', driver_id: 'D4', reservation_id: '4', location: 'Location D' },
      ]
    }
  ];

  const renderTrips = (trips) => {
    return trips.map((trip, index) => {
      return (
        <View key={index} style={styles.tripTicket}>
          <Text style={styles.tripNo}>{`Trip #${index + 1}`}</Text>
          <AutocompleteDropdown
            clearOnFocus={false}
            closeOnBlur={true}
            closeOnSubmit={false}
            onSelectItem={setSelectedItem}
            dataSet={[
              { id: '1', title: 'Alpha' },
              { id: '2', title: 'Beta' },
              { id: '3', title: 'Gamma' },
            ]}
            emptyResultText={'No Driver'}
            containerStyle={{ marginTop:15, }}
            inputContainerStyle={{
              backgroundColor: 'white',
              borderRadius: 10,
              height:36,
            }}
            textInputProps={{
              style: {
                borderColor: '#999999',
                borderWidth: 1,
                borderRadius: 10,
                paddingLeft: 18,
                paddingVertical: 0,
                height:36,
              },
            }}
            rightButtonsContainerStyle={{
              right: 16,
              height: 30,
              alignSelf: 'center',
            }}
          />
          <View style={styles.orderedList}>
            <ScrollView>
              {renderOrderList(trip.orderedList)}
            </ScrollView>
          </View>
        </View>
      );
    });
  }

  const renderOrderList = (orderedList) => {
    
    return orderedList.map((item, index) => (
      <View key={index} style={styles.row}>
        <Text style={[]}>{String(item.id).padStart(8, '0')}</Text>
        <Text style={[]}>{item.location}</Text>
      </View>
    ));
  }

  return (
    <View  style={style}>
      <View style={styles.TruckTripsContainer}>
        <ScrollView horizontal={true}>
          {renderTrips(data)}
          <TouchableOpacity style={[styles.tripTicket, styles.plusButton]}>
            <FontAwesome5 name="plus-circle" size={36} color="#666"></FontAwesome5>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  TruckTripsContainer: {
    flexDirection: 'row',
    height: '100%',
    paddingHorizontal:12,
    backgroundColor:'lightblue',
  },
  tripTicket: {
    flexDirection: 'column',
    backgroundColor: 'white',
    borderWidth:1,
    borderColor: '#e6e6e6',
    width: 300,
    marginRight: 12,
    marginVertical: 12,
    padding: 12,
  },
  plusButton: {
    width: 200,
    marginRight: 0,
    borderStyle: 'dashed',
    borderColor: '#666',
    borderWidth: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripNo: {
    marginTop: 6,
    fontSize: TextSmallSize,
  },
  orderedList: {
    flex: 1,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderWidth:1,
    borderColor: '#999999',
    borderRadius: 4,
    marginRight: 6,
  },
});

export default TruckTrips;
