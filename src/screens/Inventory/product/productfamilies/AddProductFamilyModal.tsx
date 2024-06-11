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
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { Editor } from 'primereact/editor';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';

import {
  createProductFamily,
  updateProductFamily,
  getProductCategoriesData,
} from '../../../../api/Product';
import { getBrandsData } from '../../../../api/Price';
import { getPriceGroupsData } from '../../../../api/Price';
import BasicModalContainer from '../../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../../common/components/basicmodal/ModalFooter';
import { API_URL } from '../../../../common/constants/AppConstants';
import { msgStr } from '../../../../common/constants/Message';
import { useAlertModal } from '../../../../common/hooks';

import { productFamilyModalstyles } from './styles/ProductFamilyModalStyle';

const AddProductFamilyModal = ({
  isModalVisible,
  family,
  setUpdateProductFamilyTrigger,
  closeModal,
}) => {
  const isUpdate = family ? true : false;

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [callInit, setCallInit] = useState(false);

  const [categories, setCategories] = useState([]);
  const [PriceGroups, setPriceGroups] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [familyTxt, setFamilyTxt] = useState('');
  const [displayNameTxt, setDisplayNameTxt] = useState('');
  const [summaryTxt, setSummaryTxt] = useState('');
  const [notesTxt, setNotesTxt] = useState('');
  const [selectedCategory, selectCategory] = useState<any>({});
  const [selectedPriceGroup, selectPriceGroup] = useState({});

  const [brands, setBrands] = useState([]);
  const [associatedBrandIds, setAssociatedBrandIds] = useState([]);

  const inputRef = useRef(null);
  const defaultInputRef = useRef(null);

  const richText = useRef();

  const [descHTML, setDescHTML] = useState('');
  const [showDescError, setShowDescError] = useState(false);

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

  const richTextHandle = (descriptionText) => {
    if (descriptionText) {
      setShowDescError(false);
      setDescHTML(descriptionText);
    } else {
      setShowDescError(true);
      setDescHTML('');
    }
  };

  const submitContentHandle = () => {
    const replaceHTML = descHTML.replace(/<(.|\n)*?>/g, '').trim();
    const replaceWhiteSpace = replaceHTML.replace(/&nbsp;/g, '').trim();

    if (replaceWhiteSpace.length <= 0) {
      setShowDescError(true);
    } else {
      // send data to your server!
    }
  };


  useEffect(() => {
    if (isModalVisible) {
      defaultInputRef.current && defaultInputRef.current.focus();
    }
    setAssociatedBrandIds([]);
  }, [isModalVisible]);

  useEffect(() => {
    if (callInit) {
      setValidMessage('');
      if (family && categories) {
        const initalCategory = categories.find((category) => {
          return category.id == family.category_id;
        });
        if (initalCategory) selectCategory(initalCategory);
      } else if (categories.length > 0) {
        selectCategory(categories[0]);
      }

      console.log(family);
      setFamilyTxt(family ? family.family : '');
      setDisplayNameTxt(family ? family.display_name : '');
      setSummaryTxt(family ? family.summary : '');
      setNotesTxt(family ? family.notes : '');
      setImagePreviewUrl(family ? API_URL + family.img_url : '');
      setSelectedImage(null);
      inputRef.current = null;

      if (family && PriceGroups) {
        const initalGroup = PriceGroups.find((priceGroup) => {
          return priceGroup.id == family.price_group_id;
        });
        if (initalGroup) selectPriceGroup(initalGroup);
      } else if (PriceGroups.length > 0) {
        selectPriceGroup(PriceGroups[0]);
      }
      setIsLoading(false);
    }
  }, [callInit]);

  useEffect(() => {
    if (isModalVisible) {
      loadProductCategoriesData(() => {
        loadPriceGroupsData(() => {
          setCallInit(true);
        });
      });
      if(family?.brand_ids) setAssociatedBrandIds(JSON.parse(family.brand_ids));
      else setAssociatedBrandIds([]); 
    }else setAssociatedBrandIds([]);
  }, [isModalVisible]);

  const loadProductCategoriesData = (callback) => {
    getProductCategoriesData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setCategories(jsonRes);
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

  const handleImageSelection = (event) => {
    const file = Platform.OS == 'web' ? event.target.files[0] : event.nativeEvent.target.files[0];

    const imagePreviewUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreviewUrl(imagePreviewUrl);
  };

  const handleImageUpload = () => {
    const options:any = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, (response:any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setImagePreviewUrl(imageUri);
      }
    });
  };

  const AddFamilyButtonHandler = () => {
    if (!familyTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    }

    setIsLoading(true);

    console.log((displayNameTxt || familyTxt));

    const formData = new FormData();
    formData.append('family', familyTxt);
    formData.append('display_name', (displayNameTxt || familyTxt));
    formData.append('category_id', selectedCategory.id);
    if (selectedImage) formData.append('img', selectedImage);
    formData.append('summary', summaryTxt);
    formData.append('notes', notesTxt);
    formData.append('brand_ids', JSON.stringify(associatedBrandIds));
    // formData.append('price_group_id', selectedPriceGroup.id);

    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateProductFamilyTrigger(true);
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
      formData.append('id', family.id);
      updateProductFamily(formData, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    } else {
      createProductFamily(formData, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    }
  };

  const checkInput = () => {
    if (!familyTxt.trim()) {
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
        setCallInit(false);
      }}
      onRequestClose={() => {
        setCallInit(false);
      }}
    >
      <BasicModalContainer>
        <ModalHeader label={'Product Family'} closeModal={closeModal} />
        <ModalBody>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ paddingRight: 20, width: 400 }}>
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
              <TextInput
                style={styles.input}
                placeholder="Family"
                value={familyTxt}
                onChangeText={setFamilyTxt}
                placeholderTextColor="#ccc"
                onBlur={checkInput}
                ref={defaultInputRef}
              />
              {ValidMessage.trim() != '' && <Text style={styles.message}>{ValidMessage}</Text>}
              <Text style={styles.label}>Display Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Dispaly Name"
                value={displayNameTxt}
                onChangeText={setDisplayNameTxt}
                placeholderTextColor="#ccc"
                // onBlur={checkInput}
              />
              {Platform.OS == 'web' && (
                <View style={styles.imagePicker}>
                  <TouchableOpacity
                    style={styles.imageUpload}
                    onPress={() => inputRef.current.click()}
                  >
                    {imagePreviewUrl ? (
                      <Image source={{ uri: imagePreviewUrl }} style={styles.previewImage} />
                    ) : (
                      <View>
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
              )}
              {Platform.OS != 'web' && (
                <>
                  <TouchableOpacity onPress={handleImageUpload}>
                    <Text>Upload Image</Text>
                  </TouchableOpacity>
                  {imagePreviewUrl && (
                    <Image source={{ uri: imagePreviewUrl }} style={{ width: 200, height: 200 }} />
                  )}
                </>
              )}

              {/* <Text style={styles.label}>Price Group</Text>
              <Picker
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
              </Picker> */}
            </View>
            <View style={{ paddingRight: 30, width: 700 }}>
              <Text style={styles.label}>Summary</Text>
              {/* <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Summary"
                placeholderTextColor="#ccc"
                multiline={true}
                numberOfLines={4}
                value={summaryTxt}
                onChangeText={setSummaryTxt}
              /> */}
              {(Platform.OS == 'android' || Platform.OS == 'ios') && (
                <SafeAreaView>
                  <View style={styles.richTextContainer}>
                    <RichEditor
                      ref={richText}
                      onChange={richTextHandle}
                      placeholder=""
                      style={styles.richTextEditorStyle}
                      initialHeight={250}
                    />
                    <RichToolbar
                      editor={richText}
                      selectedIconTint="#873c1e"
                      iconTint="#312921"
                      actions={[
                        actions.insertImage,
                        actions.setBold,
                        actions.setItalic,
                        actions.insertBulletsList,
                        actions.insertOrderedList,
                        actions.insertLink,
                        actions.setStrikethrough,
                        actions.setUnderline,
                      ]}
                      style={styles.richTextToolbarStyle}
                    />
                  </View>
                </SafeAreaView>
              )}
              {Platform.OS == 'web' && (
                <Editor
                  value={summaryTxt}
                  onTextChange={(e) => setSummaryTxt(e.htmlValue)}
                  style={{ height: 175, marginBottom: '10px' }}
                  onKeyDown={(event) => {
                    event.stopPropagation();
                  }}
                />
              )}

              <Text style={styles.label}>Notes</Text>
              {Platform.OS == 'web' && (
                <Editor
                  value={notesTxt}
                  onTextChange={(e) => setNotesTxt(e.htmlValue)}
                  style={{ height: 175, marginBottom: '10px' }}
                  onKeyDown={(event) => {
                    event.stopPropagation();
                  }}
                />
              )}
            </View>
            <View style={{marginRight:20}}>
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
          <TouchableOpacity onPress={AddFamilyButtonHandler}>
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

const styles = productFamilyModalstyles;

export default AddProductFamilyModal;
