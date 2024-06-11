import React, { useEffect, useState } from 'react';
// import { getDisplayGroupOrder, updateCompatibility } from '../../../../api/Settings';
import { getDisplayGroupOrder, updateOrderIndex } from '../../../../api/Product';
import { useAlertModal } from '../../../../common/hooks';
import { BasicLayout, CommonContainer } from '../../../../common/components/CustomLayout';
import { BOHTable, BOHTHead, BOHTBody, BOHTR, BOHTH, BOHTD } from '../../../../common/components/bohtable';
import { msgStr } from '../../../../common/constants/Message';
import BOHTDInput from '../../../../common/components/bohtable/BOHTDInput';
import { BOHButton, BOHTlbrSearchPicker, BOHToolbar } from '../../../../common/components/bohtoolbar';

const DisplayGroupManager = ({ navigation, openInventory }) => {

  const { showAlert } = useAlertModal();

  const [tableData, setTableData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchCategory, setSearchCategory] = useState('');
  const widths = [200, 240, 100];

  const getTable = () => {
    getDisplayGroupOrder((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setTableData(jsonRes);
          const categories = [...new Set(jsonRes.map(item => item.category))];
          setCategories(categories);
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

  const updateValue = (index, display_name, newVal, oldVal) => {
    const order_index = newVal.replace(/[^\d]/g, '');
    if(order_index == oldVal) return;
    
    const payload = {
      display_name,
      order_index,
    }
    updateOrderIndex(payload, (jsonRes, status)=>{
      switch (status) {
        case 200:
          setTableData(prev => {
            prev[index].order_index = order_index;
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
    getTable();
  }, [])

  const renderTableData = () => {
    const rows = [];
    if (tableData.length > 0) {
      tableData.map((item, index) => {
        if (searchCategory === '' || item.category === searchCategory) {
          rows.push(
            <BOHTR key={index}>
              <BOHTD width={widths[0]}>{item.category}</BOHTD>
              <BOHTD width={widths[1]}>{item.display_name}</BOHTD>
              <BOHTDInput 
                width={widths[2]}
                keyboardType="numeric"
                value={item.order_index || ''}
                onChangeText={(newVal) => {
                  updateValue(index, item.display_name, newVal, item.order_index);
                }}
              />
            </BOHTR>
          );
        }
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
      screenName={'Display Group Manager'}
    >
      <CommonContainer>
        <BOHToolbar>
          <BOHTlbrSearchPicker
            items={[{label:'', value:''}, ...categories.map(item=>({'label':item, 'value':item}))]}
            label="Category"
            boxStyle={{marginLeft:0}}
            selectedValue={searchCategory}
            onValueChange={(value)=>{setSearchCategory(value as string)}}/>
        </BOHToolbar>
        <BOHTable>
          <BOHTHead>
            <BOHTR>
              <BOHTH width={widths[0]}>{"Product Category"}</BOHTH>
              <BOHTH width={widths[1]}>{"Product Family (Display Name)"}</BOHTH>
              <BOHTH width={widths[2]}>{"Order #"}</BOHTH>
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

export default DisplayGroupManager;
