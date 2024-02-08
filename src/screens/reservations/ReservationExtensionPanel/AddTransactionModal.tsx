import React, { useState, useEffect} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform
} from 'react-native';

import { } from '../../../api/Settings';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { addTransactionModaltyles } from './styles/AddTransactionModalStyle';

import NumericInput from '../../../common/components/formcomponents/NumericInput';
import LabeledTextInput from '../../../common/components/input/LabeledTextInput';

interface AddTransactionModalProps {
  isModalVisible: boolean;
  closeModal: () => void;
  item?: any;
  onAdded?: (item, AmountTxt) => void;
  onUpdated?: (item, AmountTxt) => void;
  onClose?: () => void;
}

const AddTransactionModal = ({
  isModalVisible,
  closeModal,
  onAdded,
  onClose,
}: AddTransactionModalProps) => {

  const { showAlert } = useAlertModal();
  const [isLoading, setIsLoading] = useState(false);

  const [AmountTxt, setAmountTxt] = useState('');
  const [ValidMessage, setValidMessage] = useState('');
  const [ValidMessage2, setValidMessage2] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

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

  useEffect(() => {
    if(isModalVisible == false){
      setAmountTxt('');
      closeModalhandler();
    }
  }, [isModalVisible])

  const AddButtonHandler = () => {
    if (!paymentMethod.trim()) {
      setValidMessage('Please select a product line');
      return;
    }
    if (!AmountTxt.trim()) {
      setValidMessage2(msgStr('emptyField'));
      return;
    }else if(!isNaN(parseInt(AmountTxt)) && parseInt(AmountTxt)>0){
      onAdded(paymentMethod, AmountTxt);
      closeModalhandler();
    }
  };

  const closeModalhandler = () => {
    closeModal();
    if(onClose) onClose();
  };

  const checkInput = () => {
    if (!paymentMethod.trim()) {
      setValidMessage(msgStr('emptyField'));
    } else {
      setValidMessage('');
    }
  };

  const checkInput2 = () => {
    if (!paymentMethod.trim()) {
      setValidMessage(msgStr('emptyField'));
    } else {
      setValidMessage('');
    }
  };

  return isModalVisible ? (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <BasicModalContainer>
        <ModalHeader
          label={'Add Transaction'}
          closeModal={() => {
            closeModalhandler();
          }}
        />
        <ModalBody style={{ zIndex: 10 }}>
          <LabeledTextInput
            label='Payment Method'
            width={300}
            // containerStyle={{marginRight:30}}
            placeholder='Payment Method'
            placeholderTextColor="#ccc"
            // inputStyle={{marginVertical:6}}
            value={paymentMethod}
            onChangeText={setPaymentMethod}
            onBlur={checkInput}
          />
          {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>}
          <Text style={styles.label}>Amount</Text>
          <NumericInput
            // style={[styles.input, ]}
            placeholder="Amount"
            value={AmountTxt}
            onChangeText={(value)=>{
              setValidMessage2('');
              setAmountTxt(value);
            }}
            placeholderTextColor="#ccc"
            onBlur={checkInput2}
          />
          {ValidMessage2.trim() != '' && <Text style={styles.message}>{ValidMessage2}</Text>}
        </ModalBody>
        <ModalFooter>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={closeModalhandler}>
              <Text style={styles.addButton}>{'Cancel'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={AddButtonHandler}>
              <Text style={styles.addButton}>{"Add"}</Text>
            </TouchableOpacity>
          </View>
        </ModalFooter>
      </BasicModalContainer>

      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  ) : null;
};

const styles = addTransactionModaltyles;

export default AddTransactionModal;
