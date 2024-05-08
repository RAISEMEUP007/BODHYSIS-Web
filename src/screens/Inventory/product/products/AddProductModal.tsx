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
  createProduct,
  updateProduct,
  getProductCategoriesData,
  getProductFamiliesData,
  getProductLinesData,
} from '../../../../api/Product';
import { getLocationsData } from '../../../../api/Settings';
import BasicModalContainer from '../../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../../common/constants/Message';
import { useAlertModal } from '../../../../common/hooks/UseAlertModal';

import { productModalstyles } from './styles/ProductModalStyle';

const AddProductModal = ({ isModalVisible, Product, setUpdateProductsTrigger, closeModal }) => {
  const isUpdate = Product ? true : false;

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [lines, setLines] = useState([]);
  const [Locations, setLocations] = useState([]);

  const StatusArr = [
    { id: 0, status: 'Ready' },
    { id: 1, status: 'Ordered' },
    { id: 2, status: 'Checked out' },
    // { id: 3, status: 'Checked in' },
    { id: 4, status: 'Broken' },
    { id: 5, status: 'Sold' },
    { id: 6, status: 'Transferred' },
  ];

  const [selectedCategory, selectCategory] = useState<any>({});
  const [selectedFamily, selectFamily] = useState<any>({});
  const [selectedLine, selectLine] = useState<any>({});
  const [SizeTxt, setSizeTxt] = useState('');
  const [ItemIdTxt, setItemIdTxt] = useState('');
  const [BarcodeTxt, setBarcodeTxt] = useState('');
  const [QuantityTxt, setQuantityTxt] = useState('');
  const [selectedHomeLocation, selectHomeLocation] = useState<any>({});
  const [selectedCurrentLocation, selectCurrentLocation] = useState<any>({});
  const [selectedStatus, selectStatus] = useState<any>({});

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
      setValidMessage('');
      if (Product && Product.category_id && categories) {
        const initalCategory = categories.find((category) => {
          return category.id == Product.category_id;
        });
        if (initalCategory) selectCategory(initalCategory);
      } else if (categories.length > 0) {
        selectCategory(categories[0]);
      }

      if (Product && Product.family_id && families) {
        const initalFamily = families.find((family) => {
          return family.id == Product.family_id;
        });
        if (initalFamily) selectFamily(initalFamily);
      } else if (families.length[0]) {
        selectFamily(families[0]);
      }

      if (Product && Product.line_id && lines.length > 0) {
        const initalLine = lines.find((line) => {
          return line.id == Product.line_id;
        });
        if (initalLine) selectLine(initalLine);
      } else if (lines.length[0]) {
        selectLine(lines[0]);
      }

      // setProductTxt(Product ? Product.product : '');
      setSizeTxt(Product ? Product.size : '');
      // setDescriptionTxt(Product ? Product.description : '');
      setItemIdTxt(Product ? Product.item_id : '');
      setBarcodeTxt(Product ? Product.barcode : '');
      setQuantityTxt(Product ? Product.quantity : '');
      // setSerialNumber(Product ? Product.serial_number : '');
      // setPriceGroupTxt(Product?.line?.price_group?.price_group??'');

      if (Product && Product.home_location && Locations) {
        const initalHomeLocation = Locations.find((location) => {
          return location.id == Product.home_location;
        });
        if (initalHomeLocation) selectHomeLocation(initalHomeLocation);
      } else if (Locations.length > 0) {
        selectHomeLocation(Locations[0]);
      }

      if (Product && Product.current_location && Locations) {
        const initalCurrentLocation = Locations.find((location) => {
          return location.id == Product.current_location;
        });
        if (initalCurrentLocation) selectCurrentLocation(initalCurrentLocation);
      } else if (Locations.length > 0) {
        selectCurrentLocation(Locations[0]);
      }

      if (Product && StatusArr) {
        const initalStatus = StatusArr.find((status) => {
          return status.id == Product.status;
        });
        console.log(initalStatus);
        if (initalStatus) selectStatus(initalStatus);
      }else selectStatus(StatusArr[0]);

      setIsLoading(false);
    }
  }, [isModalVisible]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProductCategoriesData();
        const categoriesData = await response.json();
        setCategories(categoriesData);

        const response2 = await getLocationsData();
        const locationsData = await response2.json();
        setLocations(locationsData);
      } catch (error) {
        console.log(error);
      }
    };
 
    fetchData();
 }, [isModalVisible]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryId = selectedCategory?.id??0;
        const response = await getProductFamiliesData(categoryId);
        const familiesData = await response.json();
        setFamilies(familiesData);

        if(familiesData.length>0){
          if(Product && Product.family_id && familiesData.find(item=>item.id == Product.family_id)){
            selectFamily(familiesData.find(item=>item.id == Product.family_id));
          }else selectFamily(familiesData[0])
        }else selectFamily({});
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const familyId = selectedFamily?.id??0;
        const response = await getProductLinesData(familyId);
        const linesData = await response.json();
        setLines(linesData);

        if(linesData.length>0){
          if(Product && Product.line_id && linesData.find(item=>item.id == Product.line_id)){
            selectLine(linesData.find(item=>item.id == Product.line_id));
          }else selectLine(linesData[0])
        }else selectLine({});
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [selectedCategory, selectedFamily]);

  // useEffect(() => {
  //   setPriceGroupTxt(selectedLine?.price_group?.price_group??'');
  // }, [selectedCategory, selectedFamily, selectedLine]);

  const AddProductButtonHandler = () => {
    if (!BarcodeTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    }

    setIsLoading(true);

    const payload : any = {
      // product: ProductTxt,
      category_id: selectedCategory.id,
      family_id: selectedFamily.id,
      line_id: selectedLine.id,
      size: SizeTxt,
      // description: DescriptionTxt,
      item_id: ItemIdTxt,
      barcode: BarcodeTxt,
      quantity: QuantityTxt,
      // serial_number: SerialNumber,
      home_location: selectedHomeLocation.id,
      current_location: selectedCurrentLocation.id,
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

    if (isUpdate) {
      payload.id = Product.id;
      updateProduct(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    } else {
      createProduct(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    }
  };

  const checkInput = () => {
    if (!BarcodeTxt.trim()) {
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
      }}
    >
      <BasicModalContainer>
        <ModalHeader label={(isUpdate?'Update':'Add')+' product'} closeModal={closeModal} />
        <ModalBody>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Category</Text>
              <Picker
                style={styles.select}
                selectedValue={selectedCategory.id}
                onValueChange={(itemValue, itemIndex) => {
                  selectCategory(categories[itemIndex]);
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
                }}
              >
                {families.length > 0 &&
                  families.map((family, index) => {
                    return <Picker.Item key={index} label={(family.family)} value={family.id} />;
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
              <TextInput
                style={styles.input}
                placeholder="Product"
                value={ProductTxt}
                onChangeText={setProductTxt}
                placeholderTextColor="#ccc"
                onBlur={checkInput}
              /> */}
              <Text style={styles.label}>Barcode</Text>
              <TextInput
                style={[styles.input]}
                placeholder="Barcode"
                value={BarcodeTxt}
                onChangeText={setBarcodeTxt}
                onBlur={checkInput}
                placeholderTextColor="#ccc"
              />
              {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>}
            {/* </View>
            <View style={{ flex: 1, paddingLeft: 10 }}> */}
              {/* <Text style={styles.label}>Serial Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Serial Number"
                value={SerialNumber}
                onChangeText={setSerialNumber}
                placeholderTextColor="#ccc"
              /> */}
              <Text style={styles.label}>Home Location</Text>
              <Picker
                style={styles.select}
                selectedValue={selectedHomeLocation.id}
                onValueChange={(itemValue, itemIndex) => {
                  selectHomeLocation(Locations[itemIndex]);
                }}
              >
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
                selectedValue={selectedCurrentLocation.id}
                onValueChange={(itemValue, itemIndex) => {
                  selectCurrentLocation(Locations[itemIndex]);
                }}
              >
                {Locations.length > 0 &&
                  Locations.map((location, index) => {
                    return (
                      <Picker.Item key={index} label={location.location} value={location.id} />
                    );
                  })}
              </Picker>
              <Text style={styles.label}>Status</Text>
              <Picker
                style={styles.select}
                selectedValue={selectedStatus.id}
                onValueChange={(itemValue, itemIndex) => {
                  selectStatus(StatusArr[itemIndex]);
                }}
              >
                {StatusArr.length > 0 &&
                  StatusArr.map((statusItem, index) => {
                    return (
                      <Picker.Item key={index} label={statusItem.status} value={statusItem.id} />
                    );
                  })}
              </Picker>
              {/* <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input]}
                placeholder="Description"
                value={DescriptionTxt}
                multiline={true}
                onChangeText={setDescriptionTxt}
                placeholderTextColor="#ccc"
              /> */}
              {/* <Text style={styles.label}>Price Group</Text>
              <Text style={[styles.input, {borderColor:'#666', color:'#666'}]}>{PriceGroupTxt}</Text> */}
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

export default AddProductModal;
