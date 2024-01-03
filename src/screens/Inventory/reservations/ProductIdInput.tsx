import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import CommonInput from '../../../common/components/input/CommonInput';
import { CommonButton } from '../../../common/components/CommonButton/CommonButton';
import { Colors } from '../../../common/constants/Colors';
import { Pressable } from 'react-native';

interface Props {
  width?: number;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
}

export const ProductIdInput = ({ width = 260, onChangeText, onSubmit }: Props) => {
  return (
    <View style={{ ...styles.container, width }}>
      <CommonInput
        onChangeText={onChangeText}
        containerStyle={styles.input}
        placeholder="Bike ID"
        width={160}
      />

      <Pressable
        onPress={onSubmit}
        style={{
          height: 35,
          width: 60,
          borderWidth: 1,
          borderRadius: 5,
          marginBottom: 5,
          borderColor: Colors.Secondary.GREEN,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={styles.addText}>{'Add'}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: Colors.Neutrals.DARK,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  input: {
    padding: 0,
    marginTop: 10,
    marginBottom: 0,
  },
  addText: {
    color: Colors.Secondary.GREEN,
  },
});
