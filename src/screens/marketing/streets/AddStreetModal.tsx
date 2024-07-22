import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  View,
  ActivityIndicator,
} from 'react-native';

import { createStreet, updateStreet } from '../../../api/AllAddress ';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks';
import { commonModalStyle } from '../../../common/components/basicmodal';

const AddStreetModal = ({ isModalVisible, details, setUpdateStreetsTrigger, closeModal }) => {
  const isUpdate = details ? true : false;

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formValues, setFormValues] = useState<any>({
    id: null,
    street : null,
  });

  useEffect(() => {
    if (isModalVisible && details) {
      setFormValues({
        id: details.id,
        street : details.street,
      })
    } else {
      setFormValues({
        id: null,
        street : null,
      })
    }
  }, [isModalVisible]);

  const updateFormValues = (key, value) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const AddStreetButtonHandler = () => {
    if(!checkInput()) return;

    setIsLoading(true);

    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateStreetsTrigger(true);
          closeModal();
          break;
        case 409:
          showAlert('error', "This address is already exist");
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          closeModal();
          break;
      }
      setIsLoading(false);
    };

    if (isUpdate) {
      updateStreet(formValues, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    } else {
      createStreet(formValues, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    }
  };

  const checkInput = () => {
    if (!formValues.street || !formValues.street.trim()) {
      setValidMessage(msgStr('emptyField'));
      return false;
    } else {
      setValidMessage('');
      return true;
    }
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isModalVisible}
    >
      <BasicModalContainer>
        <ModalHeader label={isUpdate ? 'Update' : 'Add' + 'Address'} closeModal={closeModal} />
        <ModalBody>
          <View >
            <Text style={styles.label}>Street</Text>
            <TextInput
              style={styles.input}
              placeholder="Street"
              value={formValues.street || ''}
              onChangeText={val=>updateFormValues('street', val)}
              placeholderTextColor="#ccc"
              onBlur={checkInput}
              onSubmitEditing={AddStreetButtonHandler}
            />
            {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>}
          </View>
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={AddStreetButtonHandler}>
            <Text style={styles.addButton}>{isUpdate ? 'Update' : 'Add'}</Text>
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

const styles = commonModalStyle;

export default AddStreetModal;
