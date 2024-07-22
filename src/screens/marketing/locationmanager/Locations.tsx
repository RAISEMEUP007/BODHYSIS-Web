import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getAddressesData, deleteAddress, getStreets, getPlantations, getPropertyNames } from '../../../api/AllAddress ';
import { BasicLayout, CommonContainer } from '../../../common/components/CustomLayout';
import { BOHTBody, BOHTD, BOHTDIconBox, BOHTH, BOHTH2, BOHTHead, BOHTR, BOHTable } from '../../../common/components/bohtable';
import { BOHButton, BOHTlbrSearchInput, BOHTlbrSearchPicker, BOHToolbar } from '../../../common/components/bohtoolbar';
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
  const InitialWidths = [80, 170, 170, 170, 90, 100, 100, 100, 50, 50];
  const [streets, setStreets] = useState([]);
  const [plantataions, setPlantations] = useState([]);
  const [propertyNames, setPropertyNames] = useState([]);
  const [searchOptions, setSearchOptions] = useState({
    searchKey: '',
    street: '',
    plantation: '',
    property_name: '',
  })

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

  const changeSearchOptions = (key, val) => {
    setSearchOptions(prevOptions => ({
      ...prevOptions,
      [key]: val
    }));
  }

  useEffect(() => {
    if (updateLocationTrigger == true) getTable();
    getStreets((jsonRes)=>{
      setStreets(jsonRes);
    });
    getPlantations((jsonRes)=>{
      setPlantations(jsonRes);
    });
    getPropertyNames((jsonRes)=>{
      setPropertyNames(jsonRes);
    });
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
  }, [searchOptions])

  const getTable = () => {
    setIsLoading(true);
    getAddressesData(searchOptions, (jsonRes, status, error) => {
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
            <BOHTD width={InitialWidths[5]}>{item.rental_company}</BOHTD>
            <BOHTD width={InitialWidths[6]} textAlign='right'>{item.voucher_potential}</BOHTD>
            <BOHTD width={InitialWidths[7]} textAlign='right'>{item.fif_potential}</BOHTD>
            <BOHTDIconBox width={InitialWidths[8]}>
              <TouchableOpacity
                onPress={() => {
                  editLocation(item);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </BOHTDIconBox>
            <BOHTDIconBox width={InitialWidths[9]}>
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
          <BOHTH2 width={InitialWidths[2]}>{'Plantation/Area'}</BOHTH2>
          <BOHTH2 width={InitialWidths[3]}>{'Property name'}</BOHTH2>
          <BOHTH2 width={InitialWidths[4]}>{'Property type'}</BOHTH2>
          <BOHTH2 width={InitialWidths[5]}>{'Rental Company'}</BOHTH2>
          <BOHTH2 width={InitialWidths[6]}>{'Voucher Potential'}</BOHTH2>
          <BOHTH2 width={InitialWidths[7]}>{'FIF Potential'}</BOHTH2>
          <BOHTH2 width={InitialWidths[8]}>{'Edit'}</BOHTH2>
          <BOHTH2 width={InitialWidths[9]}>{'DEL'}</BOHTH2>
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
            value={searchOptions.searchKey}
            onChangeText={(val)=>changeSearchOptions('searchKey', val)}/>
          <BOHTlbrSearchPicker
            width={136}
            label="Plantation/Area"
            items={[
              {label: '', value: ''}, 
              ...plantataions.map((item, index) => {
                  if (item && item.trim()) {
                    return {label: item.trim(), value: item.trim()};
                  } else {
                    return null;
                  }
                })
                .filter(item => item !== null)
            ]}
            selectedValue={searchOptions.plantation || ''}
            onValueChange={val=>changeSearchOptions('plantation', val)}
            />
          <BOHTlbrSearchPicker
            width={136}
            label="Street"
            items={[
              {label: '', value: ''}, 
              ...streets.map((item, index) => {
                  if (item && item.trim()) {
                    return {label: item.trim(), value: item.trim()};
                  } else {
                    return null;
                  }
                })
                .filter(item => item !== null)
            ]}
            selectedValue={searchOptions.street || ''}
            onValueChange={val=>changeSearchOptions('street', val)}
            />
          <BOHTlbrSearchPicker
            width={136}
            label="Property Name"
            items={[
              {label: '', value: ''}, 
              ...propertyNames.map((item, index) => {
                  if (item && item.trim()) {
                    return {label: item.trim(), value: item.trim()};
                  } else {
                    return null;
                  }
                })
                .filter(item => item !== null)
            ]}
            selectedValue={searchOptions.property_name || ''}
            onValueChange={val=>changeSearchOptions('property_name', val)}
            />
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
