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
  size: string;
  brand: string;
  season: string;
  price: string;
  status: string | null;
  customer: string;
}
