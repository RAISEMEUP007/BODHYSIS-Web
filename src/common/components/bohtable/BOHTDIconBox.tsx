import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

interface BOHTDIconBoxProps extends ViewProps {
  children?: ReactNode;
  width?: number;
}

const BOHTDIconBox: React.FC<BOHTDIconBoxProps> = ({ children, width, style, ...rest }) => {
  return (
    <View
      {...rest}
      style={[styles.defaultTheme, width && {width:width}, style]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  defaultTheme: {
    alignItems:'center',
    justifyContent:'center',
  },
});

export default BOHTDIconBox;