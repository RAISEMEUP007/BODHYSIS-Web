import React, { ReactNode } from 'react';
import { Text, StyleSheet, TextProps, ViewStyle, View } from 'react-native';

interface BOHTH2Props extends TextProps {
  children?: ReactNode;
  width?: number;
  lastCell?: boolean;
  BoxStyle?: ViewStyle;
  style?: any;
}

const BOHTH2: React.FC<BOHTH2Props> = ({ children, width, lastCell, BoxStyle, style, ...rest }) => {
  return (
    <View style={[styles.defaultBox, BoxStyle, width && {width:width}, ]}>
      <Text
        {...rest}
        style={[
          styles.defaultTheme, 
          lastCell && {borderRightWidth:0},
          style
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  defaultBox: {
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    backgroundColor: '#f5f5f5',
    height:'100%',
    alignSelf:'stretch',
    // alignItems:'center',
    justifyContent:'center',

  },
  defaultTheme: {
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default BOHTH2;