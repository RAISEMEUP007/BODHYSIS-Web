import React, { useState, useEffect, useMemo} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome5 } from '@expo/vector-icons';

import { createTransaction } from '../../../api/Reservation';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import NumericInput from '../../../common/components/formcomponents/NumericInput';
import LabeledTextInput from '../../../common/components/input/LabeledTextInput';
import { addTransactionModaltyles } from './styles/AddTransactionModalStyle';
import { getPaymentsList } from '../../../api/Stripe';

interface AddTransactionModalProps {
  isModalVisible: boolean;
  reservationId: number;
  addCard?: ()=> void;
  closeModal: () => void;
  // item?: any;
  // onAdded?: (item, AmountTxt) => void;
  // onUpdated?: (item, AmountTxt) => void;
  onClose?: () => void;
}

type Payment = {
  id: string;
  brand: string;
  last4: string;
  expiration: string;
  // Add other properties as per your data structure
};

const AddTransactionModal = ({
  isModalVisible,
  reservationId,
  addCard,
  closeModal,
  // onAdded,
  onClose,
}: AddTransactionModalProps) => {

  const { showAlert } = useAlertModal();
  const [isLoading, setIsLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentsList, setPaymentsList] = useState<Payment[]>();
  const [paymentId, setPaymentId] = useState('');
  const [AmountTxt, setAmountTxt] = useState('');
  const [note, setNote] = useState('');
  const [ValidMessage, setValidMessage] = useState('');
  const [ValidMessage2, setValidMessage2] = useState('');

  const paymentMethodArr = [
    'Lightspeed',
    'Other',
    'Stripe'
  ];

  const customerId = "cus_PZX06ma31tIVTO";

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
    setPaymentMethod('');
    setAmountTxt('');
    setPaymentId('');
    setNote('');
    if(isModalVisible == false){
      closeModalhandler();
    }
  }, [isModalVisible])

  useEffect(() => {
    const payload = {
      customerId: 'cus_PZX06ma31tIVTO'
    }
    const response = getPaymentsList(payload, (jsonRes)=>{
      setPaymentsList(jsonRes);
    });
    console.log('fwefwefwfewf');
  }, [isModalVisible, addCard])

  const AddButtonHandler = () => {
    if (!paymentMethod.trim()) {
      setValidMessage('Please select a product line');
      return;
    }
    if (!AmountTxt.trim()) {
      setValidMessage2(msgStr('emptyField'));
      return;
    }else if(!isNaN(parseInt(AmountTxt)) && parseInt(AmountTxt)>0){
      // onAdded(paymentMethod, AmountTxt);
      addTransaction();
      closeModalhandler();
    }
  };

  const addTransaction = () =>{
    const payload = {
      reservation_id : reservationId,
      method: paymentMethod,
      amount: AmountTxt,
      note: note,
    }
    
    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 201:
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    };

    createTransaction(payload, (jsonRes, status) => {
      handleResponse(jsonRes, status);
    });
  }

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
    if (!AmountTxt.trim()) {
      setValidMessage2(msgStr('emptyField'));
    } else {
      setValidMessage2('');
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
          <Text style={styles.label}>Status</Text>
          <Picker
            style={styles.select}
            selectedValue={paymentMethod}
            onValueChange={(itemValue, itemIndex) => {
              setPaymentMethod(itemValue);
            }}
          >
            {paymentMethodArr.length > 0 &&
              paymentMethodArr.map((statusItem, index) => {
                return (
                  <Picker.Item key={index} label={statusItem} value={statusItem} />
                );
              })}
          </Picker>
          {paymentMethod.toLocaleLowerCase() === 'stripe' && (
            <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'space-between', marginTop:6, marginBottom:10,}}>
              <Picker
                style={[styles.select, {borderColor: '#999', color:'#666666', width:320, margin:0}]}
                selectedValue={paymentId}
                onValueChange={(itemValue, itemIndex) => {
                  setPaymentId(itemValue);
                }}
              >
                {paymentsList.length > 0 &&
                  paymentsList.map((paymentItem, index) => {
                    return (
                      <Picker.Item key={index} label={`${paymentItem.brand}${"\u00A0".repeat(Math.max(0, 12 - paymentItem.brand.length) * 2)}\u00A0\u00A0\u00A0\u00A0****${paymentItem.last4}\u00A0\u00A0\u00A0\u00A0Exp: ${paymentItem.expiration}`} value={paymentItem.id}/>
                    );
                  })}
              </Picker>
              <TouchableOpacity style={[styles.outLineButton]} onPress={addCard}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <FontAwesome5 name={'plus'} size={18} color="black" style={{marginRight:10, marginTop:1}}/>
                  <Text style={[styles.outlineBtnText]}>Add Card</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          {/* {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>} */}
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
          <LabeledTextInput
            label='Note'
            width={500}
            // containerStyle={{marginRight:30}}
            placeholder='Note'
            placeholderTextColor="#ccc"
            inputStyle={{height:120}}
            multiline={true}
            value={note}
            onChangeText={setNote}
            onBlur={checkInput}
          />
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
