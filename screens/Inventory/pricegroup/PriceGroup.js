import React, {useState} from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import CreateGroupModal from './CreateGroupModal';
import PricePointModal from './PricePointModal';

const PriceGroup = () => {
  const [isGroupModalVisible, setGroupModalVisible] = useState(false);
  const [isAddPriceModalVisible, setAddPriceModalVisible] = useState(false);
  const [groupName, setGroupname] = useState('');

  const closeGroupModal = () => {
    setGroupModalVisible(false);
  }

  const handleButton1Click = () => {
    setGroupModalVisible(true);
  };

  const handleButton2Click = () => {
    setAddPriceModalVisible(true);
  };

  const closeAddPriceModal = () => {
    setAddPriceModalVisible(false);
  };

  // Render table headers
  const renderTableHeader = () => {
    return (
      <View style={styles.tableHeader}>
        <Text style={[styles.columnHeader, {width: 280}]}>Header 1</Text>
        <Text style={styles.columnHeader}>Header 2</Text>
        <Text style={styles.columnHeader}>Header 3</Text>
        <Text style={styles.columnHeader}>Header 4</Text>
        <Text style={styles.columnHeader}>Header 5</Text>
        <Text style={styles.columnHeader}>Header 6</Text>
        <Text style={styles.columnHeader}>Header 7</Text>
        <Text style={styles.columnHeader}>Header 8</Text>
        <Text style={styles.columnHeader}>Header 9</Text>
        {/* Add more Text components for additional headers */}
      </View>
    );
  };

  // Render table data
  const renderTableData = () => {
    const rows = [];
    for (let i = 1; i <= 10; i++) {
      rows.push(
        <View key={i} style={styles.tableRow}>
          <Text style={[styles.cell, {width: 210}]}>{`cell data 1`}</Text>
          <Text style={[styles.cell, {width: 82}]}>{`cell data 2`}</Text>
          <Text style={[styles.cell, {width: 82}]}>{`cell data 3`}</Text>
          <Text style={[styles.cell, {width: 82}]}>{`cell data 4`}</Text>
          <Text style={[styles.cell, {width: 82}]}>{`cell data 5`}</Text>
          <Text style={[styles.cell, {width: 82}]}>{`cell data 6`}</Text>
          <Text style={[styles.cell, {width: 82}]}>{`cell data 7`}</Text>
          <Text style={[styles.cell, {width: 82}]}>{`cell data 8`}</Text>
          <Text style={[styles.cell, {width: 82}]}>{`cell data 9`}</Text>
          {/* Add more Text components for additional cells */}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Button title="Create price group" onPress={handleButton1Click} />
        <Button title="Add price point" onPress={handleButton2Click} />
      </View>
      <View>
        {renderTableHeader()}
        {renderTableData()}
      </View>

      <CreateGroupModal
        isModalVisible={isGroupModalVisible}
        groupName={groupName} 
        closeModal={closeGroupModal}
      />

      <PricePointModal
        isModalVisible={isAddPriceModalVisible}
        closeModal={closeAddPriceModal}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: '80%',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  columnHeader: {
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default PriceGroup;
