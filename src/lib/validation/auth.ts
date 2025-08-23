/**
 * Authentication Validation Schemas
 * Type-safe input validation for all authentication operations
 */

import { z } from 'zod';
import { MembershipTier, UserRole, AuditAction } from '@/lib/types/auth';

// ========================================
// Core Field Validations
// ========================================

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(254, 'Email address is too long')
  .toLowerCase()
  .trim();

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password is too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(50, 'Name is too long')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .trim();

const userIdSchema = z
  .string()
  .uuid('Invalid user ID format');

const sessionIdSchema = z
  .string()
  .uuid('Invalid session ID format');

// ========================================
// Authentication Schemas
// ========================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false)
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  acceptedTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  }),
  marketingOptIn: z.boolean().optional().default(false)
});

export const forgotPasswordSchema = z.object({
  email: emailSchema
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Password confirmation is required')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Password confirmation is required')
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
}).refine(data => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword']
});

// ========================================
// Profile Management Schemas
// ========================================

export const updateProfileSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  email: emailSchema.optional(),
  avatar: z.string().url('Invalid avatar URL').optional()
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
  userId: userIdSchema
});

// ========================================
// Membership Schemas
// ========================================

export const membershipTierSchema = z.nativeEnum(MembershipTier, {
  message: 'Invalid membership tier'
});

export const upgradeMembershipSchema = z.object({
  targetTier: membershipTierSchema,
  billingCycle: z.enum(['monthly', 'yearly'], {
    message: 'Billing cycle must be monthly or yearly'
  }),
  paymentMethodId: z.string().min(1, 'Payment method is required')
});

export const membershipPreferencesSchema = z.object({
  autoRenew: z.boolean(),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  marketingCommunications: z.boolean()
});

// ========================================
// Admin Schemas
// ========================================

export const userRoleSchema = z.nativeEnum(UserRole, {
  message: 'Invalid user role'
});

export const createUserSchema = z.object({
  email: emailSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  role: userRoleSchema,
  membershipTier: membershipTierSchema,
  sendWelcomeEmail: z.boolean().default(true)
});

export const updateUserRoleSchema = z.object({
  userId: userIdSchema,
  newRole: userRoleSchema,
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(500, 'Reason is too long')
});

export const updateUserStatusSchema = z.object({
  userId: userIdSchema,
  isActive: z.boolean(),
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(500, 'Reason is too long')
});

// ========================================
// Session Management Schemas
// ========================================

export const createSessionSchema = z.object({
  userId: userIdSchema,
  userAgent: z.string().max(500, 'User agent string is too long'),
  ipAddress: z.string().regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, 'Invalid IP address'),
  expiresAt: z.date().min(new Date(), 'Session cannot expire in the past')
});

export const revokeSessionSchema = z.object({
  sessionId: sessionIdSchema,
  reason: z.string().optional()
});

export const revokeAllSessionsSchema = z.object({
  userId: userIdSchema,
  exceptCurrentSession: z.boolean().default(false),
  reason: z.string().optional()
});

// ========================================
// Audit Log Schemas
// ========================================

export const auditActionSchema = z.nativeEnum(AuditAction, {
  message: 'Invalid audit action'
});

export const createAuditLogSchema = z.object({
  userId: userIdSchema,
  action: auditActionSchema,
  resource: z.string().optional(),
  details: z.record(z.string(), z.unknown()),
  ipAddress: z.string().regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, 'Invalid IP address'),
  userAgent: z.string().max(500, 'User agent string is too long')
});

export const auditLogQuerySchema = z.object({
  userId: userIdSchema.optional(),
  action: auditActionSchema.optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0)
});

// ========================================
// API Request Schemas
// ========================================

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

export const userListQuerySchema = z.object({
  search: z.string().optional(),
  role: userRoleSchema.optional(),
  membershipTier: membershipTierSchema.optional(),
  isActive: z.boolean().optional(),
  emailVerified: z.boolean().optional()
}).merge(paginationSchema);

// ========================================
// API Response Schemas
// ========================================

export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
  timestamp: z.date()
});

export const apiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema
  });

export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: apiErrorSchema
});

// ========================================
// Validation Helper Functions
// ========================================

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> };

export const validateInput = <T>(
  schema: z.ZodSchema<T>,
  input: unknown
): ValidationResult<T> => {
  const result = schema.safeParse(input);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string[]> = {};

  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    const key = path || 'root';

    if (!errors[key]) {
      errors[key] = [];
    }

    errors[key].push(issue.message);
  }

  return { success: false, errors };
};

export const createValidator = <T>(schema: z.ZodSchema<T>) => {
  return (input: unknown): ValidationResult<T> => validateInput(schema, input);
};

// ========================================
// Pre-built Validators
// ========================================

export const validateLogin = createValidator(loginSchema);
export const validateRegister = createValidator(registerSchema);
export const validateForgotPassword = createValidator(forgotPasswordSchema);
export const validateResetPassword = createValidator(resetPasswordSchema);
export const validateChangePassword = createValidator(changePasswordSchema);
export const validateUpdateProfile = createValidator(updateProfileSchema);
export const validateUpgradeMembership = createValidator(upgradeMembershipSchema);
export const validateCreateUser = createValidator(createUserSchema);
export const validateUpdateUserRole = createValidator(updateUserRoleSchema);
export const validateUserListQuery = createValidator(userListQuerySchema);
