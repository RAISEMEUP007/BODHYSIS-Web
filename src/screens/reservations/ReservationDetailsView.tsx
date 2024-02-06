import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRequestReservationDetailsQuery } from '../../redux/slices/baseApiSlice';
import { ReservationDetailsProductType } from '../../types/ReservationTypes';
import BasicLayout from '../../common/components/CustomLayout/BasicLayout';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_TIME } from '../../common/constants/DateFormat';
import dayjs from 'dayjs';

export const ReservationDetailsView = ({ openReservationScreen, data }) => {
  // const { data, error } = useRequestReservationDetailsQuery(
  //   {
  //     reservation_id: reservation_id,
  //   },
  //   {
  //     refetchOnFocus: true,
  //   }
  // );

  const reservation_id = data.id;

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <View style={styles.item} key={index.toString()}>
          <View style={styles.productBlock}>
            <Text style={styles.productLabel}>{'Name'}</Text>
            <Text style={styles.productText}>{item.product}</Text>
          </View>
          <View style={styles.productBlock}>
            <Text style={styles.productLabel}>{'Quantity'}</Text>
            <Text style={styles.productText}>{item.quantity}</Text>
          </View>

          <View style={styles.productBlock}>
            <Text style={styles.productLabel}>{'Price'}</Text>
            <Text style={styles.productText}>{item.price}</Text>
          </View>
          <View style={styles.productBlock}>
            <Text style={styles.productLabel}>{'Size'}</Text>
            <Text style={styles.productText}>{item.size}</Text>
          </View>
          <View style={styles.productBlock}>
            <Text style={styles.productLabel}>{'Barcode'}</Text>
            <Text style={styles.productText}>{item.barcode}</Text>
          </View>
          <View style={styles.productBlock}>
            <Text style={styles.productLabel}>{'Serial Number'}</Text>
            <Text style={styles.productText}>{item.serial_number}</Text>
          </View>
          <View style={styles.productBlock}>
            <Text style={styles.productLabel}>{'Status'}</Text>
            <Text style={styles.productText}>{item.status ?? 'Unknown'}</Text>
          </View>
          <View style={styles.productBlock}>
            <Text style={styles.productLabel}>{'Id'}</Text>
            <Text style={styles.productText}>{item.id}</Text>
          </View>
          <View style={styles.productBlock}>
            <Text style={styles.productLabel}>{'Line Id'}</Text>
            <Text style={styles.productText}>{item.line_id}</Text>
          </View>
          <View style={styles.productBlock}>
            <Text style={styles.productLabel}>{'Group Id'}</Text>
            <Text style={styles.productText}>{item.price_group_id}</Text>
          </View>
          <View style={styles.productBlock}>
            <Text style={styles.productLabel}>{'Category Id'}</Text>
            <Text style={styles.productText}>{item.category_id}</Text>
          </View>
        </View>
      );
    },
    []
  );

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.title}>{'Reservation Info'}</Text>
        <View style={styles.productBlock}>
          <Text style={styles.productLabel}>{'Start Date'}</Text>
          <Text>{dayjs(data.start_date).format(DEFAULT_DATE_TIME)}</Text>
        </View>
        <View style={styles.productBlock}>
          <Text style={styles.productLabel}>{'End Date'}</Text>
          <Text>{dayjs(data.end_date).format(DEFAULT_DATE_TIME)}</Text>
        </View>
        <View style={styles.productBlock}>
          <Text style={styles.productLabel}>{'Customer Id'}</Text>
          <Text>{data.customer_id}</Text>
        </View>
        <View style={styles.productBlock}>
          <Text style={styles.productLabel}>{'Promo Code'}</Text>
          <Text>{data.promo_code ?? 'NONE'}</Text>
        </View>
        <View style={styles.productBlock}>
          <Text style={styles.productLabel}>{'Start Location'}</Text>
          <Text>{data.start_location_name}</Text>
        </View>
        <View style={styles.productBlock}>
          <Text style={styles.productLabel}>{'End Location'}</Text>
          <Text>{data.end_location_name}</Text>
        </View>
      </View>
    );
  };

  const renderList = () => {
    return <FlatList data={data?.products} renderItem={renderItem} />;
  };

  if (!data) {
    return null;
  }

  return (
    <BasicLayout goBack={openReservationScreen} screenName="Reservation Details">
      <View style={styles.container}>
        {renderHeader()}
        <Text style={styles.title}>{'Equipment'}</Text>
        {renderList()}
      </View>
    </BasicLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  productText: {
    fontSize: 15,
    width: 400,
  },
  productLabel: {
    fontSize: 15,
    fontWeight: '600',
    width: 120,
  },
  header: {
    marginBottom: 40,
  },
  productBlock: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
  },
  item: {
    marginBottom: 20,
  },
});
