'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LuxuryWishlist from '@/components/LuxuryWishlist';

export default function WishlistPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <LuxuryWishlist
          userId="demo-user"
          userTier="elite"
        />
      </main>
      <Footer />
    </div>
  );
}
