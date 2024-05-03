import React, { ReactNode } from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

interface BOHTDInputProps extends TextInputProps {
  width?: number;
}

const BOHTDInput: React.FC<BOHTDInputProps> = ({ width, style, ...rest }) => {
  return (
    <TextInput
      style={[styles.defaultTheme, width && {width:width}, style]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  defaultTheme: {
    paddingHorizontal: 9,
    paddingVertical: 9,
    margin:1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default BOHTDInput;