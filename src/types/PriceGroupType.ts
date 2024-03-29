export interface PriceGroupType {
  id: number;
  price_group: string;
  table_id: number;
  is_free: boolean;
  extra_day: number;
}

export type PriceGroupArrayType = Array<PriceGroupType>;
