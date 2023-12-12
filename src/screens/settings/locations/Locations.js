import React, { useEffect, useState} from 'react';
import { ScrollView, View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import {getLocationsData, deleteLocation } from '../../../api/Settings';
import { msgStr } from '../../../common/constants/Message';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../common/hooks/UseConfirmModal';
import BasicLayout from '../../../common/components/CustomLayout/BasicLayout';

import { LocationsStyle } from './styles/LocationsStyle';
import AddLocationModal from './AddLocationModal';

const Locations = ({navigation, openInventory}) => {
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateLocationTrigger, setUpdateLocationsTrigger] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const openAddLocationModal = () => { setAddModalVisible(true); setSelectedLocation(null)}
  const closeAddLocationModal = () => { setAddModalVisible(false); setSelectedLocation(null)}
  const editLocation = (item) => { setSelectedLocation(item); setAddModalVisible(true); }

  useEffect(()=>{
    if(updateLocationTrigger == true) getTable();
  }, [updateLocationTrigger]);

  const removeLocation = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), ()=>{
      deleteLocation(id, (jsonRes, status, error)=>{
        switch(status){
          case 200:
            setUpdateLocationsTrigger(true);
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
    getLocationsData((jsonRes, status, error) => {
      switch(status){
        case 200:
          setUpdateLocationsTrigger(false);
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
            <View style={[styles.cell, styles.categoryCell]}>
              <Text style={styles.categoryCell}>{item.location}</Text>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity onPress={()=>{editLocation(item)}}>
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity onPress={()=>{removeLocation(item.id)}}>
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
      goBack={()=>{
        openInventory(null)
      }}
      screenName={'Locations'}
    >
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <TouchableHighlight style={styles.button} onPress={openAddLocationModal}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.columnHeader, {width:400}]}>{"Location"}</Text>
            <Text style={[styles.columnHeader, styles.IconCell]}>{"Edit"}</Text>
            <Text style={[styles.columnHeader, styles.IconCell]}>{"DEL"}</Text>
          </View>
          <ScrollView>
            {renderTableData()}
          </ScrollView>
        </View>

        <AddLocationModal
          isModalVisible={isAddModalVisible}
          Location={selectedLocation}
          setUpdateLocationsTrigger = {setUpdateLocationsTrigger} 
          closeModal={closeAddLocationModal}
        />
      </View>
    </BasicLayout>
  );
};

const styles = LocationsStyle;

export default Locations;