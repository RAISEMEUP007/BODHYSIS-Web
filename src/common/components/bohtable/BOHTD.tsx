import React, { ReactNode } from 'react';
import { Text, StyleSheet, TextProps, View, ViewProps } from 'react-native';

interface BOHTDProps extends ViewProps {
  children?: ReactNode;
  width?: number;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify' | undefined;
  textProps?: TextProps;
}

const BOHTD: React.FC<BOHTDProps> = ({ children, width, textAlign, textProps, style, ...rest }) => {
  return (
    <View
      {...rest}
      style={[styles.defaultTheme, width && {width:width}, style]}
    >
      <Text
        style={textAlign && {textAlign}}
        {...textProps}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  defaultTheme: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default BOHTD;