import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import BasicLayout from '../../common/components/CustomLayout/BasicLayout';
import { useNavigation } from '@react-navigation/native';
import CommonInput from '../../common/components/input/CommonInput';
import { Colors } from '../../common/constants/Colors';
import Slots from '../../common/slots/slots';
import { CommonButton } from '../../common/components/CommonButton/CommonButton';
import { EquipmentDropdown, ProductSelection } from './EquipmentDropdown';
import { Modalize } from 'react-native-modalize';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { RESERVATION_FORMAT } from '../../common/constants/DateFormat';
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
  loadPriceTables,
  loadPriceLogic,
  loadPriceTableData,
} from '../../redux/slices/reservationSlice';
import {
  useRequestBrandsQuery,
  useRequestCustomersQuery,
  useRequestLocationsQuery,
  useRequestSeasonsQuery,
  useRequestPriceTablesQuery,
  useRequestProductQuantitiesByLineQuery,
  useRequestPriceGroupsQuery,
  useRequestPriceLogicDataQuery,
  useRequestPriceTableDataQuery,
  useRequestPriceTableHeaderDataQuery,
  useRequestProductsQuery,
} from '../../redux/slices/baseApiSlice';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import {
  CommonDropdown,
  DropdownData,
} from '../../common/components/CommonDropdown/CommonDropdown';
import { getReservationInfoSelector } from '../../redux/selectors/reservationSelector';
import { createEquipmentTableProduct } from '../../mock-data/mock-table-data';
import { BrandType } from '../../types/BrandType';
import { CustomerType } from '../../types/CustomerTypes';
import { LocationType } from '../../types/LocationType';
import { PriceTableHeaderDataViewModel } from '../../types/PriceTableTypes';
import { ReservationsList } from './ReservationsList';
import { CommonSelectDropdown } from '../../common/components/CommonSelectDropdown/CommonSelectDropdown';

interface Props {
  openInventory: () => void;
  goBack: () => void;
}

const CreateReservation = ({ openInventory, goBack }: Props) => {
  const modalizeRef = useRef<Modalize>(null);

  const [selectedDate, setSelectedDate] = useState<Date>(dayjs().toDate());

  const { showAlert } = useAlertModal();

  const [selectedSlot, setSelectedSlot] = useState<PriceTableHeaderDataViewModel | null>();

  const [showDetails, setShowDetails] = useState(false);

  const [showList, setShowList] = useState(false);

  const navigation = useNavigation();

  const reservationInfo = useSelector(getReservationInfoSelector);

  const [equipmentData, setEquipmentData] = useState<Array<ProductSelection>>([]);

  const { data: brandsData } = useRequestBrandsQuery(
    {},
    {
      refetchOnFocus: true,
    }
  );

  const { data: customersData } = useRequestCustomersQuery(
    {},
    {
      refetchOnFocus: true,
    }
  );

  const { data: locationsData } = useRequestLocationsQuery(
    {},
    {
      refetchOnFocus: true,
    }
  );

  const { data: seasonsData } = useRequestSeasonsQuery(
    {},
    {
      refetchOnFocus: true,
    }
  );

  const { data: priceTablesData } = useRequestPriceTablesQuery(
    {},
    {
      refetchOnFocus: true,
    }
  );

  const { data: productQuantitiesData } = useRequestProductQuantitiesByLineQuery(
    {},
    {
      refetchOnFocus: true,
    }
  );

  const { data: priceGroupsData } = useRequestPriceGroupsQuery(
    {},
    {
      refetchOnFocus: true,
    }
  );

  const { data: priceLogicData } = useRequestPriceLogicDataQuery(
    {},
    {
      refetchOnFocus: true,
    }
  );

  const { data: productsData } = useRequestProductsQuery({
    category_id: 0,
    family_id: 0,
    line_id: 0,
  });

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
    if (priceTablesData) {
      dispatch(loadPriceTables({ priceTables: priceTablesData }));
    }
  }, [priceTablesData]);

  useEffect(() => {
    if (priceGroupsData) {
      dispatch(loadPriceGroups({ priceGroups: priceGroupsData }));
    }
  }, [priceGroupsData]);

  useEffect(() => {
    if (priceLogicData) {
      dispatch(loadPriceLogic({ priceLogic: priceLogicData }));
    }
  }, [priceLogicData]);

  useEffect(() => {}, [reservationInfo.priceTableData]);

  // TODO: Combine into single hook
  const { data: priceTableData } = useRequestPriceTableDataQuery(
    {
      table_id: reservationInfo?.selectedPriceTable?.id,
    },
    { skip: !reservationInfo?.selectedPriceTable?.id, refetchOnFocus: true }
  );

  const { data: priceTableHeaderData, isLoading: priceTableHeaderDataLoading } =
    useRequestPriceTableHeaderDataQuery(
      { table_id: reservationInfo?.selectedPriceTable?.id },
      {
        skip: !reservationInfo?.selectedPriceTable?.id,
        refetchOnFocus: true,
      }
    );

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
    if (priceTableData) {
      dispatch(loadPriceTableData({ tableData: priceTableData }));
    }
  }, [priceTableData]);

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
    return day.toDate();
  }, []);

  const endDate = useMemo(() => {
    if (!selectedDate || !selectedSlot) {
      return null;
    }

    const milisecondsToAdd = selectedSlot.milliseconds ?? 1000 * 60 * 60 * 24;

    const startDay = dayjs(selectedDate);

    return startDay.add(milisecondsToAdd, 'milliseconds').toDate();
  }, [selectedDate, selectedSlot]);

  const renderInitial = () => {
    return (
      <BasicLayout
        containerStyle={styles.layoutContainer}
        screenName={'Create Reservation'}
        navigation={navigation}
        goBack={goBack}
      >
        <ScrollView>
          <View style={styles.outterContainer}>
            <CommonSelectDropdown
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
            <CommonSelectDropdown
              containerStyle={{
                paddingTop: 20,
                marginBottom: 20,
              }}
              width={250}
              onItemSelected={(item) => {
                console.log(item);
                dispatch(selectLocation({ location: item as any }));
              }}
              data={locationsDropdownData}
              placeholder="Select A Location"
              title={'Location'}
            />
            <CommonSelectDropdown
              containerStyle={{
                paddingTop: 20,
                marginBottom: 40,
              }}
              width={250}
              onItemSelected={(item) => {
                dispatch(selectBrand({ brand: item as any }));
              }}
              data={brandsDropdownData}
              placeholder="Select A Brand"
              title={'Brands'}
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
              items={priceTableHeaderData}
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
                products={productsData ?? []}
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
                  const products = equipmentData.map((item) => {
                    const maxQuantity: number = productQuantitiesData[item.value.line_id];

                    const priceGroup = reservationInfo.priceTableData[item.value.product];

                    let price = 0;

                    if (priceGroup && selectedSlot) {
                      const prices: Array<number> = priceGroup.data ?? [];
                      price = prices[selectedSlot.index];
                    }

                    if (item.quantity > maxQuantity) {
                      showAlert(
                        'warning',
                        `There are only ${maxQuantity} items available for this product.`
                      );
                    } else {
                      const product = createEquipmentTableProduct(
                        item.value,
                        reservationInfo.selectedBrand.displayLabel,
                        parseInt(item.quantity.toString()),
                        reservationInfo.selectedSeason.season,
                        price,
                        reservationInfo.selectedCustomer.displayLabel,
                        item.value.line.line,
                        selectedSlot.index
                      );
                      dispatch(addProduct(product));
                      return product;
                    }
                  });
                  dispatch(selectProducts({ products: products }));
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
        onCompletion={() => {
          setShowDetails(false);
          setShowList(true);
        }}
      />
    );
  }

  if (showList) {
    return <ReservationsList />;
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
