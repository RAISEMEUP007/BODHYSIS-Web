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
import CheckBox from 'expo-checkbox';

import { getExtrasData } from '../../api/Settings';
import { getProductCategoriesData, getProductFamiliesDataByDisplayName } from '../../api/Product';
import BasicModalContainer from '../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../common/constants/Message';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import NumericInput from '../../common/components/formcomponents/NumericInput';

import { addReservationItemModalstyles } from './styles/addReservationItemModalStyle';

interface AddReservationItemModalProps {
  isModalVisible: boolean;
  closeModal: () => void;
  item?: any;
  onAdded?: (item, Quantity, selectedExtras) => void;
  onUpdated?: (oldItem, newItem, Quantity, selectedExtras) => void;
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
  const [Quantity, setQuantity] = useState(1);
  const [selectedProductFamily, selectProductFamily] = useState();
  const [selectedProductId, setSelectedProductId] = useState(0);
  const [extras, setExtras] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);

  const [productCategoriesData, setProductCategoriesData] = useState([]);
  const [productFamiliesData, setProductFamiliesData] = useState([]);
  const [filteredFamilies, setFilteredFamilies] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);

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
    getProductCategoriesData((jsonRes)=>{
      setProductCategoriesData(jsonRes);
      setSelectedCategoryId(jsonRes[0].id);
    });
    getProductFamiliesDataByDisplayName(0, (jsonRes) => {
      setProductFamiliesData(jsonRes);
    })
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
    if(productFamiliesData && productFamiliesData.length>0){
      if(item){
        const familyId = item.family_id;
        const selectedItem = productFamiliesData.find(item => item.id === familyId);
        setSelectedCategoryId(selectedItem?.category_id);
        selectProductFamily(selectedItem);
        setSelectedProductId(familyId);
      }else{
        setSelectedCategoryId(productFamiliesData[0].category_id);
        selectProductFamily(productFamiliesData[0]);
        setSelectedProductId(productFamiliesData[0].id);
      }
    }
  }, [productFamiliesData, isModalVisible])

  // console.log(selectedProductFamily);
  useEffect(() => {
    if(isModalVisible == true){
      setQuantity(item?item.quantity:1);
    }else {
      setQuantity(1);
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

  useEffect(()=>{
    const filteredFamilies = productFamiliesData.filter(item=>item.category_id == selectedCategoryId);
    setFilteredFamilies(filteredFamilies);
  }, [productFamiliesData, productCategoriesData, selectedCategoryId])

  const AddButtonHandler = () => {
    if (selectedProductId == 0) {
      setValidMessage('Please select a product family');
      return;
    }
    if(Quantity>0){
      if(mode == 'add' && onAdded) onAdded(selectedProductFamily, Quantity, selectedExtras);
      else if(mode == 'update' && onUpdated) onUpdated(item, selectedProductFamily, Quantity, selectedExtras);
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
    // if (!Quantity.trim()) {
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
          <Text style={styles.label}>Category</Text>
          <Picker
            style={styles.select}
            selectedValue={selectedCategoryId}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedCategoryId(itemValue);
            }}
          >
            {productCategoriesData.length > 0 &&
              productCategoriesData.map((item, index) => {
                return <Picker.Item key={index} label={item.category} value={item.id}/>;
              })
            }
          </Picker>
          <Text style={styles.label}>Family</Text>
          <Picker
            style={styles.select}
            selectedValue={selectedProductId}
            onValueChange={(itemValue, itemIndex) => {
              selectProductFamily(filteredFamilies[itemIndex]);
              setSelectedProductId(filteredFamilies[itemIndex].id);
            }}
          >
            {filteredFamilies.length > 0 &&
              filteredFamilies.map((item, index) => {
                return <Picker.Item key={index} label={item.display_name} value={item.id} />;
              })
            }
          </Picker>
          {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>}
          {mode == 'add' && <>
            <Text style={styles.label}>Quantity</Text>
            <NumericInput
              validMinNumber = {1}
              style={styles.input}
              placeholder="Quantity"
              value={Quantity}
              onChangeText={(value)=>{
                setValidMessage2('');
                setQuantity(value);
              }}
              placeholderTextColor="#ccc"
              onBlur={checkInput2}
            />
          </>}
          {ValidMessage2.trim() != '' && <Text style={styles.message}>{ValidMessage2}</Text>}
          {isExtra && (
            <View style={{width:500}}>
              <Text style={[styles.label, {color:'#000000'}]}>Extras</Text>
              <View style={{flexDirection:'row', marginTop:8, flexWrap:'wrap'}}>
                {extras.map((item, index)=>{
                  return (
                    <Pressable key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16, marginBottom:8 }} onPress={() => selectExtras(item)}>
                      <CheckBox value={selectedExtras.includes(item)} style={{ marginRight: 6 }} />
                      <Text style={[styles.label, { color: '#333' }]}>{item.name}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
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
