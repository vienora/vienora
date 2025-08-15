'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DollarSign,
  Package,
  Users,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Bot
} from 'lucide-react';
import Link from 'next/link';
import { orderManager } from '@/lib/order-management';
import { aliExpressAPI } from '@/lib/suppliers/aliexpress';
import { spocketAPI } from '@/lib/suppliers/spocket';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// ⚠️ PRODUCTION WARNING:
// This admin dashboard is for demonstration purposes. For production use:
// 1. Implement proper admin authentication and authorization
// 2. Add role-based access control
// 3. Implement comprehensive audit logging
// 4. Add data export capabilities
// 5. Ensure all sensitive data is properly protected

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeCustomers: number;
  conversionRate: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  failedOrders: number;
}

interface SupplierStatus {
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  productCount: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    activeCustomers: 0,
    conversionRate: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    failedOrders: 0,
  });

  const [supplierStatuses, setSupplierStatuses] = useState<SupplierStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
    loadSupplierStatuses();
  }, []);

  const loadDashboardData = async () => {
    try {
      // In production, fetch real data from your database
      // For demo, using mock data
      setStats({
        totalOrders: 156,
        totalRevenue: 45780.50,
        activeCustomers: 89,
        conversionRate: 3.2,
        pendingOrders: 8,
        shippedOrders: 12,
        deliveredOrders: 134,
        failedOrders: 2,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSupplierStatuses = async () => {
    try {
      // Check supplier connections
      const statuses: SupplierStatus[] = [
        {
          name: 'AliExpress',
          status: process.env.ALIEXPRESS_APP_KEY ? 'connected' : 'disconnected',
          lastSync: '2025-01-07 10:30:00',
          productCount: 1250,
          pendingOrders: 3,
        },
        {
          name: 'Spocket',
          status: process.env.SPOCKET_API_KEY ? 'connected' : 'disconnected',
          lastSync: '2025-01-07 09:45:00',
          productCount: 850,
          pendingOrders: 5,
        },
        {
          name: 'CJ Dropshipping',
          status: 'disconnected',
          lastSync: 'Never',
          productCount: 0,
          pendingOrders: 0,
        },
      ];

      setSupplierStatuses(statuses);
    } catch (error) {
      console.error('Error loading supplier statuses:', error);
    }
  };

  const handleInventorySync = async () => {
    setIsSyncing(true);
    setSyncResult(null);

    try {
      const result = await orderManager.synchronizeInventory();

      if (result.success) {
        setSyncResult(`Successfully updated ${result.updated} products`);
        await loadSupplierStatuses(); // Refresh supplier data
      } else {
        setSyncResult(`Sync failed: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      setSyncResult('Inventory sync failed. Please try again.');
      console.error('Inventory sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your dropshipping business operations
          </p>
        </div>

        {/* Environment Warning */}
        {process.env.NODE_ENV !== 'production' && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Demo Mode:</strong> This is a demonstration dashboard. In production,
              implement proper authentication, authorization, and data security measures.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                +8.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCustomers}</div>
              <p className="text-xs text-muted-foreground">
                +15.3% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                +0.3% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Status Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Pending</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {stats.pendingOrders}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Shipped</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {stats.shippedOrders}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Delivered</span>
                      <Badge className="bg-green-100 text-green-800">
                        {stats.deliveredOrders}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Failed</span>
                      <Badge className="bg-red-100 text-red-800">
                        {stats.failedOrders}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Order #TL12345 shipped</span>
                      <span className="text-muted-foreground">2h ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment received #TL12344</span>
                      <span className="text-muted-foreground">3h ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New order #TL12346</span>
                      <span className="text-muted-foreground">5h ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inventory sync completed</span>
                      <span className="text-muted-foreground">1d ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    Product Automation System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-green-800">Automation Status</h4>
                      <p className="text-sm text-green-600">Running - Last sync: 2 hours ago</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">127</div>
                      <div className="text-xs text-blue-600">Products Processed</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">42</div>
                      <div className="text-xs text-green-600">Auto-Approved</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full bg-gradient-to-r from-amber-600 to-yellow-600" asChild>
                      <Link href="/admin/automation">
                        🤖 Open Automation Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full">
                      ⚙️ Configure Settings
                    </Button>
                  </div>

                  <Alert>
                    <Bot className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Smart Curation Active:</strong> System automatically sources and scores high-quality luxury products from verified suppliers.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Review Queue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-12 h-12 bg-gray-100 rounded-md"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Titanium Watch Collection</h4>
                        <p className="text-xs text-muted-foreground">Score: 73/100 • $599.99</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Review</Badge>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-12 h-12 bg-gray-100 rounded-md"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Smart Coffee System</h4>
                        <p className="text-xs text-muted-foreground">Score: 68/100 • $299.99</p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">Medium</Badge>
                    </div>

                    <Button variant="outline" className="w-full text-xs">
                      View All ({18} Pending)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Suppliers Tab */}
          <TabsContent value="suppliers">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supplierStatuses.map((supplier) => (
                    <div key={supplier.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(supplier.status)}
                        <div>
                          <h4 className="font-medium">{supplier.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {supplier.productCount} products • {supplier.pendingOrders} pending orders
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(supplier.status)}>
                          {supplier.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          Last sync: {supplier.lastSync}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Inventory Management</CardTitle>
                <Button
                  onClick={handleInventorySync}
                  disabled={isSyncing}
                  className="bg-gradient-to-r from-amber-600 to-yellow-600"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sync Inventory
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                {syncResult && (
                  <Alert className="mb-4">
                    <AlertDescription>{syncResult}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">2,100</div>
                        <div className="text-sm text-muted-foreground">Total Products</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">45</div>
                        <div className="text-sm text-muted-foreground">Low Stock</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-sm text-muted-foreground">Out of Stock</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Integration Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Production Setup Required:</strong> To enable real integrations,
                    please follow the setup guide in PRODUCTION_SETUP_GUIDE.md.
                    Current integrations are in demo mode only.
                  </AlertDescription>
                </Alert>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Stripe Payments</h4>
                      <p className="text-sm text-muted-foreground">
                        Process credit card payments securely
                      </p>
                    </div>
                    <Badge className={process.env.STRIPE_SECRET_KEY ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {process.env.STRIPE_SECRET_KEY ? 'Connected' : 'Not Configured'}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Database</h4>
                      <p className="text-sm text-muted-foreground">
                        Persistent data storage
                      </p>
                    </div>
                    <Badge className={process.env.DATABASE_URL ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {process.env.DATABASE_URL ? 'Connected' : 'Not Configured'}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Email Service</h4>
                      <p className="text-sm text-muted-foreground">
                        Send order confirmations and notifications
                      </p>
                    </div>
                    <Badge className={process.env.SENDGRID_API_KEY ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {process.env.SENDGRID_API_KEY ? 'Connected' : 'Not Configured'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
