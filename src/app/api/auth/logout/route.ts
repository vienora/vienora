/**
 * Logout API Endpoint
 * Secure user logout with session management and token cleanup
 */

import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/service';
import { validateApiToken } from '@/lib/auth/jwt';
import { AuthErrorCode } from '@/lib/types/auth';

// Configure for dynamic deployment
export const dynamic = 'force-dynamic';

// ========================================
// Logout Endpoint
// ========================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Extract token from Authorization header or cookies
    const authToken = extractToken(request);

    if (!authToken) {
      // Even if no token, we should clear cookies
      return createLogoutResponse('Logged out successfully');
    }

    // Validate token to get user session info
    const tokenValidation = await validateApiToken(request);

    if (tokenValidation.success) {
      const { sessionId, userId } = tokenValidation.data;

      // Revoke session
      const authService = new AuthService();
      const logoutResult = await authService.logout(sessionId);

      if (!logoutResult.success) {
        console.error('Failed to revoke session:', logoutResult.error);
        // Continue with logout even if session revocation fails
      }

      // Log successful logout for monitoring
      console.log(`User ${userId} logged out successfully`);

      return createLogoutResponse('Logged out successfully');

    } else {
      // Token is invalid but we should still clear cookies
      console.log('Invalid token during logout, clearing cookies anyway');
      return createLogoutResponse('Logged out successfully');
    }

  } catch (error) {
    console.error('Unexpected error during logout:', error);

    // Even on error, clear cookies for security
    return createLogoutResponse('Logged out successfully');
  }
}

// ========================================
// Logout All Sessions Endpoint
// ========================================

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    // Validate token
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

    // Get all active sessions and revoke them
    const authService = new AuthService();
    const activeSessions = await authService.getActiveSessionsForUser(userId);

    // Revoke all sessions
    const revokePromises = activeSessions.map(session =>
      authService.revokeSession(session.id)
    );

    await Promise.allSettled(revokePromises);

    // Log logout from all devices
    console.log(`User ${userId} logged out from all devices (${activeSessions.length} sessions)`);

    return createLogoutResponse(`Logged out from all devices (${activeSessions.length} sessions)`);

  } catch (error) {
    console.error('Unexpected error during logout from all devices:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: AuthErrorCode.UNKNOWN_ERROR,
          message: 'An unexpected error occurred during logout',
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

function extractToken(request: NextRequest): string | null {
  // First try Authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Then try cookies
  const tokenCookie = request.cookies.get('vienora_access_token');
  if (tokenCookie) {
    return tokenCookie.value;
  }

  return null;
}

function createLogoutResponse(message: string): NextResponse {
  const response = NextResponse.json(
    {
      success: true,
      data: {
        message,
        timestamp: new Date().toISOString()
      }
    },
    { status: 200 }
  );

  // Clear all authentication cookies
  response.cookies.set('vienora_access_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0), // Expire immediately
    path: '/'
  });

  response.cookies.set('vienora_refresh_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0), // Expire immediately
    path: '/'
  });

  // Add security headers
  response.headers.set('Clear-Site-Data', '"cookies", "storage"');

  return response;
}

// ========================================
// CORS Headers
// ========================================

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
