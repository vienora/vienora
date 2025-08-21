/**
 * Current User API Endpoint
 * Get authenticated user information with session validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/service';
import { validateApiToken } from '@/lib/auth/jwt';
import { AuthErrorCode } from '@/lib/types/auth';
import { getMembershipBenefits } from '@/lib/constants/membership';

// Configure for dynamic deployment
export const dynamic = 'force-dynamic';

// ========================================
// Get Current User Endpoint
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

    const { userId, sessionId } = tokenValidation.data;

    // Get user data from service
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

    // Check if user is still active
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.ACCOUNT_DISABLED,
            message: 'User account has been disabled',
            timestamp: new Date().toISOString()
          }
        },
        { status: 403 }
      );
    }

    // Get user's active sessions
    const activeSessions = await authService.getActiveSessionsForUser(userId);

    // Get membership benefits
    const membershipBenefits = getMembershipBenefits(user.membershipTier);

    // Calculate account statistics
    const accountStats = calculateAccountStats(user);

    // Prepare response data
    const responseData = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        membershipTier: user.membershipTier,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      },
      membership: {
        tier: membershipBenefits.tier,
        name: membershipBenefits.name,
        description: membershipBenefits.description,
        benefits: membershipBenefits.features,
        exclusiveAccess: membershipBenefits.exclusiveAccess,
        personalConcierge: membershipBenefits.personalConcierge,
        prioritySupport: membershipBenefits.prioritySupport,
        freeShipping: membershipBenefits.freeShipping,
        monthlyCredits: membershipBenefits.monthlyCredits,
        discountPercentage: membershipBenefits.discountPercentage
      },
      session: {
        id: sessionId,
        activeSessionsCount: activeSessions.length,
        currentSessionExpiry: activeSessions.find(s => s.id === sessionId)?.expiresAt
      },
      account: accountStats,
      preferences: {
        // In a real app, these would come from user preferences
        emailNotifications: true,
        smsNotifications: false,
        marketingCommunications: true,
        darkMode: false,
        language: 'en'
      }
    };

    return NextResponse.json(
      {
        success: true,
        data: responseData
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Unexpected error retrieving user data:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: AuthErrorCode.UNKNOWN_ERROR,
          message: 'An unexpected error occurred while retrieving user data',
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

// ========================================
// Update Current User Endpoint
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

    // Validate and sanitize update data
    const allowedFields = ['firstName', 'lastName', 'avatar'];
    const sanitizedUpdates: Record<string, any> = {};

    if (updateData && typeof updateData === 'object') {
      for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key) && value !== undefined) {
          sanitizedUpdates[key] = value;
        }
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.INVALID_CREDENTIALS,
            message: 'No valid fields provided for update',
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    // Update user
    const authService = new AuthService();
    const updateResult = await authService.updateUser(userId, sanitizedUpdates);

    if (!updateResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: updateResult.error.code,
            message: updateResult.error.message,
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    const updatedUser = updateResult.data;

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            avatar: updatedUser.avatar,
            membershipTier: updatedUser.membershipTier,
            role: updatedUser.role,
            isActive: updatedUser.isActive,
            emailVerified: updatedUser.emailVerified,
            createdAt: updatedUser.createdAt,
            lastLoginAt: updatedUser.lastLoginAt
          },
          message: 'Profile updated successfully'
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Unexpected error updating user profile:', error);

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
// Utility Functions
// ========================================

interface AccountStats {
  readonly memberSince: string;
  readonly daysSinceMembershipStart: number;
  readonly lastActiveDate: string;
  readonly totalSessions: number;
  readonly accountAge: {
    readonly years: number;
    readonly months: number;
    readonly days: number;
  };
}

function calculateAccountStats(user: any): AccountStats {
  const now = new Date();
  const createdAt = new Date(user.createdAt);
  const lastLoginAt = user.lastLoginAt ? new Date(user.lastLoginAt) : createdAt;

  // Calculate account age
  const diffTime = Math.abs(now.getTime() - createdAt.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  const days = diffDays % 30;

  return {
    memberSince: createdAt.toISOString().split('T')[0],
    daysSinceMembershipStart: diffDays,
    lastActiveDate: lastLoginAt.toISOString().split('T')[0],
    totalSessions: 1, // In a real app, this would be tracked
    accountAge: {
      years,
      months,
      days
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
      'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
