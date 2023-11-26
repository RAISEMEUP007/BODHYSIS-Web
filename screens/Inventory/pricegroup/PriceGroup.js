import React, { useEffect, useState} from 'react';
import { View, Text, TouchableHighlight, StyleSheet, TextInput } from 'react-native';
import CheckBox from 'expo-checkbox';

import { API_URL } from '../../../common/constants/appConstants';

import CreateGroupModal from './CreateGroupModal';
import PricePointModal from './PricePointModal';
import { useAlertModal } from '../../../common/hooks/useAlertModal';
import { msgStr } from '../../../common/constants/message';

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

  const saveCellData = (group, index, cellData) => {
    console.log('sss');
    const groupId = tableData[group].group_id;
    const pointId = headerData[index].id;
    const payload = {
      groupId: groupId,
      pointId: pointId,
      value: cellData,
    };
    fetch(`${API_URL}/price/setpricedata`, {
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
        console.log(jsonRes);
        if(res.status == 200){

        }else{
          //showAlert('error', jsonRes.message);
          setUpdateGroupTrigger(true);
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

  const saveExtraDay = (group, extraDay) => {
    const payload = {
      group: group,
      extraDay: extraDay,
    };
    fetch(`${API_URL}/price/saveextraday`, {
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
        }else{
          //showAlert('error', jsonRes.message);
          setUpdateGroupTrigger(true);
        }
      } catch (err) {
        console.log(err);
        setUpdateGroupTrigger(true);
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
        {headerData.map((item, index) => (
          <Text key={index} style={styles.columnHeader} pointId={item.id}>{item.header}</Text>
        ))}
        <Text style={styles.columnHeader}>Extra day</Text>
      </View>
    );
  };

  const handleCheckboxChange = (group, isFree) => {
    setFree(group, isFree, ()=>{
      const updatedTableData = {...tableData};
      updatedTableData[group] = {
        ...updatedTableData[group],
        is_free: isFree
      };
      setTableData(updatedTableData);
    });
  };
  
  const changeCellData = (group, index, newVal) => {
    const updatedTableData = { ...tableData };
    updatedTableData[group] = {
      ...updatedTableData[group],
      data: [
        ...updatedTableData[group].data.slice(0, index),
        newVal,
        ...updatedTableData[group].data.slice(index + 1),
      ],
    };
    setTableData(updatedTableData);
  };  

  const changeExtraDay = (group, extraDay) => {
      const updatedTableData = {...tableData};
      updatedTableData[group] = {
        ...updatedTableData[group],
        extra_day: extraDay
      };
      setTableData(updatedTableData);
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
            <TextInput
              key={index}
              style={[styles.cell]}
              value={cellData}
              onChange={(event) => {
                const value = event.target.value;
                changeCellData(i, index, value);
              }}
              onBlur={(event) => {
                const value = event.target.value;
                saveCellData(i, index, value);
              }}
            />
          ))}
          <TextInput
            style={[styles.cell]}
            value={tableData[i].extra_day?tableData[i].extra_day:""}
            onChange={(event) => {
              const value = event.target.value;
              changeExtraDay(i, value);
            }}
            onBlur={(event) => {
              const value = event.target.value;
              saveExtraDay(i, value);
            }}
          />
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
  focusedCell: {
    borderWidth: 1,
    borderColor: "#ccc",
  }, 
  cellcheckbox: {
    //width: '100%',
    //textAlign: 'center',
    alignItems: 'flex-start',
  },
});

export default PriceGroup;
