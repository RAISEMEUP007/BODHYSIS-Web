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

import { deleteGroup, getPriceGroupsData } from '../../../../api/Price';
import { msgStr } from '../../../../common/constants/Message';
import { TextMediumSize } from '../../../../common/constants/Fonts';
import { useAlertModal, useConfirmModal } from '../../../../common/hooks';
import BasicLayout from '../../../../common/components/CustomLayout/BasicLayout';

import CreateGroupModal from './CreateGroupModal';
import UpdateGroupModal from './UpdateGroupModal';
import { priceGroupListstyles } from './styles/PriceGroupListStyle';

const PriceGroupLists = ({ navigation, openInventory }) => {
  const screenHeight = Dimensions.get('window').height;

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updatePriceGroupListTrigger, setUpdatePriceGroupListTrigger] = useState(true);

  const [groupName, setGroupName] = useState('');
  const [isGroupModalVisible, setGroupModalVisible] = useState(false);
  const [isUpdateGroupModalVisible, setUpdateGroupModalVisible] = useState(false);
  const openGroupModal = () => {
    setGroupModalVisible(true);
  };
  const closeGroupModal = () => {
    setGroupModalVisible(false);
  };
  const openUpdateGroupModal = (group) => {
    setGroupName(group);
    setUpdateGroupModalVisible(true);
  };
  const closeUpdateGroupModal = () => {
    setUpdateGroupModalVisible(false);
  };

  const removeGroup = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deleteGroup(id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdatePriceGroupListTrigger(true);
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
    getPriceGroupsData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdatePriceGroupListTrigger(false);
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

  useEffect(() => {
    if (updatePriceGroupListTrigger == true) getTable();
  }, [updatePriceGroupListTrigger]);

  const renderTableData = () => {
    const rows = [];
    if (tableData.length > 0) {
      tableData.map((item, index) => {
        rows.push(
          <View key={index} style={styles.tableRow}>
            <View style={[styles.cell, { width: 250 }]}>
              <Text>{item.price_group}</Text>
            </View>
            <View style={[styles.cell, { width: 400 }]}>
              <Text>{item.description}</Text>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  openUpdateGroupModal(item.price_group);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  removeGroup(item.id);
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
      screenName={'Price group list'}
    >
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <TouchableHighlight style={styles.button} onPress={openGroupModal}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader, { width: 250 }]}>{'Price group'}</Text>
              <Text style={[styles.columnHeader, { width: 400 }]}>{'Description'}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{'Edit'}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{'DEL'}</Text>
            </View>
            <ScrollView style={{ flex: 1, maxHeight: screenHeight - 220 }}>
              {renderTableData()}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      <CreateGroupModal
        isModalVisible={isGroupModalVisible}
        groupName={''}
        setUpdateGroupTrigger={setUpdatePriceGroupListTrigger}
        closeModal={closeGroupModal}
      />

      <UpdateGroupModal
        isModalVisible={isUpdateGroupModalVisible}
        groupName={groupName}
        setUpdateGroupTrigger={setUpdatePriceGroupListTrigger}
        closeModal={closeUpdateGroupModal}
      />
    </BasicLayout>
  );
};

const styles = priceGroupListstyles;

export default PriceGroupLists;
