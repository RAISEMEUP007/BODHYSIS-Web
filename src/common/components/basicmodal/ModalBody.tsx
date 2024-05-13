// ModalBody.js
import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

interface ModalBodyProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

const ModalBody = ({ children, style = {} }: ModalBodyProps) => {
  return (
    <View style={[styles.modalBody, style]}>
      <ScrollView contentContainerStyle={{paddingHorizontal:8}}>
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBody: {
    flex:1,
    paddingHorizontal:12
  },
});

export default ModalBody;