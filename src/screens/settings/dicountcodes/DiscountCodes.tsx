import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getDiscountCodesData, deleteDiscountCode } from '../../../api/Settings';
import { msgStr } from '../../../common/constants/Message';
import { API_URL } from '../../../common/constants/AppConstants';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../common/hooks/UseConfirmModal';
import BasicLayout from '../../../common/components/CustomLayout/BasicLayout';

import { discountCodesStyle } from './styles/DiscountCodesStyle';
import AddDiscountCodeModal from './AddDiscountCodeModal';
import QuickAddDiscountCodeModal from './QuickAddDiscountCodeModal';

const DiscountCodes = ({ navigation, openInventory }) => {
  const screenHeight = Dimensions.get('window').height;

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateDiscountCodeTrigger, setUpdateDiscountCodeTrigger] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedDiscountCode, setSelectedDiscountCode] = useState(null);
  const openAddDiscountCodeModal = () => {
    setAddModalVisible(true);
    setSelectedDiscountCode(null);
  };
  const closeAddDiscountCodeModal = () => {
    setAddModalVisible(false);
    setSelectedDiscountCode(null);
  };
  const editDiscountCode = (item) => {
    setSelectedDiscountCode(item);
    setAddModalVisible(true);
  };

  const [isQuickAddModalVisible, setQuickAddModalVisible] = useState(false);
  const openQuickAddDiscountCodeModal = () => {
    setQuickAddModalVisible(true);
  };
  const closeQuickAddDiscountCodeModal = () => {
    setQuickAddModalVisible(false);
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
    if (updateDiscountCodeTrigger == true) getTable();
  }, [updateDiscountCodeTrigger]);

  const removeDiscountCode = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deleteDiscountCode(id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdateDiscountCodeTrigger(true);
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
    getDiscountCodesData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateDiscountCodeTrigger(false);
          setTableData(jsonRes);
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
            <View style={[styles.cell]}>
              <Text>{item.code}</Text>
            </View>
            <View style={[styles.cell, { width: 200 }]}>
              {/* <Text>{item.valid_start_date}</Text> */}
              <Text>
                {new Date(item.valid_start_date).toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </View>
            <View style={[styles.cell, { width: 200 }]}>
              {/* <Text>{item.valid_end_date}</Text> */}
              <Text>
                {new Date(item.valid_end_date).toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.type === 1 ? 'Percentage' : item.type === 2 ? 'Flat fee' : ''}</Text>
            </View>
            <View style={[styles.cell, { alignItems: 'center' }]}>
              <Text>{item.amount}</Text>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  editDiscountCode(item);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  removeDiscountCode(item.id);
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
      screenName={'Discount Codes'}
    >
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <TouchableHighlight style={styles.button} onPress={openAddDiscountCodeModal}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={openQuickAddDiscountCodeModal}>
              <Text style={styles.buttonText}>Quick Add</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader]}>{'Code'}</Text>
              <Text style={[styles.columnHeader, { width: 200 }]}>{'Valid From'}</Text>
              <Text style={[styles.columnHeader, { width: 200 }]}>{'Valid To'}</Text>
              <Text style={[styles.columnHeader]}>{'Type'}</Text>
              <Text style={[styles.columnHeader]}>{'Amount'}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{'Edit'}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{'DEL'}</Text>
            </View>
            <ScrollView style={{ flex: 1, maxHeight: screenHeight - 220 }}>
              {renderTableData()}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      <AddDiscountCodeModal
        isModalVisible={isAddModalVisible}
        DiscountCode={selectedDiscountCode}
        setUpdateDiscountCodeTrigger={setUpdateDiscountCodeTrigger}
        closeModal={closeAddDiscountCodeModal}
      />

      <QuickAddDiscountCodeModal
        isModalVisible={isQuickAddModalVisible}
        DiscountCode={selectedDiscountCode}
        setUpdateDiscountCodeTrigger={setUpdateDiscountCodeTrigger}
        closeModal={closeQuickAddDiscountCodeModal}
      />
    </BasicLayout>
  );
};

const styles = discountCodesStyle;

export default DiscountCodes;
