import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

interface BOHTRProps extends ViewProps {
  children?: ReactNode;
}

const BOHTR: React.FC<BOHTRProps> = ({ children, style, ...rest }) => {
  return (
    <View
      {...rest}
      style={[styles.defaultTheme, style]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  defaultTheme: {
    flexDirection:'row',
    alignItems:'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default BOHTR;