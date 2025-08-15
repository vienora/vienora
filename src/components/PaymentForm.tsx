'use client';

import { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Shield, Lock } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { createPaymentIntent } from '@/lib/payment/stripe';

// ⚠️ PRODUCTION WARNING:
// This component handles real payment processing. For production use:
// 1. Ensure PCI DSS compliance
// 2. Use HTTPS for all payment pages
// 3. Implement proper error handling and validation
// 4. Add comprehensive security measures
// 5. Test thoroughly with various payment scenarios

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo_key'
);

interface PaymentFormProps {
  amount: number;
  currency: string;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
  billingDetails: {
    name: string;
    email: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  shippingDetails?: {
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

// Card Element styling
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: false,
};

function PaymentFormInner({
  amount,
  currency,
  onSuccess,
  onError,
  billingDetails,
  shippingDetails,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { state: cartState } = useCart();
  const { state: authState } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Create payment intent when component mounts
  useEffect(() => {
    const createIntent = async () => {
      try {
        const paymentIntent = await createPaymentIntent({
          amount: Math.round(amount * 100), // Convert to cents
          currency,
          description: `TrendLux Drops Order - ${cartState.items.length} items`,
          metadata: {
            orderId: `TL${Date.now()}`,
            userId: authState.user?.id || 'guest',
            items: JSON.stringify(cartState.items.map(item => ({
              id: item.product.id,
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price,
            }))),
          },
          shipping: shippingDetails ? {
            name: shippingDetails.name,
            address: shippingDetails.address,
          } : undefined,
        });

        setClientSecret(paymentIntent.client_secret);
      } catch (error) {
        setPaymentError('Failed to initialize payment. Please try again.');
        onError('Failed to initialize payment');
      }
    };

    if (amount > 0) {
      createIntent();
    }
  }, [amount, currency, cartState.items, authState.user, shippingDetails, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPaymentError('Payment form not loaded properly');
      setIsProcessing(false);
      return;
    }

    try {
      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingDetails.name,
            email: billingDetails.email,
            address: billingDetails.address,
          },
        },
      });

      if (error) {
        console.error('Payment error:', error);
        setPaymentError(error.message || 'Payment failed');
        onError(error.message || 'Payment failed');
      } else {
        console.log('Payment succeeded:', paymentIntent);
        onSuccess(paymentIntent);
      }
    } catch (error: any) {
      console.error('Payment processing error:', error);
      setPaymentError('An unexpected error occurred. Please try again.');
      onError('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!stripe || !elements) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading payment form...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Amount Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount:</span>
              <span className="text-2xl font-bold">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: currency.toUpperCase(),
                }).format(amount)}
              </span>
            </div>
          </div>

          {/* Card Element */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Card Information
            </label>
            <div className="border border-gray-300 rounded-md p-3 bg-white">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          {/* Error Display */}
          {paymentError && (
            <Alert variant="destructive">
              <AlertDescription>{paymentError}</AlertDescription>
            </Alert>
          )}

          {/* Security Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3" />
              <span>Secure 256-bit SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-3 h-3" />
              <span>PCI Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-3 h-3" />
              <span>Stripe Secure</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            disabled={!stripe || isProcessing || !clientSecret}
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Pay {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: currency.toUpperCase(),
                }).format(amount)}
              </>
            )}
          </Button>

          {/* Payment Methods */}
          <div className="text-center text-xs text-gray-500">
            <p>We accept Visa, Mastercard, American Express, and Discover</p>
            <p className="mt-1">Your payment information is secure and encrypted</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Main component with Stripe Elements provider
export default function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormInner {...props} />
    </Elements>
  );
}
