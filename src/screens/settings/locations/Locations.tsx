import React, { useEffect, useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

import { getLocationsData, deleteLocation } from '../../../api/Settings';
import { msgStr } from '../../../common/constants/Message';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../common/hooks/UseConfirmModal';
import { BasicLayout, CommonContainer } from '../../../common/components/CustomLayout';
import { BOHTBody, BOHTD, BOHTDIconBox, BOHTH, BOHTHead, BOHTR, BOHTable } from '../../../common/components/bohtable';
import { BOHToolbar, BOHButton } from '../../../common/components/bohtoolbar';

import AddLocationModal from './AddLocationModal';

const Locations = ({ navigation, openInventory }) => {
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateLocationTrigger, setUpdateLocationsTrigger] = useState(true);
  const InitialWidths = [200, 50, 50];

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
      deleteLocation(id, (jsonRes, status, error) => {
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
    getLocationsData((jsonRes, status, error) => {
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
            <BOHTD width={InitialWidths[0]}>{item.location}</BOHTD>
            <BOHTDIconBox  width={InitialWidths[1]}>
              <TouchableOpacity
                onPress={() => {
                  editLocation(item);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </BOHTDIconBox>
            <BOHTDIconBox  width={InitialWidths[2]}>
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
        openInventory(null);
      }}
      screenName={'Locations'}
    >
      <CommonContainer>
        <BOHToolbar>
          <BOHButton 
            label={"Add"}
            onPress={openAddLocationModal}/>
        </BOHToolbar>
        <BOHTable>
          <BOHTHead>
            <BOHTR>
              <BOHTH width={InitialWidths[0]}>{'Location'}</BOHTH>
              <BOHTH width={InitialWidths[1]}>{'Edit'}</BOHTH>
              <BOHTH width={InitialWidths[2]}>{'DEL'}</BOHTH>
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

export default Locations;
