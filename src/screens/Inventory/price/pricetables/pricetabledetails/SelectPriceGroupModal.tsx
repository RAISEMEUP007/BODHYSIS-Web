import React, { useState, useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Platform,
  ScrollView,
  Switch,
  TouchableHighlight,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import BasicModalContainer from '../../../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../../../common/components/basicmodal/ModalBody';
import { msgStr } from '../../../../../common/constants/Message';
import { useAlertModal } from '../../../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../../../common/hooks/UseConfirmModal';

import { selectPriceGroupModalStyle } from './styles/SelectPriceGroupModalStyle';
import { getPriceGroupActiveDataByTableId, setActiveGroup } from '../../../../../api/Price';
import CreateGroupModal from '../../pricegrouplist/CreateGroupModal';

const SelectPriceGroupModal = ({ isModalVisible, tableId, setUpdatePointTrigger, closeModal }) => {
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updatGroupListTrigger, setUpdatGroupListTrigger] = useState(true);

  const [isGroupModalVisible, setGroupModalVisible] = useState(false);
  const openGroupModal = () => {
    setGroupModalVisible(true);
  };
  const closeGroupModal = () => {
    setGroupModalVisible(false);
  };

  useEffect(() => {
    if (updatGroupListTrigger == true) getTable();
  }, [updatGroupListTrigger]);

  useEffect(() => {
    if (isModalVisible == true) getTable();
  }, [isModalVisible]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          closeModal();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [closeModal]);

  const getTable = () => {
    getPriceGroupActiveDataByTableId(tableId, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdatGroupListTrigger(false);
          setUpdatePointTrigger(true);
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

  const switchGroup = (group_id, value) => {
    const payload = {
      table_id : tableId,
      group_id,
      is_active : value,
    }
    setActiveGroup(payload, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdatGroupListTrigger(true);
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    });
  }

  const renderTableData = () => {
    const rows = [];
    if (tableData.length > 0) {
      tableData.map((item, index) => {
        rows.push(
          <View key={index} style={styles.tableRow}>
            <View style={[styles.cell, { width: 300 }]}>
              <Text>{item.price_group}</Text>
            </View>
            <View style={[styles.IconCell]}>
              <Switch
                trackColor={{ false: '#6c757d', true: '#007bff' }}
                thumbColor={item.is_active ? '#ffc107' : '#f8f9fa'}
                ios_backgroundColor="#343a40"
                onValueChange={(value)=>{switchGroup(item.id, value)}}
                value={item.is_active}
              />
            </View>
          </View>
        );
      });
    } else {
      <View style={{ alignItems: 'center', paddingTop: 10 }}>
        <Text>No Address</Text>
      </View>;
    }
    return <>{rows}</>;
  };

  return isModalVisible ? (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <BasicModalContainer>
        <ModalHeader label={'Select price group'} closeModal={closeModal} />
        <ModalBody>
          <View style={{ flex: 1, alignItems: 'flex-start' }}>
            <View style={styles.toolbar}>
              <TouchableHighlight style={styles.button} onPress={openGroupModal}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableHighlight>
            </View>
            <View style={[styles.tableContainer]}>
              <View style={styles.tableHeader}>
                <Text style={[styles.columnHeader, { width: 300 }]}>{'Price group'}</Text>
                <Text style={[styles.columnHeader, styles.IconCell]}>{'Active'}</Text>
              </View>
              <ScrollView style={{ height: 450}}>{renderTableData()}</ScrollView>
            </View>
          </View>
        </ModalBody>
      </BasicModalContainer>

      <CreateGroupModal
        isModalVisible={isGroupModalVisible}
        groupName={''}
        setUpdateGroupTrigger={setUpdatGroupListTrigger}
        closeModal={closeGroupModal}
      />
    </View>
  ) : null;
};

const styles = selectPriceGroupModalStyle;

export default SelectPriceGroupModal;
