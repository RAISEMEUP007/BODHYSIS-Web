import React, { useEffect, useState} from 'react';
import { ScrollView, View, Text, TouchableHighlight, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';

import {getSeasonsData, saveSeasonCell, deleteSeason } from '../../../api/Price';
import { msgStr } from '../../../common/constants/Message';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../common/hooks/UseConfirmModal';

import { seasonsStyle } from './styles/SeasonsStyle';
import AddSeasonModal from './AddSeasonModal';

const Seasons = () => {
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const openAddSeasonModal = () => { setAddModalVisible(true); };
  const closeAddSeasonModal = () => { setAddModalVisible(false); }
  const [updateSeasonTrigger, setUpdateSeasonTrigger] = useState(true);
  
  useEffect(()=>{
    if(updateSeasonTrigger == true) getTable();
  }, [updateSeasonTrigger]);

  const changeCellData = (index, key, newVal) => {
    const updatedTableData = [ ...tableData ];
    updatedTableData[index] = {
      ...updatedTableData[index],
      [key]: newVal 
    };
    setTableData(updatedTableData);
  };  

  const saveCellData = (id, column, value, callback) => {
    value = value ? value : "";

    saveSeasonCell(id, column, value, (jsonRes, status, error)=>{
      switch(status){
        case 200:
          if(callback) callback();
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          setUpdateSeasonTrigger(true);
          console.log(jsonRes);
          if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    });
  }

  const removeSeason = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), ()=>{
      deleteSeason(id, (jsonRes, status, error)=>{
        switch(status){
          case 200:
            setUpdateSeasonTrigger(true);
            showAlert('success', jsonRes.message);
            break;
          default:
            if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
            else showAlert('error', msgStr('unknownError'));
            break;
        }
      })
    });
  }

  const getTable = () => {
    getSeasonsData((jsonRes, status, error) => {
      switch(status){
        case 200:
          setUpdateSeasonTrigger(false);
          setTableData(jsonRes);
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    })
  }

  const resetActiveSeason = (id) => {
    tableData.map((item, index) => {
      if(item.is_active){
        saveCellData(item.id, 'is_active', 0, ()=>{
          saveCellData(id, 'is_active', 1, ()=>{
            setUpdateSeasonTrigger(true);
          });
        });
      }
    })
  }

  const renderTableData = () => {
    const rows = [];
    if(tableData.length > 0){
      tableData.map((item, index) => {
        rows.push( 
          <View key={index} style={styles.tableRow}>
            <View style={styles.cell}>
              <TextInput style={styles.cellInput}
                value={item.season}
                onChangeText={(value) => {
                  changeCellData(index, 'season', value);
                }}
                onBlur={(e) => {
                  saveCellData(item.id, 'season', item.season);
                }}
              />
              <View style={styles.deleteRow}>
                <TouchableOpacity onPress={()=>{removeSeason(item.id)}}>
                  <FontAwesome5 style={styles.deleteRow} size={TextMediumSize} name="times" color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.cell, styles.radioButtonCell]}>
              <TouchableOpacity onPress={()=>{resetActiveSeason(item.id)}}>
                <FontAwesome5
                  name={item.is_active?'dot-circle':'circle'}
                  size={15}
                  color={item.is_active ? "#007bff" : "#6c757d"}
                />
              </TouchableOpacity>
            </View>
          </View>
        );
      });
    }else{
      <></>
    }
    return <>{rows}</>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableHighlight style={styles.button} onPress={openAddSeasonModal}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableHighlight>
      </View>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.columnHeader}>{"Season"}</Text>
          <Text style={[styles.columnHeader, styles.radioButtonCell]}>{"Active"}</Text>
        </View>
        <ScrollView>
            {renderTableData()}
        </ScrollView>
      </View>

      <AddSeasonModal
        isModalVisible={isAddModalVisible}
        setUpdateSeasonTrigger = {setUpdateSeasonTrigger} 
        closeModal={closeAddSeasonModal}
      />
    </View>
  );
};

const styles = seasonsStyle;

export default Seasons;