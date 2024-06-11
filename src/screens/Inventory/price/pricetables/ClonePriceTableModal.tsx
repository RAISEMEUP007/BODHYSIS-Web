import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';

import { clonePriceTableCell } from '../../../../api/Price';
import BasicModalContainer from '../../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../../common/constants/Message';
import { useAlertModal } from '../../../../common/hooks';

import { priceModalstyles } from './styles/PriceTableModalStyle';

const ClonePriceTableModal = ({
  cloneSource,
  isModalVisible,
  setUpdatePriceTableTrigger,
  closeModal,
}) => {
  const inputRef = useRef(null);

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [_priceTable, setPriceTable] = useState('');


  useEffect(() => {
    if (isModalVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isModalVisible]);

  const handleCloneButtonClick = () => {
    if (!_priceTable.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    }

    setIsLoading(true);

    clonePriceTableCell(cloneSource.id, _priceTable, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          showAlert('success', jsonRes.message);
          setUpdatePriceTableTrigger(true);
          closeModal();
          break;
        case 409:
          setValidMessage(jsonRes.error);
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          closeModal();
          break;
      }
      setIsLoading(false);
    });
  };

  const checkInput = () => {
    if (!_priceTable.trim()) {
      setValidMessage(msgStr('emptyField'));
    } else {
      setValidMessage('');
    }
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isModalVisible}
      onShow={() => {
        setValidMessage('');
        setPriceTable('');
      }}
    >
      <BasicModalContainer>
        <ModalHeader label={'Copy ' + cloneSource.table_name} closeModal={closeModal} />
        <ModalBody>
          <TextInput
            ref={inputRef}
            style={styles.input}
            onChangeText={setPriceTable}
            value={_priceTable}
            placeholder={'New Table Name'}
            placeholderTextColor="#ccc"
            onSubmitEditing={handleCloneButtonClick}
            onBlur={checkInput}
          />
          {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>}
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={handleCloneButtonClick}>
            <Text style={styles.addButton}>Copy</Text>
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

const styles = priceModalstyles;

export default ClonePriceTableModal;
