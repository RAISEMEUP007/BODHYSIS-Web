import React, { ReactNode } from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

interface BOHTHProps extends TextProps {
  children?: ReactNode;
  width?: number;
  lastCell?: boolean;
}

const BOHTH: React.FC<BOHTHProps> = ({ children, width, lastCell, style, ...rest }) => {
  return (
    <Text
      {...rest}
      style={[
        styles.defaultTheme, 
        width && {width:width}, 
        lastCell && {borderRightWidth:0},
        style
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultTheme: {
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    whiteSapce: 'noWrap',
  },
});

export default BOHTH;