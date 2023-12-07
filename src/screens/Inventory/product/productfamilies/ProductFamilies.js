import React, { useEffect, useState} from 'react';
import { ScrollView, View, Text, TouchableHighlight, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import {getProductFamiliesData, deleteProductFamily } from '../../../../api/Product';
import { msgStr } from '../../../../common/constants/Message';
import { API_URL } from '../../../../common/constants/AppConstants';
import { TextMediumSize } from '../../../../common/constants/Fonts';
import { useAlertModal } from '../../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../../common/hooks/UseConfirmModal';

import { productFamiliesStyle } from './styles/ProductFamiliesStyle';
import AddProductFamilyModal from './AddProductFamilyModal';

const ProductFamilies = () => {
  const screenHeight = Dimensions.get('window').height;
  
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateProductFamilyTrigger, setUpdateProductFamilyTrigger] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null);

  const openAddProductFamilyModal = () => { setAddModalVisible(true); setSelectedFamily(null)}
  const closeAddProductFamilyModal = () => { setAddModalVisible(false); setSelectedFamily(null)}
  const editProductFamily = (item) => { setSelectedFamily(item); setAddModalVisible(true); }

  useEffect(()=>{
    if(updateProductFamilyTrigger == true) getTable();
  }, [updateProductFamilyTrigger]);

  const removeProductFamily = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), ()=>{
      deleteProductFamily(id, (jsonRes, status, error)=>{
        switch(status){
          case 200:
            setUpdateProductFamilyTrigger(true);
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
    getProductFamiliesData(null, (jsonRes, status, error) => {
      switch(status){
        case 200:
          setUpdateProductFamilyTrigger(false);
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
            <View style={styles.categoryCell}>
              <Text style={styles.categoryCell}>{item.family}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cell}>{item.category.category}</Text>
            </View>
            <View style={[styles.imageCell]}>
              {item.img_url ? (
                <Image source={{ uri: API_URL+item.img_url }} style={styles.cellImage}/>
              ) : (
                <Text >no image</Text>
              )}
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity onPress={()=>{editProductFamily(item)}}>
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity onPress={()=>{removeProductFamily(item.id)}}>
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
    <ScrollView horizontal={true}>
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <TouchableHighlight style={styles.button} onPress={openAddProductFamilyModal}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.columnHeader, styles.categoryCell]}>{"Family"}</Text>
            <Text style={[styles.columnHeader]}>{"Category"}</Text>
            <Text style={[styles.columnHeader, styles.imageCell]}>{"Image"}</Text>
            <Text style={[styles.columnHeader, styles.IconCell]}>{"Edit"}</Text>
            <Text style={[styles.columnHeader, styles.IconCell]}>{"DEL"}</Text>
          </View>
          <ScrollView>
              {renderTableData()}
          </ScrollView>
        </View>

        <AddProductFamilyModal
          isModalVisible={isAddModalVisible}
          family={selectedFamily}
          setUpdateProductFamilyTrigger = {setUpdateProductFamilyTrigger} 
          closeModal={closeAddProductFamilyModal}
        />
      </View>
    </ScrollView>
  );
};

const styles = productFamiliesStyle;

export default ProductFamilies;