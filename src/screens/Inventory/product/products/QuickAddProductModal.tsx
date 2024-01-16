import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import {
  getProductCategoriesData,
  getProductFamiliesData,
  getProductLinesData,
  QuickAddProduct,
} from '../../../../api/Product';
import { getPriceGroupsData } from '../../../../api/Price';
import BasicModalContainer from '../../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../../common/constants/Message';
import { useAlertModal } from '../../../../common/hooks/UseAlertModal';

import { productModalstyles } from './styles/ProductModalStyle';
import NumericInput from '../../../../common/components/formcomponents/NumericInput';

const QuickAddProductModal = ({
  isModalVisible,
  Product,
  setUpdateProductsTrigger,
  closeModal,
}) => {
  const isUpdate = Product ? true : false;

  const [StartInitalizing, setStartInitalizing] = useState(false);
  const [CategoryChanged, setCategoryChanged] = useState(false);

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [lines, setLines] = useState([]);
  const [PriceGroups, setPriceGroups] = useState([]);
  const StatusArr = [
    { id: 1, status: 'Ordered' },
    { id: 2, status: 'Ready' },
    { id: 3, status: 'Checked out' },
    { id: 4, status: 'Broken' },
    { id: 5, status: 'Sold' },
    { id: 6, status: 'Transferred' },
  ];

  const [selectedCategory, selectCategory] = useState({});
  const [selectedFamily, selectFamily] = useState({});
  const [selectedLine, selectLine] = useState({});
  const [ProductTxt, setProductTxt] = useState('');
  const [SizeTxt, setSizeTxt] = useState('');
  const [DescriptionTxt, setDescriptionTxt] = useState('');
  const [ItemIdTxt, setItemIdTxt] = useState('');
  const [BarcodeTxt, setBarcodeTxt] = useState('');
  const [QuantityTxt, setQuantityTxt] = useState('');
  const [SerialNumber, setSerialNumber] = useState('');
  const [HomeLocation, setHomeLocation] = useState('');
  const [CurrentLocation, setCurrentLocation] = useState('');
  const [selectedPriceGroup, selectPriceGroup] = useState({});
  const [selectedStatus, selectStatus] = useState({});

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
    if (StartInitalizing) {
      setValidMessage('');
      if (Product && categories) {
        const initalCategory = categories.find((category) => {
          return category.id == Product.category_id;
        });
        if (initalCategory) selectCategory(initalCategory);
      } else if (categories.length > 0) {
        selectCategory(categories[0]);
      }

      // if(Product && families){
      //   const initalFamily = families.find(family => {return family.id == Product.family_id});
      //   if(initalFamily) selectFamily(initalFamily);
      // }else if(families.length[0]){
      //   selectFamily(families[0]);
      // }

      setProductTxt(Product ? Product.product : '');
      setSizeTxt(Product ? Product.size : '');
      setDescriptionTxt(Product ? Product.description : '');
      setItemIdTxt(Product ? Product.item_id : '');
      setBarcodeTxt(Product ? Product.barcode : '');
      setQuantityTxt(Product ? Product.quantity : '');
      setSerialNumber(Product ? Product.serial_number : '');
      setHomeLocation(Product ? Product.home_location : '');
      setCurrentLocation(Product ? Product.current_location : '');

      // if(Product && PriceGroups){
      //   const initalGroup = PriceGroups.find(priceGroup => {return priceGroup.id == Product.price_group_id});
      //   if(initalGroup) selectPriceGroup(initalGroup);
      // }else if(PriceGroups.length>0){
      //   selectPriceGroup(PriceGroups[0]);
      // }

      if (Product && StatusArr) {
        const initalStatus = StatusArr.find((status) => {
          return status.id == Product.status;
        });
        if (initalStatus) selectStatus(initalStatus);
      }

      setIsLoading(false);
    }
  }, [StartInitalizing]);

  useEffect(() => {
    if (CategoryChanged)
      if (selectedCategory.id) {
        loadProductFamiliesData(selectedCategory.id, (jsonRes) => {
          setFamilies(jsonRes);
          if (jsonRes.length > 0) selectFamily(jsonRes[0]);
          else {
            selectFamily({});
          }
        });
      } else {
        setLines([]);
        selectLine({});
      }
  }, [selectedCategory]);

  useEffect(() => {
    if (CategoryChanged)
      if (selectedFamily.id) {
        loadProductLinesData(selectedFamily.id, (jsonRes) => {
          setLines(jsonRes);
          if (jsonRes.length > 0) selectLine(jsonRes[0]);
          else {
            selectLine({});
          }
        });
      } else {
        setLines([]);
        selectLine({});
      }
  }, [selectedFamily]);

  useEffect(() => {
    if (isModalVisible) {
      loadPriceGroupsData(() => {
        loadProductCategoriesData((categories) => {
          let categoryId = null;
          if (Product) categoryId = Product.category_id;
          else categoryId = categories[0] ? categories[0].id : null;
          loadProductFamiliesData(categoryId, (families) => {
            let familyId = null;
            if (Product) familyId = Product.family_id;
            else familyId = families[0] ? families[0].id : null;
            loadProductLinesData(familyId, (lines) => {
              if (categories.length) setCategories(categories);
              else setCategories([]);
              if (families.length) setFamilies(families);
              else setFamilies([]);
              if (lines.length) setLines(lines);
              else setLines([]);
              setStartInitalizing(true);
            });
          });
        });
      });
    }
  }, [isModalVisible]);

  const loadProductCategoriesData = (callback) => {
    getProductCategoriesData((jsonRes, status, error) => {
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

  const loadProductFamiliesData = (categoryId, callback) => {
    getProductFamiliesData(categoryId, (jsonRes, status, error) => {
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

  const loadPriceGroupsData = (callback) => {
    getPriceGroupsData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setPriceGroups(jsonRes);
          callback();
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

  const loadProductLinesData = (familyId, callback) => {
    getProductLinesData(familyId, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          callback(jsonRes);
          // setLines(jsonRes);
          // if(jsonRes.length> 0){
          //   if(!isLoading) selectLine(jsonRes[0])
          // }
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

  const AddProductButtonHandler = () => {
    if (!SizeTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    }

    setIsLoading(true);

    const payload = {
      product: selectedLine.line + ' ' + SizeTxt + ' ' + selectedCategory.category,
      category_id: selectedCategory.id,
      family_id: selectedFamily.id,
      line_id: selectedLine.id,
      line: selectedLine.line,
      size: SizeTxt,
      description: DescriptionTxt,
      item_id: ItemIdTxt,
      barcode: BarcodeTxt,
      quantity: 1,
      rowcounts: QuantityTxt,
      serial_number: SerialNumber,
      home_location: HomeLocation,
      current_location: CurrentLocation,
      price_group_id: selectedPriceGroup.id,
      status: selectedStatus.id,
    };
    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateProductsTrigger(true);
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
    };

    console.log(selectedCategory);
    // return;
    // if (isUpdate) {
    //   payload.id = Product.id
    //   updateProduct(payload, (jsonRes, status) => {
    //     handleResponse(jsonRes, status);
    //   });
    // } else {
    QuickAddProduct(payload, (jsonRes, status) => {
      handleResponse(jsonRes, status);
    });
    // }
  };

  const checkInput = () => {
    if (!SizeTxt.trim()) {
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
        setStartInitalizing(false);
        setCategoryChanged(false);
      }}
    >
      <BasicModalContainer>
        <ModalHeader label={'Quick Add'} closeModal={closeModal} />
        <ModalBody>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.label}>Category</Text>
              <Picker
                style={styles.select}
                selectedValue={selectedCategory.id}
                onValueChange={(itemValue, itemIndex) => {
                  selectCategory(categories[itemIndex]);
                  setCategoryChanged(true);
                }}
              >
                {categories.length > 0 &&
                  categories.map((category, index) => {
                    return (
                      <Picker.Item key={index} label={category.category} value={category.id} />
                    );
                  })}
              </Picker>

              <Text style={styles.label}>Family</Text>
              <Picker
                style={styles.select}
                selectedValue={selectedFamily.id}
                onValueChange={(itemValue, itemIndex) => {
                  selectFamily(families[itemIndex]);
                  setCategoryChanged(true);
                }}
              >
                {families.length > 0 &&
                  families.map((family, index) => {
                    return <Picker.Item key={index} label={family.family} value={family.id} />;
                  })}
              </Picker>

              <Text style={styles.label}>Line</Text>
              <Picker
                style={styles.select}
                selectedValue={selectedLine.id}
                onValueChange={(itemValue, itemIndex) => {
                  selectLine(lines[itemIndex]);
                }}
              >
                {lines.length > 0 &&
                  lines.map((line, index) => {
                    return (
                      <Picker.Item
                        key={index}
                        label={line.line + ' ' + line.size}
                        value={line.id}
                      />
                    );
                  })}
              </Picker>

              {/* <Text style={styles.label}>Product</Text>
              <TextInput style={styles.input} placeholder="Product" value={ProductTxt} onChangeText={setProductTxt} placeholderTextColor="#ccc" onBlur={checkInput}/>
              {(ValidMessage.trim() != '') && <Text style={styles.message}>{ValidMessage}</Text>} */}
              {/* <Text style={styles.label}>Size</Text>
              <TextInput style={styles.input} placeholder="Size" value={SizeTxt} onChangeText={setSizeTxt} onBlur={checkInput} placeholderTextColor="#ccc"/> */}
              {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>}

              <Text style={styles.label}>Price Group</Text>
              <Picker
                style={styles.select}
                selectedValue={selectedPriceGroup.id}
                onValueChange={(itemValue, itemIndex) => {
                  selectPriceGroup(PriceGroups[itemIndex]);
                }}
              >
                {PriceGroups.length > 0 &&
                  PriceGroups.map((group, index) => {
                    return <Picker.Item key={index} label={group.price_group} value={group.id} />;
                  })}
              </Picker>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={[styles.input]}
                placeholder="Quantity"
                value={QuantityTxt}
                onChangeText={setQuantityTxt}
                placeholderTextColor="#ccc"
              />
            </View>
          </View>
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={AddProductButtonHandler}>
            <Text style={styles.addButton}>{isUpdate ? 'Update' : 'Add'}</Text>
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

export default QuickAddProductModal;
