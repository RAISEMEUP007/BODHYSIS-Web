import React, { useEffect, useMemo, forwardRef, useState } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  TouchableHighlight,
  TextInput,
  Platform,
} from 'react-native';

import BasicLayout from '../../common/components/CustomLayout/BasicLayout';
import { Colors } from '../../common/constants/Colors';
import Slots from '../../common/components/slots/slots';
import { CommonButton } from '../../common/components/CommonButton/CommonButton';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  useRequestBrandsQuery,
  useRequestPriceLogicDataQuery,
} from '../../redux/slices/baseApiSlice';
import { getCustomersData, getDeliveryAddressesData } from '../../api/Customer';
import { createReservation } from '../../api/Reservation';
import { getHeaderData, getPriceDataByGroup } from '../../api/Price';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import { BrandType } from '../../types/BrandType';
import { CustomerType } from '../../types/CustomerTypes';
import { CommonSelectDropdown, DropdownData } from '../../common/components/CommonSelectDropdown/CommonSelectDropdown';
import AddCustomerModal from '../customer/customers/AddCustomerModal';
import { FontAwesome5 } from '@expo/vector-icons';
import { msgStr } from '../../common/constants/Message';
import EquipmentsTable from './EquipmentsTable';
import AddReservationItemModal from './AddReservationItemModal';
import { createReservationStyle } from './styles/CreateReservationStyle';
import { getStoreDetail } from '../../api/Settings';
import { getDiscountCodesData } from '../../api/Settings';
import QuantitiesDetailsModal from './QuantitiesDetailsModal';

interface Props {
  openReservationScreen: (itemName: string, data?: any) => void;
  initialData?: any;
}

const CreateReservation = ({ openReservationScreen, initialData }: Props) => {
  const { showAlert } = useAlertModal();

  const [isLoading, setIsLoading] = useState(false);
  const [customersData, setCustomers] = useState([]);
  const [selectedPriceLogic, selectPriceLogic] = useState<any>();
  const [selectedPriceTable, setPriceTable] = useState<any>();

  const [customerId, selectCustomerId] = useState<number | null>(
    initialData?.initalCustomerId ?? null
  );
  const [brandId, selectBrandId] = useState<number | null>();
  const [taxRate, setTaxRate] = useState<number>(0);
  const [startDate, setStartdate] = useState<Date>(()=>{ const date = new Date(); date.setHours(0, 0, 0, 0); return date;});
  const [endDate, setEnddate] = useState<Date>();
  const [headerData, setHeaderData] = useState([]);
  const [equipmentData, setEquipmentData] = useState<Array<any>>([]);
  const [itemOperations, setItemOperations] = useState<number>(0);

  const [updateCustomerTrigger, setUpdateCustomerTrigger] = useState(true);
  const [isAddReservationItemModalVisible, setAddReservationItemModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState();
  const [editingIndex, setEditingIndex] = useState();

  const [customerAddresses, setCustomerAddresses] = useState([]);
  const [customerAddressId, selectCustomerAddressId] = useState();

  const [discountCodes, setDiscountCodes] = useState([]);
  const [selectedDiscountCode, selectDiscountCode] = useState<any>(null);

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

  const [isReviewQuantityModalVisible, setReviewQuantityModalVisible] = useState(false);
  const [reviewQuantities, setQuantitesData] = useState(null);
  const openReviewQuantityCustomerModal = (quantities) => {
    setQuantitesData(quantities);
    setReviewQuantityModalVisible(true);
  };
  const closeReviewQuantityCustomerModal = () => {
    setReviewQuantityModalVisible(false);
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
  const { data: brandsData } = useRequestBrandsQuery({}, { refetchOnFocus: true });
  const { data: priceLogicData } = useRequestPriceLogicDataQuery({}, { refetchOnFocus: true });

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

  const defaultCustomer = useMemo(() => {
    return customersDropdownData.find((item) => item.value.id == initialData.initalCustomerId);
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

  useEffect(() => {
    getStoreDetail(brandId, (jsonRes, status) => {
      if (status == 200) setTaxRate(jsonRes.sales_tax);
    });
  }, [brandId]);

  useEffect(()=>{
    if(customerId){
      getDeliveryAddressesData(customerId, (jsonRes)=>{
        if(jsonRes && jsonRes.length){
          setCustomerAddresses(jsonRes);
          jsonRes.map((item, index) => {
            if(item.is_used == 1){
              selectCustomerAddressId(item.id);
            }
          });
          selectCustomerAddressId(null);
        }else {
          setCustomerAddresses([]);
          selectCustomerAddressId(null);
        }
      })
    }else{
      setCustomerAddresses([]);
      selectCustomerAddressId(null);
    }
  }, [customerId])

  useEffect(()=>{
    getDiscountCodesData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setDiscountCodes(jsonRes);
          break;
      }
    });
  }, [])
  
  const discountCodesDropdownData = useMemo(() => {
    if (!discountCodes?.length) {
      return [];
    }

    const result: Array<any> = discountCodes.map((item, index) => {
      return {
        value: item,
        displayLabel: item.code,
        index,
      };
    });
    return result;
  }, [discountCodes]);

  const customerAddressDropdownData = useMemo(() => {
    if (!customerAddresses?.length) {
      return [];
    }

    const result: DropdownData<BrandType> = customerAddresses.map((item, index) => {
      return {
        value: item,
        displayLabel: (item?.all_addresses?.number??'') + ' ' + (item?.all_addresses?.street??'') + ' ' + (item?.all_addresses?.plantation??'') + ' ' + (item?.all_addresses?.property_name??''),
        index,
      };
    });
    return result;
  }, [customerAddresses]);


  const subTotal = useMemo(() => {
    if (equipmentData.length > 0) {
      const subtotal = equipmentData.reduce((total, item) => total + item.price, 0);
      return subtotal;
    } else return 0;
  }, [equipmentData]);

  const taxAmount = useMemo(() => {
    const txR = taxRate || 0;
    return Math.round(txR * subTotal) / 100;
  }, [taxRate, subTotal]);

  const getPriceTableByBrandAndDate = (brandId, date) => {
    if (!priceLogicData || !priceLogicData.length) return null;
    let selectedPriceLogic = priceLogicData.find(
      (group) =>
        group.brand_id == brandId &&
        group.start_date != null &&
        date >= new Date(group.start_date) &&
        group.end_date != null &&
        date <= new Date(group.end_date + ' 23:59:59')
    );

    if (!selectedPriceLogic) {
      selectedPriceLogic = priceLogicData.find(
        (group) =>
          group.brand_id == brandId &&
          group.start_date != null &&
          date >= new Date(group.start_date) &&
          group.end_date == null
      );
    }

    if (!selectedPriceLogic) {
      selectedPriceLogic = priceLogicData.find(
        (group) =>
          group.brand_id == brandId &&
          group.start_date == null &&
          group.end_date != null &&
          date <= new Date(group.end_date + '23:59:59')
      );
    }

    if (!selectedPriceLogic) {
      selectedPriceLogic = priceLogicData.find(
        (group) => group.brand_id == brandId && group.start_date == null && group.end_date == null
      );
    }

    if (selectedPriceLogic) {
      selectPriceLogic(selectedPriceLogic);
      return selectedPriceLogic.priceTable;
    } else {
      selectPriceLogic(null);
      return null;
    }
  };

  useEffect(() => {
    const priceTable = getPriceTableByBrandAndDate(brandId, startDate);
    setPriceTable(priceTable);
    if (priceTable) {
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
    } else setHeaderData([]);
  }, [brandId, startDate]);

  const valid = useMemo(() => {
    return (
      customerId &&
      brandId &&
      startDate &&
      endDate &&
      selectedPriceTable &&
      equipmentData.length > 0
    );
  }, [customerId, brandId, startDate, endDate, selectedPriceTable, equipmentData]);

  const addReservationItem = (productFamily, quantity, extras) => {
    const equipment = {
      ...productFamily,
      family_id: productFamily.id,
      quantity:1,
      extras,
      price_group_id: productFamily?.lines[0]?.price_group_id ?? 0, 
    };

    let updatedEquipments = [...equipmentData];
    if(quantity){
      for(let i=0; i<quantity; i++){
        updatedEquipments.push(equipment);
      }
    }
    setEquipmentData(updatedEquipments);
    setItemOperations((prev) => prev + 1);
  };

  const updateReservationItem = (oldLine, productFamily, quantity, extras) => {
    const newEquipment = { 
      ...productFamily, 
      family_id: productFamily.id, 
      quantity:1, 
      extras,
      price_group_id: productFamily?.lines[0]?.price_group_id ?? 0, 
    };
    const replaceIndex = editingIndex;
    setEquipmentData((prevEquipmentData) => {
      return prevEquipmentData.map((item, index) => {
        if (index === replaceIndex) {
          return { ...newEquipment };
        }
        return item;
      });
    });
    setItemOperations((prev) => prev + 1);
  };

  useEffect(() => {
    const calculatePricedData = async () => {
      if (equipmentData.length > 0) {
        if (headerData && selectedPriceTable && startDate && endDate) {
          const tableId = selectedPriceTable.id;
          const pricedEquipmentData = await calculatePricedEquipmentData(tableId);
          setEquipmentData(pricedEquipmentData);
        } else {
          const pricedEquipmentData = equipmentData.map((item) => ({ ...item, price: 0 }));
          setEquipmentData(pricedEquipmentData);
        }
      }
    };

    calculatePricedData();
  }, [selectedPriceTable, startDate, endDate, headerData, itemOperations]);

  const calculatePricedEquipmentData = async (tableId) => {
    const pricedEquipmentData = await Promise.all(
      equipmentData.map(async (item) => {
        const payload = {
          tableId,
          groupId: item.price_group_id,
        };
        const response = await getPriceDataByGroup(payload);
        const rows = await response.json();

        const updatedReversedHeaderData = headerData.map((item) => {
          const value = rows.find((row) => row.point_id === item.id)?.value || 0;
          const pricePMS = value / item.milliseconds;
          const pricePH = value / (item.milliseconds / (1000 * 60 * 60));
          const pricePD = value / (item.milliseconds / (1000 * 60 * 60 * 24));
          return { ...item, value, pricePH, pricePD };
        });

        const diff = endDate.getTime() - startDate.getTime();
        const basedonPoint = updatedReversedHeaderData.find((item) => {
          if (item.value > 0 && item.milliseconds >= diff) {
            return item;
          }
        });

        let price = 0;
        if (basedonPoint) {
          // if (Math.floor(diff / (1000 * 60 * 60 * 24)) == 0)
          //   price = basedonPoint.pricePH * Math.floor(diff / (1000 * 60 * 60));
          // else price = basedonPoint.pricePD * Math.floor(diff / (1000 * 60 * 60 * 24));

          price = (Math.round(basedonPoint.value * 100) / 100) * item.quantity;
        }

        //calcualte extras price
        if (item.extras && item.extras.length > 0) {
          let extrasPrice = item.extras.reduce((total, extra) => total + extra.fixed_price, 0);
          price += extrasPrice;
        }
        return { ...item, price };
      })
    );
    return pricedEquipmentData;
  };

  const CreateReservationHandler = async () => {
    setIsLoading(true);

    const payload = {
      start_date: startDate,
      end_date: endDate,
      items: equipmentData,
    };

    // verifyQauntity(payload, (jsonRes, status) => {
    //   switch (status) {
    //     case 200:
    //       submitReservation();
    //       break;
    //     case 400:
    //       openReviewQuantityCustomerModal(jsonRes.quantities);
    //       break;
    //     default:
    //       if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
    //       else showAlert('error', msgStr('unknownError'));
    //       break;
    //   }
    //   setIsLoading(false);
    // });
    submitReservation();
  };

  const submitReservation = () => {
    setIsLoading(true);

    let discountAmount;
    if(selectedDiscountCode){
      // discountInfo = discountCodes.find((item) => item.id === reservationInfo.promo_code);
      discountAmount = selectedDiscountCode.type == 1 ? (Math.round(subTotal * selectedDiscountCode.amount) / 100) : selectedDiscountCode.amount;
    }else {
      discountAmount = 0;
    }

    const payload:any = {
      customer_id: customerId,
      brand_id: brandId,
      start_date: startDate,
      end_date: endDate,
      items: equipmentData,
      subtotal: subTotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total_price: subTotal + taxAmount - discountAmount,
      price_table_id: selectedPriceTable.id,
      address_id: customerAddressId,
      stage: 1,
    };

    if(selectedDiscountCode) payload.promo_code = selectedDiscountCode.id;

    const handleResponse = (jsonRes, status) => {
      switch (status) {
        case 201:
          openReservationScreen('Proceed Reservation', { reservationId: jsonRes.reservation.id });
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

  const CustomInput = forwardRef(({ value, onChange, onClick }: any, ref) => (
    <input
      onClick={onClick}
      onChange={onChange}
      // ref={ref}
      style={styles.dateInput}
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
          dateFormat="MM/dd/yyyy"
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
          dateFormat="MM/dd/yyyy"
        />
      </View>
    );
  };

  const renderInitial = () => {
    return (
      <BasicLayout
        screenName={'Create Reservation'}
        // navigation={navigation}
        goBack={() => {
          openReservationScreen('Reservations List');
        }}
        backKeyboard={false}
        containerStyle={{
          backgroundColor:'#f7f7f7',
        }}
      >
        <div style={{overflow:'auto', padding:'0 30px'}}>
          <div style={{width:'fit-content', margin:'auto'}}>
            <View style={styles.outterContainer}>
              <View
                style={{ flexDirection: 'row', zIndex: 10 }}
                onLayout={(event) => {
                  const { width } = event.nativeEvent.layout;
                  // setContentWidth(width);
                }}
              >
                <View
                  style={{
                    width: 280,
                    marginTop: 53,
                    marginRight: 50,
                    marginBottom: 15,
                    borderWidth: 1,
                    borderColor: '#808080',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      marginVertical: 8,
                      marginHorizontal: 16,
                      marginTop: 18,
                    }}
                  >
                    Based off price logic
                  </Text>
                  <View style={{ flexDirection: 'row', marginVertical: 8, marginHorizontal: 16 }}>
                    <Text>{'Brand:'}</Text>
                    <Text style={{ marginLeft: 20, color: selectedPriceLogic ? 'black' : '#999' }}>
                      {selectedPriceLogic?.brand?.brand ?? 'Not selected'}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginVertical: 8, marginHorizontal: 16 }}>
                    <Text>{'Season:'}</Text>
                    <Text style={{ marginLeft: 20, color: selectedPriceLogic ? 'black' : '#999' }}>
                      {selectedPriceLogic?.season?.season ?? 'Not selected'}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginVertical: 8, marginHorizontal: 16 }}>
                    <Text>{'Price Table:'}</Text>
                    <Text style={{ marginLeft: 20, color: selectedPriceTable ? '#ff4d4d' : '#999' }}>
                      {selectedPriceTable ? selectedPriceTable.table_name : 'No available'}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginVertical: 8, marginHorizontal: 16 }}>
                    <Text>{'Start date:'}</Text>
                    <Text
                      style={{
                        marginLeft: 20,
                        color: selectedPriceTable && startDate ? 'black' : '#999',
                      }}
                    >
                      {startDate?startDate.toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      }):'undefined'}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginVertical: 8, marginHorizontal: 16 }}>
                    <Text>{'End date:'}</Text>
                    <Text
                      style={{
                        marginLeft: 20,
                        color: selectedPriceTable && endDate ? 'black' : '#999',
                      }}
                    >
                      {endDate?endDate.toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      }):'undefined'}
                    </Text>
                  </View>
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <CommonButton
                      width={177}
                      onPressWhileDisabled={() => {
                        if (!customerId) showAlert('warning', 'Please select a customer.');
                        else if (!brandId) showAlert('warning', 'Please select a brand.');
                        else if (!startDate) showAlert('warning', 'Please select start date.');
                        else if (!endDate) showAlert('warning', 'Please select end date.');
                        else if (!selectedPriceTable)
                          showAlert('warning', 'No available Price table. Can not set price.');
                        else if (!equipmentData.length) showAlert('warning', 'Please add an item.');
                      }}
                      onPress={() => {
                        CreateReservationHandler();
                      }}
                      label={'Create Reservation'}
                      disabledConfig={{ backgroundColor: Colors.Neutrals.DARK, disabled: !valid }}
                      backgroundColor={Colors.Secondary.GREEN}
                      type={'rounded'}
                      textColor={Colors.Neutrals.WHITE}
                      containerStyle={
                        {
                          // marginRight: 20,
                        }
                      }
                    />
                  </View>
                  <View style={styles.reservationRow}>
                    <TouchableHighlight style={styles.button} onPress={openAddCustomerModal}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome5 name="plus" size={14} color="white" style={{ marginTop: 3 }} />
                        <Text style={styles.buttonText}>Add Customer</Text>
                      </View>
                    </TouchableHighlight>
                    <CommonSelectDropdown
                      containerStyle={{
                        marginRight: 40,
                      }}
                      width={250}
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
                      containerStyle={
                        {
                          marginRight: 40,
                        }
                      }
                      width={"100%"}
                      onItemSelected={(item) => {
                        selectCustomerAddressId(item.value.address_id);
                      }}
                      data={customerAddressDropdownData}
                      placeholder="Select An Address"
                      title={'Delivery Address'}
                      defaultValue={customerAddressId}
                    />
                  </View>
                  <View style={styles.reservationRow}>
                    <CommonSelectDropdown
                      containerStyle={{
                        marginRight: 40,
                        marginTop: 5,
                      }}
                      width={250}
                      onItemSelected={(item) => {
                        selectDiscountCode(item.value);
                      }}
                      data={discountCodesDropdownData}
                      placeholder="Select A Code"
                      title={'Discount code'}
                      titleStyle={{marginBottom:6, color:"#555555", fontSize:14}}
                    />
                    <CommonSelectDropdown
                      containerStyle={
                        {
                          // marginRight: 40,
                        }
                      }
                      width={250}
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
                      <Text style={{marginBottom:10}}>{'Start date'}</Text>
                      {Platform.OS == 'web' && renderDatePicker(startDate, (date)=>setStartdate(date))}
                    </View>
                    <View style={{ marginRight: 0 }}>
                      <Text style={{ marginBottom: 10 }}>{'End date'}</Text>
                      {Platform.OS == 'web' &&
                        renderEndDatePicker(endDate, (date) => setEnddate(date), startDate)}
                      {Platform.OS != 'web' && (
                        <TextInput
                          editable={false}
                          style={styles.input}
                          value={endDate ? endDate.toDateString() : ''}
                        ></TextInput>
                      )}
                    </View>
                  </View>
                  <View style={[styles.reservationRow, { width: 550 }]}>
                    <Slots
                      onSelect={(item) => {
                        setEnddate(new Date(new Date(startDate).getTime() + item.milliseconds));
                      }}
                      items={headerData}
                    />
                  </View>
                </View>
              </View>
              <View
                style={[
                  styles.reservationRow,
                  { marginTop: 10, alignItems: 'flex-end', justifyContent: 'space-between' },
                ]}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ marginRight: 8 }}>Subtotal</Text>
                  <Text style={{ marginRight: 24 }}>
                    {subTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </Text>
                  <Text style={{ marginRight: 8 }}>Tax</Text>
                  <Text>
                    {taxAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </Text>
                </View>
                <TouchableHighlight
                  style={[styles.addItemButton]}
                  onPress={openAddReservationItemModal}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesome5 name="plus" size={14} color="white" style={{ marginTop: 3 }} />
                    <Text style={styles.buttonText}>Add Items</Text>
                  </View>
                </TouchableHighlight>
              </View>
              <EquipmentsTable
                items={equipmentData}
                width={"100%"}
                onEdit={(item, index) => {
                  editReservationItem(item, index);
                }}
                onDelete={(item, index) => {
                  const updatedEquipmentData = [
                    ...equipmentData.slice(0, index),
                    ...equipmentData.slice(index + 1),
                  ];
                  setEquipmentData(updatedEquipmentData);
                }}
                isExtra={true}
                extraWith={300}
              />
            </View>
          </div>
        </div>
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
          onAdded={(productFamily, quantity, extras) => {
            if (productFamily) {
              addReservationItem(productFamily, quantity, extras);
            }
          }}
          onUpdated={(oldLine, productFamily, quantity, extras) => {
            if (productFamily) {
              updateReservationItem(oldLine, productFamily, quantity, extras);
            }
            editReservationItem(null, null);
          }}
          isExtra={true}
        />
        <QuantitiesDetailsModal
          isModalVisible={isReviewQuantityModalVisible}
          closeModal={closeReviewQuantityCustomerModal}
          quantitiesData={reviewQuantities}
          onContinue={() => {
            submitReservation();
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
