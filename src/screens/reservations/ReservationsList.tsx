import React, { useEffect, useMemo } from 'react';
import {
  CommonTable,
  ObjectWithId,
  RowHeaderType,
  TableData,
} from '../../common/components/CommonTable/CommonTable';
import { useRequestReservationsListQuery } from '../../redux/slices/baseApiSlice';
import { useWindowDimensions } from 'react-native';
import BasicLayout from '../../common/components/CustomLayout/BasicLayout';
import dayjs from 'dayjs';
import { DEFAULT_DATE_TIME } from '../../common/constants/DateFormat';

interface Props {
  navigation: any;
  goBack: () => void;
}

export const ReservationsList = ({ navigation, goBack }) => {
  const { data: reservationsData } = useRequestReservationsListQuery({}, { refetchOnFocus: true });

  const { width } = useWindowDimensions();

  useEffect(() => {
    console.log(reservationsData);
  }, [reservationsData]);
  const rowHeaderData: RowHeaderType = useMemo(() => {
    return [
      'Start Time',
      'End Time',
      'Promo Code',
      'Start Location Id',
      'End Location Id',
      'Customer Id',
    ];
  }, []);

  const tableData: TableData = useMemo(() => {
    return {
      rowHeader: rowHeaderData,
      tableData:
        reservationsData?.reservations.map((item) => {
          return {
            ...item,
            promo_code: item.promo_code ?? 'NONE',
            start_date: dayjs(item.start_date).format(DEFAULT_DATE_TIME),
            end_date: dayjs(item.start_date).format(DEFAULT_DATE_TIME),
          };
        }) ?? [],
      keys: [
        'start_date',
        'end_date',
        'promo_code',
        'start_location_id',
        'end_location_id',
        'customer_id',
      ],
    };
  }, [rowHeaderData, reservationsData]);

  return (
    <BasicLayout goBack={goBack} navigation={navigation} screenName={'Reservations List'}>
      <CommonTable
        showRemove={false}
        onPressItem={(item) => {}}
        width={width - 200}
        data={tableData}
      />
    </BasicLayout>
  );
};

/*
export type ReservationResponseType = {
  products: Array<ProductQuantityType>;
  start_time: string;
  end_time: string;
  promo_code: string;
  start_location_id: number;
  end_location_id: number;
  customer_id: number;
  brand_id: number;
  createdAt: string;
  updatedAt: string;
};
*/
