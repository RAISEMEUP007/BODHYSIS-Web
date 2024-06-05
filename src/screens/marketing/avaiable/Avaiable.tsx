import React, { useEffect, useState } from 'react';


import { getAvaliableSheet } from '../../../api/Reservation';
import { BasicLayout, CommonContainer } from '../../../common/components/CustomLayout';
import { BOHTBody, BOHTD, BOHTDIconBox, BOHTH, BOHTH2, BOHTHead, BOHTR, BOHTable } from '../../../common/components/bohtable';
import { msgStr } from '../../../common/constants/Message';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../common/hooks/UseConfirmModal';

const Avaiable = ({ navigation, openMarketingMenu }) => {
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();
  
  const [tableData, setTableData] = useState([]);
  const [updateLocationTrigger, setUpdateLocationsTrigger] = useState(true);
  const InitialWidths = [250, 90, 90, 80, 160, 160, 100, 80];

  useEffect(() => {
    if (updateLocationTrigger == true) getTable();
  }, [updateLocationTrigger]);

  const getTable = () => {
    getAvaliableSheet((jsonRes, status, error) => {
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

  const renderTableData = () => {
    const rows = [];
    if (tableData && tableData.length && tableData.length > 0) {
      tableData.map((item, index) => {
        rows.push(
          <BOHTR key={index}>
            <BOHTD width={InitialWidths[0]}>{item.display_name ||" "}</BOHTD>
            {item.quantities.length >0 && (
              item.quantities.map((quantity, index)=>(
                <BOHTD key={index} width={80} style={{textAlign:'center'}}>{`${quantity.out_amount}/${quantity.inventoryAmount}`}</BOHTD>
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
        openMarketingMenu(null);
      }}
      screenName={'Demands'}
    >
      <CommonContainer>
        <BOHTable>
          <BOHTHead>
            <BOHTR>
              <BOHTH2 width={InitialWidths[0]}>{'Display Name'}</BOHTH2>
              {(tableData && tableData.length >0) && (
                tableData[0].quantities.map((quantity, index)=>(
                  <BOHTH2 key={index} width={80} style={{textAlign:'center'}}>{quantity.date ? new Date(`${quantity.date} 0:0:0`).toLocaleString('en-US', {
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
