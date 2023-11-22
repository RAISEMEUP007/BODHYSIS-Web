import React, { ReactNode } from 'react';
import { AlertModalProvider } from './alertmodal/provider'
import { BasicModalProvider } from './basicmodal/provider';

export const Providers = ({ children }) => (
    <AlertModalProvider>
        <BasicModalProvider>
            {children}
        </BasicModalProvider>
    </AlertModalProvider>
)