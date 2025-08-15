'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Crown,
  Award,
  Star,
  Gift,
  Diamond,
  Sparkles,
  Calendar,
  Clock,
  CreditCard,
  Plane,
  Shield,
  Zap,
  Heart,
  Users,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

interface LoyaltyTier {
  id: string;
  name: string;
  icon: any;
  color: string;
  minSpend: number;
  multiplier: number;
  benefits: string[];
  exclusivePerks: string[];
  yearlyValue: number;
}

interface LoyaltyPoints {
  total: number;
  available: number;
  pending: number;
  expired: number;
  lifetime: number;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  value: number;
  category: 'discount' | 'experience' | 'access' | 'service';
  tier: string[];
  limited: boolean;
  expiresAt?: Date;
  image: string;
}

interface Transaction {
  id: string;
  type: 'earned' | 'redeemed' | 'expired';
  points: number;
  description: string;
  date: Date;
  orderId?: string;
}

interface LoyaltyDashboardProps {
  userId: string;
  currentTier: string;
  totalSpend: number;
}

const loyaltyTiers: LoyaltyTier[] = [
  {
    id: 'elite',
    name: 'Elite',
    icon: Star,
    color: 'from-amber-400 to-amber-600',
    minSpend: 0,
    multiplier: 1,
    benefits: [
      'Earn 1 point per $1 spent',
      'Free standard shipping',
      'Early access to sales',
      'Birthday bonus points'
    ],
    exclusivePerks: [
      'Welcome gift on first purchase',
      'Member-only newsletter'
    ],
    yearlyValue: 150
  },
  {
    id: 'prestige',
    name: 'Prestige',
    icon: Crown,
    color: 'from-purple-400 to-purple-600',
    minSpend: 25000,
    multiplier: 1.5,
    benefits: [
      'Earn 1.5 points per $1 spent',
      'Free expedited shipping',
      'Priority customer service',
      'Exclusive preview access'
    ],
    exclusivePerks: [
      'Personal shopper consultations',
      'Private sale invitations',
      'Complimentary gift wrapping'
    ],
    yearlyValue: 750
  },
  {
    id: 'sovereign',
    name: 'Sovereign',
    icon: Diamond,
    color: 'from-emerald-400 to-emerald-600',
    minSpend: 100000,
    multiplier: 2,
    benefits: [
      'Earn 2 points per $1 spent',
      'Free white-glove delivery worldwide',
      'Dedicated concierge service',
      'Museum-quality authentication'
    ],
    exclusivePerks: [
      'Private viewing appointments',
      'Bespoke item commissioning',
      'Invitation-only events',
      'Annual luxury experience'
    ],
    yearlyValue: 2500
  }
];

const availableRewards: Reward[] = [
  {
    id: '1',
    title: '$100 Luxury Credit',
    description: 'Apply to any purchase over $500',
    pointsCost: 5000,
    value: 100,
    category: 'discount',
    tier: ['elite', 'prestige', 'sovereign'],
    limited: false,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop'
  },
  {
    id: '2',
    title: 'Private Gallery Tour',
    description: 'Exclusive tour of partner galleries in NYC',
    pointsCost: 15000,
    value: 500,
    category: 'experience',
    tier: ['prestige', 'sovereign'],
    limited: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop'
  },
  {
    id: '3',
    title: 'Master Craftsman Experience',
    description: 'Behind-the-scenes with luxury artisans',
    pointsCost: 25000,
    value: 1500,
    category: 'experience',
    tier: ['sovereign'],
    limited: true,
    image: 'https://images.unsplash.com/photo-1585003811863-b9fa0a23dd83?w=200&h=200&fit=crop'
  },
  {
    id: '4',
    title: 'VIP Auction Access',
    description: 'Invitation to exclusive auction previews',
    pointsCost: 8000,
    value: 300,
    category: 'access',
    tier: ['prestige', 'sovereign'],
    limited: false,
    image: 'https://images.unsplash.com/photo-1594736797933-d0a9ba3fe1f3?w=200&h=200&fit=crop'
  },
  {
    id: '5',
    title: 'Personal Curator Session',
    description: '2-hour consultation with luxury expert',
    pointsCost: 12000,
    value: 400,
    category: 'service',
    tier: ['prestige', 'sovereign'],
    limited: false,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'
  },
  {
    id: '6',
    title: 'Annual Luxury Retreat',
    description: 'Exclusive weekend retreat for Sovereign members',
    pointsCost: 50000,
    value: 5000,
    category: 'experience',
    tier: ['sovereign'],
    limited: true,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=200&h=200&fit=crop'
  }
];

export default function LuxuryLoyalty({ userId, currentTier, totalSpend }: LoyaltyDashboardProps) {
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoints>({
    total: 47500,
    available: 38750,
    pending: 5250,
    expired: 3500,
    lifetime: 127500
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'earned',
      points: 2500,
      description: 'Purchase: Vintage Rolex Submariner',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      orderId: 'VRO-2024-001'
    },
    {
      id: '2',
      type: 'redeemed',
      points: -5000,
      description: 'Redeemed: $100 Luxury Credit',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      type: 'earned',
      points: 3750,
      description: 'Purchase: Contemporary Art Piece',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      orderId: 'CAP-2024-002'
    },
    {
      id: '4',
      type: 'earned',
      points: 500,
      description: 'Bonus: Referral Program',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    }
  ]);

  const currentTierData = loyaltyTiers.find(tier => tier.id === currentTier) || loyaltyTiers[0];
  const nextTier = loyaltyTiers[loyaltyTiers.findIndex(tier => tier.id === currentTier) + 1];
  const progressToNext = nextTier ? ((totalSpend - currentTierData.minSpend) / (nextTier.minSpend - currentTierData.minSpend)) * 100 : 100;
  const spendToNext = nextTier ? nextTier.minSpend - totalSpend : 0;

  const eligibleRewards = availableRewards.filter(reward =>
    reward.tier.includes(currentTier) && reward.pointsCost <= loyaltyPoints.available
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const redeemReward = (reward: Reward) => {
    if (loyaltyPoints.available >= reward.pointsCost) {
      setLoyaltyPoints(prev => ({
        ...prev,
        available: prev.available - reward.pointsCost
      }));

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'redeemed',
        points: -reward.pointsCost,
        description: `Redeemed: ${reward.title}`,
        date: new Date()
      };

      setTransactions(prev => [newTransaction, ...prev]);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Crown className="w-8 h-8 text-amber-600" />
            Loyalty Rewards
          </h1>
          <p className="text-muted-foreground">Exclusive benefits and rewards for our most valued members</p>
        </div>
      </div>

      {/* Current Status */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tier Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <currentTierData.icon className="w-6 h-6" />
              {currentTierData.name} Member
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{loyaltyPoints.available.toLocaleString()} Points Available</p>
                <p className="text-muted-foreground">
                  {loyaltyPoints.pending.toLocaleString()} pending • {loyaltyPoints.lifetime.toLocaleString()} lifetime
                </p>
              </div>
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${currentTierData.color} flex items-center justify-center`}>
                <currentTierData.icon className="w-8 h-8 text-white" />
              </div>
            </div>

            {nextTier && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress to {nextTier.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(spendToNext)} to go
                  </span>
                </div>
                <Progress value={Math.min(progressToNext, 100)} className="h-3" />
                <p className="text-xs text-muted-foreground mt-1">
                  Spend {formatCurrency(totalSpend)} of {formatCurrency(nextTier.minSpend)} required
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Current Benefits</h4>
                <ul className="space-y-1 text-sm">
                  {currentTierData.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Exclusive Perks</h4>
                <ul className="space-y-1 text-sm">
                  {currentTierData.exclusivePerks.map((perk, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Points Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Points Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Available</span>
                <span className="font-semibold">{loyaltyPoints.available.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pending</span>
                <span className="font-medium">{loyaltyPoints.pending.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Expired</span>
                <span className="font-medium text-red-600">{loyaltyPoints.expired.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span className="font-semibold">Lifetime Earned</span>
                  <span className="font-bold">{loyaltyPoints.lifetime.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-amber-800">Annual Value</span>
              </div>
              <p className="text-2xl font-bold text-amber-800">
                {formatCurrency(currentTierData.yearlyValue)}
              </p>
              <p className="text-xs text-amber-700">Estimated benefits value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {loyaltyTiers.map((tier) => (
              <div key={tier.id} className={`p-6 rounded-lg border-2 ${
                tier.id === currentTier ? 'border-amber-300 bg-amber-50' : 'border-gray-200'
              }`}>
                <div className="text-center mb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center mb-3`}>
                    <tier.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {tier.minSpend === 0 ? 'Starting tier' : `${formatCurrency(tier.minSpend)}+ annually`}
                  </p>
                  {tier.id === currentTier && (
                    <Badge className="mt-2 bg-amber-600 text-white">Current Tier</Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-center">{tier.multiplier}x Points Multiplier</p>
                  <ul className="space-y-1 text-xs">
                    {tier.benefits.slice(0, 3).map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        {benefit}
                      </li>
                    ))}
                    {tier.exclusivePerks.length > 0 && (
                      <li className="flex items-center gap-2 text-amber-700">
                        <Sparkles className="w-3 h-3" />
                        +{tier.exclusivePerks.length} exclusive perks
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rewards Catalog */}
      <Tabs defaultValue="rewards" className="space-y-6">
        <TabsList>
          <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
          <TabsTrigger value="history">Points History</TabsTrigger>
        </TabsList>

        <TabsContent value="rewards">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligibleRewards.map((reward) => (
              <Card key={reward.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={reward.image}
                    alt={reward.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{reward.title}</h3>
                    {reward.limited && (
                      <Badge variant="secondary" className="text-xs">Limited</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-bold">{reward.pointsCost.toLocaleString()} Points</p>
                      <p className="text-xs text-muted-foreground">
                        Value: {formatCurrency(reward.value)}
                      </p>
                    </div>
                    <Badge className={`${
                      reward.category === 'experience' ? 'bg-purple-100 text-purple-800' :
                      reward.category === 'access' ? 'bg-blue-100 text-blue-800' :
                      reward.category === 'service' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {reward.category}
                    </Badge>
                  </div>

                  <Button
                    onClick={() => redeemReward(reward)}
                    disabled={loyaltyPoints.available < reward.pointsCost}
                    className="w-full"
                  >
                    {loyaltyPoints.available >= reward.pointsCost ? 'Redeem Now' : 'Insufficient Points'}
                  </Button>

                  {reward.expiresAt && (
                    <p className="text-xs text-red-600 mt-2 text-center">
                      Expires {reward.expiresAt.toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Points Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'earned' ? 'bg-green-100' :
                        transaction.type === 'redeemed' ? 'bg-blue-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'earned' && <TrendingUp className="w-4 h-4 text-green-600" />}
                        {transaction.type === 'redeemed' && <Gift className="w-4 h-4 text-blue-600" />}
                        {transaction.type === 'expired' && <Clock className="w-4 h-4 text-red-600" />}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.date.toLocaleDateString()} • {transaction.date.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points.toLocaleString()}
                      </p>
                      {transaction.orderId && (
                        <p className="text-xs text-muted-foreground">{transaction.orderId}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
