import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  View,
  TouchableWithoutFeedback,
  Platform,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import {
  getDeliveryAddressesData,
  deleteDeliveryAddress,
  updateDeliveryAddress,
} from '../../../api/Customer';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal, useConfirmModal } from '../../../common/hooks';

import { customersStyle } from './styles/CustomersStyle';
import { TextMediumSize } from '../../../common/constants/Fonts';
import AddDeliveryAddressModal from './AddDeliveryAddressModal';

const DeliveryAddress = ({ isModalVisible, customerId, closeModal }) => {
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateDeliveryAddressTrigger, setUpdateDeliveryAddressTrigger] = useState(true);

  const [isAddDeliveryModalVisible, setAddDeliveryModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const openAdDeliverydAddressModal = () => {
    setAddDeliveryModalVisible(true);
    setSelectedAddress(null);
  };
  const closeAdDeliverydAddressModal = () => {
    setAddDeliveryModalVisible(false);
    setSelectedAddress(null);
  };
  const editAddress = (item) => {
    setSelectedAddress(item);
    setAddDeliveryModalVisible(true);
  };

  useEffect(() => {
    if (updateDeliveryAddressTrigger == true) getTable();
  }, [updateDeliveryAddressTrigger]);

  useEffect(() => {
    if (isModalVisible == true) getTable();
  }, [isModalVisible]);


  const removeCustomer = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deleteDeliveryAddress(id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdateDeliveryAddressTrigger(true);
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
    getDeliveryAddressesData(customerId, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateDeliveryAddressTrigger(false);
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

  const resetUsedAddress = (id) => {
    updateDeliveryAddress({ is_used: true, id: id }, () => {
      tableData.map((item, index) => {
        if (item.is_used) {
          updateDeliveryAddress({ is_used: false, id: item.id }, () => {
            setUpdateDeliveryAddressTrigger(true);
          });
        }
      });
      setUpdateDeliveryAddressTrigger(true);
    });
  };

  const renderTableData = () => {
    const rows = [];
    if (tableData.length > 0) {
      tableData.map((item, index) => {
        rows.push(
          <View key={index} style={styles.tableRow}>
            <View style={[styles.cell, { width: 300 }]}>
              <Text>{item.all_addresses && `${item.all_addresses.number} ${item.all_addresses.street} ${item.all_addresses.plantation} ${item.all_addresses.property_name}`}</Text>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableWithoutFeedback
                onPress={() => {
                  resetUsedAddress(item.id);
                }}
              >
                <FontAwesome5
                  name={item.is_used ? 'dot-circle' : 'circle'}
                  size={15}
                  color={item.is_used ? '#2e96e1' : '#6c757d'}
                />
              </TouchableWithoutFeedback>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  editAddress(item);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  removeCustomer(item.id);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="times" color="black" />
              </TouchableOpacity>
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
        <ModalHeader label={'Delivery Address'} closeModal={closeModal} />
        <ModalBody>
          <View style={{ flex: 1, alignItems: 'flex-start' }}>
            <View style={styles.toolbar}>
              <TouchableHighlight style={styles.button} onPress={openAdDeliverydAddressModal}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableHighlight>
            </View>
            <View style={[styles.tableContainer]}>
              <View style={styles.tableHeader}>
                <Text style={[styles.columnHeader, { width: 300 }]}>{'Delivery Address'}</Text>
                <Text style={[styles.columnHeader, styles.IconCell]}>{'Is_used'}</Text>
                <Text style={[styles.columnHeader, styles.IconCell]}>{'Edit'}</Text>
                <Text style={[styles.columnHeader, styles.IconCell]}>{'DEL'}</Text>
              </View>
              <ScrollView style={{ height: 400 }}>{renderTableData()}</ScrollView>
            </View>
          </View>
        </ModalBody>
      </BasicModalContainer>

      <AddDeliveryAddressModal
        isModalVisible={isAddDeliveryModalVisible}
        DeliveryAddress={selectedAddress}
        customerId={customerId}
        setUpdateDeliveryAddressTrigger={setUpdateDeliveryAddressTrigger}
        closeModal={closeAdDeliverydAddressModal}
      />
    </View>
  ) : null;
};

const styles = customersStyle;

export default DeliveryAddress;
