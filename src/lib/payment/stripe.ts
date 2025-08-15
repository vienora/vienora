import { loadStripe, Stripe } from '@stripe/stripe-js';

// ⚠️ PRODUCTION WARNING:
// This is a demonstration of Stripe integration. For production use:
// 1. Ensure PCI DSS compliance
// 2. Use environment variables for API keys
// 3. Implement proper error handling and logging
// 4. Set up webhook signature validation
// 5. Handle payment disputes and refunds

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo_key';
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface PaymentData {
  amount: number; // in cents
  currency: string;
  description: string;
  metadata: {
    orderId: string;
    userId: string;
    items: string; // JSON stringified cart items
  };
  shipping?: {
    name: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
}

// Create payment intent on the server side
export async function createPaymentIntent(paymentData: PaymentData): Promise<PaymentIntent> {
  try {
    // In production, this would be a server-side API call
    // For demo purposes, we'll simulate the response
    if (process.env.NODE_ENV === 'production') {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      return await response.json();
    } else {
      // Demo mode - simulate payment intent
      return {
        id: `pi_demo_${Math.random().toString(36).substr(2, 9)}`,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: 'requires_payment_method',
        client_secret: `pi_demo_${Math.random().toString(36).substr(2, 9)}_secret_demo`,
      };
    }
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Payment initialization failed');
  }
}

// Process payment with Stripe Elements
export async function processPayment(
  clientSecret: string,
  paymentMethod: any,
  billingDetails: any
): Promise<{ success: boolean; error?: string; paymentIntent?: any }> {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    // In demo mode, simulate successful payment
    if (process.env.NODE_ENV !== 'production') {
      return {
        success: true,
        paymentIntent: {
          id: `pi_demo_${Math.random().toString(36).substr(2, 9)}`,
          status: 'succeeded',
          amount: 1000, // Demo amount
        },
      };
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: paymentMethod,
        billing_details: billingDetails,
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      paymentIntent,
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: 'Payment processing failed',
    };
  }
}

// Refund payment
export async function refundPayment(
  paymentIntentId: string,
  amount?: number
): Promise<{ success: boolean; error?: string; refund?: any }> {
  try {
    const response = await fetch('/api/payments/refund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentIntentId,
        amount,
      }),
    });

    if (!response.ok) {
      throw new Error('Refund request failed');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Refund error:', error);
    return {
      success: false,
      error: 'Refund processing failed',
    };
  }
}

// PayPal integration helpers
export async function createPayPalOrder(amount: number, currency: string = 'USD') {
  try {
    const response = await fetch('/api/payments/paypal/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, currency }),
    });

    if (!response.ok) {
      throw new Error('PayPal order creation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('PayPal order creation error:', error);
    throw error;
  }
}

export async function capturePayPalOrder(orderID: string) {
  try {
    const response = await fetch('/api/payments/paypal/capture-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderID }),
    });

    if (!response.ok) {
      throw new Error('PayPal order capture failed');
    }

    return await response.json();
  } catch (error) {
    console.error('PayPal order capture error:', error);
    throw error;
  }
}

export default getStripe;
