import { useContext } from 'react';
import { ConfirmModalContext } from '../providers/confirmmodal/Context';

export const useConfirmModal = () => {
  return useContext(ConfirmModalContext);
};
