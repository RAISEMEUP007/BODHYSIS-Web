import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { TextMediumSize, TextMediumLargeSize } from '../../constants/Fonts';

const TouchNav = ({ title, icon, handlePress }) => {
  return (
    <TouchableOpacity style={styles.item} onPress={handlePress}>
      <FontAwesome5 name={icon} size={TextMediumLargeSize} color="black" style={{ marginBottom: 10 }} />
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    item: {
        //flexDirection: "row",
        //alignItems: "center",
        flexBasis: "41%",
        padding: TextMediumSize,
        backgroundColor: 'white',
        border: '1px solid #cacaca',
        marginTop: "2.5%",
        marginHorizontal: "4%",
        marginBottom: 5,
        shadowColor:'#b3b3b3',
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowRadius: 6,
    },
});

export default TouchNav;
