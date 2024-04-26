import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { reservationMainInfoStyle } from './styles/ReservationMainInfoStyle';
import LabeledTextInput from '../../common/components/input/LabeledTextInput';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CommonSelectDropdown } from '../../common/components/CommonSelectDropdown/CommonSelectDropdown';
import { DropdownData } from '../../common/components/CommonDropdown/CommonDropdown';
import { LocationType } from '../../types/LocationType';
import { useRequestLocationsQuery } from '../../redux/slices/baseApiSlice';
import { getDiscountCodesData } from '../../api/Settings';
import { updateReservation } from '../../api/Reservation';
import { msgStr } from '../../common/constants/Message';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import { getBrandDetail } from '../../api/Price';

if (Platform.OS === 'web') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'react-datepicker/dist/react-datepicker.css';
  document.head.appendChild(link);
}

const ReservationMainInfo = ({ details, setUpdateCount }) => {
  const { showAlert } = useAlertModal();
  // console.log(details);

  const [inputValues, setInputValues] = useState({
    startDate: '',
    endDate: '',
    billableDays: 0,
    reservationDuration: '',
    discountCode: '',
    customPrice: '',
    referrer: '',
    group: '',
    startLocationId: '',
    endLocationId: '',
    deliveryAddress: ''
  });

  const [discountCodes, setDiscountCodes] = useState([]);
  const [brandDetail, setBrandDetail] = useState<any>({});

  useEffect(() => {
    if(details){
      const _startDate = new Date(details.start_date).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit',})
      const _endDate = new Date(details.end_date).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', })

      const billableDays = Math.ceil((new Date(details.end_date).getTime() - new Date(details.start_date).getTime()) / (1000 * 60 * 60 * 24));

      const totalHours = (new Date(details.end_date).getTime() - new Date(details.start_date).getTime()) / (1000 * 60 * 60);
      const days = Math.floor(totalHours / 24);
      const hours = Math.floor(totalHours % 24);
      const durationText = hours > 0 ? `${days} days and ${hours} hours` : `${days} days`;

      setInputValues({
        startDate: _startDate,
        endDate: _endDate,
        billableDays: billableDays,
        reservationDuration: durationText,
        discountCode: details.promo_code || '',
        customPrice: details.customPrice || '',
        referrer: details.referrer || '',
        group: details.group || '',
        startLocationId: details.start_location_id || '',
        endLocationId: details.end_location_id || '',
        deliveryAddress: details?.delivery_address?.address1??''
      });
    }
  }, [details]);

  useEffect(()=>{
    console.log(details);
    if(details && details.brand_id){
      getBrandDetail({id:details.brand_id}, (jsonRes, status)=>{
        if(status == 200) setBrandDetail(jsonRes);
        else setBrandDetail({});
      });
    } else setBrandDetail({});
  }, [details])

  useEffect(() => {
    if (inputValues.startDate && inputValues.endDate) {
      const _startDate = new Date(inputValues.startDate) || new Date();
      const _endDate = new Date(inputValues.endDate) || new Date();
  
      const calculateBillableDaysAndDuration = () => {
        const billableDays = Math.ceil((_endDate.getTime() - _startDate.getTime()) / (1000 * 60 * 60 * 24));

        const totalHours = (_endDate.getTime() - _startDate.getTime()) / (1000 * 60 * 60);
        const days = Math.floor(totalHours / 24);
        const hours = Math.floor(totalHours % 24);
        const durationText = hours > 0 ? `${days} days and ${hours} hours` : `${days} days`;

        setInputValues(prev => ({
          ...prev,
          billableDays: billableDays,
          reservationDuration: durationText
        }));
      };
  
      calculateBillableDaysAndDuration();
    }
  }, [inputValues.startDate, inputValues.endDate]);

  useEffect(()=>{
    getDiscountCodesData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setDiscountCodes(jsonRes);
          break;
      }
    });
  }, [])

  const { data: locationsData } = useRequestLocationsQuery({}, {refetchOnFocus: true,});
  
  const locationsDropdownData = useMemo(() => {
    if (!locationsData?.length) {
      return [];
    }

    const result: DropdownData<LocationType> = locationsData.map((item, index) => {
      return {
        value: item,
        displayLabel: item.location,
        index,
      };
    });
    return result;
  }, [locationsData]);

  const defaultStartLocation = useMemo(()=>{
    if(details && details.start_location_id)
      return locationsDropdownData.find(item=>item.value.id == details.start_location_id);
    else return null;
  }, [details, locationsData]);

  const defaultEndLocation = useMemo(()=>{
    if(details && details.end_location_id)
      return locationsDropdownData.find(item=>item.value.id == details.end_location_id);
    else return null;
  }, [details, locationsData]);

  const discountCodesDropdownData = useMemo(() => {
    if (!discountCodes?.length) {
      return [];
    }

    const result: Array<any> = discountCodes.map((item, index) => {
      return {
        value: item,
        displayLabel: item.code,
        index,
      };
    });
    return result;
  }, [discountCodes]);

  const defaultDiscountCode = useMemo(()=>{
    if(details && details.promo_code)
      return discountCodesDropdownData.find(item=>item.value.id == details.promo_code);
    else return null;
  }, [details, discountCodes]);
  
  const handleInputChange = (fieldName, value) => {
    const newValues = {
      ...inputValues,
      [fieldName]: value
    };

    const discountInfo = discountCodes.find((item) => item.id === newValues.discountCode);
    const discountAmount = discountInfo.type == 1 ? (Math.round(details.subtotal * discountInfo.amount) / 100) : discountInfo.amount;

    const payload:any = {
      id: details.id,
      // start_date : newValues.startDate,
      // end_date : newValues.endDate,
      promo_code: newValues.discountCode,
      discount_amount: discountAmount,
      total_price: details.subtotal + details.tax_amount - discountAmount,
    }

    if(newValues.startLocationId) payload.start_location_id = newValues.startLocationId
    if(newValues.endLocationId) payload.end_location_id = newValues.endLocationId
    if(newValues.deliveryAddress) payload.delivery_address = newValues.deliveryAddress

    updateReservation(payload, (jsonRes, status) => {
      switch (status) {
        case 201:
          setInputValues(newValues);
          setUpdateCount(prev => prev + 1);
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    })

  };

  // const CustomInput = forwardRef(({ value, onChange, onClick }:any, ref) => (
  //   <input
  //     onClick={onClick}
  //     onChange={onChange}
  //     ref={ref}
  //     style={styles.input}
  //     value={value}
  //   ></input>
  // ))

  // const renderDatePicker = (selectedDate, onChangeHandler, minDate = null) => {
  //   return (
  //     <View>
  //       <DatePicker
  //         selected={selectedDate}
  //         onChange={(date) => onChangeHandler(date)}
  //         customInput={<CustomInput />}
  //         minDate={minDate}
  //         // disabled={true}
  //         peekNextMonth
  //         showMonthDropdown
  //         showYearDropdown
  //         dropdownMode="select"
  //         timeInputLabel="Time:"
  //         dateFormat="MM/dd/yyyy hh:mm aa"
  //         showTimeSelect
  //       />
  //     </View>
  //   );
  // };

  return (
    <View>
      <View style={[styles.reservationRow, {zIndex:10}]}>
        <View style={{flex:1, padding:1}}>
          <Text style={{marginBottom:6, color:"#555555"}}>{'Brand'}</Text>
          <Text style={[styles.text, {width:630}]} selectable={true}>{brandDetail?.brand??' '}</Text>
        </View>
        {/* <View>
          <Text style={{marginBottom:6, color:"#555555"}}>{'Season'}</Text>
          <Text style={styles.text} selectable={true}>{inputValues.endDate || ' '}</Text>
        </View> */}
      </View>
      <View style={[styles.reservationRow, {zIndex:10}]}>
        <View>
          <Text style={{marginBottom:6, color:"#555555"}}>{'Start date'}</Text>
          {/* {Platform.OS == 'web' && renderDatePicker(inputValues.startDate, (date)=>{handleInputChange('startDate', date)})} */}
          <Text style={styles.text} selectable={true}>{inputValues.startDate || ' '}</Text>
        </View>
        <View>
          <Text style={{marginBottom:6, color:"#555555"}}>{'End date'}</Text>
          {/* {Platform.OS == 'web' && renderDatePicker(inputValues.endDate, (date)=>{handleInputChange('endDate', date)}, inputValues.startDate)} */}
          <Text style={styles.text} selectable={true}>{inputValues.endDate || ' '}</Text>
        </View>
      </View>
      <View style={styles.reservationRow}>
        <LabeledTextInput
          label='Billable days'
          width={300}
          containerStyle={{marginRight:30}}
          placeholder='Billable days'
          placeholderTextColor="#ccc"
          inputStyle={{marginVertical:6}}
          value={inputValues.billableDays.toString()}
          onChangeText={value => handleInputChange('billableDays', value)}
          editable={false}
        />
        <LabeledTextInput
          label='Reservation duration'
          width={300}
          placeholder='Reservation duration'
          placeholderTextColor="#ccc"
          inputStyle={{marginVertical:6}}
          value={inputValues.reservationDuration}
          onChangeText={value => handleInputChange('reservationDuration', value)}
          editable={false}
        />
      </View>
      <View style={styles.reservationRow}>
        <CommonSelectDropdown
          containerStyle={{
            marginRight: 30,
          }}
          width={300}
          height={40}
          onItemSelected={(item) => {
            handleInputChange('discountCode', item.value.id);
          }}
          data={discountCodesDropdownData}
          placeholder="Select A Code"
          title={'Discount code'}
          titleStyle={{marginBottom:6, color:"#555555", fontSize:14}}
          defaultValue={defaultDiscountCode}
        />
        <LabeledTextInput
          label='Custom Price'
          width={300}
          placeholder='Custom Price'
          placeholderTextColor="#ccc"
          inputStyle={{marginVertical:6}}
          value={inputValues.customPrice}
          onChangeText={value => handleInputChange('customPrice', value)}
        />
      </View>
      {/* <View style={styles.reservationRow}> */}
        {/* <LabeledTextInput
          label='Referrer'
          width={300}
          containerStyle={{marginRight:30}}
          placeholder='Referrer'
          placeholderTextColor="#ccc"
          inputStyle={{marginVertical:6}}
          value={inputValues.referrer}
          onChangeText={value => handleInputChange('referrer', value)}
        /> */}
        {/* <LabeledTextInput
          label='Group'
          width={300}
          placeholder='Group'
          placeholderTextColor="#ccc"
          inputStyle={{marginVertical:6}}
          value={inputValues.group}
          onChangeText={value => handleInputChange('group', value)}
        /> */}
      {/* </View> */}
      <View style={styles.reservationRow}>
        {/* <CommonSelectDropdown
          containerStyle={{
            marginRight: 30,
          }}
          width={300}
          height={40}
          onItemSelected={(item) => {
            handleInputChange('startLocationId', item.value.id);
          }}
          data={locationsDropdownData}
          placeholder="Select A Location"
          title={'Start Location'}
          titleStyle={{marginBottom:6, color:"#555555", fontSize:14}}
          defaultValue={defaultStartLocation}
        /> */}
        {/* <CommonSelectDropdown
          containerStyle={{
            // marginRight: 40,
          }}
          width={300}
          height={40}
          onItemSelected={(item) => {
            handleInputChange('endLocationId', item.value.id);
          }}
          data={locationsDropdownData}
          placeholder="Select A Location"
          title={'End Location'}
          titleStyle={{marginBottom:6, color:"#555555", fontSize:14}}
          defaultValue={defaultEndLocation}
        /> */}
        <LabeledTextInput
          label='Delivery Address'
          width={630}
          placeholder='Delivery Address'
          placeholderTextColor="#ccc"
          inputStyle={{marginVertical:6}}
          value={inputValues.deliveryAddress}
          onChangeText={value => handleInputChange('group', value)}
        />
      </View>
    </View>
  );
};

const styles = reservationMainInfoStyle;

export default ReservationMainInfo;
