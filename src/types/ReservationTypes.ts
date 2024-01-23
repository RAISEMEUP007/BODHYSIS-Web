export type ProductQuantityType = {
  product_id: number;
  quantity: number;
  product_name: string
};

export type CreateReservationRequestType = {
  products: Array<ProductQuantityType>;
  start_time: string;
  end_time: string;
  promo_code: string;
  start_location_id: number;
  end_location_id: number;
  customer_id: number
  brand_id: number
};
