import React, { useCallback, useEffect, useMemo, forwardRef, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableHighlight, TextInput, Platform } from 'react-native';
import BasicLayout from '../../common/components/CustomLayout/BasicLayout';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../common/constants/Colors';
import Slots from '../../common/slots/slots';
import { CommonButton } from '../../common/components/CommonButton/CommonButton';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { RESERVATION_FORMAT } from '../../common/constants/DateFormat';
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

if (Platform.OS === 'web') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'react-datepicker/dist/react-datepicker.css';
  document.head.appendChild(link);
}

interface Props {
  openInventory: () => void;
  goBack: () => void;
}

const CreateReservation = ({ openInventory, goBack }: Props) => {
  
  const { showAlert } = useAlertModal();
  const navigation = useNavigation();

  const [customersData, setCustomers] = useState([]);

  const [startDate, setStartdate] = useState<Date>(new Date());
  const [endDate, setEnddate] = useState<Date>();
  const [equipmentData, setEquipmentData] = useState<Array<any>>([]);

  const [updateCustomerTrigger, setUpdateCustomerTrigger] = useState(true);
  const [isAddReservationItemModalVisible, setAddReservationItemModalVisible] = useState(false);
  const openAddReservationItemModal = () => {
    setAddReservationItemModalVisible(true);
  };
  const closeAddReservationItemModal = () => {
    setAddReservationItemModalVisible(false);
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
  const { data: priceTablesData } = useRequestPriceTablesQuery({}, { refetchOnFocus: true, });
  const { data: priceGroupsData } = useRequestPriceGroupsQuery({}, {refetchOnFocus: true,});
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

  const CustomInput = forwardRef(({ value, onChange, onClick }, ref) => (
    <input
      onClick={onClick}
      onChange={onChange}
      ref={ref}
      style={styles.input}
      value={value}
    ></input>
  ));

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
        navigation={navigation}
        goBack={goBack}
        backKeyboard = {false}
      >
        <ScrollView contentContainerStyle={{alignItems:'center'}}>
          <View style={styles.outterContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent:'flex-end'}}>
              <CommonButton
                width={177}
                onPressWhileDisabled={() => {
                  showAlert(
                    'warning',
                    'Please select a customer, a brand, a prooduct, and a drop-off time.'
                  );
                }}
                onPress={() => {
                }}
                label={'Create Reservation'}
                disabledConfig={{ backgroundColor: Colors.Neutrals.DARK, disabled: true }}
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
                }}
                data={customersDropdownData}
                placeholder="Select A Customer"
                title={'Customers'}
              />
            </View>
            <View style={styles.reservationRow}>
              <CommonSelectDropdown
                containerStyle={{
                  marginRight: 40,
                }}
                width={350}
                onItemSelected={(item) => {
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
            <View style={[styles.reservationRow]}>
              {/* <Slots
                onSelect={(item) => {
                  setSelectedSlot(item);
                }}
                items={priceTableHeaderData}
              /> */}
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
          onAdded={(productLine, quantity)=>{
            if (productLine) {
              const equipment = { ...productLine, quantity };
              setEquipmentData(prevEquipmentData => [...prevEquipmentData, equipment]);
            }
          }}
        />
      </BasicLayout>
    );
  };

  return renderInitial();
};

const styles = StyleSheet.create({
  outterContainer: {
    // width: '60%',
    // minWidth: 500,
    marginVertical: 30,
    paddingVertical: 40,
    paddingHorizontal: 60,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.Neutrals.WHITE,
  },
  reservationRow: {
    flexDirection: 'row',
    flexWrap:'wrap',
    marginVertical: 8,
    // paddingVertical: 8,
  },
  timeContainer: {
    flexDirection: 'row',
  },
  equipmentText: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 30,
    marginBottom: 15,
  },
  width: {
    flexDirection: 'row',
  },
  modal: {
    padding: 20,
  },
  selectDateModalText: {
    fontSize: 20,
    marginBottom: 5,
  },
  bottomContainer: {
    paddingHorizontal: 20,
  },
  input:{
    boxSizing: 'border-box',
    padding:8,
    fontSize:14,
    width:350,
    borderWidth:1, 
    borderColor:'#808080',
    height: 37,
  },
  buttonText: {
    fontSize: 14,
    textAlign: 'center',
    marginLeft: 10,
    color: 'white',
  },
  button: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    left: 390,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    borderRadius: 3,
    borderWidth: 0,
    borderColor: '#6c757d',
    backgroundColor: '#007BFF',
  },
  addItemButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    borderRadius: 3,
    borderWidth: 0,
    borderColor: '#6c757d',
    backgroundColor: '#007BFF',
  },
});

export default CreateReservation;
