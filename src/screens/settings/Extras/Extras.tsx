import React, { useEffect, useState } from 'react';
import { Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getExtrasData, deleteExtra } from '../../../api/Settings';
import { msgStr } from '../../../common/constants/Message';
import { API_URL } from '../../../common/constants/AppConstants';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../common/hooks/UseConfirmModal';
import { BasicLayout, CommonContainer } from '../../../common/components/CustomLayout';
import { BOHButton, BOHToolbar } from '../../../common/components/bohtoolbar';
import { BOHTBody, BOHTD, BOHTDIconBox, BOHTDImageBox, BOHTH, BOHTHead, BOHTR, BOHTable } from '../../../common/components/bohtable';

import AddExtraModal from './AddExtraModal';

const Extras = ({ navigation, openInventory }) => {

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateExtraTrigger, setUpdateExtraTrigger] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedExtra, setSelectedExtra] = useState(null);

  const InitialWidths = [70, 200, 60, 70, 50, 50];

  const openAddExtraModal = () => {
    setAddModalVisible(true);
    setSelectedExtra(null);
  };
  const closeAddExtraModal = () => {
    setAddModalVisible(false);
    setSelectedExtra(null);
  };
  const editExtra = (item) => {
    setSelectedExtra(item);
    setAddModalVisible(true);
  };
  
  useEffect(() => {
    if (updateExtraTrigger == true) getTable();
  }, [updateExtraTrigger]);

  const removeExtra = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deleteExtra(id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdateExtraTrigger(true);
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

  const getTable = () => {
    getExtrasData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateExtraTrigger(false);
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
    if (tableData.length > 0) {
      tableData.map((item, index) => {
        let price = '';
        switch(item.option){
          case 0:
            price = 'Free';
            break;
          case 1:
            price = item.fixed_price;
            break;
          case 2:
            break;
        }
        rows.push(
          <BOHTR key={index}>
            <BOHTD width={InitialWidths[0]}>{(item.status?'Active':'Inactive')}</BOHTD>
            <BOHTD width={InitialWidths[1]}>{item.name}</BOHTD>
            <BOHTD width={InitialWidths[2]} style={{textAlign:'right'}}>{price}</BOHTD>
            <BOHTDImageBox width={InitialWidths[3]} imgURL={API_URL + item.img_url}/>
            <BOHTDIconBox width={InitialWidths[4]}>
              <TouchableOpacity
                onPress={() => {
                  editExtra(item);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </BOHTDIconBox>
            <BOHTDIconBox width={InitialWidths[5]}>
              <TouchableOpacity
                onPress={() => {
                  removeExtra(item.id);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="times" color="black" />
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
      goBack={() => {
        openInventory(null);
      }}
      screenName={'Extras'}
    >
      <CommonContainer>
        <BOHToolbar>
          <BOHButton 
            label={'Add'}
            onPress={openAddExtraModal}/>
        </BOHToolbar>
        <BOHTable>
          <BOHTHead>
            <BOHTR>
              <BOHTH width={InitialWidths[0]}>{'Status'}</BOHTH>
              <BOHTH width={InitialWidths[1]}>{'Name'}</BOHTH>
              <BOHTH width={InitialWidths[2]}>{'Price'}</BOHTH>
              <BOHTH width={InitialWidths[3]}>{'Image'}</BOHTH>
              <BOHTH width={InitialWidths[4]}>{'Edit'}</BOHTH>
              <BOHTH width={InitialWidths[5]}>{'DEL'}</BOHTH>
            </BOHTR>
          </BOHTHead>
          <BOHTBody>
            {renderTableData()}
          </BOHTBody>
        </BOHTable>
      </CommonContainer>

      <AddExtraModal
        isModalVisible={isAddModalVisible}
        Extra={selectedExtra}
        setUpdateExtraTrigger={setUpdateExtraTrigger}
        closeModal={closeAddExtraModal}
      />
    </BasicLayout>
  );
};

export default Extras;
