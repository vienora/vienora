'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LuxuryLoyalty from '@/components/LuxuryLoyalty';

export default function LoyaltyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <LuxuryLoyalty
          userId="demo-user"
          currentTier="elite"
          totalSpend={12500}
        />
      </main>
      <Footer />
    </div>
  );
}
