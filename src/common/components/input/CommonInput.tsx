import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';

type SlotType = {
  label: string;
  value: string;
};

interface Props {
  title?: string;
  placeholder?: string | null;
  slots?: Array<SlotType> | null;
  width?: number;
  containerStyle?: ViewStyle;
  onFocus?: () => void;
  value?: string | null;
  onChangeText: (string) => void;
}

const CommonInput = ({
  title,
  placeholder,
  width = 400,
  containerStyle,
  onFocus,
  value,
  onChangeText,
}: Props) => {
  const [internalValue, setInternalValue] = useState<string | null>(null);

  const renderInput = () => {
    return (
      <View style={{ ...styles.container, width, ...containerStyle }}>
        {title && <Text style={styles.text}>{title}</Text>}
        <TextInput
          onChangeText={(text) => {
            setInternalValue(text);
            onChangeText && onChangeText(text);
          }}
          value={value ?? internalValue ?? null}
          onFocus={onFocus}
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={Colors.Neutrals.DARK}
        />
      </View>
    );
  };

  return <View style={styles.container}>{renderInput()}</View>;
};

export default CommonInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginRight: 10,
    marginBottom: 10,
  },
  textInput: {
    fontSize: 12,
    backgroundColor: Colors.Neutrals.LIGHT_GRAY,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  slot: {
    backgroundColor: Colors.Secondary.LIGHT_BLUE,
    borderRadius: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotText: {
    backgroundColor: Colors.Neutrals.DARK,
    borderRadius: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginBottom: 5,
  },
});
