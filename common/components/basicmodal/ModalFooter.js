// ModalFooter.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const ModalFooter = ({ children }) => {
  return (
    <View style={styles.modalFooter}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  modalFooter: {
    alignItems: 'flex-end',
  },
});

export default ModalFooter;
