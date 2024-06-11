import React, { useState, useEffect, useRef, forwardRef } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid';

import DatePicker from 'react-datepicker';

import { quickAddDiscountCode, updateDiscountCode } from '../../../api/Settings';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks';

import { discountCodeModalstyles } from './styles/DiscountCodeModalStyle';
import Exclusions from './Exclusions';
import AddExclusionModal from './AddExclusionModal';

const AddDiscountCodeModal = ({
  isModalVisible,
  DiscountCode,
  setUpdateDiscountCodeTrigger,
  closeModal,
}) => {
  const isUpdate = DiscountCode ? true : false;
  const inputRef = useRef(null);

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [ValidMessage2, setValidMessage2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const DiscountCodeId = useRef();
  const [updateExclusionTrigger, setUpdateExclusionTrigger] = useState(true);

  useEffect(() => {
    if (DiscountCode) DiscountCodeId.current = DiscountCode.id;
    else {
      DiscountCodeId.current = parseInt(uuidv4(), 16);
    }
  }, [DiscountCode]);

  const [isExclusionModalVisible, setExclusionModalVisible] = useState(false);
  const [selectedExclusion, setSelectedExclusion] = useState(null);
  const openExclusionModal = () => {
    setExclusionModalVisible(true);
    setSelectedExclusion(null);
  };
  const closeExclusionModal = () => {
    setExclusionModalVisible(false);
    setSelectedExclusion(null);
  };
  const editExclusion = (exclusion) => {
    setSelectedExclusion(exclusion);
    setExclusionModalVisible(true);
  };

  const [types, setTypes] = useState([
    { id: 1, type: 'Percentage' },
    { id: 2, type: 'Flat fee' },
  ]);
  const [CountsTxt, setCountsTxt] = useState('');
  const [CodePrefixTxt, setCodePrefixTxt] = useState('');
  const [Type, setType] = useState(0);
  const [AmountTxt, setAmountTxt] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);


  useEffect(() => {
    // if(isModalVisible){
    //   console.log(DiscountCode);
    //   if(DiscountCode){
    //     setCodePrefixTxt(DiscountCode.code);
    //     setType(DiscountCode.type);
    //     setAmountTxt(DiscountCode.amount);
    //     if(DiscountCode.valid_start_date) setStartDate(new Date(DiscountCode.valid_start_date));
    //     if(DiscountCode.valid_end_date) setEndDate(new Date(DiscountCode.valid_end_date));
    //   }else{
    setCountsTxt('');
    setCodePrefixTxt('');
    setType(0);
    setAmountTxt('');
    setStartDate(null);
    setEndDate(null);
    //   }
    // }else{
    // }
  }, [isModalVisible]);

  const AddButtonHandler = () => {
    if (!CountsTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    }
    if (!CodePrefixTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    }

    setIsLoading(true);

    const payload = {
      rowcounts: CountsTxt,
      code_prefix: CodePrefixTxt,
      type: Type,
      amount: AmountTxt,
      valid_start_date: startDate,
      valid_end_date: endDate,
    };

    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateDiscountCodeTrigger(true);
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

    quickAddDiscountCode(payload, (jsonRes, status) => {
      handleResponse(jsonRes, status);
    });
  };

  const closeModalhandler = () => {
    closeModal();
  };

  const checkInput = () => {
    if (!CountsTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
    } else {
      setValidMessage('');
    }
  };

  const checkInput2 = () => {
    if (!CodePrefixTxt.trim()) {
      setValidMessage2(msgStr('emptyField'));
    } else {
      setValidMessage2('');
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
      <View style={{ paddingRight: 22 }}>
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
          label={'Quick Add'}
          closeModal={() => {
            closeModalhandler();
          }}
        />
        <ModalBody style={{ zIndex: 10 }}>
          <Text style={styles.label}>How many do you want to create?</Text>
          <TextInput
            style={[styles.input, { width: 300 }]}
            placeholder="How many?"
            value={CountsTxt}
            onChangeText={setCountsTxt}
            placeholderTextColor="#ccc"
            onBlur={checkInput}
          />
          {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>}
          <Text style={styles.label}>Code prefix</Text>
          <TextInput
            style={styles.input}
            placeholder="Code prefix"
            value={CodePrefixTxt}
            onChangeText={setCodePrefixTxt}
            placeholderTextColor="#ccc"
            onBlur={checkInput2}
          />
          {ValidMessage2.trim() != '' && <Text style={styles.message}>{ValidMessage2}</Text>}
          {/* <View style={{flexDirection:'row', zIndex:10}}>
            <View style={{flex: 1, marginRight: 20}}>
              <Text style={styles.label}>Type</Text>
              <Picker style={styles.select} selectedValue={Type} onValueChange={setType}>
                {types.length>0 && ( types.map((type, index) => {
                  return <Picker.Item key={index} label={type.type} value={type.id} />
                }))}
              </Picker>
              <Text style={styles.label}>Start date</Text>
              {Platform.OS == 'web' && renderDatePicker(startDate, setStartDate)}
            </View>
            <View style={{flex: 1, marginRight: 0}}>
              <Text style={styles.label}>Amount</Text>
              <TextInput style={styles.input} placeholder="Amount" value={AmountTxt} onChangeText={setAmountTxt} placeholderTextColor="#ccc"/>
              <Text style={styles.label}>End date</Text>
              {Platform.OS == 'web' && renderDatePicker(endDate, setEndDate)}
            </View>
          </View>    */}
          {/* <Exclusions DiscountCodeId={DiscountCodeId.current} updateExclusionTrigger={updateExclusionTrigger} setUpdateExclusionTrigger={setUpdateExclusionTrigger} openExclusionModal={openExclusionModal} editExclusion={editExclusion}></Exclusions>      */}
        </ModalBody>
        <ModalFooter>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={AddButtonHandler}>
              <Text style={styles.addButton}>{isUpdate ? 'Update' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
        </ModalFooter>
      </BasicModalContainer>

      <AddExclusionModal
        isModalVisible={isExclusionModalVisible}
        DiscountCodeId={DiscountCodeId.current}
        Exclusion={selectedExclusion}
        setUpdateExclusionTrigger={setUpdateExclusionTrigger}
        closeModal={closeExclusionModal}
      />
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  ) : null;
};

const styles = discountCodeModalstyles;

export default AddDiscountCodeModal;
