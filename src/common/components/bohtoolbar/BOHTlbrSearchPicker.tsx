import React from 'react';
import { Text, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { TextSmallSize, TextdefaultSize } from '../../constants/Fonts';
import { Picker, PickerProps } from '@react-native-picker/picker';
import { ItemValue } from '@react-native-picker/picker/typings/Picker';

interface BOHTlbrSearchPickerProps extends PickerProps {
  items: Array<{ label: string; value: ItemValue }>;
  label?: string;
  boxStyle?: ViewStyle;
  labelStyle?: TextStyle;
  width?: number;
}

const BOHTlbrSearchPicker: React.FC<BOHTlbrSearchPickerProps> = ({ items, label, boxStyle, labelStyle, width, style, ...rest }) => {
  return (
    <View style={[styles.searchBox, boxStyle]}>
      {label && <Text style={[styles.searchLabel, labelStyle]}>{label}</Text>}
      <Picker
        style={[styles.searchInput, width && {width:width}, style]}
        {...rest}
      >
        {items.map((item, index) => (
          <Picker.Item label={item.label} value={item.value} key={index} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 25,
  },
  searchLabel: {
    marginRight: 10,
    fontSize: TextdefaultSize,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    fontSize: TextSmallSize,
  },
});

export default BOHTlbrSearchPicker;