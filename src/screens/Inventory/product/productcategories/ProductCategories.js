import React, { useEffect, useState} from 'react';
import { ScrollView, View, Text, TouchableHighlight, TextInput, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import {getProductCategoriesData, saveProductCategoryCell, deleteProductCategory, deleteProductFamily } from '../../../../api/Product';
import { msgStr } from '../../../../common/constants/Message';
import { API_URL } from '../../../../common/constants/AppConstants';
import { TextMediumSize, TextSmallSize } from '../../../../common/constants/Fonts';
import { useAlertModal } from '../../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../../common/hooks/UseConfirmModal';

import { productCategoriesStyle } from './styles/ProductCategoriesStyle';
import AddProductCategoryModal from './AddProductCategoryModal';
import UpdateProductCategoryModal from './UpdateProductCategoryModal';
import AddProductFamilyModal from './AddProductFamilyModal';
import UpdateProductFamilyModal from './UpdateProductFamilyModal';

const ProductCategories = () => {
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateProductCategoryTrigger, setUpdateProductCategoryTrigger] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [isAddFamilyModalVisible, setAddFamilyModalVisible] = useState(false);
  const [isUpdateFamilyModalVisible, setUpdateFamilyModalVisible] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null);

  const openAddProductCategoryModal = () => { setAddModalVisible(true); };
  const closeAddProductCategoryModal = () => { setAddModalVisible(false); }
  const editProductCategory = (item) => { setSelectedCategory(item); setUpdateModalVisible(true); }
  const closeUpdateProductCategoryModal = () => { setUpdateModalVisible(false); }
  
  const openAddProductFamilyModal = (item) => { setSelectedCategory(item); setAddFamilyModalVisible(true); };
  const closeAddProductFamilyModal = () => { setAddFamilyModalVisible(false); }
  const editProductFamily = (item) => { setSelectedFamily(item); setUpdateFamilyModalVisible(true); }
  const closeUpdateProductFamilyModal = () => { setUpdateFamilyModalVisible(false); }

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

  const removeProductFamily = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), ()=>{
      deleteProductFamily(id, (jsonRes, status, error)=>{
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

  const renderFamilyData = (familyData) => {
    const rows = [];
    if(familyData.length > 0){
      familyData.map((item, index) => {
        rows.push( 
          <View key={index} style={styles.familyRow}>
            <View style={[styles.familyIconCell, {width:40}]}>
              <TouchableOpacity onPress={()=>{}}>
                <FontAwesome5 size={TextSmallSize} name="chevron-right" color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellInput}>{item.family}</Text>
            </View>
            <View style={[styles.familyIconCell]}>
              {item.img_url ? (
                <Image source={{ uri: API_URL+item.img_url }} style={styles.cellImage}/>
              ) : (
                <Text >no image</Text>
              )}
            </View>
            <View style={[styles.familyIconCell]}>
              <TouchableOpacity onPress={()=>{openAddProductFamilyModal({id:item.id, category:item.category, img_url:item.img_url})}}>
                <FontAwesome5 size={TextMediumSize} name="plus-square" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.familyIconCell]}>
              <TouchableOpacity onPress={()=>{editProductFamily({id:item.id, family:item.family, category_id:item.category_id, img_url:item.img_url})}}>
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.familyIconCell]}>
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

  const renderTableData = () => {
    const rows = [];
    if(tableData.length > 0){
      tableData.map((item, index) => {
        rows.push( 
          <View key={index} style={styles.tableRow}>
            <View style={styles.categoryCell}>
              <Text style={styles.categoryCell}>{item.category}</Text>
            </View>
            <View style={[styles.imageCell]}>
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

      {selectedCategory && (<UpdateProductCategoryModal
        isModalVisible={isUpdateModalVisible}
        item = {selectedCategory}
        setUpdateProductCategoryTrigger = {setUpdateProductCategoryTrigger} 
        closeModal={closeUpdateProductCategoryModal}
      />)}

      {selectedCategory && (<AddProductFamilyModal
        isModalVisible={isAddFamilyModalVisible}
        categoryId={selectedCategory.id}
        setUpdateProductFamilyTrigger = {setUpdateProductCategoryTrigger} 
        closeModal={closeAddProductFamilyModal}
      />)}

      {selectedFamily && (<UpdateProductFamilyModal
        isModalVisible={isUpdateFamilyModalVisible}
        item = {selectedFamily}
        setUpdateProductFamilyTrigger = {setUpdateProductCategoryTrigger} 
        closeModal={closeUpdateProductFamilyModal}
      />)}
    </View>
  );
};

const styles = productCategoriesStyle;

export default ProductCategories;