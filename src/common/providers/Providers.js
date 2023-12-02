import React, { ReactNode } from 'react';
import { AlertModalProvider } from './alertmodal/Provider';
import { ConfirmModalProvider } from './confirmmodal/Provider';
import { BasicModalProvider } from './basicmodal/Provider';

export const Providers = ({ children }) => (
  <AlertModalProvider>
    <ConfirmModalProvider>
      <BasicModalProvider>
        {children}
      </BasicModalProvider>
    </ConfirmModalProvider>
  </AlertModalProvider>
)