export type SeasonType = {
  id: number;
  season: string;
  is_active: boolean;
};

export type SeasonsArrayType = Array<SeasonType>;

export interface EquipmentTableProductType {
  id: number;
  product: string;
  quantity: number;
  category: string;
  line: string;
  size: string;
  brand: string;
  season: string;
  price: number;
  status: string | null;
  customer: string;
}
