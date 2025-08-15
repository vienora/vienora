'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Mail,
  Crown,
  Sparkles,
  Gift,
  Bell,
  Star,
  TrendingUp,
  Award,
  CheckCircle,
  Zap,
  Calendar,
  Users
} from 'lucide-react';

interface EmailSubscription {
  email: string;
  firstName?: string;
  lastName?: string;
  interests: string[];
  tier: 'elite' | 'prestige' | 'sovereign';
  source: string;
}

interface EmailCampaign {
  id: string;
  name: string;
  type: 'welcome' | 'product' | 'event' | 'newsletter';
  trigger: string;
  subject: string;
  preview: string;
  status: 'active' | 'draft' | 'paused';
  opens: number;
  clicks: number;
  conversions: number;
}

interface EmailMarketingProps {
  onSubscribe?: (subscription: EmailSubscription) => void;
  showDashboard?: boolean;
}

const emailCampaigns: EmailCampaign[] = [
  {
    id: '1',
    name: 'Elite Welcome Series',
    type: 'welcome',
    trigger: 'New subscription',
    subject: 'Welcome to the Elite Circle',
    preview: 'Your exclusive access to luxury awaits...',
    status: 'active',
    opens: 2847,
    clicks: 892,
    conversions: 234
  },
  {
    id: '2',
    name: 'Private Collection Alert',
    type: 'product',
    trigger: 'New luxury item',
    subject: 'Exclusive: Museum-Quality Piece Available',
    preview: 'Limited edition acquisition opportunity...',
    status: 'active',
    opens: 1923,
    clicks: 634,
    conversions: 89
  },
  {
    id: '3',
    name: 'VIP Event Invitation',
    type: 'event',
    trigger: 'Exclusive events',
    subject: 'You\'re Invited: Private Gallery Opening',
    preview: 'An evening of rare acquisitions and fine art...',
    status: 'active',
    opens: 1456,
    clicks: 892,
    conversions: 345
  },
  {
    id: '4',
    name: 'Weekly Luxury Insights',
    type: 'newsletter',
    trigger: 'Weekly schedule',
    subject: 'This Week in Luxury: Curated by Experts',
    preview: 'Market insights, rare finds, and expert analysis...',
    status: 'active',
    opens: 3421,
    clicks: 1234,
    conversions: 167
  }
];

const interestCategories = [
  { id: 'art', label: 'Fine Art & Collectibles', icon: Sparkles },
  { id: 'watches', label: 'Luxury Timepieces', icon: Crown },
  { id: 'jewelry', label: 'Precious Jewelry', icon: Star },
  { id: 'vehicles', label: 'Exotic Vehicles', icon: TrendingUp },
  { id: 'real-estate', label: 'Luxury Properties', icon: Award },
  { id: 'wine', label: 'Rare Wines & Spirits', icon: Gift }
];

export default function EmailMarketing({ onSubscribe, showDashboard = false }: EmailMarketingProps) {
  const [subscription, setSubscription] = useState<EmailSubscription>({
    email: '',
    firstName: '',
    lastName: '',
    interests: [],
    tier: 'elite',
    source: 'homepage'
  });

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInterestToggle = (interestId: string) => {
    setSubscription(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleSubscribe = async () => {
    if (!subscription.email) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Trigger welcome automation
    await triggerWelcomeSequence(subscription);

    if (onSubscribe) {
      onSubscribe(subscription);
    }

    setIsSubscribed(true);
    setIsLoading(false);
  };

  const triggerWelcomeSequence = async (sub: EmailSubscription) => {
    // Welcome email automation sequence
    const welcomeSequence = [
      {
        delay: 0,
        subject: 'Welcome to Vienora Elite',
        content: 'Immediate welcome + exclusive access guide'
      },
      {
        delay: 24,
        subject: 'Your Personal Curator Awaits',
        content: 'Introduction to personal shopping service'
      },
      {
        delay: 72,
        subject: 'Exclusive Preview: This Week\'s Acquisitions',
        content: 'First look at new luxury items'
      },
      {
        delay: 168,
        subject: 'Elite Member Spotlight & Private Sale',
        content: 'Member story + exclusive sale access'
      }
    ];

    console.log('Welcome sequence triggered:', welcomeSequence);
  };

  if (showDashboard) {
    return (
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Email Marketing Dashboard</h2>
            <p className="text-muted-foreground">Luxury audience engagement and automation</p>
          </div>
          <Button>
            <Mail className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Elite Subscribers</p>
                  <p className="text-2xl font-bold">12,847</p>
                </div>
                <Users className="w-8 h-8 text-amber-600" />
              </div>
              <p className="text-xs text-green-600 mt-1">+234 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Rate</p>
                  <p className="text-2xl font-bold">68.3%</p>
                </div>
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-xs text-green-600 mt-1">+5.2% vs luxury avg</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Click Rate</p>
                  <p className="text-2xl font-bold">24.7%</p>
                </div>
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-xs text-green-600 mt-1">+8.1% vs last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">$847K</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-xs text-green-600 mt-1">From email campaigns</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emailCampaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      campaign.status === 'active' ? 'bg-green-500' :
                      campaign.status === 'paused' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                    <div>
                      <h4 className="font-semibold">{campaign.name}</h4>
                      <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1">{campaign.trigger}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold">{campaign.opens.toLocaleString()}</p>
                      <p className="text-muted-foreground">Opens</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{campaign.clicks.toLocaleString()}</p>
                      <p className="text-muted-foreground">Clicks</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{campaign.conversions}</p>
                      <p className="text-muted-foreground">Sales</p>
                    </div>
                    <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 max-w-md mx-auto">
        <CardContent className="text-center p-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Welcome to The Elite</h3>
          <p className="text-muted-foreground mb-4">
            You've successfully joined our exclusive circle. Expect your first curator insight within 24 hours.
          </p>
          <Badge className="bg-amber-600 text-white">
            <Crown className="w-3 h-3 mr-1" />
            Elite Member
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Crown className="w-6 h-6 text-amber-600" />
          <CardTitle className="text-2xl">Join The Elite</CardTitle>
        </div>
        <p className="text-muted-foreground">
          Receive first access to rare acquisitions, private sales, and exclusive opportunities
          reserved for our most valued members.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Email Signup */}
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="First Name"
                value={subscription.firstName}
                onChange={(e) => setSubscription(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div>
              <Input
                placeholder="Last Name"
                value={subscription.lastName}
                onChange={(e) => setSubscription(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={subscription.email}
              onChange={(e) => setSubscription(prev => ({ ...prev, email: e.target.value }))}
              className="text-lg"
            />
          </div>
        </div>

        <Separator />

        {/* Interest Selection */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Your Luxury Interests
          </h4>
          <div className="grid md:grid-cols-2 gap-3">
            {interestCategories.map((category) => (
              <div key={category.id} className="flex items-center space-x-3">
                <Checkbox
                  id={category.id}
                  checked={subscription.interests.includes(category.id)}
                  onCheckedChange={() => handleInterestToggle(category.id)}
                />
                <label htmlFor={category.id} className="flex items-center gap-2 cursor-pointer">
                  <category.icon className="w-4 h-4 text-amber-600" />
                  <span className="text-sm">{category.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Membership Tier Selection */}
        <div>
          <h4 className="font-semibold mb-3">Membership Level</h4>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { id: 'elite', name: 'Elite', icon: Star, desc: 'Curated collections' },
              { id: 'prestige', name: 'Prestige', icon: Crown, desc: 'Private auctions' },
              { id: 'sovereign', name: 'Sovereign', icon: Award, desc: 'Bespoke service' }
            ].map((tier) => (
              <Button
                key={tier.id}
                variant={subscription.tier === tier.id ? "default" : "outline"}
                onClick={() => setSubscription(prev => ({ ...prev, tier: tier.id as any }))}
                className="h-auto p-4 flex-col"
              >
                <tier.icon className="w-5 h-5 mb-2" />
                <span className="font-semibold">{tier.name}</span>
                <span className="text-xs text-muted-foreground">{tier.desc}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* What You'll Receive */}
        <Card className="bg-slate-50">
          <CardContent className="p-4">
            <h5 className="font-semibold mb-3 flex items-center gap-2">
              <Gift className="w-4 h-4 text-amber-600" />
              What You'll Receive
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>Weekly curator insights and market analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>First access to new luxury acquisitions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>Exclusive private sale invitations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>VIP event and gallery opening invites</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscribe Button */}
        <Button
          onClick={handleSubscribe}
          disabled={!subscription.email || isLoading}
          className="w-full h-12 text-lg bg-amber-600 hover:bg-amber-700"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Joining Elite Circle...
            </>
          ) : (
            <>
              <Crown className="w-4 h-4 mr-2" />
              Join The Elite Circle
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          By subscribing, you agree to receive exclusive communications from Vienora.
          Unsubscribe at any time. No spam, only luxury.
        </p>
      </CardContent>
    </Card>
  );
}
