import React, { useState, useEffect, useRef, forwardRef } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
  Image,
  Picker,
} from 'react-native';

import DatePicker from 'react-datepicker';

import { createExclusion, updateExclusion } from '../../../api/Settings';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks';

import { discountCodeModalstyles } from './styles/DiscountCodeModalStyle';

const AddExclusionModal = ({
  isModalVisible,
  DiscountCodeId,
  Exclusion,
  setUpdateExclusionTrigger,
  closeModal,
}) => {
  const isUpdate = Exclusion ? true : false;
  const inputRef = useRef(null);

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [types, setTypes] = useState([
    { id: 1, type: 'Percentage' },
    { id: 2, type: 'Flat fee' },
  ]);
  const [Description, setDescription] = useState('');
  const [fromdate, setFrom] = useState(null);
  const [todate, setTo] = useState(null);


  useEffect(() => {
    if (isModalVisible) {
      if (Exclusion) {
        setDescription(Exclusion.description);
        if (Exclusion.from_date) setFrom(new Date(Exclusion.from_date));
        if (Exclusion.to_date) setTo(new Date(Exclusion.to_date));
      } else {
        setDescription('');
        setFrom(null);
        setTo(null);
      }
    } else {
    }
  }, [isModalVisible]);

  const AddButtonHandler = () => {
    if (!Description.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    }

    setIsLoading(true);

    const payload = {
      discountcode_id: DiscountCodeId,
      description: Description,
      from_date: fromdate,
      to_date: todate,
    };

    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateExclusionTrigger(true);
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
      payload.id = Exclusion.id;
      updateExclusion(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    } else {
      createExclusion(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    }
  };

  const closeModalhandler = () => {
    closeModal();
  };

  const checkInput = () => {
    if (!Description.trim()) {
      setValidMessage(msgStr('emptyField'));
    } else {
      setValidMessage('');
    }
  };

  const CustomInput = forwardRef(({ value, onChange, onClick }, ref) => (
    <input
      onClick={onClick}
      onChange={onChange}
      ref={ref}
      style={styles.input}
      value={value}
    ></input>
  ));

  const renderDatePicker = (selectedDate, onChangeHandler) => {
    return (
      <View style={{ marginRight: 20 }}>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => onChangeHandler(date)}
          customInput={<CustomInput />}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          timeInputLabel="Time:"
          dateFormat="MM/dd/yyyy hh:mm aa"
          showTimeSelect
        />
      </View>
    );
  };

  return isModalVisible ? (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <BasicModalContainer>
        <ModalHeader
          label={'Discount Code Exclusion'}
          closeModal={() => {
            closeModalhandler();
          }}
        />
        <ModalBody style={{ zIndex: 10 }}>
          <View style={{ width: 400 }}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={Description}
              multiline={true}
              numberOfLines={5}
              onChangeText={setDescription}
              placeholderTextColor="#ccc"
              onBlur={checkInput}
            />
            {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>}
            <View style={{ zIndex: 10 }}>
              <Text style={styles.label}>From</Text>
              {Platform.OS == 'web' && renderDatePicker(fromdate, setFrom)}
            </View>
            <Text style={styles.label}>To</Text>
            {Platform.OS == 'web' && renderDatePicker(todate, setTo)}
          </View>
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

const styles = discountCodeModalstyles;

export default AddExclusionModal;
