import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableHighlight, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getAddressesData, deleteAddress } from '../../../api/AllAddress ';
import { msgStr } from '../../../common/constants/Message';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../common/hooks/UseConfirmModal';
import BasicLayout from '../../../common/components/CustomLayout/BasicLayout';

import { LocationsStyle } from './styles/LocationsStyle';
import AddLocationModal from './AddLocationModal';

const LocationManager = ({ navigation, openMarketingMenu }) => {
  const screenHeight = Dimensions.get('window').height;
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateLocationTrigger, setUpdateLocationsTrigger] = useState(true);

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

  const renderTableData = () => {
    const rows = [];
    if (tableData.length > 0) {
      tableData.map((item, index) => {
        rows.push(
          <View key={index} style={styles.tableRow}>
            <View style={[styles.cell, {width:78}]}>
              <Text>{item.number}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.street}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.plantation}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.property_name}</Text>
            </View>
            <View style={[styles.cell, {width:120}]}>
              <Text>{item.property_type}</Text>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  editLocation(item);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  removeLocation(item.id);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="times" color="black" />
              </TouchableOpacity>
            </View>
          </View>
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
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <TouchableHighlight style={styles.button} onPress={openAddLocationModal}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.columnHeader, {width:78}]}>{'Number'}</Text>
            <Text style={[styles.columnHeader]}>{'Street'}</Text>
            <Text style={[styles.columnHeader]}>{'Plantation'}</Text>
            <Text style={[styles.columnHeader]}>{'Property name'}</Text>
            <Text style={[styles.columnHeader, {width:120}]}>{'Property type'}</Text>
            <Text style={[styles.columnHeader, styles.IconCell]}>{'Edit'}</Text>
            <Text style={[styles.columnHeader, styles.IconCell]}>{'DEL'}</Text>
          </View>
          <ScrollView style={{ flex: 1, maxHeight: screenHeight - 220 }}>
            {renderTableData()}
          </ScrollView>
        </View>

        <AddLocationModal
          isModalVisible={isAddModalVisible}
          Location={selectedLocation}
          setUpdateLocationsTrigger={setUpdateLocationsTrigger}
          closeModal={closeAddLocationModal}
        />
      </View>
    </BasicLayout>
  );
};

const styles = LocationsStyle;

export default LocationManager;
