import React, { useEffect, useState} from 'react';
import { ScrollView, View, Text, TouchableHighlight, TouchableOpacity, Image, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getProductCategoriesData, deleteProductCategory } from '../../../../api/Product';
import { msgStr } from '../../../../common/constants/Message';
import { API_URL } from '../../../../common/constants/AppConstants';
import { TextMediumSize } from '../../../../common/constants/Fonts';
import { useAlertModal } from '../../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../../common/hooks/UseConfirmModal';
import BasicLayout from '../../../../common/components/CustomLayout/BasicLayout';

import { productCategoriesStyle } from './styles/ProductCategoriesStyle';
import AddProductCategoryModal from './AddProductCategoryModal';
import UpdateProductCategoryModal from './UpdateProductCategoryModal';

const ProductCategories = ({navigation, openInventory}) => {
  const screenHeight = Dimensions.get('window').height;
  
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateProductCategoryTrigger, setUpdateProductCategoryTrigger] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const openAddProductCategoryModal = () => { setAddModalVisible(true); };
  const closeAddProductCategoryModal = () => { setAddModalVisible(false); }
  const editProductCategory = (item) => { setSelectedCategory(item); setUpdateModalVisible(true); }
  const closeUpdateProductCategoryModal = () => { setUpdateModalVisible(false); }

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
              <TouchableOpacity onPress={()=>{editProductCategory(item)}}>
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
    <BasicLayout
      navigation = {navigation}
      goBack={()=>{
        openInventory(null)
      }}
      screenName={'Product Categories'}
    >
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <TouchableHighlight style={styles.button} onPress={openAddProductCategoryModal}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader, styles.categoryCell]}>{"Category"}</Text>
              <Text style={[styles.columnHeader, styles.imageCell]}>{"Image"}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{"Edit"}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{"DEL"}</Text>
            </View>
            <ScrollView style={{ flex: 1, maxHeight: screenHeight-220 }}>
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
        </View>
      </ScrollView>
    </BasicLayout>
  );
};

const styles = productCategoriesStyle;

export default ProductCategories;