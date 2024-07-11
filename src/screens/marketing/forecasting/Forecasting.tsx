import React, { useEffect, useMemo, useState } from 'react';
import { Text, Platform, View } from 'react-native';

import { getForecastingData } from '../../../api/AllAddress ';
import { BasicLayout, CommonContainer } from '../../../common/components/CustomLayout';
import { BOHTBody, BOHTD, BOHTDIconBox, BOHTH, BOHTH2, BOHTHead, BOHTR, BOHTable } from '../../../common/components/bohtable';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal, useConfirmModal } from '../../../common/hooks';
import { BOHButton, BOHTlbCheckbox, BOHToolbar, renderBOHTlbDatePicker } from '../../../common/components/bohtoolbar';
import { TextdefaultSize } from '../../../common/constants/Fonts';
import { formatDate } from '../../../common/utils/DateUtils';
import { API_URL } from '../../../common/constants/AppConstants';

const Forecasting = ({ navigation }) => {
  const { showAlert } = useAlertModal();

  const [tableData, setTableData] = useState([]);
  const [totalNights, setTotalNights] = useState(0);
  const [updateLocationTrigger, setUpdateLocationsTrigger] = useState(false);
  const InitialWidths = [200, 90, 90, 80, 160, 160, 100, 80];
  const [searchKey, setSearchKey] = useState('');
  const [daysArray, setdaysArray] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const today = new Date();
  const firstDateOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDateOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [ searchOptions, setSearchOptions ] = useState({
    start_date: formatDate(firstDateOfMonth),
    end_date: formatDate(lastDateOfMonth),
    xploriefif: false,
    xplorievoucher: false,
  });

  const changeSearchOptions = (key, val) => {
    setSearchOptions(prevOptions => ({
      ...prevOptions,
      [key]: val
    }));
  }

  useEffect(()=>{
    setLoading(true);
    setUpdateLocationsTrigger(true);
  }, [searchOptions])

  useEffect(() => {
    if (updateLocationTrigger == true) getTable();
  }, [updateLocationTrigger]);

  useEffect(()=>{
    setUpdateLocationsTrigger(true);
  }, [searchKey])

  const getTable = () => {
    setLoading(true);
    getForecastingData({searchOptions}, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateLocationsTrigger(false);
          setTableData(jsonRes.gridData);
          setTotalNights(jsonRes.totalNights);
          setdaysArray(jsonRes.daysArray);
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
      setLoading(false);
    });
  };

  const getCellColor = (percentage) =>{
    let bgcolor = "#F5C6CB";

    if(percentage>1) bgcolor = "green";
    else if(percentage>0.9) bgcolor = "blue";
    else if(percentage>0.75) bgcolor = "#FF00FF";
    else if(percentage>0.50) bgcolor = "yellow";
    else if(percentage>0.3) bgcolor = "lightblue";
    else if(percentage<0.1) bgcolor = "#F5C6CB";

    return bgcolor;
  }

  const getCellTextColor = (percentage) =>{
    let textColor = "black";

    if (percentage > 1) textColor = "white";
    else if (percentage > 0.9) textColor = "white";
    else if (percentage > 0.75) textColor = "white";
    else if (percentage > 0.50) textColor = "black";
    else if (percentage > 0.3) textColor = "black";
    else if (percentage < 0.1) textColor = "black";

    return textColor;
  }

  const exportForecasting = () => {
    location.href =  API_URL + `/forecasting/exportforecasting?start_date=${searchOptions.start_date}&end_date=${searchOptions.end_date}`
  }

  const renderTableData = () => {
    const rows = [];
    if (tableData && tableData.length && tableData.length > 0) {
      tableData.map((item, index) => {
        rows.push(
          <BOHTR key={index}>
            <BOHTD width={InitialWidths[0]}>{item.plantation||" "}</BOHTD>
            <BOHTD width={InitialWidths[1]}>{item.xploriefif?'FIF':item.xplorievoucher?'Voucher':''}</BOHTD>
            <BOHTD width={InitialWidths[2]}>{item.property_type == 0?"House": item.property_type == 1 ? "Condo" : ''}</BOHTD>
            <BOHTD width={InitialWidths[3]}>{item.number||" "}</BOHTD>
            <BOHTD width={InitialWidths[4]}>{item.street||" "}</BOHTD>
            <BOHTD width={InitialWidths[5]}>{item.property_name||" "}</BOHTD>
            <BOHTD width={InitialWidths[6]}>{item.potential||" "}</BOHTD>
            <BOHTD width={InitialWidths[7]} textAlign={'right'}>{item.guests}</BOHTD>
            { item.queryResult.map((subItem, index)=>{
              let bgcolor = getCellColor(subItem?.percentage??0);
              let txtColor = getCellTextColor(subItem?.percentage??0);
              return (
                <BOHTD 
                  key={index} width={40} 
                  style={{
                    backgroundColor:bgcolor,
                    borderRightWidth: 1,
                    borderRightColor: '#f2f2f2',
                    borderLeftWidth: 1,
                    borderLeftColor: '#f2f2f2',
                    paddingHorizontal: 0,
                    height: '100%',
                  }}
                  textProps={{
                    style:{
                      fontWeight:'bold', 
                      textAlign:'center',
                      color: txtColor,
                  }}}>
                  {subItem?.nights??" "}
                </BOHTD>
              );
            })}
          </BOHTR>
        );
      });
    } else {
      <></>;
    }
    return <>{rows}</>;
  };

  const tableElement = useMemo(() => (
    <BOHTable>
      <BOHTHead>
        <BOHTR>
          <BOHTH2 width={InitialWidths[0]}>{'Plantation/Area'}</BOHTH2>
          <BOHTH2 width={InitialWidths[1]}>{'FIF or Voucher'}</BOHTH2>
          <BOHTH2 width={InitialWidths[2]}>{'House or Condo'}</BOHTH2>
          <BOHTH2 width={InitialWidths[3]}>{'Number'}</BOHTH2>
          <BOHTH2 width={InitialWidths[4]}>{'Street'}</BOHTH2>
          <BOHTH2 width={InitialWidths[5]}>{'Property Name'}</BOHTH2>
          <BOHTH2 width={InitialWidths[6]}>{'Weekly Potential'}</BOHTH2>
          <BOHTH2 width={InitialWidths[7]}>{'Guests #'}</BOHTH2>
          {daysArray.length > 0 && daysArray.map((item, index)=>(
            <BOHTH2 
              key={index} 
              width={40} 
              BoxStyle={{height:100}}
              style={{
                whiteSpace: 'nowrap',
                padding: 0,
                marginTop: 10,
                transform: [{ rotate: '-90deg' }]
              }}
            >{item.formattedDate}</BOHTH2>
          ))}
        </BOHTR>
      </BOHTHead>
      <BOHTBody>
        {renderTableData()}
      </BOHTBody>
    </BOHTable>
  ), [tableData]);

  return (
    <BasicLayout
      navigation={navigation}
      goBack={() => {
        navigation.navigate('Marketing');
      }}
      screenName={'Forecasting'}
      isLoading={isLoading}
    >
      <CommonContainer>
        <BOHToolbar style={{zIndex:10}}>
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
          <BOHTlbCheckbox
            label={'FIF'}
            style={{marginLeft:30, marginRight:10}}
            CheckboxProps={{
              value:searchOptions.xploriefif
            }}
            onPress={()=>{
              changeSearchOptions('xploriefif', !searchOptions.xploriefif);
            }}
          />
          <BOHTlbCheckbox
            label={'VOUCHER'}
            CheckboxProps={{
              value:searchOptions.xplorievoucher
            }}
            onPress={()=>{
              changeSearchOptions('xplorievoucher', !searchOptions.xplorievoucher);
            }}
          />
          <Text style={{fontSize:TextdefaultSize, marginLeft:30,}}>{`Total Nights: ${totalNights}`}</Text>
          <BOHButton
            style={{marginLeft:30}}
            label='Export'
            onPress={exportForecasting}
          />
        </BOHToolbar>
        {tableElement}
      </CommonContainer>
    </BasicLayout>
  );
};

export default Forecasting;
