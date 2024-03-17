import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { getDrivers } from '../../api/User';

interface Props {
  Trucks: Array<any>,
  style?: ViewStyle;
}

const TruckTripsAll = ({ Trucks, style }: Props) => {
  const [drivers, setDrivers] = useState();

  useEffect(()=>{
    getDrivers((jsonRes)=>{
      setDrivers(jsonRes.map(item=>({id:item.id, title:item.name})))
    });
  }, []);

  const renderTrips = (truck) => {
    return truck.trips.map((trip, index) => {
      return (
        <View key={index} style={[styles.tripTicket, index == 100 && styles.selectedTicketOut]}>
          <View style={[{flex:1, margin:3, padding:9}, index == 100 && styles.selectedTicketIn]}>
            <View style={styles.tripHeader}>
              <Text style={styles.tripNo}>{truck.truck}</Text>
              <Text style={styles.tripNo}>{`Trip #${index + 1}`}</Text>
            </View>
            <AutocompleteDropdown
              clearOnFocus={false}
              showChevron={false}
              closeOnBlur={false}
              // closeOnSubmit={false}
              onSelectItem={item => {

              }}
              onBlur={()=>{

              }}
              dataSet={drivers}
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
                right: 24,
                // marginRight: 16,
                height: 30,
                alignSelf: 'center',
              }}
              suggestionsListContainerStyle={{ 
                borderWidth: 1,
                borderColor: '#bfbfbf',
              }}
              renderItem={(item, text) => <Text style={{ color: '#333333', padding: 10 }}>{item.title}</Text>}
            />
            <View style={styles.orderedList}>
              <ScrollView style={{height:250}}>
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
      <ScrollView horizontal={true}>
        <View style={styles.TruckTripsContainer}>
          {Trucks && Trucks.map((truck, index) => (
            <ScrollView key={index} style={styles.scrollColumn}>
              {renderTrips(truck)}
            </ScrollView>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  TruckTripsContainer: {
    flexDirection: 'row',
    paddingLeft:20,
    paddingVertical:10,
    backgroundColor:'#C1C1C1',
  },
  scrollColumn: {
    paddingRight: 10,
    marginRight: 20,
    borderRightWidth: 1,
    borderColor: '#0088cc',
  },
  tripTicket: {
    flex:1,
    flexDirection: 'column',
    backgroundColor: 'white',
    borderWidth:0,
    borderColor: '#bfbfbf',
    width: 300,
    marginBottom: 12,
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
    flexDirection:'row',
    justifyContent:'space-between',
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

export default TruckTripsAll;
