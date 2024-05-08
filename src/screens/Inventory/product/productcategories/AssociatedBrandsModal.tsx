import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, ActivityIndicator } from 'react-native';

import { updateProductCategory } from '../../../../api/Product';
import BasicModalContainer from '../../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../../common/components/basicmodal/ModalBody';
import { msgStr } from '../../../../common/constants/Message';
import { useAlertModal } from '../../../../common/hooks/UseAlertModal';

import { productCategoryModalstyles } from './styles/ProductCategoryModalStyle';
import { getTagsData } from '../../../../api/Settings';

const AssociatedBrandsModal = ({
  isModalVisible,
  categoryId,
  closeModal,
}) => {

  const { showAlert } = useAlertModal();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isModalVisible) {
      // loadTagData((jsonRes) => {
      //   setTags(jsonRes);
      //   if (item.tag_id) {
      //     const initalTag = jsonRes.find((Tag) => {
      //       return Tag.id == item.tag_id;
      //     });
      //     if (initalTag) selectTag(initalTag);
      //   } else if (jsonRes.length > 0) {
      //     selectTag(jsonRes[0]);
      //   }
      // });
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
        <ModalHeader label={'Product Category'} closeModal={closeModal} />
        <ModalBody>
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

const styles = productCategoryModalstyles;

export default AssociatedBrandsModal;
