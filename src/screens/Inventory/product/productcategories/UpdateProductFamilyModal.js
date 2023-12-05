import React, {useState, useEffect, useRef} from 'react';
import { Text, TextInput, TouchableOpacity, Modal, View, ActivityIndicator, Platform, Image } from 'react-native';

import { updateProductFamily } from '../../../../api/Product';
import BasicModalContainer from '../../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../../common/constants/Message';
import { useAlertModal } from '../../../../common/hooks/UseAlertModal';

import { productCategoryModalstyles } from './styles/ProductCategoryModalStyle';
import { API_URL } from '../../../../common/constants/AppConstants';

const UpdateProductFamilyModal = ({ isModalVisible, item, setUpdateProductFamilyTrigger, closeModal }) => {

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(API_URL + item.img_url);

  const [_productFamily, setProductFamily] = useState(item.family);

  const inputRef = useRef(null); 

  useEffect(() => {
    if(Platform.web){
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

  const handleImageSelection = (event) => {
    const file = Platform.OS == 'web' ? event.target.files[0] : event.nativeEvent.target.files[0];

    const imagePreviewUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreviewUrl(imagePreviewUrl); 
  };

  const handleUpdateButtonClick = () => {
    if (!_productFamily.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    } 

    setIsLoading(true);

    const formData = new FormData();
    formData.append('id', item.id);
    formData.append('family', _productFamily);
    formData.append('category_id', item.category_id);
    formData.append('img', selectedImage);
    formData.append('description', 'dd');

    updateProductFamily(formData, (jsonRes, status, error)=>{
      switch(status){
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateProductFamilyTrigger(true);
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
    if (!_productFamily.trim()) {
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
      onShow={()=>{
        setValidMessage(''); 
        setProductFamily(item.family); 
        inputRef.current = null;
        setImagePreviewUrl(API_URL + item.img_url);
        setSelectedImage(null);
      }}
    >
      <BasicModalContainer>
        <ModalHeader label={"Product Family"} closeModal={closeModal} />
        <ModalBody>
          <TextInput
            style={styles.input}
            onChangeText={setProductFamily}
            value={_productFamily}
            placeholder="Product Family"
            placeholderTextColor="#ccc"
            onSubmitEditing={handleUpdateButtonClick}
            onBlur={checkInput}
          />
          {(ValidMessage.trim() != '') && <Text style={styles.message}>{ValidMessage}</Text>}
          <View style={styles.imagePicker}>
            <TouchableOpacity style={styles.imageUpload} onPress={() => inputRef.current.click()}>
              {imagePreviewUrl ? (
                <Image source={{ uri: imagePreviewUrl }} style={styles.previewImage} />
              ) : (
                <View style={styles.imageBox}>
                  <Text style={styles.boxText}>Click to choose an image</Text>
                </View>
              )}
            </TouchableOpacity>
            <input
              type="file" 
              ref={inputRef} 
              style={styles.fileInput} 
              onChange={handleImageSelection} 
            />
          </View>
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={handleUpdateButtonClick}>
            <Text style={styles.addButton}>Update</Text>
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

const styles = productCategoryModalstyles;

export default UpdateProductFamilyModal;
