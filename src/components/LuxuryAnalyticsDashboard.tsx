'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Crown,
  DollarSign,
  ShoppingBag,
  Star,
  Award,
  Calendar,
  Target,
  Zap,
  Globe,
  Heart,
  Eye
} from 'lucide-react';

interface LuxuryMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  vipMembers: number;
  memberGrowth: number;
  avgOrderValue: number;
  aovGrowth: number;
  conversionRate: number;
  conversionGrowth: number;
  lifetimeValue: number;
  lvGrowth: number;
  exclusiveItems: number;
  exclusiveGrowth: number;
}

interface CustomerSegment {
  tier: string;
  count: number;
  revenue: number;
  avgSpend: number;
  color: string;
}

interface LuxuryTrend {
  date: string;
  revenue: number;
  orders: number;
  newMembers: number;
  exclusiveViews: number;
}

interface ProductInsight {
  category: string;
  revenue: number;
  units: number;
  avgPrice: number;
  growth: number;
}

interface CustomerBehavior {
  metric: string;
  value: number;
  change: number;
  description: string;
}

export default function LuxuryAnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock luxury metrics data
  const luxuryMetrics: LuxuryMetrics = {
    totalRevenue: 2847650,
    revenueGrowth: 24.7,
    vipMembers: 1247,
    memberGrowth: 18.3,
    avgOrderValue: 1285,
    aovGrowth: 12.4,
    conversionRate: 8.7,
    conversionGrowth: 5.2,
    lifetimeValue: 15420,
    lvGrowth: 21.6,
    exclusiveItems: 87,
    exclusiveGrowth: 15.8
  };

  const customerSegments: CustomerSegment[] = [
    { tier: 'Sovereign', count: 127, revenue: 1240000, avgSpend: 9764, color: '#FFD700' },
    { tier: 'Prestige', count: 342, revenue: 987000, avgSpend: 2885, color: '#C0C0C0' },
    { tier: 'Elite', count: 778, revenue: 620650, avgSpend: 798, color: '#CD7F32' }
  ];

  const luxuryTrends: LuxuryTrend[] = [
    { date: '2024-12-01', revenue: 145000, orders: 89, newMembers: 12, exclusiveViews: 1250 },
    { date: '2024-12-02', revenue: 167000, orders: 94, newMembers: 15, exclusiveViews: 1340 },
    { date: '2024-12-03', revenue: 189000, orders: 102, newMembers: 18, exclusiveViews: 1580 },
    { date: '2024-12-04', revenue: 203000, orders: 87, newMembers: 14, exclusiveViews: 1720 },
    { date: '2024-12-05', revenue: 234000, orders: 118, newMembers: 22, exclusiveViews: 1890 },
    { date: '2024-12-06', revenue: 278000, orders: 134, newMembers: 28, exclusiveViews: 2140 },
    { date: '2024-12-07', revenue: 312000, orders: 145, newMembers: 35, exclusiveViews: 2350 }
  ];

  const productInsights: ProductInsight[] = [
    { category: 'Fine Art & Collectibles', revenue: 842000, units: 67, avgPrice: 12567, growth: 34.5 },
    { category: 'Luxury Timepieces', revenue: 567000, units: 89, avgPrice: 6371, growth: 28.2 },
    { category: 'Precious Jewelry', revenue: 423000, units: 134, avgPrice: 3157, growth: 22.8 },
    { category: 'Exotic Vehicles', revenue: 1240000, units: 12, avgPrice: 103333, growth: 45.2 },
    { category: 'Bespoke Furniture', revenue: 234000, units: 23, avgPrice: 10174, growth: 18.7 }
  ];

  const customerBehavior: CustomerBehavior[] = [
    { metric: 'Avg. Session Duration', value: 847, change: 23.4, description: 'Minutes spent browsing exclusive collections' },
    { metric: 'Page Views per Session', value: 28.4, change: 15.8, description: 'Deep engagement with luxury content' },
    { metric: 'Wishlist Additions', value: 4.7, change: 31.2, description: 'Average items saved per session' },
    { metric: 'Concierge Interactions', value: 67, change: 42.1, description: 'Monthly VIP chat sessions' },
    { metric: 'Exclusive Preview Opens', value: 89.3, change: 28.7, description: 'Private collection access rate (%)' },
    { metric: 'Referral Rate', value: 34.2, change: 19.5, description: 'Members referring other collectors (%)' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const MetricCard = ({ title, value, growth, icon: Icon, format = 'number' }: {
    title: string;
    value: number;
    growth: number;
    icon: any;
    format?: 'number' | 'currency' | 'percentage';
  }) => (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold">
              {format === 'currency' && formatCurrency(value)}
              {format === 'number' && value.toLocaleString()}
              {format === 'percentage' && `${value}%`}
            </p>
            <div className="flex items-center gap-1 mt-2">
              {growth > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {growth > 0 ? '+' : ''}{growth}%
              </span>
              <span className="text-sm text-muted-foreground">vs last period</span>
            </div>
          </div>
          <div className="h-12 w-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-600/10 to-transparent" />
    </Card>
  );

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Crown className="w-8 h-8 text-amber-600" />
            Luxury Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">Advanced insights into elite customer behavior and luxury market trends</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex border rounded-lg">
            {(['7d', '30d', '90d', '1y'] as const).map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeframe(period)}
                className="rounded-none first:rounded-l-lg last:rounded-r-lg"
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <MetricCard
          title="Total Revenue"
          value={luxuryMetrics.totalRevenue}
          growth={luxuryMetrics.revenueGrowth}
          icon={DollarSign}
          format="currency"
        />
        <MetricCard
          title="VIP Members"
          value={luxuryMetrics.vipMembers}
          growth={luxuryMetrics.memberGrowth}
          icon={Crown}
        />
        <MetricCard
          title="Avg Order Value"
          value={luxuryMetrics.avgOrderValue}
          growth={luxuryMetrics.aovGrowth}
          icon={ShoppingBag}
          format="currency"
        />
        <MetricCard
          title="Conversion Rate"
          value={luxuryMetrics.conversionRate}
          growth={luxuryMetrics.conversionGrowth}
          icon={Target}
          format="percentage"
        />
        <MetricCard
          title="Lifetime Value"
          value={luxuryMetrics.lifetimeValue}
          growth={luxuryMetrics.lvGrowth}
          icon={Award}
          format="currency"
        />
        <MetricCard
          title="Exclusive Items"
          value={luxuryMetrics.exclusiveItems}
          growth={luxuryMetrics.exclusiveGrowth}
          icon={Star}
        />
      </div>

      {/* Charts and Analytics */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
          <TabsTrigger value="customers">Customer Segments</TabsTrigger>
          <TabsTrigger value="products">Product Insights</TabsTrigger>
          <TabsTrigger value="behavior">Customer Behavior</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Orders Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={luxuryTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: any, name: string) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name === 'revenue' ? 'Revenue' : 'Orders'
                    ]} />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="orders" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Member Growth & Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={luxuryTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="newMembers" stroke="#8B5CF6" strokeWidth={3} name="New Members" />
                    <Line type="monotone" dataKey="exclusiveViews" stroke="#F59E0B" strokeWidth={3} name="Exclusive Views" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Tier Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={customerSegments}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="count"
                      label={({ tier, count }) => `${tier}: ${count}`}
                    >
                      {customerSegments.map((entry, index) => (
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
                <CardTitle>Revenue by Customer Tier</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={customerSegments}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tier" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    <Bar dataKey="revenue" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {customerSegments.map((segment) => (
              <Card key={segment.tier}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{segment.tier} Members</h3>
                    <Badge style={{ backgroundColor: segment.color }} className="text-black">
                      {segment.count}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Revenue</span>
                      <span className="font-medium">{formatCurrency(segment.revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Spend</span>
                      <span className="font-medium">{formatCurrency(segment.avgSpend)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productInsights.map((product) => (
                  <div key={product.category} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{product.category}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{formatCurrency(product.revenue)} revenue</span>
                        <span>{product.units} units</span>
                        <span>{formatCurrency(product.avgPrice)} avg price</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-medium">+{product.growth}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customerBehavior.map((behavior) => (
              <Card key={behavior.metric}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{behavior.metric}</h4>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-green-600 text-sm font-medium">+{behavior.change}%</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold mb-2">{behavior.value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{behavior.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
