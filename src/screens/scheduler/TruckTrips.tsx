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
      selected: false,
      orderedList: [
        { id: '1', truck: 'A1', driver_id: 'D1', reservation_id: '1', location: 'Location A', type:1 },
        { id: '2', truck: 'B1', driver_id: 'D2', reservation_id: '2', location: 'Location B', type:2 },
      ]
    },
    {
      id: 2,
      truck_id: 2,
      selected: true,
      orderedList: [
        { id: '1', truck: 'C1', driver_id: 'D3', reservation_id: '3', location: 'Location C', type:3 },
        { id: '2', truck: 'D1', driver_id: 'D4', reservation_id: '4', location: 'Location D', type:2 },
      ]
    }
  ];

  const renderTrips = (trips) => {
    return trips.map((trip, index) => {
      return (
        <View key={index} style={[styles.tripTicket, index == 1 && styles.selectedTicketOut]}>
          <View style={[{flex:1, margin:3, padding:9}, index == 1 && styles.selectedTicketIn]}>
            <View style={styles.tripHeader}>
              <Text style={styles.tripNo}>{`Trip #${index + 1}`}</Text>
            </View>
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
                  borderColor: '#808080',
                  borderWidth: 1,
                  borderRadius: 10,
                  paddingLeft: 18,
                  paddingVertical: 0,
                  height:36,
                  marginLeft: 4,
                  marginRight:6,
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
        </View>
      );
    });
  }

  const renderOrderList = (orderedList) => {

    const colors = {
      1: {color:'#721c24', bgColor:'#f8d7da', borderColor:'#f5c6cb' },
      2: {color:'#856404', bgColor:'#fff3cd', borderColor:'#ffeeba' },
      3: {color:'#0c5460', bgColor:'#d1ecf1', borderColor:'#bee5eb' },
    }
    
    return orderedList.map((item, index) => {
      let {color, bgColor, borderColor} = colors[item.type];
      return (
        <View
          key={index}
          style={[
            styles.row,
            (bgColor ? { backgroundColor: bgColor } : null),
            (borderColor ? { borderColor: borderColor } : null)
          ]}
        >
          <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={[{color:color || 'white'}]}>{String(item.id).padStart(8, '0')}</Text>
            <Text style={[{color:color || 'white'}]}>{item.location}</Text>
          </View>
          <TouchableOpacity style={{marginLeft:20}}>
            <FontAwesome5 name="minus-circle" size={18} color={color || "white"}></FontAwesome5>
          </TouchableOpacity>
        </View>
      )
    });
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
    backgroundColor:'#e5e4e4',
  },
  tripTicket: {
    flex:1,
    flexDirection: 'column',
    backgroundColor: 'white',
    borderWidth:0,
    borderColor: '#bfbfbf',
    width: 300,
    marginRight: 12,
    marginVertical: 12,
  },
  selectedTicketOut: {
    borderWidth: 1,
    borderColor: '#cccc00',
    backgroundColor: '#ccff99',
    shadowColor: 'white', // Shadow color
    shadowOffset: { width: 0, height: 0 }, // Shadow offset
    shadowOpacity: 1, // Shadow opacity
    shadowRadius: 20, // Shadow radius
    elevation: 5, // Elevation for Android
  
  },
  selectedTicketIn: {
    borderWidth: 1,
    borderColor: '#cccc00',
    backgroundColor: 'white',
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
  tripHeader: {
    flexDirection:'row-reverse',
    padding: 6,
    paddingRight: 10,
  },
  tripNo: {
    // fontSize: TextSmallSize,
    fontWeight: 'bold',
  },
  orderedList: {
    flex: 1,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3691b0',
    padding: 10,
    marginBottom: 10,
    borderWidth:1,
    borderColor: '#999999',
    borderRadius: 4,
    marginLeft: 4,
    marginRight: 6,
  },
});

export default TruckTrips;
