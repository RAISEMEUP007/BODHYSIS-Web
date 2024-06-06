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

import { createLocation, updateLocation } from '../../../api/Settings';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { commonModalStyle } from '../../../common/components/basicmodal';

const AddLocationModal = ({ isModalVisible, Location, setUpdateLocationsTrigger, closeModal }) => {
  const isUpdate = Location ? true : false;

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [LocationTxt, setLocationTxt] = useState('');
  const [DescriptionTxt, setDescriptionTxt] = useState('');


  const AddLocationButtonHandler = () => {
    if (!LocationTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    }

    setIsLoading(true);

    const payload:any = {
      location: LocationTxt,
      description: DescriptionTxt,
    };

    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateLocationsTrigger(true);
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
      payload.id = Location.id;
      updateLocation(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    } else {
      createLocation(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    }
  };

  const checkInput = () => {
    if (!LocationTxt.trim()) {
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
        setLocationTxt(Location ? Location.location : '');
        setDescriptionTxt(Location ? Location.description : '');
      }}
    >
      <BasicModalContainer>
        <ModalHeader label={'Location'} closeModal={closeModal} />
        <ModalBody>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={LocationTxt}
            onChangeText={setLocationTxt}
            placeholderTextColor="#ccc"
            onBlur={checkInput}
            onSubmitEditing={AddLocationButtonHandler}
          />
          {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>}
          {/* <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Description"
            placeholderTextColor="#ccc"
            multiline={true}
            numberOfLines={4}
            value={DescriptionTxt}
            onChangeText={setDescriptionTxt}
          /> */}
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={AddLocationButtonHandler}>
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

export default AddLocationModal;
