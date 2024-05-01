import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

interface CommonContainerProps extends ViewProps {
  children?: ReactNode;
}

const CommonContainer: React.FC<CommonContainerProps> = ({ children, style, ...rest }) => {
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
    flex: 1,
    alignItems: 'flex-start',
    padding: 38,
    paddingTop: 28,
    paddingBottom: 16,
  },
});

export default CommonContainer;