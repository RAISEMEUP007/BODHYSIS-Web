import { useContext } from 'react';
import { ScreenSizesContext } from '../providers/screensizes/Context';

export const useScreenSize = () => {
  return useContext(ScreenSizesContext);
};
