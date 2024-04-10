import { useContext } from 'react';
import { HambugerMenuHistoryContext } from '../providers/hambugermenuhistory/Context';

export const useHambugerMenuHistory = () => {
  return useContext(HambugerMenuHistoryContext);
};
