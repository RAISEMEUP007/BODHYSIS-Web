import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';
import { Picker } from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';

import { checkedInBarcode, getReservationDetail, scanBarcode, updateReservation } from '../../api/Reservation';
import { getColorcombinationsData } from '../../api/Settings';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../common/hooks/UseConfirmModal';
import BasicLayout from '../../common/components/CustomLayout/BasicLayout';
import { BOHTBody, BOHTD, BOHTH, BOHTHead, BOHTR, BOHTable } from '../../common/components/bohtable';
import { BOHButton, BOHToolbar } from '../../common/components/bohtoolbar';
import LabeledTextInput from '../../common/components/input/LabeledTextInput';
import { msgStr } from '../../common/constants/Message';

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
  const [barcode, SetBarcode] = useState('');
  const [nextDisable, setNextDisable] = useState(true);

  useEffect(()=>{
    getReservationDetail(initialData.orderId, (jsonRes)=>{
      setOrderInfo(jsonRes);
    });
    getColorcombinationsData((jsonRes)=>{
      setColors([{id:null, color_key:'Off color', combination:'', color:' '}, ...jsonRes]);
    });
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
      // console.log(item.status);
      setNextDisable(disable)
    }
  }, [orderInfo])

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

  const renderTableData = () => {
    const rows = [];
    if (orderInfo.items && orderInfo.items.length > 0) {
      orderInfo.items.map((item, index) => {
        let statusStr = item.status == 3?'Checked out' : item.status == 4 ? 'Checked in' : '';
        rows.push(
          <BOHTR key={index}>
            <BOHTD style={{flex:1}}>{item.display_name}</BOHTD>
            <BOHTD width={100}>{item.barcode}</BOHTD>
            <BOHTD width={100}>{statusStr}</BOHTD>
          </BOHTR>
        );
      });
    } else {
      <></>;
    }
    return <>{rows}</>;
  };
// console.log(orderInfo);
  const scanBarcodeHandle = () => {
    console.log(barcode);
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
            break;
          default:
            if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
            else showAlert('error', msgStr('unknownError'));
            break;
        }
      });
    }
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
          <View style={{flexDirection:'row', marginVertical:4}}>
            <LabeledTextInput
              label='Start date'
              width={300}
              containerStyle={{marginRight:30}}
              placeholder='Start date'
              placeholderTextColor="#ccc"
              value={orderInfo.start_date ? new Date(orderInfo.start_date).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              }) : ''}
              // onChangeText={value => handleInputChange('billableDays', value)}
              editable={false}
            />
            <LabeledTextInput
              label='End date'
              width={300}
              placeholder='End date'
              placeholderTextColor="#ccc"
              value={orderInfo.end_date ? new Date(orderInfo.end_date).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              }) : ''}
              // onChangeText={value => handleInputChange('billableDays', value)}
              editable={false}
            />
          </View>
          <View style={{flexDirection:'row', marginVertical:4}}>
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
          </View>
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
              label='Email'
              width={300}
              placeholder='Email'
              placeholderTextColor="#ccc"
              value={orderInfo.customer?.email??''}
              // onChangeText={value => handleInputChange('billableDays', value)}
              editable={false}
            />
          </View>
          <View style={{flexDirection:'row', marginVertical:4}}>
            <LabeledTextInput
              label='Mobile phone'
              width={300}
              containerStyle={{marginRight:30}}
              placeholder='Mobile phone'
              placeholderTextColor="#ccc"
              value={orderInfo?.customer?.mobile_phone??''}
              // onChangeText={value => handleInputChange('billableDays', value)}
              editable={false}
            />
            <LabeledTextInput
              label='Phone'
              width={300}
              placeholder='Phone'
              placeholderTextColor="#ccc"
              value={orderInfo?.customer?.phone_number??''}
              // onChangeText={value => handleInputChange('billableDays', value)}
              editable={false}
            />
          </View>
          <View style={{flexDirection:'row', marginVertical:4}}>
            <View style={{width:300, marginRight:30}}>
              <Text style={styles.label}>Color</Text>
                <Dropdown
                  style={[styles.select, { backgroundColor: orderInfo?.color?.color??'defaultColor' }]}
                  placeholderStyle={{color:'#ccc'}}
                  data={colors}
                  maxHeight={300}
                  labelField="color_key"
                  valueField="id"
                  placeholder="Select color"
                  value={orderInfo?.color?.id??null}
                  renderItem={item=>(
                    <View style={{backgroundColor:item.color, flexDirection:'row', justifyContent:'space-between', paddingVertical:8, paddingHorizontal:12}}>
                      <Text>{item.color_key}</Text>
                      <Text>{item.color}</Text>
                    </View>
                  )}
                  onChange={item => {
                    UpdateOrderInfo('color_id', item.id);
                  }}
                />
            </View>
            <LabeledTextInput
              label='Combination'
              width={300}
              placeholder='Combination'
              placeholderTextColor="#ccc"
              value={orderInfo?.color?.combination.toString()??''}
              // onChangeText={value => handleInputChange('billableDays', value)}
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
              value={''}
              // onChangeText={value => handleInputChange('billableDays', value)}
              editable={false}
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
              label='Next'
              onPress={processNextStage}
            />
            <Text style={{fontWeight:'bold', fontSize:16}}>{orderInfo.stage == 3 && "Checked Out!" || orderInfo.stage == 4 && "Checked In!"}</Text>
            <View style={{flexDirection:'row'}}>
              <TextInput 
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
                defaultValue={barcode}
                onChangeText={SetBarcode}
              />
              <BOHButton 
                style={{alignSelf:'center'}}
                disabled={(orderInfo.stage == 2 || orderInfo.stage == 3) && nextDisable ? false : true}
                label='Scan'
                onPress={scanBarcodeHandle}
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

const styles = actionOrderStyle
