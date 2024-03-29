import { useContext } from 'react';
import { AlertModalContext } from '../providers/alertmodal/Context';

export const useAlertModal = () => {
  return useContext(AlertModalContext);
};
