import React, { useEffect, useState, useRef } from 'react';
import { Text, TouchableOpacity, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { checkedInBarcode, getReservationsData, scanBarcode } from '../../api/Reservation';
import { msgStr } from '../../common/constants/Message';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../common/hooks/UseConfirmModal';
import { TextMediumSize, TextdefaultSize } from '../../common/constants/Fonts';
import { BasicLayout, CommonContainer } from '../../common/components/CustomLayout';
import { BOHTBody, BOHTD, BOHTDIconBox, BOHTH, BOHTHead, BOHTR, BOHTable } from '../../common/components/bohtable';
import { BOHTlbrSearchInput, BOHTlbrSearchPicker, BOHToolbar, BOHTlbRadio, renderBOHTlbDatePicker, BOHButton } from '../../common/components/bohtoolbar';

const OrdersList = ({ navigation, openOrderScreen }) => {

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();
  const InitialWidths = [90, 160, 160, 100, 100, 110, 120, 100, 80, 80];

  const barcodeInputRef = useRef(null);

  const [tableData, setTableData] = useState([]);
  const [updateOrderListTrigger, setUpdateOrderListTrigger] = useState(true);
  const [barcode, SetBarcode] = useState('');
  const [periodRange, setPeriodRange] = useState<any>('');

  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const [ searchOptions, setSearchOptions ] = useState({
    start_date : `${twoWeeksAgo.getFullYear()}-${String(twoWeeksAgo.getMonth() + 1).padStart(2, '0')}-${String(twoWeeksAgo.getDate()).padStart(2, '0')}`,
    end_date : `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`,
    customer : '',
    brand: '',
    order_number: '',
    stage: null,
    status_filter: null,
  });

  const stage = [
    'draft',
    'provisional',
    'confirmed',
    'checked out',
    'checked in',
  ];

  useEffect(()=>{
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
    
    loadSearchOption();
  }, [])
  
  const loadSearchOption = async () => {
    const [cachedSearchOptions, cachedTimestamp] = await Promise.all([
      AsyncStorage.getItem('__search_options'),
      AsyncStorage.getItem('__search_options_timestamp')
    ]);
    if (cachedTimestamp && cachedSearchOptions &&(new Date().getTime() - parseInt(cachedTimestamp, 10)) < 600000 ) {
      setSearchOptions(JSON.parse(cachedSearchOptions));
    } else {
      AsyncStorage.removeItem('__search_options');
    }
  }
  
  useEffect(()=>{
    console.log('ddd');
    AsyncStorage.setItem('__search_options', JSON.stringify(searchOptions))
    AsyncStorage.setItem('__search_options_timestamp', new Date().getTime().toString())
  }, [searchOptions])

  useEffect(() => {
    switch (periodRange.toLowerCase()) {
      case 'today':
        setSearchOptions({
          ...searchOptions,
          start_date: new Date().toISOString().substr(0, 10),
          end_date: new Date().toISOString().substr(0, 10),
        });
        break;
      case 'tomorrow':
        setSearchOptions({
          ...searchOptions,
          start_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
          end_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
        });
        break;
      case 'yesterday':
        setSearchOptions({
          ...searchOptions,
          start_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
          end_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
        });
        break;
      case 'today+tomorrow':
        setSearchOptions({
          ...searchOptions,
          start_date: new Date().toISOString().substr(0, 10),
          end_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
        });
        break;
      case '7days':
        setSearchOptions({
          ...searchOptions,
          start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
          end_date: new Date().toISOString().substr(0, 10),
        });
        break;
      default:
        break;
    }
  }, [periodRange]);

  useEffect(() => {
    if (searchOptions.start_date && searchOptions.end_date) {
      const startDate = new Date(searchOptions.start_date);
      const endDate = new Date(searchOptions.end_date);
  
      if (startDate.toISOString().substr(0, 10) === new Date().toISOString().substr(0, 10) &&
          endDate.toISOString().substr(0, 10) === new Date().toISOString().substr(0, 10)) {
        if(periodRange != 'Today') setPeriodRange('Today');
      } else if (startDate.toISOString().substr(0, 10) === new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10) &&
                  endDate.toISOString().substr(0, 10) === new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10)) {
        if(periodRange != 'Tomorrow') setPeriodRange('Tomorrow');
      } else if (startDate.toISOString().substr(0, 10) === new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10) &&
                  endDate.toISOString().substr(0, 10) === new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10)) {
        if(periodRange != 'Yesterday') setPeriodRange('Yesterday');
      } else if (startDate.toISOString().substr(0, 10) === new Date().toISOString().substr(0, 10) &&
                  endDate.toISOString().substr(0, 10) === new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10)) {
        if(periodRange != 'Today+Tomorrow') setPeriodRange('Today+Tomorrow');
      } else if (startDate.toISOString().substr(0, 10) === new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10) &&
                  endDate.toISOString().substr(0, 10) === new Date().toISOString().substr(0, 10)) {
        if(periodRange != '7days') setPeriodRange('7days');
      } else {
        if(periodRange != 'custom') setPeriodRange('custom');
      }
    }
  }, [searchOptions.start_date, searchOptions.end_date]);

  useEffect(() => {
    if (updateOrderListTrigger == true) getTable();
  }, [updateOrderListTrigger]);

  useEffect(() => {
    getTable();
  }, [searchOptions]);

  const getTable = () => {
    const payload = {
      searchOptions: {...searchOptions}
    };
    if(payload.searchOptions.stage === null && payload.searchOptions.status_filter === null) {
      payload.searchOptions.stage = [2,3,4]
    }
    getReservationsData(payload, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateOrderListTrigger(false);
          setTableData(jsonRes);
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    });
  };

  const changeSearchOptions = (key, val) => {
    setSearchOptions(prevOptions => ({
      ...prevOptions,
      [key]: val
    }));
  }

  const scanBarcodeHandle = async () => {
    if(!barcode.trim() || tableData.length === 0) return;
    
    let flag = false;
    for(const order of tableData){
      const payload = {
        barcode: barcode,
        reservation_id: order.id,
      }

      // if(order.stage == 2){
      //   const result = await scanBarcode(payload);
      //   if(result.status == 200){
      //     openOrderScreen('Action Order', {orderId:order.id});
      //     flag = true;
      //     break;
      //   }
      // }else 
      if(order.stage == 3){
        const result = await checkedInBarcode(payload, (jsonRes, status)=>{
          switch (status) {
            case 200:
              break;
            default:
              if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
              else showAlert('error', msgStr('unknownError'));
              break;
          }
        });
        if(result.status == 200){
          openOrderScreen('Action Order', {orderId:order.id})
          flag = true;
          break;
        }
      }
    }

    // if(!flag) showAlert("error", "There are no orders for this item checked out");
  }

  const renderTableData = () => {
    const convertStageToString = (stage) => {
      switch (stage) {
        case null: case 'null': return 'Draft';
        case 0: case '0': return 'Draft';
        case 1: case '1': return 'Provisional';
        case 2: case '2': return 'Confirmed';
        case 3: case '3': return 'Checked out';
        case 4: case '4': return 'Checked in';
        default:  return 'Invalid stage';
      }
    }

    const returnBgColor = (stage) => {
      switch (stage) {
        case 2: case '2': return '#BEE5EB';
        case 3: case '3': return '#F5C6CB';
        case 4: case '4': return '#C3E6CB';
        default:  return '#fff';
      }
    }
    

    const rows = [];
    if (tableData.length > 0) {
      tableData.map((item, index) => {
        rows.push(
          <BOHTR key={index} style={{backgroundColor:returnBgColor(item.stage)}}>
            <BOHTD width={InitialWidths[0]}>{item.order_number}</BOHTD>
            <BOHTD width={InitialWidths[1]}>{item.brand}</BOHTD>
            <BOHTD width={InitialWidths[2]}>{item.full_name}</BOHTD>
            <BOHTD width={InitialWidths[3]}>{item.start_date ? new Date(`${item.start_date} 0:0:0`).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }) : ''}</BOHTD>
            <BOHTD width={InitialWidths[4]}>{item.end_date ? new Date(`${item.end_date} 0:0:0`).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }) : ''}</BOHTD>
            <BOHTD width={InitialWidths[5]} style={{textAlign:'right'}}>{item?.quantity??''}</BOHTD>
            <BOHTD width={InitialWidths[7]}>{convertStageToString(item.stage)}</BOHTD>
            <BOHTD width={InitialWidths[8]} style={{textAlign:'center'}}>{item?.color_id?'YES':'NO'}</BOHTD>
            <BOHTDIconBox  width={InitialWidths[9]}>
              <TouchableOpacity
                onPress={() => {
                  openOrderScreen('Action Order', {orderId:item.id})
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="arrow-right" color="black" />
              </TouchableOpacity>
            </BOHTDIconBox>
          </BOHTR>
        );
      });
    } else {
      <></>;
    }
    return <>{rows}</>;
  };

  return (
    <BasicLayout
      navigation={navigation}
      screenName={'Order List'}
    >
      <CommonContainer>
        <BOHToolbar style={{zIndex:100}}>
          <Text style={{marginRight:8, fontSize:TextdefaultSize}}>Start</Text>
          {Platform.OS == 'web' && 
            renderBOHTlbDatePicker(searchOptions.start_date, (date) => {
              const year = date.getFullYear();
              const formattedDate = `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
              changeSearchOptions('start_date', formattedDate);
          })}
          <Text style={{marginHorizontal:8, fontSize:TextdefaultSize}}>End</Text>
          {Platform.OS == 'web' && 
            renderBOHTlbDatePicker(searchOptions.end_date, (date) => {
              const year = date.getFullYear();
              const formattedDate = `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
              changeSearchOptions('end_date', formattedDate);
          })}
          <BOHTlbRadio
            label='Today'
            onPress={()=>{setPeriodRange('Today')}}
            RadioButtonProps={{
              value: '1',
              status: periodRange == 'Today'? 'checked': 'unchecked',
            }}
          />
          <BOHTlbRadio
            label='Tomorrow'
            onPress={()=>{setPeriodRange('Tomorrow')}}
            RadioButtonProps={{
              value: '1',
              status: periodRange == 'Tomorrow'? 'checked': 'unchecked',
            }}
          />
          <BOHTlbRadio
            label='Yesterday'
            onPress={()=>{setPeriodRange('Yesterday')}}
            RadioButtonProps={{
              value: '1',
              status: periodRange == 'Yesterday'? 'checked': 'unchecked',
            }}
          />
          <BOHTlbRadio
            label='Today+Tomorrow'
            onPress={()=>{setPeriodRange('Today+Tomorrow')}}
            RadioButtonProps={{
              value: '1',
              status: periodRange == 'Today+Tomorrow'? 'checked': 'unchecked',
            }}
          />
          <BOHTlbRadio
            label='7 days'
            onPress={()=>{setPeriodRange('7days')}}
            RadioButtonProps={{
              value: '1',
              status: periodRange == '7days'? 'checked': 'unchecked',
            }}
          />
        </BOHToolbar>
        <BOHToolbar>
          <BOHTlbRadio
            label='Checked In'
            style={{margin:0}}
            onPress={()=>{
              changeSearchOptions('stage', null);
              changeSearchOptions('status_filter', 1)
            }}
            RadioButtonProps={{
              value: '1',
              status: searchOptions.status_filter == 1? 'checked': 'unchecked',
              color: '#ff4d4d',
            }}
          />
          <BOHTlbRadio
            label='Checked Out'
            onPress={()=>{
              changeSearchOptions('stage', null);
              changeSearchOptions('status_filter', 2)
            }}
            RadioButtonProps={{
              value: '1',
              status: searchOptions.status_filter == 2? 'checked': 'unchecked',
              color: '#ff4d4d',
            }}
          />
          {/* <BOHTlbRadio
            label='Provisional'
            onPress={()=>{
              changeSearchOptions('stage', null);
              changeSearchOptions('status_filter', 3)
            }}
            RadioButtonProps={{
              value: '1',
              status: searchOptions.status_filter == 3? 'checked': 'unchecked',
              color: '#ff4d4d',
            }}
          /> */}
          <BOHTlbRadio
            label='Confirmed'
            onPress={()=>{
              changeSearchOptions('stage', null);
              changeSearchOptions('status_filter', 4)
            }}
            RadioButtonProps={{
              value: '1',
              status: searchOptions.status_filter == 4? 'checked': 'unchecked',
              color: '#ff4d4d',
            }}
          />
          <BOHTlbRadio
            label='All'
            style={{opacity: searchOptions.status_filter?1:0,}}
            onPress={()=>{
              changeSearchOptions('stage', null);
              changeSearchOptions('status_filter', null)
            }}
            RadioButtonProps={{
              value: '1',
              status: searchOptions.status_filter == null? 'checked': 'unchecked',
              color: '#ff4d4d',
            }}
          />
        </BOHToolbar>
        <BOHToolbar style={{width: '100%', justifyContent:'space-between'}}>
          <BOHTlbrSearchInput
            boxStyle={{margin:0}}
            width={150}
            label='Customer'
            defaultValue={searchOptions.customer}
            onChangeText={(val)=>changeSearchOptions('customer', val)}
          />
          <BOHTlbrSearchInput
            boxStyle={{margin:0}}
            width={150}
            label='Brand'
            defaultValue={searchOptions.brand}
            onChangeText={(val)=>changeSearchOptions('brand', val)}
          />
          <BOHTlbrSearchInput
            boxStyle={{margin:0}}
            width={150}
            label='Order number'
            defaultValue={searchOptions.order_number}
            onChangeText={(val)=>changeSearchOptions('order_number', val)}
          />
          <BOHTlbrSearchPicker
            width={150}
            boxStyle={{margin:0}}
            enabled={searchOptions.status_filter?false:true}
            label="Category"
            items={[
              {label: '', value: ''}, 
              ...stage
                .map((item, index) => {
                  if (index === 2 || index === 3 || index === 4) {
                    return {label: item, value: index};
                  } else {
                    return null;
                  }
                })
                .filter(item => item !== null)
            ]}
            selectedValue={searchOptions.stage || ''}
            onValueChange={val=>changeSearchOptions('stage', val)}/>
        </BOHToolbar>
        <BOHToolbar>
          <BOHTlbrSearchInput 
            ref={barcodeInputRef}
            boxStyle={{margin:0, marginRight:12}}
            style={{paddingVertical:5}}
            defaultValue={barcode}
            onChangeText={SetBarcode}
            onSubmitEditing={scanBarcodeHandle}/>
          <BOHButton
            label='Scan'
            onPress={scanBarcodeHandle}/>
        </BOHToolbar>
        <BOHTable>
          <BOHTHead>
            <BOHTR>
              <BOHTH width={InitialWidths[0]}>{'Order #'}</BOHTH>
              <BOHTH width={InitialWidths[1]}>{'Brand'}</BOHTH>
              <BOHTH width={InitialWidths[2]}>{'Customer'}</BOHTH>
              <BOHTH width={InitialWidths[4]}>{'Start'}</BOHTH>
              <BOHTH width={InitialWidths[3]}>{'End'}</BOHTH>
              <BOHTH width={InitialWidths[5]}>{'Qty of bikes'}</BOHTH>
              <BOHTH width={InitialWidths[7]}>{'Stage'}</BOHTH>
              <BOHTH width={InitialWidths[8]}>{'Locked'}</BOHTH>
              <BOHTH width={InitialWidths[9]}>{'Action'}</BOHTH>
            </BOHTR>
            {/* <Text style={[styles.columnHeader, styles.IconCell]}>{'DEL'}</Text> */}
          </BOHTHead>
          <BOHTBody>
            {renderTableData()}
          </BOHTBody>
        </BOHTable>
      </CommonContainer>
    </BasicLayout>
  );
};

export default OrdersList;
