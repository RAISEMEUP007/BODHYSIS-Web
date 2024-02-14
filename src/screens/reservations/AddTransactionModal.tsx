import React, { useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
  StyleSheet
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// import { createStripe } from '../../api/Reservation';
import BasicModalContainer from '../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../common/constants/Message';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import NumericInput from '../../common/components/formcomponents/NumericInput';
import LabeledTextInput from '../../common/components/input/LabeledTextInput';

// import { addStripeModaltyles } from './styles/AddStripeModalStyle';

interface AddStripeModalProps {
  isModalVisible: boolean;
  reservationId: number;
  closeModal: () => void;
  // item?: any;
  // onAdded?: (item, AmountTxt) => void;
  // onUpdated?: (item, AmountTxt) => void;
  onClose?: () => void;
}

const AddStripeModal = ({
  isModalVisible,
  reservationId,
  closeModal,
  // onAdded,
  onClose,
}: AddStripeModalProps) => {

  const { showAlert } = useAlertModal();
  const [isLoading, setIsLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [AmountTxt, setAmountTxt] = useState('');
  const [note, setNote] = useState('');
  const [ValidMessage, setValidMessage] = useState('');
  const [ValidMessage2, setValidMessage2] = useState('');

  const paymentMethodArr = [
    'Lightspeed',
    'Other',
    'Stripe'
  ];

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
    setNote('');
    if(isModalVisible == false){
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
      // onAdded(paymentMethod, AmountTxt);
      addStripe();
      closeModalhandler();
    }
  };

  const addStripe = () =>{
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

    // createStripe(payload, (jsonRes, status) => {
    //   handleResponse(jsonRes, status);
    // });
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
          label={'Stripe'}
          closeModal={() => {
            closeModalhandler();
          }}
        />
        <ModalBody style={{ zIndex: 10 }}>
          <View></View>
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
    marginTop: -10,
    fontSize: 12,
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

export default AddStripeModal;
