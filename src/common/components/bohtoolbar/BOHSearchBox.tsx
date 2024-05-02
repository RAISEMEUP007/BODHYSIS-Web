import React, { ReactNode } from 'react';
import { Text, StyleSheet, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';
import { TextSmallSize, TextdefaultSize } from '../../constants/Fonts';

interface BOHSearchBoxProps extends TextInputProps {
  label?: string;
  boxStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

const BOHSearchBox: React.FC<BOHSearchBoxProps> = ({ label, boxStyle, labelStyle, style, ...rest }) => {
  return (
    <View style={[styles.searchBox, boxStyle]}>
      <Text style={[styles.searchLabel, labelStyle]}>{label}</Text>
      <TextInput
        {...rest}
        style={[styles.searchInput, style]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 25,
  },
  searchLabel: {
    marginHorizontal: 10,
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
    width: 250,
  },
});

export default BOHSearchBox;