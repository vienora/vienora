import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import PayPalProvider from '@/components/PayPalProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import ClientOnly from '@/components/ClientOnly';
import SafeLoading from '@/components/SafeLoading';

// VIP Components - wrapped for safety
import VipConciergeChat from '@/components/VipConciergeChat';
import LuxuryNotifications from '@/components/LuxuryNotifications';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Vienora - Ultra-Luxury For The Elite",
  description: "Exclusive access to the world's most coveted luxury collections. Rare finds, bespoke pieces, and ultra-premium goods reserved for discerning collectors and connoisseurs.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
    apple: { url: '/favicon.svg', type: 'image/svg+xml' }
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <PayPalProvider>
            <AuthProvider>
              <CartProvider>
                {children}

              {/* VIP Components - Safe Integration */}
              <ClientOnly fallback={null}>
                <ErrorBoundary>
                  <VipConciergeChat
                    userTier="elite"
                    isVipMember={true}
                  />
                </ErrorBoundary>
              </ClientOnly>

              {/* Notifications floating component - hidden initially */}
              <ClientOnly fallback={null}>
                <ErrorBoundary>
                  <div className="hidden">
                    <LuxuryNotifications
                      userId="demo-user"
                      userTier="elite"
                      isVipMember={true}
                    />
                  </div>
                </ErrorBoundary>
              </ClientOnly>
              </CartProvider>
            </AuthProvider>
          </PayPalProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
