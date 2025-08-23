'use client';

/**
 * VIP Dashboard Component
 * Exclusive luxury dashboard for VIP members with premium benefits and content
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Crown,
  Star,
  Gift,
  Calendar,
  TrendingUp,
  Award,
  Sparkles,
  ShoppingBag,
  Heart,
  MessageCircle,
  Clock,
  BarChart3,
  Users,
  Zap,
  Target,
  Gem
} from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { VipDashboardData, DashboardResult } from '@/lib/types/dashboard';

// ========================================
// Component Props
// ========================================

interface VipDashboardProps {
  readonly className?: string;
}

// ========================================
// VIP Dashboard Component
// ========================================

export const VipDashboard: React.FC<VipDashboardProps> = ({ className = '' }) => {
  const { user, isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState<VipDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'exclusive' | 'rewards' | 'events' | 'analytics'>('overview');

  // ========================================
  // Data Fetching
  // ========================================

  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setError('Authentication required');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/vip/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vienora_access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to load VIP dashboard');
      }

      const result: DashboardResult<VipDashboardData> = await response.json();

      if (result.success) {
        setDashboardData(result.data);
      } else {
        throw new Error(result.error.message);
      }

    } catch (error) {
      console.error('Error fetching VIP dashboard:', error);
      setError(error instanceof Error ? error.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ========================================
  // Loading and Error States
  // ========================================

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 ${className}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div className="text-xl font-semibold text-gray-900 mb-2">Loading VIP Dashboard</div>
            <div className="text-gray-600">Preparing your exclusive content...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 flex items-center justify-center ${className}`}>
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">VIP Access Required</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mr-6">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back, {dashboardData.user.firstName}
                </h1>
                <p className="text-purple-100 mt-1">
                  {dashboardData.membershipStatus.currentTier.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Member since {' '}
                  {new Date(dashboardData.membershipStatus.memberSince).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{dashboardData.rewards.currentCredits.toLocaleString()}</div>
                <div className="text-purple-100 text-sm">Luxury Credits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{dashboardData.membershipStatus.usage.monthlyCreditsUsed}</div>
                <div className="text-purple-100 text-sm">Credits Used</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'exclusive', label: 'Exclusive Content', icon: Gem },
              { id: 'rewards', label: 'Rewards', icon: Gift },
              { id: 'events', label: 'Events', icon: Calendar },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewTab data={dashboardData} />}
        {activeTab === 'exclusive' && <ExclusiveContentTab data={dashboardData} />}
        {activeTab === 'rewards' && <RewardsTab data={dashboardData} />}
        {activeTab === 'events' && <EventsTab data={dashboardData} />}
        {activeTab === 'analytics' && <AnalyticsTab data={dashboardData} />}
      </div>
    </div>
  );
};

// ========================================
// Overview Tab Component
// ========================================

const OverviewTab: React.FC<{ data: VipDashboardData }> = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Membership Status Card */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mr-4">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-900">
                {data.membershipStatus.currentTier.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Member
              </h3>
              <p className="text-amber-700">Active since {new Date(data.membershipStatus.memberSince).getFullYear()}</p>
            </div>
          </div>

          {data.membershipStatus.nextTierRequirements && (
            <div className="text-right">
              <div className="text-sm text-amber-700 mb-1">
                Progress to {data.membershipStatus.nextTierRequirements.targetTier.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
              <div className="w-48 bg-amber-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full"
                  style={{ width: `${data.membershipStatus.nextTierRequirements.progressPercentage}%` }}
                />
              </div>
              <div className="text-xs text-amber-600 mt-1">
                ${data.membershipStatus.nextTierRequirements.currentSpending.toLocaleString()} / ${data.membershipStatus.nextTierRequirements.requiredSpending.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <ShoppingBag className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{data.membershipStatus.usage.exclusiveProductsViewed}</div>
              <div className="text-sm text-gray-600">Exclusive Products Viewed</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Gift className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">${data.membershipStatus.usage.discountsSaved.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Savings This Month</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{data.concierge.remainingHours}</div>
              <div className="text-sm text-gray-600">Concierge Hours Left</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{data.rewards.currentCredits.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Available Credits</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gray-500" />
            Recent VIP Activities
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {data.activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mr-3">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{activity.description}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-purple-600 font-medium">
                  {getActivityBadge(activity.type)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================
// Exclusive Content Tab Component
// ========================================

const ExclusiveContentTab: React.FC<{ data: VipDashboardData }> = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Featured Collections */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Gem className="w-6 h-6 mr-2 text-purple-600" />
          Exclusive Collections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.exclusiveContent.collections.map((collection) => (
            <div key={collection.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={collection.imageUrl}
                  alt={collection.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{collection.name}</h3>
                  {collection.featured && (
                    <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{collection.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {collection.productCount} exclusive items
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                    Explore Collection
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exclusive Products */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Sparkles className="w-6 h-6 mr-2 text-amber-600" />
          VIP-Only Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.exclusiveContent.products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="aspect-w-1 aspect-h-1">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    {product.exclusivityLevel.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.availability === 'available' ? 'bg-green-100 text-green-800' :
                    product.availability === 'limited' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.availability.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold text-gray-900">${product.price.toLocaleString()}</div>
                    {product.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">${product.originalPrice.toLocaleString()}</div>
                    )}
                  </div>
                  <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-amber-600 hover:to-amber-700 transition-all">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ========================================
// Rewards Tab Component
// ========================================

const RewardsTab: React.FC<{ data: VipDashboardData }> = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Rewards Overview */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Your Luxury Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{data.rewards.currentCredits.toLocaleString()}</div>
            <div className="text-purple-100">Available Credits</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{data.rewards.lifetimeCredits.toLocaleString()}</div>
            <div className="text-purple-100">Lifetime Earned</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{data.rewards.pointsToNextReward}</div>
            <div className="text-purple-100">To Next Reward</div>
          </div>
        </div>
      </div>

      {/* Available Rewards */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Rewards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.rewards.availableRewards.map((reward) => (
            <div key={reward.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{reward.name}</h4>
                  <p className="text-gray-600 mb-4">{reward.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-amber-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{reward.cost} credits</span>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        data.rewards.currentCredits >= reward.cost
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={data.rewards.currentCredits < reward.cost}
                    >
                      {data.rewards.currentCredits >= reward.cost ? 'Redeem' : 'Insufficient Credits'}
                    </button>
                  </div>
                </div>
                <img
                  src={reward.imageUrl}
                  alt={reward.name}
                  className="w-16 h-16 object-cover rounded-lg ml-4"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Offers */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Special Offers</h3>
        <div className="space-y-4">
          {data.rewards.specialOffers.map((offer) => (
            <div key={offer.id} className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-amber-900">{offer.title}</h4>
                  <p className="text-amber-700 mb-2">{offer.description}</p>
                  <div className="text-sm text-amber-600">
                    Valid until {new Date(offer.validUntil).toLocaleDateString()}
                    {offer.minimumPurchase && ` • Minimum purchase: $${offer.minimumPurchase.toLocaleString()}`}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-900">{offer.discountPercentage}%</div>
                  <div className="text-amber-700 text-sm">OFF</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ========================================
// Events Tab Component
// ========================================

const EventsTab: React.FC<{ data: VipDashboardData }> = ({ data }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-purple-600" />
          Exclusive VIP Events
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <img
                src={event.imageUrl}
                alt={event.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    event.status === 'registration_open' ? 'bg-green-100 text-green-800' :
                    event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <div className="text-sm text-gray-500">
                    {event.registeredCount}/{event.capacity} registered
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.name}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(event.eventDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {event.location.city}, {event.location.country}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">Event Features:</div>
                  <div className="flex flex-wrap gap-2">
                    {event.features.map((feature, index) => (
                      <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {event.status === 'registration_open' && (
                  <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                    Register for Event
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ========================================
// Analytics Tab Component
// ========================================

const AnalyticsTab: React.FC<{ data: VipDashboardData }> = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Spending Analytics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          Spending Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {data.analytics.spendingHistory.slice(-4).map((period) => (
            <div key={period.period} className="text-center">
              <div className="text-2xl font-bold text-gray-900">${period.amount.toLocaleString()}</div>
              <div className="text-sm text-gray-600">{period.period}</div>
              <div className="text-xs text-green-600">+${period.savingsFromDiscounts} saved</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Preferences */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-purple-600" />
          Shopping Preferences
        </h3>
        <div className="space-y-4">
          {data.analytics.preferenceAnalysis.topCategories.map((category) => (
            <div key={category.category} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{category.category}</span>
                  <span className="text-sm text-gray-600">{category.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
              <div className="ml-4">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  category.trend === 'increasing' ? 'bg-green-100 text-green-800' :
                  category.trend === 'decreasing' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {category.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Membership Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-amber-600" />
          Membership Progress
        </h3>
        <div className="space-y-6">
          {data.analytics.membershipProgress.milestones.map((milestone) => (
            <div key={milestone.id} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{milestone.name}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  milestone.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {milestone.completed ? 'Completed' : 'In Progress'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{milestone.description}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  {milestone.currentValue.toLocaleString()} / {milestone.targetValue.toLocaleString()}
                </span>
                <span className="text-sm font-medium text-purple-600">
                  {Math.round((milestone.currentValue / milestone.targetValue) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full"
                  style={{ width: `${Math.min((milestone.currentValue / milestone.targetValue) * 100, 100)}%` }}
                />
              </div>
              {milestone.reward && (
                <div className="text-xs text-amber-600 mt-2">Reward: {milestone.reward}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ========================================
// Utility Functions
// ========================================

function getActivityIcon(type: string) {
  const icons = {
    purchase: <ShoppingBag className="w-4 h-4 text-purple-600" />,
    exclusive_access: <Gem className="w-4 h-4 text-purple-600" />,
    reward_redemption: <Gift className="w-4 h-4 text-purple-600" />,
    tier_upgrade: <TrendingUp className="w-4 h-4 text-purple-600" />,
    event_registration: <Calendar className="w-4 h-4 text-purple-600" />,
    concierge_request: <MessageCircle className="w-4 h-4 text-purple-600" />
  };
  return icons[type as keyof typeof icons] || <Zap className="w-4 h-4 text-purple-600" />;
}

function getActivityBadge(type: string) {
  const badges = {
    purchase: 'Purchase',
    exclusive_access: 'VIP Access',
    reward_redemption: 'Reward',
    tier_upgrade: 'Upgrade',
    event_registration: 'Event',
    concierge_request: 'Concierge'
  };
  return badges[type as keyof typeof badges] || 'Activity';
}
