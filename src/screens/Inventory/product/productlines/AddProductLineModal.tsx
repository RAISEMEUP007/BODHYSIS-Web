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
import Checkbox from 'expo-checkbox';

import {
  createProductLine,
  updateProductLine,
  getProductCategoriesData,
  getProductFamiliesData,
} from '../../../../api/Product';
import { getBrandsData, getPriceGroupsData } from '../../../../api/Price';
import BasicModalContainer from '../../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../../common/constants/Message';
import { useAlertModal } from '../../../../common/hooks';

import NumericInput from '../../../../common/components/formcomponents/NumericInput';
import { commonModalStyle } from '../../../../common/components/basicmodal';

const AddProductLineModal = ({ isModalVisible, Line, setUpdateProductLineTrigger, closeModal }) => {
  const isUpdate = Line ? true : false;

  const [StartInitalizing, setStartInitalizing] = useState(false);
  const [CategoryChanged, setCategoryChanged] = useState(false);

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [PriceGroups, setPriceGroups] = useState([]);

  const [brands, setBrands] = useState([]);
  const [associatedBrandIds, setAssociatedBrandIds] = useState([]);

  const [selectedCategory, selectCategory] = useState<any>({});
  const [selectedFamily, selectFamily] = useState<any>({});
  const [LineTxt, setLineTxt] = useState('');
  const [SizeTxt, setSizeTxt] = useState('');
  const [SuitabilityTxt, setSuitabilityTxt] = useState('');
  const [QuantityTxt, setQuantityTxt] = useState('');
  const [HoldbackTxt, setHoldbackTxt] = useState('');
  const [ShortCodeTxt, setShortCodeTxt] = useState('');
  const [selectedPriceGroup, selectPriceGroup] = useState<any>({});

  const handleBrandSelection = (brandId) => {
    if (associatedBrandIds.includes(brandId)) {
      setAssociatedBrandIds(associatedBrandIds.filter((id) => id !== brandId));
    } else {
      setAssociatedBrandIds([...associatedBrandIds, brandId]);
    }
  };


  useEffect(()=>{
    getBrandsData((jsonRes)=>{
      setBrands(jsonRes);
    });
  }, []);

  useEffect(() => {
    if (StartInitalizing) {
      setValidMessage('');
      if (Line && categories) {
        const initalCategory = categories.find((category) => {
          return category.id == Line.category_id;
        });
        if (initalCategory) selectCategory(initalCategory);
      } else if (categories.length > 0) {
        selectCategory(categories[0]);
      }

      if (Line && families) {
        const initalFamily = families.find((family) => {
          return family.id == Line.family_id;
        });
        if (initalFamily) selectFamily(initalFamily);
      } else if (families.length[0]) {
        selectFamily(families[0]);
      }

      if (Line) {
        setLineTxt(Line ? Line.line : '');
        setSizeTxt(Line ? Line.size : '');
        setSuitabilityTxt(Line ? Line.suitability : '');
        setQuantityTxt(Line.quantity ? Line.quantity : '');
        setHoldbackTxt(Line ? Line.holdback : '');
        setShortCodeTxt(Line ? Line.shortcode : '');
      } else {
        setLineTxt('');
        setSizeTxt('');
        setSuitabilityTxt('');
        setQuantityTxt('');
        setHoldbackTxt('');
        setShortCodeTxt('');
      }

      if (Line && PriceGroups) {
        const initalGroup = PriceGroups.find((priceGroup) => {
          return priceGroup.id == Line.price_group_id;
        });
        if (initalGroup) selectPriceGroup(initalGroup);
      } else if (PriceGroups.length > 0) {
        selectPriceGroup(PriceGroups[0]);
      }
      setIsLoading(false);
    }
  }, [StartInitalizing]);

  useEffect(() => {
    if (CategoryChanged && selectedCategory.id) {
      loadProductFamiliesData(selectedCategory.id, (jsonRes) => {
        setFamilies(jsonRes);
        if (jsonRes.length > 0) selectFamily(jsonRes[0]);
      });
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (isModalVisible) {
      loadPriceGroupsData(() => {
        loadProductCategoriesData((categories) => {
          let categoryId = null;
          if (Line) categoryId = Line.category_id;
          else categoryId = categories[0] ? categories[0].id : null;
          loadProductFamiliesData(categoryId, (families) => {
            setCategories(categories);
            setFamilies(families);
            setStartInitalizing(true);
          });
        });
      });
      if(Line?.brand_ids) setAssociatedBrandIds(JSON.parse(Line.brand_ids));
      else setAssociatedBrandIds([]); 
    }else setAssociatedBrandIds([]);
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

  const AddLineButtonHandler = () => {
    if (!LineTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    }

    setIsLoading(true);

    const payload:any = {
      line: LineTxt,
      category_id: selectedCategory.id,
      family_id: selectedFamily.id,
      size: SizeTxt,
      suitability: SuitabilityTxt,
      holdback: HoldbackTxt,
      shortcode: ShortCodeTxt,
      price_group_id: selectedPriceGroup.id,
      brand_ids: JSON.stringify(associatedBrandIds)
    };

    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateProductLineTrigger(true);
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
      payload.id = Line.id;
      updateProductLine(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    } else {
      createProductLine(payload, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    }
  };

  const checkInput = () => {
    if (!LineTxt.trim()) {
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
        <ModalHeader label={'Product Line'} closeModal={closeModal} />
        <ModalBody>
          <View style={{flexDirection:'row'}}>
            <View>
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
                    return <Picker.Item key={index} label={category.category} value={category.id} />;
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
              <TextInput
                style={styles.input}
                placeholder="Line"
                value={LineTxt}
                onChangeText={setLineTxt}
                placeholderTextColor="#ccc"
                onBlur={checkInput}
              />
              {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>}
              <Text style={styles.label}>Size</Text>
              <TextInput
                style={styles.input}
                placeholder="Size"
                value={SizeTxt}
                onChangeText={setSizeTxt}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>Suitability</Text>
              <TextInput
                style={styles.input}
                placeholder="Suitability"
                value={SuitabilityTxt}
                onChangeText={setSuitabilityTxt}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={[styles.input, styles.inputDisable]}
                placeholder="Quantity"
                placeholderTextColor="#ccc"
                editable={false}
              />
              <Text style={styles.label}>Holdback Percentage</Text>
              <NumericInput
                placeholder="Holdback Percentage"
                value={HoldbackTxt}
                onChangeText={setHoldbackTxt}
                validMinNumber={0}
                validMaxNumber={100}
              ></NumericInput>
              <Text style={styles.label}>Short Code / Name Stem</Text>
              <TextInput
                style={styles.input}
                placeholder="Short Code / Name Stem"
                value={ShortCodeTxt}
                onChangeText={setShortCodeTxt}
                placeholderTextColor="#ccc"
              />

              <Text style={styles.label}>Price Group</Text>
              <Picker
                // enabled={false}
                style={styles.select}
                selectedValue={selectedPriceGroup.id}
                onValueChange={(itemValue, itemIndex) => {
                  selectPriceGroup(PriceGroups[itemIndex]);
                }}
              >
                {PriceGroups.length > 0 &&
                  PriceGroups.map((item, index) => {
                    return <Picker.Item key={index} label={item.price_group} value={item.id} />;
                  })}
              </Picker>
              {/* <TextInput
                style={styles.input}
                editable={false}
                placeholder=""
                value={selectedPriceGroup.price_group || ''}
                placeholderTextColor="#ccc"
              /> */}
            </View>
            <View style={{marginLeft: 40, marginRight:40}}>
              <Text style={{marginBottom:8, fontSize:20}}>{"Associated Brands"}</Text>
              {brands.length>0 && brands.map((brand)=>(
                <View key={brand.id} style={{flexDirection:'row', alignItems:'center', marginVertical:10, marginLeft:10}}>
                  <Checkbox value={associatedBrandIds.includes(brand.id)} onValueChange={() => handleBrandSelection(brand.id)} />
                  <Text style={{marginLeft:10}}>{brand.brand}</Text>
                </View>
              ))}
            </View>
          </View>
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={AddLineButtonHandler}>
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

const styles = commonModalStyle;

export default AddProductLineModal;
