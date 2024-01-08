export type ProductType = {
  id: number;
  product: string;
  category_id: number;
  family_id: number;
  line_id: number;
  size: string;
  quantity: number;
  description: string;
  item_id: string;
  barcode: string;
  serial_number: string;
  home_location: number;
  current_location: number;
  price_group_id: number;
  status: string | null;
  category: {
    category: string;
  };
  family: {
    family: string;
  };
  line: {
    line: string;
    size: string;
  };
  home_location_tbl: {
    location: string | null;
  };
  current_location_tbl: {
    location: string | null;
  };
};

export type ProductResponseType = Array<ProductType>;

export type ProductRquestType = { category_id: number; family_id: number; line_id: number };
