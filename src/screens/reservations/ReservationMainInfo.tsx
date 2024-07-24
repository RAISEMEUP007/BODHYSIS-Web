import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { getBrandDetail } from '../../api/Price';
import { updateReservation } from '../../api/Reservation';
import { getDiscountCodesData } from '../../api/Settings';
import { searchAddress } from '../../api/AllAddress ';
import { reservationMainInfoStyle } from './styles/ReservationMainInfoStyle';
import LabeledTextInput from '../../common/components/bohform/LabeledTextInput';
import { CommonSelectDropdown } from '../../common/components/CommonSelectDropdown/CommonSelectDropdown';
import { msgStr } from '../../common/constants/Message';
import { useAlertModal } from '../../common/hooks';
import { formatDate } from '../../common/utils/DateUtils';
import { renderBOHFormDatePicker } from '../../common/components/bohform';

interface InputValues {
  startDate: string;
  endDate: string;
  billableDays: number;
  reservationDuration: string;
  discountCode: string;
  customPrice: string;
  referrer: string;
  group: string;
  note: string;
  deliveryAddress: string;
}

const ReservationMainInfo = ({ details, setUpdateCount }) => {
  const { showAlert } = useAlertModal();

  const [inputValues, setInputValues] = useState<InputValues>({
    startDate: formatDate(new Date()),
    endDate: formatDate(new Date()),
    billableDays: 0,
    reservationDuration: '',
    discountCode: '',
    customPrice: '',
    referrer: '',
    group: '',
    note: '',
    deliveryAddress: ''
  });
  const updateTimer = useRef(null);

  const [discountCodes, setDiscountCodes] = useState([]);
  const [brandDetail, setBrandDetail] = useState<any>({});
  const [searchedAddresses, setSearchedAddresses] = useState<Array<any>>([]);
  const [selectedAddress, selectAddress] = useState(null);
  const [searchKey, setSearchKey] = useState('');

  useEffect(() => {
    if(details){
      const _startDate = formatDate(new Date(`${details.start_date} 00:00:00`))
      const _endDate = formatDate(new Date(`${details.end_date} 00:00:00`))

      const billableDays = Math.ceil((new Date(details.end_date).getTime() - new Date(details.start_date).getTime()) / (1000 * 60 * 60 * 24));

      const totalHours = (new Date(details.end_date).getTime() - new Date(details.start_date).getTime()) / (1000 * 60 * 60);
      const days = Math.floor(totalHours / 24);
      const hours = Math.floor(totalHours % 24);
      const durationText = hours > 0 ? `${days} days and ${hours} hours` : `${days} days`;

      const deliveryAddress = details.use_manual? details.manual_address: (details?.all_addresses?.number??'') + ' ' + (details?.all_addresses?.street??'') + ' ' + (details?.all_addresses?.property_name??'') + ' ' + (details?.all_addresses?.plantation??'');

      setInputValues({
        startDate: _startDate,
        endDate: _endDate,
        billableDays: billableDays,
        reservationDuration: durationText,
        discountCode: details.promo_code || '',
        customPrice: details.customPrice || '',
        referrer: details.referrer || '',
        group: details.group || '',
        deliveryAddress: deliveryAddress,
        note: details.note,
      });

      if(details.use_manual) setSearchKey(details?.manual_address??'');
      else if(details.all_addresses) setSearchKey(`${details.all_addresses.number || ''} ${details.all_addresses.street || ''} ${details.all_addresses.property_name? `${details.all_addresses.property_name}` :''}, ${details.all_addresses.plantation || ''}`);
    }
  }, [details]);

  useEffect(()=>{
    if(details && details.brand_id){
      getBrandDetail({id:details.brand_id}, (jsonRes, status)=>{
        if(status == 200) setBrandDetail(jsonRes);
        else setBrandDetail({});
      });
    } else setBrandDetail({});
  }, [(details && details.brand_id)])

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
          reservationDuration: durationText,
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

  const getAddresses = useCallback(async (q:any) => {
    setSearchKey(q);
    selectAddress(null);
    const filterToken = q.toLowerCase();
    const response = await searchAddress(filterToken, details.brand_id);
    const items = await response.json();
    if (Array.isArray(items)) {
      setSearchedAddresses(
        items.map((address, index) => {
          let addressOption = {
            ...address,
            label: `${address.number || ''} ${address.street || ''}, ${address.plantation || ''}${address.property_name? ` - ${address.property_name}` :''}<span style="display:none;">${index}</span>`
          }
          return addressOption;
        })
      );
    } else {
      setSearchedAddresses([]);
    }
  }, [details])

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

    const payload:any = {
      id: details.id,
    }

    if(newValues.startDate) payload.start_date = newValues.startDate;
    if(newValues.endDate) payload.end_date = newValues.endDate;
    if(newValues.discountCode) payload.promo_code = newValues.discountCode;
    if(newValues.deliveryAddress) payload.delivery_address = newValues.deliveryAddress

    // if(fieldName == 'discountCode'){
    //   const discountInfo = discountCodes.find((item) => item.id === newValues.discountCode);
    //   const discountAmount = discountInfo.type == 1 ? (Math.round(details.subtotal * discountInfo.amount) / 100) : discountInfo.amount;
    //   const taxAmount = (details.subtotal - discountAmount + (details.driver_tip || 0)) * (details.tax_rate?details.tax_rate/100:0) ?? 0;
    //   payload.promo_code = newValues.discountCode;
    //   payload.discount_amount = discountAmount;
    //   payload.tax_amount = taxAmount;
    //   payload.total_price = details.subtotal + details.tax_amount + (details.driver_tip || 0) - discountAmount;
    // }

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

  const handleInputChange2 = (fieldName:'note', value) => {
    const newValues = {
      ...inputValues,
      [fieldName]: value
    };

    setInputValues(newValues);

    const payload:any = {
      id: details.id,
      note: newValues.note,
    }

    if (updateTimer.current) {
      clearTimeout(updateTimer.current);
    }

    updateTimer.current = setTimeout(() => {
      updateReservation(payload, (jsonRes, status) => {
        switch (status) {
          case 201:
            break;
        }
      });
    }, 1000);
  };

  const handleAddressChange = (event, value) => {
    const payload={
      id: details.id,
      address_id : value.id,
      use_manual : false,
    }
    updateReservation(payload, (jsonRes, status) => {
      switch (status) {
        case 201:
          selectAddress(value);
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    })
  }

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
              handleInputChange('startDate', formatDate(date));
          })}
        </View>
        <View style={{width:200}}>
          <Text style={{marginBottom:6, color:"#555555"}}>{'End date'}</Text>
          {Platform.OS == 'web' && 
            renderBOHFormDatePicker(inputValues.endDate, (date) => {
              handleInputChange('endDate', formatDate(date));
          })}
        </View>
      </View>
      {/* <View style={styles.reservationRow}>
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
      </View> */}
      <View style={styles.reservationRow}>
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
          <Text style={styles.text} selectable={true}>{(discountCodes && details && details.promo_code)?discountCodes.find(item=>item.id==details.promo_code)?.amount??' ':' '}</Text>
        </View>
      </View>
      <View style={[styles.reservationRow, {width:'100%'}]}>
        {Platform.OS === 'web' ?
          <>
            <Text style={{marginBottom:6, color:"#555555"}}>{'Delivery Address'}</Text>
            <Autocomplete
              // Multiple={true}
              freeSolo
              sx={{ 
                width: '100%', 
                padding: '0px',
                borderRadius: '0px',
              }}
              disableClearable
              options={searchedAddresses}
              value={selectedAddress}
              inputValue={searchKey}
              onChange={handleAddressChange}
              onInputChange={(event, value)=>{
                getAddresses(value);
              }}
              onClose = {(event: React.SyntheticEvent, reason: string)=>{
                
              }}
              filterOptions={(x) => {
                return x;
              }}
              renderInput={(params) => {
                const text = String(params?.inputProps?.value ?? ' ');
                const spanIndex = text.indexOf('<span');
                const inputVal = spanIndex !== -1 ? text.substring(0, spanIndex) : text;
                return (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      type: 'search',
                      value: inputVal,
                      style: {
                        padding:'2px',
                        fontSize:'14px',
                      }
                    }}
                  />
                )
              }}
              renderOption={(props, option) => {
                const htmlLabel = { __html: option.label };
                return (
                  <li {...props}>
                    <span style={{fontSize:'14px'}} dangerouslySetInnerHTML={htmlLabel} />
                  </li>
                );
              }}
            />
          </>
          :
          <LabeledTextInput
            label='Delivery Address'
            width={"100%"}
            placeholder='Delivery Address'
            placeholderTextColor="#ccc"
            inputStyle={{marginVertical:6}}
            editable={false}
            value={inputValues.deliveryAddress}
            onChangeText={value => handleInputChange('group', value)}
          />}
      </View>

      <View style={[styles.reservationRow]}>
        <LabeledTextInput
          label='Notes'
          width={"100%"}
          placeholder='Notes'
          placeholderTextColor="#ccc"
          multiline={true}
          inputStyle={{height:100}}
          value={inputValues.note}
          onChangeText={value => handleInputChange2('note', value)}
        />
      </View>
    </View>
  );
};

const styles = reservationMainInfoStyle;

export default ReservationMainInfo;
