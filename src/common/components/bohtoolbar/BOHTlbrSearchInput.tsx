import React, { ReactNode } from 'react';
import { Text, StyleSheet, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';
import { TextSmallSize, TextdefaultSize } from '../../constants/Fonts';

interface BOHTlbrSearchBoxProps extends TextInputProps {
  label?: string;
  boxStyle?: ViewStyle;
  labelStyle?: TextStyle;
  width?: number;
}

const BOHTlbrSearchBox: React.FC<BOHTlbrSearchBoxProps> = ({ label, boxStyle, labelStyle, width, style, ...rest }) => {
  return (
    <View style={[styles.searchBox, boxStyle]}>
      {label && <Text style={[styles.searchLabel, labelStyle]}>{label}</Text>}
      <TextInput
        {...rest}
        style={[styles.searchInput, width && {width:width}, style]}
      />
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
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    fontSize: TextSmallSize,
  },
});

export default BOHTlbrSearchBox;