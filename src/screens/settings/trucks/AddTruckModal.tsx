import React, {useState, useEffect, useRef} from 'react';
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator, Platform, Image, Picker } from 'react-native';

import { createTruck, updateTruck } from '../../../api/Settings';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';

import { truckModalstyles } from './styles/TruckModalStyle';
import { API_URL } from '../../../common/constants/AppConstants';

const AddTruckModal = ({ isModalVisible, Truck, setUpdateTruckTrigger, closeModal }) => {
  const isUpdate = Truck ? true : false;
  const inputRef = useRef(null);

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const [TruckNameTxt, setTruckNameTxt] = useState('');
  const [TruckShortNameTxt, setTruckShortNameTxt] = useState('');
  const [TruckBarcodeTxt, setTruckBarcodeTxt] = useState('');

  useEffect(() => {
    if(Platform.OS === 'web'){
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
    if(isModalVisible){
      if(Truck){
        setTruckNameTxt(Truck.name);
        setTruckShortNameTxt(Truck.short_name);
        setTruckBarcodeTxt(Truck.barcode);
      }else{
        setTruckNameTxt('');
        setTruckShortNameTxt('');
        setTruckBarcodeTxt('');
      }
    }else{
    }
  }, [isModalVisible])

  const AddButtonHandler = () => {
    if (!TruckNameTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    } 
    
    setIsLoading(true);

    const payload = {
      name: TruckNameTxt,
      short_name: TruckShortNameTxt,
      barcode: TruckBarcodeTxt,
    }

    const handleResponse = (jsonRes, status) => {
      switch(status){
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateTruckTrigger(true);
          closeModal();
          break;
        case 409:
          setValidMessage(jsonRes.error);
          break;
        default:
          if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          closeModal();
          break;
      }
      setIsLoading(false);
    };
    
    if (isUpdate) {
      payload.id = Truck.id;
      updateTruck(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    } else {
      createTruck(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    }
  };

  const closeModalhandler = () =>{
    closeModal();
  }

  const checkInput = () => {
    if (!TruckNameTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
    } else {
      setValidMessage('');
    }
  };

  return (
    isModalVisible?(
    <View style={{position:'absolute', width:"100%", height:"100%"}}>
      <BasicModalContainer>
        <ModalHeader label={"Truck"} closeModal={()=>{ closeModalhandler();}} />
        <ModalBody>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} placeholder="Name" value={TruckNameTxt} onChangeText={setTruckNameTxt} placeholderTextColor="#ccc" onBlur={checkInput}/>
          {(ValidMessage.trim() != '') && <Text style={styles.message}>{ValidMessage}</Text>}
          <Text style={styles.label}>Short Name</Text>
          <TextInput style={styles.input} placeholder="Short Name" value={TruckShortNameTxt} onChangeText={setTruckShortNameTxt} placeholderTextColor="#ccc"/>
          <Text style={styles.label}>Barcode</Text>
          <TextInput style={styles.input} placeholder="Barcode" value={TruckBarcodeTxt} onChangeText={setTruckBarcodeTxt} placeholderTextColor="#ccc"/>
        </ModalBody>
        <ModalFooter>
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity onPress={AddButtonHandler}>
              <Text style={styles.addButton}>{isUpdate?"Update":"Add"}</Text>
            </TouchableOpacity>
          </View>
        </ModalFooter>
      </BasicModalContainer>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View >)
    :null
  );
};

const styles = truckModalstyles;

export default AddTruckModal;
