import React, {useState} from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import {Picker} from '@react-native-picker/picker';

import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { API_URL } from '../../../common/constants/appConstants';
import { msgStr } from '../../../common/constants/message';
import { TextSmallSize } from '../../../common/constants/fonts';
import { useAlertModal } from '../../../common/hooks/useAlertModal';

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

    const payload = {
      duration: duration,
      durationType: selectedOption,
    };
    fetch(`${API_URL}/price/addpricepoint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(async (res) => {
      try {
        const jsonRes = await res.json();
        if(res.status == 409){
          setValidMessage(jsonRes.message);
        }else if(res.status == 200){
          showAlert('success', jsonRes.message);
          setUpdatePointTrigger(true);
          closeModal();
        }else{
          showAlert('success', jsonRes.message);
          closeModal();
        }
      } catch (err) {
        console.log(err);
      }
    })
    .catch((err) => {
      showAlert('error', msgStr('serverError'));
      closeModal();
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

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    padding: 8,
    width: 320,
  },
  select: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    padding: 8,
  },
  addButton: {
    backgroundColor: 'blue',
    color: 'white',
    padding: 10,
    textAlign: 'center',
    borderRadius: 5,
  },
  message: {
    width: '100%',
    color: 'red',
    marginBottom: 0,
    marginTop: -10,
    fontSize: TextSmallSize,
    paddingLeft: 5,
  },
});

export default PricePointModal;
