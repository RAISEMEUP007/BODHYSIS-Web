import { useContext } from 'react';
import { BasicModalContext } from '../providers/basicmodal/context'

export const useBasicModal = () => {
    return useContext(BasicModalContext);
};