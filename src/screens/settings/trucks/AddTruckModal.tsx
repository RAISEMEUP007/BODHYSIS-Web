import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';

import { createTruck, updateTruck } from '../../../api/Settings';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';

import { truckModalstyles } from './styles/TruckModalStyle';
import NumericInput from '../../../common/components/formcomponents/NumericInput';

interface FormValues {
  name: string;
  short_name: string;
  barcode: string;
  license_plate: string;
  max_capacity: number | null;
  hhi_resort: string;
  ocean1: string;
  pd_pass: string;
  sp_pass: string;
  sy_pass: string;
  notes: string;
}


const AddTruckModal = ({ isModalVisible, Truck, setUpdateTruckTrigger, closeModal }) => {
  const isUpdate = Truck ? true : false;
  const inputRef = useRef(null);

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // const [TruckNameTxt, setTruckNameTxt] = useState('');
  // const [TruckShortNameTxt, setTruckShortNameTxt] = useState('');
  // const [TruckBarcodeTxt, setTruckBarcodeTxt] = useState('');

  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    short_name: '',
    barcode: '',
    license_plate: '',
    max_capacity: null,
    hhi_resort: '',
    ocean1: '',
    pd_pass: '',
    sp_pass: '',
    sy_pass: '',
    notes: '',
  });

  const changeFormValue = (name, value) => {
    setFormValues(prev => ({
      ...prev,
      [name]:value,
    }))
  }

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
      if (Truck) {
        setFormValues({
          name: Truck.name || '',
          short_name: Truck.short_name || '',
          barcode: Truck.barcode || '',
          license_plate: Truck.license_plate || '',
          max_capacity: Truck.max_capacity || null,
          hhi_resort: Truck.hhi_resort || '',
          ocean1: Truck.ocean1 || '',
          pd_pass: Truck.pd_pass || '',
          sp_pass: Truck.sp_pass || '',
          sy_pass: Truck.sy_pass || '',
          notes: Truck.notes || '',
        });
      } else {
        setFormValues({
          name: '',
          short_name: '',
          barcode: '',
          license_plate: '',
          max_capacity: null,
          hhi_resort: '',
          ocean1: '',
          pd_pass: '',
          sp_pass: '',
          sy_pass: '',
          notes: '',
        });
      }
    }
    setValidMessage('');
  }, [isModalVisible]);

  const AddButtonHandler = () => {
    if (!formValues.name.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    }

    setIsLoading(true);

    const payload:any = formValues;

    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateTruckTrigger(true);
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

  const closeModalhandler = () => {
    closeModal();
  };

  const checkInput = () => {
    if (!formValues.name.trim()) {
      setValidMessage(msgStr('emptyField'));
    } else {
      setValidMessage('');
    }
  };

  return isModalVisible ? (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <BasicModalContainer>
        <ModalHeader
          label={'Truck'}
          closeModal={() => {
            closeModalhandler();
          }}
        />
        <ModalBody>
          <View style={{flexDirection:'row'}}>
            <View style={{marginRight:25}}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={formValues.name}
                onChangeText={val=>changeFormValue('name', val)}
                placeholderTextColor="#ccc"
                onBlur={checkInput}
              />
              {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>}
              <Text style={styles.label}>Short Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Short Name"
                value={formValues.short_name}
                onChangeText={val=>changeFormValue('short_name', val)}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>Barcode</Text>
              <TextInput
                style={styles.input}
                placeholder="Barcode"
                value={formValues.barcode}
                onChangeText={val=>changeFormValue('barcode', val)}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>License Plate</Text>
              <TextInput
                style={styles.input}
                placeholder="License Plate"
                value={formValues.license_plate}
                onChangeText={val=>changeFormValue('license_plate', val)}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>Max Capacity</Text>
              <NumericInput
                validMinNumber={0}
                style={styles.input}
                placeholder="Max Capacity"
                value={formValues?.max_capacity?.toString()??''}
                onChangeText={val=>changeFormValue('max_capacity', val)}
                placeholderTextColor="#ccc"
              />
            </View>
            <View>
              <Text style={styles.label}>HHI Resort</Text>
              <TextInput
                style={styles.input}
                placeholder="HHI Resort"
                value={formValues.hhi_resort}
                onChangeText={val=>changeFormValue('hhi_resort', val)}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>Ocean1</Text>
              <TextInput
                style={styles.input}
                placeholder="Ocean1"
                value={formValues.ocean1}
                onChangeText={val=>changeFormValue('ocean1', val)}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>PD Pass</Text>
              <TextInput
                style={styles.input}
                placeholder="PD Pass"
                value={formValues.pd_pass}
                onChangeText={val=>changeFormValue('pd_pass', val)}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>SP Pass</Text>
              <TextInput
                style={styles.input}
                placeholder="SP Pass"
                value={formValues.sp_pass}
                onChangeText={val=>changeFormValue('sp_pass', val)}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>SY Pass</Text>
              <TextInput
                style={styles.input}
                placeholder="SY Pass"
                value={formValues.sy_pass}
                onChangeText={val=>changeFormValue('sy_pass', val)}
                placeholderTextColor="#ccc"
              />
            </View>
          </View>
          <Text style={styles.label}>Note</Text>
          <TextInput
            style={[styles.input, {height:120, width:'auto'}]}
            multiline={true}
            placeholder="Note"
            value={formValues.notes}
            onChangeText={val=>changeFormValue('notes', val)}
            placeholderTextColor="#ccc"
          />
        </ModalBody>
        <ModalFooter>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={AddButtonHandler}>
              <Text style={styles.addButton}>{isUpdate ? 'Update' : 'Add'}</Text>
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

const styles = truckModalstyles;

export default AddTruckModal;
