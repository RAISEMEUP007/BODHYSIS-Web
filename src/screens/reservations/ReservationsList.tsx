import React, { InputHTMLAttributes, forwardRef, useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Picker } from '@react-native-picker/picker';

import { getReservationsData } from '../../api/Reservation';
import { msgStr } from '../../common/constants/Message';
import { TextMediumSize } from '../../common/constants/Fonts';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../common/hooks/UseConfirmModal';
import BasicLayout from '../../common/components/CustomLayout/BasicLayout';

import { reservationListsStyle } from './styles/ReservationListStyle';
import { CommonContainer } from '../../common/components/CustomLayout';
import { BOHButton, BOHTlbrSearchInput, BOHTlbrSearchPicker, BOHToolbar } from '../../common/components/bohtoolbar';
import { BOHTBody, BOHTD, BOHTDIconBox, BOHTH, BOHTHead, BOHTR, BOHTable } from '../../common/components/bohtable';

if (Platform.OS === 'web') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'react-datepicker/dist/react-datepicker.css';
  document.head.appendChild(link);
}

const ReservationsList = ({ navigation, openReservationScreen }) => {

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateReservationListTrigger, setUpdateReservationListTrigger] = useState(true);

  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const tomorrow = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10);
  const [ searchOptions, setSearchOptions ] = useState({
    start_date : twoWeeksAgo.toISOString().substr(0, 10),
    end_date : tomorrow,
    customer : '',
    brand: '',
    order_number: '',
    stage: null,
  });

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

  // const removeReservationList = (id) => {
  //   showConfirm(msgStr('deleteConfirmStr'), () => {
  //     deleteReservationList(id, (jsonRes, status, error) => {
  //       switch (status) {
  //         case 200:
  //           setUpdateReservationListTrigger(true);
  //           showAlert('success', jsonRes.message);
  //           break;
  //         default:
  //           if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
  //           else showAlert('error', msgStr('unknownError'));
  //           break;
  //       }
  //     });
  //   });
  // };

  const CustomInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ value, onChange, onClick }, ref) => (
      <input
        onClick={onClick}
        onChange={onChange}
        ref={ref}
        style={styles.dateInput}
        value={value}
      ></input>
    )
  );

  const renderDatePicker = (selectedDate, onChangeHandler) => {
    const sDate = new Date(selectedDate);
    return (
      <View style={{zIndex:10}}>
        <DatePicker
          selected={sDate}
          onChange={(date) => onChangeHandler(date)}
          customInput={<CustomInput />}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          // dropdownMode="select"
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
          <BOHTR>
            <BOHTD width={90}>{item.order_number}</BOHTD>
            <BOHTD width={160}>{item.brand}</BOHTD>
            <BOHTD width={160}>{item.full_name}</BOHTD>
            <BOHTD width={100}>{item.end_date ? formatDateInline(item.end_date):''}</BOHTD>
            <BOHTD width={100}>{item.start_date ? formatDateInline(item.start_date):''}</BOHTD>
            <BOHTD width={110}>{item?.quantity??''}</BOHTD>
            <BOHTD width={90}>{convertStageToString(item.stage)}</BOHTD>
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
      <ScrollView horizontal={true}>
        <CommonContainer>
          <BOHToolbar>
            <Text style={styles.searchLabel}>From</Text>
            {Platform.OS == 'web' && renderDatePicker(searchOptions.start_date, (date)=>changeSearchOptions('start_date', date.toISOString().substr(0, 10)))}
            <Text style={styles.searchLabel}>To</Text>
            {Platform.OS == 'web' && renderDatePicker(searchOptions.end_date, (date)=>changeSearchOptions('end_date', date.toISOString().substr(0, 10)))}
          </BOHToolbar>
          <BOHToolbar style={{justifyContent:'space-between'}}>
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
              items={[{label:'', value:''}, ...stage.map((item, index)=>({'label':item, 'value':index}))]}
              label="Category"
              selectedValue={searchOptions.stage || ''}
              onValueChange={val=>changeSearchOptions('stage', val)}/>
          </BOHToolbar>
          <BOHToolbar>
            {/* <TouchableHighlight style={styles.button} onPress={()=>{
              openReservationScreen('Create Reservations');
            }}>
              <Text style={styles.buttonText}>Create</Text>
            </TouchableHighlight> */}
            <BOHButton
              label="Create"
              onPress={()=>{
                openReservationScreen('Create Reservations');
              }}/>
          </BOHToolbar>
          <BOHTable>
            <BOHTHead>
              <BOHTR>
                <BOHTH width={90}>{'Order #'}</BOHTH>
                <BOHTH width={160}>{'Brand'}</BOHTH>
                <BOHTH width={160}>{'Customer'}</BOHTH>
                <BOHTH width={100}>{'To'}</BOHTH>
                <BOHTH width={100}>{'From'}</BOHTH>
                <BOHTH width={110}>{'Qty of bikes'}</BOHTH>
                <BOHTH width={90}>{'Stage'}</BOHTH>
                <BOHTH width={80}>{'Proceed'}</BOHTH>
              </BOHTR>
            </BOHTHead>
            <BOHTBody>
              {renderTableData()}
            </BOHTBody>
          </BOHTable>
        </CommonContainer>
      </ScrollView>
    </BasicLayout>
  );
};

const styles = reservationListsStyle;

export default ReservationsList;
