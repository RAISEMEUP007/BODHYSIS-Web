import React, { ReactNode } from 'react';
import { AlertModalProvider } from './alertmodal/provider'

export const Providers = ({ children }) => (
    <AlertModalProvider>
        {children}
    </AlertModalProvider>
)