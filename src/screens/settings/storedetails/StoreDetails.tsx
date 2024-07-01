import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Editor } from 'primereact/editor';
import { FontAwesome5 } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';

import {
  getLanguagesData,
  getCountriesData,
  getCurrenciesData,
  getTimezonesData,
  getDateformatsData,
  getTimeformatsData,
  updateStoreDetail,
  getStoreDetail,
  getDocumentsData,
  getTaxcodesData,
} from '../../../api/Settings';
import { msgStr } from '../../../common/constants/Message';
import { API_URL } from '../../../common/constants/AppConstants';
import { TextMediumLargeSize, TextdefaultSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks';
import BasicLayout from '../../../common/components/CustomLayout/BasicLayout';

import { StoreDetailsStyle } from './styles/StoreDetailsStyle';
import NumericInput from '../../../common/components/formcomponents/NumericInput';
import WebView from 'react-native-webview';

const StoreDetails = ({ navigation, brandId, brandName, openStoreDetail }) => {
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
  const [Documents, setDocuments] = useState([]);

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
  const [PickupTime, setPickupTime] = useState('');
  const [CutOffTime, setCutOffTime] = useState('');
  const [DropOffTime, setDropOffTime] = useState('');
  const [WeekStart, setWeekStart] = useState(0);

  const [StoreWavier, setStoreWavier] = useState('');
  const [EmailConfirmation, setEmailConfirmation] = useState('');
  const [TextConfirmation, setTextConfirmation] = useState('');
  const [documentId, setDocumentId] = useState(0);
  const [isDocument, setIsDocument] = useState(0);
  const [selectedDocument, setSelectedDocument] = useState<any>({});

  const [taxCodes, setTaxCodes] = useState([]);
  const [selectedTaxCode, selectTaxCode] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await getLanguagesData((jsonRes, status, error) => {
      if (status == 200) {
        setLanguages(jsonRes);
        if (jsonRes[0]) {
          setLanguage(jsonRes[0].id);
        } else setLanguage(0);
      }
    });
    await getCountriesData((jsonRes, status, error) => {
      if (status == 200) {
        setCountries(jsonRes);
        if (jsonRes[0]) {
          setCountry(jsonRes[0].id);
        } else setCountry(0);
      }
    });
    await getTimezonesData((jsonRes, status, error) => {
      if (status == 200) {
        setTimezones(jsonRes);
        if (jsonRes[0]) {
          setTimezone(jsonRes[0].id);
        } else setTimezone(0);
      }
    });
    await getCurrenciesData((jsonRes, status, error) => {
      if (status == 200) {
        setCurrencies(jsonRes);
        if (jsonRes[0]) {
          setCurrency(jsonRes[0].id);
        } else setCurrency(0);
      }
    });
    await getDateformatsData((jsonRes, status, error) => {
      if (status == 200) {
        setDateformats(jsonRes);
        if (jsonRes[0]) {
          setDateformat(jsonRes[0].id);
        } else setDateformat(0);
      }
    });
    await getTimeformatsData((jsonRes, status, error) => {
      if (status == 200) {
        setTimeformats(jsonRes);
        if (jsonRes[0]) {
          setTimeformat(jsonRes[0].id);
        } else setTimeformat(0);
      }
    });
    await getDocumentsData((jsonRes, status, error) => {
      if (status == 200) {
        setDocuments(jsonRes);
        if (jsonRes[0]) {
          setDocumentId(jsonRes[0].id);
        } else setDocumentId(0);
      }
    });
    await getTaxcodesData((jsonRes, status, error) => {
      if (status == 200) {
        setTaxCodes(jsonRes);
        if (jsonRes[0]) {
          selectTaxCode(jsonRes[0].id);
        } else selectTaxCode(null);
      }else setTaxCodes([]);
    });
    await getStoreDetail(brandId, (jsonRes, status, error) => {
      if (status == 200 &&jsonRes) {
        if (jsonRes.store_name) setStoreNameTxt(jsonRes.store_name);
        if (jsonRes.store_url) setStoreURLTxt(jsonRes.store_url);
        if (jsonRes.language_id) setLanguage(jsonRes.language_id);
        if (jsonRes.logo_url) setImagePreviewUrl(API_URL + jsonRes.logo_url);
        if (jsonRes.address_line1) setAddressLine1Txt(jsonRes.address_line1);
        if (jsonRes.address_line2) setAddressLine2Txt(jsonRes.address_line2);
        if (jsonRes.city) setCityTxt(jsonRes.city);
        if (jsonRes.state) setStateTxt(jsonRes.state);
        if (jsonRes.postal_code) setPostalCodeTxt(jsonRes.postal_code);
        if (jsonRes.latitude) setShopLatitudeTxt(jsonRes.latitude);
        if (jsonRes.longitude) setShopLongitudeTxt(jsonRes.longitude);
        if (jsonRes.phone_number) setPhoneNumberTxt(jsonRes.phone_number);
        if (jsonRes.country_id) setCountry(jsonRes.country_id);
        if (jsonRes.primary_language_id) setPrimaryLanguage(jsonRes.primary_language_id);
        if (jsonRes.timezone_id) setTimezone(jsonRes.timezone_id);
        if (jsonRes.currency_id) setCurrency(jsonRes.currency_id);
        if (jsonRes.date_format) setDateformat(jsonRes.date_format);
        if (jsonRes.time_format) setTimeformat(jsonRes.time_format);
        if (jsonRes.week_start_day) setWeekStart(jsonRes.week_start_day);
        if (jsonRes.sales_tax) setSalesTaxTxt(jsonRes.sales_tax);
        if (jsonRes.store_wavier) setStoreWavier(jsonRes.store_wavier);
        if (jsonRes.email_confirmation) setEmailConfirmation(jsonRes.email_confirmation);
        if (jsonRes.text_confirmation) setTextConfirmation(jsonRes.text_confirmation);
        if (jsonRes.document_id) setDocumentId(jsonRes.document_id);
        if (jsonRes.is_document) setIsDocument(jsonRes.is_document);
        if (jsonRes.taxcode_id) selectTaxCode(jsonRes.taxcode_id);
        if (jsonRes.pickup_time) setPickupTime(jsonRes.pickup_time);
        if (jsonRes.cut_off_time) setCutOffTime(jsonRes.cut_off_time);
        if (jsonRes.dropoff_time) setDropOffTime(jsonRes.dropoff_time);
      }
    });
  };

  useEffect(() => {
    if (Documents.length > 0) {
      const result = Documents.find((document) => document.id === documentId);
      if (result) {
        setSelectedDocument(result);
      }
    }
  }, [documentId]);

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
    if (selectedImage) formData.append('img', selectedImage);
    formData.append('address_line1', AddressLine1Txt);
    formData.append('address_line2', AddressLine2Txt);
    formData.append('city', CityTxt);
    formData.append('state', StateTxt);
    formData.append('postal_code', PostalCodeTxt);
    formData.append('latitude', ShopLatitudeTxt.toString());
    formData.append('longitude', ShopLongitudeTxt.toString());
    formData.append('phone_number', phoneNumberTxt);
    formData.append('country_id', Country.toString());
    formData.append('primary_language_id', PrimaryLanguage.toString());
    formData.append('timezone_id', Timezone.toString());
    formData.append('currency_id', Currency.toString());
    formData.append('date_format', Dateformat.toString());
    formData.append('time_format', Timeformat.toString());
    formData.append('week_start_day', WeekStart.toString());
    formData.append('cut_off_time', CutOffTime.toString());
    // formData.append('sales_tax', SalesTaxTxt.toString());
    formData.append('store_wavier', StoreWavier);
    formData.append('document_id', documentId.toString());
    formData.append('is_document', isDocument.toString());
    formData.append('taxcode_id', selectedTaxCode.toString());
    formData.append('pickup_time', PickupTime.toString());
    formData.append('dropoff_time', DropOffTime.toString());
    formData.append('email_confirmation', EmailConfirmation);
    formData.append('text_confirmation', TextConfirmation);

    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 200:
        case 201:
          showAlert('success', jsonRes.message);
          break;
        case 409:
          // setValidMessage(jsonRes.error);
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
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
    if (storeURLTxt && storeURLTxt.trim()) {
      let urlToOpen = storeURLTxt.toLowerCase();
      if (!urlToOpen.startsWith('http://') && !urlToOpen.startsWith('https://')) {
        urlToOpen = 'http://' + urlToOpen;
      }
      Linking.openURL(urlToOpen);
    }
  };

  return (
    <BasicLayout
      navigation={navigation}
      goBack={() => {
        openStoreDetail(null);
      }}
      screenName={brandName}
    >
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        <View
          style={{
            width: '60%',
            minWidth: 500,
            marginVertical: 30,
            padding: 36,
            backgroundColor: 'white',
            borderRadius: 8,
            borderWidth: 1,
            borderColor:'#b3b3b3',
            shadowColor:'#999',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowRadius: 8,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: TextMediumLargeSize, fontWeight: 'bold' }}>Store Details</Text>
            <TouchableOpacity onPress={SaveForm}>
              <Text style={styles.addButton}>{'Update'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Language</Text>
          <Picker style={styles.select} selectedValue={Language} onValueChange={setLanguage}>
            {Languages.length > 0 &&
              Languages.map((language, index) => {
                return (
                  <Picker.Item
                    style={styles.selectOption}
                    key={index}
                    label={language.language}
                    value={language.id}
                  />
                );
              })}
          </Picker>
          <Text style={styles.label}>Store Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Shop Name"
            value={storeNameTxt}
            onChangeText={setStoreNameTxt}
            placeholderTextColor="#ccc"
            ref={defaultInputRef}
          />
          <View>
            <Text style={styles.label}>Store URL</Text>
            <TextInput
              style={styles.input}
              placeholder="Shop URL"
              value={storeURLTxt}
              onChangeText={setStoreURLTxt}
              placeholderTextColor="#ccc"
              ref={defaultInputRef}
            />
            <TouchableOpacity
              style={{ position: 'absolute', top: '47%', right: 10 }}
              onPress={openStoreLink}
            >
              <FontAwesome5 name="link" size={TextdefaultSize} color="#000" />
            </TouchableOpacity>
          </View>

          {Platform.OS == 'web' && (
            <>
              <Text style={styles.label}>Store Logo</Text>
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
            </>
          )}

          <View style={styles.inputGroup}>
            <Text style={[styles.label, styles.inputGroupLabel]}>Store Location</Text>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Address line 1</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Address line 1"
                  value={AddressLine1Txt}
                  onChangeText={setAddressLine1Txt}
                  placeholderTextColor="#ccc"
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Address line 2</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Address line 2"
                  value={AddressLine2Txt}
                  onChangeText={setAddressLine2Txt}
                  placeholderTextColor="#ccc"
                />
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  value={CityTxt}
                  onChangeText={setCityTxt}
                  placeholderTextColor="#ccc"
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>State</Text>
                <TextInput
                  style={styles.input}
                  placeholder="State"
                  value={StateTxt}
                  onChangeText={setStateTxt}
                  placeholderTextColor="#ccc"
                />
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Postal code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Postal code"
                  value={PostalCodeTxt}
                  onChangeText={setPostalCodeTxt}
                  placeholderTextColor="#ccc"
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}></View>
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Shop latitude</Text>
                <NumericInput
                  placeholder="Shop latitude"
                  value={ShopLatitudeTxt}
                  onChangeText={setShopLatitudeTxt}
                  validMinNumber={-180}
                  validMaxNumber={180}
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Shop longitude</Text>
                <NumericInput
                  placeholder="Shop longitude"
                  value={ShopLongitudeTxt}
                  onChangeText={setShopLongitudeTxt}
                  validMinNumber={-180}
                  validMaxNumber={180}
                />
              </View>
            </View>
          </View>
          <Text style={styles.label}>Phone number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            value={phoneNumberTxt}
            onChangeText={setPhoneNumberTxt}
            placeholderTextColor="#ccc"
          />

          <View style={styles.inputGroup}>
            <Text style={[styles.label, styles.inputGroupLabel]}>Store Locale</Text>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Country</Text>
                <Picker style={styles.select} selectedValue={Country} onValueChange={setCountry}>
                  {Countries.length > 0 &&
                    Countries.map((country, index) => {
                      return (
                        <Picker.Item
                          style={styles.selectOption}
                          key={index}
                          label={country.country}
                          value={country.id}
                        />
                      );
                    })}
                </Picker>
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Shop primary language</Text>
                <Picker
                  style={styles.select}
                  selectedValue={PrimaryLanguage}
                  onValueChange={setPrimaryLanguage}
                >
                  {Languages.length > 0 &&
                    Languages.map((language, index) => {
                      return (
                        <Picker.Item
                          style={styles.selectOption}
                          key={index}
                          label={language.language}
                          value={language.id}
                        />
                      );
                    })}
                </Picker>
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Timezone</Text>
                <Picker style={styles.select} selectedValue={Timezone} onValueChange={setTimezone}>
                  {Timezones.length > 0 &&
                    Timezones.map((timezone, index) => {
                      return (
                        <Picker.Item
                          style={styles.selectOption}
                          key={index}
                          label={timezone.timezone}
                          value={timezone.id}
                        />
                      );
                    })}
                </Picker>
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Currency</Text>
                <Picker style={styles.select} selectedValue={Currency} onValueChange={setCurrency}>
                  {Currencies.length > 0 &&
                    Currencies.map((currency, index) => {
                      return (
                        <Picker.Item
                          style={styles.selectOption}
                          key={index}
                          label={currency.currency}
                          value={currency.id}
                        />
                      );
                    })}
                </Picker>
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Date format</Text>
                <Picker
                  style={styles.select}
                  selectedValue={Dateformat}
                  onValueChange={setDateformat}
                >
                  {Dateformats.length > 0 &&
                    Dateformats.map((dateformat, index) => {
                      return (
                        <Picker.Item
                          style={styles.selectOption}
                          key={index}
                          label={dateformat.dateformat}
                          value={dateformat.id}
                        />
                      );
                    })}
                </Picker>
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Time format</Text>
                <Picker
                  style={styles.select}
                  selectedValue={Timeformat}
                  onValueChange={setTimeformat}
                >
                  {Timeformats.length > 0 &&
                    Timeformats.map((timeformat, index) => {
                      return (
                        <Picker.Item
                          style={styles.selectOption}
                          key={index}
                          label={timeformat.timeformat}
                          value={timeformat.id}
                        />
                      );
                    })}
                </Picker>
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Week start day</Text>
                <Picker
                  style={styles.select}
                  selectedValue={WeekStart}
                  onValueChange={setWeekStart}
                >
                  {weekdays.length > 0 &&
                    weekdays.map((weekday, index) => {
                      return (
                        <Picker.Item
                          style={styles.selectOption}
                          key={index}
                          label={weekday.weekday}
                          value={weekday.id}
                        />
                      );
                    })}
                </Picker>
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Cut off Time</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Cut off Time"
                  value={CutOffTime}
                  onChangeText={setCutOffTime}
                  placeholderTextColor="#ccc"
                />
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Start Time</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Start Time"
                  value={PickupTime}
                  onChangeText={setPickupTime}
                  placeholderTextColor="#ccc"
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>End Time</Text>
                <TextInput
                  style={styles.input}
                  placeholder="End Time"
                  value={DropOffTime}
                  onChangeText={setDropOffTime}
                  placeholderTextColor="#ccc"
                />
              </View>
            </View>
          </View>
          <Text style={styles.label}>Sales tax</Text>
          <Picker style={styles.select} selectedValue={selectedTaxCode} onValueChange={selectTaxCode}>
            {taxCodes.length > 0 &&
              taxCodes.map((code, index) => {
                return (
                  <Picker.Item
                    style={styles.selectOption}
                    key={index}
                    label={code.code}
                    value={code.id}
                  />
                );
              })}
          </Picker>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, styles.inputGroupLabel, { marginBottom: 8 }]}>
              Store Wavier
            </Text>
            <View style={{ paddingLeft: 3 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton
                  value={'0'}
                  status={!isDocument ? 'checked' : 'unchecked'}
                  onPress={() => setIsDocument(0)}
                />
                <Text>{'Edit manually'}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <RadioButton
                  value={'1'}
                  status={isDocument ? 'checked' : 'unchecked'}
                  onPress={() => setIsDocument(1)}
                />
                <Text>{'Selected Document'}</Text>
                {isDocument == 1 && (
                  <Picker
                    style={[{ marginLeft: 20, paddingVertical: 6, paddingHorizontal: 12 }]}
                    selectedValue={documentId}
                    onValueChange={(value, key) => {
                      setDocumentId(value);
                      setSelectedDocument(Documents[key]);
                    }}
                  >
                    {Documents.length > 0 &&
                      Documents.map((document, index) => {
                        return (
                          <Picker.Item
                            style={styles.selectOption}
                            key={index}
                            label={document.document_name}
                            value={document.id}
                          />
                        );
                      })}
                  </Picker>
                )}
              </View>
            </View>
            {isDocument == 0 && (
              <>
                {Platform.OS == 'web' && (
                  <>
                    <Editor
                      value={StoreWavier}
                      onTextChange={(e) => setStoreWavier(e.htmlValue)}
                      style={{ height: 185, marginBottom: '10px' }}
                      onKeyDown={(event) => {
                        event.stopPropagation();
                      }}
                    />
                  </>
                )}
              </>
            )}
            {isDocument == 1 && (
              <ScrollView style={{ height: 251, marginBottom: 10, borderWidth: 1, borderColor: '#ccc' }}>
                {selectedDocument && (
                  <>
                    {selectedDocument.document_type == 1 ? (
                      <>
                        {Platform.OS === 'web' && (
                          <embed
                            style={{ width: '100%' }}
                            src={API_URL + selectedDocument.document_file}
                            type="application/pdf"
                            width="300"
                            height="500"
                          />
                        )}
                      </>
                    ) : (
                      <>
                        {Platform.OS === 'web' ? (
                          <div
                            style={{ padding: 8 }}
                            dangerouslySetInnerHTML={{ __html: selectedDocument.document_content }}
                          ></div>
                        ) : (
                          <WebView source={{ html: selectedDocument.document_content }} />
                        )}
                      </>
                    )}
                  </>
                )}
              </ScrollView>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, styles.inputGroupLabel, { marginBottom: 8 }]} selectable={true}>
              {`Email confirmation template: \nPlease use [customer_name], [store_name], [order_number], [start_date], [end_date], [start_time], [end_time]`}
            </Text>
            {Platform.OS == 'web' && (
              <>
                <Editor
                  value={EmailConfirmation}
                  onTextChange={(e) => setEmailConfirmation(e.htmlValue)}
                  style={{ height: 185, marginBottom: '10px' }}
                  onKeyDown={(event) => {
                    event.stopPropagation();
                  }}
                />
              </>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, styles.inputGroupLabel, { marginBottom: 8 }]} selectable={true}>
              {`Text confirmation template: \nPlease use [customer_name], [store_name], [order_number], [start_date], [end_date], [start_time], [end_time]`}
            </Text>
            <TextInput
              style={[styles.input, styles.textarea, {height:150,}]}
              placeholder="State"
              value={TextConfirmation}
              onChangeText={setTextConfirmation}
              placeholderTextColor="#ccc"
              multiline={true}
            />
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={SaveForm}>
              <Text style={[styles.addButton, { marginBottom: 8, marginTop: 16 }]}>{'Update'}</Text>
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
