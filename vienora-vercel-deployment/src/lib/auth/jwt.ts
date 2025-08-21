/**
 * JWT Authentication Utilities
 * Enterprise-grade token management with security best practices
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { AuthTokens, AuthError, AuthErrorCode, AuthResult, User } from '@/lib/types/auth';

// ========================================
// JWT Configuration
// ========================================

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-ultra-secure-256-bit-secret-key-here-minimum-32-chars'
);

const JWT_ISSUER = 'vienora-luxury-platform';
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

// ========================================
// JWT Payload Interface
// ========================================

interface VienoraJWTPayload extends JWTPayload {
  readonly userId: string;
  readonly email: string;
  readonly role: string;
  readonly membershipTier: string;
  readonly tokenType: 'access' | 'refresh';
  readonly sessionId: string;
}

// ========================================
// Token Generation
// ========================================

export const generateTokens = async (
  user: User,
  sessionId: string
): Promise<AuthResult<AuthTokens>> => {
  try {
    const basePayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      membershipTier: user.membershipTier,
      sessionId
    };

    // Generate access token
    const accessToken = await new SignJWT({
      ...basePayload,
      tokenType: 'access'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_ISSUER)
      .setExpirationTime(ACCESS_TOKEN_EXPIRY)
      .setSubject(user.id)
      .sign(JWT_SECRET);

    // Generate refresh token
    const refreshToken = await new SignJWT({
      ...basePayload,
      tokenType: 'refresh'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_ISSUER)
      .setExpirationTime(REFRESH_TOKEN_EXPIRY)
      .setSubject(user.id)
      .sign(JWT_SECRET);

    const tokens: AuthTokens = {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60 // 15 minutes in seconds
    };

    return { success: true, data: tokens };

  } catch (error) {
    const authError: AuthError = {
      code: AuthErrorCode.UNKNOWN_ERROR,
      message: 'Failed to generate authentication tokens',
      details: { error: error instanceof Error ? error.message : 'Unknown error' },
      timestamp: new Date()
    };

    return { success: false, error: authError };
  }
};

// ========================================
// Token Verification
// ========================================

export const verifyToken = async (
  token: string,
  expectedType: 'access' | 'refresh'
): Promise<AuthResult<VienoraJWTPayload>> => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_ISSUER
    });

    const vienoraPayload = payload as VienoraJWTPayload;

    // Verify token type
    if (vienoraPayload.tokenType !== expectedType) {
      const authError: AuthError = {
        code: AuthErrorCode.INVALID_TOKEN,
        message: `Invalid token type. Expected ${expectedType}, got ${vienoraPayload.tokenType}`,
        timestamp: new Date()
      };
      return { success: false, error: authError };
    }

    // Verify required fields
    if (!vienoraPayload.userId || !vienoraPayload.email || !vienoraPayload.sessionId) {
      const authError: AuthError = {
        code: AuthErrorCode.INVALID_TOKEN,
        message: 'Token payload missing required fields',
        timestamp: new Date()
      };
      return { success: false, error: authError };
    }

    return { success: true, data: vienoraPayload };

  } catch (error) {
    let authError: AuthError;

    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        authError = {
          code: AuthErrorCode.TOKEN_EXPIRED,
          message: 'Authentication token has expired',
          timestamp: new Date()
        };
      } else {
        authError = {
          code: AuthErrorCode.INVALID_TOKEN,
          message: 'Invalid authentication token',
          details: { error: error.message },
          timestamp: new Date()
        };
      }
    } else {
      authError = {
        code: AuthErrorCode.UNKNOWN_ERROR,
        message: 'Failed to verify authentication token',
        timestamp: new Date()
      };
    }

    return { success: false, error: authError };
  }
};

// ========================================
// Token Refresh
// ========================================

export const refreshAccessToken = async (
  refreshToken: string,
  getUserById: (userId: string) => Promise<User | null>
): Promise<AuthResult<AuthTokens>> => {
  // Verify refresh token
  const verifyResult = await verifyToken(refreshToken, 'refresh');
  if (!verifyResult.success) {
    return { success: false, error: verifyResult.error };
  }

  const payload = verifyResult.data;

  // Get current user data
  const user = await getUserById(payload.userId);
  if (!user) {
    const authError: AuthError = {
      code: AuthErrorCode.USER_NOT_FOUND,
      message: 'User not found for token refresh',
      timestamp: new Date()
    };
    return { success: false, error: authError };
  }

  if (!user.isActive) {
    const authError: AuthError = {
      code: AuthErrorCode.ACCOUNT_DISABLED,
      message: 'User account is disabled',
      timestamp: new Date()
    };
    return { success: false, error: authError };
  }

  // Generate new tokens
  return generateTokens(user, payload.sessionId);
};

// ========================================
// Token Extraction from Headers
// ========================================

export const extractBearerToken = (authHeader: string | null): string | null => {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  return parts[1];
};

// ========================================
// Token Validation for API Routes
// ========================================

export const validateApiToken = async (
  request: Request
): Promise<AuthResult<VienoraJWTPayload>> => {
  const authHeader = request.headers.get('Authorization');
  const token = extractBearerToken(authHeader);

  if (!token) {
    const authError: AuthError = {
      code: AuthErrorCode.INVALID_TOKEN,
      message: 'No authentication token provided',
      timestamp: new Date()
    };
    return { success: false, error: authError };
  }

  return verifyToken(token, 'access');
};

// ========================================
// Security Utilities
// ========================================

export const generateSessionId = (): string => {
  return crypto.randomUUID();
};

export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
};

// ========================================
// Password Strength Validation
// ========================================

export interface PasswordStrength {
  readonly isValid: boolean;
  readonly score: number; // 0-4
  readonly feedback: readonly string[];
}

export const validatePasswordStrength = (password: string): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long');
  } else if (password.length >= 12) {
    score += 1;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    feedback.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  // Number check
  if (!/\d/.test(password)) {
    feedback.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  // Special character check
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push('Password must contain at least one special character');
  } else {
    score += 1;
  }

  // Common password check
  const commonPasswords = ['password', '123456', 'qwerty', 'admin'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    feedback.push('Password contains common words or patterns');
    score = Math.max(0, score - 2);
  }

  return {
    isValid: feedback.length === 0 && score >= 3,
    score: Math.max(0, Math.min(4, score)),
    feedback
  };
};
