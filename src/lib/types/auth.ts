/**
 * Core Authentication Types
 * Enterprise-grade TypeScript interfaces for VIP authentication system
 */

// ========================================
// Core Authentication Types
// ========================================

export interface User {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly avatar?: string;
  readonly membershipTier: MembershipTier;
  readonly role: UserRole;
  readonly isActive: boolean;
  readonly emailVerified: boolean;
  readonly createdAt: Date;
  readonly lastLoginAt?: Date;
}

export interface AuthCredentials {
  readonly email: string;
  readonly password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  readonly firstName: string;
  readonly lastName: string;
  readonly acceptedTerms: boolean;
}

export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
}

// ========================================
// VIP Membership System
// ========================================

export enum MembershipTier {
  BASIC = 'basic',
  PREMIUM = 'premium',
  ELITE = 'elite',
  ULTRA_ELITE = 'ultra_elite'
}

export interface MembershipBenefits {
  readonly tier: MembershipTier;
  readonly name: string;
  readonly description: string;
  readonly maxProducts: number;
  readonly exclusiveAccess: boolean;
  readonly personalConcierge: boolean;
  readonly prioritySupport: boolean;
  readonly freeShipping: boolean;
  readonly monthlyCredits: number;
  readonly discountPercentage: number;
  readonly features: readonly string[];
}

export interface MembershipUpgrade {
  readonly userId: string;
  readonly fromTier: MembershipTier;
  readonly toTier: MembershipTier;
  readonly price: number;
  readonly currency: string;
  readonly benefits: MembershipBenefits;
}

// ========================================
// Role-Based Access Control
// ========================================

export enum UserRole {
  USER = 'user',
  VIP = 'vip',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export enum Permission {
  // User permissions
  VIEW_PRODUCTS = 'view_products',
  PURCHASE_PRODUCTS = 'purchase_products',

  // VIP permissions
  VIEW_EXCLUSIVE_PRODUCTS = 'view_exclusive_products',
  ACCESS_VIP_AREA = 'access_vip_area',
  PERSONAL_CONCIERGE = 'personal_concierge',

  // Admin permissions
  MANAGE_USERS = 'manage_users',
  MANAGE_PRODUCTS = 'manage_products',
  VIEW_ANALYTICS = 'view_analytics',
  MANAGE_INVENTORY = 'manage_inventory',

  // Super Admin permissions
  MANAGE_ADMINS = 'manage_admins',
  SYSTEM_SETTINGS = 'system_settings',
  AUDIT_LOGS = 'audit_logs'
}

export interface RolePermissions {
  readonly role: UserRole;
  readonly permissions: readonly Permission[];
}

// ========================================
// Authentication State Management
// ========================================

export interface AuthState {
  readonly user: User | null;
  readonly tokens: AuthTokens | null;
  readonly isLoading: boolean;
  readonly isAuthenticated: boolean;
  readonly lastError: AuthError | null;
}

export interface AuthActions {
  readonly login: (credentials: AuthCredentials) => Promise<AuthResult<User>>;
  readonly register: (credentials: RegisterCredentials) => Promise<AuthResult<User>>;
  readonly logout: () => Promise<void>;
  readonly refreshToken: () => Promise<AuthResult<AuthTokens>>;
  readonly updateProfile: (updates: Partial<User>) => Promise<AuthResult<User>>;
  readonly upgradeMembership: (tier: MembershipTier) => Promise<AuthResult<MembershipUpgrade>>;
  readonly clearError: () => void;
}

// ========================================
// Error Handling
// ========================================

export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'invalid_credentials',
  USER_NOT_FOUND = 'user_not_found',
  EMAIL_ALREADY_EXISTS = 'email_already_exists',
  INVALID_TOKEN = 'invalid_token',
  TOKEN_EXPIRED = 'token_expired',
  INSUFFICIENT_PERMISSIONS = 'insufficient_permissions',
  ACCOUNT_DISABLED = 'account_disabled',
  EMAIL_NOT_VERIFIED = 'email_not_verified',
  WEAK_PASSWORD = 'weak_password',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  NETWORK_ERROR = 'network_error',
  UNKNOWN_ERROR = 'unknown_error'
}

export interface AuthError {
  readonly code: AuthErrorCode;
  readonly message: string;
  readonly details?: Record<string, unknown>;
  readonly timestamp: Date;
}

// ========================================
// Result Type for Error Handling
// ========================================

export type AuthResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: AuthError };

// ========================================
// Session Management
// ========================================

export interface Session {
  readonly id: string;
  readonly userId: string;
  readonly userAgent: string;
  readonly ipAddress: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly lastActivityAt: Date;
  readonly expiresAt: Date;
}

export interface SessionInfo {
  readonly current: Session;
  readonly active: readonly Session[];
  readonly total: number;
}

// ========================================
// Audit Logging
// ========================================

export enum AuditAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  REGISTER = 'register',
  PASSWORD_CHANGE = 'password_change',
  PROFILE_UPDATE = 'profile_update',
  MEMBERSHIP_UPGRADE = 'membership_upgrade',
  PERMISSION_GRANTED = 'permission_granted',
  PERMISSION_REVOKED = 'permission_revoked',
  ADMIN_ACTION = 'admin_action'
}

export interface AuditLog {
  readonly id: string;
  readonly userId: string;
  readonly action: AuditAction;
  readonly resource?: string;
  readonly details: Record<string, unknown>;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly timestamp: Date;
}
