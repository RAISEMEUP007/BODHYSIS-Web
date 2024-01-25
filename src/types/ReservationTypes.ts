export type ProductQuantityType = {
  product_id: number;
  quantity: number;
  product_name: string;
  price: number;
  brand: string;
};

export type CreateReservationRequestType = {
  products: Array<ProductQuantityType>;
  start_: string;
  end_time: string;
  promo_code: string;
  start_location_id: number;
  end_location_id: number;
  customer_id: number;
  brand_id: number;
};

export type ReservationResponseType = {
  products: Array<ProductQuantityType>;
  start_date: string;
  end_date: string;
  promo_code: string;
  start_location_id: number;
  end_location_id: number;
  customer_id: number;
  brand_id: number;
  createdAt: string;
  updatedAt: string;
  id: number;
};

export type ReservationDetailsProductType = {
  id: number;
  product: string;
  category_id: number;
  family_id: number;
  line_id: number;
  size: string;
  quantity: number;
  description: string;
  item_id: number;
  barcode: string;
  serial_number: string;
  home_location: number;
  current_location: number;
  price_group_id: number;
  status: string | null;
};

export type ReservationDetailsResponseType = {
  start_date: string;
  end_date: string;
  promo_code: string;
  start_location_id: number;
  end_location_id: number;
  start_location_name: string;
  end_location_name: string;
  customer_id: number;
  brand_id: number;
  createdAt: string;
  updatedAt: string;
  products: Array<ReservationDetailsProductType>;
};

export type ReservationsListResponseType = {
  reservations: Array<ReservationResponseType>;
};
