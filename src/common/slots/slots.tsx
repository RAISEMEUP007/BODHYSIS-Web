import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { PriceTableHeaderData, PriceTableHeaderDataViewModel } from '../../types/PriceTableTypes';

export type SlotType = {
  label: string;
  value: any;
};

interface Props {
  items: Array<PriceTableHeaderDataViewModel>;
  onSelect: (slot: PriceTableHeaderData) => void;
}

const Slots = ({ items, onSelect }: Props) => {
  const renderSlots = () => {
    if (!items) {
      return null;
    }
    return (
      <View style={styles.container}>
        {items &&
          items.map((slot) => {
            return (
              <TouchableOpacity
                key={slot.header}
                onPress={() => {
                  onSelect(slot);
                }}
                style={styles.slot}
              >
                <Text>{slot.header}</Text>
              </TouchableOpacity>
            );
          })}
      </View>
    );
  };

  return <View style={styles.container}>{renderSlots()}</View>;
};

export default Slots;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
  },
  slot: {
    backgroundColor: Colors.Secondary.LIGHT_BLUE,
    borderRadius: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginVertical: 6,
    paddingVertical: 7,
    width: 72,
  },
  slotText: {
    backgroundColor: Colors.Neutrals.DARK,
    // borderRadius: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginBottom: 5,
  },
});
