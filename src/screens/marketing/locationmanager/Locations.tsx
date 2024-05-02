import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getAddressesData, deleteAddress } from '../../../api/AllAddress ';
import { BasicLayout, CommonContainer } from '../../../common/components/CustomLayout';
import { BOHTBody, BOHTD, BOHTDIconBox, BOHTH, BOHTHead, BOHTR, BOHTable } from '../../../common/components/bohtable';
import { BOHButton, BOHToolbar } from '../../../common/components/bohtoolbar';
import { msgStr } from '../../../common/constants/Message';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../common/hooks/UseConfirmModal';

import AddLocationModal from './AddLocationModal';

const LocationManager = ({ navigation, openMarketingMenu }) => {
  const screenHeight = Dimensions.get('window').height;
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();
  
  const [tableData, setTableData] = useState([]);
  const [updateLocationTrigger, setUpdateLocationsTrigger] = useState(true);
  const InitialWidths = [76, 61, 90, 120, 113, 47, 46];
  const [widths, setWidths] = useState([0, 0, 0, 0, 0, 0, 0]);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const updateWidth = (index, width) => {
    setWidths(prev => {
      if (!prev[index] || prev[index] < width) {
        const newWidths = [...prev];
        newWidths[index] = width;
        return newWidths;
      }
      return prev;
    });
  };

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

  const getTable = () => {
    getAddressesData((jsonRes, status, error) => {
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

  const handleLayoutUpdate = (index, cellWidth) => {
    setWidths(prev => {
      if (prev[index] < cellWidth) {
        const newWidths = [...prev];
        newWidths[index] = cellWidth;
        return newWidths;
      }
      return prev;
    });
  };

  const renderTableData = () => {
    const rows = [];
    if (tableData.length > 0) {
      tableData.map((item, index) => {
        rows.push(
          <BOHTR key={index}>
            <BOHTD
              onLayout={(event)=> handleLayoutUpdate(0, event.nativeEvent.layout.width)}
              width={InitialWidths[0]}
            >{item.number}</BOHTD>
            <BOHTD 
              onLayout={(event)=> handleLayoutUpdate(1, event.nativeEvent.layout.width)}
              width={widths[1]}
            >{item.street}</BOHTD>
            <BOHTD 
              onLayout={(event)=> handleLayoutUpdate(2, event.nativeEvent.layout.width)}
              width={widths[2]}
            >{item.plantation}</BOHTD>
            <BOHTD 
              onLayout={(event)=> handleLayoutUpdate(3, event.nativeEvent.layout.width)}
              width={widths[3]}
            >{item.property_name}</BOHTD>
            <BOHTD 
              onLayout={(event)=> handleLayoutUpdate(4, event.nativeEvent.layout.width)}
              width={InitialWidths[4]}
            >{item.property_type}</BOHTD>
            <BOHTDIconBox
              width={InitialWidths[5]}
            >
              <TouchableOpacity
                onPress={() => {
                  editLocation(item);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </BOHTDIconBox>
            <BOHTDIconBox
              width={InitialWidths[6]}
            >
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
            onPress={openAddLocationModal}
          />
        </BOHToolbar>
        <BOHTable>
          <BOHTHead>
            <BOHTR>
              <BOHTH width={widths[0]}>{'Number'}</BOHTH>
              <BOHTH width={widths[1]}>{'Street'}</BOHTH>
              <BOHTH width={widths[2]}>{'Plantation'}</BOHTH>
              <BOHTH width={widths[3]}>{'Property name'}</BOHTH>
              <BOHTH width={widths[4]}>{'Property type'}</BOHTH>
              <BOHTH width={widths[5]}>{'Edit'}</BOHTH>
              <BOHTH width={widths[6]}>{'DEL'}</BOHTH>
            </BOHTR>
          </BOHTHead>
          <BOHTBody>
            {renderTableData()}
          </BOHTBody>
        </BOHTable>

        <AddLocationModal
          isModalVisible={isAddModalVisible}
          Location={selectedLocation}
          setUpdateLocationsTrigger={setUpdateLocationsTrigger}
          closeModal={closeAddLocationModal}
        />
      </CommonContainer>
    </BasicLayout>
  );
};

export default LocationManager;
