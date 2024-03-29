export type PriceTableType = {
  id: number;
  table_name: string;
};

export type PriceTableDataType = {
  group_id: number;
  is_free: 1 | 0;
  extra_day: number;
  data: Array<number>;
};

export type PriceTableDataResponseType = Record<string, PriceTableDataType>;

export type PriceTablesDataRequestType = { table_id: number };

export type PriceTableHeaderData = {
  id: number;
  header: string;
  milliseconds: number;
};

export type PriceTableHeaderDataViewModel = {
  id: number;
  header: string;
  milliseconds: number;
  index: number;
};

export type PriceTableHeaderDataResponseType = Array<PriceTableHeaderData>;
