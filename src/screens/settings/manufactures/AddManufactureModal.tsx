import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  View,
  ActivityIndicator,
  Platform,
  Picker,
} from 'react-native';

import { createManufacture, updateManufacture } from '../../../api/Settings';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';

import { ManufactureModalstyles } from './styles/ManufactureModalStyle';

const AddManufactureModal = ({
  isModalVisible,
  Manufacture,
  setUpdateManufacturesTrigger,
  closeModal,
}) => {
  const isUpdate = Manufacture ? true : false;

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [ManufactureTxt, setManufactureTxt] = useState('');
  const [DescriptionTxt, setDescriptionTxt] = useState('');

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

  const AddManufactureButtonHandler = () => {
    if (!ManufactureTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    }

    setIsLoading(true);

    const payload = {
      manufacture: ManufactureTxt,
      description: DescriptionTxt,
    };

    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateManufacturesTrigger(true);
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
    };

    if (isUpdate) {
      payload.id = Manufacture.id;
      updateManufacture(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    } else {
      createManufacture(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    }
  };

  const checkInput = () => {
    if (!ManufactureTxt.trim()) {
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
        setManufactureTxt(Manufacture ? Manufacture.manufacture : '');
        setDescriptionTxt(Manufacture ? Manufacture.description : '');
      }}
    >
      <BasicModalContainer>
        <ModalHeader label={'Manufacture'} closeModal={closeModal} />
        <ModalBody>
          <Text style={styles.label}>Manufacture</Text>
          <TextInput
            style={styles.input}
            placeholder="Manufacture"
            value={ManufactureTxt}
            onChangeText={setManufactureTxt}
            placeholderTextColor="#ccc"
            onBlur={checkInput}
          />
          {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>}
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Description"
            placeholderTextColor="#ccc"
            multiline={true}
            numberOfLines={4}
            value={DescriptionTxt}
            onChangeText={setDescriptionTxt}
          />
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={AddManufactureButtonHandler}>
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

const styles = ManufactureModalstyles;

export default AddManufactureModal;
