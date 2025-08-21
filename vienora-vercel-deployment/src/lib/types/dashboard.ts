/**
 * Dashboard Types
 * Enterprise-grade TypeScript interfaces for VIP, Admin, and Profile dashboards
 */

import { User, MembershipTier, UserRole, Permission } from './auth';

// ========================================
// VIP Dashboard Types
// ========================================

export interface VipDashboardData {
  readonly user: User;
  readonly membershipStatus: MembershipStatus;
  readonly exclusiveContent: ExclusiveContent;
  readonly rewards: LuxuryRewards;
  readonly activities: VipActivity[];
  readonly events: VipEvent[];
  readonly concierge: ConciergeService;
  readonly analytics: VipAnalytics;
}

export interface MembershipStatus {
  readonly currentTier: MembershipTier;
  readonly memberSince: Date;
  readonly nextTierRequirements?: TierRequirement;
  readonly benefits: MembershipBenefit[];
  readonly usage: TierUsage;
  readonly upgradeAvailable: boolean;
}

export interface TierRequirement {
  readonly targetTier: MembershipTier;
  readonly requiredSpending: number;
  readonly currentSpending: number;
  readonly timeRemaining: number; // in days
  readonly progressPercentage: number;
}

export interface MembershipBenefit {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly isActive: boolean;
  readonly usageCount: number;
  readonly usageLimit?: number;
  readonly category: BenefitCategory;
}

export enum BenefitCategory {
  SHOPPING = 'shopping',
  SHIPPING = 'shipping',
  SUPPORT = 'support',
  EVENTS = 'events',
  REWARDS = 'rewards'
}

export interface TierUsage {
  readonly monthlyCreditsUsed: number;
  readonly monthlyCreditsTotal: number;
  readonly discountsSaved: number;
  readonly conciergeHoursUsed: number;
  readonly exclusiveProductsViewed: number;
}

export interface ExclusiveContent {
  readonly collections: ExclusiveCollection[];
  readonly products: ExclusiveProduct[];
  readonly previews: ProductPreview[];
  readonly recommendations: LuxuryRecommendation[];
}

export interface ExclusiveCollection {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly productCount: number;
  readonly minimumTier: MembershipTier;
  readonly launchDate: Date;
  readonly featured: boolean;
  readonly imageUrl: string;
}

export interface ExclusiveProduct {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly originalPrice?: number;
  readonly minimumTier: MembershipTier;
  readonly availability: ProductAvailability;
  readonly exclusivityLevel: ExclusivityLevel;
  readonly imageUrl: string;
  readonly description: string;
  readonly features: string[];
}

export enum ProductAvailability {
  AVAILABLE = 'available',
  LIMITED = 'limited',
  WAITLIST = 'waitlist',
  SOLD_OUT = 'sold_out'
}

export enum ExclusivityLevel {
  VIP_ONLY = 'vip_only',
  ELITE_ONLY = 'elite_only',
  ULTRA_ELITE_ONLY = 'ultra_elite_only',
  INVITATION_ONLY = 'invitation_only'
}

export interface ProductPreview {
  readonly id: string;
  readonly name: string;
  readonly launchDate: Date;
  readonly previewImageUrl: string;
  readonly earlyAccessTier: MembershipTier;
  readonly estimatedPrice: number;
  readonly category: string;
}

export interface LuxuryRecommendation {
  readonly id: string;
  readonly productId: string;
  readonly reason: RecommendationReason;
  readonly confidence: number; // 0-1
  readonly personalizedMessage: string;
  readonly validUntil: Date;
}

export enum RecommendationReason {
  PURCHASE_HISTORY = 'purchase_history',
  BROWSING_BEHAVIOR = 'browsing_behavior',
  SIMILAR_MEMBERS = 'similar_members',
  TRENDING = 'trending',
  SEASONAL = 'seasonal'
}

export interface LuxuryRewards {
  readonly currentCredits: number;
  readonly lifetimeCredits: number;
  readonly pointsToNextReward: number;
  readonly availableRewards: Reward[];
  readonly recentRedemptions: RewardRedemption[];
  readonly specialOffers: SpecialOffer[];
}

export interface Reward {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly cost: number; // in credits
  readonly category: RewardCategory;
  readonly available: boolean;
  readonly expiresAt?: Date;
  readonly imageUrl: string;
}

export enum RewardCategory {
  DISCOUNT = 'discount',
  FREE_SHIPPING = 'free_shipping',
  EXCLUSIVE_ACCESS = 'exclusive_access',
  EXPERIENCE = 'experience',
  GIFT = 'gift'
}

export interface RewardRedemption {
  readonly id: string;
  readonly rewardId: string;
  readonly redeemedAt: Date;
  readonly creditsUsed: number;
  readonly status: RedemptionStatus;
}

export enum RedemptionStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  USED = 'used',
  EXPIRED = 'expired'
}

export interface SpecialOffer {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly discountPercentage: number;
  readonly validUntil: Date;
  readonly minimumPurchase?: number;
  readonly tierRequired: MembershipTier;
}

export interface VipActivity {
  readonly id: string;
  readonly type: ActivityType;
  readonly description: string;
  readonly timestamp: Date;
  readonly metadata: Record<string, unknown>;
}

export enum ActivityType {
  PURCHASE = 'purchase',
  EXCLUSIVE_ACCESS = 'exclusive_access',
  REWARD_REDEMPTION = 'reward_redemption',
  TIER_UPGRADE = 'tier_upgrade',
  EVENT_REGISTRATION = 'event_registration',
  CONCIERGE_REQUEST = 'concierge_request'
}

export interface VipEvent {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly eventDate: Date;
  readonly location: EventLocation;
  readonly minimumTier: MembershipTier;
  readonly capacity: number;
  readonly registeredCount: number;
  readonly status: EventStatus;
  readonly imageUrl: string;
  readonly features: string[];
}

export interface EventLocation {
  readonly type: LocationType;
  readonly address?: string;
  readonly city: string;
  readonly country: string;
  readonly virtual?: VirtualEventDetails;
}

export enum LocationType {
  PHYSICAL = 'physical',
  VIRTUAL = 'virtual',
  HYBRID = 'hybrid'
}

export interface VirtualEventDetails {
  readonly platform: string;
  readonly accessLink: string;
  readonly requiresApp: boolean;
}

export enum EventStatus {
  UPCOMING = 'upcoming',
  REGISTRATION_OPEN = 'registration_open',
  REGISTRATION_CLOSED = 'registration_closed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface ConciergeService {
  readonly isAvailable: boolean;
  readonly remainingHours: number;
  readonly totalHours: number;
  readonly activeRequests: ConciergeRequest[];
  readonly recentSessions: ConciergeSession[];
  readonly preferredAgent?: ConciergeAgent;
}

export interface ConciergeRequest {
  readonly id: string;
  readonly type: ConciergeType;
  readonly priority: RequestPriority;
  readonly description: string;
  readonly status: RequestStatus;
  readonly createdAt: Date;
  readonly estimatedCompletion?: Date;
  readonly assignedAgent?: ConciergeAgent;
}

export enum ConciergeType {
  PERSONAL_SHOPPING = 'personal_shopping',
  PRODUCT_SOURCING = 'product_sourcing',
  EVENT_PLANNING = 'event_planning',
  LIFESTYLE_CONSULTATION = 'lifestyle_consultation',
  TECHNICAL_SUPPORT = 'technical_support'
}

export enum RequestPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum RequestStatus {
  SUBMITTED = 'submitted',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface ConciergeAgent {
  readonly id: string;
  readonly name: string;
  readonly specialty: ConciergeType[];
  readonly rating: number;
  readonly languages: string[];
  readonly avatar: string;
}

export interface ConciergeSession {
  readonly id: string;
  readonly agent: ConciergeAgent;
  readonly duration: number; // in minutes
  readonly satisfaction: number; // 1-5
  readonly completedAt: Date;
  readonly summary: string;
}

export interface VipAnalytics {
  readonly spendingHistory: SpendingData[];
  readonly engagementMetrics: EngagementMetrics;
  readonly preferenceAnalysis: PreferenceAnalysis;
  readonly membershipProgress: MembershipProgress;
}

export interface SpendingData {
  readonly period: string; // YYYY-MM format
  readonly amount: number;
  readonly savingsFromDiscounts: number;
  readonly creditsEarned: number;
  readonly transactionCount: number;
}

export interface EngagementMetrics {
  readonly loginFrequency: number; // per month
  readonly exclusiveContentViews: number;
  readonly eventParticipation: number;
  readonly conciergeUsage: number;
  readonly rewardRedemptions: number;
}

export interface PreferenceAnalysis {
  readonly topCategories: CategoryPreference[];
  readonly priceRange: PriceRangePreference;
  readonly brandAffinity: BrandPreference[];
  readonly seasonalTrends: SeasonalPreference[];
}

export interface CategoryPreference {
  readonly category: string;
  readonly percentage: number;
  readonly trend: TrendDirection;
}

export interface PriceRangePreference {
  readonly minimum: number;
  readonly maximum: number;
  readonly average: number;
  readonly preference: PricePreference;
}

export enum PricePreference {
  VALUE_CONSCIOUS = 'value_conscious',
  QUALITY_FOCUSED = 'quality_focused',
  LUXURY_SEEKER = 'luxury_seeker',
  PRICE_INSENSITIVE = 'price_insensitive'
}

export interface BrandPreference {
  readonly brand: string;
  readonly percentage: number;
  readonly lastPurchase: Date;
}

export interface SeasonalPreference {
  readonly season: string;
  readonly categories: string[];
  readonly spendingIncrease: number; // percentage
}

export enum TrendDirection {
  INCREASING = 'increasing',
  STABLE = 'stable',
  DECREASING = 'decreasing'
}

export interface MembershipProgress {
  readonly currentLevel: MembershipTier;
  readonly progressToNext: number; // percentage
  readonly milestones: Milestone[];
  readonly achievements: Achievement[];
}

export interface Milestone {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly targetValue: number;
  readonly currentValue: number;
  readonly completed: boolean;
  readonly completedAt?: Date;
  readonly reward?: string;
}

export interface Achievement {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly iconUrl: string;
  readonly unlockedAt: Date;
  readonly rarity: AchievementRarity;
}

export enum AchievementRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

// ========================================
// Admin Dashboard Types
// ========================================

export interface AdminDashboardData {
  readonly overview: AdminOverview;
  readonly userManagement: UserManagementData;
  readonly analytics: AdminAnalytics;
  readonly membershipControl: any; // TODO: Define proper type
  readonly securityMonitoring: any; // TODO: Define proper type
  readonly contentManagement: any; // TODO: Define proper type
  readonly systemHealth: any; // TODO: Define proper type
}

export interface AdminOverview {
  readonly totalUsers: number;
  readonly activeUsers: number;
  readonly newUsersToday: number;
  readonly revenueToday: number;
  readonly revenueThisMonth: number;
  readonly membershipDistribution: MembershipDistribution;
  readonly quickStats: QuickStat[];
  readonly alerts: AdminAlert[];
}

export interface MembershipDistribution {
  readonly basic: number;
  readonly premium: number;
  readonly elite: number;
  readonly ultraElite: number;
}

export interface QuickStat {
  readonly label: string;
  readonly value: number | string;
  readonly change: number; // percentage change
  readonly trend: TrendDirection;
  readonly period: string;
}

export interface AdminAlert {
  readonly id: string;
  readonly type: AlertType;
  readonly severity: AlertSeverity;
  readonly message: string;
  readonly timestamp: Date;
  readonly acknowledged: boolean;
  readonly actionRequired: boolean;
}

export enum AlertType {
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  USER_ACTIVITY = 'user_activity',
  PAYMENT = 'payment',
  SYSTEM = 'system'
}

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export interface UserManagementData {
  readonly users: AdminUserView[];
  readonly filters: UserFilter;
  readonly pagination: PaginationData;
  readonly bulkActions: BulkAction[];
}

export interface AdminUserView {
  readonly id: string;
  readonly email: string;
  readonly fullName: string;
  readonly membershipTier: MembershipTier;
  readonly role: UserRole;
  readonly status: UserStatus;
  readonly createdAt: Date;
  readonly lastLoginAt?: Date;
  readonly lifetimeValue: number;
  readonly riskScore: number;
  readonly flags: UserFlag[];
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification'
}

export interface UserFlag {
  readonly type: FlagType;
  readonly reason: string;
  readonly createdAt: Date;
  readonly severity: FlagSeverity;
}

export enum FlagType {
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  PAYMENT_ISSUE = 'payment_issue',
  POLICY_VIOLATION = 'policy_violation',
  SECURITY_CONCERN = 'security_concern'
}

export enum FlagSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface UserFilter {
  readonly membershipTier?: MembershipTier;
  readonly role?: UserRole;
  readonly status?: UserStatus;
  readonly dateRange?: DateRange;
  readonly searchQuery?: string;
}

export interface DateRange {
  readonly startDate: Date;
  readonly endDate: Date;
}

export interface PaginationData {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly totalItems: number;
}

export interface BulkAction {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly requiresConfirmation: boolean;
  readonly permissions: Permission[];
}

export interface AdminAnalytics {
  readonly userGrowth: GrowthMetrics;
  readonly revenueAnalytics: RevenueAnalytics;
  readonly engagementMetrics: PlatformEngagementMetrics;
  readonly membershipAnalytics: MembershipAnalytics;
  readonly performanceMetrics: PerformanceMetrics;
}

export interface GrowthMetrics {
  readonly newUsers: TimeSeriesData[];
  readonly userRetention: RetentionData[];
  readonly churnRate: number;
  readonly growthRate: number;
}

export interface TimeSeriesData {
  readonly date: string;
  readonly value: number;
}

export interface RetentionData {
  readonly cohort: string;
  readonly period: number;
  readonly retentionRate: number;
}

export interface RevenueAnalytics {
  readonly totalRevenue: number;
  readonly revenueGrowth: number;
  readonly averageOrderValue: number;
  readonly revenueByTier: TierRevenue[];
  readonly monthlyRecurring: number;
}

export interface TierRevenue {
  readonly tier: MembershipTier;
  readonly revenue: number;
  readonly percentage: number;
}

export interface PlatformEngagementMetrics {
  readonly dailyActiveUsers: number;
  readonly weeklyActiveUsers: number;
  readonly monthlyActiveUsers: number;
  readonly sessionDuration: number;
  readonly pageViews: number;
  readonly bounceRate: number;
}

export interface MembershipAnalytics {
  readonly upgrades: TierUpgrade[];
  readonly downgrades: TierDowngrade[];
  readonly tierDistribution: MembershipDistribution;
  readonly conversionRates: ConversionRate[];
}

export interface TierUpgrade {
  readonly fromTier: MembershipTier;
  readonly toTier: MembershipTier;
  readonly count: number;
  readonly revenue: number;
}

export interface TierDowngrade {
  readonly fromTier: MembershipTier;
  readonly toTier: MembershipTier;
  readonly count: number;
  readonly reason: string;
}

export interface ConversionRate {
  readonly fromTier: MembershipTier;
  readonly toTier: MembershipTier;
  readonly rate: number;
  readonly period: string;
}

export interface PerformanceMetrics {
  readonly responseTime: number;
  readonly uptime: number;
  readonly errorRate: number;
  readonly throughput: number;
}

// ========================================
// Profile Management Types
// ========================================

export interface UserProfile {
  readonly personalInfo: PersonalInfo;
  readonly preferences: UserPreferences;
  readonly security: SecuritySettings;
  readonly privacy: PrivacySettings;
  readonly analytics: ProfileAnalytics;
  readonly notifications: NotificationSettings;
}

export interface PersonalInfo {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone?: string;
  readonly avatar?: string;
  readonly dateOfBirth?: Date;
  readonly address?: Address;
  readonly socialProfiles?: SocialProfile[];
}

export interface Address {
  readonly street: string;
  readonly city: string;
  readonly state: string;
  readonly zipCode: string;
  readonly country: string;
  readonly isDefault: boolean;
}

export interface SocialProfile {
  readonly platform: SocialPlatform;
  readonly profileUrl: string;
  readonly verified: boolean;
}

export enum SocialPlatform {
  LINKEDIN = 'linkedin',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  FACEBOOK = 'facebook'
}

export interface UserPreferences {
  readonly theme: ThemePreference;
  readonly language: string;
  readonly timezone: string;
  readonly currency: string;
  readonly communication: CommunicationPreferences;
  readonly shopping: ShoppingPreferences;
}

export enum ThemePreference {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto'
}

export interface CommunicationPreferences {
  readonly email: EmailPreferences;
  readonly sms: SmsPreferences;
  readonly push: PushPreferences;
}

export interface EmailPreferences {
  readonly marketing: boolean;
  readonly orderUpdates: boolean;
  readonly vipOffers: boolean;
  readonly eventInvitations: boolean;
  readonly newsletterFrequency: NewsletterFrequency;
}

export enum NewsletterFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  NEVER = 'never'
}

export interface SmsPreferences {
  readonly orderUpdates: boolean;
  readonly urgentNotifications: boolean;
  readonly eventReminders: boolean;
}

export interface PushPreferences {
  readonly general: boolean;
  readonly orderUpdates: boolean;
  readonly exclusiveOffers: boolean;
  readonly eventNotifications: boolean;
}

export interface ShoppingPreferences {
  readonly favoriteCategories: string[];
  readonly priceAlertThreshold: number;
  readonly autoSaveWishlist: boolean;
  readonly recommendationEngine: boolean;
  readonly quickOrderEnabled: boolean;
}

export interface SecuritySettings {
  readonly twoFactorEnabled: boolean;
  readonly passwordLastChanged: Date;
  readonly activeSessions: SecuritySession[];
  readonly loginHistory: LoginAttempt[];
  readonly securityQuestions: SecurityQuestion[];
}

export interface SecuritySession {
  readonly id: string;
  readonly device: string;
  readonly location: string;
  readonly ipAddress: string;
  readonly lastActivity: Date;
  readonly isCurrent: boolean;
}

export interface LoginAttempt {
  readonly timestamp: Date;
  readonly success: boolean;
  readonly ipAddress: string;
  readonly device: string;
  readonly location?: string;
}

export interface SecurityQuestion {
  readonly id: string;
  readonly question: string;
  readonly isSet: boolean;
  readonly lastUpdated?: Date;
}

export interface PrivacySettings {
  readonly profileVisibility: ProfileVisibility;
  readonly dataSharing: DataSharingSettings;
  readonly cookieConsent: CookieConsent;
  readonly marketingConsent: MarketingConsent;
}

export enum ProfileVisibility {
  PUBLIC = 'public',
  MEMBERS_ONLY = 'members_only',
  PRIVATE = 'private'
}

export interface DataSharingSettings {
  readonly analytics: boolean;
  readonly personalization: boolean;
  readonly thirdPartyIntegrations: boolean;
  readonly marketingPartners: boolean;
}

export interface CookieConsent {
  readonly necessary: boolean; // always true
  readonly functional: boolean;
  readonly analytics: boolean;
  readonly marketing: boolean;
  readonly lastUpdated: Date;
}

export interface MarketingConsent {
  readonly email: boolean;
  readonly sms: boolean;
  readonly thirdParty: boolean;
  readonly consentDate: Date;
}

export interface ProfileAnalytics {
  readonly accountAge: number; // in days
  readonly totalOrders: number;
  readonly lifetimeValue: number;
  readonly averageOrderValue: number;
  readonly favoriteCategories: CategoryPreference[];
  readonly activitySummary: ActivitySummary;
}

export interface ActivitySummary {
  readonly loginsThisMonth: number;
  readonly ordersThisMonth: number;
  readonly wishlistItems: number;
  readonly reviewsWritten: number;
  readonly referralsSent: number;
}

export interface NotificationSettings {
  readonly channels: NotificationChannel[];
  readonly types: NotificationType[];
  readonly schedule: NotificationSchedule;
}

export interface NotificationChannel {
  readonly channel: ChannelType;
  readonly enabled: boolean;
  readonly verifiedAt?: Date;
}

export enum ChannelType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app'
}

export interface NotificationType {
  readonly type: string;
  readonly label: string;
  readonly description: string;
  readonly enabled: boolean;
  readonly channels: ChannelType[];
}

export interface NotificationSchedule {
  readonly quietHoursEnabled: boolean;
  readonly quietStart?: string; // HH:MM format
  readonly quietEnd?: string; // HH:MM format
  readonly timezone: string;
  readonly weekendsEnabled: boolean;
}

// ========================================
// Common Dashboard Utilities
// ========================================

export interface DashboardWidget {
  readonly id: string;
  readonly type: WidgetType;
  readonly title: string;
  readonly data: unknown;
  readonly position: WidgetPosition;
  readonly isVisible: boolean;
  readonly refreshRate?: number; // in seconds
}

export enum WidgetType {
  CHART = 'chart',
  METRIC = 'metric',
  TABLE = 'table',
  LIST = 'list',
  ACTIVITY_FEED = 'activity_feed',
  QUICK_ACTIONS = 'quick_actions'
}

export interface WidgetPosition {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface DashboardLayout {
  readonly widgets: DashboardWidget[];
  readonly lastModified: Date;
  readonly isDefault: boolean;
}

// ========================================
// API Response Types
// ========================================

export type DashboardResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: DashboardError };

export interface DashboardError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
  readonly timestamp: Date;
}
