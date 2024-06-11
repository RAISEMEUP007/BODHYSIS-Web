import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper';
import Checkbox from 'expo-checkbox';

import { createExtra, updateExtra } from '../../../api/Settings';
import { BasicModalContainer, ModalHeader, ModalBody, ModalFooter, commonModalStyle } from '../../../common/components/basicmodal';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks';

import { API_URL } from '../../../common/constants/AppConstants';
import LabeledTextInput from '../../../common/components/bohform/LabeledTextInput';
import { Switch } from 'react-native-gesture-handler';
import NumericInput from '../../../common/components/formcomponents/NumericInput';
import { getBrandsData, getPriceGroupsData } from '../../../api/Price';

interface FormValues {
  level: number;
  name: string;
  description: string;
  status: number;
  option: number;
  fixed_price: number;
  price_group_id: number | null;
  img_url: string | null;
  is_visible_online: boolean;
  is_default_selected: boolean;
  is_online_mandatory: boolean;
  is_apply_tax: boolean;
  is_apply_discounts: boolean;
  selectedFile: File | null;
}

const AddExtraModal = ({
  isModalVisible,
  Extra,
  setUpdateExtraTrigger,
  closeModal,
}) => {
  const isUpdate = Extra ? true : false;
  const inputRef = useRef(null);

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formValues, setFormValues] = useState<FormValues>({
    level: 0,
    name: '',
    description: '',
    status: 0,
    option: 0,
    fixed_price: 0,
    price_group_id: null,
    img_url: null,
    is_visible_online: false,
    is_default_selected: false,
    is_online_mandatory: false,
    is_apply_tax: false,
    is_apply_discounts: false,
    selectedFile: null,
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');

  const levelArr = ['item', 'Reservation'];
  const optionArr = ['FREE', 'FIXED PRICE', 'PRICE GROUP'];
  const [priceGroups, setPriceGroups] = useState<Array<any>>([]);
  const [brands, setBrands] = useState([]);
  const [associatedBrandIds, setAssociatedBrandIds] = useState([]);

  const handleBrandSelection = (brandId) => {
    if (associatedBrandIds.includes(brandId)) {
      setAssociatedBrandIds(associatedBrandIds.filter((id) => id !== brandId));
    } else {
      setAssociatedBrandIds([...associatedBrandIds, brandId]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPriceGroupsData(() => {});
      if (response.ok) {
        const resData = await response.json();
        setPriceGroups(resData);
      }
      await getBrandsData((jsonRes)=>{
        setBrands(jsonRes);
      });
    }
  
    fetchData();
  }, []);


  useEffect(() => {
    if (isModalVisible) {
      if (Extra) {
        setFormValues({
          level: Extra.level || 0,
          name: Extra.name || '',
          description: Extra.description || '',
          status: Extra.status || 0,
          option: Extra.option || 0,
          fixed_price: Extra.fixed_price || 0,
          price_group_id: Extra.price_group_id || null,
          img_url: Extra.img_url || null,
          is_visible_online: Extra.is_visible_online || false,
          is_default_selected: Extra.is_default_selected || false,
          is_online_mandatory: Extra.is_online_mandatory || false,
          is_apply_tax: Extra.is_apply_tax || false,
          is_apply_discounts: Extra.is_apply_discounts || false,
          selectedFile: null,
        })
        setImagePreviewUrl(Extra.img_url ? API_URL + Extra.img_url : '');
        if(Extra.brand_ids) setAssociatedBrandIds(JSON.parse(Extra.brand_ids));
      } else {
        setFormValues({
          level: 0,
          name: '',
          description: '',
          status: 0,
          option: 0,
          fixed_price: 0,
          price_group_id: null,
          img_url: null,
          is_visible_online: false,
          is_default_selected: false,
          is_online_mandatory: false,
          is_apply_tax: false,
          is_apply_discounts: false,
          selectedFile: null,
        })
        setImagePreviewUrl('');
        setAssociatedBrandIds([]);
      }
    } else {
      setAssociatedBrandIds([]);
    }
  }, [isModalVisible]);

  const handleFileSelection = (event) => {
    const file = Platform.OS === 'web' ? event.target.files[0] : event.nativeEvent.target.files[0];
  
    const img_url = URL.createObjectURL(file);
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      selectedFile: file,
      img_url: null
    }));
    setImagePreviewUrl(img_url);
  };

  const changeFormValue = (name, value) => {
    setFormValues(prev => ({
      ...prev,
      [name]:value,
    }))
  }

  const AddButtonHandler = () => {
    if (!formValues.name.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    for(var i in formValues){
      if(formValues[i] != null && i == 'selectedFile') formData.append('img', formValues.selectedFile);
      else {
        formData.append(i, formValues[i]);
      }
    }
    formData.append('brand_ids', JSON.stringify(associatedBrandIds));

    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateExtraTrigger(true);
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
      formData.append('id', Extra.id);
      updateExtra(formData, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    } else {
      createExtra(formData, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    }
  };

  const closeModalhandler = () => {
    closeModal();
  };

  const checkInput = () => {
    if (!formValues.name.trim()) {
      setValidMessage(msgStr('emptyField'));
    } else {
      setValidMessage('');
    }
  };

  return isModalVisible ? (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <BasicModalContainer>
        <ModalHeader
          label={'Extra'}
          closeModal={() => {
            closeModalhandler();
          }}
        />
        <ModalBody>
          <View style={{flexDirection:'row'}}>
            <View style={{width:400, marginRight: 24}}>
              <Text style={styles.label}>Level</Text>
              <Picker
                style={styles.select}
                selectedValue={formValues.level}
                onValueChange={(val)=>changeFormValue('level', val)}
              >
                {levelArr.length > 0 &&
                  levelArr.map((levelItem, index) => {
                    return <Picker.Item key={index} label={levelItem} value={index} />;
                  })}
              </Picker>
              <LabeledTextInput
                label='Name'
                placeholder="Name"
                value={formValues.name}
                onChangeText={(val)=>changeFormValue('name', val)}
                placeholderTextColor="#ccc"
                onBlur={checkInput}
              />
              {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>}
              <LabeledTextInput
                label='Description'
                placeholder="Description"
                value={formValues.description}
                multiline={true}
                numberOfLines={4}
                inputStyle={{height:160}}
                onChangeText={(val)=>changeFormValue('description', val)}
                placeholderTextColor="#ccc"
                onBlur={checkInput}
              />
              <Text style={[styles.label, {color:'#000000', marginTop:10, marginBottom:2}]}>Pricing</Text>
              <View style={{flexDirection:'row'}}>
                {optionArr.map((optionItem, index)=>{
                  return(
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight:10 }}>
                      <RadioButton
                        value={index.toString()}
                        status={formValues.option == index ? 'checked' : 'unchecked'}
                        color='#0099ff'
                        onPress={()=>changeFormValue('option', index)}
                      />
                      <Text>{optionItem}</Text>
                    </View>
                  );
                })}
              </View>
              {formValues.option == 1 && (
                <NumericInput
                  validMinNumber={0}
                  style={[styles.input, {marginBottom:0}]}
                  placeholder="Fixed price"
                  value={formValues.fixed_price.toString()}
                  onChangeText={(val)=>changeFormValue('fixed_price', val)}
                  placeholderTextColor="#ccc"
                  onBlur={checkInput}
                />
              )}
              
              {formValues.option == 2 && (
                <Picker
                  style={[styles.select,  {marginBottom:0}]}
                  selectedValue={formValues.level}
                  onValueChange={(val)=>changeFormValue('price_group_id', val)}
                >
                  {priceGroups.length > 0 &&
                    priceGroups.map((groupItem, index) => {
                      return <Picker.Item key={index} label={groupItem.price_group} value={groupItem.id} />;
                    })}
                </Picker>
              )}
            </View>
            <View style={{width:400}}>
              {Platform.OS == 'web' && (
                <View style={styles.imagePicker}>
                  <TouchableOpacity style={styles.imageUpload} onPress={() => inputRef.current && inputRef.current.click()}>
                    {imagePreviewUrl ? (
                      <Image source={{ uri: imagePreviewUrl }} style={styles.previewImage} />
                    ) : (
                      <View style={{}}>
                        <Text style={styles.boxText}>Click to choose an image</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <input
                    type="file"
                    ref={inputRef}
                    style={styles.fileInput}
                    onChange={handleFileSelection}
                  />
                </View>
              )}
              <Text style={[styles.label, {color:'#000000', marginTop:8}]}>Online</Text>
              <View style={{flexDirection: 'row', marginTop:8}}>
                <Switch
                  trackColor={{ false: '#6c757d', true: '#2e96e1' }}
                  thumbColor={formValues.is_visible_online ? '#ffc107' : '#f8f9fa'}
                  ios_backgroundColor="#343a40"
                  onValueChange={(val)=>changeFormValue('is_visible_online', val)}
                  value={formValues.is_visible_online}
                />
                <Text style={[styles.label, {marginLeft:20}]}>Visible online</Text>
              </View>
              <View style={{flexDirection: 'row', marginTop:8}}>
                <Switch
                  trackColor={{ false: '#6c757d', true: '#2e96e1' }}
                  thumbColor={formValues.is_default_selected ? '#ffc107' : '#f8f9fa'}
                  ios_backgroundColor="#343a40"
                  onValueChange={(val)=>changeFormValue('is_default_selected', val)}
                  value={formValues.is_default_selected}
                />
                <Text style={[styles.label, {marginLeft:20}]}>Default selected</Text>
              </View>
              <View style={{flexDirection: 'row', marginTop:8}}>
                <Switch
                  trackColor={{ false: '#6c757d', true: '#2e96e1' }}
                  thumbColor={formValues.is_online_mandatory ? '#ffc107' : '#f8f9fa'}
                  ios_backgroundColor="#343a40"
                  onValueChange={(val)=>changeFormValue('is_online_mandatory', val)}
                  value={formValues.is_online_mandatory}
                />
                <Text style={[styles.label, {marginLeft:20}]}>Online mandatory</Text>
              </View>
              <Text style={[styles.label, {color:'#000000', marginTop:16}]}>Other</Text>
              <View style={{flexDirection: 'row', marginTop:8}}>
                <Switch
                  trackColor={{ false: '#6c757d', true: '#2e96e1' }}
                  thumbColor={formValues.is_apply_tax ? '#ffc107' : '#f8f9fa'}
                  ios_backgroundColor="#343a40"
                  onValueChange={(val)=>changeFormValue('is_apply_tax', val)}
                  value={formValues.is_apply_tax}
                />
                <Text style={[styles.label, {marginLeft:20}]}>Apply Tax</Text>
              </View>
              <View style={{flexDirection: 'row', marginTop:8, marginBottom:6}}>
                <Switch
                  trackColor={{ false: '#6c757d', true: '#2e96e1' }}
                  thumbColor={formValues.is_apply_discounts ? '#ffc107' : '#f8f9fa'}
                  ios_backgroundColor="#343a40"
                  onValueChange={(val)=>changeFormValue('is_apply_discounts', val)}
                  value={formValues.is_apply_discounts}
                />
                <Text style={[styles.label, {marginLeft:20}]}>Apply Discounts</Text>
              </View>
            </View>
            <View style={{marginRight:20, marginLeft:40}}>
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
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={AddButtonHandler}>
              <Text style={styles.addButton}>{isUpdate ? 'Update' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
        </ModalFooter>
      </BasicModalContainer>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  ) : null;
};

const styles = commonModalStyle;

export default AddExtraModal;
