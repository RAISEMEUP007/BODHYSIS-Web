import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

interface BOHTableProps extends ViewProps {
  children?: ReactNode;
}

const BOHTable: React.FC<BOHTableProps> = ({ children, style, ...rest }) => {
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
    flex:1,
    marginVertical: 10,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: '#bfbfbf',
    borderLeftWidth: 1,
    borderLeftColor: '#bfBFbf',
    borderRightWidth: 1,
    borderRightColor: '#bfBFbf',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
  },
});

export default BOHTable;