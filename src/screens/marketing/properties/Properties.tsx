import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { deletePropertyName, getPropertyNamesData } from '../../../api/AllAddress ';
import { BasicLayout, CommonContainer } from '../../../common/components/CustomLayout';
import { BOHTBody, BOHTD, BOHTDIconBox, BOHTH2, BOHTHead, BOHTR, BOHTable } from '../../../common/components/bohtable';
import { BOHButton, BOHToolbar } from '../../../common/components/bohtoolbar';
import { msgStr } from '../../../common/constants/Message';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal, useConfirmModal } from '../../../common/hooks';

import AddPropertyModal from './AddPropertyModal';

const Properties = ({ navigation }) => {
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();
  
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatePropertyNameTrigger, setUpdatePropertyNamesTrigger] = useState(true);
  const InitialWidths = [350, 50, 50];

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedPropertyName, setSelectedPropertyName] = useState(null);

  const openAddPropertyNameModal = () => {
    setAddModalVisible(true);
    setSelectedPropertyName(null);
  };
  const closeAddPropertyNameModal = () => {
    setAddModalVisible(false);
    setSelectedPropertyName(null);
  };
  const editPropertyName = (item) => {
    setSelectedPropertyName(item);
    setAddModalVisible(true);
  };

  useEffect(() => {
    if (updatePropertyNameTrigger == true) getTable();
  }, [updatePropertyNameTrigger]);

  const removePropertyName = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deletePropertyName(id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdatePropertyNamesTrigger(true);
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
    getPropertyNamesData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdatePropertyNamesTrigger(false);
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
            <BOHTD width={InitialWidths[0]}>{item.property_name}</BOHTD>
            <BOHTDIconBox width={InitialWidths[1]}>
              <TouchableOpacity
                onPress={() => {
                  editPropertyName(item);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </BOHTDIconBox>
            <BOHTDIconBox width={InitialWidths[2]}>
              <TouchableOpacity
                onPress={() => {
                  removePropertyName(item.id);
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
          <BOHTH2 width={InitialWidths[0]}>{'Property name'}</BOHTH2>
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
      screenName={'Property name Manager'}
    >
      <CommonContainer>
        <BOHToolbar>
          <BOHButton
            label="Add"
            onPress={openAddPropertyNameModal}/>
        </BOHToolbar>
        {tableElement}
        <AddPropertyModal
          isModalVisible={isAddModalVisible}
          details={selectedPropertyName}
          setUpdatePropertyNamesTrigger={setUpdatePropertyNamesTrigger}
          closeModal={closeAddPropertyNameModal}
        />
      </CommonContainer>
    </BasicLayout>
  );
};

export default Properties;
