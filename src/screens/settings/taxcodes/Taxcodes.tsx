import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableHighlight, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getTaxcodesData, deleteTaxcode } from '../../../api/Settings';
import { msgStr } from '../../../common/constants/Message';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal, useConfirmModal } from '../../../common/hooks';
import BasicLayout from '../../../common/components/CustomLayout/BasicLayout';

import { TaxcodesStyle } from './styles/TaxcodesStyle';
import AddTaxcodeModal from './AddTaxcodeModal';

const Taxcodes = ({ navigation, openInventory }) => {
  const screenHeight = Dimensions.get('window').height;
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateTaxcodeTrigger, setUpdateTaxcodesTrigger] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedTaxcode, setSelectedTaxcode] = useState(null);

  const openAddTaxcodeModal = () => {
    setAddModalVisible(true);
    setSelectedTaxcode(null);
  };
  const closeAddTaxcodeModal = () => {
    setAddModalVisible(false);
    setSelectedTaxcode(null);
  };
  const editTaxcode = (item) => {
    setSelectedTaxcode(item);
    setAddModalVisible(true);
  };

  useEffect(() => {
    if (updateTaxcodeTrigger == true) getTable();
  }, [updateTaxcodeTrigger]);

  const removeTaxcode = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deleteTaxcode(id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdateTaxcodesTrigger(true);
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
    getTaxcodesData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateTaxcodesTrigger(false);
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
            <View style={[styles.cell]}>
              <Text>{item.description}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.rate}</Text>
            </View>
            <View style={[styles.cell, {width:100, alignItems:'center'}]}>
              <Text>{item.is_suspended ? 'Y' : ''}</Text>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  editTaxcode(item);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  removeTaxcode(item.id);
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
      screenName={'Taxcodes'}
    >
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <TouchableHighlight style={styles.button} onPress={openAddTaxcodeModal}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.columnHeader]}>{'Taxcode'}</Text>
            <Text style={[styles.columnHeader]}>{'Description'}</Text>
            <Text style={[styles.columnHeader]}>{'Rate'}</Text>
            <Text style={[styles.columnHeader, {width:100}]}>{'Suspended'}</Text>
            <Text style={[styles.columnHeader, styles.IconCell]}>{'Edit'}</Text>
            <Text style={[styles.columnHeader, styles.IconCell]}>{'DEL'}</Text>
          </View>
          <ScrollView style={{ flex: 1, maxHeight: screenHeight - 220 }}>
            {renderTableData()}
          </ScrollView>
        </View>

        <AddTaxcodeModal
          isModalVisible={isAddModalVisible}
          Taxcode={selectedTaxcode}
          setUpdateTaxcodesTrigger={setUpdateTaxcodesTrigger}
          closeModal={closeAddTaxcodeModal}
        />
      </View>
    </BasicLayout>
  );
};

const styles = TaxcodesStyle;

export default Taxcodes;
