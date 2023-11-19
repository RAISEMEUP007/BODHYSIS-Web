import { useContext } from 'react';
import { AlertModalContext } from '../providers/alertmodal/context'

export const useAlertModal = () => {
    return useContext(AlertModalContext);
};