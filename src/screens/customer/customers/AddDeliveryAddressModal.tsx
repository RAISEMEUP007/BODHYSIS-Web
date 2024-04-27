import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { getCountriesData } from '../../../api/Settings';
import { createDeliveryAddress, updateDeliveryAddress } from '../../../api/Customer';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import NumericInput from '../../../common/components/formcomponents/NumericInput';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';

import { customerModalstyles } from './styles/CustomerModalStyle';

const AddDeliveryAddressModal = ({
  isModalVisible,
  DeliveryAddress,
  customerId,
  setUpdateDeliveryAddressTrigger,
  closeModal,
}) => {
  const isUpdate = DeliveryAddress ? true : false;

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [Number, setNumber] = useState('');
  const [StreetName, setStreetName] = useState('');
  const [Plantation, setPlantation] = useState('');
  const [Area, setArea] = useState('');
  const [PropertyName, setPropertyName] = useState('');
  const [Country, setCountry] = useState(0);

  const [Countries, setCountries] = useState([]);

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
    if (isModalVisible) {
      getCountriesData((jsonRes, status, error) => {
        if (status == 200) {
          setCountries(jsonRes);
          if (jsonRes[0]) {
            if (DeliveryAddress) setCountry(DeliveryAddress.country_id);
            else setCountry(jsonRes[0].id);
          } else setCountry(0);
        }
      });

      if (DeliveryAddress) {
        setNumber(DeliveryAddress.Number);
        setStreetName(DeliveryAddress.StreetName);
        setPlantation(DeliveryAddress.city);
        setArea(DeliveryAddress.state);
        setPropertyName(DeliveryAddress.PostalCode);
      } else {
        setNumber('');
        setStreetName('');
        setPlantation('');
        setArea('');
        setPropertyName('');
      }
    }
  }, [isModalVisible]);

  const AddFirstNameButtonHandler = () => {
    setIsLoading(true);

    const payload:any = {
      number: Number,
      street: StreetName,
      plantation: Plantation,
      area: Area,
      property_name: PropertyName,
      // country_id: Country,
      customer_id: customerId,
    };

    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateDeliveryAddressTrigger(true);
          closeModal();
          break;
        case 409:
          setValidMessage(jsonRes.error);
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
      payload.id = DeliveryAddress.id;
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

  return isModalVisible ? (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <BasicModalContainer>
        <ModalHeader label={'DeliveryAddress'} closeModal={closeModal} />
        <ModalBody>
          <Text style={styles.label}>Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Number"
            value={Number}
            onChangeText={setNumber}
            placeholderTextColor="#ccc"
          />
          <Text style={styles.label}>Street name</Text>
          <TextInput
            style={styles.input}
            placeholder="Street Name"
            value={StreetName}
            onChangeText={setStreetName}
            placeholderTextColor="#ccc"
          />
          <Text style={styles.label}>Area</Text>
          <TextInput
            style={styles.input}
            placeholder="Area"
            value={Area}
            onChangeText={setArea}
            placeholderTextColor="#ccc"
          />
          <Text style={styles.label}>Plantation</Text>
          <TextInput
            style={styles.input}
            placeholder="Plantation"
            value={Plantation}
            onChangeText={setPlantation}
            placeholderTextColor="#ccc"
          />
          <Text style={styles.label}>Property name</Text>
          <TextInput
            style={styles.input}
            placeholder="Property name"
            value={PropertyName}
            onChangeText={setPropertyName}
            placeholderTextColor="#ccc"
          />
          {/* <Text style={styles.label}>Country</Text>
          <Picker style={styles.select} selectedValue={Country} onValueChange={setCountry}>
            {Countries.length > 0 &&
              Countries.map((country, index) => {
                return <Picker.Item key={index} label={country.country} value={country.id} />;
              })}
          </Picker> */}
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={AddFirstNameButtonHandler}>
            <Text style={styles.addButton}>{isUpdate ? 'Update' : 'Add'}</Text>
          </TouchableOpacity>
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

const styles = customerModalstyles;

export default AddDeliveryAddressModal;
