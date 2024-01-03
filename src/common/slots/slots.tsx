import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';

export type SlotType = {
  label: string;
  value: any;
};

interface Props {
  items: Array<SlotType>;
  onSelect: (slot: SlotType) => void;
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
                key={slot.label}
                onPress={() => {
                  onSelect(slot);
                }}
                style={styles.slot}
              >
                <Text>{slot.label}</Text>
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
    marginRight: 10,
  },
  textInput: {
    fontSize: 12,
    backgroundColor: Colors.Neutrals.LIGHT_GRAY,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  slot: {
    backgroundColor: Colors.Secondary.LIGHT_BLUE,
    borderRadius: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 31,
    width: 42,
    marginRight: 10,
  },
  slotText: {
    backgroundColor: Colors.Neutrals.DARK,
    borderRadius: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginBottom: 5,
  },
});
