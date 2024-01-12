export type PriceLogicType = {
  id: number;
  brand_id: number;
  season_id: number;
  table_id: number;
  start_date: string | null;
  end_date: string | null;
  brand: {
    id: number;
    brand: string;
  };
  season: {
    id: number;
    season: string;
    is_active: boolean;
  };
  priceTable: {
    id: number;
    table_name: string;
  };
};
