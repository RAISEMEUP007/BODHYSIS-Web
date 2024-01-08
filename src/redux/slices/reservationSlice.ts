import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import dayjs, { Dayjs } from 'dayjs';
import { TableData } from '../../common/components/CommonTable/CommonTable';

import { InitalTableData } from '../../mock-data/mock-table-data';
import { Brand } from '../../mock-data/mock-brands-data';
import { DropdownItem } from '../../common/components/CommonDropdown/CommonDropdown';
import { CustomerType } from '../../types/CustomerTypes';
import { LocationType } from '../../types/LocationType';
import { SeasonType } from '../../types/SeasonTypes';
import { ProductSelection } from '../../screens/Inventory/reservations/EquipmentDropdown';
import { PriceTableArrayType, PriceTableType } from '../../types/PriceTableTypes';

export interface ReservationState {
  startDate: string | null;
  endDate: string | null;
  reservationDuration: string | null;
  billableDays: number;
  startDayjs: Dayjs | null;
  endDayjs: Dayjs | null;
  durationDays: number;
  durationHours: number;
  formattedDuration: string;
  reservationTableData: TableData;
  selectedBrand: DropdownItem<Brand> | null;
  selectedCustomer: DropdownItem<CustomerType> | null;
  selectedLocation: DropdownItem<LocationType> | null;
  selectedSeason: SeasonType | null;
  selectedProducts: Array<ProductSelection>;
  priceGroups: PriceTableArrayType;
  priceGroupsMap: Record<number, PriceTableType>;
}

const initialState: ReservationState = {
  startDate: null,
  endDate: null,
  startDayjs: null,
  endDayjs: null,
  reservationDuration: null,
  billableDays: 1,
  durationDays: 0,
  durationHours: 0,
  formattedDuration: '',
  reservationTableData: InitalTableData,
  selectedBrand: null,
  selectedCustomer: null,
  selectedLocation: null,
  selectedSeason: null,
  selectedProducts: [],
  priceGroups: [],
  priceGroupsMap: {},
};

export const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    updateReservation: (
      state,
      action: PayloadAction<{
        startDate: string;
        endDate: string;
      }>
    ) => {
      const { startDate, endDate } = action.payload;
      state.startDate = startDate;
      state.endDate = endDate;

      const startDayjs = dayjs(startDate);
      const endDayjs = dayjs(endDate);

      state.startDayjs = startDayjs;
      state.endDayjs = endDayjs;

      const durationDays = endDayjs.diff(startDayjs, 'days');
      const durationHours = endDayjs.diff(startDayjs, 'hours');

      state.durationDays = durationDays;
      state.durationHours = durationHours;

      state.formattedDuration =
        durationDays > 0 ? `${durationDays} days` : `${durationHours} hours`;

      if (durationDays > 1) {
        state.durationDays = Math.ceil(durationDays);
        state.billableDays = Math.ceil(durationDays);
      }
    },
    removeProduct: (state, action: PayloadAction<{ id: number | string }>) => {
      const { id } = action.payload;

      const tableData = state.reservationTableData.tableData;

      const index = tableData.findIndex((item) => {
        return item.id === id;
      });

      if (index >= 0) {
        state.reservationTableData.tableData.splice(index, 1);
      }
    },
    addProduct: (state, action: PayloadAction<any>) => {
      const tableData = state.reservationTableData.tableData;
      tableData.push(action.payload);
      state.reservationTableData.tableData = tableData;
    },
    selectBrand: (state, action: PayloadAction<{ brand: DropdownItem<Brand> }>) => {
      const { brand } = action.payload;
      state.selectedBrand = brand;
    },
    selectCustomer: (state, action: PayloadAction<{ customer: DropdownItem<CustomerType> }>) => {
      const { customer } = action.payload;
      console.log('selected customer', customer);
      state.selectedCustomer = customer;
    },
    selectLocation: (state, action: PayloadAction<{ location: DropdownItem<LocationType> }>) => {
      const { location } = action.payload;
      console.log('selected location', location);
      state.selectedLocation = location;
    },
    selectSeason: (state, action: PayloadAction<{ season: SeasonType }>) => {
      const { season } = action.payload;
      state.selectedSeason = season;
    },
    selectProducts: (state, action: PayloadAction<{ products: Array<ProductSelection> }>) => {
      const { products } = action.payload;
      state.selectedProducts = products;
    },
    loadPriceGroups: (state, action: PayloadAction<{ priceGroups: PriceTableArrayType }>) => {
      const { priceGroups } = action.payload;
      state.priceGroups = priceGroups;

      const result: Record<number, PriceTableType> = {};

      Object.values(priceGroups).forEach((item) => {
        result[item.id] = item;
      });

      state.priceGroupsMap = result;
    },
  },
});

export const {
  updateReservation,
  removeProduct,
  addProduct,
  selectBrand,
  selectCustomer,
  selectLocation,
  selectSeason,
  selectProducts,
  loadPriceGroups,
} = reservationSlice.actions;

export default reservationSlice.reducer;
