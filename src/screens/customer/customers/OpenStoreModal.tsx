import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks';

import { customerModalstyles } from './styles/CustomerModalStyle';
import { getTagsData } from '../../../api/Settings';
import { getBrandsData } from '../../../api/Price';

const OpenStoreModal = ({
  isModalVisible,
  customer,
  closeModal,
}) => {

  const { showAlert } = useAlertModal();
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('access-token');
      const userId = await AsyncStorage.getItem('userId');
      setToken(storedToken);
    };
    if (isModalVisible) {
      getBrandsData((jsonRes, status)=>{
        setBrands(jsonRes);
      });
      fetchToken();
    }
  }, [isModalVisible]);

  const loadTagData = (callback) => {
    getTagsData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          callback(jsonRes);
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

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isModalVisible}
    >
      <BasicModalContainer>
        <ModalHeader label={'Login Store'} closeModal={closeModal} />
        <ModalBody>
          <View style={{width:200}}>
            {brands.length>0 && brands.map((brand)=>(
              <View key={brand.id} style={{flexDirection:'row', alignItems:'center', marginVertical:10}}>
                <a href={'https://'+brand?.storedetail?.store_url + '?t='+ token + '&id='+customer?.id + '&mode=1' + '&userId=' + userId} style={{fontFamily:'Segoe UI'}} target='_blank'>{brand.brand}</a>
              </View>
            ))}
          </View>
        </ModalBody>
      </BasicModalContainer>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </Modal>
  );
};

const styles = customerModalstyles;

export default OpenStoreModal;
