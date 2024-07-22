import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { deleteStreet, getStreetsData } from '../../../api/AllAddress ';
import { BasicLayout, CommonContainer } from '../../../common/components/CustomLayout';
import { BOHTBody, BOHTD, BOHTDIconBox, BOHTH2, BOHTHead, BOHTR, BOHTable } from '../../../common/components/bohtable';
import { BOHButton, BOHToolbar } from '../../../common/components/bohtoolbar';
import { msgStr } from '../../../common/constants/Message';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal, useConfirmModal } from '../../../common/hooks';

import AddStreetModal from './AddStreetModal';

const Streets = ({ navigation }) => {
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();
  
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updateStreetTrigger, setUpdateStreetsTrigger] = useState(true);
  const InitialWidths = [350, 50, 50];

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedStreet, setSelectedStreet] = useState(null);

  const openAddStreetModal = () => {
    setAddModalVisible(true);
    setSelectedStreet(null);
  };
  const closeAddStreetModal = () => {
    setAddModalVisible(false);
    setSelectedStreet(null);
  };
  const editStreet = (item) => {
    setSelectedStreet(item);
    setAddModalVisible(true);
  };

  useEffect(() => {
    if (updateStreetTrigger == true) getTable();
  }, [updateStreetTrigger]);

  const removeStreet = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deleteStreet(id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdateStreetsTrigger(true);
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
    getStreetsData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateStreetsTrigger(false);
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
            <BOHTD width={InitialWidths[0]}>{item.street}</BOHTD>
            <BOHTDIconBox width={InitialWidths[1]}>
              <TouchableOpacity
                onPress={() => {
                  editStreet(item);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </BOHTDIconBox>
            <BOHTDIconBox width={InitialWidths[2]}>
              <TouchableOpacity
                onPress={() => {
                  removeStreet(item.id);
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
          <BOHTH2 width={InitialWidths[0]}>{'Street/Area'}</BOHTH2>
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
      screenName={'Street Manager'}
    >
      <CommonContainer>
        <BOHToolbar>
          <BOHButton
            label="Add"
            onPress={openAddStreetModal}/>
        </BOHToolbar>
        {tableElement}
        <AddStreetModal
          isModalVisible={isAddModalVisible}
          details={selectedStreet}
          setUpdateStreetsTrigger={setUpdateStreetsTrigger}
          closeModal={closeAddStreetModal}
        />
      </CommonContainer>
    </BasicLayout>
  );
};

export default Streets;
