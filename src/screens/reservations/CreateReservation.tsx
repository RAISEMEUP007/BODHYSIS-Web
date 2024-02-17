import React, { useCallback, useEffect, useMemo, forwardRef, useState } from 'react';
import { View, ActivityIndicator, Text, ScrollView, TouchableHighlight, TextInput, Platform } from 'react-native';
import BasicLayout from '../../common/components/CustomLayout/BasicLayout';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../common/constants/Colors';
import Slots from '../../common/slots/slots';
import { CommonButton } from '../../common/components/CommonButton/CommonButton';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  useRequestBrandsQuery,
  useRequestLocationsQuery,
  useRequestPriceTablesQuery,
  useRequestPriceGroupsQuery,
  useRequestPriceLogicDataQuery,
} from '../../redux/slices/baseApiSlice';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import {  DropdownData } from '../../common/components/CommonDropdown/CommonDropdown';
import { BrandType } from '../../types/BrandType';
import { CustomerType } from '../../types/CustomerTypes';
import { LocationType } from '../../types/LocationType';
import { CommonSelectDropdown } from '../../common/components/CommonSelectDropdown/CommonSelectDropdown';
import AddCustomerModal from '../customer/customers/AddCustomerModal';
import { FontAwesome5 } from '@expo/vector-icons';
import { getCustomersData } from '../../api/Customer';
import { msgStr } from '../../common/constants/Message';
import EquipmentsTable from './EquipmentsTable';
import AddReservationItemModal from './AddReservationItemModal';
import { createReservationStyle } from './styles/CreateReservationStyle';
import { createReservation } from '../../api/Reservation';
import { getHeaderData } from '../../api/Price';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';

if (Platform.OS === 'web') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'react-datepicker/dist/react-datepicker.css';
  document.head.appendChild(link);
}

interface Props {
  openReservationScreen: (itemName: string, data?: any ) => void;
  initialData?: any;
}

const CreateReservation = ({ openReservationScreen, initialData }: Props) => {
  const { showAlert } = useAlertModal();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [customersData, setCustomers] = useState([]);

  const [customerId, selectCustomerId] = useState<number | null>(initialData?.initalCustomerId??null);
  const [brandId, selectBrandId] = useState<number | null>();
  const [locationId, selectLocationId] = useState<number | null>();
  const [startDate, setStartdate] = useState<Date>(new Date());
  const [endDate, setEnddate] = useState<Date>();
  const [headerData, setHeaderData] = useState([]);
  const [equipmentData, setEquipmentData] = useState<Array<any>>([]);

  const [updateCustomerTrigger, setUpdateCustomerTrigger] = useState(true);
  const [isAddReservationItemModalVisible, setAddReservationItemModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState();
  const [editingIndex, setEditingIndex] = useState();

  const openAddReservationItemModal = () => {
    editReservationItem(null, null);
    setAddReservationItemModalVisible(true);
  };
  const closeAddReservationItemModal = () => {
    setAddReservationItemModalVisible(false);
  };
  const editReservationItem = (item, index) => {
    setAddReservationItemModalVisible(true);
    setEditingItem(item);
    setEditingIndex(index);
  };

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const openAddCustomerModal = () => {
    setAddModalVisible(true);
    setSelectedCustomer(null);
  };
  const closeAddCustomerModal = () => {
    setAddModalVisible(false);
    setSelectedCustomer(null);
  };

  const getCustomers = () => {
    getCustomersData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setCustomers(jsonRes);
          setUpdateCustomerTrigger(false);
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
  const { data: brandsData } = useRequestBrandsQuery({}, {refetchOnFocus: true});
  const { data: locationsData } = useRequestLocationsQuery({}, {refetchOnFocus: true,});
  // const { data: priceTablesData } = useRequestPriceTablesQuery({}, { refetchOnFocus: true, });
  // const { data: priceGroupsData } = useRequestPriceGroupsQuery({}, {refetchOnFocus: true,});
  const { data: priceLogicData } = useRequestPriceLogicDataQuery({}, {refetchOnFocus: true,});

  useEffect(() => {
    if (updateCustomerTrigger == true) getCustomers();
  }, [updateCustomerTrigger]);
  
  const customersDropdownData = useMemo(() => {
    if (!customersData?.length) {
      return [];
    }

    const result: DropdownData<CustomerType> = customersData.map((item, index) => {
      return {
        value: item,
        displayLabel: `${item.first_name} ${item.last_name}`,
        index,
      };
    });
    return result;
  }, [customersData]);

  const defaultCustomer = useMemo(()=>{
    return customersDropdownData.find(item=>item.value.id == initialData.initalCustomerId);
  }, [initialData, customersDropdownData]);

  const brandsDropdownData = useMemo(() => {
    if (!brandsData?.length) {
      return [];
    }

    const result: DropdownData<BrandType> = brandsData.map((item, index) => {
      return {
        value: item,
        displayLabel: item.brand,
        index,
      };
    });
    return result;
  }, [brandsData]);

  const locationsDropdownData = useMemo(() => {
    if (!locationsData?.length) {
      return [];
    }

    const result: DropdownData<LocationType> = locationsData.map((item, index) => {
      return {
        value: item,
        displayLabel: item.location,
        index,
      };
    });
    return result;
  }, [locationsData]);

  const getPriceTableByBrandAndDate = (brandId, date) => {
    if(!priceLogicData || !priceLogicData.length) return null;
    let selectedPriceGroup = priceLogicData.find(group => 
      group.brand_id == brandId &&
      (group.start_date != null && date >= new Date(group.start_date)) && 
      (group.end_date != null && date <= new Date(group.end_date + " 23:59:59"))
    );

    if(!selectedPriceGroup){
      selectedPriceGroup = priceLogicData.find(group => 
        group.brand_id == brandId &&
        (group.start_date != null && date >= new Date(group.start_date)) && 
        (group.end_date == null )
      );
    }

    if(!selectedPriceGroup){
      selectedPriceGroup = priceLogicData.find(group => 
        group.brand_id == brandId &&
        (group.start_date == null) && 
        (group.end_date != null && date <=new Date(group.end_date + "23:59:59"))
      );
    }

    if(!selectedPriceGroup){
      selectedPriceGroup = priceLogicData.find(group => 
        group.brand_id == brandId &&
        (group.start_date == null && group.end_date == null)
      );
    }
  
    if (selectedPriceGroup) {
      return selectedPriceGroup.priceTable;
    } else {
      return null;
    }
  }

  useEffect(() => {
    const priceTable = getPriceTableByBrandAndDate(brandId, startDate);
    if(priceTable){
      getHeaderData(priceTable.id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setHeaderData(jsonRes);
            break;
          case 500:
            showAlert('error', msgStr('serverError'));
            setHeaderData([]);
            break;
          default:
            if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
            else showAlert('error', msgStr('unknownError'));
            setHeaderData([]);
            break;
        }
      });
    }else setHeaderData([]);
  }, [brandId, startDate]);

  const valid = useMemo(() => {
    return (
      customerId &&
      brandId &&
      startDate &&
      endDate &&
      equipmentData.length > 0
    );
  }, [customerId, brandId, startDate, endDate, equipmentData]);

  const CreateReservationHandler = () => {
    setIsLoading(true);

    const payload = {
      customer_id : customerId,
      brand_id : brandId,
      start_location_id : locationId,
      end_location_id : locationId,
      start_date : startDate,
      end_date : endDate,
      items : equipmentData,
      stage : 1,
    };

    const handleResponse = (jsonRes, status) => {
      console.log(jsonRes);
      switch (status) {
        case 201:
          // showAlert('success', jsonRes.message);
          openReservationScreen('Proceed Reservation', {reservationId:jsonRes.reservation.id});
          break;
        case 409:
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
      setIsLoading(false);
    };

    createReservation(payload, (jsonRes, status) => {
      handleResponse(jsonRes, status);
    });
  };
  
  const CustomInput = forwardRef(({ value, onChange, onClick }, ref) => (
    <input
      onClick={onClick}
      onChange={onChange}
      ref={ref}
      style={styles.input}
      value={value}
    ></input>
  ))
  const renderDatePicker = (selectedDate, onChangeHandler) => {
    return (
      <View style={{}}>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => onChangeHandler(date)}
          customInput={<CustomInput />}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          timeInputLabel="Time:"
          dateFormat="MM/dd/yyyy hh:mm aa"
          showTimeSelect
        />
      </View>
    );
  };

  const renderEndDatePicker = (selectedDate, onChangeHandler, minDate) => {
    return (
      <View style={{}}>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => onChangeHandler(date)}
          customInput={<CustomInput />}
          minDate={minDate}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          timeInputLabel="Time:"
          dateFormat="MM/dd/yyyy hh:mm aa"
          showTimeSelect
        />
      </View>
    );
  };

  const renderInitial = () => {
    return (
      <BasicLayout
        screenName={'Create Reservation'}
        // navigation={navigation}
        goBack={()=>{
          openReservationScreen('Reservations List');
        }}
        backKeyboard = {false}
      >
        <ScrollView contentContainerStyle={{alignItems:'center'}}>
          <View style={styles.outterContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent:'flex-end'}}>
              <CommonButton
                width={177}
                onPressWhileDisabled={() => {
                  if(!customerId) showAlert('warning', 'Please select a customer.');
                  else if(!brandId) showAlert('warning', 'Please select a brand.');
                  else if(!startDate) showAlert('warning', 'Please select Pick Up Time.');
                  else if(!endDate) showAlert('warning', 'Please select Drop off Time.');
                  else if(!equipmentData.length) showAlert('warning', 'Please add an item.');
                }}
                onPress={() => {
                  CreateReservationHandler();
                }}
                label={'Create Reservation'}
                disabledConfig={{ backgroundColor: Colors.Neutrals.DARK, disabled: !valid }}
                backgroundColor={Colors.Secondary.GREEN}
                type={'rounded'}
                textColor={Colors.Neutrals.WHITE}
                containerStyle={{
                  // marginRight: 20,
                }}
              />
            </View>
            <View style={styles.reservationRow}>
              <TouchableHighlight style={styles.button} onPress={openAddCustomerModal}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <FontAwesome5 name="plus" size={14} color="white" style={{marginTop:3}}/>
                  <Text style={styles.buttonText}>Add Customer</Text>
                </View>
              </TouchableHighlight>
              <CommonSelectDropdown
                containerStyle={{
                  marginRight: 40,
                }}
                width={350}
                onItemSelected={(item) => {
                  selectCustomerId(item.value.id);
                }}
                data={customersDropdownData}
                placeholder="Select A Customer"
                title={'Customers'}
                defaultValue={defaultCustomer}
              />
            </View>
            <View style={styles.reservationRow}>
              <CommonSelectDropdown
                containerStyle={{
                  marginRight: 40,
                }}
                width={350}
                onItemSelected={(item) => {
                  selectLocationId(item.value.id);
                }}
                data={locationsDropdownData}
                placeholder="Select A Location"
                title={'Location'}
              />
              <CommonSelectDropdown
                containerStyle={{
                  // marginRight: 40,
                }}
                width={350}
                onItemSelected={(item) => {
                  selectBrandId(item.value.id);
                }}
                data={brandsDropdownData}
                placeholder="Select A Brand"
                title={'Brands'}
              />
            </View>
            <View style={[styles.reservationRow, {zIndex:10}]}>
              <View style={{marginRight:40}}>
                <Text style={{marginBottom:10}}>{'Pick Up Time'}</Text>
                {Platform.OS == 'web' && renderDatePicker(startDate, (date)=>setStartdate(date))}
              </View>
              <View style={{marginRight:0}}>
                <Text style={{marginBottom:10}}>{'Drop Off Time'}</Text>
                {Platform.OS == 'web' && renderEndDatePicker(endDate, (date)=>setEnddate(date), startDate)}
                {Platform.OS != 'web' && <TextInput editable={false} style={styles.input} value={endDate ? endDate.toDateString() : ''}
                ></TextInput>}
              </View>
            </View>
            <View style={[styles.reservationRow, {width:740}]}>
              <Slots
                onSelect={(item) => {
                  setEnddate(new Date(new Date(startDate).getTime() + item.milliseconds));
                }}
                items={headerData}
              />
            </View>
            <View style={[styles.reservationRow, {marginTop:10, justifyContent:'flex-end'}]}>
              <TouchableHighlight style={[styles.addItemButton]} onPress={openAddReservationItemModal}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <FontAwesome5 name="plus" size={14} color="white" style={{marginTop:3}}/>
                  <Text style={styles.buttonText}>Add Items</Text>
                </View>
              </TouchableHighlight>
            </View>
            <EquipmentsTable
              items={equipmentData}
              onEdit={(item, index)=>{
                editReservationItem(item, index);
              }}
              onDelete={(item, index)=>{
                const updatedEquipmentData = [...equipmentData.slice(0, index), ...equipmentData.slice(index + 1)];
                setEquipmentData(updatedEquipmentData);
              }}
            />
          </View>
        </ScrollView>
        <AddCustomerModal
          isModalVisible={isAddModalVisible}
          Customer={selectedCustomer}
          setUpdateCustomerTrigger={setUpdateCustomerTrigger}
          closeModal={closeAddCustomerModal}
        />
        <AddReservationItemModal
          isModalVisible={isAddReservationItemModalVisible}
          closeModal={closeAddReservationItemModal}
          item={editingItem}
          onAdded={(productLine, quantity)=>{
            if (productLine) {
              const equipment = { ...productLine, quantity };
              setEquipmentData(prevEquipmentData => [...prevEquipmentData, equipment]);
            }
          }}
          onUpdated={(productLine, quantity)=>{
            if (productLine) {
              const newEquipment = { ...productLine, quantity };
              const replaceIndex = editingIndex;
              setEquipmentData(prevEquipmentData => {
                return prevEquipmentData.map((item, index) => {
                  if (index === replaceIndex) {
                    return { ...newEquipment };
                  }
                  return item;
                });
              });
            }
            editReservationItem(null, null);
          }}
        />
        {isLoading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </BasicLayout>
    );
  };

  return renderInitial();
};

const styles = createReservationStyle;

export default CreateReservation;
