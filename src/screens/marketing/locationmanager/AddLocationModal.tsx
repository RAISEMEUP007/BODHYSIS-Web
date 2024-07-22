import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  View,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import CheckBox from 'expo-checkbox';
import { Picker } from '@react-native-picker/picker';

import { createAddress, updateAddress, getStreetsData, getPlantationsData, getPropertyNamesData } from '../../../api/AllAddress ';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks';
import { commonModalStyle } from '../../../common/components/basicmodal';

const AddLocationModal = ({ isModalVisible, details, setUpdateLocationsTrigger, closeModal }) => {
  const isUpdate = details ? true : false;

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [streets, setStreetsData] = useState([]);
  const [plantations, setPlantationsData] = useState([]);
  const [propertyNames, setPropertyNames] = useState([]);

  const [formValues, setFormValues] = useState<any>({
    id: null,
    number:null,
    street: null,
    street_id: null,
    plantation : null,
    plantation_id : null,
    property_name : null,
    property_name_id : null,
    property_type : 0,
    voucher_potential : null,
    fif_potential : null,
    guests : null,
    bedrooms : null,
    rental_company : null,
    xploriefif : null,
    xplorievoucher : null,
    geolat : null,
    geolong : null,
  });

  useEffect(()=>{
    getStreetsData((jsonRes)=>{
      setStreetsData(jsonRes);
    })
    getPlantationsData((jsonRes)=>{
      setPlantationsData(jsonRes);
    })
    getPropertyNamesData((jsonRes)=>{
      setPropertyNames(jsonRes);
    })
  }, [])

  useEffect(() => {
    if (isModalVisible && details) {
      setFormValues({
        id: details.id,
        number:details.number,
        street: details.street,
        street_id: details.street_id,
        plantation : details.plantation,
        plantation_id : details.plantation_id,
        property_name : details.property_name,
        property_name_id : details.property_name_id,
        property_type : details?.property_type??0,
        voucher_potential : details.voucher_potential,
        fif_potential : details.fif_potential,
        guests : details.guests,
        bedrooms : details.bedrooms,
        rental_company : details.rental_company,
        xploriefif : details.xploriefif,
        xplorievoucher : details.xplorievoucher,
        geolat : details.geolat,
        geolong : details.geolong,
      })
    } else {
      setFormValues({
        id: null,
        number:null,
        street: null,
        street_id: null,
        plantation : null,
        plantation_id : null,
        property_name : null,
        property_name_id : null,
        property_type : 0,
        voucher_potential : null,
        fif_potential : null,
        guests : null,
        bedrooms : null,
        rental_company : null,
        xploriefif : false,
        xplorievoucher : false,
        geolat : null,
        geolong : null,
      })
    }
  }, [isModalVisible]);

  const updateFormValues = (key, value) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const AddLocationButtonHandler = () => {
    // if (!LocationTxt.trim()) {
    //   setValidMessage(msgStr('emptyField'));
    //   return;
    // }

    setIsLoading(true);

    // const payload:any = {
    //   location: LocationTxt,
    //   description: DescriptionTxt,
    // };

    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateLocationsTrigger(true);
          closeModal();
          break;
        case 409:
          showAlert('error', "This address is already exist");
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          closeModal();
          break;
      }
      setIsLoading(false);
    };

    if (isUpdate) {
      // formValues.id = Location.id;
      updateAddress(formValues, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    } else {
      createAddress(formValues, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    }
  };

  const checkInput = () => {
    // if (!formValues.trim()) {
    //   setValidMessage(msgStr('emptyField'));
    // } else {
    //   setValidMessage('');
    // }
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isModalVisible}
    >
      <BasicModalContainer>
        <ModalHeader label={isUpdate ? 'Update' : 'Add' + 'Address'} closeModal={closeModal} />
        <ModalBody>
          <View style={{flexDirection:'row'}}>
            <View style={{marginRight: 30}}>
              <Text style={styles.label}>Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Number"
                value={formValues.number || ''}
                onChangeText={val=>updateFormValues('number', val)}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>Plantation</Text>
              <Picker
                style={styles.select}
                selectedValue={formValues.plantation_id || ''}
                onValueChange={(val, index)=>{
                  updateFormValues('plantation_id', val?val:null);
                  updateFormValues('plantation', plantations[index-1]?.plantation??null);
                }}
              >
                <Picker.Item label={""} value={""} />;
                {plantations.map(plantation=>(<Picker.Item key={plantation.id} label={plantation.plantation} value={plantation.id} />))}
              </Picker>
              <Text style={styles.label}>Street</Text>
              <Picker
                style={styles.select}
                selectedValue={formValues.street_id || ''}
                onValueChange={(val, index)=>{
                  updateFormValues('street_id', val?val:null);
                  updateFormValues('street', streets[index-1]?.street??null);
                }}
              >
                <Picker.Item label={""} value={""} />;
                {streets.map(street=>(<Picker.Item key={street.id} label={street.street} value={street.id} />))}
              </Picker>
              <Text style={styles.label}>Property Name</Text>
              <Picker
                style={styles.select}
                selectedValue={formValues.property_name_id || ''}
                onValueChange={(val, index)=>{
                  updateFormValues('property_name_id', val?val:null);
                  updateFormValues('property_name', propertyNames[index-1]?.property_name??null);
                }}
              >
                <Picker.Item label={""} value={""} />;
                {propertyNames.map(item=>(<Picker.Item key={item.id} label={item.property_name} value={item.id} />))}
              </Picker>
              <Text style={styles.label}>Property Type</Text>
              <Picker style={styles.select} selectedValue={formValues.property_type} onValueChange={(val)=>updateFormValues('property_type', val)}>
                <Picker.Item label={"House"} value={0} />;
                <Picker.Item label={"Condo"} value={1} />;
              </Picker>
              <Text style={styles.label}>Voucher Potential</Text>
              <TextInput
                style={styles.input}
                placeholder="Voucher Potential"
                value={formValues.voucher_potential || ''}
                onChangeText={val=>updateFormValues('voucher_potential', val)}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>FIF Potential</Text>
              <TextInput
                style={styles.input}
                placeholder="FIF Potential"
                value={formValues.fif_potential || ''}
                onChangeText={val=>updateFormValues('fif_potential', val)}
                placeholderTextColor="#ccc"
              />
            </View>
            <View>
              <Text style={styles.label}>Guests</Text>
              <TextInput
                style={styles.input}
                placeholder="Guests"
                value={formValues.guests || ''}
                onChangeText={val=>updateFormValues('guests', val)}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>Bedrooms</Text>
              <TextInput
                style={styles.input}
                placeholder="Bedrooms"
                value={formValues.bedrooms || ''}
                onChangeText={val=>updateFormValues('bedrooms', val)}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>Rental Company</Text>
              <TextInput
                style={styles.input}
                placeholder="Rental Company"
                value={formValues.rental_company || ''}
                onChangeText={val=>updateFormValues('rental_company', val)}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>Geolat</Text>
              <TextInput
                style={styles.input}
                placeholder="Geolat"
                value={formValues.geolat || ''}
                onChangeText={val=>updateFormValues('geolat', val)}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>Geolong</Text>
              <TextInput
                style={styles.input}
                placeholder="Geolong"
                value={formValues.geolong || ''}
                onChangeText={val=>updateFormValues('geolong', val)}
                placeholderTextColor="#ccc"
              />
              <Pressable
                style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}
                onPress={() => { updateFormValues('xploriefif', !formValues.xploriefif); }}
              >
                <CheckBox value={formValues.xploriefif} style={{ marginRight: 10 }} />
                <Text>{'Xploriefif'}</Text>
              </Pressable>
              <Pressable
                style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}
                onPress={() => { updateFormValues('xplorievoucher', !formValues.xplorievoucher); }}
              >
                <CheckBox value={formValues.xplorievoucher} style={{ marginRight: 10 }} />
                <Text>{'Xplorievoucher'}</Text>
              </Pressable>
            </View>
          </View>
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={AddLocationButtonHandler}>
            <Text style={styles.addButton}>{isUpdate ? 'Update' : 'Add'}</Text>
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

const styles = commonModalStyle;

export default AddLocationModal;
