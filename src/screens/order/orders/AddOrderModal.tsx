import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  View,
  ActivityIndicator,
  Platform,
  Pressable,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CheckBox from 'expo-checkbox';
import { v4 as uuidv4 } from 'uuid';

import { getLocationsData, getCountriesData, getLanguagesData } from '../../../api/Settings';
import { createOrder, updateOrder } from '../../../api/Order';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import NumericInput from '../../../common/components/formcomponents/NumericInput';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';

import { orderModalstyles } from './styles/OrderModalStyle';

const AddOrderModal = ({ isModalVisible, Order, setUpdateOrderTrigger, closeModal }) => {
  const isUpdate = Order ? true : false;
  // const orderId = useRef();

  // useEffect(() => {
  //   if (Order) orderId.current = Order.id;
  //   else {
  //     orderId.current = parseInt(uuidv4(), 16);
  //   }
  // }, [Order]);

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [emailValidMessage, setEmailValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeliverModalVisible, setDeliveryModalVisible] = useState(false);

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

  const openDeliveryModal = () => {
    setDeliveryModalVisible(true);
  };
  const closeDeliveryModal = () => {
    setDeliveryModalVisible(false);
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

  useEffect(() => {
    if (isModalVisible) {
      getCountriesData((jsonRes, status, error) => {
        if (status == 200) {
          setCountries(jsonRes);
          if (jsonRes[0]) {
            if (Order) setCountry(Order.country_id);
            else setCountry(jsonRes[0].id);
          } else setCountry(0);
        }
      });
      getLanguagesData((jsonRes, status, error) => {
        if (status == 200) {
          setLanguages(jsonRes);
          if (jsonRes[0]) {
            if (Order) setLanguage(Order.language_id);
            else setLanguage(jsonRes[0].id);
          } else setLanguage(0);
        }
      });
      getLocationsData((jsonRes, status, error) => {
        if (status == 200) {
          setLocations(jsonRes);
          if (jsonRes[0]) {
            if (Order) setHomeLocation(Order.home_location);
            else setHomeLocation(jsonRes[0].id);
          } else setHomeLocation(0);
        }
      });

      if (Order) {
        setFirstNameTxt(Order.first_name);
        setLastNameTxt(Order.last_name);
        setEmailTxt(Order.email);
        setPhoneNumber(Order.phone_number);
        setHomeAddress(Order.home_address);
        setCityTxt(Order.city);
        setStateTxt(Order.state);
        setZipcodeTxt(Order.zipcode);
        setMobilePhoneTxt(Order.mobile_phone);
        setDeliveryStreetNumberTxt(Order.delivery_street_number);
        setDeliveryStreetPropertyNameTxt(Order.delivery_street_property_name);
        setDeliveryAreaPlantationTxt(Order.delivery_area_plantation);
        changeOptedIn(Order.marketing_opt_in);
      } else {
        setFirstNameTxt('');
        setLastNameTxt('');
        setEmailTxt('');
        setPhoneNumber('');
        setHomeAddress('');
        setCityTxt('');
        setStateTxt('');
        setZipcodeTxt('');
        setMobilePhoneTxt('');
        setDeliveryStreetNumberTxt('');
        setDeliveryStreetPropertyNameTxt('');
        setDeliveryAreaPlantationTxt('');
        changeOptedIn(false);
      }
    }
  }, [isModalVisible]);

  const AddFirstNameButtonHandler = () => {
    if (!FirstNameTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    }

    setIsLoading(true);

    const payload = {
      first_name: FirstNameTxt,
      last_name: LastNameTxt,
      email: EmailTxt,
      phone_number: PhoneNumber,
      home_address: HomeAddress,
      city: CityTxt,
      state: StateTxt,
      zipcode: ZipcodeTxt,
      mobile_phone: MobilePhoneTxt,
      country_id: Country,
      language_id: Language,
      home_location: HomeLocation,
      delivery_street_number: DeliveryStreetNumberTxt,
      delivery_street_property_name: DeliveryStreetPropertyNameTxt,
      delivery_area_plantation: DeliveryAreaPlantationTxt,
      marketing_opt_in: isOptedIn,
    };

    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateOrderTrigger(true);
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
      payload.id = Order.id;
      updateOrder(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    } else {
      payload.tmpId = orderId.current;
      createOrder(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    }
  };

  const closeModalhandler = () => {
    if (!Order) {
      deleteDeliveryAddressByCId(orderId.current, () => {
        closeModal();
      });
    } else closeModal();
  };

  const checkEmailInput = () => {
    if (!EmailTxt.trim()) {
      setEmailValidMessage(msgStr('emptyField'));
    } else if (!isValidEmailFormat(EmailTxt)) {
      setEmailValidMessage(msgStr('invalidEmailFormat'));
    } else {
      setEmailValidMessage('');
    }
  };

  const isValidEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkInput = () => {
    if (!FirstNameTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
    } else {
      setValidMessage('');
    }
  };

  return isModalVisible ? (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <BasicModalContainer>
        <ModalHeader
          label={'Order'}
          closeModal={() => {
            closeModalhandler();
          }}
        />
        <ModalBody>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, marginRight: 30 }}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={FirstNameTxt}
                onChangeText={setFirstNameTxt}
                placeholderTextColor="#ccc"
                onBlur={checkInput}
              />
              {/* {(ValidMessage.trim() != '') && <Text style={styles.message}>{ValidMessage}</Text>} */}
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={LastNameTxt}
                onChangeText={setLastNameTxt}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={EmailTxt}
                onChangeText={setEmailTxt}
                placeholderTextColor="#ccc"
                onBlur={checkEmailInput}
              />
              {emailValidMessage.trim() != '' && (
                <Text style={styles.message}>{emailValidMessage}</Text>
              )}
              <Text style={styles.label}>Phone Number</Text>
              <NumericInput
                placeholder="Phone Number"
                value={PhoneNumber}
                onChangeText={setPhoneNumber}
              ></NumericInput>
              <Text style={styles.label}>Billing/Home Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Billing/Home Address"
                value={HomeAddress}
                onChangeText={setHomeAddress}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="City"
                value={CityTxt}
                onChangeText={setCityTxt}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                placeholder="State"
                value={StateTxt}
                onChangeText={setStateTxt}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>Zipcode</Text>
              <TextInput
                style={styles.input}
                placeholder="Zipcode"
                value={ZipcodeTxt}
                onChangeText={setZipcodeTxt}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>Mobile Phone</Text>
              <NumericInput
                style={styles.input}
                placeholder="Mobile Phone"
                value={MobilePhoneTxt}
                onChangeText={setMobilePhoneTxt}
                placeholderTextColor="#ccc"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Country</Text>
              <Picker style={styles.select} selectedValue={Country} onValueChange={setCountry}>
                {Countries.length > 0 &&
                  Countries.map((country, index) => {
                    return <Picker.Item key={index} label={country.country} value={country.id} />;
                  })}
              </Picker>
              <Text style={styles.label}>Language</Text>
              <Picker style={styles.select} selectedValue={Language} onValueChange={setLanguage}>
                {Languages.length > 0 &&
                  Languages.map((language, index) => {
                    return (
                      <Picker.Item key={index} label={language.language} value={language.id} />
                    );
                  })}
              </Picker>
              <Text style={styles.label}>Home Location</Text>
              <Picker
                style={styles.select}
                selectedValue={HomeLocation}
                onValueChange={setHomeLocation}
              >
                {Locations.length > 0 &&
                  Locations.map((location, index) => {
                    return (
                      <Picker.Item key={index} label={location.location} value={location.id} />
                    );
                  })}
              </Picker>
              <Text style={styles.label}>Delivery Street Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Delivery Street Number"
                value={DeliveryStreetNumberTxt}
                onChangeText={setDeliveryStreetNumberTxt}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>Delivery Street/ PropertyName</Text>
              <TextInput
                style={styles.input}
                placeholder="Delivery Street/ PropertyName"
                value={DeliveryStreetPropertyNameTxt}
                onChangeText={setDeliveryStreetPropertyNameTxt}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>Delivery Area/Plantation</Text>
              <TextInput
                style={styles.input}
                placeholder="Delivery Area/Plantation"
                value={DeliveryAreaPlantationTxt}
                onChangeText={setDeliveryAreaPlantationTxt}
                placeholderTextColor="#ccc"
              />
              <Pressable
                style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}
                onPress={() => {
                  changeOptedIn(!isOptedIn);
                }}
              >
                <CheckBox value={isOptedIn} style={{ marginRight: 10 }} />
                <Text>{'Marketing Opt-In'}</Text>
              </Pressable>
              <TouchableOpacity style={styles.deliveryButton} onPress={openDeliveryModal}>
                <Text>{'Delivery Address'}</Text>
              </TouchableOpacity>
            </View>
          </View>
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

const styles = orderModalstyles;

export default AddOrderModal;
