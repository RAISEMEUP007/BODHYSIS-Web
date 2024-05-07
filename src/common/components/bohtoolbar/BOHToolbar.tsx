import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

interface BOHToolbarProps extends ViewProps {
  children?: ReactNode;
}

const BOHToolbar: React.FC<BOHToolbarProps> = ({ children, style, ...rest }) => {
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
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
});

export default BOHToolbar;