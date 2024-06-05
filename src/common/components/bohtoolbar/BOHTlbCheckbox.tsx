import React from 'react';
import { Text, Pressable, StyleSheet, PressableProps, TextStyle, ViewStyle } from 'react-native';
import Checkbox, { CheckboxProps } from 'expo-checkbox';
import { TextdefaultSize } from '../../constants/Fonts';

interface BOHTlbCheckboxProps extends PressableProps {
  label?: string;
  labelStyle?: TextStyle;
  disabled?: boolean; 
  CheckboxProps?: CheckboxProps;
  style?: ViewStyle;
}

const BOHTlbCheckbox: React.FC<BOHTlbCheckboxProps> = ({ label, labelStyle, disabled, CheckboxProps, style, onPress, ...rest }) => {
  return (
    <Pressable
      {...rest}
      onPress={onPress}
      style={[styles.defaultTheme, style, disabled && styles.disabledTheme]}
      disabled={disabled}
    >
      <Checkbox
        // color="#0099ff"
        {...CheckboxProps}
      />
      <Text style={[{marginLeft:10, fontSize:TextdefaultSize}, labelStyle]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  defaultTheme: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginLeft: 12,
  },
  disabledTheme: {
    backgroundColor: 'gray',
  },
});

export default BOHTlbCheckbox;