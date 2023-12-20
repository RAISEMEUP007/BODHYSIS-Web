import React, { useEffect, useState} from 'react';
import { ScrollView, View, Text, TouchableHighlight, TouchableOpacity, Dimensions, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getTrucksData, deleteTruck, } from '../../../api/Settings';
import { msgStr } from '../../../common/constants/Message';
import { API_URL } from '../../../common/constants/AppConstants';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../common/hooks/UseConfirmModal';
import BasicLayout from '../../../common/components/CustomLayout/BasicLayout';

import { trucksStyle } from './styles/TrucksStyle';
import AddTruckModal from './AddTruckModal';

const Trucks = ({navigation, openInventory}) => {
  const screenHeight = Dimensions.get('window').height;
  
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateTruckTrigger, setUpdateTruckTrigger] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState(null);

  const openAddTruckModal = () => { setAddModalVisible(true); setSelectedTruck(null)}
  const closeAddTruckModal = () => { setAddModalVisible(false); setSelectedTruck(null)}
  const editTruck = (index) => { setSelectedTruck(tableData[index]); setAddModalVisible(true); }

  const changeCellData = (index, key, newVal) => {
    const updatedTableData = [ ...tableData ];
    updatedTableData[index] = {
      ...updatedTableData[index],
      [key]: newVal 
    };
    setTableData(updatedTableData);
  };  

  useEffect(()=>{
    if(updateTruckTrigger == true) getTable();
  }, [updateTruckTrigger]);

  const removeTruck = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), ()=>{
      deleteTruck(id, (jsonRes, status, error)=>{
        switch(status){
          case 200:
            setUpdateTruckTrigger(true);
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
    getTrucksData((jsonRes, status, error) => {
      switch(status){
        case 200:
          setUpdateTruckTrigger(false);
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
  
  const renderTableData = () => {
    const rows = [];
    if(tableData.length > 0){
      tableData.map((item, index) => {
        rows.push( 
          <View key={index} style={styles.tableRow}>
            <View style={[styles.cell, {width: 300}]}>
              <Text>{item.name}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.short_name}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.barcode}</Text>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity onPress={()=>{editTruck(index)}}>
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity onPress={()=>{removeTruck(item.id)}}>
                <FontAwesome5 size={TextMediumSize} name="times" color="black" />
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
    <BasicLayout
      navigation = {navigation}
      screenName={'Trucks'}
    >
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <TouchableHighlight style={styles.button} onPress={openAddTruckModal}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader, {width: 300}]}>{"Name"}</Text>
              <Text style={[styles.columnHeader]}>{"Short Name"}</Text>
              <Text style={[styles.columnHeader]}>{"Barcode"}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{"Edit"}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{"DEL"}</Text>
            </View>
            <ScrollView style={{ flex: 1, maxHeight: screenHeight-220 }}>
              {renderTableData()}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
      
      <AddTruckModal
        isModalVisible={isAddModalVisible}
        Truck={selectedTruck}
        setUpdateTruckTrigger = {setUpdateTruckTrigger} 
        closeModal={closeAddTruckModal}
      />
    </BasicLayout>
  );
};

const styles = trucksStyle;

export default Trucks;