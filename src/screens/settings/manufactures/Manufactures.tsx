import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableHighlight, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getManufacturesData, deleteManufacture } from '../../../api/Settings';
import { msgStr } from '../../../common/constants/Message';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../common/hooks/UseConfirmModal';
import BasicLayout from '../../../common/components/CustomLayout/BasicLayout';

import { ManufacturesStyle } from './styles/ManufacturesStyle';
import AddManufactureModal from './AddManufactureModal';

const Manufactures = ({ navigation, openInventory }) => {
  const screenHeight = Dimensions.get('window').height;
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateManufactureTrigger, setUpdateManufacturesTrigger] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedManufacture, setSelectedManufacture] = useState(null);

  const openAddManufactureModal = () => {
    setAddModalVisible(true);
    setSelectedManufacture(null);
  };
  const closeAddManufactureModal = () => {
    setAddModalVisible(false);
    setSelectedManufacture(null);
  };
  const editManufacture = (item) => {
    setSelectedManufacture(item);
    setAddModalVisible(true);
  };

  useEffect(() => {
    if (updateManufactureTrigger == true) getTable();
  }, [updateManufactureTrigger]);

  const removeManufacture = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deleteManufacture(id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdateManufacturesTrigger(true);
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
    getManufacturesData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateManufacturesTrigger(false);
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
            <View style={[styles.cell, styles.categoryCell]}>
              <Text style={styles.categoryCell}>{item.manufacture}</Text>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  editManufacture(item);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  removeManufacture(item.id);
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
      screenName={'Manufactures'}
    >
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <TouchableHighlight style={styles.button} onPress={openAddManufactureModal}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.columnHeader, { width: 400 }]}>{'Manufacture'}</Text>
            <Text style={[styles.columnHeader, styles.IconCell]}>{'Edit'}</Text>
            <Text style={[styles.columnHeader, styles.IconCell]}>{'DEL'}</Text>
          </View>
          <ScrollView style={{ flex: 1, maxHeight: screenHeight - 220 }}>
            {renderTableData()}
          </ScrollView>
        </View>

        <AddManufactureModal
          isModalVisible={isAddModalVisible}
          Manufacture={selectedManufacture}
          setUpdateManufacturesTrigger={setUpdateManufacturesTrigger}
          closeModal={closeAddManufactureModal}
        />
      </View>
    </BasicLayout>
  );
};

const styles = ManufacturesStyle;

export default Manufactures;
