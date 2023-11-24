import React, {useEffect, useState} from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';

import { API_URL } from '../../../common/constants/appConstants';

import CreateGroupModal from './CreateGroupModal';
import PricePointModal from './PricePointModal';

const PriceGroup = () => {
  const [isGroupModalVisible, setGroupModalVisible] = useState(false);
  const [isAddPriceModalVisible, setAddPriceModalVisible] = useState(false);
  const [groupName, setGroupname] = useState('');
  
  const [headerData, setHeaderData] = useState([]);
  const [tableData, setTableData] = useState([]);
  
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

  const getHeaderData = () => {
    fetch(`${API_URL}/price/getheaderdata`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(async (res) => {
      switch (res.status) {
        default:
          break;
      }
      try {
        const jsonRes = await res.json();
        if(jsonRes){
          setHeaderData(jsonRes);
        }
      } catch (err) {
        console.log(err);
      }
    })
    .catch((err) => {
      console.log(err);
      //showAlert('error', msgStr('serverError'));
    });
  }

  const getTableData = () => {
    const payload = {
    };
    fetch(`${API_URL}/price/gettabledata`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(async (res) => {
      switch (res.status) {
        default:
          break;
      }
      try {
        const jsonRes = await res.json();
        if(jsonRes){
          setTableData(jsonRes);
        }
      } catch (err) {
        console.log(err);
      }
    })
    .catch((err) => {
      console.log(err);
      //showAlert('error', msgStr('serverError'));
    });
  }

  useEffect(()=>{
    getHeaderData();
    getTableData();
  }, [])

  const renderTableHeader = () => {
    return (
      <View style={styles.tableHeader}>
        <Text style={[styles.columnHeader, {width: 300}]}>PriceGroup</Text>
        <Text style={styles.columnHeader}>Free</Text>
        {headerData.map((header, index) => (
          <Text key={index} style={styles.columnHeader}>{header}</Text>
        ))}
        <Text style={styles.columnHeader}>Extra day</Text>
      </View>
    );
  };

  // Modify renderTableData function
  const renderTableData = () => {
    const rows = [];
    for (let i in tableData) {
      rows.push(
        <View key={i} style={styles.tableRow}>
          <Text style={[styles.cell, {width: 300}]}>{i}</Text>
          <Text style={styles.cell}>{tableData[i].is_free}</Text>
          {headerData.map((header, index) => (
            <Text key={index} style={styles.cell}>
              {tableData[i].data[index]}
            </Text>
          ))}
          <Text style={styles.cell}>{tableData[i].extra_day}</Text>
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <View style={styles.tableContainer}>
        <View style={styles.toolbar}>
          <TouchableHighlight style={styles.button} onPress={handleButton1Click}>
            <Text style={styles.buttonText}>Create price group</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={handleButton2Click}>
            <Text style={styles.buttonText}>Add price point</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.table}>
            {renderTableHeader()}
            {renderTableData()}
        </View>
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
    alignItems: 'flex-start',
    padding: 16,
    paddingTop: 32,
  },

  tableContainer: {
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
 
  buttonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff', // Bootstrap primary color
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 32,
    margin: 5,
  },

  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'column',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  columnHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    padding: 8,
    width: 100,
  },
  cell: {
    padding: 8,
    width: 100,
  },
});

export default PriceGroup;
