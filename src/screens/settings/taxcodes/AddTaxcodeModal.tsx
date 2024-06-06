import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  View,
  ActivityIndicator,
  Platform,
  Switch,
} from 'react-native';

import { createTaxcode, updateTaxcode } from '../../../api/Settings';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';

import { TaxcodeModalstyles } from './styles/TaxcodeModalStyle';
import NumericInput from '../../../common/components/formcomponents/NumericInput';

const AddTaxcodeModal = ({
  isModalVisible,
  Taxcode,
  setUpdateTaxcodesTrigger,
  closeModal,
}) => {
  const isUpdate = Taxcode ? true : false;

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [TaxcodeTxt, setTaxcodeTxt] = useState('');
  const [DescriptionTxt, setDescriptionTxt] = useState('');
  const [RateTxt, setRateTxt] = useState(0);
  const [isSuspended, setIsSuspended] = useState(false);


  const AddTaxcodeButtonHandler = () => {
    if (!TaxcodeTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    }

    setIsLoading(true);

    const payload = {
      code: TaxcodeTxt,
      description: DescriptionTxt,
      rate: RateTxt,
      is_suspended: isSuspended
    };

    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateTaxcodesTrigger(true);
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
      payload.id = Taxcode.id;
      updateTaxcode(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    } else {
      createTaxcode(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    }
  };

  const checkInput = () => {
    if (!TaxcodeTxt.trim()) {
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
        setTaxcodeTxt(Taxcode ? Taxcode.code : '');
        setDescriptionTxt(Taxcode ? Taxcode.description : '');
        setRateTxt(Taxcode && Taxcode.rate ? Taxcode.rate : 0);
        setIsSuspended(Taxcode && Taxcode.is_suspended ? Taxcode.is_suspended : false);
      }}
    >
      <BasicModalContainer>
        <ModalHeader label={'Taxcode'} closeModal={closeModal} />
        <ModalBody>
          <Text style={styles.label}>Taxcode</Text>
          <TextInput
            style={styles.input}
            placeholder="Taxcode"
            value={TaxcodeTxt}
            onChangeText={setTaxcodeTxt}
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
            numberOfLines={3}
            value={DescriptionTxt}
            onChangeText={setDescriptionTxt}
          />
          <Text style={styles.label}>Rate</Text>
          <NumericInput
            placeholder="Rate"
            value={RateTxt}
            onChangeText={setRateTxt}
            // validMinNumber={1}
            // validMaxNumber={100}
          ></NumericInput>

          <View style={{flexDirection: 'row', marginTop:8}}>
            <Text style={[styles.label, {marginRight:20}]}>Suspended</Text>
            <Switch
              trackColor={{ false: '#6c757d', true: '#2e96e1' }}
              thumbColor={isSuspended ? '#ffc107' : '#f8f9fa'}
              ios_backgroundColor="#343a40"
              onValueChange={setIsSuspended}
              value={isSuspended}
            />
          </View>
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={AddTaxcodeButtonHandler}>
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

const styles = TaxcodeModalstyles;

export default AddTaxcodeModal;
