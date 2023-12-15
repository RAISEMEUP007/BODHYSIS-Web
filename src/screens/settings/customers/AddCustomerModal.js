import React, {useState, useEffect} from 'react';
import { Text, TextInput, TouchableOpacity, Modal, View, ActivityIndicator, Platform, CheckBox, Pressable } from 'react-native';
import {Picker} from '@react-native-picker/picker';

import { getLocationsData, getCountriesData, getLanguagesData, createCustomer, updateCustomer } from '../../../api/Settings';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';

import { customerModalstyles } from './styles/CustomerModalStyle';
import NumericInput from '../../../common/components/formcomponents/NumericInput';

const AddCustomerModal = ({ isModalVisible, Customer, setUpdateCustomerTrigger, closeModal }) => {

  const isUpdate = Customer ? true : false;

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const [selectedCategory, selectCategory] = useState({});
  const [selectedFamily, selectFamily] = useState({});
  const [FirstNameTxt, setFirstNameTxt] = useState('');
  const [LastNameTxt, setLastNameTxt] = useState('');
  const [EmailTxt, setEmailTxt] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [HomeAddress, setHomeAddress] = useState('');
  const [CityTxt, setCityTxt] = useState('');
  const [StateTxt, setStateTxt] = useState('');
  const [ZipcodeTxt, setZipcodeTxt] = useState('');
  const [MobilePhoneTxt, setMobilePhoneTxt] = useState('');
  const [Country, setCountry] = useState(0);
  const [Language, setLanguage] = useState(0);
  const [HomeLocation, setHomeLocation] = useState(0);
  const [DeliveryStreetNumberTxt, setDeliveryStreetNumberTxt] = useState('');
  const [DeliveryStreetPropertyNameTxt, setDeliveryStreetPropertyNameTxt] = useState('');
  const [DeliveryAreaPlantationTxt, setDeliveryAreaPlantationTxt] = useState('');
  const [isOptedIn, changeOptedIn] = useState(false);

  const [Countries, setCountries] = useState([]);
  const [Languages, setLanguages] = useState([]);
  const [Locations, setLocations] = useState([]);

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
          if(jsonRes[0]) setCountry(jsonRes[0].id);
        }
      })
      getLanguagesData((jsonRes, status, error) => {
        if( status == 200 ){
          setLanguages(jsonRes);
          if(jsonRes[0]) setLanguage(jsonRes[0].id);
        }
      })
      getLocationsData((jsonRes, status, error) => {
        if( status == 200 ){
          setLocations(jsonRes);
          if(jsonRes[0]) setHomeLocation(jsonRes[0].id);
        }
      })
    }
  }, [isModalVisible])

  const AddFirstNameButtonHandler = () => {
    if (!FirstNameTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    } 
    
    setIsLoading(true);
    
    const payload  = {
      first_name: FirstNameTxt,
      last_name : LastNameTxt,
      email : EmailTxt,
      phone_number : PhoneNumber,
      home_address : HomeAddress,
      city : CityTxt,
      state : StateTxt,
      zipcode : ZipcodeTxt,
      mobile_phone : MobilePhoneTxt,
      country_id : Country,
      language_id : Language,
      home_location : HomeLocation,
      delivery_street_number : DeliveryStreetNumberTxt,
      delivery_street_property_name : DeliveryStreetPropertyNameTxt,
      delivery_area_plantation : DeliveryAreaPlantationTxt,
      marketing_opt_in : isOptedIn,
    }

    const handleResponse = (jsonRes, status) => {
      switch(status){
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateCustomerTrigger(true);
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
      payload.id = FirstName.id
      updateCustomer(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    } else {
      createCustomer(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    }
  };

  const checkInput = () => {
    if (!FirstNameTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
    } else {
      setValidMessage('');
    }
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isModalVisible}
      onShow={()=>{
      }}
    >
      <BasicModalContainer>
        <ModalHeader label={"Customer"} closeModal={closeModal} />
        <ModalBody>
          <View style={{flexDirection:'row'}}>
            <View style={{flex: 1, marginRight: 30}}>
              <Text style={styles.label}>First Name</Text>
              <TextInput style={styles.input} placeholder="First Name" value={FirstNameTxt} onChangeText={setFirstNameTxt} placeholderTextColor="#ccc" onBlur={checkInput}/>
              {(ValidMessage.trim() != '') && <Text style={styles.message}>{ValidMessage}</Text>}
              <Text style={styles.label}>Last Name</Text>
              <TextInput style={styles.input} placeholder="Last Name" value={LastNameTxt} onChangeText={setLastNameTxt} placeholderTextColor="#ccc"/>
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} placeholder="Email" value={EmailTxt} onChangeText={setEmailTxt} placeholderTextColor="#ccc"/>
              <Text style={styles.label}>Phone Number</Text>
              <NumericInput placeholder="Phone Number" value={PhoneNumber} onChangeText={setPhoneNumber}></NumericInput>
              <Text style={styles.label}>Billing/Home Address</Text>
              <TextInput style={styles.input} placeholder="Billing/Home Address" value={HomeAddress} onChangeText={setHomeAddress} placeholderTextColor="#ccc"/>
              <Text style={styles.label}>City</Text>
              <TextInput style={styles.input} placeholder="City" value={CityTxt} onChangeText={setCityTxt} placeholderTextColor="#ccc"/>
              <Text style={styles.label}>State</Text> 
              <TextInput style={styles.input} placeholder="State" value={StateTxt} onChangeText={setStateTxt} placeholderTextColor="#ccc"/> 
              <Text style={styles.label}>Zipcode</Text> 
              <TextInput style={styles.input} placeholder="Zipcode" value={ZipcodeTxt} onChangeText={setZipcodeTxt} placeholderTextColor="#ccc"/> 
              <Text style={styles.label}>Mobile Phone</Text> 
              <NumericInput style={styles.input} placeholder="Mobile Phone" value={MobilePhoneTxt} onChangeText={setMobilePhoneTxt} placeholderTextColor="#ccc"/> 
            </View>
            <View style={{flex: 1}}>
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
              <Text style={styles.label}>Language</Text> 
              <Picker
                style={styles.select}
                selectedValue={Language}
                onValueChange={setLanguage}>
                {Languages.length>0 && (
                  Languages.map((language, index) => {
                    return <Picker.Item key={index} label={language.language} value={language.id} />
                  })
                )}
              </Picker>
              <Text style={styles.label}>Home Location</Text>
              <Picker
                style={styles.select}
                selectedValue={HomeLocation}
                onValueChange={setHomeLocation}>
                {Locations.length>0 && (
                  Locations.map((location, index) => {
                    return <Picker.Item key={index} label={location.location} value={location.id} />
                  })
                )}
              </Picker>
              <Text style={styles.label}>Delivery Street Number</Text> 
              <TextInput style={styles.input} placeholder="Delivery Street Number" value={DeliveryStreetNumberTxt} onChangeText={setDeliveryStreetNumberTxt} placeholderTextColor="#ccc"/> 
              <Text style={styles.label}>Delivery Street/ PropertyName</Text> 
              <TextInput style={styles.input} placeholder="Delivery Street/ PropertyName" value={DeliveryStreetPropertyNameTxt} onChangeText={setDeliveryStreetPropertyNameTxt} placeholderTextColor="#ccc"/> 
              <Text style={styles.label}>Delivery Area/Plantation</Text> 
              <TextInput style={styles.input} placeholder="Delivery Area/Plantation" value={DeliveryAreaPlantationTxt} onChangeText={setDeliveryAreaPlantationTxt} placeholderTextColor="#ccc"/> 
              <Pressable style={{flexDirection:'row', marginTop: 10, alignItems:"center"}} onPress={()=>{changeOptedIn(!isOptedIn)}}>
                <CheckBox value={isOptedIn} style={{marginRight:10}}/> 
                <Text>{"Marketing Opt-In"}</Text>
              </Pressable>
              <TouchableOpacity style={styles.deliveryButton}>
                <Text>{"Delivery Address"}</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    </Modal>
  );
};

const styles = customerModalstyles;

export default AddCustomerModal;
