import React, {useState} from 'react';
import { View, Text, Button, StyleSheet, Modal, Picker, TouchableOpacity, TextInput } from 'react-native';

import { API_URL } from '../../common/constants/appConstants';

const PriceGroup = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAddPriceModalVisible, setAddPriceModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [priceInputValue, setPriceInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  const handleAddButtonClick = () => {
    const payload = {
      group: inputValue,
    };
    fetch(`${API_URL}/price/creategroup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        switch (res.status) {
          default:
            break;
        }
        try {
          const jsonRes = await res.json();
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err) => {
        console.log(err);
        showAlert('error', msgStr('serverError'));
      });
    // setModalVisible(true); // Open the modal when Button 1 is clicked

        // Implement the functionality to add the input value to the modal content or perform any other action
    };

  const handleAddPricePoint = () => {
    // Implement functionality to add the price point
    console.log('Add price point:', priceInputValue, selectedOption);
  };

  const handleButton1Click = () => {
    setModalVisible(true); // Open the modal when Button 1 is clicked
  };

  const handleButton2Click = () => {
    setAddPriceModalVisible(true); // Open the modal when Button 2 is clicked
  };

  const closeModal = () => {
    setModalVisible(false); // Close the modal when the close button is clicked
  };

  const closeAddPriceModal = () => {
    setAddPriceModalVisible(false); // Close the modal for adding price point
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Modal Content</Text>
            <TextInput
              style={styles.input}
              onChangeText={setInputValue}
              value={inputValue}
              placeholder="Enter value"
            />
            <TouchableOpacity onPress={handleAddButtonClick}>
              <Text style={styles.addButton}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal}>
              <Text>Close Modal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
  animationType="slide"
  transparent={true}
  visible={isAddPriceModalVisible}
  onRequestClose={closeAddPriceModal}
>
  <View style={styles.centeredView}>
    <View style={styles.modalView}>
      <Text>Add Price Point</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPriceInputValue}
        value={priceInputValue}
        placeholder="Duration"
      />
  <Picker
    selectedValue={selectedOption}
    style={styles.select}
    onValueChange={(itemValue, itemIndex) =>
      setSelectedOption(itemValue)
    }>
    <Picker.Item label="Select an option" value="" />
    <Picker.Item label="Option 1" value="option1" />
    <Picker.Item label="Option 2" value="option2" />
    {/* Add more options as needed */}
  </Picker>
      <TouchableOpacity onPress={handleAddPricePoint}>
        <Text style={styles.addButton}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={closeAddPriceModal}>
        <Text>Close Modal</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

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


  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 8,
    width: 200
  },
  addButton: {
    backgroundColor: 'blue',
    color: 'white',
    padding: 10,
    textAlign: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  select: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    width: 200
  },
});

export default PriceGroup;
