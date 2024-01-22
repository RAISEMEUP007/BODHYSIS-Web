import { createSlice, isAllOf, isAnyOf } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import dayjs, { Dayjs } from 'dayjs';
import { TableData } from '../../common/components/CommonTable/CommonTable';

import { InitalTableData } from '../../mock-data/mock-table-data';
import { DropdownItem } from '../../common/components/CommonDropdown/CommonDropdown';
import { CustomerType } from '../../types/CustomerTypes';
import { LocationType } from '../../types/LocationType';
import { SeasonType } from '../../types/SeasonTypes';
import { ProductSelection } from '../../screens/Inventory/reservations/EquipmentDropdown';
import { PriceTableDataResponseType, PriceTableType } from '../../types/PriceTableTypes';
import { PriceGroupArrayType, PriceGroupType } from '../../types/PriceGroupType';
import { PriceLogicType } from '../../types/PriceLogicTypes';
import { BrandType } from '../../types/BrandType';

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
  selectedBrand: DropdownItem<BrandType> | null;
  selectedCustomer: DropdownItem<CustomerType> | null;
  selectedLocation: DropdownItem<LocationType> | null;
  selectedSeason: SeasonType | null;
  selectedProducts: Array<ProductSelection>;
  priceTables: Array<PriceTableType>;
  priceTablesMap: Record<number, PriceTableType>;
  priceGroups: PriceGroupArrayType;
  priceGroupsMap: Record<number, PriceGroupType>;
  priceLogic: Array<PriceLogicType> | null;
  selectedPriceTable: PriceTableType | null;
  priceTableData: PriceTableDataResponseType | null;
  promoCode: string | null;
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
  priceTables: [],
  priceTablesMap: {},
  priceLogic: null,
  selectedPriceTable: null,
  priceTableData: null,
  promoCode: null,
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
      const { brand } = { ...action.payload };
      state.selectedBrand = brand;
    },
    selectCustomer: (state, action: PayloadAction<{ customer: DropdownItem<CustomerType> }>) => {
      const { customer } = action.payload;
      state.selectedCustomer = customer;
    },
    selectLocation: (state, action: PayloadAction<{ location: DropdownItem<LocationType> }>) => {
      const { location } = action.payload;
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
    loadPriceTables: (state, action: PayloadAction<{ priceTables: Array<PriceTableType> }>) => {
      const { priceTables } = action.payload;
      state.priceTables = priceTables;

      const result: Record<number, PriceTableType> = {};

      priceTables.forEach((item) => {
        result[item.id] = item;
      });

      state.priceTablesMap = result;
    },
    loadPriceGroups: (state, action: PayloadAction<{ priceGroups: Array<PriceGroupType> }>) => {
      const { priceGroups } = action.payload;
      state.priceGroups = priceGroups;

      const result: Record<number, PriceGroupType> = {};

      priceGroups.forEach((item) => {
        result[item.id] = item;
      });

      state.priceGroupsMap = result;
    },
    loadPriceLogic: (state, action: PayloadAction<{ priceLogic: Array<PriceLogicType> }>) => {
      const { priceLogic } = action.payload;
      state.priceLogic = priceLogic;
    },
    loadPriceTableData: (
      state,
      action: PayloadAction<{ tableData: PriceTableDataResponseType }>
    ) => {
      const { tableData } = action.payload;
      state.priceTableData = tableData;
    },
    setPromoCode: (state, action: PayloadAction<{ value: string }>) => {
      const { value } = action.payload;
      state.promoCode = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isAnyOf(selectBrand, selectSeason, loadPriceLogic, loadPriceTables), (state) => {
        const { selectedSeason, priceLogic, selectedBrand, priceTablesMap } = state;
        if (
          !selectedSeason?.season ||
          !selectedBrand?.value?.brand ||
          !priceLogic.length ||
          !Object.keys(priceTablesMap).length
        ) {
          return;
        }

        const selectedTable = priceLogic.find((item) => {
          return (
            item.brand.brand === selectedBrand.value.brand &&
            item.season.season === selectedSeason.season
          );
        })?.priceTable;

        if (selectedTable) {
          state.selectedPriceTable = selectedTable;
        }
      })
      // You can chain calls, or have separate `builder.addCase()` lines each time
      // You can match a range of action types
      // and provide a default case if no other handlers matched
      .addDefaultCase((state, action) => {});
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
  setPromoCode,
  loadPriceTables,
  loadPriceGroups,
  loadPriceLogic,
  loadPriceTableData,
} = reservationSlice.actions;

export default reservationSlice.reducer;
