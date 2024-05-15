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
  editable,
  ...otherTextInputProps
}: Props & TextInputProps) => {

  // const inputContainerStyle = editable !== false ? styles.input : [styles.input, styles.inputDisable];
  const inputContainerStyle = styles.input;

  return (
    <View style={[containerStyle, {width}]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <TextInput
        style={[inputContainerStyle, {width:'!00%'}, inputStyle]}
        placeholderTextColor="#ccc"
        editable={editable}
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
    // colro: ''
    borderColor: '#bfbfbf',
  },
});

export default LabeledTextInput;