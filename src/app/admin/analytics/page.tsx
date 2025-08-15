'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LuxuryAnalyticsDashboard from '@/components/LuxuryAnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <LuxuryAnalyticsDashboard />
      </main>
      <Footer />
    </div>
  );
}
