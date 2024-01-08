import React, { useEffect, useState} from 'react';
import { ScrollView, View, Text, TouchableHighlight, TouchableOpacity, Dimensions, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getReservationTypesData, deleteReservationType, } from '../../../api/Settings';
import { msgStr } from '../../../common/constants/Message';
import { API_URL } from '../../../common/constants/AppConstants';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../common/hooks/UseConfirmModal';
import BasicLayout from '../../../common/components/CustomLayout/BasicLayout';

import { reservationTypesStyle } from './styles/ReservationTypesStyle';
import AddReservationTypeModal from './AddReservationTypeModal';

const ReservationTypes = ({navigation, openInventory}) => {
  const screenHeight = Dimensions.get('window').height;
  
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateReservationTypeTrigger, setUpdateReservationTypeTrigger] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedReservationType, setSelectedReservationType] = useState(null);

  const openAddReservationTypeModal = () => { setAddModalVisible(true); setSelectedReservationType(null)}
  const closeAddReservationTypeModal = () => { setAddModalVisible(false); setSelectedReservationType(null)}
  const editReservationType = (index) => { setSelectedReservationType(tableData[index]); setAddModalVisible(true); }

  const changeCellData = (index, key, newVal) => {
    const updatedTableData = [ ...tableData ];
    updatedTableData[index] = {
      ...updatedTableData[index],
      [key]: newVal 
    };
    setTableData(updatedTableData);
  };  

  useEffect(()=>{
    if(updateReservationTypeTrigger == true) getTable();
  }, [updateReservationTypeTrigger]);

  const removeReservationType = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), ()=>{
      deleteReservationType(id, (jsonRes, status, error)=>{
        switch(status){
          case 200:
            setUpdateReservationTypeTrigger(true);
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
    getReservationTypesData((jsonRes, status, error) => {
      switch(status){
        case 200:
          setUpdateReservationTypeTrigger(false);
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
            <View style={[styles.imageCell]}>
              {item.img_url ? (
                <Image 
                  source={{ uri: API_URL+item.img_url }}
                  style={styles.cellImage} 
                  onError={() => {
                    changeCellData(index, 'img_url', null);
                }}/>
              ) : (
                <FontAwesome5 name="image" size={26} color="#666"></FontAwesome5>
              )}
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity onPress={()=>{editReservationType(index)}}>
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity onPress={()=>{removeReservationType(item.id)}}>
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
      screenName={'Reservation types'}
    >
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <TouchableHighlight style={styles.button} onPress={openAddReservationTypeModal}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader, {width: 300}]}>{"Name"}</Text>
              <Text style={[styles.columnHeader, styles.imageCell]}>{"Image"}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{"Edit"}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{"DEL"}</Text>
            </View>
            <ScrollView style={{ flex: 1, maxHeight: screenHeight-220 }}>
              {renderTableData()}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
      
      <AddReservationTypeModal
        isModalVisible={isAddModalVisible}
        ReservationType={selectedReservationType}
        setUpdateReservationTypeTrigger = {setUpdateReservationTypeTrigger} 
        closeModal={closeAddReservationTypeModal}
      />
    </BasicLayout>
  );
};

const styles = reservationTypesStyle;

export default ReservationTypes;