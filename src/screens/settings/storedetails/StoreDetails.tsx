import React, { useEffect, useRef, useState} from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Dimensions, Image, Platform, ActivityIndicator, Linking } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Editor } from 'primereact/editor';
import { FontAwesome5 } from '@expo/vector-icons';

import { getLanguagesData, getCountriesData, getCurrenciesData, getTimezonesData, getDateformatsData, getTimeformatsData, updateStoreDetail, getStoreDetail, } from '../../../api/Settings';
import { msgStr } from '../../../common/constants/Message';
import { API_URL } from '../../../common/constants/AppConstants';
import { TextMediumLargeSize, TextdefaultSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import BasicLayout from '../../../common/components/CustomLayout/BasicLayout';

import { StoreDetailsStyle } from './styles/StoreDetailsStyle';
import NumericInput from '../../../common/components/formcomponents/NumericInput';

const StoreDetails = ({navigation, brandId, brandName, openStoreDetail}) => {
  
  const { showAlert } = useAlertModal();

  const [isLoading, setIsLoading] = useState(false); 

  const inputRef = useRef(null);
  const defaultInputRef = useRef(null);

  const [Languages, setLanguages] = useState([]);
  const [Countries, setCountries] = useState([]);
  const [Timezones, setTimezones] = useState([]);
  const [Currencies, setCurrencies] = useState([]);
  const [Dateformats, setDateformats] = useState([]);
  const [Timeformats, setTimeformats] = useState([]);
  const [StoreWavier, setStoreWavier] = useState('');

  const [weekdays, setWeekdays] = useState([
    { id: 7, weekday: 'Sunday' },
    { id: 1, weekday: 'Monday' },
    { id: 2, weekday: 'Tuesday' },
    { id: 3, weekday: 'Wednesday' },
    { id: 4, weekday: 'Thursday' },
    { id: 5, weekday: 'Friday' },
    { id: 6, weekday: 'Saturday' },
  ]);
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [Language, setLanguage] = useState(0);
  const [storeNameTxt, setStoreNameTxt] = useState('');
  const [storeURLTxt, setStoreURLTxt] = useState('');
  const [AddressLine1Txt, setAddressLine1Txt] = useState('');
  const [AddressLine2Txt, setAddressLine2Txt] = useState('');
  const [CityTxt, setCityTxt] = useState('');
  const [StateTxt, setStateTxt] = useState('');
  const [PostalCodeTxt, setPostalCodeTxt] = useState('');
  const [ShopLatitudeTxt, setShopLatitudeTxt] = useState(0);
  const [ShopLongitudeTxt, setShopLongitudeTxt] = useState(0);
  const [phoneNumberTxt, setPhoneNumberTxt] = useState('');
  const [SalesTaxTxt, setSalesTaxTxt] = useState(0);
  
  const [PrimaryLanguage, setPrimaryLanguage] = useState(0);
  const [Country, setCountry] = useState(0);
  const [Timezone, setTimezone] = useState(0);
  const [Currency, setCurrency] = useState(0);
  const [Dateformat, setDateformat] = useState(0);
  const [Timeformat, setTimeformat] = useState(0);
  const [WeekStart, setWeekStart] = useState(0);

  useEffect(() => {
    getLanguagesData((jsonRes, status, error) => {
      if( status == 200 ){
        setLanguages(jsonRes);
        if(jsonRes[0]) {
          setLanguage(jsonRes[0].id);
        }else setLanguage(0);
      }
    })
    getCountriesData((jsonRes, status, error) => {
      if( status == 200 ){
        setCountries(jsonRes);
        if(jsonRes[0]){
          setCountry(jsonRes[0].id);
        }else setCountry(0);
      }
    })
    getTimezonesData((jsonRes, status, error) => {
      if( status == 200 ){
        setTimezones(jsonRes);
        if(jsonRes[0]) {
          setTimezone(jsonRes[0].id);
        }else setTimezone(0);
      }
    })
    getCurrenciesData((jsonRes, status, error) => {
      if( status == 200 ){
        setCurrencies(jsonRes);
        if(jsonRes[0]){
          setCurrency(jsonRes[0].id);
        }else setCurrency(0);
      }
    })
    getDateformatsData((jsonRes, status, error) => {
      if( status == 200 ){
        setDateformats(jsonRes);
        if(jsonRes[0]) {
          setDateformat(jsonRes[0].id);
        }else setDateformat(0);
      }
    })
    getTimeformatsData((jsonRes, status, error) => {
      if( status == 200 ){
        setTimeformats(jsonRes);
        if(jsonRes[0]) {
          setTimeformat(jsonRes[0].id);
        }else setTimeformat(0);
      }
    })

    setTimeout(() => {
      loadDetails();
    }, 100);
    // defaultInputRef.current && defaultInputRef.current.focus();
  }, [])

  const loadDetails = () => {
    getStoreDetail(brandId, (jsonRes, status, error)=>{
      if(jsonRes){
        if(jsonRes.store_name) setStoreNameTxt(jsonRes.store_name);
        if(jsonRes.store_url) setStoreURLTxt(jsonRes.store_url);
        if(jsonRes.language_id) setLanguage(jsonRes.language_id);
        if(jsonRes.logo_url) setImagePreviewUrl(API_URL + jsonRes.logo_url);
        if(jsonRes.address_line1) setAddressLine1Txt(jsonRes.address_line1);
        if(jsonRes.address_line2) setAddressLine2Txt(jsonRes.address_line2);
        if(jsonRes.city) setCityTxt(jsonRes.city);
        if(jsonRes.state) setStateTxt(jsonRes.state);
        if(jsonRes.postal_code) setPostalCodeTxt(jsonRes.postal_code);
        if(jsonRes.latitude) setShopLatitudeTxt(jsonRes.latitude);
        if(jsonRes.longitutde) setShopLongitudeTxt(jsonRes.longitutde);
        if(jsonRes.phone_number) setPhoneNumberTxt(jsonRes.phone_number);
        if(jsonRes.country_id) setCountry(jsonRes.country_id);
        if(jsonRes.primary_language_id) setPrimaryLanguage(jsonRes.primary_language_id);
        if(jsonRes.timezone_id) setTimezone(jsonRes.timezone_id);
        if(jsonRes.currency_id) setCurrency(jsonRes.currency_id);
        if(jsonRes.date_format) setDateformat(jsonRes.date_format);
        if(jsonRes.time_format) setTimeformat(jsonRes.time_format);
        if(jsonRes.week_start_day) setWeekStart(jsonRes.week_start_day);
        if(jsonRes.sales_tax) setSalesTaxTxt(jsonRes.sales_tax);
        if(jsonRes.store_wavier) setStoreWavier(jsonRes.store_wavier);
      }
    });
  };

  const handleImageSelection = (event) => {
    const file = Platform.OS == 'web' ? event.target.files[0] : event.nativeEvent.target.files[0];

    const imagePreviewUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreviewUrl(imagePreviewUrl); 
  };

  const SaveForm = () => {
   
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('brand_id', brandId);
    formData.append('store_name', storeNameTxt);
    formData.append('store_url', storeURLTxt);
    formData.append('language_id', Language.toString());
    if(selectedImage) formData.append('img', selectedImage);
    formData.append('address_line1', AddressLine1Txt);
    formData.append('address_line2', AddressLine2Txt);
    formData.append('city', CityTxt);
    formData.append('state', StateTxt);
    formData.append('postal_code', PostalCodeTxt);
    formData.append('latitude', ShopLatitudeTxt.toString());
    formData.append('longitutde', ShopLongitudeTxt.toString());
    formData.append('phone_number', phoneNumberTxt);
    formData.append('country_id', Country.toString());
    formData.append('primary_language_id', PrimaryLanguage.toString());
    formData.append('timezone_id', Timezone.toString());
    formData.append('currency_id', Currency.toString());
    formData.append('date_format', Dateformat.toString());
    formData.append('time_format', Timeformat.toString());
    formData.append('week_start_day', WeekStart.toString());
    formData.append('sales_tax', SalesTaxTxt.toString());
    formData.append('store_wavier', StoreWavier);

    const handleResponse = (jsonRes, status) => {
      switch(status){
        case 200:
        case 201:
          showAlert('success', jsonRes.message);
          break;
        case 409:
          // setValidMessage(jsonRes.error);
          break;
        default:
          if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
      setIsLoading(false);
    };

    updateStoreDetail(formData, (jsonRes, status) => {
      handleResponse(jsonRes, status);
    });
  };

  const openStoreLink = () => {  
    if(storeURLTxt && storeURLTxt.trim()){
      let urlToOpen = storeURLTxt.toLowerCase();
      if (!urlToOpen.startsWith('http://') && !urlToOpen.startsWith('https://')) {
        urlToOpen = 'http://' + urlToOpen;
      }
      Linking.openURL(urlToOpen);
    }
  }

  return (
    <BasicLayout
      navigation = {navigation}
      goBack={()=>{
        openStoreDetail(null)
      }}
      screenName={brandName}
    >
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        <View style={{width: '60%', minWidth:500, marginVertical: 30, padding: 36, backgroundColor:'white', borderRadius:8}}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{fontSize:TextMediumLargeSize, fontWeight:'bold'}}>Store Details</Text> 
            <TouchableOpacity onPress={SaveForm}>
              <Text style={styles.addButton}>{"Update"}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Language</Text> 
          <Picker
            style={styles.select}
            selectedValue={Language}
            onValueChange={setLanguage}>
            {Languages.length>0 && (
              Languages.map((language, index) => {
                return <Picker.Item style={styles.selectOption} key={index} label={language.language} value={language.id} />
              })
            )}
          </Picker>
          <Text style={styles.label}>Store Name</Text>
          <TextInput style={styles.input} placeholder="Shop Name" value={storeNameTxt} onChangeText={setStoreNameTxt} placeholderTextColor="#ccc" ref={defaultInputRef} />
          <View>
            <Text style={styles.label}>Store URL</Text>
            <TextInput style={styles.input} placeholder="Shop URL" value={storeURLTxt} onChangeText={setStoreURLTxt} placeholderTextColor="#ccc" ref={defaultInputRef} />
            <TouchableOpacity style={{position:'absolute', top:'47%', right:10}} onPress={openStoreLink}>
              <FontAwesome5 name="link" size={TextdefaultSize} color="#000" />
            </TouchableOpacity>
          </View>

          {Platform.OS == 'web' && (
            <>
            <Text style={styles.label}>Store Logo</Text>
            <View style={styles.imagePicker}>
              <TouchableOpacity style={styles.imageUpload} onPress={() => inputRef.current.click()}>
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
            </>
          )}

          <View style={styles.inputGroup}>
            <Text style={[styles.label, styles.inputGroupLabel]}>Store Location</Text>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Address line 1</Text>
                <TextInput style={styles.input} placeholder="Address line 1" value={AddressLine1Txt} onChangeText={setAddressLine1Txt} placeholderTextColor="#ccc"/>
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Address line 2</Text>
                <TextInput style={styles.input} placeholder="Address line 2" value={AddressLine2Txt} onChangeText={setAddressLine2Txt} placeholderTextColor="#ccc"/>
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>City</Text>
                <TextInput style={styles.input} placeholder="City" value={CityTxt} onChangeText={setCityTxt} placeholderTextColor="#ccc"/>
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>State</Text>
                <TextInput style={styles.input} placeholder="State" value={StateTxt} onChangeText={setStateTxt} placeholderTextColor="#ccc"/>
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Postal code</Text>
                <TextInput style={styles.input} placeholder="Postal code" value={PostalCodeTxt} onChangeText={setPostalCodeTxt} placeholderTextColor="#ccc"/>
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Shop latitude</Text>
                <NumericInput placeholder="Shop latitude" value={ShopLatitudeTxt} onChangeText={setShopLatitudeTxt} validMinNumber={-180} validMaxNumber={180}/>
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Shop longitude</Text>
                <NumericInput placeholder="Shop longitude" value={ShopLongitudeTxt} onChangeText={setShopLongitudeTxt} validMinNumber={-180} validMaxNumber={180}/>
              </View>
            </View>
          </View>
          <Text style={styles.label}>Phone number</Text>
          <TextInput style={styles.input} placeholder="Phone number" value={phoneNumberTxt} onChangeText={setPhoneNumberTxt} placeholderTextColor="#ccc" />

          <View style={styles.inputGroup}>
            <Text style={[styles.label, styles.inputGroupLabel]}>Store Locale</Text>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Country</Text>
                <Picker style={styles.select} selectedValue={Country} onValueChange={setCountry}>
                  {Countries.length>0 && ( Countries.map((country, index) => {
                    return <Picker.Item style={styles.selectOption} key={index} label={country.country} value={country.id} />
                  }))}
                </Picker>
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Shop primary language</Text>
                <Picker style={styles.select} selectedValue={PrimaryLanguage} onValueChange={setPrimaryLanguage}>
                  {Languages.length>0 && ( Languages.map((language, index) => {
                    return <Picker.Item style={styles.selectOption} key={index} label={language.language} value={language.id} />
                  }))}
                </Picker>
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Timezone</Text>
                <Picker style={styles.select} selectedValue={Timezone} onValueChange={setTimezone}>
                  {Timezones.length>0 && ( Timezones.map((timezone, index) => {
                    return <Picker.Item style={styles.selectOption} key={index} label={timezone.timezone} value={timezone.id} />
                  }))}
                </Picker>
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Currency</Text>
                <Picker style={styles.select} selectedValue={Currency} onValueChange={setCurrency}>
                  {Currencies.length>0 && ( Currencies.map((currency, index) => {
                    return <Picker.Item style={styles.selectOption} key={index} label={currency.currency} value={currency.id} />
                  }))}
                </Picker>
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Date format</Text>
                <Picker style={styles.select} selectedValue={Dateformat} onValueChange={setDateformat}>
                  {Dateformats.length>0 && ( Dateformats.map((dateformat, index) => {
                    return <Picker.Item style={styles.selectOption} key={index} label={dateformat.dateformat} value={dateformat.id} />
                  }))}
                </Picker>
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Time format</Text>
                <Picker style={styles.select} selectedValue={Timeformat} onValueChange={setTimeformat}>
                  {Timeformats.length>0 && ( Timeformats.map((timeformat, index) => {
                    return <Picker.Item style={styles.selectOption} key={index} label={timeformat.timeformat} value={timeformat.id} />
                  }))}
                </Picker>
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Week start day</Text>
                <Picker style={styles.select} selectedValue={WeekStart} onValueChange={setWeekStart}>
                  {weekdays.length>0 && ( weekdays.map((weekday, index) => {
                    return <Picker.Item style={styles.selectOption} key={index} label={weekday.weekday} value={weekday.id} />
                  }))}
                </Picker>
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
              </View>
            </View>
          </View>
          <Text style={styles.label}>Sales tax</Text>
          <NumericInput placeholder="Sales tax" value={SalesTaxTxt} onChangeText={setSalesTaxTxt} validMinNumber={0} validMaxNumber={100}/>

          {Platform.OS == 'web' && (
            <>
              <Text style={[styles.label, {marginBottom:4}]}>Store Wavier</Text>
              <Editor value={StoreWavier} onTextChange={(e) => setStoreWavier(e.htmlValue)} style={{height: 185, marginBottom: '10px',}} />
            </>
          )}

          <View style={{alignItems:'flex-end'}}>
            <TouchableOpacity onPress={SaveForm}>
              <Text style={[styles.addButton, {marginBottom:8, marginTop:16}]}>{"Update"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </BasicLayout>
  );
};

const styles = StoreDetailsStyle;

export default StoreDetails;