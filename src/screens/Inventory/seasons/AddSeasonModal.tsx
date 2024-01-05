import React, {useState, useEffect} from 'react';
import { Text, TextInput, TouchableOpacity, Modal, View, ActivityIndicator, Platform } from 'react-native';

import { saveSeasonCell } from '../../../api/Price';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';

import { priceModalstyles } from './styles/SeasonModalStyle';

const AddSeasonModal = ({ isModalVisible, setUpdateSeasonTrigger, closeModal }) => {

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const [_season, setSeason] = useState('');

  useEffect(() => {
    if(Platform.OS === 'web'){
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

  const handleAddButtonClick = () => {
    if (!_season.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    } 

    setIsLoading(true);

    saveSeasonCell(-1, 'season', _season, (jsonRes, status, error)=>{
      switch(status){
        case 200:
          showAlert('success', jsonRes.message);
          setUpdateSeasonTrigger(true);
          closeModal();
          break;
        case 409:
          setValidMessage(jsonRes.error);
          break;
        default:
          if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          closeModal();
          break;
      }
      setIsLoading(false);
    });
  };

  const checkInput = () => {
    if (!_season.trim()) {
      setValidMessage(msgStr('emptyField'));
    } else {
      setValidMessage('');
    }
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isModalVisible}
      onShow={()=>{setValidMessage(''); setSeason('')}}
    >
      <BasicModalContainer>
        <ModalHeader label={"Season"} closeModal={closeModal} />
        <ModalBody>
          <TextInput
            style={styles.input}
            onChangeText={setSeason}
            value={_season}
            placeholder="season"
            placeholderTextColor="#ccc"
            onSubmitEditing={handleAddButtonClick}
            onBlur={checkInput}
          />
          {(ValidMessage.trim() != '') && <Text style={styles.message}>{ValidMessage}</Text>}
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={handleAddButtonClick}>
            <Text style={styles.addButton}>Add</Text>
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

const styles = priceModalstyles;

export default AddSeasonModal;
