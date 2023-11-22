import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const ModalHeader = ({ label, closeModal }) => {
  return (
    <View style={styles.modalHeader}>
      <Text style={styles.modalTitle}>{label}</Text>
      <TouchableOpacity onPress={closeModal}>
        <FontAwesome5 name="times" size={16} color="black" />
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
    fontSize: 18,
  },
});

export default ModalHeader;
