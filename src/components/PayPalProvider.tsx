'use client';

import React from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

interface PayPalProviderProps {
  children: React.ReactNode;
}

const PayPalProvider: React.FC<PayPalProviderProps> = ({ children }) => {
  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'demo',
    currency: 'USD',
    intent: 'capture',
    'enable-funding': 'venmo',
    'disable-funding': 'paylater'
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
};

export default PayPalProvider;
