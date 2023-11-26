import React, {useState} from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';

import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { API_URL } from '../../../common/constants/appConstants';
import { msgStr } from '../../../common/constants/message';
import { TextSmallSize } from '../../../common/constants/fonts';
import { useAlertModal } from '../../../common/hooks/useAlertModal';

const CreateGroupModal = ({ isModalVisible, groupName, setUpdateGroupTrigger, closeModal }) => {

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');

  const [_groupName, setGroupname] = useState(groupName);

  const handleAddButtonClick = () => {
    if (!_groupName.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    } 

    const payload = {
      group: _groupName,
    };
    fetch(`${API_URL}/price/creategroup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(async (res) => {
      switch (res.status) {
        default:
          break;
      }
      try {
        const jsonRes = await res.json();
        if(res.status == 409){
          setValidMessage(jsonRes.message);
        }else if(res.status == 200){
          showAlert('success', jsonRes.message);
          setUpdateGroupTrigger(true);
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
      console.log(err);
      showAlert('error', msgStr('serverError'));
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
      onShow={()=>{setValidMessage(''); setGroupname(groupName)}}
    >
      <BasicModalContainer>
        <ModalHeader label={"Create price group"} closeModal={closeModal} />
        <ModalBody>
          <TextInput
            style={styles.input}
            onChangeText={setGroupname}
            value={_groupName}
            placeholder="Price group name"
            onBlur={checkInput}
          />
          {(ValidMessage.trim() != '') && <Text style={styles.message}>{ValidMessage}</Text>}
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
    padding: 8,
    width: 320,
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
    marginTop: 0,
    fontSize: TextSmallSize,
    paddingLeft: 5,
  },
});

export default CreateGroupModal;
