// ModalBody.js
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const ModalBody = ({ children }) => {
  return (
    <View style={styles.modalBody}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  modalBody: {
    marginBottom: 15,
    padding: 1,
  },
});

export default ModalBody;
