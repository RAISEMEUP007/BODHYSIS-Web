import React, { useState, useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  Modal,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import {
  updateBulkStatus,
} from '../../../../api/Product';
import BasicModalContainer from '../../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../../common/constants/Message';
import { useAlertModal } from '../../../../common/hooks/UseAlertModal';

import { productModalstyles } from './styles/ProductModalStyle';

const BulkUpdateStatus = ({ isModalVisible, ids, setUpdateProductsTrigger, closeModal }) => {

  const { showAlert } = useAlertModal();

  const [isLoading, setIsLoading] = useState(false);
  const [Locations, setLocations] = useState([]);

  const [selectedStatus, selectStatus] = useState<number>(-1);

  const StatusArr = [
    { id: 0, status: 'Ready' },
    { id: 1, status: 'Ordered' },
    { id: 2, status: 'Checked out' },
    // { id: 3, status: 'Checked in' },
    { id: 4, status: 'Broken' },
    { id: 5, status: 'Sold' },
    { id: 6, status: 'Transferred' },
  ];


  useEffect(() => {
    if (isModalVisible) {
      if(!ids || !Array.isArray(ids) || ids.length == 0){
        showAlert('warning', 'Please select products');
        closeModal();
      }
      setIsLoading(false);
      selectStatus(-1);
    }
  }, [isModalVisible]);

  const AddProductButtonHandler = () => {
    if(selectedStatus<0){
      showAlert('warning', 'No status selected');
      closeModal();
      return;
    }

    setIsLoading(true);

    const payload : any = {
      ids: ids,
      status: selectedStatus,
    };

    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateProductsTrigger(true);
          closeModal();
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          closeModal();
          break;
      }
      setIsLoading(false);
    };

    updateBulkStatus(payload, (jsonRes, status) => {
      handleResponse(jsonRes, status);
    });
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isModalVisible}
      onShow={() => {
      }}
    >
      <BasicModalContainer>
        <ModalHeader label={'Bulk update locations'} closeModal={closeModal} />
        <ModalBody>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Status</Text>
              <Picker
                style={styles.select}
                selectedValue={selectedStatus}
                onValueChange={(itemValue, itemIndex) => {
                  selectStatus(itemValue);
                }}
              >
                <Picker.Item label={''} value={-1} />
                {StatusArr.length > 0 &&
                  StatusArr.map((statusItem, index) => {
                    return (
                      <Picker.Item key={index} label={statusItem.status} value={statusItem.id} />
                    );
                  })}
              </Picker>
            </View>
          </View>
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={AddProductButtonHandler}>
            <Text style={styles.addButton}>{'Update'}</Text>
          </TouchableOpacity>
        </ModalFooter>
      </BasicModalContainer>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </Modal>
  );
};

const styles = productModalstyles;

export default BulkUpdateStatus;
