import React, { useEffect, useState} from 'react';
import { ScrollView, View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import {getProductsData, deleteProduct } from '../../../../api/Product';
import { msgStr } from '../../../../common/constants/Message';
import { TextMediumSize } from '../../../../common/constants/Fonts';
import { useAlertModal } from '../../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../../common/hooks/UseConfirmModal';

import { productsStyle } from './styles/ProductsStyle';
import AddProductModal from './AddProductModal';

const Products = () => {
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateProductTrigger, setUpdateProductsTrigger] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openAddProductModal = () => { setAddModalVisible(true); setSelectedProduct(null)}
  const closeAddProductModal = () => { setAddModalVisible(false); setSelectedProduct(null)}
  const editProduct = (item) => { setSelectedProduct(item); setAddModalVisible(true); }

  useEffect(()=>{
    if(updateProductTrigger == true) getTable();
  }, [updateProductTrigger]);

  const removeProduct = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), ()=>{
      deleteProduct(id, (jsonRes, status, error)=>{
        switch(status){
          case 200:
            setUpdateProductsTrigger(true);
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
    getProductsData((jsonRes, status, error) => {
      switch(status){
        case 200:
          setUpdateProductsTrigger(false);
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
              <Text style={styles.categoryCell}>{item.product}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cell}>{item.category? item.category.category: ''}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cell}>{item.family? item.family.family: ''}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cell}>{item.line? item.line.line: ''}</Text>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity onPress={()=>{editProduct(item)}}>
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity onPress={()=>{removeProduct(item.id)}}>
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
        <TouchableHighlight style={styles.button} onPress={openAddProductModal}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableHighlight>
      </View>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.columnHeader, {width:400}]}>{"Product"}</Text>
          <Text style={[styles.columnHeader]}>{"Category"}</Text>
          <Text style={[styles.columnHeader]}>{"Family"}</Text>
          <Text style={[styles.columnHeader]}>{"Line"}</Text>
          <Text style={[styles.columnHeader, styles.IconCell]}>{"Edit"}</Text>
          <Text style={[styles.columnHeader, styles.IconCell]}>{"DEL"}</Text>
        </View>
        <ScrollView>
          {renderTableData()}
        </ScrollView>
      </View>

      <AddProductModal
        isModalVisible={isAddModalVisible}
        Product={selectedProduct}
        setUpdateProductsTrigger = {setUpdateProductsTrigger} 
        closeModal={closeAddProductModal}
      />
    </View>
  );
};

const styles = productsStyle;

export default Products;