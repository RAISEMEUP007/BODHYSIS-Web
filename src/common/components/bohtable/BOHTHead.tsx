import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

interface BOHTHeadProps extends ViewProps {
  children?: ReactNode;
}

const BOHTHead: React.FC<BOHTHeadProps> = ({ children, style, ...rest }) => {
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
    backgroundColor: '#f5f5f5',
    // borderBottomWidth: 1,
    // borderBottomColor: '#ddd',
  },
});

export default BOHTHead;