import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';

import { updateGroup } from '../../../../api/Price';
import BasicModalContainer from '../../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../../common/constants/Message';
import { useAlertModal } from '../../../../common/hooks/UseAlertModal';

import { priceModalstyles } from './styles/PriceModalStyle';

const UpdateGroupModal = ({
  isModalVisible,
  groupName,
  setUpdateGroupTrigger,
  closeModal,
}) => {
  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [_groupName, setGroupname] = useState(groupName);


  const handleAddButtonClick = () => {
    if (!_groupName.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    } else if (groupName == _groupName) {
      closeModal();
      return;
    }

    setIsLoading(true);

    updateGroup(groupName, _groupName, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          showAlert('success', jsonRes.message);
          setUpdateGroupTrigger(true);
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
    if (!_groupName.trim()) {
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
        setGroupname(groupName);
      }}
    >
      <BasicModalContainer>
        <ModalHeader label={'Update price group'} closeModal={closeModal} />
        <ModalBody>
          <TextInput
            style={styles.input}
            onChangeText={setGroupname}
            value={_groupName}
            placeholder="Price group name"
            placeholderTextColor="#ccc"
            onSubmitEditing={handleAddButtonClick}
            onBlur={checkInput}
          />
          {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>}
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={handleAddButtonClick}>
            <Text style={styles.addButton}>Update</Text>
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

export default UpdateGroupModal;
