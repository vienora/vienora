'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LuxuryNotifications from '@/components/LuxuryNotifications';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <LuxuryNotifications
          userId="demo-user"
          userTier="elite"
          isVipMember={true}
        />
      </main>
      <Footer />
    </div>
  );
}
