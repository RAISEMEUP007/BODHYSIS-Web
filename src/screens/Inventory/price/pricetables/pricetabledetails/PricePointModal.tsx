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
import { Picker } from '@react-native-picker/picker';

import { createPricePoint } from '../../../../../api/Price';
import BasicModalContainer from '../../../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../../../common/constants/Message';
import { useAlertModal } from '../../../../../common/hooks/UseAlertModal';

import { priceModalstyles } from './styles/PriceModalStyle';

const PricePointModal = ({ isModalVisible, tableId, setUpdatePointTrigger, closeModal }) => {
  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [duration, setDuration] = useState('');
  const [selectedOption, setSelectedOption] = useState('1');

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

  const handleAddButtonClick = () => {
    if (!duration.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    }

    setIsLoading(true);

    createPricePoint(duration, selectedOption, tableId, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          showAlert('success', jsonRes.message);
          setUpdatePointTrigger(true);
          closeModal();
          break;
        case 409:
          setValidMessage(jsonRes.error);
          break;
        default:
          if (jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          closeModal();
          break;
      }
      setIsLoading(false);
    });
  };

  const checkInput = () => {
    if (!duration.trim()) {
      setValidMessage(msgStr('emptyField'));
    } else {
      setValidMessage('');
    }
  };

  return (
    <Modal animationType="none" transparent={true} visible={isModalVisible}>
      <BasicModalContainer>
        <ModalHeader label={'Add Duration'} closeModal={closeModal} />
        <ModalBody>
          <TextInput
            style={styles.input}
            onChangeText={setDuration}
            value={duration}
            placeholder="Duration"
            placeholderTextColor="#ccc"
            onBlur={checkInput}
          />
          {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>}
          <Picker
            selectedValue={selectedOption}
            style={styles.select}
            onValueChange={(itemValue, itemIndex) => setSelectedOption(itemValue)}
          >
            <Picker.Item label="Hours(s)" value={1} />
            <Picker.Item label="Day(s)" value={2} />
            <Picker.Item label="Week(s)" value={3} />
          </Picker>
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={handleAddButtonClick}>
            <Text style={styles.addButton}>Add</Text>
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

export default PricePointModal;
