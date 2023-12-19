// ModalBody.js
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const ModalBody = ({ children, style }) => {
  return (
    <View style={[styles.modalBody, style]}>
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