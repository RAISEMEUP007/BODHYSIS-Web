import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const TouchNav = ({ title, handlePress }) => {
  return (
    <TouchableOpacity style={styles.item} onPress={handlePress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    item: {
        flexBasis: "40%",
        padding: 10,
        backgroundColor: 'white',
        border: '1px solid gray',
        marginTop: "2.5%",
        marginHorizontal: "5%",
        marginBottom: 5,
    },
});

export default TouchNav;
