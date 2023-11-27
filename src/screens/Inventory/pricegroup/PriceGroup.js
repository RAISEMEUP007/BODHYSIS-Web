import React, { useEffect, useState} from 'react';
import { ScrollView, View, Text, TouchableHighlight, TextInput } from 'react-native';
import CheckBox from 'expo-checkbox';

import {getHeaderData, getTableData, setFree, setPriceData, setExtraDay} from '../../../api/Price';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks/useAlertModal';

import { priceGroupStyles } from './styles/PriceGroupStyle';
import CreateGroupModal from './CreateGroupModal';
import PricePointModal from './PricePointModal';

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
      getHeader();
      getTable();
      setUpdatePointTrigger(false);
    }
  }, [updatePointTrigger])

  useEffect(() => {
    if(updateGroupTrigger == true) getTable();
  }, [updateGroupTrigger]);

  const closeGroupModal = () => { setGroupModalVisible(false); }
  const openGroupModal = () => { setGroupModalVisible(true); };
  const openPriceModal = () => { setAddPriceModalVisible(true); };
  const closePriceModal = () => { setAddPriceModalVisible(false); };
  
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
  
  const getHeader = () => {
    getHeaderData((jsonRes, status, error)=>{
      switch(status){
        case 200:
          setHeaderData(jsonRes);
          break;
        default:
          if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    })
  }

  const getTable = () => {
    getTableData((jsonRes, status, error) => {
      switch(status){
        case 200:
          setTableData(jsonRes);
          setUpdateGroupTrigger(false);
          break;
        default:
          if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    })
  }

  const saveFree = (group, isFree) => {
    setFree(group, isFree, (jsonRes, status, error)=>{
      switch(status){
        case 200:
          const updatedTableData = {...tableData};
          updatedTableData[group] = {
            ...updatedTableData[group],
            is_free: isFree
          };
          setTableData(updatedTableData);
          break;
        default:
          if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    });
  };

  const saveCellData = (group, index, cellData) => {
    const groupId = tableData[group].group_id;
    const pointId = headerData[index].id;
    const value = cellData ? cellData : "";

    setPriceData(groupId, pointId, value, (jsonRes, status, error)=>{
      switch(status){
        case 200:
          break;
        default:
          setUpdateGroupTrigger(true);
          if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    });
  }

  const saveExtraDay = (group, extraDay) => {
    setExtraDay(group, extraDay, (jsonRes, status, error)=>{
      switch(status){
        case 200:
          break;
        default:
          setUpdateGroupTrigger(true);
          if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    })
  }

  const renderTableHeader = () => {
    return (
      <View style={styles.tableHeader}>
        <Text style={[styles.columnHeader, {width: 250, textAlign:'left'}]}>PriceGroup</Text>
        <Text style={[styles.columnHeader, styles.cellcheckbox]}>Free</Text>
        {headerData.map((item, index) => (
          <Text key={index} style={styles.columnHeader} pointId={item.id}>{item.header}</Text>
        ))}
        <Text style={styles.columnHeader}>Extra day</Text>
      </View>
    );
  };

  const renderTableData = () => {
    const rows = [];
    for (let i in tableData) {
      rows.push( 
        <View key={i} style={styles.tableRow}>
          <Text style={[styles.cell, {width: 250, textAlign:'left'}]}>{i}</Text>
          <View style={[styles.cell, styles.cellcheckbox]}>
            <CheckBox value={(tableData[i].is_free ? true : false)} onValueChange={(newValue) => saveFree(i, newValue)} />
          </View>
          {tableData[i].data.map((cellData, index) => (
            <TextInput
              key={index}
              style={[styles.cell]}
              value={cellData?cellData.toString():""}
              onChangeText={(value) => {
                changeCellData(i, index, value);
              }}
              onBlur={() => {
                saveCellData(i, index, cellData);
              }}
            />
          ))}
          <TextInput
            style={[styles.cell]}
            value={tableData[i].extra_day ? tableData[i].extra_day.toString() : ""}
            onChangeText={(value) => {
              changeExtraDay(i, value);
            }}
            onBlur={() => {
              saveExtraDay(i, cellData);
            }}
          />
        </View>
      );
    }
    return <>{rows}</>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableHighlight style={styles.button} onPress={openGroupModal}>
          <Text style={styles.buttonText}>Create price group</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={openPriceModal}>
          <Text style={styles.buttonText}>Add price point</Text>
        </TouchableHighlight>
      </View>
      <View style={styles.tableContainer}>
        <ScrollView horizontal={true}>
          <View style={styles.table}>
            {renderTableHeader()}
            <ScrollView>
              {renderTableData()}
            </ScrollView>
          </View>
        </ScrollView>
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
        closeModal={closePriceModal}
      />

    </View>
  );
};

const styles = priceGroupStyles;

export default PriceGroup;