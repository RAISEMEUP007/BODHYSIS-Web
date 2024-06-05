import React, { useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getReservationsData } from '../../api/Reservation';
import { BasicLayout, CommonContainer } from '../../common/components/CustomLayout';
import { BOHButton, BOHTlbCheckbox, BOHTlbRadio, BOHTlbrSearchInput, BOHTlbrSearchPicker, BOHToolbar, renderBOHTlbDatePicker } from '../../common/components/bohtoolbar';
import { BOHTBody, BOHTD, BOHTDIconBox, BOHTH, BOHTHead, BOHTR, BOHTable } from '../../common/components/bohtable';
import { msgStr } from '../../common/constants/Message';
import { TextMediumSize, TextdefaultSize } from '../../common/constants/Fonts';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../common/hooks/UseConfirmModal';

const ReservationsList = ({ navigation, openReservationScreen }) => {

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateReservationListTrigger, setUpdateReservationListTrigger] = useState(false);
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
    hideBeachTennis: false,
    ShowOnlyManual: false,
  });

  const stage = [
    'draft',
    'provisional',
    'confirmed',
    'checked out',
    'checked in',
  ];

  useEffect(()=>{
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
    const timeout = setTimeout(() => {
      AsyncStorage.setItem('__search_options', JSON.stringify(searchOptions))
      AsyncStorage.setItem('__search_options_timestamp', new Date().getTime().toString())
      setUpdateReservationListTrigger(true)
    }, 300);
    return () => clearTimeout(timeout);
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

  const changeSearchOptions = (key, val) => {
    setSearchOptions(prevOptions => ({
      ...prevOptions,
      [key]: val
    }));
  }

  useEffect(() => {
    if (updateReservationListTrigger == true) getTable();
  }, [updateReservationListTrigger]);

  const getTable = () => {
    getReservationsData({searchOptions:searchOptions}, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateReservationListTrigger(false);
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

    const rows = [];
    if (tableData.length > 0) {
      tableData.map((item, index) => {
        rows.push(
          <BOHTR key={index}>
            <BOHTD width={90}>{item.order_number}</BOHTD>
            <BOHTD width={160}>{item.brand}</BOHTD>
            <BOHTD width={160}>{item.full_name}</BOHTD>
            <BOHTD width={100}>{item.start_date ? new Date(`${item.start_date} 0:0:0`).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }) : ''}</BOHTD>
            <BOHTD width={100}>{item.end_date ? new Date(`${item.end_date} 0:0:0`).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }) : ''}</BOHTD>
            <BOHTD width={110} style={{textAlign:'right'}}>{item?.quantity??''}</BOHTD>
            <BOHTD width={100}>{convertStageToString(item.stage)}</BOHTD>
            <BOHTDIconBox width={80}>
              <TouchableOpacity
                onPress={() => {
                  openReservationScreen('Proceed Reservation', {reservationId:item.id})
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
      screenName={'Reservation List'}
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
          <BOHTlbRadio
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
          />
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
            width={125}
            label='Customer'
            defaultValue={searchOptions.customer}
            onChangeText={(val)=>changeSearchOptions('customer', val)}
          />
          <BOHTlbrSearchInput
            width={125}
            label='Brand'
            defaultValue={searchOptions.brand}
            onChangeText={(val)=>changeSearchOptions('brand', val)}
          />
          <BOHTlbrSearchInput
            width={125}
            label='Order number'
            defaultValue={searchOptions.order_number}
            onChangeText={(val)=>changeSearchOptions('order_number', val)}
          />
          <BOHTlbrSearchPicker
            width={125}
            enabled={searchOptions.status_filter?false:true}
            items={[{label:'', value:''}, ...stage.map((item, index)=>({'label':item, 'value':index}))]}
            label="Category"
            selectedValue={searchOptions.stage || ''}
            onValueChange={val=>changeSearchOptions('stage', val)}/>
        </BOHToolbar>
        <BOHToolbar>
          <BOHButton
            label="Create"
            onPress={()=>{
              openReservationScreen('Create Reservations');
            }}/>
          <BOHTlbCheckbox
            label={'Hide beach and tennis'}
            style={{marginLeft:30, marginRight:10}}
            CheckboxProps={{
              value:searchOptions.hideBeachTennis
            }}
            onPress={()=>{
              changeSearchOptions('hideBeachTennis', !searchOptions.hideBeachTennis);
            }}
          />
          <BOHTlbCheckbox
            label={'Show only manual addresses'}
            CheckboxProps={{
              value:searchOptions.ShowOnlyManual
            }}
            onPress={()=>{
              changeSearchOptions('ShowOnlyManual', !searchOptions.ShowOnlyManual);
            }}
          />
        </BOHToolbar>
        <BOHTable>
          <BOHTHead>
            <BOHTR>
              <BOHTH width={90}>{'Order #'}</BOHTH>
              <BOHTH width={160}>{'Brand'}</BOHTH>
              <BOHTH width={160}>{'Customer'}</BOHTH>
              <BOHTH width={100}>{'Start'}</BOHTH>
              <BOHTH width={100}>{'End'}</BOHTH>
              <BOHTH width={110}>{'Qty of bikes'}</BOHTH>
              <BOHTH width={100}>{'Stage'}</BOHTH>
              <BOHTH width={80}>{'Proceed'}</BOHTH>
            </BOHTR>
          </BOHTHead>
          <BOHTBody>
            {renderTableData()}
          </BOHTBody>
        </BOHTable>
      </CommonContainer>
    </BasicLayout>
  );
};

export default ReservationsList;
