/**
 * Authentication Service
 * Core business logic for VIP authentication and membership management
 */

import {
  User,
  AuthCredentials,
  RegisterCredentials,
  AuthTokens,
  AuthResult,
  AuthError,
  AuthErrorCode,
  MembershipTier,
  UserRole,
  Session,
  AuditAction
} from '@/lib/types/auth';

import {
  generateTokens,
  verifyToken,
  refreshAccessToken,
  hashPassword,
  verifyPassword,
  generateSessionId,
  validatePasswordStrength
} from '@/lib/auth/jwt';

import {
  validateLogin,
  validateRegister,
  validateChangePassword,
  validateUpdateProfile
} from '@/lib/validation/auth';

// ========================================
// Authentication Service Class
// ========================================

export class AuthService {
  private users: Map<string, User> = new Map();
  private sessions: Map<string, Session> = new Map();

  constructor() {
    this.initializeDemoUsers();
  }

  // ========================================
  // User Authentication
  // ========================================

  async login(credentials: AuthCredentials): Promise<AuthResult<{ user: User; tokens: AuthTokens; session: Session }>> {
    // Validate input
    const validation = validateLogin(credentials);
    if (!validation.success) {
      return {
        success: false,
        error: {
          code: AuthErrorCode.INVALID_CREDENTIALS,
          message: 'Invalid login credentials provided',
          details: { validationErrors: validation.errors },
          timestamp: new Date()
        }
      };
    }

    try {
      // Find user by email
      const user = Array.from(this.users.values()).find(u => u.email === credentials.email);
      if (!user) {
        return {
          success: false,
          error: {
            code: AuthErrorCode.USER_NOT_FOUND,
            message: 'Invalid email or password',
            timestamp: new Date()
          }
        };
      }

      // Check if account is active
      if (!user.isActive) {
        return {
          success: false,
          error: {
            code: AuthErrorCode.ACCOUNT_DISABLED,
            message: 'Your account has been disabled. Please contact support.',
            timestamp: new Date()
          }
        };
      }

      // Verify password (in real implementation, this would use bcrypt)
      const isValidPassword = await this.verifyUserPassword(user.id, credentials.password);
      if (!isValidPassword) {
        await this.logAuditEvent(user.id, AuditAction.LOGIN, 'failed_password_attempt');
        return {
          success: false,
          error: {
            code: AuthErrorCode.INVALID_CREDENTIALS,
            message: 'Invalid email or password',
            timestamp: new Date()
          }
        };
      }

      // Create session
      const sessionId = generateSessionId();
      const session = await this.createSession(user.id, sessionId);

      // Generate tokens
      const tokensResult = await generateTokens(user, sessionId);
      if (!tokensResult.success) {
        return { success: false, error: tokensResult.error };
      }

      // Update last login
      const updatedUser = {
        ...user,
        lastLoginAt: new Date()
      };
      this.users.set(user.id, updatedUser);

      // Log successful login
      await this.logAuditEvent(user.id, AuditAction.LOGIN, 'successful_login');

      return {
        success: true,
        data: {
          user: updatedUser,
          tokens: tokensResult.data,
          session
        }
      };

    } catch (error) {
      return {
        success: false,
        error: {
          code: AuthErrorCode.UNKNOWN_ERROR,
          message: 'An unexpected error occurred during login',
          details: { error: error instanceof Error ? error.message : 'Unknown error' },
          timestamp: new Date()
        }
      };
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResult<{ user: User; tokens: AuthTokens; session: Session }>> {
    // Validate input
    const validation = validateRegister(credentials);
    if (!validation.success) {
      return {
        success: false,
        error: {
          code: AuthErrorCode.INVALID_CREDENTIALS,
          message: 'Invalid registration data provided',
          details: { validationErrors: validation.errors },
          timestamp: new Date()
        }
      };
    }

    try {
      // Check if email already exists
      const existingUser = Array.from(this.users.values()).find(u => u.email === credentials.email);
      if (existingUser) {
        return {
          success: false,
          error: {
            code: AuthErrorCode.EMAIL_ALREADY_EXISTS,
            message: 'An account with this email already exists',
            timestamp: new Date()
          }
        };
      }

      // Validate password strength
      const passwordStrength = validatePasswordStrength(credentials.password);
      if (!passwordStrength.isValid) {
        return {
          success: false,
          error: {
            code: AuthErrorCode.WEAK_PASSWORD,
            message: 'Password does not meet security requirements',
            details: { feedback: passwordStrength.feedback },
            timestamp: new Date()
          }
        };
      }

      // Create new user
      const userId = crypto.randomUUID();
      const hashedPassword = await hashPassword(credentials.password);

      const newUser: User = {
        id: userId,
        email: credentials.email,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        membershipTier: MembershipTier.BASIC,
        role: UserRole.USER,
        isActive: true,
        emailVerified: false, // Would trigger email verification in real app
        createdAt: new Date(),
        lastLoginAt: new Date()
      };

      this.users.set(userId, newUser);

      // Store password hash (in real app, this would be in secure database)
      await this.storePasswordHash(userId, hashedPassword);

      // Create session
      const sessionId = generateSessionId();
      const session = await this.createSession(userId, sessionId);

      // Generate tokens
      const tokensResult = await generateTokens(newUser, sessionId);
      if (!tokensResult.success) {
        return { success: false, error: tokensResult.error };
      }

      // Log registration
      await this.logAuditEvent(userId, AuditAction.REGISTER, 'user_registered');

      return {
        success: true,
        data: {
          user: newUser,
          tokens: tokensResult.data,
          session
        }
      };

    } catch (error) {
      return {
        success: false,
        error: {
          code: AuthErrorCode.UNKNOWN_ERROR,
          message: 'An unexpected error occurred during registration',
          details: { error: error instanceof Error ? error.message : 'Unknown error' },
          timestamp: new Date()
        }
      };
    }
  }

  async logout(sessionId: string): Promise<AuthResult<void>> {
    try {
      const session = this.sessions.get(sessionId);
      if (session) {
        // Revoke session
        this.sessions.delete(sessionId);

        // Log logout
        await this.logAuditEvent(session.userId, AuditAction.LOGOUT, 'user_logout');
      }

      return { success: true, data: undefined };

    } catch (error) {
      return {
        success: false,
        error: {
          code: AuthErrorCode.UNKNOWN_ERROR,
          message: 'An unexpected error occurred during logout',
          details: { error: error instanceof Error ? error.message : 'Unknown error' },
          timestamp: new Date()
        }
      };
    }
  }

  // ========================================
  // User Management
  // ========================================

  async getUserById(userId: string): Promise<User | null> {
    return this.users.get(userId) || null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<AuthResult<User>> {
    // Validate input
    const validation = validateUpdateProfile(updates);
    if (!validation.success) {
      return {
        success: false,
        error: {
          code: AuthErrorCode.INVALID_CREDENTIALS,
          message: 'Invalid profile update data',
          details: { validationErrors: validation.errors },
          timestamp: new Date()
        }
      };
    }

    try {
      const user = this.users.get(userId);
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

      // Check if email is being changed and if it's already taken
      if (updates.email && updates.email !== user.email) {
        const existingUser = Array.from(this.users.values()).find(u => u.email === updates.email);
        if (existingUser) {
          return {
            success: false,
            error: {
              code: AuthErrorCode.EMAIL_ALREADY_EXISTS,
              message: 'Email address is already in use',
              timestamp: new Date()
            }
          };
        }
      }

      const updatedUser = { ...user, ...updates };
      this.users.set(userId, updatedUser);

      // Log profile update
      await this.logAuditEvent(userId, AuditAction.PROFILE_UPDATE, 'profile_updated');

      return { success: true, data: updatedUser };

    } catch (error) {
      return {
        success: false,
        error: {
          code: AuthErrorCode.UNKNOWN_ERROR,
          message: 'An unexpected error occurred while updating profile',
          details: { error: error instanceof Error ? error.message : 'Unknown error' },
          timestamp: new Date()
        }
      };
    }
  }

  async upgradeMembership(userId: string, targetTier: MembershipTier): Promise<AuthResult<User>> {
    try {
      const user = this.users.get(userId);
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

      // Update membership tier
      const updatedUser = {
        ...user,
        membershipTier: targetTier,
        role: targetTier === MembershipTier.BASIC ? UserRole.USER : UserRole.VIP
      };

      this.users.set(userId, updatedUser);

      // Log membership upgrade
      await this.logAuditEvent(userId, AuditAction.MEMBERSHIP_UPGRADE, `upgraded_to_${targetTier}`);

      return { success: true, data: updatedUser };

    } catch (error) {
      return {
        success: false,
        error: {
          code: AuthErrorCode.UNKNOWN_ERROR,
          message: 'An unexpected error occurred during membership upgrade',
          details: { error: error instanceof Error ? error.message : 'Unknown error' },
          timestamp: new Date()
        }
      };
    }
  }

  // ========================================
  // Session Management
  // ========================================

  private async createSession(userId: string, sessionId: string): Promise<Session> {
    const session: Session = {
      id: sessionId,
      userId,
      userAgent: 'Vienora-Web-App', // Would get from request in real app
      ipAddress: '127.0.0.1', // Would get from request in real app
      isActive: true,
      createdAt: new Date(),
      lastActivityAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  async getActiveSessionsForUser(userId: string): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      session => session.userId === userId && session.isActive
    );
  }

  async revokeSession(sessionId: string): Promise<AuthResult<void>> {
    try {
      this.sessions.delete(sessionId);
      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: {
          code: AuthErrorCode.UNKNOWN_ERROR,
          message: 'Failed to revoke session',
          timestamp: new Date()
        }
      };
    }
  }

  // ========================================
  // Demo Data Initialization
  // ========================================

  private initializeDemoUsers(): void {
    // Demo admin user
    const adminUser: User = {
      id: 'admin-001',
      email: 'admin@vienora.com',
      firstName: 'Admin',
      lastName: 'User',
      membershipTier: MembershipTier.ULTRA_ELITE,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      emailVerified: true,
      createdAt: new Date('2024-01-01'),
      lastLoginAt: new Date()
    };

    // Demo VIP user
    const vipUser: User = {
      id: 'vip-001',
      email: 'vip@example.com',
      firstName: 'Victoria',
      lastName: 'Luxury',
      membershipTier: MembershipTier.ELITE,
      role: UserRole.VIP,
      isActive: true,
      emailVerified: true,
      createdAt: new Date('2024-02-01'),
      lastLoginAt: new Date()
    };

    // Demo basic user
    const basicUser: User = {
      id: 'user-001',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      membershipTier: MembershipTier.BASIC,
      role: UserRole.USER,
      isActive: true,
      emailVerified: true,
      createdAt: new Date('2024-03-01'),
      lastLoginAt: new Date()
    };

    this.users.set(adminUser.id, adminUser);
    this.users.set(vipUser.id, vipUser);
    this.users.set(basicUser.id, basicUser);

    // Store demo password hashes (password: "VienoraDemo123!")
    this.storePasswordHash(adminUser.id, 'demo-admin-hash');
    this.storePasswordHash(vipUser.id, 'demo-vip-hash');
    this.storePasswordHash(basicUser.id, 'demo-user-hash');
  }

  // ========================================
  // Helper Methods (Mock Implementation)
  // ========================================

  private passwordHashes: Map<string, string> = new Map();

  private async storePasswordHash(userId: string, hashedPassword: string): Promise<void> {
    this.passwordHashes.set(userId, hashedPassword);
  }

  private async verifyUserPassword(userId: string, password: string): Promise<boolean> {
    // In demo, accept "VienoraDemo123!" for all users
    return password === 'VienoraDemo123!';
  }

  private async logAuditEvent(userId: string, action: AuditAction, details: string): Promise<void> {
    // In a real implementation, this would log to a persistent audit system
    console.log(`Audit: User ${userId} performed ${action}: ${details}`);
  }

  // ========================================
  // Admin Functions
  // ========================================

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  async getUsersByMembershipTier(tier: MembershipTier): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.membershipTier === tier);
  }

  async setUserRole(userId: string, newRole: UserRole): Promise<AuthResult<User>> {
    try {
      const user = this.users.get(userId);
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

      const updatedUser = { ...user, role: newRole };
      this.users.set(userId, updatedUser);

      await this.logAuditEvent(userId, AuditAction.PERMISSION_GRANTED, `role_changed_to_${newRole}`);

      return { success: true, data: updatedUser };

    } catch (error) {
      return {
        success: false,
        error: {
          code: AuthErrorCode.UNKNOWN_ERROR,
          message: 'Failed to update user role',
          timestamp: new Date()
        }
      };
    }
  }

  async deactivateUser(userId: string): Promise<AuthResult<User>> {
    try {
      const user = this.users.get(userId);
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

      const updatedUser = { ...user, isActive: false };
      this.users.set(userId, updatedUser);

      // Revoke all sessions for this user
      const userSessions = Array.from(this.sessions.entries())
        .filter(([_, session]) => session.userId === userId);

      for (const [sessionId] of userSessions) {
        this.sessions.delete(sessionId);
      }

      await this.logAuditEvent(userId, AuditAction.ADMIN_ACTION, 'user_deactivated');

      return { success: true, data: updatedUser };

    } catch (error) {
      return {
        success: false,
        error: {
          code: AuthErrorCode.UNKNOWN_ERROR,
          message: 'Failed to deactivate user',
          timestamp: new Date()
        }
      };
    }
  }
}
