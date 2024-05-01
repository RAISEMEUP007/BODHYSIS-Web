import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, ScrollViewProps } from 'react-native';

interface BOHTBodyProps extends ScrollViewProps {
  children?: ReactNode;
}

const BOHTBody: React.FC<BOHTBodyProps> = ({ children, style, ...rest }) => {
  return (
    <ScrollView
      {...rest}
      style={[styles.defaultTheme, style]}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  defaultTheme: {
    flex:1,
  },
});

export default BOHTBody;