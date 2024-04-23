import React, { InputHTMLAttributes, forwardRef, useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  Pressable
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Picker } from '@react-native-picker/picker';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
// import MapView, { Marker } from 'react-native-maps';

import { getReservationsData } from '../../api/Reservation';
import { msgStr } from '../../common/constants/Message';
import { TextMediumSize } from '../../common/constants/Fonts';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../common/hooks/UseConfirmModal';
import BasicLayout from '../../common/components/CustomLayout/BasicLayout';

import { DashboardStyle } from './styles/DashboardStyle';
import { RadioButton } from 'react-native-paper';

if (Platform.OS === 'web') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'react-datepicker/dist/react-datepicker.css';
  document.head.appendChild(link);
}

const Dashboard = ({ navigation }) => {
  const screenHeight = Dimensions.get('window').height;

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateReservationListTrigger, setUpdateReservationListTrigger] = useState(true);

  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const today = new Date().toISOString().substr(0, 10);
  const [periodRange, setPeriodRange] = useState<any>('');
  const [ searchOptions, setSearchOptions ] = useState({
    start_date : twoWeeksAgo.toISOString().substr(0, 10),
    end_date : today,
    customer : '',
    brand: '',
    order_number: '',
    stage: null,
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
    const sDate = new Date(selectedDate);
    const adjustedDate = new Date(sDate.getTime() + sDate.getTimezoneOffset() * 60000);
    return (
      <View style={{zIndex:10}}>
        <DatePicker
          selected={adjustedDate}
          onChange={(date) => {onChangeHandler(date)}}
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
            <View style={[styles.cell]}>
              <Text>{item.brand}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.full_name}</Text>
            </View>
            <View style={[styles.cell, {width: 250}]}>
              <Text>{item.delivery_address}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.start_location}</Text>
            </View>
            <View style={[styles.cell]}>
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
        <View style={styles.container}>
          <View style={[styles.toolbar, {zIndex:100, marginBottom:15}]}>
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
              style={{flexDirection:'row', alignItems:'center', marginLeft:12}}
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
              style={{flexDirection:'row', alignItems:'center', marginLeft:12}}
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
              style={{flexDirection:'row', alignItems:'center', marginLeft:12}}
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
              style={{flexDirection:'row', alignItems:'center', marginLeft:12}}
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
              style={{flexDirection:'row', alignItems:'center', marginLeft:12}}
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
                style={[styles.searchInput]}
                selectedValue={searchOptions.stage}
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
              <Text style={[styles.columnHeader]}>{'Brand'}</Text>
              <Text style={[styles.columnHeader]}>{'Customer'}</Text>
              <Text style={[styles.columnHeader, {width:250}]}>{'To'}</Text>
              <Text style={[styles.columnHeader]}>{'From'}</Text>
              {/* <Text style={[styles.columnHeader, {width:100}]}>{'Start Date'}</Text>
              <Text style={[styles.columnHeader, {width:100}]}>{'End Date'}</Text> */}
              <Text style={[styles.columnHeader]}>{'Qty of bikes'}</Text>
              <Text style={[styles.columnHeader]}>{'Stage'}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{'Proceed'}</Text>
              {/* <Text style={[styles.columnHeader, styles.IconCell]}>{'DEL'}</Text> */}
            </View>
            <ScrollView style={{ flex: 1, maxHeight: screenHeight - 220 }}>
              {renderTableData()}
            </ScrollView>
          </View>
        </View>
        <View>
          {/* <Map
            google={google}
            zoom={10}
            initialCenter={{
              lat: 32.2163,
              lng: -80.7526
            }}
          >
            <Marker position={{ lat: 32.2163, lng: -80.7526 }} />
          </Map> */}
        </View>
      </ScrollView>
    </BasicLayout>
  );
};

const styles = DashboardStyle;

export default Dashboard;
