import React, {useState, useEffect, useRef} from 'react';
import { Text, TextInput, TouchableOpacity, Modal, View, ActivityIndicator, Platform,  Picker } from 'react-native';

import { createProductLine, updateProductLine, getProductCategoriesData, getProductFamiliesData } from '../../../../api/Product';
import { getPriceGroupsData } from '../../../../api/Price';
import BasicModalContainer from '../../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../../common/constants/Message';
import { useAlertModal } from '../../../../common/hooks/UseAlertModal';

import { productLineModalstyles } from './styles/ProductLineModalStyle';

const AddProductLineModal = ({ isModalVisible, Line, setUpdateProductLineTrigger, closeModal }) => {

  const isUpdate = Line ? true : false;

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  
  const [categories, setCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [PriceGroups, setPriceGroups] = useState([]);

  const [selectedCategory, selectCategory] = useState({});
  const [selectedFamily, selectFamily] = useState({});
  const [LineTxt, setLineTxt] = useState('');
  const [SizeTxt, setSizeTxt] = useState('');
  const [SuitabilityTxt, setSuitabilityTxt] = useState('');
  const [QuantityTxt, setQuantityTxt] = useState('');
  const [HoldbackTxt, setHoldbackTxt] = useState('');
  const [ShortCodeTxt, setShortCodeTxt] = useState('');
  const [selectedPriceGroup, selectPriceGroup] = useState({});

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

  useEffect(()=>{
    console.log('aaa');
    getProductCategoriesData((jsonRes, status, error) => {
      switch(status){
        case 200:
          setCategories(jsonRes);
          if(jsonRes.length> 0){
            selectCategory(jsonRes[0])
          }
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    })
  }, [isModalVisible])

  useEffect(()=>{
    console.log('bbb');
    if(selectedCategory.id){
      getProductFamiliesData(selectedCategory.id, (jsonRes, status, error) => {
        switch(status){
          case 200:
            setFamilies(jsonRes);
            if(jsonRes.length> 0){
              selectFamily(jsonRes[0])
            }
            break;
          case 500:
            showAlert('error', msgStr('serverError'));
            break;
          default:
            if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
            else showAlert('error', msgStr('unknownError'));
            break;
        }
      })
    }
  }, [selectedCategory])

  useEffect(()=>{
    getPriceGroupsData((jsonRes, status, error) => {
      switch(status){
        case 200:
          setPriceGroups(jsonRes);
          if(jsonRes.length> 0){
            selectPriceGroup(jsonRes[0])
          }
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    })
  }, [isModalVisible])

  const AddLineButtonHandler = () => {
    if (!LineTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    } 
    
    setIsLoading(true);
    
    const payload  = {
      line: LineTxt,
      category_id : selectedCategory.id,
      family_id : selectedFamily.id,
      size : SizeTxt,
      suitability : SuitabilityTxt,
      holdback : HoldbackTxt,
      shortcode : ShortCodeTxt,
      price_group_id : selectedPriceGroup.id,
    }

    const handleResponse = (jsonRes, status) => {
      switch(status){
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateProductLineTrigger(true);
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
    };
    
    if (isUpdate) {
      payload.id = Line.id
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
      onShow={()=>{
        setValidMessage('');
        if(Line && categories){
          const initalCategory = categories.find(category => {return category.id == Line.category_id});
          if(initalCategory) selectCategory(initalCategory);
        }else selectCategory('');

        if(Line && families){
          const initalFamily = families.find(family => {return family.id == Line.family_id});
          if(initalFamily) selectFamily(initalFamily);
        }else selectFamily('');

        setLineTxt(Line?Line.line:'');
        setSizeTxt(Line?Line.size:'');
        setSuitabilityTxt(Line?Line.suitability:'');
        setQuantityTxt('');
        setHoldbackTxt(Line?Line.holdback:'');
        setShortCodeTxt(Line?Line.shortcode:'');

        if(Line && PriceGroups){
          const initalGroup = PriceGroups.find(priceGroup => {return priceGroup.id == Line.price_group_id});
          if(initalGroup) selectPriceGroup(initalGroup);
        }else selectPriceGroup('');
      }}
    >
      <BasicModalContainer>
        <ModalHeader label={"Product Line"} closeModal={closeModal} />
        <ModalBody>
          <Text style={styles.label}>Category</Text>
          <Picker
            style={styles.select}
            selectedValue={selectedCategory.id}
            onValueChange={(itemValue, itemIndex) =>
              {
                selectCategory(categories[itemIndex]);
              }}>
            {categories.length>0 && (
              categories.map((category, index) => {
                return <Picker.Item key={index} label={category.category} value={category.id} />
              })
            )}
          </Picker>

          <Text style={styles.label}>Family</Text>
          <Picker
            style={styles.select}
            selectedValue={selectedFamily.id}
            onValueChange={(itemValue, itemIndex) =>
              {
                selectFamily(families[itemIndex]);
              }}>
            {families.length>0 && (
              families.map((family, index) => {
                return <Picker.Item key={index} label={family.family} value={family.id} />
              })
            )}
          </Picker>
          
          <Text style={styles.label}>Line</Text>
          <TextInput style={styles.input} placeholder="Line" value={LineTxt} onChangeText={setLineTxt} placeholderTextColor="#ccc" onBlur={checkInput}/>
          {(ValidMessage.trim() != '') && <Text style={styles.message}>{ValidMessage}</Text>}
          <Text style={styles.label}>Size</Text>
          <TextInput style={styles.input} placeholder="Size" value={SizeTxt} onChangeText={setSizeTxt} placeholderTextColor="#ccc"/>
          <Text style={styles.label}>Suitability</Text>
          <TextInput style={styles.input} placeholder="Suitability" value={SuitabilityTxt} onChangeText={setSuitabilityTxt} placeholderTextColor="#ccc"/>
          <Text style={styles.label}>Quantity</Text>
          <TextInput style={[styles.input, styles.inputDisable]} placeholder="Quantity" value={QuantityTxt} placeholderTextColor="#ccc" editable={false}/>
          <Text style={styles.label}>Holdback Percentage</Text>
          <TextInput style={styles.input} placeholder="Holdback Percentage" value={HoldbackTxt} onChangeText={setHoldbackTxt} placeholderTextColor="#ccc"/>
          <Text style={styles.label}>Short Code / Name Stem</Text>
          <TextInput style={styles.input} placeholder="Short Code / Name Stem" value={ShortCodeTxt} onChangeText={setShortCodeTxt} placeholderTextColor="#ccc"/>

          <Text style={styles.label}>Price Group</Text>
          <Picker
            style={styles.select}
            selectedValue={selectedPriceGroup.id}
            onValueChange={(itemValue, itemIndex) =>
              {
                selectPriceGroup(PriceGroups[itemIndex]);
              }}>
            {PriceGroups.length>0 && (
              PriceGroups.map((item, index) => {
                return <Picker.Item key={index} label={item.price_group} value={item.id} />
              })
            )}
          </Picker>

        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={AddLineButtonHandler}>
            <Text style={styles.addButton}>{isUpdate?"Update":"Add"}</Text>
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

const styles = productLineModalstyles;

export default AddProductLineModal;
