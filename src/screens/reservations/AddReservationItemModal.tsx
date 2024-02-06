import React, { useState, useEffect} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { } from '../../api/Settings';
import BasicModalContainer from '../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../common/constants/Message';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import { addReservationItemModalstyles } from './styles/addReservationItemModalStyle';

import { useRequestProductLinesQuery } from '../../redux/slices/baseApiSlice';
import NumericInput from '../../common/components/formcomponents/NumericInput';

const AddReservationItemModal = ({
  isModalVisible,
  closeModal,
  onAdded,
  onClose = null,
}) => {

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [ValidMessage2, setValidMessage2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [QuantityTxt, setQuantityTxt] = useState('');
  const [selectedProductLine, selectProductLine] = useState();
  const [selectedProductId, setSelectedProductId] = useState(0);

  const { data: productLinesData } = useRequestProductLinesQuery({}, { refetchOnFocus: true, });
  
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
    if(productLinesData && productLinesData.length>0){
      selectProductLine(productLinesData[0]);
      setSelectedProductId(productLinesData[0].id);
    }
  }, [productLinesData])

  useEffect(() => {
    if(isModalVisible == true){
      setQuantityTxt('');
    }else {
      closeModalhandler();
    }
  }, [isModalVisible])

  const AddButtonHandler = () => {
    if (selectedProductId == 0) {
      setValidMessage('Please select a product line');
      return;
    }
    if (!QuantityTxt.trim()) {
      setValidMessage2(msgStr('emptyField'));
      return;
    }else if(!isNaN(parseInt(QuantityTxt)) && parseInt(QuantityTxt)>0){
      onAdded(selectedProductLine, QuantityTxt);
      closeModalhandler();
    }
  };

  const closeModalhandler = () => {
    closeModal();
    if(onClose) onClose();
  };

  const checkInput = () => {
    if (selectedProductId == 0) {
      setValidMessage(msgStr('emptyField'));
    } else {
      setValidMessage('');
    }
  };

  const checkInput2 = () => {
    // if (!QuantityTxt.trim()) {
    //   setValidMessage2(msgStr('emptyField'));
    // } else {
    //   setValidMessage2('');
    // }
    setValidMessage2('');
  };

  return isModalVisible ? (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <BasicModalContainer>
        <ModalHeader
          label={'Quick Add'}
          closeModal={() => {
            closeModalhandler();
          }}
        />
        <ModalBody style={{ zIndex: 10 }}>
          <Text style={styles.label}>How many do you want to create?</Text>
          {/* <TextInput
            style={[styles.input, { width: 300 }]}
            placeholder="How many?"
            value={CountsTxt}
            onChangeText={setCountsTxt}
            placeholderTextColor="#ccc"
            onBlur={checkInput}
          /> */}
          <Picker
            style={styles.select}
            selectedValue={selectedProductId}
            onValueChange={(itemValue, itemIndex) => {
              selectProductLine(productLinesData[itemIndex]);
              setSelectedProductId(productLinesData[itemIndex].id);
            }}
          >
            {productLinesData.length > 0 &&
              productLinesData.map((item, index) => {
                return <Picker.Item key={index} label={item.line + " " + item.size} value={item.id} />;
              })
            }
          </Picker>
          {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>}
          <Text style={styles.label}>Quantity</Text>
          <NumericInput
            validMinNumber = {1}
            style={styles.input}
            placeholder="Quantity"
            value={QuantityTxt}
            onChangeText={(value)=>{
              setValidMessage2('');
              setQuantityTxt(value);
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
              <Text style={styles.addButton}>{'Add'}</Text>
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

const styles = addReservationItemModalstyles;

export default AddReservationItemModal;
