import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  View,
  ActivityIndicator,
} from 'react-native';

import { createPlantation, updatePlantation } from '../../../api/AllAddress ';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks';
import { commonModalStyle } from '../../../common/components/basicmodal';

const AddPlantationModal = ({ isModalVisible, details, setUpdatePlantationsTrigger, closeModal }) => {
  const isUpdate = details ? true : false;

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formValues, setFormValues] = useState<any>({
    id: null,
    plantation : null,
  });

  useEffect(() => {
    if (isModalVisible && details) {
      setFormValues({
        id: details.id,
        plantation : details.plantation,
      })
    } else {
      setFormValues({
        id: null,
        plantation : null,
      })
    }
  }, [isModalVisible]);

  const updateFormValues = (key, value) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const AddPlantationButtonHandler = () => {
    if(!checkInput()) return;

    setIsLoading(true);

    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 201:
          showAlert('success', jsonRes.message);
          setUpdatePlantationsTrigger(true);
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
      updatePlantation(formValues, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    } else {
      createPlantation(formValues, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    }
  };

  const checkInput = () => {
    if (!formValues.plantation || !formValues.plantation.trim()) {
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
            <Text style={styles.label}>Plantation</Text>
            <TextInput
              style={styles.input}
              placeholder="Plantation"
              value={formValues.plantation || ''}
              onChangeText={val=>updateFormValues('plantation', val)}
              placeholderTextColor="#ccc"
              onBlur={checkInput}
              onSubmitEditing={AddPlantationButtonHandler}
            />
            {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>}
          </View>
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={AddPlantationButtonHandler}>
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

export default AddPlantationModal;
