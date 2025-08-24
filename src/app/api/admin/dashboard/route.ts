/**
 * Admin Dashboard API Endpoint
 * Comprehensive admin interface with user management and platform analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateApiToken } from '@/lib/auth/jwt';
import { AuthErrorCode, Permission } from '@/lib/types/auth';
import { hasPermission } from '@/lib/constants/membership';
import {
  AdminDashboardData,
  AdminOverview,
  UserManagementData,
  AdminAnalytics,
  DashboardResult
} from '@/lib/types/dashboard';
import { AuthService } from '@/lib/auth/service';

// Configure for dynamic deployment
export const dynamic = 'force-dynamic';

// ========================================
// Admin Dashboard Data Endpoint
// ========================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Validate authentication and admin access
    const authCheck = await validateAdminAccess(request);
    if (!authCheck.success) {
      return authCheck.response;
    }

    const { userId, user } = authCheck;

    // Generate admin dashboard data
    const dashboardData = await generateAdminDashboardData(user);

    return NextResponse.json(
      {
        success: true,
        data: dashboardData
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Unexpected error in admin dashboard:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: AuthErrorCode.UNKNOWN_ERROR,
          message: 'An unexpected error occurred while loading admin dashboard',
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

// ========================================
// Admin Access Validation
// ========================================

interface AdminAccessResult {
  readonly success: boolean;
  readonly response: NextResponse;
  readonly userId?: string;
  readonly user?: any;
}

async function validateAdminAccess(request: NextRequest): Promise<AdminAccessResult> {
  // Validate authentication token
  const tokenValidation = await validateApiToken(request);

  if (!tokenValidation.success) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: {
            code: tokenValidation.error.code,
            message: tokenValidation.error.message,
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      )
    };
  }

  const { userId } = tokenValidation.data;

  // Get user to check admin access
  const authService = new AuthService();
  const user = await authService.getUserById(userId);

  if (!user) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.USER_NOT_FOUND,
            message: 'User not found',
            timestamp: new Date().toISOString()
          }
        },
        { status: 404 }
      )
    };
  }

  // Check admin access permissions
  if (!hasPermission(user.role, Permission.VIEW_ANALYTICS)) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.INSUFFICIENT_PERMISSIONS,
            message: 'Admin access required for this dashboard',
            details: {
              currentRole: user.role,
              requiredPermission: Permission.VIEW_ANALYTICS
            },
            timestamp: new Date().toISOString()
          }
        },
        { status: 403 }
      )
    };
  }

  return {
    success: true,
    response: NextResponse.json({}), // Won't be used
    userId,
    user
  };
}

// ========================================
// Admin Dashboard Data Generation
// ========================================

async function generateAdminDashboardData(user: any): Promise<AdminDashboardData> {
  const authService = new AuthService();
  const allUsers = await authService.getAllUsers();

  // Generate admin overview
  const overview = generateAdminOverview(allUsers);

  // Generate user management data
  const userManagement = generateUserManagementData(allUsers);

  // Generate analytics
  const analytics = generateAdminAnalytics(allUsers);

  // Generate other admin data
  const membershipControl = generateMembershipControlData(allUsers);
  const securityMonitoring = generateSecurityMonitoringData();
  const contentManagement = generateContentManagementData();
  const systemHealth = generateSystemHealthData();

  return {
    overview,
    userManagement,
    analytics,
    membershipControl,
    securityMonitoring,
    contentManagement,
    systemHealth
  };
}

function generateAdminOverview(users: any[]): AdminOverview {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const activeUsers = users.filter(u => u.isActive).length;
  const newUsersToday = users.filter(u =>
    new Date(u.createdAt) >= yesterday
  ).length;

  const membershipDistribution = {
    basic: users.filter(u => u.membershipTier === 'basic').length,
    premium: users.filter(u => u.membershipTier === 'premium').length,
    elite: users.filter(u => u.membershipTier === 'elite').length,
    ultraElite: users.filter(u => u.membershipTier === 'ultra_elite').length
  };

  return {
    totalUsers: users.length,
    activeUsers,
    newUsersToday,
    revenueToday: 45670, // Demo data
    revenueThisMonth: 1234500, // Demo data
    membershipDistribution,
    quickStats: [
      {
        label: 'User Growth',
        value: '+12.5%',
        change: 12.5,
        trend: 'increasing' as any,
        period: 'vs last month'
      },
      {
        label: 'VIP Conversion',
        value: '18.3%',
        change: 2.1,
        trend: 'increasing' as any,
        period: 'this month'
      },
      {
        label: 'Avg Order Value',
        value: '$1,245',
        change: -3.2,
        trend: 'decreasing' as any,
        period: 'vs last month'
      },
      {
        label: 'Customer Satisfaction',
        value: '4.8/5',
        change: 0.2,
        trend: 'increasing' as any,
        period: 'monthly avg'
      }
    ],
    alerts: [
      {
        id: 'alert-001',
        type: 'security' as any,
        severity: 'warning' as any,
        message: '3 failed login attempts detected from new IP addresses',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        acknowledged: false,
        actionRequired: true
      },
      {
        id: 'alert-002',
        type: 'performance' as any,
        severity: 'info' as any,
        message: 'API response time increased by 15% in last hour',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        acknowledged: false,
        actionRequired: false
      }
    ]
  };
}

function generateUserManagementData(users: any[]): UserManagementData {
  const adminUserViews = users.map(user => ({
    id: user.id,
    email: user.email,
    fullName: `${user.firstName} ${user.lastName}`,
    membershipTier: user.membershipTier,
    role: user.role,
    status: user.isActive ? 'active' as any : 'inactive' as any,
    createdAt: new Date(user.createdAt),
    lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined,
    lifetimeValue: Math.floor(Math.random() * 50000) + 1000, // Demo data
    riskScore: Math.floor(Math.random() * 100), // Demo data
    flags: [] // Demo: no flags
  }));

  return {
    users: adminUserViews,
    filters: {
      // Default empty filters
    },
    pagination: {
      currentPage: 1,
      totalPages: Math.ceil(users.length / 20),
      pageSize: 20,
      totalItems: users.length
    },
    bulkActions: [
      {
        id: 'deactivate',
        name: 'Deactivate Users',
        description: 'Temporarily deactivate selected user accounts',
        requiresConfirmation: true,
        permissions: [Permission.MANAGE_USERS]
      },
      {
        id: 'upgrade-tier',
        name: 'Upgrade Membership',
        description: 'Upgrade membership tier for selected users',
        requiresConfirmation: true,
        permissions: [Permission.MANAGE_USERS]
      },
      {
        id: 'send-notification',
        name: 'Send Notification',
        description: 'Send notification to selected users',
        requiresConfirmation: false,
        permissions: [Permission.MANAGE_USERS]
      }
    ]
  };
}

function generateAdminAnalytics(users: any[]): AdminAnalytics {
  const thisMonth = new Date();
  const lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1, 1);

  return {
    userGrowth: {
      newUsers: [
        { date: '2024-08', value: 145 },
        { date: '2024-09', value: 189 },
        { date: '2024-10', value: 167 },
        { date: '2024-11', value: 203 }
      ],
      userRetention: [
        { cohort: '2024-08', period: 1, retentionRate: 85 },
        { cohort: '2024-08', period: 2, retentionRate: 72 },
        { cohort: '2024-08', period: 3, retentionRate: 68 },
        { cohort: '2024-09', period: 1, retentionRate: 88 },
        { cohort: '2024-09', period: 2, retentionRate: 74 }
      ],
      churnRate: 5.2,
      growthRate: 12.5
    },
    revenueAnalytics: {
      totalRevenue: 2450000,
      revenueGrowth: 18.3,
      averageOrderValue: 1245,
      revenueByTier: [
        { tier: 'basic' as any, revenue: 245000, percentage: 10 },
        { tier: 'premium' as any, revenue: 735000, percentage: 30 },
        { tier: 'elite' as any, revenue: 980000, percentage: 40 },
        { tier: 'ultra_elite' as any, revenue: 490000, percentage: 20 }
      ],
      monthlyRecurring: 156000
    },
    engagementMetrics: {
      dailyActiveUsers: 1250,
      weeklyActiveUsers: 3420,
      monthlyActiveUsers: 8900,
      sessionDuration: 18.5, // minutes
      pageViews: 45000,
      bounceRate: 28.5
    },
    membershipAnalytics: {
      upgrades: [
        { fromTier: 'basic' as any, toTier: 'premium' as any, count: 45, revenue: 89550 },
        { fromTier: 'premium' as any, toTier: 'elite' as any, count: 23, revenue: 114770 },
        { fromTier: 'elite' as any, toTier: 'ultra_elite' as any, count: 12, revenue: 239880 }
      ],
      downgrades: [
        { fromTier: 'premium' as any, toTier: 'basic' as any, count: 3, reason: 'Cost concerns' },
        { fromTier: 'elite' as any, toTier: 'premium' as any, count: 1, reason: 'Usage reduction' }
      ],
      tierDistribution: {
        basic: users.filter(u => u.membershipTier === 'basic').length,
        premium: users.filter(u => u.membershipTier === 'premium').length,
        elite: users.filter(u => u.membershipTier === 'elite').length,
        ultraElite: users.filter(u => u.membershipTier === 'ultra_elite').length
      },
      conversionRates: [
        { fromTier: 'basic' as any, toTier: 'premium' as any, rate: 18.3, period: 'monthly' },
        { fromTier: 'premium' as any, toTier: 'elite' as any, rate: 12.7, period: 'monthly' },
        { fromTier: 'elite' as any, toTier: 'ultra_elite' as any, rate: 8.4, period: 'monthly' }
      ]
    },
    performanceMetrics: {
      responseTime: 245, // milliseconds
      uptime: 99.98,
      errorRate: 0.02,
      throughput: 1250 // requests per minute
    }
  };
}

function generateMembershipControlData(users: any[]) {
  return {
    tierDistribution: {
      basic: users.filter(u => u.membershipTier === 'basic').length,
      premium: users.filter(u => u.membershipTier === 'premium').length,
      elite: users.filter(u => u.membershipTier === 'elite').length,
      ultraElite: users.filter(u => u.membershipTier === 'ultra_elite').length
    },
    pendingUpgrades: 15,
    recentUpgrades: [
      {
        userId: 'user-001',
        fromTier: 'premium',
        toTier: 'elite',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        revenue: 4990
      },
      {
        userId: 'user-002',
        fromTier: 'basic',
        toTier: 'premium',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        revenue: 1990
      }
    ],
    conversionMetrics: {
      basicToPremium: 18.3,
      premiumToElite: 12.7,
      eliteToUltraElite: 8.4
    }
  };
}

function generateSecurityMonitoringData() {
  return {
    failedLoginAttempts: 23,
    suspiciousActivities: 5,
    blockedIPs: 12,
    activeSecurityAlerts: [
      {
        id: 'sec-001',
        type: 'brute_force',
        severity: 'high',
        description: 'Multiple failed login attempts from 192.168.1.100',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        resolved: false
      },
      {
        id: 'sec-002',
        type: 'unusual_access',
        severity: 'medium',
        description: 'Admin access from new location',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        resolved: false
      }
    ],
    auditLogs: [
      {
        id: 'audit-001',
        userId: 'admin-001',
        action: 'user_role_change',
        target: 'user-123',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        details: { fromRole: 'user', toRole: 'vip' }
      }
    ]
  };
}

function generateContentManagementData() {
  return {
    totalProducts: 1250,
    exclusiveProducts: 345,
    pendingApprovals: 23,
    recentUploads: [
      {
        id: 'product-001',
        name: 'Luxury Diamond Necklace',
        category: 'jewelry',
        uploadedBy: 'admin-001',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: 'pending_approval'
      }
    ],
    contentMetrics: {
      viewsThisMonth: 125000,
      engagementRate: 6.8,
      conversionRate: 2.3
    }
  };
}

function generateSystemHealthData() {
  return {
    serverStatus: 'healthy',
    uptime: 99.98,
    responseTime: 245,
    errorRate: 0.02,
    databaseConnections: 145,
    memoryUsage: 67.5,
    cpuUsage: 23.8,
    diskUsage: 45.2,
    recentErrors: [
      {
        id: 'error-001',
        level: 'warning',
        message: 'High memory usage detected',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        resolved: false
      }
    ],
    performance: {
      apiResponseTime: 245,
      databaseQueryTime: 85,
      cacheHitRate: 94.5,
      concurrentUsers: 1250
    }
  };
}

// ========================================
// CORS Headers
// ========================================

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
