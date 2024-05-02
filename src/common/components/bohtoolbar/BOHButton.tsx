import React, { ReactNode } from 'react';
import { Text, TouchableHighlight, StyleSheet, TouchableHighlightProps, TextStyle } from 'react-native';
import { TextSmallSize } from '../../constants/Fonts';

interface BOHButtonProps extends TouchableHighlightProps {
  label: string;
  labelStyle?: TextStyle;
}

const BOHButton: React.FC<BOHButtonProps> = ({ label, labelStyle, style, ...rest }) => {
  return (
    <TouchableHighlight
      {...rest}
      style={[styles.defaultTheme, style]}
    >
      <Text style={[styles.defaultThemeText, labelStyle]}>{label}</Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  defaultTheme: {
    backgroundColor: '#2e96e1',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: TextSmallSize,
  },
  defaultThemeText: {
    fontSize: TextSmallSize,
    color: 'white',
    textAlign: 'center',
  },
});

export default BOHButton;