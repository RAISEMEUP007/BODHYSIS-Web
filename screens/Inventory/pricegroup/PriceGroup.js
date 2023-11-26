import React, { useEffect, useState} from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import CheckBox from 'expo-checkbox';

import { API_URL } from '../../../common/constants/appConstants';

import CreateGroupModal from './CreateGroupModal';
import PricePointModal from './PricePointModal';
import { useAlertModal } from '../../../common/hooks/useAlertModal';

const PriceGroup = () => {
  const { showAlert } = useAlertModal();

  const [isGroupModalVisible, setGroupModalVisible] = useState(false);
  const [isAddPriceModalVisible, setAddPriceModalVisible] = useState(false);
  const [updateGroupTrigger, setUpdateGroupTrigger] = useState(false);
  const [updatePointTrigger, setUpdatePointTrigger] = useState(true);
  
  const [headerData, setHeaderData] = useState([]);
  const [tableData, setTableData] = useState([]);
  
  useEffect(()=>{
    if(updatePointTrigger == true){
      getHeaderData();
      getTableData();
      setUpdatePointTrigger(false);
    }
  }, [updatePointTrigger])

  useEffect(() => {
    if(updateGroupTrigger == true) getTableData();
  }, [updateGroupTrigger]);

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
      showAlert('error', msgStr('serverError'));
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
          setUpdateGroupTrigger(false);
        }
      } catch (err) {
        console.log(err);
      }
    })
    .catch((err) => {
      console.log(err);
      showAlert('error', msgStr('serverError'));
    });
  }

  const setFree = (group, isFree, callbackfunc) => {
    const payload = {
      group: group,
      isFree: isFree,
    };
    fetch(`${API_URL}/price/setfree`, {
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
        if(res.status == 200){
          callbackfunc();
        }else{
          showAlert('error', jsonRes.message);
        }
      } catch (err) {
        console.log(err);
      }
    })
    .catch((err) => {
      console.log(err);
      showAlert('error', msgStr('serverError'));
    });
  }

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

  const handleCheckboxChange = (index, newValue) => {
    setFree(index, newValue, ()=>{
      const updatedTableData = {...tableData};
      updatedTableData[index] = {
        ...updatedTableData[index],
        is_free: newValue
      };
      setTableData(updatedTableData);
    });
  };  

  const renderTableData = () => {
    const rows = [];
    for (let i in tableData) {
      rows.push(
        <View key={i} style={styles.tableRow}>
          <Text style={[styles.cell, {width: 300}]}>{i}</Text>
          <View style={[styles.cell, styles.cellcheckbox]}>
            <CheckBox style={styles.cellcheckbox} value={(tableData[i].is_free ? true : false)} onValueChange={(newValue) => handleCheckboxChange(i, newValue)} />
          </View>
          {tableData[i].data.map((cellData, index) => (
            <Text key={index} style={styles.cell}>
              {cellData}
            </Text>
          ))}
          <Text style={styles.cell}>{tableData[i].extra_day}</Text>
        </View>
      );
    }
    return <>{rows}</>;
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
        groupName={""}
        setUpdateGroupTrigger = {setUpdateGroupTrigger} 
        closeModal={closeGroupModal}
      />

      <PricePointModal
        isModalVisible={isAddPriceModalVisible}
        setUpdatePointTrigger = {setUpdatePointTrigger} 
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
  cellcheckbox: {
    //width: '100%',
    //textAlign: 'center',
    alignItems: 'flex-start',
  },
});

export default PriceGroup;
