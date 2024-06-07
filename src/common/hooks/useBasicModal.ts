import { useContext } from 'react';
import { BasicModalContext } from '../providers/basicmodal/Context';

export const useBasicModal = () => {
  return useContext(BasicModalContext);
};
