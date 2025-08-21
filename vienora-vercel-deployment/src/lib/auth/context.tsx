'use client';

/**
 * Authentication Context
 * Global state management for VIP authentication system
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import {
  User,
  AuthTokens,
  AuthState,
  AuthActions,
  AuthCredentials,
  RegisterCredentials,
  AuthResult,
  AuthError,
  AuthErrorCode,
  MembershipTier,
  Session
} from '@/lib/types/auth';
import { AuthService } from '@/lib/auth/service';

// ========================================
// Context Types
// ========================================

interface AuthContextType extends AuthState, AuthActions {}

interface AuthProviderProps {
  readonly children: ReactNode;
}

// ========================================
// Auth Actions
// ========================================

type AuthActionType =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; tokens: AuthTokens; session: Session } }
  | { type: 'AUTH_ERROR'; payload: AuthError }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' };

// ========================================
// Auth Reducer
// ========================================

const authReducer = (state: AuthState, action: AuthActionType): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        lastError: null
      };

    case 'AUTH_SUCCESS':
      return {
        user: action.payload.user,
        tokens: action.payload.tokens,
        isLoading: false,
        isAuthenticated: true,
        lastError: null
      };

    case 'AUTH_ERROR':
      return {
        user: null,
        tokens: null,
        isLoading: false,
        isAuthenticated: false,
        lastError: action.payload
      };

    case 'AUTH_LOGOUT':
      return {
        user: null,
        tokens: null,
        isLoading: false,
        isAuthenticated: false,
        lastError: null
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        lastError: null
      };

    default:
      return state;
  }
};

// ========================================
// Initial State
// ========================================

const initialState: AuthState = {
  user: null,
  tokens: null,
  isLoading: false,
  isAuthenticated: false,
  lastError: null
};

// ========================================
// Context Creation
// ========================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ========================================
// Auth Provider Component
// ========================================

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const authService = new AuthService();

  // ========================================
  // Token Management
  // ========================================

  const saveTokens = useCallback((tokens: AuthTokens): void => {
    try {
      localStorage.setItem('vienora_access_token', tokens.accessToken);
      localStorage.setItem('vienora_refresh_token', tokens.refreshToken);
      localStorage.setItem('vienora_token_expires', tokens.expiresIn.toString());
    } catch (error) {
      console.error('Failed to save tokens to localStorage:', error);
    }
  }, []);

  const clearTokens = useCallback((): void => {
    try {
      localStorage.removeItem('vienora_access_token');
      localStorage.removeItem('vienora_refresh_token');
      localStorage.removeItem('vienora_token_expires');
    } catch (error) {
      console.error('Failed to clear tokens from localStorage:', error);
    }
  }, []);

  const getStoredTokens = useCallback((): AuthTokens | null => {
    try {
      const accessToken = localStorage.getItem('vienora_access_token');
      const refreshToken = localStorage.getItem('vienora_refresh_token');
      const expiresIn = localStorage.getItem('vienora_token_expires');

      if (!accessToken || !refreshToken || !expiresIn) {
        return null;
      }

      return {
        accessToken,
        refreshToken,
        expiresIn: parseInt(expiresIn, 10)
      };
    } catch (error) {
      console.error('Failed to retrieve tokens from localStorage:', error);
      return null;
    }
  }, []);

  // ========================================
  // Authentication Actions
  // ========================================

  const login = useCallback(async (credentials: AuthCredentials): Promise<AuthResult<User>> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const result = await authService.login(credentials);

      if (result.success) {
        const { user, tokens, session } = result.data;

        // Save tokens to localStorage
        saveTokens(tokens);

        // Update state
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, tokens, session }
        });

        return { success: true, data: user };
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const authError: AuthError = {
        code: AuthErrorCode.NETWORK_ERROR,
        message: 'Network error during login',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date()
      };

      dispatch({ type: 'AUTH_ERROR', payload: authError });
      return { success: false, error: authError };
    }
  }, [authService, saveTokens]);

  const register = useCallback(async (credentials: RegisterCredentials): Promise<AuthResult<User>> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const result = await authService.register(credentials);

      if (result.success) {
        const { user, tokens, session } = result.data;

        // Save tokens to localStorage
        saveTokens(tokens);

        // Update state
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, tokens, session }
        });

        return { success: true, data: user };
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const authError: AuthError = {
        code: AuthErrorCode.NETWORK_ERROR,
        message: 'Network error during registration',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date()
      };

      dispatch({ type: 'AUTH_ERROR', payload: authError });
      return { success: false, error: authError };
    }
  }, [authService, saveTokens]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      // If we have tokens, try to logout from service
      if (state.tokens) {
        // In a real app, we'd extract session ID from the token
        await authService.logout('current-session-id');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Always clear local state and tokens
      clearTokens();
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  }, [authService, clearTokens, state.tokens]);

  const refreshToken = useCallback(async (): Promise<AuthResult<AuthTokens>> => {
    const storedTokens = getStoredTokens();

    if (!storedTokens) {
      const authError: AuthError = {
        code: AuthErrorCode.INVALID_TOKEN,
        message: 'No refresh token available',
        timestamp: new Date()
      };
      return { success: false, error: authError };
    }

    try {
      // In a real implementation, this would call the refresh endpoint
      // For now, we'll simulate a successful refresh
      const newTokens: AuthTokens = {
        accessToken: 'new-access-token',
        refreshToken: storedTokens.refreshToken,
        expiresIn: 15 * 60 // 15 minutes
      };

      saveTokens(newTokens);
      return { success: true, data: newTokens };

    } catch (error) {
      const authError: AuthError = {
        code: AuthErrorCode.TOKEN_EXPIRED,
        message: 'Failed to refresh authentication token',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date()
      };

      // Clear invalid tokens
      clearTokens();
      dispatch({ type: 'AUTH_LOGOUT' });

      return { success: false, error: authError };
    }
  }, [getStoredTokens, saveTokens, clearTokens]);

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<AuthResult<User>> => {
    if (!state.user) {
      const authError: AuthError = {
        code: AuthErrorCode.INVALID_TOKEN,
        message: 'User not authenticated',
        timestamp: new Date()
      };
      return { success: false, error: authError };
    }

    try {
      const result = await authService.updateUser(state.user.id, updates);

      if (result.success) {
        dispatch({ type: 'UPDATE_USER', payload: result.data });
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      const authError: AuthError = {
        code: AuthErrorCode.NETWORK_ERROR,
        message: 'Network error during profile update',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date()
      };

      return { success: false, error: authError };
    }
  }, [authService, state.user]);

  const upgradeMembership = useCallback(async (tier: MembershipTier): Promise<AuthResult<any>> => {
    if (!state.user) {
      const authError: AuthError = {
        code: AuthErrorCode.INVALID_TOKEN,
        message: 'User not authenticated',
        timestamp: new Date()
      };
      return { success: false, error: authError };
    }

    try {
      const result = await authService.upgradeMembership(state.user.id, tier);

      if (result.success) {
        dispatch({ type: 'UPDATE_USER', payload: result.data });

        return {
          success: true,
          data: {
            user: result.data,
            upgrade: {
              userId: result.data.id,
              fromTier: state.user.membershipTier,
              toTier: tier,
              price: 0, // Would be calculated based on tier
              currency: 'USD',
              benefits: {} // Would include actual benefits
            }
          }
        };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      const authError: AuthError = {
        code: AuthErrorCode.NETWORK_ERROR,
        message: 'Network error during membership upgrade',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date()
      };

      return { success: false, error: authError };
    }
  }, [authService, state.user]);

  // ========================================
  // Error Management
  // ========================================

  const clearError = useCallback((): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // ========================================
  // Auto-login on App Start
  // ========================================

  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      const storedTokens = getStoredTokens();

      if (storedTokens) {
        dispatch({ type: 'AUTH_START' });

        try {
          // In a real app, we'd verify the token with the server
          // For demo, we'll simulate getting user from token
          const demoUser: User = {
            id: 'demo-user',
            email: 'demo@vienora.com',
            firstName: 'Demo',
            lastName: 'User',
            membershipTier: MembershipTier.PREMIUM,
            role: 'vip' as any,
            isActive: true,
            emailVerified: true,
            createdAt: new Date(),
            lastLoginAt: new Date()
          };

          const demoSession: Session = {
            id: 'demo-session',
            userId: 'demo-user',
            userAgent: 'Demo',
            ipAddress: '127.0.0.1',
            isActive: true,
            createdAt: new Date(),
            lastActivityAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          };

          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: demoUser,
              tokens: storedTokens,
              session: demoSession
            }
          });
        } catch (error) {
          clearTokens();
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      }
    };

    initializeAuth();
  }, [getStoredTokens, clearTokens]);

  // ========================================
  // Context Value
  // ========================================

  const contextValue: AuthContextType = {
    // State
    user: state.user,
    tokens: state.tokens,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    lastError: state.lastError,

    // Actions
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    upgradeMembership,


  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// ========================================
// Custom Hook
// ========================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// ========================================
// Higher-Order Component for Protection
// ========================================

export interface WithAuthProps {
  readonly user: User;
}

export const withAuth = <P extends WithAuthProps>(
  Component: React.ComponentType<P>
): React.FC<Omit<P, keyof WithAuthProps>> => {
  return (props) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
        </div>
      );
    }

    if (!isAuthenticated || !user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600">
              Please log in to access this page.
            </p>
          </div>
        </div>
      );
    }

    return <Component {...(props as P)} user={user} />;
  };
};
