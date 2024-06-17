import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getAddressesData, deleteAddress } from '../../../api/AllAddress ';
import { BasicLayout, CommonContainer } from '../../../common/components/CustomLayout';
import { BOHTBody, BOHTD, BOHTDIconBox, BOHTH, BOHTH2, BOHTHead, BOHTR, BOHTable } from '../../../common/components/bohtable';
import { BOHButton, BOHTlbrSearchInput, BOHToolbar } from '../../../common/components/bohtoolbar';
import { msgStr } from '../../../common/constants/Message';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal, useConfirmModal } from '../../../common/hooks';

import AddLocationModal from './AddLocationModal';

const LocationManager = ({ navigation }) => {
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();
  
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updateLocationTrigger, setUpdateLocationsTrigger] = useState(true);
  const InitialWidths = [80, 170, 170, 170, 113, 50, 50];
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
    setIsLoading(true);
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

  const renderTableData = useMemo(() => {
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
    
    setIsLoading(false);
    return <>{rows}</>;
  }, [tableData]);

  const tableElement = useMemo(()=>(        
    <BOHTable isLoading={isLoading}>
      <BOHTHead>
        <BOHTR>
          <BOHTH2 width={InitialWidths[0]}>{'Number'}</BOHTH2>
          <BOHTH2 width={InitialWidths[1]}>{'Street'}</BOHTH2>
          <BOHTH2 width={InitialWidths[2]}>{'Plantation'}</BOHTH2>
          <BOHTH2 width={InitialWidths[3]}>{'Property name'}</BOHTH2>
          <BOHTH2 width={InitialWidths[4]}>{'Property type'}</BOHTH2>
          <BOHTH2 width={InitialWidths[5]}>{'Edit'}</BOHTH2>
          <BOHTH2 width={InitialWidths[6]}>{'DEL'}</BOHTH2>
        </BOHTR>
      </BOHTHead>
      <BOHTBody>
        {renderTableData}
      </BOHTBody>
    </BOHTable>), [isLoading, tableData])

  return (
    <BasicLayout
      navigation={navigation}
      goBack={() => {
        navigation.navigate('Marketing');
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
        {tableElement}
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
