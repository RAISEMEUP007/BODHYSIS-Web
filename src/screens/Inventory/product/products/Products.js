import React, { useEffect, useState} from 'react';
import { ScrollView, View, Text, TouchableHighlight, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import {getProductsData, deleteProduct } from '../../../../api/Product';
import { msgStr } from '../../../../common/constants/Message';
import { TextMediumSize } from '../../../../common/constants/Fonts';
import { useAlertModal } from '../../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../../common/hooks/UseConfirmModal';
import BasicLayout from '../../../../common/components/CustomLayout/BasicLayout';

import { productsStyle } from './styles/ProductsStyle';
import AddProductModal from './AddProductModal';
import QuickAddProductModal from './QuickAddProductModal';
import { TextInput } from 'react-native-web';

const Products = ({navigation, openInventory}) => {
  const screenHeight = Dimensions.get('window').height;

  const StatusObj = {
    1: 'Ordered',
    2: 'Ready',
    3: 'Checked out',
    4: 'Broken',
    5: 'Sold',
    6: 'Transferred',
  };
  

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateProductTrigger, setUpdateProductsTrigger] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isQuickAddModalVisible, setQuickAddModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openAddProductModal = () => { setAddModalVisible(true); setSelectedProduct(null)}
  const closeAddProductModal = () => { setAddModalVisible(false); setSelectedProduct(null)}
  const editProduct = (item) => { setSelectedProduct(item); setAddModalVisible(true); }

  const openQuickAddProductModal = () => { setQuickAddModalVisible(true); setSelectedProduct(null)}
  const closeQuickAddProductModal = () => { setQuickAddModalVisible(false); setSelectedProduct(null)}

  const [searchProduct, setSearchProduct] = useState('');
  const [searchBarcode, setSearchBarcode] = useState('');
  const [searchSize, setSearchSize] = useState('');

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
    const filteredData = tableData.filter(item => {
      const productMatches = item.product.toLowerCase().includes(searchProduct.trim().toLowerCase());
      const barcodeMatches = item.barcode && item.barcode.toLowerCase().includes(searchBarcode.trim().toLowerCase());
      const sizeMatches = item.line && item.line.size.toLowerCase().includes(searchSize.trim().toLowerCase());
      return productMatches && barcodeMatches && sizeMatches;
    });

    const rows = [];
    if(filteredData.length > 0){
      filteredData.map((item, index) => {
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
              <Text style={styles.cell}>{item.line?( item.line.line): ''}</Text>
            </View>
            <View style={[styles.cell, {width:100}]}>
              <Text>{item.line? item.line.size: ''}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cell}>{item.barcode? item.barcode: ''}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cell}>{item.serial_number? item.serial_number: ''}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cell}>{item.home_location_tbl? item.home_location_tbl.location: ''}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cell}>{item.current_location_tbl? item.current_location_tbl.location: ''}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cell}>{item.status? StatusObj[item.status]: ''}</Text>
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
    <BasicLayout
      navigation = {navigation}
      goBack={()=>{
        openInventory(null)
      }}
      screenName={'Products'}
    >
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <View style={styles.searchBox}>
              <Text style={styles.searchLabel}>Product</Text>
              <TextInput
                style={styles.searchInput}
                placeholder=""
                value={searchProduct}
                onChangeText={setSearchProduct}
              />
            </View>
            <View style={styles.searchBox}>
              <Text style={styles.searchLabel}>Size</Text>
              <TextInput
                style={styles.searchInput}
                placeholder=""
                value={searchSize}
                onChangeText={setSearchSize}
              />
            </View>
            <View style={styles.searchBox}>
              <Text style={styles.searchLabel}>Barcode</Text>
              <TextInput
                style={styles.searchInput}
                placeholder=""
                value={searchBarcode}
                onChangeText={setSearchBarcode}
              />
            </View>
          </View>
          <View style={styles.toolbar}>
            <TouchableHighlight style={styles.button} onPress={openAddProductModal}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={openQuickAddProductModal}>
              <Text style={styles.buttonText}>Quick Add</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader, {width:250}]}>{"Product"}</Text>
              <Text style={[styles.columnHeader]}>{"Category"}</Text>
              <Text style={[styles.columnHeader]}>{"Family"}</Text>
              <Text style={[styles.columnHeader]}>{"Line"}</Text>
              <Text style={[styles.columnHeader, {width:100}]}>{"Size"}</Text>
              <Text style={[styles.columnHeader]}>{"Barcode"}</Text>
              <Text style={[styles.columnHeader]}>{"Serial Number"}</Text>
              <Text style={[styles.columnHeader]}>{"Home Location"}</Text>
              <Text style={[styles.columnHeader]}>{"Current Location"}</Text>
              <Text style={[styles.columnHeader]}>{"Status"}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{"Edit"}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{"DEL"}</Text>
            </View>
            <ScrollView style={{ flex: 1, maxHeight: screenHeight - 280 }}>
              {renderTableData()}
            </ScrollView>
          </View>

          <AddProductModal
            isModalVisible={isAddModalVisible}
            Product={selectedProduct}
            setUpdateProductsTrigger = {setUpdateProductsTrigger} 
            closeModal={closeAddProductModal}
          />
          <QuickAddProductModal
            isModalVisible={isQuickAddModalVisible}
            Product={selectedProduct}
            setUpdateProductsTrigger = {setUpdateProductsTrigger} 
            closeModal={closeQuickAddProductModal}
          />
        </View>
      </ScrollView>
    </BasicLayout>
  );
};

const styles = productsStyle;

export default Products;