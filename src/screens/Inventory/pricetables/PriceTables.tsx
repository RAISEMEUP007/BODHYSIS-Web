import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableHighlight,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getPriceTablesData, savePriceTableCell, deletePriceTable } from '../../../api/Price';
import { msgStr } from '../../../common/constants/Message';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../common/hooks/UseConfirmModal';
import BasicLayout from '../../../common/components/CustomLayout/BasicLayout';

import { priceTablesStyle } from './styles/PriceTablesStyle';
import AddPriceTableModal from './AddPriceTableModal';
import ClonePriceTableModal from './ClonePriceTableModal';
import PriceGroup from '../pricegroup/PriceGroup';

const PriceTables = ({ navigation, openInventory, selectedTableId = null }) => {
  const screenHeight = Dimensions.get('window').height;

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const openAddPriceTableModal = () => {
    setAddModalVisible(true);
  };
  const closeAddPriceTableModal = () => {
    setAddModalVisible(false);
  };
  const [updatePriceTableTrigger, setUpdatePriceTableTrigger] = useState(true);
  const [selectedTable, setSelectedTable] = useState(selectedTableId);
  const [selectedTableName, setSelectedTableName] = useState('');

  const [isCloneModalVisible, setCloneModalVisible] = useState(false);
  const openClonePriceTableModal = () => {
    setCloneModalVisible(true);
  };
  const closeClonePriceTableModal = () => {
    setCloneModalVisible(false);
  };
  const [cloneSource, setCloneSource] = useState({});

  useEffect(() => {
    if (updatePriceTableTrigger == true) getTable();
  }, [updatePriceTableTrigger]);

  const getTable = () => {
    getPriceTablesData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdatePriceTableTrigger(false);
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

  const changeCellData = (index, key, newVal) => {
    const updatedTableData = [...tableData];
    updatedTableData[index] = {
      ...updatedTableData[index],
      [key]: newVal,
    };
    setTableData(updatedTableData);
  };

  const saveCellData = (id, column, value) => {
    value = value ? value : '';

    savePriceTableCell(id, column, value, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          setUpdatePriceTableTrigger(true);
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    });
  };

  const removePriceTable = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deletePriceTable(id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdatePriceTableTrigger(true);
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

  const openPriceTable = (id, tableName) => {
    setSelectedTable(id);
    setSelectedTableName(tableName);
  };

  const clonePriceTable = (item) => {
    setCloneSource(item);
    openClonePriceTableModal(true);
  };

  if (selectedTable) {
    return (
      <PriceGroup
        tableId={selectedTable}
        tableName={selectedTableName}
        openPriceTable={openPriceTable}
      />
    );
  }

  const renderTableData = () => {
    const rows = [];
    if (tableData.length > 0) {
      tableData.map((item, index) => {
        rows.push(
          <View key={index} style={styles.tableRow}>
            <View style={[styles.cell, styles.categoryCell]}>
              <TextInput
                style={styles.cellInput}
                value={item.table_name}
                onChangeText={(value) => {
                  changeCellData(index, 'table_name', value);
                }}
                onBlur={(e) => {
                  saveCellData(item.id, 'table_name', item.table_name);
                }}
              />
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                style={{ cursor: 'pointer' }}
                onPress={() => {
                  openPriceTable(item.id, item.table_name);
                }}
              >
                <FontAwesome5 name={'edit'} size={15} color={'black'} />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                style={{ cursor: 'pointer' }}
                onPress={() => {
                  clonePriceTable(item);
                }}
              >
                <FontAwesome5 name={'clone'} size={15} color={'black'} />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  removePriceTable(item.id);
                }}
              >
                <FontAwesome5 size={15} name="times" color="black" />
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
      screenName={'Price Tables'}
    >
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <TouchableHighlight style={styles.button} onPress={openAddPriceTableModal}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader, { width: 250 }]}>{'Price Table'}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{'Options'}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{'Clone'}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{'DEL'}</Text>
            </View>
            <ScrollView style={{ flex: 1, maxHeight: screenHeight - 220 }}>
              {renderTableData()}
            </ScrollView>
          </View>

          <AddPriceTableModal
            isModalVisible={isAddModalVisible}
            setUpdatePriceTableTrigger={setUpdatePriceTableTrigger}
            closeModal={closeAddPriceTableModal}
          />

          <ClonePriceTableModal
            cloneSource={cloneSource}
            isModalVisible={isCloneModalVisible}
            setUpdatePriceTableTrigger={setUpdatePriceTableTrigger}
            closeModal={closeClonePriceTableModal}
          />
        </View>
      </ScrollView>
    </BasicLayout>
  );
};

const styles = priceTablesStyle;

export default PriceTables;
