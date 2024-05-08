import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import {
  getProductCategoriesData,
  deleteProductCategory,
  getQuantitiesByCategory,
} from '../../../../api/Product';
import { msgStr } from '../../../../common/constants/Message';
import { API_URL } from '../../../../common/constants/AppConstants';
import { TextMediumSize } from '../../../../common/constants/Fonts';
import { useAlertModal } from '../../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../../common/hooks/UseConfirmModal';
import BasicLayout from '../../../../common/components/CustomLayout/BasicLayout';

import AddProductCategoryModal from './AddProductCategoryModal';
import UpdateProductCategoryModal from './UpdateProductCategoryModal';
import { CommonContainer } from '../../../../common/components/CustomLayout';
import { BOHButton, BOHToolbar } from '../../../../common/components/bohtoolbar';
import { BOHTBody, BOHTD, BOHTDIconBox, BOHTDImageBox, BOHTH, BOHTHead, BOHTR, BOHTable } from '../../../../common/components/bohtable';
import AssociatedBrandsModal from './AssociatedBrandsModal';

const ProductCategories = ({ navigation, openInventory }) => {

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateProductCategoryTrigger, setUpdateProductCategoryTrigger] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [isBrandsModalVisible, setBrandsModalVisible] = useState(false);

  const InitialWidths = [220, 80, 90, 50, 80, 50];

  const openAddProductCategoryModal = () => {
    setAddModalVisible(true);
  };
  const closeAddProductCategoryModal = () => {
    setAddModalVisible(false);
  };

  const editProductCategory = (item) => {
    setSelectedCategory(item);
    setUpdateModalVisible(true);
  };
  const closeUpdateProductCategoryModal = () => {
    setUpdateModalVisible(false);
  };
  
  const editAssociatedBrands = (item) => {
    setSelectedCategory(item);
    setBrandsModalVisible(true);
  };
  const closeBrandsCategoryModal = () => {
    setBrandsModalVisible(false);
  };
  
  useEffect(() => {
    if (updateProductCategoryTrigger == true) getTable();
  }, [updateProductCategoryTrigger]);

  const removeProductCategory = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deleteProductCategory(id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdateProductCategoryTrigger(true);
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
    getProductCategoriesData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateProductCategoryTrigger(false);
          setQuantities(jsonRes);
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

  const setQuantities = (tableData) => {
    getQuantitiesByCategory((jsonRes, status, error) => {
      switch (status) {
        case 200:
          if (jsonRes) {
            for (let i = 0; i < tableData.length; i++) {
              let id = tableData[i].id;
              if (jsonRes[id] !== undefined) {
                tableData[i].quantity = jsonRes[id];
              }
            }
          }
          setTableData(tableData);
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
          <BOHTR key={index}>
            <BOHTD width={InitialWidths[0]}>{item.category}</BOHTD>
            <BOHTD width={InitialWidths[1]} style={{textAlign:'right'}}>{item.quantity ? item.quantity : '0'}</BOHTD>
            <BOHTDImageBox width={InitialWidths[2]} imgURL={ API_URL + item.img_url }/>
            <BOHTDIconBox width={InitialWidths[3]}>
              <TouchableOpacity
                onPress={() => {
                  editProductCategory(item);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </BOHTDIconBox>
            {/* <BOHTDIconBox width={InitialWidths[4]}>
              <TouchableOpacity
                onPress={() => {
                  editAssociatedBrands(item);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="tags" color="black" />
              </TouchableOpacity>
            </BOHTDIconBox> */}
            <BOHTDIconBox width={InitialWidths[5]}>
              <TouchableOpacity
                onPress={() => {
                  removeProductCategory(item.id);
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
    return <>{rows}</>;
  };

  return (
    <BasicLayout
      navigation={navigation}
      goBack={() => {
        openInventory(null);
      }}
      screenName={'Product Categories'}
    >
      <CommonContainer>
        <BOHToolbar>
          <BOHButton
            label='Add'
            onPress={openAddProductCategoryModal}/>
        </BOHToolbar>
        <BOHTable>
          <BOHTHead>
            <BOHTR>
              <BOHTH width={InitialWidths[0]}>{'Category'}</BOHTH>
              <BOHTH width={InitialWidths[1]}>{'Quantity'}</BOHTH>
              <BOHTH width={InitialWidths[2]}>{'Image'}</BOHTH>
              <BOHTH width={InitialWidths[3]}>{'Edit'}</BOHTH>
              {/* <BOHTH width={InitialWidths[4]}>{'Brands'}</BOHTH> */}
              <BOHTH width={InitialWidths[5]}>{'DEL'}</BOHTH>
            </BOHTR>
          </BOHTHead>
          <BOHTBody>
            {renderTableData()}
          </BOHTBody>
        </BOHTable>

        <AddProductCategoryModal
          isModalVisible={isAddModalVisible}
          setUpdateProductCategoryTrigger={setUpdateProductCategoryTrigger}
          closeModal={closeAddProductCategoryModal}
        />
        
        {/* <AssociatedBrandsModal
          isModalVisible={isBrandsModalVisible}
          categoryId={selectedCategory?.id}
          closeModal={closeBrandsCategoryModal}
        /> */}

        {selectedCategory && (
          <UpdateProductCategoryModal
            isModalVisible={isUpdateModalVisible}
            item={selectedCategory}
            setUpdateProductCategoryTrigger={setUpdateProductCategoryTrigger}
            closeModal={closeUpdateProductCategoryModal}
          />
        )}
      </CommonContainer>
    </BasicLayout>
  );
};

export default ProductCategories;
