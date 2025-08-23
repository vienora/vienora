/**
 * User Profile API Endpoint
 * Comprehensive profile management with preferences, security, and analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateApiToken } from '@/lib/auth/jwt';
import { AuthErrorCode } from '@/lib/types/auth';
import { UserProfile, DashboardResult } from '@/lib/types/dashboard';
import { AuthService } from '@/lib/auth/service';

// Configure for dynamic deployment
export const dynamic = 'force-dynamic';

// ========================================
// Get User Profile Endpoint
// ========================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Validate authentication token
    const tokenValidation = await validateApiToken(request);

    if (!tokenValidation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: tokenValidation.error.code,
            message: tokenValidation.error.message,
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      );
    }

    const { userId } = tokenValidation.data;

    // Get user from service
    const authService = new AuthService();
    const user = await authService.getUserById(userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.USER_NOT_FOUND,
            message: 'User not found',
            timestamp: new Date().toISOString()
          }
        },
        { status: 404 }
      );
    }

    // Generate comprehensive profile data
    const profileData = await generateUserProfile(user);

    return NextResponse.json(
      {
        success: true,
        data: profileData
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Unexpected error retrieving profile:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: AuthErrorCode.UNKNOWN_ERROR,
          message: 'An unexpected error occurred while retrieving profile',
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

// ========================================
// Update User Profile Endpoint
// ========================================

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    // Validate authentication token
    const tokenValidation = await validateApiToken(request);

    if (!tokenValidation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: tokenValidation.error.code,
            message: tokenValidation.error.message,
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      );
    }

    const { userId } = tokenValidation.data;

    // Parse request body
    let updateData: unknown;
    try {
      updateData = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.INVALID_CREDENTIALS,
            message: 'Invalid JSON in request body',
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    // Validate and process update data
    const result = await updateUserProfile(userId, updateData);

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: result.data,
          message: 'Profile updated successfully'
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Unexpected error updating profile:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: AuthErrorCode.UNKNOWN_ERROR,
          message: 'An unexpected error occurred while updating profile',
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

// ========================================
// User Profile Data Generation
// ========================================

async function generateUserProfile(user: any): Promise<UserProfile> {
  // Generate personal information
  const personalInfo = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: '+1 (555) 123-4567', // Demo data
    avatar: user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    dateOfBirth: new Date('1990-01-01'), // Demo data
    address: {
      street: '123 Luxury Lane',
      city: 'Beverly Hills',
      state: 'CA',
      zipCode: '90210',
      country: 'United States',
      isDefault: true
    },
    socialProfiles: [
      {
        platform: 'linkedin' as any,
        profileUrl: 'https://linkedin.com/in/johndoe',
        verified: true
      }
    ]
  };

  // Generate user preferences
  const preferences = {
    theme: 'light' as any,
    language: 'en',
    timezone: 'America/Los_Angeles',
    currency: 'USD',
    communication: {
      email: {
        marketing: true,
        orderUpdates: true,
        vipOffers: true,
        eventInvitations: true,
        newsletterFrequency: 'weekly' as any
      },
      sms: {
        orderUpdates: true,
        urgentNotifications: true,
        eventReminders: false
      },
      push: {
        general: true,
        orderUpdates: true,
        exclusiveOffers: true,
        eventNotifications: true
      }
    },
    shopping: {
      favoriteCategories: ['Luxury Accessories', 'Designer Fashion', 'Fine Jewelry'],
      priceAlertThreshold: 1000,
      autoSaveWishlist: true,
      recommendationEngine: true,
      quickOrderEnabled: false
    }
  };

  // Generate security settings
  const security = {
    twoFactorEnabled: false,
    passwordLastChanged: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    activeSessions: [
      {
        id: 'session-001',
        device: 'MacBook Pro - Chrome',
        location: 'Los Angeles, CA',
        ipAddress: '192.168.1.100',
        lastActivity: new Date(),
        isCurrent: true
      },
      {
        id: 'session-002',
        device: 'iPhone 15 Pro - Safari',
        location: 'Los Angeles, CA',
        ipAddress: '192.168.1.101',
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isCurrent: false
      }
    ],
    loginHistory: [
      {
        timestamp: new Date(),
        success: true,
        ipAddress: '192.168.1.100',
        device: 'MacBook Pro - Chrome',
        location: 'Los Angeles, CA'
      },
      {
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        success: true,
        ipAddress: '192.168.1.101',
        device: 'iPhone 15 Pro - Safari',
        location: 'Los Angeles, CA'
      },
      {
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        success: false,
        ipAddress: '203.0.113.1',
        device: 'Unknown - Chrome',
        location: 'Unknown'
      }
    ],
    securityQuestions: [
      {
        id: 'sq-001',
        question: 'What was the name of your first pet?',
        isSet: true,
        lastUpdated: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'sq-002',
        question: 'What city were you born in?',
        isSet: true,
        lastUpdated: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'sq-003',
        question: 'What was your childhood nickname?',
        isSet: false
      }
    ]
  };

  // Generate privacy settings
  const privacy = {
    profileVisibility: 'members_only' as any,
    dataSharing: {
      analytics: true,
      personalization: true,
      thirdPartyIntegrations: false,
      marketingPartners: false
    },
    cookieConsent: {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: false,
      lastUpdated: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    },
    marketingConsent: {
      email: true,
      sms: false,
      thirdParty: false,
      consentDate: new Date(user.createdAt)
    }
  };

  // Generate analytics
  const analytics = {
    accountAge: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
    totalOrders: 24,
    lifetimeValue: 15750,
    averageOrderValue: 656,
    favoriteCategories: [
      { category: 'Luxury Accessories', percentage: 35, trend: 'increasing' as any },
      { category: 'Designer Fashion', percentage: 28, trend: 'stable' as any },
      { category: 'Fine Jewelry', percentage: 22, trend: 'increasing' as any },
      { category: 'Home & Lifestyle', percentage: 15, trend: 'decreasing' as any }
    ],
    activitySummary: {
      loginsThisMonth: 18,
      ordersThisMonth: 3,
      wishlistItems: 12,
      reviewsWritten: 8,
      referralsSent: 2
    }
  };

  // Generate notification settings
  const notifications = {
    channels: [
      { channel: 'email' as any, enabled: true, verifiedAt: new Date(user.createdAt) },
      { channel: 'sms' as any, enabled: false },
      { channel: 'push' as any, enabled: true },
      { channel: 'in_app' as any, enabled: true }
    ],
    types: [
      {
        type: 'order_updates',
        label: 'Order Updates',
        description: 'Notifications about your order status and shipping',
        enabled: true,
        channels: ['email', 'push'] as any
      },
      {
        type: 'vip_offers',
        label: 'VIP Exclusive Offers',
        description: 'Special discounts and early access to luxury items',
        enabled: true,
        channels: ['email', 'in_app'] as any
      },
      {
        type: 'security_alerts',
        label: 'Security Alerts',
        description: 'Important security notifications for your account',
        enabled: true,
        channels: ['email', 'sms', 'push'] as any
      },
      {
        type: 'event_invitations',
        label: 'Event Invitations',
        description: 'Invitations to exclusive VIP events and experiences',
        enabled: true,
        channels: ['email', 'in_app'] as any
      }
    ],
    schedule: {
      quietHoursEnabled: true,
      quietStart: '22:00',
      quietEnd: '08:00',
      timezone: 'America/Los_Angeles',
      weekendsEnabled: true
    }
  };

  return {
    personalInfo,
    preferences,
    security,
    privacy,
    analytics,
    notifications
  };
}

// ========================================
// Profile Update Handler
// ========================================

async function updateUserProfile(userId: string, updateData: any): Promise<DashboardResult<UserProfile>> {
  try {
    // Get current user
    const authService = new AuthService();
    const user = await authService.getUserById(userId);

    if (!user) {
      return {
        success: false,
        error: {
          code: AuthErrorCode.USER_NOT_FOUND,
          message: 'User not found',
          timestamp: new Date()
        }
      };
    }

    // Validate and apply updates based on the section being updated
    if (updateData.section === 'personalInfo') {
      // Update personal information
      const allowedFields = ['firstName', 'lastName', 'phone', 'dateOfBirth', 'address'];
      const personalUpdates: any = {};

      for (const field of allowedFields) {
        if (updateData.data[field] !== undefined) {
          personalUpdates[field] = updateData.data[field];
        }
      }

      // In a real app, you would update the database
      console.log('Updating personal info:', personalUpdates);

    } else if (updateData.section === 'preferences') {
      // Update user preferences
      console.log('Updating preferences:', updateData.data);

    } else if (updateData.section === 'security') {
      // Update security settings
      console.log('Updating security settings:', updateData.data);

    } else if (updateData.section === 'privacy') {
      // Update privacy settings
      console.log('Updating privacy settings:', updateData.data);

    } else if (updateData.section === 'notifications') {
      // Update notification settings
      console.log('Updating notification settings:', updateData.data);

    } else {
      return {
        success: false,
        error: {
          code: AuthErrorCode.INVALID_CREDENTIALS,
          message: 'Invalid update section',
          timestamp: new Date()
        }
      };
    }

    // Generate updated profile data
    const updatedProfile = await generateUserProfile(user);

    return {
      success: true,
      data: updatedProfile
    };

  } catch (error) {
    return {
      success: false,
      error: {
        code: AuthErrorCode.UNKNOWN_ERROR,
        message: 'Failed to update profile',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date()
      }
    };
  }
}

// ========================================
// CORS Headers
// ========================================

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
