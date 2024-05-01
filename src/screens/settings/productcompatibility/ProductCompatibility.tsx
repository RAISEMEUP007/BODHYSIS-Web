import React, { useEffect, useState } from 'react';

import { getProductCompatibilitiesData, updateCompatibility } from '../../../api/Settings';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';

import { BasicLayout, CommonContainer } from '../../../common/components/CustomLayout';
import { BOHTable, BOHTHead, BOHTBody, BOHTR, BOHTH, BOHTD } from '../../../common/components/bohtable';
import { getExtrasData } from '../../../api/Settings';
import { msgStr } from '../../../common/constants/Message';
import BOHTDCheckbox from '../../../common/components/bohtable/BOHTDCheckbox';

const ProductCompatibility = ({ navigation, openInventory }) => {

  const { showAlert } = useAlertModal();

  const [tableData, setTableData] = useState([]);
  const [extraData, setExtraData] = useState([]);
  const [headerData, setHeaderData] = useState(['Product Family']);
  const [widths, setWidths] = useState([]);

  const getTable = () => {
    getProductCompatibilitiesData((jsonRes, status, error) => {
      switch (status) {
        case 200:
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

  const updateWidth = (index, width) => {
    if (index == 0) width = 250;
    setWidths(prev => {
      if (!prev[index] || prev[index] < width) {
        const newWidths = [...prev];
        newWidths[index] = width;
        return newWidths;
      }
      return prev;
    });
  };

  const updateValue = (index, index2, value) => {
    const payload = {
      family_id: tableData[index].id,
      extra_id: extraData[index2].id,
      is_connected: value,
    }
    updateCompatibility(payload, (jsonRes, status)=>{
      switch (status) {
        case 200:
          setTableData(prev => {
            prev[index].compatibilities[index2] = value;
            return [...prev];
          });
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
  
  useEffect(()=>{
    getExtrasData((jsonRes, status)=>{
      if(status == 200){
        setExtraData(jsonRes);
        setHeaderData(['Product Family', ...jsonRes.map(item=>item.name)]);
      }else{
        setExtraData([]);
        setHeaderData(['Product Family']);
      }
    })
    getTable();
  }, [])

  const renderTableData = () => {
    const rows = [];
    if (tableData.length > 0) {
      tableData.map((item, index) => {
        rows.push(
          <BOHTR key={index}>
            <BOHTD
              width={widths[0]}
            >{item.family}</BOHTD>
            {item.compatibilities && item.compatibilities.map((tddata, index2)=>(
              <BOHTDCheckbox
                key={index2}
                width={widths[index2+1]}
                value={tddata}
                onChange={(val)=>updateValue(index, index2, tddata?false:true)}
              />
            ))}
          </BOHTR>
        );
      });
    }
    return <>{rows}</>;
  };

  return (
    <BasicLayout
      navigation={navigation}
      goBack={() => {
        openInventory(null);
      }}
      screenName={'ProductCompatibility'}
    >
      <CommonContainer>
        <BOHTable>
          <BOHTHead>
            <BOHTR>
              {headerData && headerData.length > 0 && headerData.map((header, index)=>(
                <BOHTH 
                  key={index} 
                  onLayout={(event)=>{
                    const { width } = event.nativeEvent.layout;
                    if(width != widths[index]) updateWidth(index, width+1);
                  }}
                  width={widths[index]}
                  // lastCell={index === headerData.length - 1}
                >{header}</BOHTH>
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

export default ProductCompatibility;
