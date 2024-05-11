import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getAddressesData, deleteAddress, getForecastingData } from '../../../api/AllAddress ';
import { BasicLayout, CommonContainer } from '../../../common/components/CustomLayout';
import { BOHTBody, BOHTD, BOHTDIconBox, BOHTH, BOHTH2, BOHTHead, BOHTR, BOHTable } from '../../../common/components/bohtable';
import { msgStr } from '../../../common/constants/Message';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../common/hooks/UseConfirmModal';

const Forecasting = ({ navigation, openMarketingMenu }) => {
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();
  
  const [tableData, setTableData] = useState([]);
  const [updateLocationTrigger, setUpdateLocationsTrigger] = useState(true);
  const InitialWidths = [200, 90, 90, 80, 160, 160, 100, 80];
  const [searchKey, setSearchKey] = useState('');
  const [weeksArray, setweeksArray] = useState([]);

  useEffect(() => {
    if (updateLocationTrigger == true) getTable();
  }, [updateLocationTrigger]);

  const removeLocation = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deleteAddress(id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdateLocationsTrigger(true);
            showAlert('success', jsonRes.message);
            break;
          default:
            if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
            else showAlert('error', msgStr('unknownError'));
            break;
        }
      });
    });
  };

  useEffect(()=>{
    setUpdateLocationsTrigger(true);
  }, [searchKey])

  const getTable = () => {
    getForecastingData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateLocationsTrigger(false);
          setTableData(jsonRes.gridData);
          setweeksArray(jsonRes.weeksArray);
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

  const getCellColor = (percentage) =>{
    let color = "#F5C6CB";
    if(percentage>1) color = "green";
    else if(percentage>0.9) color = "blue";
    else if(percentage>0.75) color = "#FF00FF";
    else if(percentage>0.50) color = "yellow";
    else if(percentage>0.3) color = "lightblue";
    else if(percentage<0.1) color = "#F5C6CB";
    if(percentage>0) console.log(percentage);
    return color;
  }

  const renderTableData = () => {
    const rows = [];
    if (tableData && tableData.length && tableData.length > 0) {
      tableData.map((item, index) => {
        rows.push(
          <BOHTR key={index}>
            <BOHTD width={InitialWidths[0]}>{item.plantation||" "}</BOHTD>
            <BOHTD width={InitialWidths[1]}>{item.xploriefif||" "}</BOHTD>
            <BOHTD width={InitialWidths[2]}>{item.xplorievoucher||" "}</BOHTD>
            <BOHTD width={InitialWidths[3]}>{item.number||" "}</BOHTD>
            <BOHTD width={InitialWidths[4]}>{item.street||" "}</BOHTD>
            <BOHTD width={InitialWidths[5]}>{item.property_name||" "}</BOHTD>
            <BOHTD width={InitialWidths[6]}>{""}</BOHTD>
            <BOHTD width={InitialWidths[7]} style={{textAlign:'right'}}>{item.guests}</BOHTD>
            { item.queryResult.map((subItem, index)=>{
              let color = getCellColor(subItem?.percentage??0);
              return (
                <BOHTD 
                  key={index} width={40} 
                  style={{
                    fontWeight:'bold', 
                    backgroundColor:color,
                    borderRightWidth: 1,
                    borderRightColor: '#f2f2f2',
                    borderLeftWidth: 1,
                    borderLeftColor: '#f2f2f2',
                    paddingHorizontal: 0,
                    // paddingLeft:0,
                    // paddingRight:4,
                    textAlign:'center',
                    height: '100%',
                  }}>
                  {subItem?.booked_guests??" "}
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

  return (
    <BasicLayout
      navigation={navigation}
      goBack={() => {
        openMarketingMenu(null);
      }}
      screenName={'Forecasting'}
    >
      <CommonContainer>
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
              {weeksArray.length > 0 && weeksArray.map((item, index)=>(
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
                >{item.formattedEndDate}</BOHTH2>
              ))}
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

export default Forecasting;
