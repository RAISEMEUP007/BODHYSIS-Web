import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TouchNav from './TouchNav';
import { TextMediumLargeSize } from '../../constants/Fonts';

const TouchNavGroup = ({ sectionTitle, items, handleItemClick }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>{sectionTitle}</Text>
      <View style={styles.containerRow}>
        {items.map((item, index) => (
          <TouchNav key={index} title={item.title} handlePress={() => handleItemClick(item.title)} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 40,
    },
    label: {
        fontSize: TextMediumLargeSize,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    containerRow: {
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
});

export default TouchNavGroup;
