import React, {useState} from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';

import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { API_URL } from '../../../common/constants/appConstants';
import { msgStr } from '../../../common/constants/message';
import { useAlertModal } from '../../../common/hooks/useAlertModal';

const CreateGroupModal = ({ isModalVisible, groupName, closeModal }) => {

  const { showAlert } = useAlertModal();

  const [_groupName, setGroupname] = useState(groupName);

  const handleAddButtonClick = () => {
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
        closeModal();
        showAlert('success', jsonRes.message);
      } catch (err) {
        console.log(err);
      }
    })
    .catch((err) => {
      console.log(err);
      showAlert('error', msgStr('serverError'));
    });
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isModalVisible}
    >
      <BasicModalContainer>
        <ModalHeader label={"Create price group"} closeModal={closeModal} />
        <ModalBody>
          <TextInput
            style={styles.input}
            onChangeText={setGroupname}
            value={_groupName}
            placeholder="Price group name"
          />
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
  },
  addButton: {
    backgroundColor: 'blue',
    color: 'white',
    padding: 10,
    textAlign: 'center',
    borderRadius: 5,
  },
});

export default CreateGroupModal;
