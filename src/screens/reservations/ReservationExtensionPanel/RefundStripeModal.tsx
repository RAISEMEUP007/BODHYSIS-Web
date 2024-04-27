import React, { useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform
} from 'react-native';

import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import NumericInput from '../../../common/components/formcomponents/NumericInput';
import { addTransactionModaltyles } from './styles/AddTransactionModalStyle';
import { RadioButton } from 'react-native-paper';
import { refundStripe } from '../../../api/Stripe';
import { msgStr } from '../../../common/constants/Message';

interface RefundStripeModalProps {
  isModalVisible: boolean;
  refundDetails: any;
  closeModal: () => void;
}

const RefundStripeModal = ({
  isModalVisible,
  refundDetails,
  closeModal,
}: RefundStripeModalProps) => {

  const { showAlert } = useAlertModal();
  const [isLoading, setIsLoading] = useState(false);
  const [option, setOption] = useState<number>(1);
  const [amount, setAmount] = useState<number>(0);

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

  useEffect(()=>{
    setAmount(refundDetails.amount);
  }, [isModalVisible])

  const refund = async () =>{
    const payload = {
      ...refundDetails,
      option: option,
      manual_amount: amount,
    }
    refundStripe(payload, (jsonRes, status)=>{
      switch (status) {
        case 201:
          showAlert('success', 'Refunded successfully');
          closeModal();
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          closeModal();
          break;
      }
    });
  }

  const closeModalhandler = () => {
    closeModal();
  };

  return isModalVisible ? (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <BasicModalContainer>
        <ModalHeader
          label={'Refund Stripe'}
          closeModal={() => {
            closeModalhandler();
          }}
        />
        <ModalBody style={{ zIndex: 10 }}>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:10, marginBottom:12, paddingRight:12}}>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
              <RadioButton
                value={option.toString()}
                status={option == 1? 'checked': 'unchecked'}
                onPress={()=>setOption(1)}
                color="#0099ff"
              />
              <Text>{"All"}</Text>
            </View>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
              <RadioButton
                value={option.toString()}
                status={option == 2? 'checked': 'unchecked'}
                onPress={()=>setOption(2)}
                color="#0099ff"
              />
              <Text>{"Partial"}</Text>
            </View>
          </View>
          <Text style={styles.label}>Amount</Text>
          <NumericInput
            editable={option === 1? false: true}
            style={[styles.input, {textAlign:'right'}, option === 1 && {color:'#ccc', borderColor:'#ccc'}]}
            placeholder="Amount"
            value={amount?amount:0}
            onChangeText={setAmount}
            placeholderTextColor="#ccc"
          />
        </ModalBody>
        <ModalFooter>
          <View style={{ flexDirection: 'row', width:'100%', alignItems:'center', justifyContent:'flex-end' }}>
            <View style={{ flexDirection: 'row', alignItems:'center',}}>
              <TouchableOpacity onPress={closeModalhandler}>
                <Text style={[styles.addButton]}>{'Cancel'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{refund()}}>
                <Text style={styles.addButton}>{"Refund"}</Text>
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

export default RefundStripeModal;
