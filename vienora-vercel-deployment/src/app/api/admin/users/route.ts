/**
 * Admin Users Management API
 * Secure admin endpoints for user management with role-based access control
 */

import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/service';
import { validateApiToken } from '@/lib/auth/jwt';
import { validateUserListQuery, validateUpdateUserRole, validateCreateUser } from '@/lib/validation/auth';
import { AuthErrorCode, UserRole, Permission } from '@/lib/types/auth';
import { hasPermission } from '@/lib/constants/membership';

// Configure for dynamic deployment
export const dynamic = 'force-dynamic';

// ========================================
// Get Users List (Admin)
// ========================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Validate authentication and authorization
    const authCheck = await validateAdminAccess(request, Permission.MANAGE_USERS);
    if (!authCheck.success) {
      return authCheck.response;
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = {
      search: searchParams.get('search') || undefined,
      role: searchParams.get('role') || undefined,
      membershipTier: searchParams.get('membershipTier') || undefined,
      isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
      emailVerified: searchParams.get('emailVerified') ? searchParams.get('emailVerified') === 'true' : undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
    };

    // Validate query parameters
    const validation = validateUserListQuery(queryParams);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.INVALID_CREDENTIALS,
            message: 'Invalid query parameters',
            details: { validationErrors: validation.errors },
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    // Get users from service
    const authService = new AuthService();
    const allUsers = await authService.getAllUsers();

    // Apply filters
    let filteredUsers = allUsers;

    if (queryParams.search) {
      const searchTerm = queryParams.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.email.toLowerCase().includes(searchTerm) ||
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm)
      );
    }

    if (queryParams.role) {
      filteredUsers = filteredUsers.filter(user => user.role === queryParams.role);
    }

    if (queryParams.membershipTier) {
      filteredUsers = filteredUsers.filter(user => user.membershipTier === queryParams.membershipTier);
    }

    if (queryParams.isActive !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.isActive === queryParams.isActive);
    }

    if (queryParams.emailVerified !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.emailVerified === queryParams.emailVerified);
    }

    // Apply sorting
    filteredUsers.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (queryParams.sortBy) {
        case 'email':
          aVal = a.email;
          bVal = b.email;
          break;
        case 'firstName':
          aVal = a.firstName;
          bVal = b.firstName;
          break;
        case 'lastName':
          aVal = a.lastName;
          bVal = b.lastName;
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
          break;
        case 'lastLoginAt':
          aVal = a.lastLoginAt ? new Date(a.lastLoginAt) : new Date(0);
          bVal = b.lastLoginAt ? new Date(b.lastLoginAt) : new Date(0);
          break;
        default:
          aVal = a.createdAt;
          bVal = b.createdAt;
      }

      if (queryParams.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Apply pagination
    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / queryParams.limit);
    const offset = (queryParams.page - 1) * queryParams.limit;
    const paginatedUsers = filteredUsers.slice(offset, offset + queryParams.limit);

    // Calculate statistics
    const stats = {
      total,
      active: allUsers.filter(u => u.isActive).length,
      inactive: allUsers.filter(u => !u.isActive).length,
      verified: allUsers.filter(u => u.emailVerified).length,
      unverified: allUsers.filter(u => !u.emailVerified).length,
      byRole: {
        user: allUsers.filter(u => u.role === UserRole.USER).length,
        vip: allUsers.filter(u => u.role === UserRole.VIP).length,
        admin: allUsers.filter(u => u.role === UserRole.ADMIN).length,
        super_admin: allUsers.filter(u => u.role === UserRole.SUPER_ADMIN).length
      }
    };

    // Format user data for response (remove sensitive information)
    const responseUsers = paginatedUsers.map(user => ({
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
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          users: responseUsers,
          pagination: {
            page: queryParams.page,
            limit: queryParams.limit,
            total,
            totalPages,
            hasNext: queryParams.page < totalPages,
            hasPrev: queryParams.page > 1
          },
          statistics: stats
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Unexpected error retrieving users:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: AuthErrorCode.UNKNOWN_ERROR,
          message: 'An unexpected error occurred while retrieving users',
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

// ========================================
// Create New User (Admin)
// ========================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Validate authentication and authorization
    const authCheck = await validateAdminAccess(request, Permission.MANAGE_USERS);
    if (!authCheck.success) {
      return authCheck.response;
    }

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
    const validation = validateCreateUser(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.INVALID_CREDENTIALS,
            message: 'Invalid user creation data',
            details: { validationErrors: validation.errors },
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    const userData = validation.data;

    // Create user via auth service (this would be different from regular registration)
    const authService = new AuthService();

    // Check if email already exists
    const allUsers = await authService.getAllUsers();
    const existingUser = allUsers.find(u => u.email === userData.email);

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.EMAIL_ALREADY_EXISTS,
            message: 'A user with this email already exists',
            timestamp: new Date().toISOString()
          }
        },
        { status: 409 }
      );
    }

    // Create new user (in a real app, this would use a different method than regular registration)
    const newUser = {
      id: crypto.randomUUID(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      membershipTier: userData.membershipTier,
      role: userData.role,
      isActive: true,
      emailVerified: true, // Admin-created users are pre-verified
      createdAt: new Date()
    };

    // In a real implementation, you would:
    // 1. Store user in database
    // 2. Generate temporary password
    // 3. Send welcome email with setup instructions
    // 4. Log admin action

    return NextResponse.json(
      {
        success: true,
        data: {
          user: newUser,
          message: 'User created successfully',
          tempPassword: 'VienoraTemp123!' // In real app, this would be secure
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Unexpected error creating user:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: AuthErrorCode.UNKNOWN_ERROR,
          message: 'An unexpected error occurred while creating user',
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

// ========================================
// Authorization Helper
// ========================================

interface AuthCheckResult {
  readonly success: boolean;
  readonly response: NextResponse;
  readonly userId?: string;
  readonly userRole?: UserRole;
}

async function validateAdminAccess(
  request: NextRequest,
  requiredPermission: Permission
): Promise<AuthCheckResult> {
  // Validate token
  const tokenValidation = await validateApiToken(request);

  if (!tokenValidation.success) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: {
            code: tokenValidation.error.code,
            message: tokenValidation.error.message,
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      )
    };
  }

  const { userId } = tokenValidation.data;

  // Get user to check role
  const authService = new AuthService();
  const user = await authService.getUserById(userId);

  if (!user) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.USER_NOT_FOUND,
            message: 'User not found',
            timestamp: new Date().toISOString()
          }
        },
        { status: 404 }
      )
    };
  }

  // Check if user has required permission
  if (!hasPermission(user.role, requiredPermission)) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.INSUFFICIENT_PERMISSIONS,
            message: 'Insufficient permissions for this operation',
            timestamp: new Date().toISOString()
          }
        },
        { status: 403 }
      )
    };
  }

  return {
    success: true,
    response: NextResponse.json({}), // Won't be used
    userId: user.id,
    userRole: user.role
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
