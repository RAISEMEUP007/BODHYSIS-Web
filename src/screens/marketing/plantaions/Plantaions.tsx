import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { deletePlantation, getPlantationsData } from '../../../api/AllAddress ';
import { BasicLayout, CommonContainer } from '../../../common/components/CustomLayout';
import { BOHTBody, BOHTD, BOHTDIconBox, BOHTH2, BOHTHead, BOHTR, BOHTable } from '../../../common/components/bohtable';
import { BOHButton, BOHToolbar } from '../../../common/components/bohtoolbar';
import { msgStr } from '../../../common/constants/Message';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal, useConfirmModal } from '../../../common/hooks';

import AddPlantationModal from './AddPlantationModal';

const Plantations = ({ navigation }) => {
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();
  
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatePlantationTrigger, setUpdatePlantationsTrigger] = useState(true);
  const InitialWidths = [350, 50, 50];

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedPlantation, setSelectedPlantation] = useState(null);

  const openAddPlantationModal = () => {
    setAddModalVisible(true);
    setSelectedPlantation(null);
  };
  const closeAddPlantationModal = () => {
    setAddModalVisible(false);
    setSelectedPlantation(null);
  };
  const editPlantation = (item) => {
    setSelectedPlantation(item);
    setAddModalVisible(true);
  };

  useEffect(() => {
    if (updatePlantationTrigger == true) getTable();
  }, [updatePlantationTrigger]);

  const removePlantation = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deletePlantation(id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdatePlantationsTrigger(true);
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
    setIsLoading(true);
    getPlantationsData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdatePlantationsTrigger(false);
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
            <BOHTD width={InitialWidths[0]}>{item.plantation}</BOHTD>
            <BOHTDIconBox width={InitialWidths[1]}>
              <TouchableOpacity
                onPress={() => {
                  editPlantation(item);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </BOHTDIconBox>
            <BOHTDIconBox width={InitialWidths[2]}>
              <TouchableOpacity
                onPress={() => {
                  removePlantation(item.id);
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
          <BOHTH2 width={InitialWidths[0]}>{'Plantation/Area'}</BOHTH2>
          <BOHTH2 width={InitialWidths[1]}>{'Edit'}</BOHTH2>
          <BOHTH2 width={InitialWidths[2]}>{'DEL'}</BOHTH2>
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
      screenName={'Plantation Manager'}
    >
      <CommonContainer>
        <BOHToolbar>
          <BOHButton
            label="Add"
            onPress={openAddPlantationModal}/>
        </BOHToolbar>
        {tableElement}
        <AddPlantationModal
          isModalVisible={isAddModalVisible}
          details={selectedPlantation}
          setUpdatePlantationsTrigger={setUpdatePlantationsTrigger}
          closeModal={closeAddPlantationModal}
        />
      </CommonContainer>
    </BasicLayout>
  );
};

export default Plantations;
