import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import {
  getProductLinesData,
  deleteProductLine,
  getQuantitiesByLine,
} from '../../../../api/Product';
import { msgStr } from '../../../../common/constants/Message';
import { TextMediumSize } from '../../../../common/constants/Fonts';
import { useAlertModal } from '../../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../../common/hooks/UseConfirmModal';
import BasicLayout from '../../../../common/components/CustomLayout/BasicLayout';

import { productLinesStyle } from './styles/ProductLinesStyle';
import AddProductLineModal from './AddProductLineModal';

const ProductLines = ({ navigation, openInventory }) => {
  const screenHeight = Dimensions.get('window').height;

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateProductLineTrigger, setUpdateProductLineTrigger] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedLine, setSelectedLine] = useState();

  const openAddProductLineModal = () => {
    setAddModalVisible(true);
    setSelectedLine(null);
  };
  const closeAddProductLineModal = () => {
    setAddModalVisible(false);
    setSelectedLine(null);
  };
  const editProductLine = (index) => {
    setSelectedLine(tableData[index]);
    setAddModalVisible(true);
  };

  useEffect(() => {
    if (updateProductLineTrigger == true) getTable();
  }, [updateProductLineTrigger]);

  const viewSKUs = (searchOptions) => {
    openInventory('Products', { searchOptions });
  };

  const removeProductLine = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deleteProductLine(id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdateProductLineTrigger(true);
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
    getProductLinesData(null, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateProductLineTrigger(false);
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
    getQuantitiesByLine((jsonRes, status, error) => {
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
              <Text style={styles.categoryCell}>{item.line}</Text>
            </View>
            <View style={styles.cell}>
              <Text>{item.category ? item.category.category : ''}</Text>
            </View>
            <View style={styles.cell}>
              <Text>{item.family ? (item.family.family) : ''}</Text>
            </View>
            <View style={[styles.cell, { width: 100 }]}>
              <Text>{item.size ? item.size : ''}</Text>
            </View>
            <View style={[styles.cell, { width: 100, paddingRight: 6, alignItems: 'flex-end' }]}>
              <Text>{item.quantity ? item.quantity : '0'}</Text>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  viewSKUs({
                    categoryId: item.category_id,
                    familyId: item.family_id,
                    lineId: item.id,
                  });
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="search" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  editProductLine(index);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  removeProductLine(item.id);
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
      screenName={'Product Lines'}
    >
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <TouchableHighlight style={styles.button} onPress={openAddProductLineModal}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader, styles.categoryCell]}>{'Line'}</Text>
              <Text style={[styles.columnHeader]}>{'Category'}</Text>
              <Text style={[styles.columnHeader]}>{'Family'}</Text>
              <Text style={[styles.columnHeader, { width: 100 }]}>{'Size'}</Text>
              <Text style={[styles.columnHeader, { width: 100 }]}>{'Quantity'}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{'SKUs'}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{'Edit'}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{'DEL'}</Text>
            </View>
            <ScrollView style={{ flex: 1, maxHeight: screenHeight - 220 }}>
              {renderTableData()}
            </ScrollView>
          </View>

          <AddProductLineModal
            isModalVisible={isAddModalVisible}
            Line={selectedLine}
            setUpdateProductLineTrigger={setUpdateProductLineTrigger}
            closeModal={closeAddProductLineModal}
          />
        </View>
      </ScrollView>
    </BasicLayout>
  );
};

const styles = productLinesStyle;

export default ProductLines;
