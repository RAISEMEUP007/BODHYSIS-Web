import React, { useEffect, useMemo, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getReservationsData } from '../../api/Reservation';
import { BasicLayout, CommonContainer } from '../../common/components/CustomLayout';
import { BOHToolbar } from '../../common/components/bohtoolbar';
import { BOHTBody, BOHTD, BOHTDIconBox, BOHTH, BOHTHead, BOHTR, BOHTable } from '../../common/components/bohtable';
import { msgStr } from '../../common/constants/Message';
import { TextMediumSize, TextdefaultSize } from '../../common/constants/Fonts';
import { useAlertModal } from '../../common/hooks';
import { formatDate2 } from '../../common/utils/DateUtils';
import { ProceedReservation } from './ProceedReservation';

const PotentialList = ({ navigation }) => {

  const { showAlert } = useAlertModal();

  const [tableData, setTableData] = useState([]);
  const [updateReservationListTrigger, setUpdateReservationListTrigger] = useState(false);
  const initialWidths = [100, 160, 160, 100, 100, 110, 110, 80, 80];
  const [openProceed, setOpenProceed] = useState(false);
  const [selectedId, setSelectedId] = useState<number|string|undefined>();

  const [ searchOptions, setSearchOptions ] = useState({
    ids:null,
    date:null,
    address : null,
    potential : null,
  });

  useEffect(()=>{
    loadSearchOption();
  }, [])
  
  const loadSearchOption = async () => {
    const [searchOptions] = await Promise.all([
      AsyncStorage.getItem('__potential_options'),
    ]);
    if (searchOptions) {
      setSearchOptions(JSON.parse(searchOptions));
      setUpdateReservationListTrigger(true);
    }
  }
  
  useEffect(() => {
    if (updateReservationListTrigger == true) getTable();
  }, [updateReservationListTrigger]);

  const getTable = () => {
    if(!searchOptions.ids) return;
    getReservationsData({searchOptions:{ids:searchOptions.ids}}, (jsonRes, status, error) => {
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
            <BOHTD width={initialWidths[0]}>{item.order_number}</BOHTD>
            <BOHTD width={initialWidths[1]}>{item.brand}</BOHTD>
            <BOHTD width={initialWidths[2]}>{item.full_name}</BOHTD>
            <BOHTD width={initialWidths[3]}>{item.start_date ? formatDate2(new Date(`${item.start_date} 00:00:00`)) : ''}</BOHTD>
            <BOHTD width={initialWidths[4]}>{item.end_date ? formatDate2(new Date(`${item.end_date} 00:00:00`)) : ''}</BOHTD>
            <BOHTD width={initialWidths[5]} textAlign={'right'}>{item?.quantity??''}</BOHTD>
            <BOHTD width={initialWidths[6]}>{convertStageToString(item.stage)}</BOHTD>
            <BOHTD width={initialWidths[7]} textAlign='center'>{item.printed?'Yes':'No'}</BOHTD>
            <BOHTDIconBox width={initialWidths[8]}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedId(item.id);
                  setOpenProceed(true);
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

  const tableElement = useMemo(()=>(
    <BOHTable>
      <BOHTHead>
        <BOHTR>
          <BOHTH width={initialWidths[0]}>{'Order #'}</BOHTH>
          <BOHTH width={initialWidths[1]}>{'Brand'}</BOHTH>
          <BOHTH width={initialWidths[2]}>{'Customer'}</BOHTH>
          <BOHTH width={initialWidths[3]}>{'Start'}</BOHTH>
          <BOHTH width={initialWidths[4]}>{'End'}</BOHTH>
          <BOHTH width={initialWidths[5]}>{'Qty of bikes'}</BOHTH>
          <BOHTH width={initialWidths[6]}>{'Stage'}</BOHTH>
          <BOHTH width={initialWidths[7]}>{'Printed'}</BOHTH>
          <BOHTH width={initialWidths[8]}>{'Proceed'}</BOHTH>
        </BOHTR>
      </BOHTHead>
      <BOHTBody>
        {renderTableData()}
      </BOHTBody>
    </BOHTable>), [tableData])

  if(openProceed && selectedId){
    return <ProceedReservation
      goBack={()=>{
        setOpenProceed(false);
        setSelectedId(undefined);
      }}
      reservationId={selectedId}
    />
  }else
    return (
      <BasicLayout
        navigation={navigation}
        screenName={'Reservation List'}
      >
        <CommonContainer>
          <BOHToolbar>
            <Text selectable={true} style={{fontSize:TextdefaultSize}}>{`Address:  ${searchOptions.address}`}</Text>
            <Text selectable={true} style={{marginLeft:50, fontSize:TextdefaultSize}}>{`Date:  ${searchOptions.date?formatDate2(new Date(searchOptions.date + ' 00:00:00')):''}`}</Text>
            <Text selectable={true} style={{marginLeft:50, fontSize:TextdefaultSize}}>{`Potential:  ${searchOptions.potential}`}</Text>
          </BOHToolbar>
          {tableElement}
        </CommonContainer>
      </BasicLayout>
    );
};

export default PotentialList;
