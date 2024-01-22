import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { ScreenSizesContext } from './Context';

export const ScreenSizesProvider = ({ children }) => {
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(true);

  useEffect(() => {
    if (Platform.OS == 'web') {
      const handleResize = () => {
        setIsLargeScreen(window.innerWidth >= 1080);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    } else {
      setIsLargeScreen(false);
    }
  }, []);

  const sizeValues = {
    isLargeScreen,
  };

  return <ScreenSizesContext.Provider value={sizeValues}>{children}</ScreenSizesContext.Provider>;
};
