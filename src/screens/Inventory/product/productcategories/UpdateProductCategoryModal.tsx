import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  View,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';

import { updateProductCategory } from '../../../../api/Product';
import BasicModalContainer from '../../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../../common/constants/Message';
import { useAlertModal } from '../../../../common/hooks/UseAlertModal';

import { productCategoryModalstyles } from './styles/ProductCategoryModalStyle';
import { API_URL } from '../../../../common/constants/AppConstants';
import { getTagsData } from '../../../../api/Settings';
import { Picker } from 'react-native-web';

const UpdateProductCategoryModal = ({
  isModalVisible,
  item,
  setUpdateProductCategoryTrigger,
  closeModal,
}) => {
  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(API_URL + item.img_url);

  const [_productCategory, setProductCategory] = useState(item.category);
  const [Tags, setTags] = useState([]);
  const [selectedTag, selectTag] = useState({});

  const inputRef = useRef(null);

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
      loadTagData((jsonRes) => {
        setTags(jsonRes);
        if (item.tag_id) {
          const initalTag = jsonRes.find((Tag) => {
            return Tag.id == item.tag_id;
          });
          if (initalTag) selectTag(initalTag);
        } else if (jsonRes.length > 0) {
          selectTag(jsonRes[0]);
        }
      });
    }
  }, [isModalVisible]);

  const handleImageSelection = (event) => {
    const file = Platform.OS == 'web' ? event.target.files[0] : event.nativeEvent.target.files[0];

    const imagePreviewUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreviewUrl(imagePreviewUrl);
  };

  const handleUpdateButtonClick = () => {
    if (!_productCategory.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('id', item.id);
    formData.append('category', _productCategory);
    formData.append('img', selectedImage);
    formData.append('description', 'dd');
    if (selectedTag && selectedTag.id) formData.append('tag_id', selectedTag.id);

    updateProductCategory(formData, (jsonRes, status, error) => {
      switch (status) {
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateProductCategoryTrigger(true);
          closeModal();
          break;
        case 409:
          setValidMessage(jsonRes.error);
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          closeModal();
          break;
      }
      setIsLoading(false);
    });
  };

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

  const checkInput = () => {
    if (!_productCategory.trim()) {
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
      onShow={() => {
        setValidMessage('');
        setProductCategory(item.category);
        inputRef.current = null;
        setImagePreviewUrl(API_URL + item.img_url);
        setSelectedImage(null);
      }}
    >
      <BasicModalContainer>
        <ModalHeader label={'Product Category'} closeModal={closeModal} />
        <ModalBody>
          <TextInput
            style={styles.input}
            onChangeText={setProductCategory}
            value={_productCategory}
            placeholder="Product Category"
            placeholderTextColor="#ccc"
            onSubmitEditing={handleUpdateButtonClick}
            onBlur={checkInput}
          />
          {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>}
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
          <Picker
            style={styles.select}
            selectedValue={selectedTag.id}
            onValueChange={(itemValue, itemIndex) => {
              selectTag(Tags[itemIndex]);
            }}
          >
            {Tags &&
              Tags.length > 0 &&
              Tags.map((item, index) => {
                return <Picker.Item key={index} label={item.tag} value={item.id} />;
              })}
          </Picker>
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

export default UpdateProductCategoryModal;
