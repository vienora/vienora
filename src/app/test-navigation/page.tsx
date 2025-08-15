'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Crown,
  Heart,
  BarChart3,
  Bell,
  Settings,
  Bot,
  CheckCircle,
  Eye
} from 'lucide-react';

const testRoutes = [
  {
    path: '/wishlist',
    title: 'Luxury Collections & Wishlist',
    description: 'Test curated collections and wishlist functionality',
    icon: Heart,
    color: 'bg-red-100 text-red-800'
  },
  {
    path: '/loyalty',
    title: 'VIP Loyalty Rewards',
    description: 'Test tier system and rewards catalog',
    icon: Crown,
    color: 'bg-amber-100 text-amber-800'
  },
  {
    path: '/notifications',
    title: 'Luxury Notifications',
    description: 'Test VIP notification system and alerts',
    icon: Bell,
    color: 'bg-blue-100 text-blue-800'
  },
  {
    path: '/admin/analytics',
    title: 'Analytics Dashboard',
    description: 'Test luxury customer behavior analytics',
    icon: BarChart3,
    color: 'bg-green-100 text-green-800'
  },
  {
    path: '/admin',
    title: 'Admin Dashboard',
    description: 'Test admin operations and management',
    icon: Settings,
    color: 'bg-purple-100 text-purple-800'
  },
  {
    path: '/admin/automation',
    title: 'Product Automation',
    description: 'Test automated product curation system',
    icon: Bot,
    color: 'bg-indigo-100 text-indigo-800'
  },
  {
    path: '/shop',
    title: 'Exclusive Collection',
    description: 'Test main shopping experience',
    icon: Eye,
    color: 'bg-gray-100 text-gray-800'
  }
];

export default function TestNavigationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">🧪 VIP Features Testing Center</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Systematic testing of all VIP features and luxury components. Click each link to verify
            functionality and ensure iron-clad performance across all pages.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {testRoutes.map((route) => (
            <Card key={route.path} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${route.color}`}>
                    <route.icon className="w-5 h-5" />
                  </div>
                  {route.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {route.description}
                </p>
                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={route.path}>
                      <Eye className="w-4 h-4 mr-2" />
                      Test Page
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(route.path, '_blank')}
                  >
                    New Tab
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Testing Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-medium">Homepage & Logo Design</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-medium">VIP Concierge Chat Integration</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium">Navigation Links Testing</span>
                <Bell className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium">Mobile Responsiveness</span>
                <Bell className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium">Error Handling Verification</span>
                <Bell className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/">
              ← Back to Homepage
            </Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
