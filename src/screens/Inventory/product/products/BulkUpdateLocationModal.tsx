import React, { useState, useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  Modal,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import {
  updateBulkLocation,
} from '../../../../api/Product';
import { getLocationsData } from '../../../../api/Settings';
import BasicModalContainer from '../../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../../common/constants/Message';
import { useAlertModal } from '../../../../common/hooks/UseAlertModal';

import { productModalstyles } from './styles/ProductModalStyle';

const BulkUpdateLocationModal = ({ isModalVisible, ids, setUpdateProductsTrigger, closeModal }) => {

  const { showAlert } = useAlertModal();

  const [isLoading, setIsLoading] = useState(false);
  const [Locations, setLocations] = useState([]);

  const [selectedHomeLocation, selectHomeLocation] = useState<number>(0);
  const [selectedCurrentLocation, selectCurrentLocation] = useState<number>(0);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          closeModal();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [closeModal]);

  useEffect(() => {
    if (isModalVisible) {
      if(!ids || !Array.isArray(ids) || ids.length == 0){
        showAlert('warning', 'Please select products');
        closeModal();
      }
      setIsLoading(false);
      selectHomeLocation(0);
      selectCurrentLocation(0);
    }
  }, [isModalVisible]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response2 = await getLocationsData();
        const locationsData = await response2.json();
        setLocations(locationsData);
      } catch (error) {
        console.log(error);
      }
    };
 
    fetchData();
 }, []);


  const AddProductButtonHandler = () => {
    if(!selectedHomeLocation && !selectedCurrentLocation){
      showAlert('warning', 'No location selected');
      closeModal();
      return;
    }

    setIsLoading(true);

    const payload : any = {
      ids: ids,
    };
    if(selectedHomeLocation) payload.home_location = selectedHomeLocation;
    if(selectedCurrentLocation) payload.current_location = selectedCurrentLocation;
    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateProductsTrigger(true);
          closeModal();
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          closeModal();
          break;
      }
      setIsLoading(false);
    };

    updateBulkLocation(payload, (jsonRes, status) => {
      handleResponse(jsonRes, status);
    });
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isModalVisible}
      onShow={() => {
      }}
    >
      <BasicModalContainer>
        <ModalHeader label={'Bulk update locations'} closeModal={closeModal} />
        <ModalBody>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Home Location</Text>
              <Picker
                style={styles.select}
                selectedValue={selectedHomeLocation}
                onValueChange={(itemValue, itemIndex) => {
                  console.log(itemValue);
                  selectHomeLocation(itemValue);
                }}
              >
                <Picker.Item label={''} value={0} />
                {Locations.length > 0 &&
                  Locations.map((location, index) => {
                    return (
                      <Picker.Item key={index} label={location.location} value={location.id} />
                    );
                  })}
              </Picker>

              <Text style={styles.label}>Current Location</Text>
              <Picker
                style={styles.select}
                selectedValue={selectedCurrentLocation}
                onValueChange={(itemValue, itemIndex) => {
                  selectCurrentLocation(itemValue);
                }}
              >
                <Picker.Item label={''} value={0} />
                {Locations.length > 0 &&
                  Locations.map((location, index) => {
                    return (
                      <Picker.Item key={index} label={location.location} value={location.id} />
                    );
                  })}
              </Picker>
            </View>
          </View>
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={AddProductButtonHandler}>
            <Text style={styles.addButton}>{'Update'}</Text>
          </TouchableOpacity>
        </ModalFooter>
      </BasicModalContainer>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </Modal>
  );
};

const styles = productModalstyles;

export default BulkUpdateLocationModal;
