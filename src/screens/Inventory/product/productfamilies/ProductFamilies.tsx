import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import {
  getProductFamiliesData,
  deleteProductFamily,
  getQuantitiesByFamily,
} from '../../../../api/Product';
import { msgStr } from '../../../../common/constants/Message';
import { API_URL } from '../../../../common/constants/AppConstants';
import { TextMediumSize } from '../../../../common/constants/Fonts';
import { useAlertModal } from '../../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../../common/hooks/UseConfirmModal';
import BasicLayout from '../../../../common/components/CustomLayout/BasicLayout';

import { productFamiliesStyle } from './styles/ProductFamiliesStyle';
import AddProductFamilyModal from './AddProductFamilyModal';

const ProductFamilies = ({ navigation, openInventory }) => {
  const screenHeight = Dimensions.get('window').height;

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateProductFamilyTrigger, setUpdateProductFamilyTrigger] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null);

  const openAddProductFamilyModal = () => {
    setAddModalVisible(true);
    setSelectedFamily(null);
  };
  const closeAddProductFamilyModal = () => {
    setAddModalVisible(false);
    setSelectedFamily(null);
  };
  const editProductFamily = (item) => {
    setSelectedFamily(item);
    setAddModalVisible(true);
  };

  const changeCellData = (index, key, newVal) => {
    const updatedTableData = [...tableData];
    updatedTableData[index] = {
      ...updatedTableData[index],
      [key]: newVal,
    };
    setTableData(updatedTableData);
  };

  useEffect(() => {
    if (updateProductFamilyTrigger == true) getTable();
  }, [updateProductFamilyTrigger]);

  const removeProductFamily = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deleteProductFamily(id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdateProductFamilyTrigger(true);
            showAlert('success', jsonRes.message);
            break;
          default:
            if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
            else showAlert('error', msgStr('unknownError'));
            break;
        }
      });
    });
  };

  const getTable = () => {
    getProductFamiliesData(null, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateProductFamilyTrigger(false);
          setQuantities(jsonRes);
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    });
  };

  const setQuantities = (tableData) => {
    getQuantitiesByFamily((jsonRes, status, error) => {
      switch (status) {
        case 200:
          if (jsonRes) {
            for (let i = 0; i < tableData.length; i++) {
              let id = tableData[i].id;
              if (jsonRes[id] !== undefined) {
                tableData[i].quantity = jsonRes[id];
              }
            }
          }
          setTableData(tableData);
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    });
  };

  const renderTableData = () => {
    const rows = [];
    if (tableData.length > 0) {
      tableData.map((item, index) => {
        rows.push(
          <View key={index} style={styles.tableRow}>
            <View style={styles.categoryCell}>
              <Text style={styles.categoryCell}>{item.family}</Text>
            </View>
            <View style={styles.categoryCell}>
              <Text style={styles.categoryCell}>{item.display_name}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cell}>{item.category.category}</Text>
            </View>
            <View style={[styles.cell, { width: 100, paddingRight: 6, alignItems: 'flex-end' }]}>
              <Text>{item.quantity ? item.quantity : '0'}</Text>
            </View>
            <View style={[styles.imageCell]}>
              {item.img_url ? (
                <Image
                  source={{ uri: API_URL + item.img_url }}
                  style={styles.cellImage}
                  onError={() => {
                    changeCellData(index, 'img_url', null);
                  }}
                />
              ) : (
                <FontAwesome5 name="image" size={26} color="#666"></FontAwesome5>
              )}
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  editProductFamily(item);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  removeProductFamily(item.id);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="times" color="black" />
              </TouchableOpacity>
            </View>
          </View>
        );
      });
    } else {
      <></>;
    }
    return <>{rows}</>;
  };

  return (
    <BasicLayout
      navigation={navigation}
      goBack={() => {
        openInventory(null);
      }}
      screenName={'Product Families'}
    >
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <TouchableHighlight style={styles.button} onPress={openAddProductFamilyModal}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader, styles.categoryCell]}>{'Family'}</Text>
              <Text style={[styles.columnHeader]}>{'Display name'}</Text>
              <Text style={[styles.columnHeader]}>{'Category'}</Text>
              <Text style={[styles.columnHeader, { width: 100 }]}>{'Quantity'}</Text>
              <Text style={[styles.columnHeader, styles.imageCell]}>{'Image'}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{'Edit'}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{'DEL'}</Text>
            </View>
            <ScrollView style={{ flex: 1, maxHeight: screenHeight - 240 }}>
              {renderTableData()}
            </ScrollView>
          </View>

          <AddProductFamilyModal
            isModalVisible={isAddModalVisible}
            family={selectedFamily}
            setUpdateProductFamilyTrigger={setUpdateProductFamilyTrigger}
            closeModal={closeAddProductFamilyModal}
          />
        </View>
      </ScrollView>
    </BasicLayout>
  );
};

const styles = productFamiliesStyle;

export default ProductFamilies;
