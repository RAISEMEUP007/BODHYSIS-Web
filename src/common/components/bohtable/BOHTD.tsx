import React, { ReactNode } from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

interface BOHTDProps extends TextProps {
  children?: ReactNode;
  width?: number;
}

const BOHTD: React.FC<BOHTDProps> = ({ children, width, style, ...rest }) => {
  return (
    <Text
      {...rest}
      style={[styles.defaultTheme, width && {width:width}, style]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultTheme: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default BOHTD;