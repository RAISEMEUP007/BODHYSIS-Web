import React, { ReactNode } from 'react';
import { ModalProvider } from './modal/provider'

export const Providers = ({ children }) => (
    <ModalProvider>
        {children}
    </ModalProvider>
)