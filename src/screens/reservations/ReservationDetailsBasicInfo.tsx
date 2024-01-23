import React, { useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import CommonInput from '../../common/components/input/CommonInput';
import { useDispatch, useSelector } from 'react-redux';
import { getReservationInfoSelector } from '../../redux/selectors/reservationSelector';
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT } from '../../common/constants/DateFormat';
import { CommonButton } from '../../common/components/CommonButton/CommonButton';
import { Colors } from '../../common/constants/Colors';
import { setPromoCode } from '../../redux/slices/reservationSlice';
import { useRequestCreateReservationMutation } from '../../redux/slices/baseApiSlice';
import { ProductQuantityType } from '../../types/ReservationTypes';
import { useAlertModal } from '../../common/hooks/UseAlertModal';

interface Props {
  width: number;
  inputPadding: number;
  goBack?: () => void;
}

export const ReservationDetailsBasicInfo = ({ width, inputPadding, goBack }: Props) => {
  const reservationInfo = useSelector(getReservationInfoSelector);
  const dispatch = useDispatch();

  const inputWidth = useMemo(() => {
    return width * 0.5 - inputPadding;
  }, [width]);

  const products = reservationInfo.selectedProducts;

  const promoCode = reservationInfo.promoCode;

  const { startDate, endDate, selectedLocation } = reservationInfo;

  const { showAlert } = useAlertModal();

  const productsToSubmit: Array<ProductQuantityType> = useMemo(() => {
    return products.map((item) => {
      return {
        product_id: item.id,
        quantity: item.quantity,
        price_index: item.price_index,
        product_name: item.product,
        price: item.price

      };
    });
  }, [products]);

  const [createReservation, { data: createReservationData, error: createReservationError }] =
    useRequestCreateReservationMutation({});

  const valid = useMemo(() => {
    return productsToSubmit.length && startDate && endDate;
  }, [productsToSubmit, startDate, endDate]);

  useEffect(() => {
    if (createReservationError) {
      showAlert('error', 'Error creating reservation.');
    }
  }, [createReservationError]);

  useEffect(() => {
    if (createReservationData) {
      if (goBack) {
        goBack();
      }
      showAlert('success', 'Reservation Created.');
    }
  }, [createReservationData]);

  const submit = useCallback(() => {
    createReservation({
      products: productsToSubmit,
      start_time: reservationInfo.startDate,
      end_time: reservationInfo.endDate,
      start_location_id: selectedLocation.value.id,
      end_location_id: selectedLocation.value.id,
      promo_code: promoCode,
      customer_id: reservationInfo.selectedCustomer.value.id,
      brand_id: reservationInfo.selectedBrand.value.id,
    });
  }, [valid, productsToSubmit, startDate, endDate, promoCode, selectedLocation]);

  return (
    <View style={styles.container}>
      <View style={styles.rowInputContainer}>
        <CommonInput
          onChangeText={(_) => {}}
          width={inputWidth}
          value={reservationInfo.startDayjs.format(DEFAULT_DATE_FORMAT)}
          title="Start Date"
        />
        <CommonInput
          onChangeText={(_) => {}}
          width={inputWidth}
          value={reservationInfo.startDayjs.format(DEFAULT_TIME_FORMAT)}
          title="Start Time"
        />
      </View>
      <View style={styles.rowInputContainer}>
        <CommonInput
          onChangeText={(_) => {}}
          width={inputWidth}
          value={reservationInfo.endDayjs.format(DEFAULT_DATE_FORMAT)}
          title="End Date"
        />
        <CommonInput
          onChangeText={(_) => {}}
          width={inputWidth}
          value={reservationInfo.endDayjs.format(DEFAULT_TIME_FORMAT)}
          title="End Time"
        />
      </View>
      <View style={styles.rowInputContainer}>
        <CommonInput
          onChangeText={(_) => {}}
          width={inputWidth}
          title="Billable Days"
          value={reservationInfo.billableDays.toString()}
        />
        <CommonInput
          onChangeText={(_) => {}}
          width={inputWidth}
          value={reservationInfo.formattedDuration}
          title="Reservation Days"
        />
      </View>
      <View style={styles.rowInputContainer}>
        <CommonInput
          onChangeText={(value: string) => {
            dispatch(setPromoCode({ value }));
          }}
          width={inputWidth}
          placeholder="Discount Code"
          title="Discount Code"
        />
        <CommonInput
          onChangeText={(_) => {}}
          width={inputWidth}
          placeholder="Custom Price"
          title="Custom Price"
        />
      </View>
      <View style={styles.rowInputContainer}>
        <CommonInput
          onChangeText={(_) => {}}
          width={inputWidth}
          placeholder="Referer"
          title="Referer"
        />
        <CommonInput
          onChangeText={(_) => {}}
          value={
            reservationInfo.selectedProducts?.length > 0
              ? reservationInfo.selectedProducts[0].value?.price_group_id?.toString()
              : ''
          }
          width={inputWidth}
          placeholder="Group"
          title="Group"
        />
      </View>
      <View style={styles.rowInputContainer}>
        <CommonInput
          onChangeText={(_) => {}}
          value={reservationInfo.selectedLocation?.value?.location}
          width={inputWidth}
          placeholder="Start Location"
          title="Start Location"
        />
        <CommonInput
          onChangeText={(_) => {}}
          value={reservationInfo.selectedLocation?.value?.location}
          width={inputWidth}
          placeholder="End Location"
          title="End Location"
        />
      </View>
      <View style={styles.rowInputContainer}>
        <CommonButton
          onPress={() => {}}
          type="rounded"
          backgroundColor={Colors.Secondary.NAVY}
          label="Confirmed"
          containerStyle={styles.button}
        />
        <CommonButton
          onPress={() => {
            submit();
          }}
          type="rounded"
          backgroundColor={Colors.Secondary.GREEN}
          label="Submit"
          containerStyle={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  rowInputContainer: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 10,
    width: 120,
    marginRight: 20,
  },
});
