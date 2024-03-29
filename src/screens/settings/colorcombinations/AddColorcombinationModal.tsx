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
import ColorPicker from 'react-native-wheel-color-picker'

import { createColorcombination, updateColorcombination } from '../../../api/Settings';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';

import { ColorcombinationModalstyles } from './styles/ColorcombinationModalStyle';
import NumericInput from '../../../common/components/formcomponents/NumericInput';

const AddColorcombinationModal = ({
  isModalVisible,
  Colorcombination,
  setUpdateColorcombinationsTrigger,
  closeModal,
}) => {
  const isUpdate = Colorcombination ? true : false;

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [ColorKeyTxt, setColorKeyTxt] = useState('');
  const [CombinationTxt, setCombinationTxt] = useState(0);
  const [ColorTxt, setColorTxt] = useState('');
  const [ColorInputTxt, setColorInputTxt] = useState('');

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

  // useEffect(()=>{
  //     setColorTxt(ColorInputTxt);
  // }, [ColorInputTxt])

  useEffect(()=>{
    setColorInputTxt(ColorTxt);
    // const timeout = setTimeout(() => {
    // }, 100);
  
    // return () => {
    //   clearTimeout(timeout);
    // };
  }, [ColorTxt])

  // console.log('dddd');

  const AddColorcombinationButtonHandler = () => {
    if (!ColorKeyTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    }

    setIsLoading(true);

    const payload = {
      color_key: ColorKeyTxt,
      combination: CombinationTxt,
      color: ColorTxt
    };

    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateColorcombinationsTrigger(true);
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
      payload.id = Colorcombination.id;
      updateColorcombination(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    } else {
      createColorcombination(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    }
  };

  const checkInput = () => {
    if (!ColorKeyTxt.trim()) {
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
        setColorKeyTxt(Colorcombination ? Colorcombination.color_key : '');
        setCombinationTxt(Colorcombination && Colorcombination.combination ? Colorcombination.combination : 0);
        setColorTxt(Colorcombination ? Colorcombination.color : '');
      }}
    >
      <BasicModalContainer>
        <ModalHeader label={'Colorcombination'} closeModal={closeModal} />
        <ModalBody>
          <Text style={styles.label}>Color Key</Text>
          <TextInput
            style={styles.input}
            placeholder="Color Key"
            value={ColorKeyTxt}
            onChangeText={setColorKeyTxt}
            placeholderTextColor="#ccc"
            onBlur={checkInput}
          />
          {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>}
          <Text style={styles.label}>Combination</Text>
          <NumericInput
            placeholder="Combination"
            value={CombinationTxt}
            onChangeText={setCombinationTxt}
          ></NumericInput>
          <Text style={styles.label}>Color</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Color"
            placeholderTextColor="#ccc"
            value={ColorInputTxt}
            onChangeText={setColorInputTxt}
            onBlur={(value)=>{setColorTxt(ColorInputTxt)}}
          />
          <View>
            <ColorPicker
              color={ColorTxt}
              onColorChange={(color) => setColorTxt(color)}
              onColorChangeComplete={color => {}}
              thumbSize={30}
              sliderSize={30}
              noSnap={true}
              row={false}
            />
            <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginRight: 10 }}>Selected Color:</Text>
              <View style={{ width: 30, height: 30, backgroundColor: ColorTxt,}} />
            </View>
          </View>
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={AddColorcombinationButtonHandler}>
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

const styles = ColorcombinationModalstyles;

export default AddColorcombinationModal;
