import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

interface CommonContainerProps extends ViewProps {
  children?: ReactNode;
}

const CommonContainer: React.FC<CommonContainerProps> = ({ children, style, ...rest }) => {
  return (
    <ScrollView horizontal={true}>
      <View
        {...rest}
        style={[styles.defaultTheme, style]}
      >
          {children}
      </View>
    </ScrollView>
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