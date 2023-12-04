import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { TextMediumSize, TextMediumLargeSize } from '../../constants/Fonts';

const TouchNav = ({ title, icon, handlePress }) => {
  return (
    <TouchableOpacity style={styles.item} onPress={handlePress}>
      <FontAwesome5 name={icon} size={TextMediumLargeSize} color="black" style={{ flex: 1, marginBottom: 10 }} />
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    item: {
        flexBasis: "40%",
        padding: 20,
        backgroundColor: 'white',
        border: '1px solid #cacaca',
        marginTop: "2.5%",
        marginHorizontal: "5%",
        marginBottom: 5,
    },
});

export default TouchNav;
