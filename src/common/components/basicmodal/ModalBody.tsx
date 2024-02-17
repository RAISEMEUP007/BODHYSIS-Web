// ModalBody.js
import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';

interface ModalBodyProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

const ModalBody = ({ children, style = {} }: ModalBodyProps) => {
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