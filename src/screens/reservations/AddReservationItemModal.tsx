import React, { useState, useEffect} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
  Pressable
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import BasicModalContainer from '../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../common/constants/Message';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import { addReservationItemModalstyles } from './styles/addReservationItemModalStyle';

import { useRequestProductLinesQuery } from '../../redux/slices/baseApiSlice';
import NumericInput from '../../common/components/formcomponents/NumericInput';
import { getExtrasData } from '../../api/Settings';
import CheckBox from 'expo-checkbox';

interface AddReservationItemModalProps {
  isModalVisible: boolean;
  closeModal: () => void;
  item?: any;
  onAdded?: (item, QuantityTxt, selectedExtras) => void;
  onUpdated?: (oldItem, newItem, QuantityTxt, selectedExtras) => void;
  onClose?: () => void;
  isExtra?: boolean;
}

const AddReservationItemModal = ({
  isModalVisible,
  closeModal,
  item,
  onAdded,
  onUpdated,
  onClose,
  isExtra,
}: AddReservationItemModalProps) => {
  const mode = item? 'update':'add';

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [ValidMessage2, setValidMessage2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [QuantityTxt, setQuantityTxt] = useState('');
  const [selectedProductLine, selectProductLine] = useState();
  const [selectedProductId, setSelectedProductId] = useState(0);
  const [extras, setExtras] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);

  const { data: productLinesData } = useRequestProductLinesQuery({}, { refetchOnFocus: true, });

  const selectExtras = (item) => {
    if (selectedExtras.includes(item)) {
      setSelectedExtras(selectedExtras.filter((extra) => extra !== item));
    } else {
      setSelectedExtras([...selectedExtras, item]);
    }
  };

  
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
    getExtrasData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setExtras(jsonRes);
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    });
  }, []);

  useEffect(()=>{
    if(productLinesData && productLinesData.length>0){
      if(item){
        const lineId = item.line_id;
        const selectedItem = productLinesData.find(item => item.id === lineId);
        selectProductLine(selectedItem);
        setSelectedProductId(lineId);
      }else{
        selectProductLine(productLinesData[0]);
        setSelectedProductId(productLinesData[0].id);
      }
    }
  }, [productLinesData, isModalVisible])

  // console.log(selectedProductLine);
  useEffect(() => {
    if(isModalVisible == true){
      setQuantityTxt(item?item.quantity:'');
    }else {
      setQuantityTxt('');
      closeModalhandler();
    }
  }, [isModalVisible])

  useEffect(()=>{
    if(item && item.extras && item.extras.length>0){
      const idArr = item.extras.map(extra => extra.id);
      const initialExtras = extras.filter(extra => idArr.includes(extra.id));
      setSelectedExtras(initialExtras);
    }else{
      setSelectedExtras([]);
    }
  }, [item, isModalVisible])

  const AddButtonHandler = () => {
    if (selectedProductId == 0) {
      setValidMessage('Please select a product line');
      return;
    }
    if (!QuantityTxt.trim()) {
      setValidMessage2(msgStr('emptyField'));
      return;
    }else if(!isNaN(parseInt(QuantityTxt)) && parseInt(QuantityTxt)>0){
      if(mode == 'add' && onAdded) onAdded(selectedProductLine, parseInt(QuantityTxt), selectedExtras);
      else if(mode == 'update' && onUpdated) onUpdated(item, selectedProductLine, parseInt(QuantityTxt), selectedExtras);
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
          label={mode.replace(/^\w/, (c) => c.toUpperCase()) + ' reservation item'}
          closeModal={() => {
            closeModalhandler();
          }}
        />
        <ModalBody style={{ zIndex: 10 }}>
          <Text style={styles.label}>Product Line</Text>
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
          {isExtra && (
            <>
              <Text style={[styles.label, {color:'#000000'}]}>Extras</Text>
              <View style={{flexDirection:'row', marginTop:8}}>
                {extras.map((item, index)=>{
                  return (
                    <Pressable key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }} onPress={() => selectExtras(item)}>
                      <CheckBox value={selectedExtras.includes(item)} style={{ marginRight: 6 }} />
                      <Text style={[styles.label, { color: '#333' }]}>{item.name}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={closeModalhandler}>
              <Text style={styles.addButton}>{'Cancel'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={AddButtonHandler}>
              <Text style={styles.addButton}>{mode.replace(/^\w/, (c) => c.toUpperCase())}</Text>
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
