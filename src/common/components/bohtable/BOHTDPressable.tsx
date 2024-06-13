import React, { ReactNode } from 'react';
import { Text, StyleSheet, TextProps, View, PressableProps, Pressable, StyleProp, ViewStyle, PressableStateCallbackType } from 'react-native';

interface BOHTDPressableProps extends PressableProps {
  children?: ReactNode;
  width?: number;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify' | undefined;
  textProps?: TextProps;
  style?: ViewStyle;
}

const BOHTDPressable: React.FC<BOHTDPressableProps> = ({ children, width, textAlign, textProps, style, ...rest }) => {
  return (
    <Pressable
      {...rest}
      style={[styles.defaultTheme, width && {width:width}, style]}
    >
      <Text
        style={textAlign && {textAlign}}
        {...textProps}
      >
        {children}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  defaultTheme: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default BOHTDPressable;