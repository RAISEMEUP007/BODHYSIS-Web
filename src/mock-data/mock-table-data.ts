import UUID from 'pure-uuid';
import { TableData } from '../common/components/CommonTable/CommonTable';
import { MockBrandsData } from './mock-brands-data';
import { BOH_ID } from '../common/components/CommonTable/CommonTable';
import { LoremIpsum, loremIpsum } from 'lorem-ipsum';
import { ProductType } from '../types/ProductTypes';
import { EquipmentTableProductType } from '../types/SeasonTypes';

export const BIKE_SIZE = ['SMALL', 'MEDIUM', 'LARGE', 'EXTRA LARGE'];

export const SEASON = ['WINTER', 'SPRING', 'FALL', 'SUMMER'];

export const MOCK_CUSTOMER = ['CUSTOMER A', 'CUSTOMER B', 'CUSTOMER C', 'CUSTOMER D'];

export const MOCK_CATEGORIES = ['CATGEORY A', 'CATGEORY B', 'CATGEORY C', 'CATGEORY D'];

export const MOCK_STATUSES = ['UNRESERVED', 'PENDING', 'CHECKED OUT', 'RESERVED'];

export const MOCK_NAMES = ['BEACH CRUISER', 'MOUNTAIN', 'ELECTRIC', 'BMX', 'ROAD'];

export const InitalTableData: TableData = {
  rowHeader: [
    'Item ID',
    'Item, Name',
    'Quantity',
    'Category',
    'Size',
    'Brand',
    'Season',
    'Price',
    'Status',
    'Customer',
  ],
  tableData: [],
  keys: [
    'id',
    'product',
    'quantity',
    'category',
    'size',
    'brand',
    'season',
    'price',
    'status',
    'customer',
  ],
};

export const createEquipmentTableProduct = (
  product: ProductType,
  brand: string,
  quantity: number,
  season: string,
  price: string,
  customer: string
) => {
  const result: EquipmentTableProductType = {
    id: product?.id,
    product: product.product,
    quantity,
    category: product.category.category,
    size: product.size,
    brand: brand,
    season: season,
    price: price,
    status: product.status ?? 'UNKNOWN',
    customer: customer,
  };
  return result;
};

export const createMockProduct = () => {
  return {
    id: new UUID(1),
    values: [
      {
        value: Math.floor(Math.random() * 1000) + 10,
      },
      {
        value: MOCK_NAMES[Math.floor(Math.random() * 5)],
      },
      {
        value: Math.floor(Math.random() * 4) + 1,
      },
      {
        value: MOCK_CATEGORIES[Math.floor(Math.random() * 3)],
      },
      {
        value: BIKE_SIZE[Math.floor(Math.random() * 3)],
      },
      {
        value: MockBrandsData[Math.floor(Math.random() * 3)].displayLabel,
      },
      {
        value: SEASON[Math.floor(Math.random() * 4)],
      },
      {
        value: `${Math.floor(Math.random() * 120) + 80}.00`,
      },
      {
        value: MOCK_STATUSES[Math.floor(Math.random() * 3)],
      },
      {
        value: MOCK_CUSTOMER[Math.floor(Math.random() * 3)],
      },
    ],
  };
};

export const createMockProductFromId = (id: BOH_ID, season: string) => {
  return {
    id,
    values: [
      {
        value: id,
      },
      {
        value: MOCK_NAMES[Math.floor(Math.random() * 5)],
      },
      {
        value: Math.floor(Math.random() * 4) + 1,
      },
      {
        value: MOCK_CATEGORIES[Math.floor(Math.random() * 3)],
      },
      {
        value: BIKE_SIZE[Math.floor(Math.random() * 3)],
      },
      {
        value: MockBrandsData[Math.floor(Math.random() * 4)].displayLabel,
      },
      {
        value: season,
      },
      {
        value: `${Math.floor(Math.random() * 120) + 80}.00`,
      },
      {
        value: MOCK_STATUSES[Math.floor(Math.random() * 3)],
      },
      {
        value: MOCK_CUSTOMER[Math.floor(Math.random() * 3)],
      },
    ],
  };
};
