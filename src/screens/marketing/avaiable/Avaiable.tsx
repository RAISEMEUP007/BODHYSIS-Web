import React, { useEffect, useState } from 'react';
import { Text, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getAvaliableSheet } from '../../../api/Reservation';
import { BasicLayout, CommonContainer } from '../../../common/components/CustomLayout';
import { BOHTBody, BOHTD, BOHTDIconBox, BOHTDPressable, BOHTH, BOHTH2, BOHTHead, BOHTR, BOHTable } from '../../../common/components/bohtable';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks';
import { BOHTlbrSearchInput, BOHToolbar, renderBOHTlbDatePicker } from '../../../common/components/bohtoolbar';
import { TextdefaultSize } from '../../../common/constants/Fonts';
import { formatDate } from '../../../common/utils/DateUtils';

const Avaiable = ({ navigation }) => {
  const { showAlert } = useAlertModal();
  
  const [tableData, setTableData] = useState([]);
  const [updateLocationTrigger, setUpdateLocationsTrigger] = useState(false);
  const InitialWidths = [250, 90, 90, 80, 160, 160, 100, 80];

  const today = new Date();
  const twoWeeksLater = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  const [ searchOptions, setSearchOptions ] = useState({
    start_date : formatDate(today),
    end_date : formatDate(twoWeeksLater),
    display_name : '',
  });

  useEffect(() => {
    if (updateLocationTrigger == true) getTable();
  }, [updateLocationTrigger]);

  useEffect(()=>{
    setUpdateLocationsTrigger(true);
  }, [searchOptions.start_date, searchOptions.end_date])

  const getTable = () => {
    const payload = searchOptions
    getAvaliableSheet(payload, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateLocationsTrigger(false);
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

  const openReservations = (searchOptions) => {

    AsyncStorage.setItem('__demand_options', JSON.stringify(searchOptions))

    if(Platform.OS == 'web'){
      window.open('/home/DemandsList');
    }
  }

  const renderTableData = () => {
    const rows = [];
    if (tableData && tableData.length && tableData.length > 0) {

      const filteredData = tableData.filter(item => {
        return item.display_name.toLowerCase().includes(searchOptions.display_name.toLowerCase());
      });
      filteredData.map((item, index) => {
        rows.push(
          <BOHTR key={index}>
            <BOHTD width={InitialWidths[0]}>{item.display_name ||" "}</BOHTD>
            {item.quantities.length >0 && (
              item.quantities.map((quantity, index)=>(
                <BOHTDPressable
                  key={index} 
                  width={80} 
                  textAlign={'center'} 
                  onPress={()=>{
                    openReservations({
                      date: quantity.date, 
                      start_date: quantity.start_date, 
                      end_date: quantity.end_date, 
                      display_name: item.display_name,
                      ids: quantity.ids,
                      out_amount: quantity.out_amount,
                    })}
                  }
                >{`${quantity.out_amount}/${quantity.inventoryAmount}`}</BOHTDPressable>
              ))
            )}
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
      goBack={() => {
        navigation.navigate('Marketing');
      }}
      screenName={'Demands'}
    >
      <CommonContainer>
        <BOHToolbar style={{zIndex:100}}>
          <Text style={{marginRight:8, fontSize:TextdefaultSize}}>Start</Text>
          {Platform.OS == 'web' && 
            renderBOHTlbDatePicker(searchOptions.start_date, (date) => {
              const formattedDate = formatDate(date);
              changeSearchOptions('start_date', formattedDate);
          })}
          <Text style={{marginHorizontal:8, fontSize:TextdefaultSize}}>End</Text>
          {Platform.OS == 'web' && 
            renderBOHTlbDatePicker(searchOptions.end_date, (date) => {
              const formattedDate = formatDate(date);
              changeSearchOptions('end_date', formattedDate);
          })}
          <BOHTlbrSearchInput
            width={125}
            label='Display name'
            defaultValue={searchOptions.display_name}
            onChangeText={(val)=>changeSearchOptions('display_name', val)}
          />
        </BOHToolbar>
        <BOHTable>
          <BOHTHead>
            <BOHTR>
              <BOHTH2 width={InitialWidths[0]}>{'Display Name'}</BOHTH2>
              {(tableData && tableData.length >0) && (
                tableData[0].quantities.map((quantity, index)=>(
                  <BOHTH2 key={index} width={80} style={{textAlign:'center'}}>{quantity.date ? new Date(`${quantity.date} 00:00:00`).toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                  }) : ''}</BOHTH2>
                ))
              )}
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

export default Avaiable;
