import React from 'react';
import { Platform } from 'react-native';
import {loadStripe} from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { STRIPE_PUBLIC_KEY } from '../../../env';
import { AlertModalProvider } from './alertmodal/Provider';
import { ConfirmModalProvider } from './confirmmodal/Provider';
import { BasicModalProvider } from './basicmodal/Provider';
import { ScreenSizesProvider } from './screensizes/Provider';

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const StripeProviderBaseoffPlatform = ({ children }) => {
  if (Platform.OS === 'web') {
    return <Elements stripe={stripePromise}>{children}</Elements>;
  } else {
    return children;
  }
}

export const Providers = ({ children }) => (
  <StripeProviderBaseoffPlatform>
    <ScreenSizesProvider>
      <AlertModalProvider>
        <ConfirmModalProvider>
          <BasicModalProvider>{children}</BasicModalProvider>
        </ConfirmModalProvider>
      </AlertModalProvider>
    </ScreenSizesProvider>
  </StripeProviderBaseoffPlatform>
);
