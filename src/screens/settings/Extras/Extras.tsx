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

import { getExtrasData, deleteExtra } from '../../../api/Settings';
import { msgStr } from '../../../common/constants/Message';
import { API_URL } from '../../../common/constants/AppConstants';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../common/hooks/UseConfirmModal';
import BasicLayout from '../../../common/components/CustomLayout/BasicLayout';

import { extrasStyle } from './styles/ExtrasStyle';
import AddExtraModal from './AddExtraModal';

const Extras = ({ navigation, openInventory }) => {
  const screenHeight = Dimensions.get('window').height;

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateExtraTrigger, setUpdateExtraTrigger] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedExtra, setSelectedExtra] = useState(null);

  const openAddExtraModal = () => {
    setAddModalVisible(true);
    setSelectedExtra(null);
  };
  const closeAddExtraModal = () => {
    setAddModalVisible(false);
    setSelectedExtra(null);
  };
  const editExtra = (index) => {
    setSelectedExtra(tableData[index]);
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
    if (updateExtraTrigger == true) getTable();
  }, [updateExtraTrigger]);

  const removeExtra = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deleteExtra(id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdateExtraTrigger(true);
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
    getExtrasData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateExtraTrigger(false);
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
        let price = '';
        switch(item.option){
          case 0:
            price = 'Free';
            break;
          case 1:
            price = item.fixed_price;
            break;
          case 2:
            break;
        }
        rows.push(
          <View key={index} style={styles.tableRow}>
            <View style={[styles.cell, { width: 150 }]}>
              <Text>{(item.status?'Active':'Inactive')}</Text>
            </View>
            <View style={[styles.cell, { width: 300}]}>
              <Text>{item.name}</Text>
            </View>
            <View style={[styles.cell, { width: 150, alignItems:'flex-end' }]}>
              <Text>{price}</Text>
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
                  editExtra(index);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  removeExtra(item.id);
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
      screenName={'Extras'}
    >
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <TouchableHighlight style={styles.button} onPress={openAddExtraModal}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader, { width: 150 }]}>{'Status'}</Text>
              <Text style={[styles.columnHeader, { width: 300 }]}>{'Name'}</Text>
              <Text style={[styles.columnHeader, { width: 150 }]}>{'Price'}</Text>
              <Text style={[styles.columnHeader, styles.imageCell]}>{'Image'}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{'Edit'}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{'DEL'}</Text>
            </View>
            <ScrollView style={{ flex: 1, maxHeight: screenHeight - 220 }}>
              {renderTableData()}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      <AddExtraModal
        isModalVisible={isAddModalVisible}
        Extra={selectedExtra}
        setUpdateExtraTrigger={setUpdateExtraTrigger}
        closeModal={closeAddExtraModal}
      />
    </BasicLayout>
  );
};

const styles = extrasStyle;

export default Extras;
