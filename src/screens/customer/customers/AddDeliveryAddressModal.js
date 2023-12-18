import React, {useState, useEffect, useRef} from 'react';
import { Text, TextInput, TouchableOpacity, Modal, View, ActivityIndicator, Platform, } from 'react-native';
import {Picker} from '@react-native-picker/picker';

import { getCountriesData,  } from '../../../api/Settings';
import { createDeliveryAddress, updateDeliveryAddress } from '../../../api/Customer';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import NumericInput from '../../../common/components/formcomponents/NumericInput';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';

import { customerModalstyles } from './styles/CustomerModalStyle';

const AddDeliveryAddressModal = ({ isModalVisible, DeliveryAddress, setUpdateDeliveryAddressTrigger, closeModal }) => {
  const isUpdate = DeliveryAddress ? true : false;

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [Address1, setAddress1] = useState('');
  const [Address2, setAddress2] = useState('');
  const [CityTxt, setCityTxt] = useState('');
  const [StateTxt, setStateTxt] = useState('');
  const [PostalCodeTxt, setPostalCodeTxt] = useState('');
  const [Country, setCountry] = useState(0);

  const [Countries, setCountries] = useState([]);

  useEffect(() => {
    if(Platform.web){
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
      getCountriesData((jsonRes, status, error) => {
        if( status == 200 ){
          setCountries(jsonRes);
          if(jsonRes[0]){
            if(DeliveryAddress) setCountry(DeliveryAddress.country_id);
            else setCountry(jsonRes[0].id);
          }else setCountry(0);
        }
      })

      if(DeliveryAddress){
        setAddress1(DeliveryAddress.address1);
        setAddress2(DeliveryAddress.address2);
        setCityTxt(DeliveryAddress.city);
        setStateTxt(DeliveryAddress.state);
        setPostalCodeTxt(DeliveryAddress.PostalCode);
      }else{
        setAddress1('');
        setAddress2('');
        setCityTxt('');
        setStateTxt('');
        setPostalCodeTxt('');
      }
    }
  }, [isModalVisible])

  const AddFirstNameButtonHandler = () => {
    
    setIsLoading(true);
    
    const payload  = {
      address1 : Address1,
      address2 : Address2,
      city : CityTxt,
      state : StateTxt,
      postal_code : PostalCodeTxt,
      country_id : Country
    }

    const handleResponse = (jsonRes, status) => {
      switch(status){
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateDeliveryAddressTrigger(true);
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
      payload.id = DeliveryAddress.id
      updateDeliveryAddress(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    } else {
      createDeliveryAddress(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    }
  };

  const checkInput = () => {
    // if (!FirstNameTxt.trim()) {
    //   setValidMessage(msgStr('emptyField'));
    // } else {
    //   setValidMessage('');
    // }
  };

  return (
    isModalVisible?(
    <View style={{position:'absolute', width:"100%", height:"100%"}}>
      <BasicModalContainer>
        <ModalHeader label={"DeliveryAddress"} closeModal={closeModal} />
        <ModalBody>
          <Text style={styles.label}>Address line one</Text>
          <TextInput style={styles.input} placeholder="Address line one" value={Address1} onChangeText={setAddress1} placeholderTextColor="#ccc"/>
          <Text style={styles.label}>Address line two</Text>
          <TextInput style={styles.input} placeholder="Address line two" value={Address2} onChangeText={setAddress2} placeholderTextColor="#ccc"/>
          <Text style={styles.label}>City</Text>
          <TextInput style={styles.input} placeholder="City" value={CityTxt} onChangeText={setCityTxt} placeholderTextColor="#ccc"/>
          <Text style={styles.label}>State</Text> 
          <TextInput style={styles.input} placeholder="State" value={StateTxt} onChangeText={setStateTxt} placeholderTextColor="#ccc"/> 
          <Text style={styles.label}>Postal code</Text> 
          <TextInput style={styles.input} placeholder="Postal code" value={PostalCodeTxt} onChangeText={setPostalCodeTxt} placeholderTextColor="#ccc"/> 
          <Text style={styles.label}>Country</Text> 
          <Picker
            style={styles.select}
            selectedValue={Country}
            onValueChange={setCountry}>
            {Countries.length>0 && (
              Countries.map((country, index) => {
                return <Picker.Item key={index} label={country.country} value={country.id} />
              })
            )}
          </Picker>
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={AddFirstNameButtonHandler}>
            <Text style={styles.addButton}>{isUpdate?"Update":"Add"}</Text>
          </TouchableOpacity>
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

const styles = customerModalstyles;

export default AddDeliveryAddressModal;
