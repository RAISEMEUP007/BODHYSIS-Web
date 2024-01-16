export type ProductQuantityType = {
  product_id: number;
  quantity: number;
};

export type CreateReservationRequestType = {
  products: Array<ProductQuantityType>;
  start_time: string;
  end_time: string;
  promo_code: string;
  start_location_id: number;
  end_location_id: number;
};
