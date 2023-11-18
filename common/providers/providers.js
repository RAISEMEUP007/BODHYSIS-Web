import React, { ReactNode } from 'react';
import { ModalContextProvider } from './modal/provider'

export const Providers = ({ children }) => (
    <ModalContextProvider>
        {children}
    </ModalContextProvider>
)