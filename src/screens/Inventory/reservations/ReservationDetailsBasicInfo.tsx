import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import CommonInput from '../../../common/components/input/CommonInput';
import { useSelector } from 'react-redux';
import { getReservationInfoSelector } from '../../../redux/selectors/reservationSelector';
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT } from '../../../common/constants/DateFormat';
import { CommonButton } from '../../../common/components/CommonButton/CommonButton';
import { Colors } from '../../../common/constants/Colors';

interface Props {
  width: number;
  inputPadding: number;
}

export const ReservationDetailsBasicInfo = ({ width, inputPadding }: Props) => {
  const reservationInfo = useSelector(getReservationInfoSelector);

  const inputWidth = useMemo(() => {
    return width * 0.5 - inputPadding;
  }, [width]);

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
          onChangeText={(_) => {}}
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
          onPress={() => {}}
          type="rounded"
          backgroundColor={Colors.Secondary.GREEN}
          label="Next Stage"
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
