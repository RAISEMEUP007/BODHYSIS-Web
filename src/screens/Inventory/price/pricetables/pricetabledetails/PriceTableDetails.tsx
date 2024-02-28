import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableHighlight,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import CheckBox from 'expo-checkbox';
import { FontAwesome5 } from '@expo/vector-icons';

import {
  getHeaderData,
  getTableData,
  setFree,
  setPriceData,
  setExtraDay,
  deleteGroup,
  deletePricePoint,
  setActiveGroup,
} from '../../../../../api/Price';
import { msgStr } from '../../../../../common/constants/Message';
import { useAlertModal } from '../../../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../../../common/hooks/UseConfirmModal';
import { TextMediumSize } from '../../../../../common/constants/Fonts';
import BasicLayout from '../../../../../common/components/CustomLayout/BasicLayout';

import { priceGroupStyles } from './styles/PriceGroupStyle';
import PricePointModal from './PricePointModal';
import SelectPriceGroupModal from './SelectPriceGroupModal';

const PriceTableDetails = ({ tableId, tableName, openPriceTable }) => {
  const screenHeight = Dimensions.get('window').height;

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();
  
  const [updateGroupTrigger, setUpdateGroupTrigger] = useState(false);
  const [updatePointTrigger, setUpdatePointTrigger] = useState(true);
  
  const [headerData, setHeaderData] = useState([]);
  const [tableData, setTableData] = useState({});
  
  const [isAddPriceModalVisible, setAddPriceModalVisible] = useState(false);
  const openPriceModal = () => {
    setAddPriceModalVisible(true);
  };
  const closePriceModal = () => {
    setAddPriceModalVisible(false);
  };

  const [isSetPriceGroupVisible, setSetPriceGroupVisible] = useState(false);

  const openSelectPriceGroupModal = () => {
    setSetPriceGroupVisible(true);
  };
  const closeSelectPriceGroupModal = () => {
    setSetPriceGroupVisible(false);
  };

  useEffect(() => {
    if (updatePointTrigger == true) {
      getHeader();
      getTable();
      setUpdatePointTrigger(false);
    }
  }, [updatePointTrigger]);

  useEffect(() => {
    if (updateGroupTrigger == true) {
      getTable();
    }
  }, [updateGroupTrigger]);

  const changeCellData = (group, index, newVal) => {
    const updatedTableData = { ...tableData };
    updatedTableData[group] = {
      ...updatedTableData[group],
      data: [
        ...updatedTableData[group].data.slice(0, index),
        newVal,
        ...updatedTableData[group].data.slice(index + 1),
      ],
    };
    setTableData(updatedTableData);
  };

  const changeExtraDay = (group, extraDay) => {
    const updatedTableData = { ...tableData };
    updatedTableData[group] = {
      ...updatedTableData[group],
      extra_day: extraDay,
    };
    setTableData(updatedTableData);
  };

  const getHeader = () => {
    getHeaderData(tableId, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          setHeaderData(jsonRes);
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

  const getTable = () => {
    getTableData(tableId, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          setTableData(jsonRes);
          setUpdateGroupTrigger(false);
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

  const saveFree = (group, group_id, isFree) => {
    const payload = { 
      table_id : tableId,
      group_id, 
      isFree, 
    };
    setFree(payload, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          const updatedTableData = { ...tableData };
          updatedTableData[group] = {
            ...updatedTableData[group],
            is_free: isFree,
          };
          setTableData(updatedTableData);
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    });
  };

  const saveCellData = (group, index, cellData) => {
    const groupId = tableData[group].group_id;
    const pointId = headerData[index].id;
    const value = cellData ? cellData : '';

    setPriceData(groupId, tableId, pointId, value, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          setUpdateGroupTrigger(true);
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    });
  };

  const saveExtraDay = (group, group_id, extraDay) => {
    const payload = {
      table_id: tableId,
      group_id: group_id,
      extraDay: extraDay,
    }
    setExtraDay(payload, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          break;
        default:
          setUpdateGroupTrigger(true);
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    });
  };

  const removePoint = (priceId) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deletePricePoint(priceId, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdatePointTrigger(true);
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

  const removeGroup = (group_id) => {
    const payload = {
      table_id : tableId,
      group_id,
      is_active : false,
    }
    showConfirm(msgStr('deleteConfirmStr'), () => {
      setActiveGroup(payload, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdateGroupTrigger(true);
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



  const renderTableHeader = () => {
    return (
      <>
        <View style={styles.tableHeader}>
          <Text style={[styles.columnHeader, styles.groupCell]}>PriceGroup</Text>
          <Text style={[styles.columnHeader, styles.cellcheckbox]}>Free</Text>
          {headerData.map((item, index) => (
            <View key={index} style={styles.columnHeader}>
              <View style={styles.headerIcon}>
                <TouchableOpacity
                  onPress={() => {
                    removePoint(item.id);
                  }}
                >
                  <FontAwesome5 size={TextMediumSize} name="times" color="black" />
                </TouchableOpacity>
              </View>
              {/* <Text pointId={item.id}>{item.header}</Text> */}
              <Text style={{textAlign:'center'}}>{item.header}</Text>
            </View>
          ))}
          <Text style={styles.columnHeader}>Extra day</Text>
        </View>
      </>
    );
  };

  const renderTableData = () => {
    const rows = [];
    for (let i in tableData) {
      rows.push(
        <View key={i} style={styles.tableRow}>
          <View style={[styles.groupCell]}>
            <Text>{i}</Text>
            <View>
              {/* <TouchableOpacity
                onPress={() => {
                  // openUpdateGroupModal(i);
                }}
              >
                <FontAwesome5
                  style={styles.editRow}
                  size={TextMediumSize}
                  name="pencil-alt"
                  color="black"
                />
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => {
                  removeGroup( tableData[i].group_id);
                }}
              >
                <FontAwesome5
                  style={styles.deleteRow}
                  size={TextMediumSize}
                  name="times"
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.cell, styles.cellcheckbox]}>
            <CheckBox
              value={tableData[i].is_free ? true : false}
              onValueChange={(newValue) => saveFree(i, tableData[i].group_id, newValue)}
            />
          </View>
          {tableData[i].data.map((cellData, index) => (
            <TextInput
              key={index}
              style={[styles.cell]}
              value={cellData ? cellData.toString() : ''}
              onChangeText={(value) => {
                changeCellData(i, index, value);
              }}
              onBlur={() => {
                saveCellData(i, index, cellData);
              }}
            />
          ))}
          <TextInput
            style={[styles.cell]}
            value={tableData[i].extra_day ? tableData[i].extra_day.toString() : ''}
            onChangeText={(value) => {
              changeExtraDay(i, value);
            }}
            onBlur={(e) => {
              saveExtraDay(i, tableData[i].group_id, tableData[i].extra_day);
            }}
          />
        </View>
      );
    }
    return <>{rows}</>;
  };

  return (
    <BasicLayout
      goBack={() => {
        openPriceTable(null);
      }}
      screenName={tableName}
    >
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <TouchableHighlight style={styles.button} onPress={openSelectPriceGroupModal}>
              <Text style={styles.buttonText}>Set price group</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={openPriceModal}>
              <Text style={styles.buttonText}>Add Duration</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.table}>
              {renderTableHeader()}
              <ScrollView style={{ flex: 1, maxHeight: screenHeight - 280 }}>
                {renderTableData()}
              </ScrollView>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <SelectPriceGroupModal
        isModalVisible={isSetPriceGroupVisible}
        tableId={tableId}
        setUpdatePointTrigger={setUpdatePointTrigger}
        closeModal={closeSelectPriceGroupModal}
      />

      <PricePointModal
        isModalVisible={isAddPriceModalVisible}
        tableId={tableId}
        setUpdatePointTrigger={setUpdatePointTrigger}
        closeModal={closePriceModal}
      />
    </BasicLayout>
  );
};

const styles = priceGroupStyles;

export default PriceTableDetails;
