import React, { InputHTMLAttributes, forwardRef, useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Pressable
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RadioButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

import { getReservationsData } from '../../api/Reservation';
import { msgStr } from '../../common/constants/Message';
import { TextMediumSize } from '../../common/constants/Fonts';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../common/hooks/UseConfirmModal';
import BasicLayout from '../../common/components/CustomLayout/BasicLayout';

import { DashboardStyle } from './styles/DashboardStyle';

if (Platform.OS === 'web') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'react-datepicker/dist/react-datepicker.css';
  document.head.appendChild(link);
}

const Dashboard = ({ navigation }) => {

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateReservationListTrigger, setUpdateReservationListTrigger] = useState(true);

  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const today = new Date().toISOString().substr(0, 10);

  const [periodRange, setPeriodRange] = useState<any>('');
  // const [statusFilter, changeSearchOptions]'statusFilter',  = useState<number | null>(null);
  const [ searchOptions, setSearchOptions ] = useState({
    start_date : twoWeeksAgo.toISOString().substr(0, 10),
    end_date : today,
    customer : '',
    brand: '',
    order_number: '',
    stage: null,
    status_filter: null,
  });

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
    // const setperiodRange = () => {
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
    // }
  }, [searchOptions.start_date, searchOptions.end_date]);

  const stage = [
    'draft',
    'provisional',
    'confirmed',
    'checked out',
    'checked in',
  ];

  const changeSearchOptions = (key, val) => {
    setSearchOptions(prevOptions => ({
      ...prevOptions,
      [key]: val
    }));
  }

  useEffect(() => {
    if (updateReservationListTrigger == true) getTable();
  }, [updateReservationListTrigger]);

  useEffect(() => {
    getTable();
  }, [searchOptions]);

  const CustomInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ value, onChange, onClick }, ref) => {
      return (
        <input
          onClick={onClick}
          onChange={(val)=>{onChange(val)}}
          ref={ref}
          style={styles.dateInput}
          defaultValue={value}
        ></input>
      )
    }
  );

  const renderDatePicker = (selectedDate, onChangeHandler) => {
    const dateParts = selectedDate.split('-');
    const sDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    return (
      <View style={{zIndex:10}}>
        <DatePicker
          selected={sDate}
          onChange={(date) => {
            // setperiodRange('');
            onChangeHandler(date)
          }}
          customInput={<CustomInput />}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          // timeInputLabel="Time:"
          dateFormat="yyyy-MM-dd"
          // showTimeSelect
        />
      </View>
    );
  };

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

  const formatDateInline = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
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

    const rows = [];
    if (tableData.length > 0) {
      tableData.map((item, index) => {
        rows.push(
          <View key={index} style={styles.tableRow}>
            <View style={[styles.cell, {width: 90}]}>
              <Text>{item.order_number}</Text>
            </View>
            <View style={[styles.cell, {width: 160}]}>
              <Text>{item.brand}</Text>
            </View>
            <View style={[styles.cell, {width: 160}]}>
              <Text>{item.full_name}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.end_date ? formatDateInline(item.end_date):''}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.start_date ? formatDateInline(item.start_date):''}</Text>
            </View>
            <View style={[styles.cell, {alignItems:'flex-end'}]}>
              <Text>{item?.quantity??''}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{convertStageToString(item.stage)}</Text>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  // openReservationScreen('Proceed Reservation', {reservationId:item.id})
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="arrow-right" color="black" />
              </TouchableOpacity>
            </View>
          </View>
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
      screenName={'Dashboard'}
    >
      <ScrollView horizontal={true}>
        <View style={{flexDirection:'row', alignItems:'flex-start', height:'100%'}}>
            <View style={styles.container}>
              <View style={[styles.toolbar, {zIndex:100, marginBottom:6}]}>
                <Text style={styles.searchLabel}>From</Text>
                {Platform.OS == 'web' && 
                  renderDatePicker(searchOptions.start_date, (date) => {
                    const year = date.getFullYear();
                    const formattedDate = `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                    changeSearchOptions('start_date', formattedDate);
                })}
                <Text style={styles.searchLabel}>To</Text>
                {Platform.OS == 'web' && 
                  renderDatePicker(searchOptions.end_date, (date) => {
                    const year = date.getFullYear();
                    const formattedDate = `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                    changeSearchOptions('end_date', formattedDate);
                })}
                <Pressable 
                  style={{flexDirection:'row', alignItems:'center', marginHorizontal:12}}
                  onPress={()=>{setPeriodRange('Today')}}
                >
                  <RadioButton
                    value={"1"}
                    status={periodRange == 'Today'? 'checked': 'unchecked'}
                    onPress={()=>{setPeriodRange('Today')}}
                    color="#0099ff"
                  />
                  <Text>{"Today"}</Text>
                </Pressable>
                <Pressable 
                  style={{flexDirection:'row', alignItems:'center', marginRight:12}}
                  onPress={()=>{setPeriodRange('Tomorrow')}}
                >
                  <RadioButton
                    value={"1"}
                    status={periodRange == 'Tomorrow'? 'checked': 'unchecked'}
                    onPress={()=>{setPeriodRange('Tomorrow')}}
                    color="#0099ff"
                  />
                  <Text>{"Tomorrow"}</Text>
                </Pressable>
                <Pressable 
                  style={{flexDirection:'row', alignItems:'center', marginRight:12}}
                  onPress={()=>{setPeriodRange('Yesterday')}}
                >
                  <RadioButton
                    value={"1"}
                    status={periodRange == 'Yesterday'? 'checked': 'unchecked'}
                    onPress={()=>{setPeriodRange('Yesterday')}}
                    color="#0099ff"
                  />
                  <Text>{"Yesterday"}</Text>
                </Pressable>
                <Pressable 
                  style={{flexDirection:'row', alignItems:'center', marginRight:12}}
                  onPress={()=>{setPeriodRange('Today+Tomorrow')}}
                >
                  <RadioButton
                    value={"1"}
                    status={periodRange == 'Today+Tomorrow'? 'checked': 'unchecked'}
                    onPress={()=>{setPeriodRange('Today+Tomorrow')}}
                    color="#0099ff"
                  />
                  <Text>{"Today+Tomorrow"}</Text>
                </Pressable>
                <Pressable 
                  style={{flexDirection:'row', alignItems:'center', marginRight:12}}
                  onPress={()=>{setPeriodRange('7days')}}
                >
                  <RadioButton
                    value={"1"}
                    status={periodRange == '7days'? 'checked': 'unchecked'}
                    onPress={()=>{setPeriodRange('7days')}}
                    color="#0099ff"
                  />
                  <Text>{"7 days"}</Text>
                </Pressable>
              </View>
              <View style={[styles.toolbar, {marginBottom:12}]}>
                <Pressable 
                  style={{flexDirection:'row', alignItems:'center', marginRight:12}}
                  onPress={()=>{
                    changeSearchOptions('stage', null);
                    changeSearchOptions('status_filter', 1)
                  }}
                >
                  <RadioButton
                    value={"1"}
                    status={searchOptions.status_filter == 1? 'checked': 'unchecked'}
                    onPress={()=>{
                      changeSearchOptions('stage', null);
                      changeSearchOptions('status_filter', 1)
                    }}
                    color="#ff4d4d"
                  />
                  <Text>{"Missed PU"}</Text>
                </Pressable>
                <Pressable 
                  style={{flexDirection:'row', alignItems:'center', marginRight:12}}
                  onPress={()=>{
                    changeSearchOptions('stage', null);
                    changeSearchOptions('status_filter', 2)
                  }}
                >
                  <RadioButton
                    value={"1"}
                    status={searchOptions.status_filter == 2? 'checked': 'unchecked'}
                    onPress={()=>{
                      changeSearchOptions('stage', null);
                      changeSearchOptions('status_filter', 2)
                    }}
                    color="#ff4d4d"
                  />
                  <Text>{"Checked Out"}</Text>
                </Pressable>
                <Pressable 
                  style={{flexDirection:'row', alignItems:'center', marginRight:12}}
                  onPress={()=>{
                    changeSearchOptions('stage', null);
                    changeSearchOptions('status_filter', 3)
                  }}
                >
                  <RadioButton
                    value={"1"}
                    status={searchOptions.status_filter == 3? 'checked': 'unchecked'}
                    onPress={()=>{
                      changeSearchOptions('stage', null);
                      changeSearchOptions('status_filter', 3)
                    }}
                    color="#ff4d4d"
                  />
                  <Text>{"Provisional"}</Text>
                </Pressable>
                <Pressable 
                  style={{flexDirection:'row', alignItems:'center', marginRight:12}}
                  onPress={()=>{
                    changeSearchOptions('stage', null);
                    changeSearchOptions('status_filter', 4)
                  }}
                >
                  <RadioButton
                    value={"1"}
                    status={searchOptions.status_filter == 4? 'checked': 'unchecked'}
                    onPress={()=>{
                      changeSearchOptions('stage', null);
                      changeSearchOptions('status_filter', 4)
                    }}
                    color="#ff4d4d"
                  />
                  <Text>{"Confirmed"}</Text>
                </Pressable>
                {Platform.OS == 'web' && (
                  <div 
                    style={{
                      display:'flex',
                      flexDirection:'row',
                      justifyContent:'center',
                      alignItems:'center',
                      opacity: searchOptions.status_filter?1:0,
                      transition: 'opacity 0.3s ease-out',
                      marginRight:12
                    }}
                    onClick={()=>{
                      changeSearchOptions('stage', null);
                      changeSearchOptions('status_filter', null)
                    }}
                  >
                    <RadioButton
                      value={"1"}
                      status={searchOptions.status_filter == null? 'checked': 'unchecked'}
                      onPress={()=>{
                        changeSearchOptions('stage', null);
                        changeSearchOptions('status_filter', null)
                      }}
                      color="#ff4d4d"
                    />
                    <Text>{"All"}</Text>
                  </div>
                )}
              </View>
              <View style={styles.toolbar}>
                <View style={styles.searchBox}>
                  <Text style={styles.searchLabel}>Customer</Text>
                  <TextInput
                    style={styles.searchInput}
                    placeholder=""
                    defaultValue={searchOptions.customer}
                    onChangeText={(val)=>changeSearchOptions('customer', val)}
                  />
                </View>
                <View style={styles.searchBox}>
                  <Text style={styles.searchLabel}>Brand</Text>
                  <TextInput
                    style={styles.searchInput}
                    placeholder=""
                    defaultValue={searchOptions.brand}
                    onChangeText={(val)=>changeSearchOptions('brand', val)}
                  />
                </View>
                <View style={styles.searchBox}>
                  <Text style={styles.searchLabel}>Order number</Text>
                  <TextInput
                    style={styles.searchInput}
                    placeholder=""
                    defaultValue={searchOptions.order_number}
                    onChangeText={(val)=>changeSearchOptions('order_number', val)}
                  />
                </View>
                <View style={styles.searchBox}>
                  <Text style={styles.searchLabel}>Stage</Text>
                  <Picker
                    enabled={searchOptions.status_filter?false:true}
                    style={[styles.searchInput]}
                    selectedValue={searchOptions.stage !== null ? searchOptions.stage : ''}
                    onValueChange={val=>changeSearchOptions('stage', val)}
                  >
                    <Picker.Item label={''} value={null} />
                    {stage.length > 0 &&
                      stage.map((stageStr, index) => {
                        return (
                          <Picker.Item key={index} label={stageStr} value={index} />
                        );
                      })}
                  </Picker>
                </View>
              </View>
              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.columnHeader, {width:90}]}>{'Order #'}</Text>
                  <Text style={[styles.columnHeader, {width: 160}]}>{'Brand'}</Text>
                  <Text style={[styles.columnHeader, {width: 160}]}>{'Customer'}</Text>
                  <Text style={[styles.columnHeader]}>{'To'}</Text>
                  <Text style={[styles.columnHeader]}>{'From'}</Text>
                  <Text style={[styles.columnHeader]}>{'Qty of bikes'}</Text>
                  <Text style={[styles.columnHeader]}>{'Stage'}</Text>
                  <Text style={[styles.columnHeader, styles.IconCell]}>{'Proceed'}</Text>
                </View>
                <ScrollView style={{ flex: 1 }}>
                  {renderTableData()}
                </ScrollView>
              </View>
            </View>
            <View style={{height:'100%'}}>
              {Platform.OS == 'web' && <img style={{height:'100%', boxSizing:'border-box', padding:'40px 50px 30px 0',}} src={require('./HiltonHeadIsland.png')}/>}
            </View>
        </View>
      </ScrollView>
    </BasicLayout>
  );
};

const styles = DashboardStyle;

export default Dashboard;
