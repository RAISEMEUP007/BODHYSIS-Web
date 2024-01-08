export type CustomerType = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  home_address: string;
  city: string;
  state: string;
  zipcode: string;
  mobile_phone: string;
  country_id: number;
  language_id: number;
  home_location: number;
  delivery_street_number: string;
  delivery_street_property_name: string;
  delivery_area_plantation: string;
  marketing_opt_in: number;
  createdAt: string;
  updatedAt: string;
  country: {
    country: string;
  };
  language: {
    language: string;
  };
  home_location_tbl: {
    location: string;
  };
};

export type CustomersResponseType = Array<CustomerType>;
