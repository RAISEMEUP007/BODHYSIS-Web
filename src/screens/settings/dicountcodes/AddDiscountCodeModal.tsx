import React, {useState, useEffect, useRef, forwardRef} from 'react';
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator, Platform, Image, Picker } from 'react-native';

import DatePicker from "react-datepicker";

if (Platform.OS === 'web') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'react-datepicker/dist/react-datepicker.css';
  document.head.appendChild(link);
}

import { createDiscountCode, updateDiscountCode } from '../../../api/Settings';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';

import { discountCodeModalstyles } from './styles/DiscountCodeModalStyle';
import { API_URL } from '../../../common/constants/AppConstants';

const AddDiscountCodeModal = ({ isModalVisible, DiscountCode, setUpdateDiscountCodeTrigger, closeModal }) => {
  const isUpdate = DiscountCode ? true : false;
  const inputRef = useRef(null);

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const [types, setTypes] = useState([
    { id: 1, type: 'Percentage' },
    { id: 2, type: 'Flat fee' },
  ]);
  const [CodeTxt, setCodeTxt] = useState('');
  const [Type, setType] = useState(0);
  const [AmountTxt, setAmountTxt] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
      console.log(DiscountCode);
      if(DiscountCode){
        setCodeTxt(DiscountCode.code);
        setType(DiscountCode.type);
        setAmountTxt(DiscountCode.amount);
        if(DiscountCode.valid_start_date) setStartDate(new Date(DiscountCode.valid_start_date));
        if(DiscountCode.valid_end_date) setEndDate(new Date(DiscountCode.valid_end_date));
      }else{
        setCodeTxt('');
        setType(0);
        setAmountTxt('');
        setStartDate(null);
        setEndDate(null);
      }
    }else{
    }
  }, [isModalVisible])

  const AddButtonHandler = () => {
    if (!CodeTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    } 
    
    setIsLoading(true);

    const payload = {
      code: CodeTxt,
      type: Type,
      amount: AmountTxt,
      valid_start_date: startDate,
      valid_end_date: endDate,
    }

    const handleResponse = (jsonRes, status) => {
      switch(status){
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateDiscountCodeTrigger(true);
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
      payload.id = DiscountCode.id;
      updateDiscountCode(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    } else {
      createDiscountCode(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    }
  };

  const closeModalhandler = () =>{
    closeModal();
  }

  const checkInput = () => {
    if (!CodeTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
    } else {
      setValidMessage('');
    }
  };

  const CustomInput = forwardRef(({ value, onChange, onClick }, ref) => (
    <input onClick={onClick} onChange={onChange} ref={ref} style={styles.input} value={value}>
    </input>
  ));

  const renderDatePicker = (selectedDate, onChangeHandler) => {
    return (
      <View style={{marginRight: 20}}>
        <DatePicker
          selected={selectedDate}
          onChange={date => onChangeHandler(date)}
          dateFormat="MM/dd/yyyy"
          customInput={<CustomInput />}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
      </View>
    );
  };

  return (
    isModalVisible?(
    <View style={{position:'absolute', width:"100%", height:"100%"}}>
      <BasicModalContainer>
        <ModalHeader label={"DiscountCode"} closeModal={()=>{ closeModalhandler();}} />
        <ModalBody>
          <Text style={styles.label}>Code</Text>
          <TextInput style={styles.input} placeholder="Code" value={CodeTxt} onChangeText={setCodeTxt} placeholderTextColor="#ccc" onBlur={checkInput}/>
          {(ValidMessage.trim() != '') && <Text style={styles.message}>{ValidMessage}</Text>}
          <View style={{flexDirection:'row', width:600}}>
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
          </View>        
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

const styles = discountCodeModalstyles;

export default AddDiscountCodeModal;
