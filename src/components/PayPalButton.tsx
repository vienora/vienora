import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

interface PayPalButtonProps {
  amount: string;
  currency?: string;
  productName: string;
  onSuccess?: (details: any) => void;
  onError?: (error: any) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({
  amount,
  currency = "USD",
  productName,
  onSuccess,
  onError
}) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          description: productName,
          amount: {
            currency_code: currency,
            value: amount,
          },
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING" // For digital/luxury products
      }
    });
  };

  const onApprove = (data: any, actions: any) => {
    return actions.order.capture().then((details: any) => {
      console.log('PayPal payment successful:', details);
      if (onSuccess) {
        onSuccess(details);
      }
    });
  };

  const handleError = (error: any) => {
    console.error('PayPal payment error:', error);
    if (onError) {
      onError(error);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
        <span className="ml-2 text-sm text-gray-600">Loading payment options...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={handleError}
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'pay',
          height: 45
        }}
      />
    </div>
  );
};

export default PayPalButton;
