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
import BasicModalContainer from '../../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../../common/constants/Message';
import { useAlertModal } from '../../../../common/hooks/UseAlertModal';

import { productModalstyles } from './styles/ProductModalStyle';
import { getLocationsData } from '../../../../api/Settings';
const QuickAddProductModal = ({
  isModalVisible,
  setUpdateProductsTrigger,
  closeModal,
}) => {

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [lines, setLines] = useState([]);
  const [Locations, setLocations] = useState([]);
  // const [PriceGroups, setPriceGroups] = useState([]);
  const StatusArr = [
    { id: 0, status: 'Ready' },
    { id: 1, status: 'Ordered' },
    { id: 2, status: 'Checked out' },
    // { id: 3, status: 'Checked in' },
    { id: 4, status: 'Broken' },
    { id: 5, status: 'Sold' },
    { id: 6, status: 'Transferred' },
  ];

  const [selectedCategory, selectCategory] = useState<{ [key: string]: any }>({});
  const [selectedFamily, selectFamily] = useState<{ [key: string]: any }>({});
  const [selectedLine, selectLine] = useState<{ [key: string]: any }>({});
  const [ProductTxt, setProductTxt] = useState('');
  // const [SizeTxt, setSizeTxt] = useState('');
  const [DescriptionTxt, setDescriptionTxt] = useState('');
  const [ItemIdTxt, setItemIdTxt] = useState('');
  const [BarcodeTxt, setBarcodeTxt] = useState('');
  const [QuantityTxt, setQuantityTxt] = useState('');
  const [SerialNumber, setSerialNumber] = useState('');
  const [HomeLocation, setHomeLocation] = useState('');
  const [CurrentLocation, setCurrentLocation] = useState('');
  // const [selectedPriceGroup, selectPriceGroup] = useState<{ [key: string]: any }>({});
  const [selectedStatus, selectStatus] = useState<{ [key: string]: any }>({});
  const [selectedHomeLocation, selectHomeLocation] = useState<any>({});
  const [selectedCurrentLocation, selectCurrentLocation] = useState<any>({});

  useEffect(() => {
    if (isModalVisible) {
      setQuantityTxt('');
      setDescriptionTxt('');
      selectStatus(StatusArr[0]);
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
        const response = await getProductCategoriesData();
        const categoriesData = await response.json();
        setCategories(categoriesData);

        if(categoriesData.length>0){
          selectCategory(categoriesData[0])
        }else selectCategory({});

        const response2 = await getLocationsData();
        const locationsData = await response2.json();
        setLocations(locationsData);

        if(locationsData.length>0){
          selectHomeLocation(locationsData[0])
          selectCurrentLocation(locationsData[0])
        }else{
          selectHomeLocation({});
          selectCurrentLocation({});
        } 
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
          selectFamily(familiesData[0])
        }else selectFamily({});
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [isModalVisible, selectedCategory]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const familyId = selectedFamily?.id??0;
        const response = await getProductLinesData(familyId);
        const linesData = await response.json();
        setLines(linesData);

        if(linesData.length>0){
          selectLine(linesData[0])
        }else selectLine({});
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [selectedCategory, selectedFamily]);

  const AddProductButtonHandler = () => {
    if (!QuantityTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    }

    setIsLoading(true);

    const payload = {
      product: selectedLine.line + ' ' + selectedLine?.line?.size??'' + ' ' + selectedCategory.category,
      category_id: selectedCategory.id,
      family_id: selectedFamily.id,
      line_id: selectedLine.id,
      line: selectedLine,
      // size: SizeTxt,
      description: DescriptionTxt,
      item_id: ItemIdTxt,
      barcode: BarcodeTxt,
      quantity: 1,
      rowcounts: QuantityTxt,
      serial_number: SerialNumber,
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

    QuickAddProduct(payload, (jsonRes, status) => {
      handleResponse(jsonRes, status);
    });
  };

  const checkInput = () => {
    if (!QuantityTxt.trim()) {
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
                  // setCategoryChanged(true);
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
                  // setCategoryChanged(true);
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
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={[styles.input]}
                placeholder="Quantity"
                value={QuantityTxt}
                onChangeText={setQuantityTxt}
                onBlur={checkInput}
                placeholderTextColor="#ccc"
              />
              {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>}
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
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input]}
                placeholder="Description"
                value={DescriptionTxt}
                multiline={true}
                onChangeText={setDescriptionTxt}
                placeholderTextColor="#ccc"
              />
            </View>
          </View>
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={AddProductButtonHandler}>
            <Text style={styles.addButton}>{'Add'}</Text>
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
