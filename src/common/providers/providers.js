import React, { ReactNode } from 'react';
import { AlertModalProvider } from './alertmodal/Provider'
import { BasicModalProvider } from './basicmodal/Provider';

export const Providers = ({ children }) => (
    <AlertModalProvider>
        <BasicModalProvider>
            {children}
        </BasicModalProvider>
    </AlertModalProvider>
)