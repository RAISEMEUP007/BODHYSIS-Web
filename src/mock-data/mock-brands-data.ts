import { DropdownData } from '../common/components/CommonDropdown/CommonDropdown';
import { BOH_ID } from '../common/components/CommonTable/CommonTable';

export type Brand = {
  name: string;
  id: BOH_ID;
};

export const MockBrandsData: DropdownData<Brand> = [
  {
    index: 0,
    value: {
      name: 'Cannondale',
      id: 0,
    },
    displayLabel: 'Cannondale',
  },
  {
    index: 1,
    value: {
      name: 'Trek',
      id: 1,
    },
    displayLabel: 'Trek',
  },
  {
    index: 2,
    value: {
      name: 'Santa Cruz',
      id: 2,
    },
    displayLabel: 'Santa Cruz',
  },
  {
    index: 3,
    value: {
      name: 'Fuji',
      id: 3,
    },
    displayLabel: 'Fuji',
  },
  {
    index: 4,
    value: {
      name: 'Giant',
      id: 4,
    },
    displayLabel: 'Giant',
  },
];
