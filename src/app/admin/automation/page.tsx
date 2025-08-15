'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
  Bot, CheckCircle, Clock, XCircle, TrendingUp, Package,
  Upload, Eye, DollarSign, Star, AlertTriangle, PlayCircle,
  PauseCircle, Settings, RefreshCw, Download, Filter
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Mock data for demo
const mockStats = {
  todayProcessed: 127,
  autoApproved: 42,
  pendingReview: 18,
  rejected: 67,
  totalRevenue: 15750,
  avgQualityScore: 67.3,
  automationStatus: 'running'
};

const mockReviewQueue = [
  {
    id: 'RQ001',
    name: 'Professional Titanium Watch Collection',
    price: 599.99,
    qualityScore: 73,
    supplier: 'LuxuryTime USA',
    category: 'Watches & Jewelry',
    priority: 'high',
    reason: 'High-value luxury item with excellent reviews',
    estimatedRevenue: 300,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop'],
    addedAt: '2 hours ago'
  },
  {
    id: 'RQ002',
    name: 'Artisan Coffee Making System',
    price: 299.99,
    qualityScore: 68,
    supplier: 'KitchenPro EU',
    category: 'Kitchen Appliances',
    priority: 'medium',
    reason: 'Strong reviews but pricing needs validation',
    estimatedRevenue: 150,
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop'],
    addedAt: '5 hours ago'
  },
  {
    id: 'RQ003',
    name: 'Smart Home Security Hub',
    price: 449.99,
    qualityScore: 65,
    supplier: 'TechSecure CA',
    category: 'Electronics',
    priority: 'medium',
    reason: 'New product category validation needed',
    estimatedRevenue: 225,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop'],
    addedAt: '1 day ago'
  }
];

const mockRecentlyApproved = [
  {
    id: 'AP001',
    name: 'Premium Ergonomic Office Chair',
    price: 699.99,
    qualityScore: 89,
    revenue: 1400,
    orders: 2,
    status: 'live'
  },
  {
    id: 'AP002',
    name: 'Luxury Skincare Device',
    price: 299.99,
    qualityScore: 85,
    revenue: 900,
    orders: 3,
    status: 'live'
  }
];

const qualityScoreData = [
  { range: '90-100', count: 8, color: '#22c55e' },
  { range: '80-89', count: 15, color: '#84cc16' },
  { range: '70-79', count: 25, color: '#eab308' },
  { range: '60-69', count: 18, color: '#f97316' },
  { range: '50-59', count: 12, color: '#ef4444' },
  { range: '0-49', count: 5, color: '#991b1b' }
];

const categoryPerformance = [
  { category: 'Electronics', approved: 25, revenue: 12500 },
  { category: 'Furniture', approved: 18, revenue: 8900 },
  { category: 'Jewelry', approved: 12, revenue: 15600 },
  { category: 'Kitchen', approved: 15, revenue: 6700 }
];

export default function AutomationAdminPage() {
  const [isRunning, setIsRunning] = useState(mockStats.automationStatus === 'running');
  const [selectedItem, setSelectedItem] = useState(null);
  const [bulkAction, setBulkAction] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [manualProduct, setManualProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    images: []
  });

  const handleToggleAutomation = () => {
    setIsRunning(!isRunning);
    // In production, call API to start/stop automation
    console.log(isRunning ? 'Stopping automation...' : 'Starting automation...');
  };

  const handleApproveProduct = (productId: string) => {
    console.log(`Approving product: ${productId}`);
    // In production, call API to approve product
  };

  const handleRejectProduct = (productId: string) => {
    console.log(`Rejecting product: ${productId}`);
    // In production, call API to reject product
  };

  const handleBulkAction = () => {
    if (selectedItems.size === 0) return;
    console.log(`Bulk ${bulkAction} for ${selectedItems.size} items`);
    // In production, process bulk action
    setSelectedItems(new Set());
  };

  const handleManualUpload = () => {
    console.log('Manual upload:', manualProduct);
    // In production, upload custom product
    setManualProduct({ name: '', price: '', description: '', category: '', images: [] });
  };

  const runManualSync = () => {
    console.log('Running manual sync...');
    // In production, trigger manual sync
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Product Automation</h1>
              <p className="text-muted-foreground">
                Automated product curation and quality control system
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={handleToggleAutomation}
                className={isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
              >
                {isRunning ? <PauseCircle className="w-4 h-4 mr-2" /> : <PlayCircle className="w-4 h-4 mr-2" />}
                {isRunning ? 'Stop Automation' : 'Start Automation'}
              </Button>

              <Button onClick={runManualSync} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Manual Sync
              </Button>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today Processed</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{mockStats.todayProcessed}</div>
              <p className="text-xs text-muted-foreground">+23% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auto-Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{mockStats.autoApproved}</div>
              <p className="text-xs text-muted-foreground">33% approval rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{mockStats.pendingReview}</div>
              <p className="text-xs text-muted-foreground">Needs your attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
              <Star className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{mockStats.avgQualityScore}/100</div>
              <p className="text-xs text-muted-foreground">Above luxury threshold</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="review-queue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="review-queue">Review Queue ({mockStats.pendingReview})</TabsTrigger>
            <TabsTrigger value="approved">Approved Products</TabsTrigger>
            <TabsTrigger value="manual-upload">Manual Upload</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Review Queue Tab */}
          <TabsContent value="review-queue">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Products Awaiting Review</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={bulkAction} onValueChange={setBulkAction}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Bulk action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approve">Approve Selected</SelectItem>
                        <SelectItem value="reject">Reject Selected</SelectItem>
                        <SelectItem value="priority">Set High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleBulkAction}
                      disabled={selectedItems.size === 0 || !bulkAction}
                      size="sm"
                    >
                      Apply ({selectedItems.size})
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReviewQueue.map((item) => (
                    <Card key={item.id} className="border-l-4 border-l-yellow-500">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            className="mt-2"
                            checked={selectedItems.has(item.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedItems);
                              if (e.target.checked) {
                                newSelected.add(item.id);
                              } else {
                                newSelected.delete(item.id);
                              }
                              setSelectedItems(newSelected);
                            }}
                          />

                          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-muted-foreground text-sm">{item.supplier} • {item.category}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold">${item.price}</div>
                                <div className="text-sm text-muted-foreground">Est. ${item.estimatedRevenue} revenue</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <Badge className={`${item.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {item.priority} priority
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-amber-500" />
                                <span className="text-sm font-medium">Quality: {item.qualityScore}/100</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{item.addedAt}</span>
                            </div>

                            <p className="text-sm text-muted-foreground">{item.reason}</p>

                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApproveProduct(item.id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => handleRejectProduct(item.id)}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4 mr-1" />
                                    Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>{item.name}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <img
                                      src={item.images[0]}
                                      alt={item.name}
                                      className="w-full h-64 object-cover rounded-lg"
                                    />
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <strong>Price:</strong> ${item.price}
                                      </div>
                                      <div>
                                        <strong>Quality Score:</strong> {item.qualityScore}/100
                                      </div>
                                      <div>
                                        <strong>Supplier:</strong> {item.supplier}
                                      </div>
                                      <div>
                                        <strong>Category:</strong> {item.category}
                                      </div>
                                    </div>
                                    <div>
                                      <strong>Review Reason:</strong> {item.reason}
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approved Products Tab */}
          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>Recently Approved Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentlyApproved.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Quality: {product.qualityScore}/100</span>
                          <span>${product.price}</span>
                          <Badge className="bg-green-100 text-green-800">{product.status}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${product.revenue}</div>
                        <div className="text-sm text-muted-foreground">{product.orders} orders</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manual Upload Tab */}
          <TabsContent value="manual-upload">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Custom Product
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name</label>
                    <Input
                      value={manualProduct.name}
                      onChange={(e) => setManualProduct({...manualProduct, name: e.target.value})}
                      placeholder="Luxury Premium Product Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price ($)</label>
                    <Input
                      type="number"
                      value={manualProduct.price}
                      onChange={(e) => setManualProduct({...manualProduct, price: e.target.value})}
                      placeholder="299.99"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={manualProduct.category} onValueChange={(value) => setManualProduct({...manualProduct, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="jewelry">Watches & Jewelry</SelectItem>
                      <SelectItem value="kitchen">Kitchen Appliances</SelectItem>
                      <SelectItem value="outdoor">Outdoor Gear</SelectItem>
                      <SelectItem value="fitness">Fitness Equipment</SelectItem>
                      <SelectItem value="vehicles">Vehicles</SelectItem>
                      <SelectItem value="hobbies">Luxury Hobbies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={manualProduct.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setManualProduct({...manualProduct, description: e.target.value})}
                    placeholder="Luxury product description highlighting premium features and exclusivity..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Product Images</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-muted-foreground">Drop images here or click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB each</p>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Manual uploads bypass quality filters and go live immediately with "Featured" status.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleManualUpload}
                  className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700"
                  disabled={!manualProduct.name || !manualProduct.price || !manualProduct.category}
                >
                  Upload Product
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quality Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={qualityScoreData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label
                      >
                        {qualityScoreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="approved" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Automation Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Quality Thresholds</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Auto-Approve Score</label>
                        <Input type="number" defaultValue="70" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Review Queue Score</label>
                        <Input type="number" defaultValue="50" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Minimum Price ($)</label>
                        <Input type="number" defaultValue="50" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Maximum Price ($)</label>
                        <Input type="number" defaultValue="5000" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Automation Schedule</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Sync Frequency</label>
                        <Select defaultValue="daily">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Every Hour</SelectItem>
                            <SelectItem value="daily">Daily at 2 AM</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Max Products Per Sync</label>
                        <Input type="number" defaultValue="100" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Notification Email</label>
                        <Input type="email" defaultValue="admin@vienora.com" />
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
