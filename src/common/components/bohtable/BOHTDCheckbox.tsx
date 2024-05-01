import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import CheckBox, { CheckboxProps } from 'expo-checkbox';

interface BOHTDCheckboxProps extends CheckboxProps {
  containerStyle?: ViewStyle;
  width?: number;
}

const BOHTDCheckbox: React.FC<BOHTDCheckboxProps> = ({ containerStyle, width, style, ...rest }) => {
  return (
    <View
      style={[styles.defaultTheme, containerStyle, width && {width:width}]}
    >
      <CheckBox
        style={style}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  defaultTheme: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default BOHTDCheckbox;