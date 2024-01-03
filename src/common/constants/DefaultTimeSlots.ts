import { SlotType } from '../slots/slots';

const MILESECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const MILISECONDS_PER_HOUR = MILESECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR;

export const DEFAULT_TIME_SLOTS: Array<SlotType> = [
  {
    label: '8h',
    value: MILISECONDS_PER_HOUR * 8,
  },
  {
    label: '16h',
    value: MILISECONDS_PER_HOUR * 16,
  },
  {
    label: '24h',
    value: MILISECONDS_PER_HOUR * 24,
  },
  {
    label: '1d',
    value: MILISECONDS_PER_HOUR * 24,
  },
  {
    label: '2d',
    value: MILISECONDS_PER_HOUR * 24 * 2,
  },
  {
    label: '3d',
    value: MILISECONDS_PER_HOUR * 24 * 3,
  },
  {
    label: '4d',
    value: MILISECONDS_PER_HOUR * 24 * 4,
  },
  {
    label: '5d',
    value: MILISECONDS_PER_HOUR * 24 * 5,
  },
  {
    label: '1w',
    value: MILISECONDS_PER_HOUR * 24 * 7,
  },
  {
    label: '2w',
    value: MILISECONDS_PER_HOUR * 24 * 14,
  },
];
