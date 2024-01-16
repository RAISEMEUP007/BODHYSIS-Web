import React from 'react';
import { AlertModalProvider } from './alertmodal/Provider';
import { ConfirmModalProvider } from './confirmmodal/Provider';
import { BasicModalProvider } from './basicmodal/Provider';
import { ScreenSizesProvider } from './screensizes/Provider';

export const Providers = ({ children }) => (
  <ScreenSizesProvider>
    <AlertModalProvider>
      <ConfirmModalProvider>
        <BasicModalProvider>{children}</BasicModalProvider>
      </ConfirmModalProvider>
    </AlertModalProvider>
  </ScreenSizesProvider>
);
