import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getAddressesData, deleteAddress } from '../../../api/AllAddress ';
import { BasicLayout, CommonContainer } from '../../../common/components/CustomLayout';
import { BOHTBody, BOHTD, BOHTDIconBox, BOHTH, BOHTHead, BOHTR, BOHTable } from '../../../common/components/bohtable';
import { BOHButton, BOHTlbrSearchInput, BOHToolbar } from '../../../common/components/bohtoolbar';
import { msgStr } from '../../../common/constants/Message';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../common/hooks/UseConfirmModal';

import AddLocationModal from './AddLocationModal';

const LocationManager = ({ navigation, openMarketingMenu }) => {
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();
  
  const [tableData, setTableData] = useState([]);
  const [updateLocationTrigger, setUpdateLocationsTrigger] = useState(true);
  const InitialWidths = [76, 170, 170, 170, 113, 50, 50];
  const [searchKey, setSearchKey] = useState('');

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const openAddLocationModal = () => {
    setAddModalVisible(true);
    setSelectedLocation(null);
  };
  const closeAddLocationModal = () => {
    setAddModalVisible(false);
    setSelectedLocation(null);
  };
  const editLocation = (item) => {
    setSelectedLocation(item);
    setAddModalVisible(true);
  };

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
    const payload={searchKey}
    getAddressesData(payload, (jsonRes, status, error) => {
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
    if (tableData.length > 0) {
      tableData.map((item, index) => {
        rows.push(
          <BOHTR key={index}>
            <BOHTD width={InitialWidths[0]}>{item.number}</BOHTD>
            <BOHTD width={InitialWidths[1]}>{item.street}</BOHTD>
            <BOHTD width={InitialWidths[2]}>{item.plantation}</BOHTD>
            <BOHTD width={InitialWidths[3]}>{item.property_name}</BOHTD>
            <BOHTD width={InitialWidths[4]}>{item.property_type == 0?'House':item.property_type == 1?'Condo':''}</BOHTD>
            <BOHTDIconBox width={InitialWidths[5]}>
              <TouchableOpacity
                onPress={() => {
                  editLocation(item);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </BOHTDIconBox>
            <BOHTDIconBox width={InitialWidths[6]}>
              <TouchableOpacity
                onPress={() => {
                  removeLocation(item.id);
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
        openMarketingMenu(null);
      }}
      screenName={'Location Manager'}
    >
      <CommonContainer>
        <BOHToolbar>
          <BOHButton
            label="Add"
            onPress={openAddLocationModal}/>
          <BOHTlbrSearchInput
            label="Search"
            value={searchKey}
            onChangeText={setSearchKey}/>
        </BOHToolbar>
        <BOHTable>
          <BOHTHead>
            <BOHTR>
              <BOHTH width={InitialWidths[0]}>{'Number'}</BOHTH>
              <BOHTH width={InitialWidths[1]}>{'Street'}</BOHTH>
              <BOHTH width={InitialWidths[2]}>{'Plantation'}</BOHTH>
              <BOHTH width={InitialWidths[3]}>{'Property name'}</BOHTH>
              <BOHTH width={InitialWidths[4]}>{'Property type'}</BOHTH>
              <BOHTH width={InitialWidths[5]}>{'Edit'}</BOHTH>
              <BOHTH width={InitialWidths[6]}>{'DEL'}</BOHTH>
            </BOHTR>
          </BOHTHead>
          <BOHTBody>
            {renderTableData()}
          </BOHTBody>
        </BOHTable>

        <AddLocationModal
          isModalVisible={isAddModalVisible}
          details={selectedLocation}
          setUpdateLocationsTrigger={setUpdateLocationsTrigger}
          closeModal={closeAddLocationModal}
        />
      </CommonContainer>
    </BasicLayout>
  );
};

export default LocationManager;
