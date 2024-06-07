import React from 'react';
import { Platform } from 'react-native';
import {loadStripe} from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Provider as PaperProvider } from 'react-native-paper';

import { AlertModalProvider } from './alertmodal/Provider';
import { ConfirmModalProvider } from './confirmmodal/Provider';
import { BasicModalProvider } from './basicmodal/Provider';
import { ScreenSizesProvider } from './screensizes/Provider';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { HambugerMenuHisotryProvider } from './hambugermenuhistory/Provider';

// const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

// const StripeProviderBaseoffPlatform = ({ children }) => {
//   if (Platform.OS === 'web') {
//     return <Elements stripe={stripePromise}>{children}</Elements>;
//   } else {
//     return children;
//   }
// }

export const Providers = ({ children }) => (
  <AutocompleteDropdownContextProvider>
    {/* <StripeProviderBaseoffPlatform> */}
      <ScreenSizesProvider>
        <PaperProvider>
          <AlertModalProvider>
            <ConfirmModalProvider>
              <BasicModalProvider>
                <HambugerMenuHisotryProvider>
                  {children}
                </HambugerMenuHisotryProvider>
              </BasicModalProvider>
            </ConfirmModalProvider>
          </AlertModalProvider>
        </PaperProvider>
      </ScreenSizesProvider>
    {/* </StripeProviderBaseoffPlatform> */}
  </AutocompleteDropdownContextProvider>
);
