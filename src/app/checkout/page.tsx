'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  CreditCard,
  Lock,
  Truck,
  MapPin,
  User,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PayPalButton from '@/components/PayPalButton';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { state: cartState, clearCart } = useCart();
  const { state: authState, createOrder } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [billingForm, setBillingForm] = useState({
    email: authState.user?.email || '',
    firstName: authState.user?.name?.split(' ')[0] || '',
    lastName: authState.user?.name?.split(' ')[1] || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const [useShippingForBilling, setUseShippingForBilling] = useState(true);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const subtotal = cartState.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal >= 500 ? 0 : 29.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authState.user) {
      alert('Please log in to complete your order');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Create order
      const newOrderId = await createOrder(
        cartState.items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.image
        })),
        total
      );

      setOrderId(newOrderId);
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartState.items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some items to your cart before checking out.</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
              Continue Shopping
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been confirmed and will be shipped soon.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-sm text-muted-foreground">Order Number</div>
              <div className="text-xl font-bold">{orderId}</div>
            </div>
            <div className="flex gap-4 justify-center">
              <Link href={`/account/orders/${orderId}`}>
                <Button variant="outline">Track Order</Button>
              </Link>
              <Link href="/">
                <Button className="bg-gradient-to-r from-amber-600 to-yellow-600">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleCheckout}>
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={billingForm.email}
                    onChange={(e) => setBillingForm({ ...billingForm, email: e.target.value })}
                    required
                  />
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="First name"
                      value={billingForm.firstName}
                      onChange={(e) => setBillingForm({ ...billingForm, firstName: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Last name"
                      value={billingForm.lastName}
                      onChange={(e) => setBillingForm({ ...billingForm, lastName: e.target.value })}
                      required
                    />
                  </div>
                  <Input
                    placeholder="Address"
                    value={billingForm.address}
                    onChange={(e) => setBillingForm({ ...billingForm, address: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      placeholder="City"
                      value={billingForm.city}
                      onChange={(e) => setBillingForm({ ...billingForm, city: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="State"
                      value={billingForm.state}
                      onChange={(e) => setBillingForm({ ...billingForm, state: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="ZIP Code"
                      value={billingForm.zipCode}
                      onChange={(e) => setBillingForm({ ...billingForm, zipCode: e.target.value })}
                      required
                    />
                  </div>
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    value={billingForm.phone}
                    onChange={(e) => setBillingForm({ ...billingForm, phone: e.target.value })}
                    required
                  />
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Card number"
                    value={paymentForm.cardNumber}
                    onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="MM/YY"
                      value={paymentForm.expiryDate}
                      onChange={(e) => setPaymentForm({ ...paymentForm, expiryDate: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="CVV"
                      value={paymentForm.cvv}
                      onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                      required
                    />
                  </div>
                  <Input
                    placeholder="Name on card"
                    value={paymentForm.nameOnCard}
                    onChange={(e) => setPaymentForm({ ...paymentForm, nameOnCard: e.target.value })}
                    required
                  />
                </CardContent>
              </Card>

              {/* PayPal Payment Option - LIVE! */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <span className="text-blue-600">PayPal</span>
                    <span className="text-green-600 text-sm">(LIVE)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PayPalButton
                    amount={total.toFixed(2)}
                    currency="USD"
                    productName={`Vienora Order - ${cartState.items.length} items`}
                    onSuccess={(details) => {
                      console.log('PayPal payment successful:', details);
                      // Handle successful payment
                      handleCheckout(new Event('paypal') as any);
                    }}
                    onError={(error) => {
                      console.error('PayPal payment failed:', error);
                      alert('PayPal payment failed. Please try again.');
                    }}
                  />
                  <div className="text-center text-sm text-gray-500 mt-2">
                    Secure PayPal payments enabled
                  </div>
                </CardContent>
              </Card>

              <div className="text-center text-sm text-gray-500">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Lock className="w-4 h-4" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <p>Secure credit card payments</p>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Complete Order - {formatPrice(total)}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {cartState.items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium line-clamp-2">{item.product.name}</div>
                        <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-sm font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {subtotal < 500 && (
                  <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
                    Add {formatPrice(500 - subtotal)} more for free shipping!
                  </div>
                )}

                {/* Security */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <Lock className="w-3 h-3" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
