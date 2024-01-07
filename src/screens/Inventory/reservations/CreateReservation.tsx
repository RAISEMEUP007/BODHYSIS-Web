import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import BasicLayout from '../../../common/components/CustomLayout/BasicLayout';
import { useNavigation } from '@react-navigation/native';
import CommonInput from '../../../common/components/input/CommonInput';
import { Colors } from '../../../common/constants/Colors';
import Slots, { SlotType } from '../../../common/slots/slots';
import { DEFAULT_TIME_SLOTS } from '../../../common/constants/DefaultTimeSlots';
import { CommonButton } from '../../../common/components/CommonButton/CommonButton';
import { EquipmentDropdown, ProductSelection } from './EquipmentDropdown';
import { Modalize } from 'react-native-modalize';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { RESERVATION_FORMAT } from '../../../common/constants/DateFormat';
import { CreateReservationDetails } from './CreateReservationDetails';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateReservation,
  selectBrand,
  addProduct,
  selectCustomer,
  selectLocation,
  selectSeason,
  selectProducts,
  loadPriceGroups,
} from '../../../redux/slices/reservationSlice';
import {
  useRequestBrandsQuery,
  useRequestCustomersQuery,
  useRequestLocationsQuery,
  useRequestProductsMutation,
  useRequestSeasonsQuery,
  useRequestPriceTablesQuery,
} from '../../../redux/slices/baseApiSlice';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import {
  CommonDropdown,
  DropdownData,
} from '../../../common/components/CommonDropdown/CommonDropdown';
import { getReservationInfoSelector } from '../../../redux/selectors/reservationSelector';
import { createEquipmentTableProduct } from '../../../mock-data/mock-table-data';
import { BrandType } from '../../../types/BrandType';
import { CustomerType } from '../../../types/CustomerTypes';
import { LocationType } from '../../../types/LocationType';
import { MOCK_PROUCT_DATA } from '../../../mock-data/mock-products-data';

interface Props {
  openInventory: () => void;
}

const CreateReservation = ({ openInventory }: Props) => {
  const modalizeRef = useRef<Modalize>(null);

  const [selectedDate, setSelectedDate] = useState<Date>(
    dayjs().set('hours', 0).set('minutes', 0).set('seconds', 0).set('milliseconds', 0).toDate()
  );

  const { showAlert } = useAlertModal();

  const [selectedSlot, setSelectedSlot] = useState<SlotType | null>();

  const [showDetails, setShowDetails] = useState(false);

  const navigation = useNavigation();

  const reservationInfo = useSelector(getReservationInfoSelector);

  const [equipmentData, setEquipmentData] = useState<Array<ProductSelection>>([]);

  const { data: brandsData } = useRequestBrandsQuery({});

  const { data: customersData } = useRequestCustomersQuery({});

  const { data: locationsData } = useRequestLocationsQuery({});

  const { data: seasonsData } = useRequestSeasonsQuery({});

  const { data: priceGroupData } = useRequestPriceTablesQuery({});

  const [requestProducts, productsData] = useRequestProductsMutation();

  console.log('priceGroupData', priceGroupData);

  const dispatch = useDispatch();

  const valid = useMemo(() => {
    return (
      selectedSlot &&
      reservationInfo.selectedBrand &&
      equipmentData.length > 0 &&
      !!reservationInfo.selectedCustomer
    );
  }, [
    selectedSlot,
    reservationInfo.selectedBrand,
    equipmentData.length,
    reservationInfo.selectedCustomer,
  ]);

  useEffect(() => {
    if (priceGroupData) {
      dispatch(loadPriceGroups({ priceGroups: priceGroupData }));
    }
  }, [priceGroupData]);

  useEffect(() => {
    if (seasonsData?.length > 0) {
      seasonsData.forEach((item) => {
        if (item.is_active) {
          dispatch(selectSeason({ season: item }));
        }
      });
    }
  }, [seasonsData]);

  useEffect(() => {
    requestProducts({
      category_id: 0,
      family_id: 0,
      line_id: 0,
    });
  }, []);

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

  const sanitizeDate = useCallback((date: Date) => {
    const day = dayjs(date);
    const result = day.set('hours', 0).set('minutes', 0).set('seconds', 0).set('milliseconds', 0);
    return result.toDate();
  }, []);

  const endDate = useMemo(() => {
    if (!selectedDate || !selectedSlot) {
      return null;
    }

    const milisecondsToAdd = selectedSlot.value;

    const startDay = dayjs(selectedDate);

    return startDay.add(milisecondsToAdd, 'milliseconds').toDate();
  }, [selectedDate, selectedSlot]);

  const renderInitial = () => {
    return (
      <BasicLayout
        containerStyle={styles.layoutContainer}
        screenName={'Create Reservation'}
        navigation={navigation}
      >
        <ScrollView>
          <View style={styles.outterContainer}>
            <CommonDropdown
              containerStyle={{
                paddingTop: 20,
                marginBottom: 20,
              }}
              width={250}
              onItemSelected={(item) => {
                dispatch(selectCustomer({ customer: item as any }));
              }}
              data={customersDropdownData}
              placeholder="Select A Customer"
              title={'Customers'}
            />
            <CommonDropdown
              containerStyle={{
                paddingTop: 20,
                marginBottom: 20,
              }}
              width={250}
              onItemSelected={(item) => {
                dispatch(selectLocation({ location: item as any }));
              }}
              data={locationsDropdownData}
              placeholder="Select A Location"
              title={'Location'}
            />
            <View style={{ ...styles.timeContainer, width: 400 }}>
              <CommonInput
                onChangeText={() => {}}
                onFocus={() => {
                  modalizeRef.current.open();
                }}
                value={selectedDate && dayjs(selectedDate).format(RESERVATION_FORMAT)}
                width={190}
                title={'Pick Up Time'}
                placeholder="Select Date"
              />
              <CommonInput
                onChangeText={() => {}}
                value={endDate && dayjs(endDate).format(RESERVATION_FORMAT)}
                width={190}
                title={'Drop Off Time'}
              />
            </View>
            <Slots
              onSelect={(item) => {
                setSelectedSlot(item);
              }}
              items={DEFAULT_TIME_SLOTS}
            />
            <CommonDropdown
              containerStyle={{
                paddingTop: 20,
              }}
              width={250}
              onItemSelected={(item) => {
                dispatch(selectBrand({ brand: item as any }));
              }}
              data={brandsDropdownData}
              placeholder="Select A Brand"
              title={'Brands'}
            />
            <Text style={styles.equipmentText}>{'Equipment'}</Text>
            <CommonButton
              onPress={() => {}}
              label={'Search'}
              backgroundColor={Colors.Secondary.NAVY}
              type={'rounded'}
              textColor={Colors.Neutrals.WHITE}
            />

            {reservationInfo.selectedBrand && (
              <EquipmentDropdown
                products={MOCK_PROUCT_DATA}
                onChange={(data) => {
                  setEquipmentData(data);
                }}
              />
            )}
            <View style={{ flexDirection: 'row', paddingTop: 20 }}>
              <CommonButton
                width={177}
                onPressWhileDisabled={() => {
                  showAlert(
                    'warning',
                    'Please select a customer, a brand, a prooduct, and a drop-off time.'
                  );
                }}
                onPress={() => {
                  setShowDetails(true);
                  dispatch(
                    updateReservation({
                      startDate: selectedDate.toISOString(),
                      endDate: endDate && endDate.toISOString(),
                    })
                  );
                  equipmentData.map((item) => {
                    const product = createEquipmentTableProduct(
                      item.value,
                      reservationInfo.selectedBrand.displayLabel,
                      item.quantity,
                      reservationInfo.selectedSeason.season,
                      '0.00',
                      reservationInfo.selectedCustomer.displayLabel
                    );
                    dispatch(addProduct(product));
                    dispatch(selectProducts({ products: equipmentData }));
                  });
                }}
                label={'Create Reservation'}
                disabledConfig={{ backgroundColor: Colors.Neutrals.DARK, disabled: !valid }}
                backgroundColor={Colors.Secondary.GREEN}
                type={'rounded'}
                textColor={Colors.Neutrals.WHITE}
                containerStyle={{
                  marginRight: 20,
                }}
              />
              <CommonButton
                onPress={() => {}}
                label={'Cancel'}
                backgroundColor={Colors.Secondary.MAROON}
                type={'rounded'}
                textColor={Colors.Neutrals.WHITE}
              />
            </View>
          </View>
        </ScrollView>
        <Modalize ref={modalizeRef}>
          <View style={styles.modal}>
            <Text style={styles.selectDateModalText}>{'Select Date'}</Text>
            <DatePicker
              onChange={(date) => {
                modalizeRef.current.close();
                setSelectedDate(sanitizeDate(date));
              }}
            />
          </View>
        </Modalize>
      </BasicLayout>
    );
  };

  if (showDetails) {
    return (
      <CreateReservationDetails
        goBack={() => {
          setShowDetails(false);
        }}
      />
    );
  }

  return renderInitial();
};

const styles = StyleSheet.create({
  layoutContainer: {
    backgroundColor: Colors.Neutrals.WHITE,
  },
  outterContainer: {
    padding: 20,
    backgroundColor: Colors.Neutrals.WHITE,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.Neutrals.WHITE,
  },
  timeContainer: {
    flexDirection: 'row',
  },
  equipmentText: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
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
});

export default CreateReservation;
