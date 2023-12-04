import React, { useEffect, useState} from 'react';
import { ScrollView, View, Text, TouchableHighlight, TextInput, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import {getProductCategoriesData, saveProductCategoryCell, deleteProductCategory } from '../../../../api/Product';
import { msgStr } from '../../../../common/constants/Message';
import { TextMediumSize } from '../../../../common/constants/Fonts';
import { useAlertModal } from '../../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../../common/hooks/UseConfirmModal';

import { productCategoriesStyle } from './styles/ProductCategoriesStyle';
import AddProductCategoryModal from './AddProductCategoryModal';
import UpdateProductCategoryModal from './UpdateProductCategoryModal';
import { API_URL, BASE_URL } from '../../../../common/constants/AppConstants';

const ProductCategories = () => {
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [updateProductCategoryTrigger, setUpdateProductCategoryTrigger] = useState(true);
  const openAddProductCategoryModal = () => { setAddModalVisible(true); };
  const closeAddProductCategoryModal = () => { setAddModalVisible(false); }
  const closeUpdateProductCategoryModal = () => { setUpdateModalVisible(false); }
  const editProductCategory = (item) => {
    setSelectedItem(item);
    setUpdateModalVisible(true);
  }

  useEffect(()=>{
    if(updateProductCategoryTrigger == true) getTable();
  }, [updateProductCategoryTrigger]);

  const changeCellData = (index, key, newVal) => {
    const updatedTableData = [ ...tableData ];
    updatedTableData[index] = {
      ...updatedTableData[index],
      [key]: newVal 
    };
    setTableData(updatedTableData);
  };  

  const saveCellData = (id, column, value, callback) => {

    saveProductCategoryCell(id, column, value, (jsonRes, status, error)=>{
      switch(status){
        case 200:
          if(callback) callback();
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          setUpdateProductCategoryTrigger(true);
          if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    });
  }

  const removeProductCategory = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), ()=>{
      deleteProductCategory(id, (jsonRes, status, error)=>{
        switch(status){
          case 200:
            setUpdateProductCategoryTrigger(true);
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
    getProductCategoriesData((jsonRes, status, error) => {
      switch(status){
        case 200:
          setUpdateProductCategoryTrigger(false);
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

  const resetActiveProductCategory = (id) => {
    tableData.map((item, index) => {
      if(item.is_active){
        saveCellData(item.id, 'is_active', 0, ()=>{
          saveCellData(id, 'is_active', 1, ()=>{
            setUpdateProductCategoryTrigger(true);
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
              <Text style={styles.cellInput}>{item.category}</Text>
            </View>
            <View style={[styles.IconCell]}>
              {item.img_url ? (
                <Image source={{ uri: API_URL+item.img_url }} style={styles.cellImage}/>
              ) : (
                <Text >no image</Text>
              )}
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity onPress={()=>{editProductCategory({id:item.id, category:item.category, img_url:item.img_url})}}>
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity onPress={()=>{removeProductCategory(item.id)}}>
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
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableHighlight style={styles.button} onPress={openAddProductCategoryModal}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableHighlight>
      </View>
      <View style={styles.tableContainer}>
        {/* <View style={styles.tableHeader}>
          <Text style={styles.columnHeader}>{"Category"}</Text>
          <Text style={[styles.IconCell]}>{""}</Text>
        </View> */}
        <ScrollView>
            {renderTableData()}
        </ScrollView>
      </View>

      <AddProductCategoryModal
        isModalVisible={isAddModalVisible}
        setUpdateProductCategoryTrigger = {setUpdateProductCategoryTrigger} 
        closeModal={closeAddProductCategoryModal}
      />

      {selectedItem && (<UpdateProductCategoryModal
        isModalVisible={isUpdateModalVisible}
        item = {selectedItem}
        setUpdateProductCategoryTrigger = {setUpdateProductCategoryTrigger} 
        closeModal={closeUpdateProductCategoryModal}
      />)}
    </View>
  );
};

const styles = productCategoriesStyle;

export default ProductCategories;