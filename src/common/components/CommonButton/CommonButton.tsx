import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Colors } from '../../constants/Colors';

interface Props {
  label: string;
  onPress: () => void;
  onPressWhileDisabled?: () => void;
  type: 'rounded' | 'square';
  backgroundColor?: string;
  textColor?: string;
  width?: number;
  height?: number;
  containerStyle?: ViewStyle;
  disabledConfig?: {
    backgroundColor: string;
    disabled: boolean;
  };
  disabledBackgroundColor?: boolean;
}

export const CommonButton = ({
  label,
  onPress,
  onPressWhileDisabled,
  type,
  backgroundColor = Colors.Secondary.NAVY,
  textColor = Colors.Neutrals.WHITE,
  width = 80,
  containerStyle,
  disabledConfig,
  height,
}: Props) => {
  const buttonStyle = type === 'rounded' ? styles.roundedContainer : styles.squareContainer;
  return (
    <Pressable
      onPress={() => {
        if (disabledConfig && disabledConfig.disabled) {
          if (onPressWhileDisabled) {
            onPressWhileDisabled();
          }
          return;
        }
        onPress && onPress();
      }}
      style={{
        ...buttonStyle,
        backgroundColor: disabledConfig?.disabled
          ? disabledConfig.backgroundColor
          : backgroundColor,
        width,
        ...containerStyle,
        height,
      }}
    >
      <Text style={{ ...styles.label, color: textColor }}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  roundedContainer: {
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: 80,
  },
  squareContainer: {
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: 80,
  },
  label: {
    height: 20,
  },
});
