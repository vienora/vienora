/**
 * Login API Endpoint
 * Secure user authentication with comprehensive validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/service';
import { validateLogin } from '@/lib/validation/auth';
import { AuthCredentials, AuthErrorCode } from '@/lib/types/auth';

// Configure for dynamic deployment
export const dynamic = 'force-dynamic';

// Rate limiting (in production, use Redis or similar)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// ========================================
// Login Endpoint
// ========================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
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

    // Validate input
    const validation = validateLogin(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.INVALID_CREDENTIALS,
            message: 'Invalid login credentials provided',
            details: { validationErrors: validation.errors },
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    const credentials = validation.data as AuthCredentials;

    // Get client IP for rate limiting
    const clientIp = getClientIp(request);

    // Check rate limiting
    const rateLimitResult = checkRateLimit(clientIp);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.RATE_LIMIT_EXCEEDED,
            message: `Too many login attempts. Try again in ${Math.ceil(rateLimitResult.retryAfter / 60000)} minutes.`,
            details: { retryAfter: rateLimitResult.retryAfter },
            timestamp: new Date().toISOString()
          }
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(rateLimitResult.retryAfter / 1000).toString()
          }
        }
      );
    }

    // Attempt login
    const authService = new AuthService();
    const result = await authService.login(credentials);

    if (result.success) {
      const { user, tokens, session } = result.data;

      // Clear rate limiting on successful login
      clearRateLimit(clientIp);

      // Set secure HTTP-only cookies for tokens
      const response = NextResponse.json(
        {
          success: true,
          data: {
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              membershipTier: user.membershipTier,
              role: user.role,
              isActive: user.isActive,
              emailVerified: user.emailVerified,
              createdAt: user.createdAt,
              lastLoginAt: user.lastLoginAt
            },
            tokens,
            session: {
              id: session.id,
              expiresAt: session.expiresAt
            }
          }
        },
        { status: 200 }
      );

      // Set secure cookies
      response.cookies.set('vienora_access_token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60, // 15 minutes
        path: '/'
      });

      response.cookies.set('vienora_refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/'
      });

      return response;

    } else {
      // Record failed attempt
      recordFailedAttempt(clientIp);

      // Map auth errors to HTTP status codes
      const statusCode = getHttpStatusForAuthError(result.error.code);

      return NextResponse.json(
        {
          success: false,
          error: {
            code: result.error.code,
            message: result.error.message,
            timestamp: new Date().toISOString()
          }
        },
        { status: statusCode }
      );
    }

  } catch (error) {
    console.error('Unexpected error during login:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: AuthErrorCode.UNKNOWN_ERROR,
          message: 'An unexpected error occurred during login',
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

// ========================================
// Rate Limiting Functions
// ========================================

interface RateLimitResult {
  readonly allowed: boolean;
  readonly retryAfter: number;
}

function checkRateLimit(clientIp: string): RateLimitResult {
  const now = Date.now();
  const attempts = loginAttempts.get(clientIp);

  if (!attempts) {
    return { allowed: true, retryAfter: 0 };
  }

  // Check if lockout period has expired
  if (now - attempts.lastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(clientIp);
    return { allowed: true, retryAfter: 0 };
  }

  // Check if max attempts exceeded
  if (attempts.count >= MAX_ATTEMPTS) {
    const retryAfter = LOCKOUT_DURATION - (now - attempts.lastAttempt);
    return { allowed: false, retryAfter };
  }

  return { allowed: true, retryAfter: 0 };
}

function recordFailedAttempt(clientIp: string): void {
  const now = Date.now();
  const attempts = loginAttempts.get(clientIp);

  if (!attempts || now - attempts.lastAttempt > LOCKOUT_DURATION) {
    loginAttempts.set(clientIp, { count: 1, lastAttempt: now });
  } else {
    loginAttempts.set(clientIp, {
      count: attempts.count + 1,
      lastAttempt: now
    });
  }
}

function clearRateLimit(clientIp: string): void {
  loginAttempts.delete(clientIp);
}

// ========================================
// Utility Functions
// ========================================

function getClientIp(request: NextRequest): string {
  // In production, you might want to check X-Forwarded-For header
  // but be careful about IP spoofing
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  // Fallback to a default IP for rate limiting
  return '127.0.0.1';
}

function getHttpStatusForAuthError(errorCode: AuthErrorCode): number {
  switch (errorCode) {
    case AuthErrorCode.INVALID_CREDENTIALS:
    case AuthErrorCode.USER_NOT_FOUND:
      return 401;

    case AuthErrorCode.ACCOUNT_DISABLED:
      return 403;

    case AuthErrorCode.EMAIL_NOT_VERIFIED:
      return 403;

    case AuthErrorCode.RATE_LIMIT_EXCEEDED:
      return 429;

    case AuthErrorCode.NETWORK_ERROR:
      return 503;

    default:
      return 500;
  }
}

// ========================================
// CORS Headers (if needed)
// ========================================

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
