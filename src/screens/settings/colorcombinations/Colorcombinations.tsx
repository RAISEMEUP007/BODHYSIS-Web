import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableHighlight, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getColorcombinationsData, deleteColorcombination } from '../../../api/Settings';
import { msgStr } from '../../../common/constants/Message';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal, useConfirmModal } from '../../../common/hooks';
import BasicLayout from '../../../common/components/CustomLayout/BasicLayout';

import { ColorcombinationsStyle } from './styles/ColorcombinationsStyle';
import AddColorcombinationModal from './AddColorcombinationModal';

const Colorcombinations = ({ navigation, openInventory }) => {
  const screenHeight = Dimensions.get('window').height;
  const { showAlert } = useAlertModal();

  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateColorcombinationTrigger, setUpdateColorcombinationsTrigger] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedColorcombination, setSelectedColorcombination] = useState(null);

  const openAddColorcombinationModal = () => {
    setAddModalVisible(true);
    setSelectedColorcombination(null);
  };
  const closeAddColorcombinationModal = () => {
    setAddModalVisible(false);
    setSelectedColorcombination(null);
  };
  const editColorcombination = (item) => {
    setSelectedColorcombination(item);
    setAddModalVisible(true);
  };

  useEffect(() => {
    if (updateColorcombinationTrigger == true) getTable();
  }, [updateColorcombinationTrigger]);

  const removeColorcombination = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deleteColorcombination(id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdateColorcombinationsTrigger(true);
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
    getColorcombinationsData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateColorcombinationsTrigger(false);
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
              <Text>{item.color_key}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.combination}</Text>
            </View>
            <View style={[styles.cell, {flexDirection: 'row', justifyContent:'flex-start', alignItems:'center'}]}>
              <View style={{ width: 50, height: 20, backgroundColor: item.color, marginRight: 10, marginTop:2 }} />  
              <Text>{item.color}</Text>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  editColorcombination(item);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  removeColorcombination(item.id);
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
      screenName={'Colorcombinations'}
    >
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <TouchableHighlight style={styles.button} onPress={openAddColorcombinationModal}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.columnHeader]}>{'Color Key'}</Text>
            <Text style={[styles.columnHeader]}>{'Combination'}</Text>
            <Text style={[styles.columnHeader]}>{'Color'}</Text>
            <Text style={[styles.columnHeader, styles.IconCell]}>{'Edit'}</Text>
            <Text style={[styles.columnHeader, styles.IconCell]}>{'DEL'}</Text>
          </View>
          <ScrollView style={{ flex: 1, maxHeight: screenHeight - 220 }}>
            {renderTableData()}
          </ScrollView>
        </View>

        <AddColorcombinationModal
          isModalVisible={isAddModalVisible}
          Colorcombination={selectedColorcombination}
          setUpdateColorcombinationsTrigger={setUpdateColorcombinationsTrigger}
          closeModal={closeAddColorcombinationModal}
        />
      </View>
    </BasicLayout>
  );
};

const styles = ColorcombinationsStyle;

export default Colorcombinations;
