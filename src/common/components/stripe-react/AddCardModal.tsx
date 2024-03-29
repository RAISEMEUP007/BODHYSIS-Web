import React, { useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BasicModalContainer from '../basicmodal/BasicModalContainer';
import ModalHeader from '../basicmodal/ModalHeader';
import ModalBody from '../basicmodal/ModalBody';
import ModalFooter from '../basicmodal/ModalFooter';
import { useAlertModal } from '../../hooks/UseAlertModal';
import { API_URL } from '../../constants/AppConstants';

interface AddCardModalProps {
  isModalVisible: boolean;
  customerId: string;
  reservationId: number;
  closeModal: () => void;
  // item?: any;
  onAdded?: (paymentMethod) => void;
  // onUpdated?: (item, AmountTxt) => void;
  onClose?: () => void;
}

const AddCardModal = ({
  isModalVisible,
  customerId,
  reservationId,
  closeModal,
  onAdded,
  onClose,
}: AddCardModalProps) => {

  const stripe = useStripe();
  const elements = useElements();

  const { showAlert } = useAlertModal();
  const [isLoading, setIsLoading] = useState(false);
  const [ValidMessage, setValidMessage] = useState(' ');

  const handleCardElementChange = (event) => {
    if (event.error) {
      setValidMessage(event.error.message);
    } else {
      setValidMessage(' ');
    }
  };

  const AddButtonHandler = async () => {
    // setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      showAlert("Failed to load Stripe.js");
      return;
    }
    
    const cardElement = elements.getElement(CardElement);

    // const { error, paymentMethod } = await stripe.createPaymentMethod({
    //   type: 'card',
    //   card: cardElement,
    // });

    const result = await stripe.createToken(cardElement);

    console.log(result.token);

    if( !result ){
      setValidMessage('Error');
      return;
    }
    
    if( result.error ){
      setValidMessage( result.error.message);
      return;
    }

    const token = await AsyncStorage.getItem('access-token');
    const response = await fetch(`${API_URL}/stripe/addcardtokentocustomer/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        cardToken: result.token.id,
        customerId: customerId,
      }),
    });    

    if (!response.ok) {
      const errorMessage = await response.json();
      setValidMessage(errorMessage.error);
      return;
    }

    showAlert('success', 'Card Added successfully');
    if(onAdded) onAdded(result.token);
    closeModalhandler();
  };

  const closeModalhandler = () => {
    closeModal();
    if(onClose) onClose();
  };

  useEffect(()=>{
    setValidMessage(' ');
  }, [isModalVisible])

  return isModalVisible ? (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <BasicModalContainer>
        <ModalHeader
          label={'Stripe'}
          closeModal={() => {
            closeModalhandler();
          }}
        />
        <ModalBody style={{ zIndex: 10 }}>
          <View style={{width:700, marginTop:6, paddingVertical: 12, paddingHorizontal:8, borderWidth:1, borderColor: '#808080'}}>
            <CardElement options={{ style: {base: { fontSize: '16px' }}}} onChange={handleCardElementChange}/>
          </View>
          <Text style={[styles.message, {width:700, flexWrap:'wrap'}]}>{ValidMessage}</Text>
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

const styles = StyleSheet.create({
  label: {
    color: '#555',
    fontSize: 12,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 10,
    padding: 10,
    paddingHorizontal: 8,
    minWidth: 300,
  },
  addButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: 10,
    textAlign: 'center',
    borderRadius: 5,
    marginLeft:10,
  },
  message: {
    width: '100%',
    color: 'red',
    marginBottom: 0,
    marginTop: 0,
    fontSize: 14,
    paddingLeft: 5,
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
});
;

export default AddCardModal;
