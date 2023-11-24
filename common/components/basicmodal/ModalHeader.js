import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { TextMediumSize, TextMediumLargeSize } from '../../constants/fonts';

const ModalHeader = ({ label, closeModal }) => {
  return (
    <View style={styles.modalHeader}>
      <Text style={styles.modalTitle}>{label}</Text>
      <TouchableOpacity onPress={closeModal}>
        <FontAwesome5 name="times" size={TextMediumLargeSize} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: TextMediumSize,
  },
});

export default ModalHeader;
