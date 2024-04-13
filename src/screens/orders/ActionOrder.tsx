import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, TouchableHighlight, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';
import { Picker } from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

import BasicLayout from '../../common/components/CustomLayout/BasicLayout';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../common/hooks/UseConfirmModal';
import { msgStr } from '../../common/constants/Message';

import { actionOrderStyle } from './styles/ActionOrderStyle';
import LabeledTextInput from '../../common/components/input/LabeledTextInput';
import { getReservationDetail, updateReservation } from '../../api/Reservation';
import { getColorcombinationsData } from '../../api/Settings';

interface Props {
  openOrderScreen: (itemName: string, data?: any ) => void;
  initialData?: any;
}

export const ActionOrder = ({ openOrderScreen, initialData }: Props) => {

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [orderInfo, setOrderInfo] = useState<any>({});
  const [colors, setColors] = useState([]);

  useEffect(()=>{
    getReservationDetail(initialData.orderId, (jsonRes)=>{
      setOrderInfo(jsonRes);
    });
    getColorcombinationsData((jsonRes)=>{
      setColors(jsonRes);
    });
  }, []);

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

  return (
    <BasicLayout
      goBack={()=>{
        openOrderScreen('Orders List');
      }} 
      screenName={'Proceed Order'} 
    >
      <ScrollView 
        contentContainerStyle={styles.topContainer}
        onContentSizeChange={(width, height) => {
          // setContentWidth(width);
        }}>
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
              containerStyle={{marginRight:30}}
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
              containerStyle={{marginRight:30}}
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
              value={''}
              // onChangeText={value => handleInputChange('billableDays', value)}
              editable={false}
            />
            <LabeledTextInput
              label='Email'
              width={300}
              containerStyle={{marginRight:30}}
              placeholder='Email'
              placeholderTextColor="#ccc"
              value={orderInfo.customer? orderInfo.customer.first_name + ' ' + orderInfo.last_name : ''}
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
              containerStyle={{marginRight:30}}
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
              containerStyle={{marginRight:30}}
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
              containerStyle={{marginRight:30}}
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
        </View>
      </ScrollView>
    </BasicLayout>
  );
};

const styles = actionOrderStyle
