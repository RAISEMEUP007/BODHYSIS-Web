import React, {useState} from 'react';
import { Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import {Picker} from '@react-native-picker/picker';

import { createPricePoint } from '../../../api/Price';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';

import { priceModalstyles } from './styles/PriceModalStyle';

const PricePointModal = ({ isModalVisible, setUpdatePointTrigger, closeModal }) => {

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');

  const [duration, setDuration] = useState('');
  const [selectedOption, setSelectedOption] = useState("Hour(s)");

  const handleAddButtonClick = () => {
    if (!duration.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    } 

    createPricePoint(duration, selectedOption, (jsonRes, status, error)=>{
      switch(status){
        case 200:
          showAlert('success', jsonRes.message);
          setUpdatePointTrigger(true);
          closeModal();
          break;
        case 409:
          setValidMessage(jsonRes.error);
          break;
        default:
          if(jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          closeModal();
          break;
      }
    })
  };

  const checkInput = () => {
    if (!duration.trim()) {
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
    >
      <BasicModalContainer>
        <ModalHeader label={"Add Price Point"} closeModal={closeModal} />
        <ModalBody>
          <TextInput
            style={styles.input}
            onChangeText={setDuration}
            value={duration}
            placeholder="Duration"
            onBlur={checkInput}
          />
          {(ValidMessage.trim() != '') && <Text style={styles.message}>{ValidMessage}</Text>}
          <Picker
            selectedValue={selectedOption}
            style={styles.select}
            onValueChange={(itemValue, itemIndex) =>
            setSelectedOption(itemValue)
          }>
            <Picker.Item label="Hours(s)" value="Hours(s)" />
            <Picker.Item label="Day(s)" value="Day(s)" />
            <Picker.Item label="Week(s)" value="Week(s)" />
          </Picker>
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={handleAddButtonClick}>
            <Text style={styles.addButton}>Add</Text>
          </TouchableOpacity>
        </ModalFooter>
      </BasicModalContainer>
    </Modal>
  );
};

const styles = priceModalstyles;

export default PricePointModal;
