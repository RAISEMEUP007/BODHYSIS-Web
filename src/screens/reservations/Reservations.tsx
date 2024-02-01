import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

import TouchNavGroup from '../../common/components/navpanel/TouchNavGroup';

import { ReservationsList } from './ReservationsList';
import CreateReservation from './CreateReservation';
import BasicLayout from '../../common/components/CustomLayout/BasicLayout';

interface Props {
  navigation: any;
  goBack: () => void;
}

const Reservations = ({ navigation, goBack }: Props) => {
  const [data, setData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (itemName, data) => {
    setSelectedItem(itemName);
    setData(data);
  };

  if (selectedItem) {
    switch (selectedItem) {
      case 'Create Reservations':
        return (
          <CreateReservation
            goBack={() => {
              setSelectedItem(null);
            }}
            navigation={navigation}
            data={data}
          />
        );
      case 'Reservations List':
        return (
          <ReservationsList
            goBack={() => {
              setSelectedItem(null);
            }}
          />
        );
      default:
        return (
          <View
            style={{
              flex: 1,
              border: '1px solid #d54545',
              marginRights: 20,
              paddingHorizontal: 10,
              paddingVertical: 2,
              height: 28,
              justifyContent: 'center',
              flexDirection: 'row',
              marginTop: 100,
            }}
          >
            <TouchableOpacity onPress={() => handleItemClick(null)}>
              <Text>{'< Back'}</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 28 }}>{selectedItem}</Text>
          </View>
        );
    }
  }

  return (
    <BasicLayout goBack={goBack} navigation={navigation} screenName={'Reservations'}>
      <ScrollView>
        <View style={styles.container}>
          <TouchNavGroup
            sectionTitle="Create Resservation"
            items={[{ title: 'Create Reservations', icon: 'check' }]}
            handleItemClick={handleItemClick}
          />
          <TouchNavGroup
            sectionTitle="Reservations List"
            items={[{ title: 'Reservations List', icon: 'table' }]}
            handleItemClick={handleItemClick}
          />
        </View>
      </ScrollView>
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

export default Reservations;
