import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

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

  console.log(barcode);

  const [inputValues, setInputValues] = useState({
    email: '',
    phone_number: '',
    color_id: null,
    note: '',
    deliveryAddress: '',
  });

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

  const UpdateDetails = () => {
    const payload = {
      id: orderInfo.id,
      ...inputValues
    }
    updateReservation(payload, (jsonRes, status)=>{
      if(status == 201) showAlert('success', 'Updated successfully');
    });
  }

  const UpdateOrderInfo = (key: string, value: any) => {
    const payload = {
      id: orderInfo.id,
      [key]:value || null
    }
    updateReservation(payload, (jsonRes)=>{
      const newColor = key === 'color_id' ? colors.find(item => item.id == value) : orderInfo.color;
      setOrderInfo(prevOrderInfo => ({ ...prevOrderInfo, [key]: value, color: newColor }));
    });
  };

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
    const newValues = {
      ...inputValues,
      [fieldName]: value
    };
    // setInputValues(newValues);
    UpdateOrderInfo(fieldName, value);
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
              value={orderInfo.start_date ? new Date(`${orderInfo.start_date} 0:0:0`).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }) : ''}
              // onChangeText={value => handleInputChange('billableDays', value)}
              editable={false}
            />
            <LabeledTextInput
              label='End date'
              width={300}
              placeholder='End date'
              placeholderTextColor="#ccc"
              value={orderInfo.end_date ? new Date(`${orderInfo.end_date} 0:0:0`).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }) : ''}
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
