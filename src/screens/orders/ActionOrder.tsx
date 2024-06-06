import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, Platform } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { searchAddress } from '../../api/AllAddress ';
import { checkedInBarcode, getReservationDetail, scanBarcode, updateReservation, updateReservationItem } from '../../api/Reservation';
import { getColorcombinationsData } from '../../api/Settings';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../common/hooks/UseConfirmModal';
import BasicLayout from '../../common/components/CustomLayout/BasicLayout';
import { BOHTBody, BOHTD, BOHTDInput, BOHTH, BOHTHead, BOHTR, BOHTable } from '../../common/components/bohtable';
import { BOHButton, BOHToolbar } from '../../common/components/bohtoolbar';
import LabeledTextInput from '../../common/components/input/LabeledTextInput';
import { msgStr } from '../../common/constants/Message';
import { printReservation } from '../../common/utils/Print';

import { actionOrderStyle } from './styles/ActionOrderStyle';
import { formatDate, formatDate2 } from '../../common/utils/DateUtils';

interface Props {
  openOrderScreen: (itemName: string, data?: any ) => void;
  initialData?: any;
}

export const ActionOrder = ({ openOrderScreen, initialData }: Props) => {

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [orderInfo, setOrderInfo] = useState<any>({});
  const [colors, setColors] = useState([{id:null, color_key:'Off color', combination:'', color:' '}]);
  const [barcode, SetBarcode] = useState(initialData.barcode || '');
  const [nextDisable, setNextDisable] = useState(true);

  const [searchedAddresses, setSearchedAddresses] = useState<Array<any>>([]);
  const [selectedAddress, selectAddress] = useState(null);
  const [searchKey, setSearchKey] = useState('');

  const [inputValues, setInputValues] = useState({
    email: '',
    phone_number: '',
    color_id: null,
    note: '',
    deliveryAddress: '',
  });
  const updateTimer = useRef(null);
  const barcodeInputRef = useRef(null);

  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }

    const fetchData = async () => {
      await getReservationDetail(initialData.orderId, (jsonRes, status)=>{
        if(status == 200){
          setOrderInfo(jsonRes);
          if(initialData.barcode && jsonRes) scanBarcodeHandle(initialData.barcode, jsonRes);
        }else setOrderInfo({});
      });
      await getColorcombinationsData((jsonRes)=>{
        setColors([{id:null, color_key:'Off color', combination:'', color:' '}, ...jsonRes]);
      });
    }
  
    fetchData();
  }, []);
  
  useEffect(()=>{
    if(orderInfo){
      let disable = false
      if(orderInfo.stage == 4) disable = true;
      else if(orderInfo.items){
        if(orderInfo.stage == 2){
          orderInfo.items.map((item)=>{
            if(item.status != 3) disable=true;
          });
        }else if(orderInfo.stage == 3){
          orderInfo.items.map((item)=>{
            if(item.status != 4) disable=true;
          });
        }else disable=true;
      }
      setNextDisable(disable)
      const deliveryAddress = orderInfo.use_manual? orderInfo.manual_address: (orderInfo?.all_addresses?.number??'') + ' ' + (orderInfo?.all_addresses?.street??'') + ' ' + (orderInfo?.all_addresses?.plantation??'') + ' ' + (orderInfo?.all_addresses?.property_name??'');
      setInputValues({
        email: orderInfo?.email || orderInfo?.customer?.email || '',
        phone_number: orderInfo?.phone_number || orderInfo?.customer?.phone_number || '',
        color_id: orderInfo?.color?.id??null,
        note: orderInfo?.note || '',
        deliveryAddress: deliveryAddress,
      })
    }else {
      setInputValues({
        email: '',
        phone_number: '',
        color_id: null,
        note: '',
        deliveryAddress: '',
      })
    }
  }, [orderInfo])

  const updateItem = (payload, index) => {
    updateReservationItem(payload, (jsonRes, status)=>{
      if(status == 200){
        setOrderInfo(prevOrderInfo => {
          const updatedItems = [...prevOrderInfo.items];
          updatedItems[index] = {
            ...updatedItems[index],
            status: payload.status,
            barcode: payload.barcode
          };
          return { ...prevOrderInfo, items: updatedItems };
        });
      }
    });
  }

  const renderTableData = () => {
    const rows = [];
    if (orderInfo.items && orderInfo.items.length > 0) {
      orderInfo.items.map((item, index) => {
        let statusStr = item.status == 3?'Checked out' : item.status == 4 ? 'Checked in' : '';
        rows.push(
          <BOHTR key={index}>
            <BOHTD style={{flex:1}}>{item.display_name}</BOHTD>
            <BOHTDInput 
              width={100} 
              value={item.barcode || ''}
              editable={(item.status == 2 || item.status == 3 )? true: false}
              onChangeText={(value)=>{
                const payload = {
                  id: item.id,
                  status: item.status >= 3 ? 4 : 3,
                  barcode: value,
                }
                console.log(payload)
                console.log(item.status)
                updateItem(payload, index);
              }}
            />
            <BOHTD width={100}>{statusStr}</BOHTD>
          </BOHTR>
        );
      });
    } else {
      <></>;
    }
    return <>{rows}</>;
  };

  const scanBarcodeHandle = (barcode, orderInfo) => {
    const barCode = barcode.trim();
    if(!barCode) {
      showAlert('warning', 'There is no scanned barcode');
      return;
    }

    const payload = {
      barcode: barCode,
      reservation_id: orderInfo.id,
    }
    
    if(orderInfo.stage == 2){
      scanBarcode(payload, (jsonRes, status)=>{
        switch (status) {
          case 200:
            const updatedId = jsonRes.item_id;
            const barcode = jsonRes.barcode;
            setOrderInfo(prev=>{
              return {
                ...prev,
                items: prev.items.map(item => {
                  if (item.id === updatedId) {
                    return {
                      ...item,
                      barcode: barcode,
                      status: 3
                    };
                  } else {
                    return item;
                  }
                })
              };
            })
            SetBarcode('');
          barcodeInputRef.current.focus();
          break;
          default:
            if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
            else showAlert('error', msgStr('unknownError'));
            break;
        }
      });
    }else if(orderInfo.stage == 3){
      checkedInBarcode(payload, (jsonRes, status)=>{
        switch (status) {
          case 200:
            const updatedId = jsonRes.item_id;
            const barcode = jsonRes.barcode;
            setOrderInfo(prev=>{
              return {
                ...prev,
                items: prev.items.map(item => {
                  if (item.id === updatedId) {
                    return {
                      ...item,
                      barcode: barcode,
                      status: 4
                    };
                  } else {
                    return item;
                  }
                })
              };
            })
            SetBarcode('');
            barcodeInputRef.current.focus();
            break;
          default:
            if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
            else showAlert('error', msgStr('unknownError'));
            break;
        }
      });
    }
  }

  const handleInputChange = (fieldName, value) => {
    const newValues:any = {
      ...inputValues,
      [fieldName]: value
    };
    if(fieldName === 'color_id'){
      const newColor = colors.find(item => item.id == value);
      newValues.color = newColor; 
    }
    setInputValues(newValues);

    const payload = {
      id: orderInfo.id,
      [fieldName]:value || null
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
  }

  const getAddresses = useCallback(async (q:any) => {
    setSearchKey(q);
    selectAddress(null);
    const filterToken = q.toLowerCase();
    const response = await searchAddress(filterToken, orderInfo.brand_id);
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
  }, [orderInfo])

  const handleAddressChange = (event, value) => {
    const payload={
      id: orderInfo.id,
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

  const processNextStage = () => {
    const payload = {
      id: orderInfo.id,
      stage: (orderInfo.stage * 1 + 1),
    }
    
    updateReservation(payload, (jsonRes, status) => {
      switch (status) {
        case 201:
          setOrderInfo(prev => {
            return { ...prev, stage: (prev.stage + 1) };
          });
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    })
  }

  const printPDF = () => {
    showConfirm(
      'Do you want to include Terms and Conditions?', 
      () => {
        printReservation(orderInfo.id, 1, true);
      },
      () => {
        printReservation(orderInfo.id, 1, false);
      },
      'No'
    );
  }
  return (
    <BasicLayout
      goBack={()=>{
        openOrderScreen('Orders List');
      }} 
      screenName={'Proceed Order'} 
    >
      <div style={{overflow:'auto', padding:'0 30px'}}>
        <div style={{width:'fit-content', margin:'auto'}}>
        <View style={styles.container}>
          <BOHToolbar style={{justifyContent:'flex-end', alignItems:'center',}}>
            <BOHButton
              label='Print'
              onPress={printPDF}
            />
            {/* <BOHButton
              style={{marginLeft:20}}
              label='Update'
              onPress={()=>UpdateDetails()}
            /> */}
          </BOHToolbar>
          <View style={{flexDirection:'row', marginVertical:4}}>
            <LabeledTextInput
              label='Start date'
              width={300}
              containerStyle={{marginRight:30}}
              placeholder='Start date'
              placeholderTextColor="#ccc"
              value={orderInfo.start_date ? formatDate2(new Date(`${orderInfo.start_date} 00:00:00`)) : ''}
              // onChangeText={value => handleInputChange('billableDays', value)}
              editable={false}
            />
            <LabeledTextInput
              label='End date'
              width={300}
              placeholder='End date'
              placeholderTextColor="#ccc"
              value={orderInfo.end_date ? formatDate2(new Date(`${orderInfo.end_date} 00:00:00`)) : ''}
              // onChangeText={value => handleInputChange('billableDays', value)}
              editable={false}
            />
          </View>
          {/* <View style={{flexDirection:'row', marginVertical:4}}>
            <LabeledTextInput
              label='Start location'
              width={300}
              containerStyle={{marginRight:30}}
              placeholder='Start location'
              placeholderTextColor="#ccc"
              value={orderInfo.start_location}
              // onChangeText={value => handleInputChange('billableDays', value)}
              editable={false}
            />
            <LabeledTextInput
              label='End location'
              width={300}
              placeholder='End location'
              placeholderTextColor="#ccc"
              value={orderInfo.end_location}
              // onChangeText={value => handleInputChange('billableDays', value)}
              editable={false}
            />
          </View> */}
          <View style={{flexDirection:'row', marginVertical:4}}>
            <LabeledTextInput
              label='Customer Name'
              width={300}
              containerStyle={{marginRight:30}}
              placeholder='Customer Name'
              placeholderTextColor="#ccc"
              value={orderInfo.customer? orderInfo.customer?.first_name + ' ' + orderInfo.customer?.last_name : ''}
              // onChangeText={value => handleInputChange('billableDays', value)}
              editable={false}
            />
            <LabeledTextInput
              label='Delivery Address'
              width={300}
              placeholder='Delivery Address'
              placeholderTextColor="#ccc"
              value={inputValues.deliveryAddress}
              onChangeText={value => handleInputChange('phone_number', value)}
              editable={false}
            />
          </View>
          <View style={{flexDirection:'row', marginVertical:4}}>
            <LabeledTextInput
              containerStyle={{marginRight:30}}
              label='Email'
              width={300}
              placeholder='Email'
              placeholderTextColor="#ccc"
              value={inputValues.email}
              onChangeText={value => handleInputChange('email', value)}
            />
            {/* <LabeledTextInput
              label='Mobile phone'
              width={300}
              containerStyle={{marginRight:30}}
              placeholder='Mobile phone'
              placeholderTextColor="#ccc"
              value={orderInfo.phone_number || orderInfo?.customer?.mobile_phone || ''}
              onChangeText={value => handleInputChange('billableDays', value)}
              editable={false}
            /> */}
            <LabeledTextInput
              label='Phone Number'
              width={300}
              placeholder='Phone Number'
              placeholderTextColor="#ccc"
              value={inputValues.phone_number}
              onChangeText={value => handleInputChange('phone_number', value)}
            />
          </View>
          <View style={{flexDirection:'row', marginVertical:4}}>
            <View style={{width:300, marginRight:30}}>
              <Text style={styles.label}>Color</Text>
                <Dropdown
                  style={[styles.select, { backgroundColor: colors.find(item=>(item.id == inputValues.color_id))?.color || ' ' }]}
                  placeholderStyle={{color:'#ccc'}}
                  data={colors}
                  maxHeight={300}
                  labelField="color_key"
                  valueField="id"
                  placeholder="Select color"
                  value={inputValues.color_id}
                  renderItem={item=>(
                    <View style={{backgroundColor:item.color, flexDirection:'row', justifyContent:'space-between', paddingVertical:8, paddingHorizontal:12}}>
                      <Text>{item.color_key}</Text>
                      <Text>{item.color}</Text>
                    </View>
                  )}
                  onChange={item => {
                    handleInputChange('color_id', item.id);
                  }}
                />
            </View>
            <LabeledTextInput
              label='Combination'
              width={300}
              placeholder='Combination'
              placeholderTextColor="#ccc"
              value={colors.find(item=>(item.id == inputValues.color_id))?.combination || ' ' }
              onChangeText={value => handleInputChange('billableDays', value)}
              editable={false}
            />
          </View>
          <View style={{flexDirection:'row', marginVertical:4}}>
            <LabeledTextInput
              label='Notes'
              width={630}
              placeholder='Notes'
              placeholderTextColor="#ccc"
              multiline={true}
              inputStyle={{height:150}}
              value={inputValues.note}
              onChangeText={value => handleInputChange('note', value)}
            />
          </View>
          {/* <View style={{flexDirection:'row'}}>
            <TouchableOpacity >
              <Text style={styles.buttonText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity >
              <Text style={styles.buttonText}>NEXT</Text>
            </TouchableOpacity>
          </View> */}
          <View style={[styles.orderRow, {width:'100%'}]}>
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
          <View style={[styles.orderRow, {justifyContent:'flex-end'}]}>
          </View>
          <BOHToolbar style={{justifyContent:'space-between', alignItems:'center',}}>
            <BOHButton 
              disabled={nextDisable}
              label={orderInfo.stage == 2 && "Check Out " || orderInfo.stage == 3 && "Check In" || 'Completed'}
              onPress={processNextStage}
            />
            <Text style={{fontWeight:'bold', fontSize:16}}>{orderInfo.stage == 3 && "All Checked Out!" || orderInfo.stage == 4 && "All Checked In!"}</Text>
            <View style={{flexDirection:'row'}}>
              <TextInput 
                ref={barcodeInputRef}
                editable={orderInfo.stage == 2 || orderInfo.stage == 3 ? true : false}
                style={{ 
                  height: 40,
                  borderColor: 'gray',
                  borderWidth: 1,
                  padding: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                  marginRight: 20,
                }}
                value={barcode}
                onChangeText={SetBarcode}
                onSubmitEditing={()=>scanBarcodeHandle(barcode, orderInfo)} 
              />
              <BOHButton 
                style={{alignSelf:'center'}}
                disabled={(orderInfo.stage == 2 || orderInfo.stage == 3) && nextDisable ? false : true}
                label='Scan'
                onPress={()=>scanBarcodeHandle(barcode, orderInfo)}
              />
            </View>
          </BOHToolbar>
          <BOHTable>
            <BOHTHead>
              <BOHTR>
                <BOHTH style={{flex:1}}>{'item'}</BOHTH>
                <BOHTH width={100}>{'Barcode'}</BOHTH>
                <BOHTH width={100}>{'status'}</BOHTH>
              </BOHTR>
            </BOHTHead>
            <BOHTBody>
              {renderTableData()}
            </BOHTBody>
          </BOHTable>
        </View>
        </div>
      </div>
    </BasicLayout>
  );
};

const styles = actionOrderStyle;
