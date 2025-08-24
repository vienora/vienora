/**
 * VIP Membership Tiers and Benefits Configuration
 * Immutable definitions for the luxury membership system
 */

import {
  MembershipTier,
  MembershipBenefits,
  UserRole,
  Permission,
  RolePermissions
} from '@/lib/types/auth';

// ========================================
// VIP Membership Tier Definitions
// ========================================

export const MEMBERSHIP_BENEFITS: Readonly<Record<MembershipTier, MembershipBenefits>> = {
  [MembershipTier.BASIC]: {
    tier: MembershipTier.BASIC,
    name: 'Basic Member',
    description: 'Access to our curated collection of premium products',
    maxProducts: 50,
    exclusiveAccess: false,
    personalConcierge: false,
    prioritySupport: false,
    freeShipping: false,
    monthlyCredits: 0,
    discountPercentage: 0,
    features: [
      'Browse premium collection',
      'Standard customer support',
      'Basic member benefits',
      'Community access'
    ]
  },

  [MembershipTier.PREMIUM]: {
    tier: MembershipTier.PREMIUM,
    name: 'Premium VIP',
    description: 'Enhanced access with exclusive benefits and priority support',
    maxProducts: 200,
    exclusiveAccess: true,
    personalConcierge: false,
    prioritySupport: true,
    freeShipping: true,
    monthlyCredits: 100,
    discountPercentage: 10,
    features: [
      'Exclusive premium products',
      'Priority customer support',
      'Free standard shipping',
      '10% member discount',
      '$100 monthly credits',
      'Early access to new collections',
      'VIP member events'
    ]
  },

  [MembershipTier.ELITE]: {
    tier: MembershipTier.ELITE,
    name: 'Elite Member',
    description: 'Luxury experience with personal concierge and ultra-exclusive access',
    maxProducts: 500,
    exclusiveAccess: true,
    personalConcierge: true,
    prioritySupport: true,
    freeShipping: true,
    monthlyCredits: 500,
    discountPercentage: 20,
    features: [
      'Ultra-exclusive luxury products',
      'Personal shopping concierge',
      'White-glove customer service',
      'Free express shipping worldwide',
      '20% member discount',
      '$500 monthly credits',
      'Private collection previews',
      'Exclusive member experiences',
      'Invitation-only events'
    ]
  },

  [MembershipTier.ULTRA_ELITE]: {
    tier: MembershipTier.ULTRA_ELITE,
    name: 'Ultra-Elite Connoisseur',
    description: 'The pinnacle of luxury membership with unlimited access',
    maxProducts: Infinity,
    exclusiveAccess: true,
    personalConcierge: true,
    prioritySupport: true,
    freeShipping: true,
    monthlyCredits: 2000,
    discountPercentage: 30,
    features: [
      'Unlimited access to all collections',
      'Dedicated luxury concierge team',
      '24/7 premium support',
      'Free same-day delivery available',
      '30% member discount',
      '$2000 monthly credits',
      'Custom product sourcing',
      'Private luxury consultations',
      'Exclusive global events',
      'Direct designer access',
      'Limited edition priority',
      'Bespoke service offerings'
    ]
  }
} as const;

// ========================================
// Role-Based Permissions Matrix
// ========================================

export const ROLE_PERMISSIONS: Readonly<Record<UserRole, RolePermissions>> = {
  [UserRole.USER]: {
    role: UserRole.USER,
    permissions: [
      Permission.VIEW_PRODUCTS,
      Permission.PURCHASE_PRODUCTS
    ]
  },

  [UserRole.VIP]: {
    role: UserRole.VIP,
    permissions: [
      Permission.VIEW_PRODUCTS,
      Permission.PURCHASE_PRODUCTS,
      Permission.VIEW_EXCLUSIVE_PRODUCTS,
      Permission.ACCESS_VIP_AREA,
      Permission.PERSONAL_CONCIERGE
    ]
  },

  [UserRole.ADMIN]: {
    role: UserRole.ADMIN,
    permissions: [
      Permission.VIEW_PRODUCTS,
      Permission.PURCHASE_PRODUCTS,
      Permission.VIEW_EXCLUSIVE_PRODUCTS,
      Permission.ACCESS_VIP_AREA,
      Permission.MANAGE_USERS,
      Permission.MANAGE_PRODUCTS,
      Permission.VIEW_ANALYTICS,
      Permission.MANAGE_INVENTORY
    ]
  },

  [UserRole.SUPER_ADMIN]: {
    role: UserRole.SUPER_ADMIN,
    permissions: [
      Permission.VIEW_PRODUCTS,
      Permission.PURCHASE_PRODUCTS,
      Permission.VIEW_EXCLUSIVE_PRODUCTS,
      Permission.ACCESS_VIP_AREA,
      Permission.PERSONAL_CONCIERGE,
      Permission.MANAGE_USERS,
      Permission.MANAGE_PRODUCTS,
      Permission.VIEW_ANALYTICS,
      Permission.MANAGE_INVENTORY,
      Permission.MANAGE_ADMINS,
      Permission.SYSTEM_SETTINGS,
      Permission.AUDIT_LOGS
    ]
  }
} as const;

// ========================================
// Membership Upgrade Pricing
// ========================================

export const MEMBERSHIP_PRICING: Readonly<Record<MembershipTier, {
  monthly: number;
  yearly: number;
  currency: string;
}>> = {
  [MembershipTier.BASIC]: {
    monthly: 0,
    yearly: 0,
    currency: 'USD'
  },

  [MembershipTier.PREMIUM]: {
    monthly: 199,
    yearly: 1990, // 2 months free
    currency: 'USD'
  },

  [MembershipTier.ELITE]: {
    monthly: 499,
    yearly: 4990, // 2 months free
    currency: 'USD'
  },

  [MembershipTier.ULTRA_ELITE]: {
    monthly: 1999,
    yearly: 19990, // 2 months free
    currency: 'USD'
  }
} as const;

// ========================================
// Helper Functions
// ========================================

export const getMembershipBenefits = (tier: MembershipTier): MembershipBenefits => {
  return MEMBERSHIP_BENEFITS[tier];
};

export const getRolePermissions = (role: UserRole): readonly Permission[] => {
  return ROLE_PERMISSIONS[role].permissions;
};

export const hasPermission = (role: UserRole, permission: Permission): boolean => {
  return getRolePermissions(role).includes(permission);
};

export const canAccessVipArea = (tier: MembershipTier): boolean => {
  return MEMBERSHIP_BENEFITS[tier].exclusiveAccess;
};

export const getUpgradePrice = (
  fromTier: MembershipTier,
  toTier: MembershipTier,
  isYearly: boolean = false
): number => {
  const fromPrice = isYearly ? MEMBERSHIP_PRICING[fromTier].yearly : MEMBERSHIP_PRICING[fromTier].monthly;
  const toPrice = isYearly ? MEMBERSHIP_PRICING[toTier].yearly : MEMBERSHIP_PRICING[toTier].monthly;
  return Math.max(0, toPrice - fromPrice);
};

export const getMembershipTierByName = (name: string): MembershipTier | null => {
  const tiers = Object.values(MembershipTier);
  return tiers.find(tier => tier === name.toLowerCase()) || null;
};

// ========================================
// Validation Functions
// ========================================

export const isValidMembershipTier = (tier: string): tier is MembershipTier => {
  return Object.values(MembershipTier).includes(tier as MembershipTier);
};

export const isValidUserRole = (role: string): role is UserRole => {
  return Object.values(UserRole).includes(role as UserRole);
};

export const isValidPermission = (permission: string): permission is Permission => {
  return Object.values(Permission).includes(permission as Permission);
};
