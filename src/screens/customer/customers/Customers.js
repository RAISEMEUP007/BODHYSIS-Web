import React, { useEffect, useState} from 'react';
import { ScrollView, View, Text, TouchableHighlight, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getCustomersData, deleteCustomer, } from '../../../api/Customer';
import { msgStr } from '../../../common/constants/Message';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../common/hooks/UseConfirmModal';
import BasicLayout from '../../../common/components/CustomLayout/BasicLayout';

import { customersStyle } from './styles/CustomersStyle';
import AddCustomerModal from './AddCustomerModal';

const Customers = ({navigation, openInventory}) => {
  const screenHeight = Dimensions.get('window').height;
  
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateCustomerTrigger, setUpdateCustomerTrigger] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const openAddCustomerModal = () => { setAddModalVisible(true); setSelectedCustomer(null)}
  const closeAddCustomerModal = () => { setAddModalVisible(false); setSelectedCustomer(null)}
  const editCustomer = (index) => { setSelectedCustomer(tableData[index]); setAddModalVisible(true); }

  useEffect(()=>{
    if(updateCustomerTrigger == true) getTable();
  }, [updateCustomerTrigger]);

  const removeCustomer = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), ()=>{
      deleteCustomer(id, (jsonRes, status, error)=>{
        switch(status){
          case 200:
            setUpdateCustomerTrigger(true);
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
    getCustomersData((jsonRes, status, error) => {
      switch(status){
        case 200:
          setUpdateCustomerTrigger(false);
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
            <View style={styles.cell}>
              <Text>{item.createdAt}</Text>
            </View>
            <View style={styles.cell}>
              <Text>{item.first_name}</Text>
            </View>
            <View style={styles.cell}>
              <Text>{item.last_name}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.email}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.phone_number}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.mobile_phone}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.country.country}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.home_location_tbl.location}</Text>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity onPress={()=>{editCustomer(index)}}>
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity onPress={()=>{removeCustomer(item.id)}}>
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
      screenName={'Customers'}
    >
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <TouchableHighlight style={styles.button} onPress={openAddCustomerModal}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader]}>{"Created"}</Text>
              <Text style={[styles.columnHeader]}>{"First name"}</Text>
              <Text style={[styles.columnHeader]}>{"Last name"}</Text>
              <Text style={[styles.columnHeader]}>{"Email"}</Text>
              <Text style={[styles.columnHeader]}>{"Phone number"}</Text>
              <Text style={[styles.columnHeader]}>{"Mobile number"}</Text>
              <Text style={[styles.columnHeader]}>{"Country"}</Text>
              <Text style={[styles.columnHeader]}>{"Location"}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{"Edit"}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{"DEL"}</Text>
            </View>
            <ScrollView style={{ flex: 1, maxHeight: screenHeight-220 }}>
              {renderTableData()}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
      
      <AddCustomerModal
        isModalVisible={isAddModalVisible}
        Customer={selectedCustomer}
        setUpdateCustomerTrigger = {setUpdateCustomerTrigger} 
        closeModal={closeAddCustomerModal}
      />
    </BasicLayout>
  );
};

const styles = customersStyle;

export default Customers;