import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, DimensionValue } from 'react-native';
import { TextSmallSize } from '../../constants/Fonts';

interface Props {
  label: string;
  width?: DimensionValue;
  containerStyle?: object;
  labelStyle?: object;
  inputStyle?: object;
}

const LabeledTextInput = ({
  label,
  width,
  containerStyle,
  labelStyle,
  inputStyle,
  ...otherTextInputProps
}: Props & TextInputProps) => {

  return (
    <View style={[containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <TextInput
        style={[styles.input, {width:width?width:'auto'}, inputStyle]}
        placeholderTextColor="#ccc"
        {...otherTextInputProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: '#555',
    fontSize: TextSmallSize,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 10,
    padding: 8,
  },
  inputDisable: {
    borderColor: '#ddd',
  },
});

export default LabeledTextInput;