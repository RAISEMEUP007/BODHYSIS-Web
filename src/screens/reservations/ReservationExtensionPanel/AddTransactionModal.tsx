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
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createTransaction } from '../../../api/Reservation';
import { getPaymentsList } from '../../../api/Stripe';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks';
import NumericInput from '../../../common/components/formcomponents/NumericInput';
import LabeledTextInput from '../../../common/components/bohform/LabeledTextInput';
import { API_URL } from '../../../common/constants/AppConstants';

import { addTransactionModaltyles } from './styles/AddTransactionModalStyle';

interface AddTransactionModalProps {
  isModalVisible: boolean;
  customerId: string;
  reservationInfo: any;
  nextStageProcessingStatus?: boolean;
  addCard?: ()=> void;
  closeModal: () => void;
  // item?: any;
  onAdded?: (nextStageProcessing) => void;
  // onUpdated?: (item, AmountTxt) => void;
  continueWithouProcessing?: (nextStageProcessing) => void;
}

type Payment = {
  id: string;
  brand: string;
  last4: string;
  expiration: string;
};

const AddTransactionModal = ({
  isModalVisible,
  customerId,
  reservationInfo,
  nextStageProcessingStatus,
  addCard,
  closeModal,
  onAdded,
  continueWithouProcessing,
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

console.log(paymentId);
  useEffect(() => {
    setPaymentMethod('Stripe');
    setAmountTxt('');
    if(paymentsList && paymentsList.length > 0) setPaymentId(paymentsList[0].id);
    setNote('');
    if(isModalVisible == false){
      // closeModalhandler();
    }
  }, [isModalVisible])

  useEffect(() => {
    if(customerId){
      const payload = {
        customerId: customerId
      }
      getPaymentsList(payload, (jsonRes, status)=>{
        if(status == 200 && jsonRes) {
          setPaymentsList(jsonRes);
          setPaymentId(jsonRes[0].id)
        }
        else setPaymentsList([]);
      });
    }else setPaymentsList([]);
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
      addTransaction();
    }
  };

  const addTransaction = async () =>{

    let paymentIntent = "";
    if(paymentMethod == 'Stripe'){
      const response = await addStripeTrans();
      console.log(response);
      console.log(response.ok);
      if (!response || !response.ok) {
        // const errorMessage = await response.json();
        showAlert('error', "Error while making pyament on Stripe");
        return;
      }
      // console.log(response.json());
      const details = await response.json();
      paymentIntent = details.id;
    }

    const payload = {
      payment_intent : paymentIntent,
      reservation_id : reservationInfo.id,
      method: paymentMethod,
      amount: AmountTxt,
      note: note,
    }
    
    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 201:
          showAlert('success', 'Paid successfully');
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
      closeModalhandler();
      onAdded(nextStageProcessingStatus);
    };

    createTransaction(payload, (jsonRes, status) => {
      handleResponse(jsonRes, status);
    });
  }

  const addStripeTrans = async () => {
    const payload = {
      amount: parseFloat(AmountTxt) * 100,
      currency: 'usd',
      paymentMethod: paymentId,
      customer: customerId,
    }

    const token = await AsyncStorage.getItem('access-token');
    const response = await fetch(`${API_URL}/stripe/makepayment/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });    

    return response;
  }

  const closeModalhandler = () => {
    closeModal();
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
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:10, marginBottom:12, paddingLeft:6, paddingRight:12}}>
            <View>
              <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:6}}>
                <Text style={{marginRight:32}}>Subtotal</Text>
                <Text>{reservationInfo.subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:6}}>
                <Text style={{marginRight:32}}>Discounts</Text>
                <Text>{reservationInfo.discount_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:6}}>
                <Text style={{marginRight:32}}>Driver tip</Text>
                <Text>{reservationInfo.driver_tip.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:6}}>
                <Text style={{marginRight:32}}>Tax</Text>
                <Text>{reservationInfo.tax_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
              </View>
            </View>
            <View>
              <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:6}}>
                <Text style={{marginRight:32}}>Total</Text>
                <Text>{reservationInfo.total_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:6}}>
                <Text style={{marginRight:32}}>Paid</Text>
                <Text>{reservationInfo.paid.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.label}>Method</Text>
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
                  console.log(itemValue);
                  setPaymentId(itemValue);
                }}
              >
                {(paymentsList && paymentsList.length > 0) &&
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
          <View style={{ flexDirection: 'row', width:'100%', alignItems:'center', justifyContent:'space-between' }}>
            <View>
              {nextStageProcessingStatus && (
                <TouchableOpacity onPress={continueWithouProcessing}>
                  <Text style={[styles.addButton, {backgroundColor:'transparent', color:'#0056b3', margin:0}]}>{"Continue without payment"}</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={{ flexDirection: 'row', alignItems:'center',}}>
              <TouchableOpacity onPress={closeModalhandler}>
                <Text style={[styles.addButton]}>{'Cancel'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={AddButtonHandler}>
                <Text style={styles.addButton}>{"Add"}</Text>
              </TouchableOpacity>
            </View>
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
