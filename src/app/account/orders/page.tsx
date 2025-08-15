'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package,
  Search,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  ArrowLeft,
  Download
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function OrdersPage() {
  const { state, getUserOrders } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const orders = getUserOrders();

  if (!state.user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in</h1>
          <p className="text-muted-foreground">You need to be logged in to view your orders.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'processing':
        return <Package className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const ordersByStatus = {
    all: filteredOrders,
    pending: filteredOrders.filter(o => o.status === 'pending'),
    processing: filteredOrders.filter(o => o.status === 'processing'),
    shipped: filteredOrders.filter(o => o.status === 'shipped'),
    delivered: filteredOrders.filter(o => o.status === 'delivered'),
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Orders</h1>
              <p className="text-muted-foreground">Track and manage your orders</p>
            </div>

            {/* Search */}
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-700">{orders.length}</div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">
                {orders.filter(o => o.status === 'shipped').length}
              </div>
              <div className="text-sm text-muted-foreground">Shipped</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'delivered').length}
              </div>
              <div className="text-sm text-muted-foreground">Delivered</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-700">
                €{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All ({ordersByStatus.all.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({ordersByStatus.pending.length})</TabsTrigger>
                <TabsTrigger value="processing">Processing ({ordersByStatus.processing.length})</TabsTrigger>
                <TabsTrigger value="shipped">Shipped ({ordersByStatus.shipped.length})</TabsTrigger>
                <TabsTrigger value="delivered">Delivered ({ordersByStatus.delivered.length})</TabsTrigger>
              </TabsList>

              {Object.entries(ordersByStatus).map(([status, statusOrders]) => (
                <TabsContent key={status} value={status} className="space-y-4">
                  {statusOrders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No orders found</p>
                    </div>
                  ) : (
                    statusOrders.map((order) => (
                      <Card key={order.id} className="border-l-4 border-l-amber-600">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg">{order.id}</h3>
                                <Badge className={getStatusColor(order.status)}>
                                  {getStatusIcon(order.status)}
                                  <span className="ml-1 capitalize">{order.status}</span>
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Ordered on {new Date(order.orderDate).toLocaleDateString()}
                                {order.trackingNumber && (
                                  <span> • Tracking: {order.trackingNumber}</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold">${order.total.toLocaleString()}</div>
                              <div className="text-sm text-muted-foreground">
                                {order.items.length} item{order.items.length > 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-3 mb-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                <div className="w-12 h-12 bg-white rounded-md overflow-hidden">
                                  <img
                                    src={item.image}
                                    alt={item.productName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{item.productName}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Qty: {item.quantity} • ${item.price.toLocaleString()} each
                                  </div>
                                </div>
                                <div className="font-medium">
                                  ${(item.price * item.quantity).toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 justify-end">
                            <Link href={`/account/orders/${order.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                            </Link>
                            {order.status === 'shipped' || order.status === 'delivered' ? (
                              <Button variant="outline" size="sm">
                                <Truck className="w-4 h-4 mr-2" />
                                Track Package
                              </Button>
                            ) : null}
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download Invoice
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
