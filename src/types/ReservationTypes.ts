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
};

export type ReservationsListResponseType = {
  reservations: Array<ReservationResponseType>;
};
