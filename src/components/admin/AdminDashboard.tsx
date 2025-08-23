'use client';

/**
 * Admin Dashboard Component
 * Comprehensive management interface with user control, analytics, and system monitoring
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  Users,
  BarChart3,
  AlertTriangle,
  Settings,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Crown,
  Star,
  Calendar,
  Activity,
  Database,
  Cpu,
  HardDrive,
  Globe
} from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { AdminDashboardData, DashboardResult } from '@/lib/types/dashboard';

// ========================================
// Component Props
// ========================================

interface AdminDashboardProps {
  readonly className?: string;
}

// ========================================
// Admin Dashboard Component
// ========================================

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ className = '' }) => {
  const { user, isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analytics' | 'security' | 'system'>('overview');
  const [refreshing, setRefreshing] = useState(false);

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

      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vienora_access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to load admin dashboard');
      }

      const result: DashboardResult<AdminDashboardData> = await response.json();

      if (result.success) {
        setDashboardData(result.data);
      } else {
        throw new Error(result.error.message);
      }

    } catch (error) {
      console.error('Error fetching admin dashboard:', error);
      setError(error instanceof Error ? error.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ========================================
  // Loading and Error States
  // ========================================

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gray-50 ${className}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="text-xl font-semibold text-gray-900 mb-2">Loading Admin Dashboard</div>
            <div className="text-gray-600">Preparing management interface...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-all"
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
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">
                  Welcome back, {user?.firstName} • {user?.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{dashboardData.overview.totalUsers}</div>
                  <div className="text-gray-600">Total Users</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">{dashboardData.overview.activeUsers}</div>
                  <div className="text-gray-600">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">${dashboardData.overview.revenueThisMonth.toLocaleString()}</div>
                  <div className="text-gray-600">Monthly Revenue</div>
                </div>
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
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'system', label: 'System Health', icon: Activity }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
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
        {activeTab === 'users' && <UsersTab data={dashboardData} />}
        {activeTab === 'analytics' && <AnalyticsTab data={dashboardData} />}
        {activeTab === 'security' && <SecurityTab data={dashboardData} />}
        {activeTab === 'system' && <SystemTab data={dashboardData} />}
      </div>
    </div>
  );
};

// ========================================
// Overview Tab Component
// ========================================

const OverviewTab: React.FC<{ data: AdminDashboardData }> = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Alerts Section */}
      {data.overview.alerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-yellow-800">Active Alerts</h3>
          </div>
          <div className="space-y-2">
            {data.overview.alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between py-2 px-3 bg-white rounded border">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    alert.severity === 'critical' ? 'bg-red-500' :
                    alert.severity === 'error' ? 'bg-red-400' :
                    alert.severity === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div>
                    <div className="font-medium text-gray-900">{alert.message}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(alert.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'error' ? 'bg-red-100 text-red-700' :
                    alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.severity}
                  </span>
                  {alert.actionRequired && (
                    <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
                      Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.overview.quickStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.period}</div>
              </div>
              <div className={`flex items-center text-sm ${
                stat.trend === 'increasing' ? 'text-green-600' :
                stat.trend === 'decreasing' ? 'text-red-600' :
                'text-gray-500'
              }`}>
                <TrendingUp className={`w-4 h-4 mr-1 ${
                  stat.trend === 'decreasing' ? 'rotate-180' : ''
                }`} />
                {stat.change > 0 ? '+' : ''}{stat.change}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Membership Distribution */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Membership Distribution</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { tier: 'Basic', count: data.overview.membershipDistribution.basic, color: 'gray' },
            { tier: 'Premium', count: data.overview.membershipDistribution.premium, color: 'blue' },
            { tier: 'Elite', count: data.overview.membershipDistribution.elite, color: 'purple' },
            { tier: 'Ultra Elite', count: data.overview.membershipDistribution.ultraElite, color: 'amber' }
          ].map((tier) => (
            <div key={tier.tier} className="text-center">
              <div className={`w-16 h-16 bg-${tier.color}-100 rounded-full flex items-center justify-center mx-auto mb-2`}>
                <Crown className={`w-8 h-8 text-${tier.color}-600`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{tier.count}</div>
              <div className="text-sm text-gray-600">{tier.tier}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Platform Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* Demo recent activities */}
            {[
              { action: 'New user registration', user: 'alice@example.com', time: '2 minutes ago', type: 'user' },
              { action: 'VIP membership upgrade', user: 'bob@example.com', time: '15 minutes ago', type: 'upgrade' },
              { action: 'Product purchase', user: 'carol@example.com', time: '32 minutes ago', type: 'purchase' },
              { action: 'Admin login', user: 'admin@vienora.com', time: '1 hour ago', type: 'admin' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    activity.type === 'user' ? 'bg-green-100' :
                    activity.type === 'upgrade' ? 'bg-purple-100' :
                    activity.type === 'purchase' ? 'bg-blue-100' :
                    'bg-gray-100'
                  }`}>
                    {activity.type === 'user' && <Users className="w-4 h-4 text-green-600" />}
                    {activity.type === 'upgrade' && <Crown className="w-4 h-4 text-purple-600" />}
                    {activity.type === 'purchase' && <Star className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'admin' && <Shield className="w-4 h-4 text-gray-600" />}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{activity.action}</div>
                    <div className="text-sm text-gray-500">{activity.user}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================
// Users Tab Component
// ========================================

const UsersTab: React.FC<{ data: AdminDashboardData }> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-6">
      {/* User Management Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
            <p className="text-gray-600">Manage user accounts, roles, and membership tiers</p>
          </div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
            Add New User
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                <option>All Roles</option>
                <option>User</option>
                <option>VIP</option>
                <option>Admin</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                <option>All Tiers</option>
                <option>Basic</option>
                <option>Premium</option>
                <option>Elite</option>
                <option>Ultra Elite</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Suspended</option>
              </select>
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Registration Date"
              />
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LTV</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.userManagement.users.slice(0, 10).map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                        }
                      }}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {user.fullName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.membershipTier === 'ultra_elite' ? 'bg-amber-100 text-amber-800' :
                      user.membershipTier === 'elite' ? 'bg-purple-100 text-purple-800' :
                      user.membershipTier === 'premium' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.membershipTier.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'super_admin' || user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'vip' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.status === 'active' ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mr-2" />
                      )}
                      <span className="text-sm text-gray-900 capitalize">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${user.lifetimeValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-purple-600 hover:text-purple-900">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Settings className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                <span className="font-medium">{data.userManagement.pagination.totalItems}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">{selectedUsers.length} users selected</span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700">
                Upgrade Tier
              </button>
              <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                Send Notification
              </button>
              <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                Deactivate
              </button>
            </div>
            <button
              onClick={() => setSelectedUsers([])}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ========================================
// Analytics Tab Component
// ========================================

const AnalyticsTab: React.FC<{ data: AdminDashboardData }> = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Revenue</span>
              <span className="text-2xl font-bold text-gray-900">${data.analytics.revenueAnalytics.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Growth Rate</span>
              <span className="text-lg font-semibold text-green-600">+{data.analytics.revenueAnalytics.revenueGrowth}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Order Value</span>
              <span className="text-lg font-semibold text-gray-900">${data.analytics.revenueAnalytics.averageOrderValue}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Recurring</span>
              <span className="text-lg font-semibold text-blue-600">${data.analytics.revenueAnalytics.monthlyRecurring.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Daily Active Users</span>
              <span className="text-2xl font-bold text-gray-900">{data.analytics.engagementMetrics.dailyActiveUsers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Session Duration</span>
              <span className="text-lg font-semibold text-gray-900">{data.analytics.engagementMetrics.sessionDuration} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Page Views</span>
              <span className="text-lg font-semibold text-gray-900">{data.analytics.engagementMetrics.pageViews.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bounce Rate</span>
              <span className="text-lg font-semibold text-gray-900">{data.analytics.engagementMetrics.bounceRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Tier */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Membership Tier</h3>
        <div className="space-y-4">
          {data.analytics.revenueAnalytics.revenueByTier.map((tier) => (
            <div key={tier.tier} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded mr-3 ${
                  tier.tier === 'ultra_elite' ? 'bg-amber-500' :
                  tier.tier === 'elite' ? 'bg-purple-500' :
                  tier.tier === 'premium' ? 'bg-blue-500' :
                  'bg-gray-500'
                }`} />
                <span className="font-medium text-gray-900">
                  {tier.tier.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      tier.tier === 'ultra_elite' ? 'bg-amber-500' :
                      tier.tier === 'elite' ? 'bg-purple-500' :
                      tier.tier === 'premium' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }`}
                    style={{ width: `${tier.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-20 text-right">
                  ${tier.revenue.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 w-8 text-right">
                  {tier.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth Trend</h3>
        <div className="h-64 flex items-end justify-around bg-gray-50 rounded p-4">
          {data.analytics.userGrowth.newUsers.map((dataPoint) => (
            <div key={dataPoint.date} className="flex flex-col items-center">
              <div
                className="bg-purple-500 rounded-t w-12"
                style={{ height: `${(dataPoint.value / 250) * 200}px` }}
              />
              <div className="text-xs text-gray-600 mt-2">{dataPoint.date}</div>
              <div className="text-xs font-medium text-gray-900">{dataPoint.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ========================================
// Security Tab Component
// ========================================

const SecurityTab: React.FC<{ data: AdminDashboardData }> = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{data.securityMonitoring.failedLoginAttempts}</div>
              <div className="text-sm text-gray-600">Failed Login Attempts</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{data.securityMonitoring.suspiciousActivities}</div>
              <div className="text-sm text-gray-600">Suspicious Activities</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{data.securityMonitoring.blockedIPs}</div>
              <div className="text-sm text-gray-600">Blocked IP Addresses</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Security Alerts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Active Security Alerts</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {data.securityMonitoring.activeSecurityAlerts.map((alert: any) => (
              <div key={alert.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    alert.severity === 'high' ? 'bg-red-500' :
                    alert.severity === 'medium' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div>
                    <div className="font-medium text-gray-900">{alert.description}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(alert.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.severity}
                  </span>
                  <button className="text-red-600 text-sm font-medium hover:text-red-700">
                    Investigate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Audit Logs</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {data.securityMonitoring.auditLogs.map((log: any) => (
              <div key={log.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <div className="font-medium text-gray-900">
                    {log.action.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </div>
                  <div className="text-sm text-gray-500">
                    User: {log.userId} • Target: {log.target}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(log.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
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
// System Tab Component
// ========================================

const SystemTab: React.FC<{ data: AdminDashboardData }> = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{data.systemHealth.uptime}%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{data.systemHealth.responseTime}ms</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{data.systemHealth.cpuUsage}%</div>
              <div className="text-sm text-gray-600">CPU Usage</div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Cpu className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{data.systemHealth.memoryUsage}%</div>
              <div className="text-sm text-gray-600">Memory Usage</div>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <HardDrive className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Database Connections</span>
                <div className="flex items-center">
                  <span className="text-gray-900 font-medium mr-2">{data.systemHealth.databaseConnections}</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Error Rate</span>
                <div className="flex items-center">
                  <span className="text-gray-900 font-medium mr-2">{data.systemHealth.errorRate}%</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Disk Usage</span>
                <div className="flex items-center">
                  <span className="text-gray-900 font-medium mr-2">{data.systemHealth.diskUsage}%</span>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">API Response Time</span>
                <span className="text-gray-900 font-medium">{data.systemHealth.performance.apiResponseTime}ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cache Hit Rate</span>
                <span className="text-gray-900 font-medium">{data.systemHealth.performance.cacheHitRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Concurrent Users</span>
                <span className="text-gray-900 font-medium">{data.systemHealth.performance.concurrentUsers}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Errors */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent System Errors</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {data.systemHealth.recentErrors.map((error: any) => (
              <div key={error.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    error.level === 'error' ? 'bg-red-500' :
                    error.level === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div>
                    <div className="font-medium text-gray-900">{error.message}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(error.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    error.level === 'error' ? 'bg-red-100 text-red-800' :
                    error.level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {error.level}
                  </span>
                  <button className="text-gray-600 text-sm font-medium hover:text-gray-700">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
