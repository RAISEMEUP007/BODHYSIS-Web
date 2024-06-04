import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { reservationMainInfoStyle } from './styles/ReservationMainInfoStyle';
import LabeledTextInput from '../../common/components/input/LabeledTextInput';
import 'react-datepicker/dist/react-datepicker.css';
import { CommonSelectDropdown, DropdownData } from '../../common/components/CommonSelectDropdown/CommonSelectDropdown';
import { LocationType } from '../../types/LocationType';
import { useRequestLocationsQuery } from '../../redux/slices/baseApiSlice';
import { getDiscountCodesData } from '../../api/Settings';
import { updateReservation } from '../../api/Reservation';
import { msgStr } from '../../common/constants/Message';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import { getBrandDetail } from '../../api/Price';
import { formatDate } from '../../common/utils/DateUtils';
import { renderBOHFormDatePicker } from '../../common/components/bohform';

if (Platform.OS === 'web') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'react-datepicker/dist/react-datepicker.css';
  document.head.appendChild(link);
}

const ReservationMainInfo = ({ details, setUpdateCount }) => {
  const { showAlert } = useAlertModal();

  const [inputValues, setInputValues] = useState({
    startDate: formatDate(new Date()),
    endDate: formatDate(new Date()),
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
      const _startDate = formatDate(new Date(`${details.start_date} 0:0:0`))
      const _endDate = formatDate(new Date(`${details.end_date} 0:0:0`))

      const billableDays = Math.ceil((new Date(details.end_date).getTime() - new Date(details.start_date).getTime()) / (1000 * 60 * 60 * 24));

      const totalHours = (new Date(details.end_date).getTime() - new Date(details.start_date).getTime()) / (1000 * 60 * 60);
      const days = Math.floor(totalHours / 24);
      const hours = Math.floor(totalHours % 24);
      const durationText = hours > 0 ? `${days} days and ${hours} hours` : `${days} days`;

      const deliveryAddress = details.use_manual? details.manual_address: (details?.all_addresses?.number??'') + ' ' + (details?.all_addresses?.street??'') + ' ' + (details?.all_addresses?.plantation??'') + ' ' + (details?.all_addresses?.property_name??'');

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
        deliveryAddress: deliveryAddress
      });
    }
  }, [details]);

  useEffect(()=>{
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
    const taxAmount = (details.subtotal - discountAmount + (details.driver_tip || 0)) * (details.tax_rate?details.tax_rate/100:0) ?? 0;

    const payload:any = {
      id: details.id,
      start_date : newValues.startDate,
      end_date : newValues.endDate,
      promo_code: newValues.discountCode,
      discount_amount: discountAmount,
      tax_amount: taxAmount,
      total_price: details.subtotal + details.tax_amount + (details.driver_tip || 0) - discountAmount,
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

  return (
    <View style={{marginRight:30, zIndex:10}}>
      <View style={[styles.reservationRow]}>
        <View style={{marginRight:30}}>
          <Text style={{marginBottom:6, color:"#555555"}}>{'Order number'}</Text>
          <Text style={styles.text} selectable={true}>{details?.order_number??' '}</Text>
        </View>
        <View>
          <Text style={{marginBottom:6, color:"#555555"}}>{'Brand'}</Text>
          <Text style={[styles.text]} selectable={true}>{brandDetail?.brand??' '}</Text>
        </View>
      </View>
      <View style={[styles.reservationRow]}>
        <View style={{flex:1, padding:1}}>
          <Text style={{marginBottom:6, color:"#555555"}}>{'Customer'}</Text>
          <Text style={[styles.text, {width:'100%'}]} selectable={true}>
            {(details?.customer?.first_name??'') + ' ' + (details?.customer?.last_name ?? '')}
          </Text>
        </View>
      </View>
      <View style={[styles.reservationRow, {zIndex:10}]}>
        <View style={{width:200, marginRight:30}}>
          <Text style={{marginBottom:6, color:"#555555"}}>{'Start date'}</Text>
          {Platform.OS == 'web' && 
            renderBOHFormDatePicker(inputValues.startDate, (date) => {
              const year = date.getFullYear();
              const formattedDate = `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
              handleInputChange('startDate', formattedDate);
          })}
        </View>
        <View style={{width:200}}>
          <Text style={{marginBottom:6, color:"#555555"}}>{'End date'}</Text>
          {Platform.OS == 'web' && 
            renderBOHFormDatePicker(inputValues.endDate, (date) => {
              const year = date.getFullYear();
              const formattedDate = `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
              handleInputChange('endDate', formattedDate);
          })}
        </View>
      </View>
      <View style={styles.reservationRow}>
        <LabeledTextInput
          label='Billable days'
          width={200}
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
          width={200}
          placeholder='Reservation duration'
          placeholderTextColor="#ccc"
          inputStyle={{marginVertical:6}}
          value={inputValues.reservationDuration}
          onChangeText={value => handleInputChange('reservationDuration', value)}
          editable={false}
        />
      </View>
      <View style={styles.reservationRow}>
        {/* <View style={{marginRight:30}}>
          <Text style={{marginBottom:6, color:"#555555"}}>{'Discount code'}</Text>
          <Text style={styles.text} selectable={true}>{(discountCodes && details && details.promo_code)?discountCodes.find(item=>item.id==details.promo_code)?.code:' '}</Text>
        </View> */}
        <CommonSelectDropdown
          containerStyle={{
            marginRight: 30,
          }}
          width={200}
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
        <View>
          <Text style={{marginBottom:6, color:"#555555"}}>{'Discount Rate'}</Text>
          <Text style={styles.text} selectable={true}>{(discountCodes && details && details.promo_code)?discountCodes.find(item=>item.id==details.promo_code)?.amount:' '}</Text>
        </View>
        {/* <LabeledTextInput
          label='Custom Price'
          width={200}
          placeholder='Custom Price'
          placeholderTextColor="#ccc"
          inputStyle={{marginVertical:6}}
          value={inputValues.customPrice}
          onChangeText={value => handleInputChange('customPrice', value)}
        /> */}
      </View>
      <View style={[styles.reservationRow, {width:'100%'}]}>
        <LabeledTextInput
          label='Delivery Address'
          width={"100%"}
          placeholder='Delivery Address'
          placeholderTextColor="#ccc"
          inputStyle={{marginVertical:6}}
          editable={false}
          value={inputValues.deliveryAddress}
          onChangeText={value => handleInputChange('group', value)}
        />
      </View>
    </View>
  );
};

const styles = reservationMainInfoStyle;

export default ReservationMainInfo;
