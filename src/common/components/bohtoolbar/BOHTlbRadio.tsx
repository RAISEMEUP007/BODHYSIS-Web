import React from 'react';
import { Text, Pressable, StyleSheet, PressableProps, TextStyle, ViewStyle } from 'react-native';
import { RadioButton, RadioButtonProps } from 'react-native-paper';

interface BOHTlbRadioProps extends PressableProps {
  label?: string;
  labelStyle?: TextStyle;
  disabled?: boolean; 
  RadioButtonProps?: RadioButtonProps;
  style?: ViewStyle;
}

const BOHTlbRadio: React.FC<BOHTlbRadioProps> = ({ label, labelStyle, disabled, RadioButtonProps, style, onPress, ...rest }) => {
  return (
    <Pressable
      {...rest}
      onPress={onPress}
      style={[styles.defaultTheme, style, disabled && styles.disabledTheme]}
      disabled={disabled}
    >
      <RadioButton
        color="#0099ff"
        {...RadioButtonProps}
        onPress={RadioButtonProps.onPress || onPress}
      />
      <Text style={labelStyle}>{label}</Text>
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

export default BOHTlbRadio;