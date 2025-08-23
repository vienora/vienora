/**
 * Registration API Endpoint
 * Secure user registration with comprehensive validation and security measures
 */

import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/service';
import { validateRegister } from '@/lib/validation/auth';
import { RegisterCredentials, AuthErrorCode } from '@/lib/types/auth';

// Configure for dynamic deployment
export const dynamic = 'force-dynamic';

// Rate limiting for registrations
const registrationAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_REGISTRATION_ATTEMPTS = 3;
const REGISTRATION_LOCKOUT = 60 * 60 * 1000; // 1 hour

// ========================================
// Registration Endpoint
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
    const validation = validateRegister(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.INVALID_CREDENTIALS,
            message: 'Invalid registration data provided',
            details: { validationErrors: validation.errors },
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    const credentials = validation.data as RegisterCredentials;

    // Get client IP for rate limiting
    const clientIp = getClientIp(request);

    // Check rate limiting
    const rateLimitResult = checkRegistrationRateLimit(clientIp);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.RATE_LIMIT_EXCEEDED,
            message: `Too many registration attempts. Try again in ${Math.ceil(rateLimitResult.retryAfter / 60000)} minutes.`,
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

    // Additional security checks
    const securityCheck = performSecurityChecks(credentials, request);
    if (!securityCheck.passed) {
      recordFailedRegistrationAttempt(clientIp);

      return NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.INVALID_CREDENTIALS,
            message: securityCheck.message,
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    // Attempt registration
    const authService = new AuthService();
    const result = await authService.register(credentials);

    if (result.success) {
      const { user, tokens, session } = result.data;

      // Clear rate limiting on successful registration
      clearRegistrationRateLimit(clientIp);

      // Log successful registration for monitoring
      console.log(`New user registered: ${user.email} (${user.id})`);

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
              createdAt: user.createdAt
            },
            tokens,
            session: {
              id: session.id,
              expiresAt: session.expiresAt
            },
            welcomeMessage: `Welcome to Vienora, ${user.firstName}! Your luxury journey begins now.`
          }
        },
        { status: 201 }
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

      // In a real application, you would:
      // 1. Send welcome email
      // 2. Send email verification
      // 3. Track registration analytics
      // 4. Initialize user preferences

      return response;

    } else {
      // Record failed attempt
      recordFailedRegistrationAttempt(clientIp);

      // Map auth errors to HTTP status codes
      const statusCode = getHttpStatusForAuthError(result.error.code);

      return NextResponse.json(
        {
          success: false,
          error: {
            code: result.error.code,
            message: result.error.message,
            details: result.error.details,
            timestamp: new Date().toISOString()
          }
        },
        { status: statusCode }
      );
    }

  } catch (error) {
    console.error('Unexpected error during registration:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: AuthErrorCode.UNKNOWN_ERROR,
          message: 'An unexpected error occurred during registration',
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

// ========================================
// Security Checks
// ========================================

interface SecurityCheckResult {
  readonly passed: boolean;
  readonly message: string;
}

function performSecurityChecks(
  credentials: RegisterCredentials,
  request: NextRequest
): SecurityCheckResult {
  // Check for disposable email domains
  const disposableEmailDomains = [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'mailinator.com'
  ];

  const emailDomain = credentials.email.split('@')[1]?.toLowerCase();
  if (disposableEmailDomains.includes(emailDomain)) {
    return {
      passed: false,
      message: 'Disposable email addresses are not allowed'
    };
  }

  // Check for suspicious patterns in names
  const suspiciousPatterns = [
    /^test/i,
    /^admin/i,
    /^null/i,
    /^undefined/i,
    /^\d+$/,
    /^[a-z]{1,2}$/i
  ];

  const fullName = `${credentials.firstName} ${credentials.lastName}`.toLowerCase();
  if (suspiciousPatterns.some(pattern => pattern.test(fullName))) {
    return {
      passed: false,
      message: 'Please provide your real name'
    };
  }

  // Check for bot-like behavior (very fast form submission)
  const userAgent = request.headers.get('user-agent');
  if (!userAgent || userAgent.length < 10) {
    return {
      passed: false,
      message: 'Invalid browser configuration'
    };
  }

  // Check for known bot user agents
  const botUserAgents = [
    'bot',
    'crawler',
    'spider',
    'scraper'
  ];

  if (botUserAgents.some(bot => userAgent.toLowerCase().includes(bot))) {
    return {
      passed: false,
      message: 'Automated registration is not allowed'
    };
  }

  return {
    passed: true,
    message: 'Security checks passed'
  };
}

// ========================================
// Rate Limiting Functions
// ========================================

interface RateLimitResult {
  readonly allowed: boolean;
  readonly retryAfter: number;
}

function checkRegistrationRateLimit(clientIp: string): RateLimitResult {
  const now = Date.now();
  const attempts = registrationAttempts.get(clientIp);

  if (!attempts) {
    return { allowed: true, retryAfter: 0 };
  }

  // Check if lockout period has expired
  if (now - attempts.lastAttempt > REGISTRATION_LOCKOUT) {
    registrationAttempts.delete(clientIp);
    return { allowed: true, retryAfter: 0 };
  }

  // Check if max attempts exceeded
  if (attempts.count >= MAX_REGISTRATION_ATTEMPTS) {
    const retryAfter = REGISTRATION_LOCKOUT - (now - attempts.lastAttempt);
    return { allowed: false, retryAfter };
  }

  return { allowed: true, retryAfter: 0 };
}

function recordFailedRegistrationAttempt(clientIp: string): void {
  const now = Date.now();
  const attempts = registrationAttempts.get(clientIp);

  if (!attempts || now - attempts.lastAttempt > REGISTRATION_LOCKOUT) {
    registrationAttempts.set(clientIp, { count: 1, lastAttempt: now });
  } else {
    registrationAttempts.set(clientIp, {
      count: attempts.count + 1,
      lastAttempt: now
    });
  }
}

function clearRegistrationRateLimit(clientIp: string): void {
  registrationAttempts.delete(clientIp);
}

// ========================================
// Utility Functions
// ========================================

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return '127.0.0.1';
}

function getHttpStatusForAuthError(errorCode: AuthErrorCode): number {
  switch (errorCode) {
    case AuthErrorCode.EMAIL_ALREADY_EXISTS:
      return 409; // Conflict

    case AuthErrorCode.WEAK_PASSWORD:
    case AuthErrorCode.INVALID_CREDENTIALS:
      return 400;

    case AuthErrorCode.RATE_LIMIT_EXCEEDED:
      return 429;

    case AuthErrorCode.NETWORK_ERROR:
      return 503;

    default:
      return 500;
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
