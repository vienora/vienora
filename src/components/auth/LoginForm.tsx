'use client';

/**
 * VIP Login Form Component
 * Premium authentication form with luxury styling and comprehensive validation
 */

import React, { useState, useCallback } from 'react';
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { AuthCredentials, AuthErrorCode } from '@/lib/types/auth';
import { validateLogin } from '@/lib/validation/auth';

// ========================================
// Component Props
// ========================================

interface LoginFormProps {
  readonly onSuccess?: () => void;
  readonly onSwitchToRegister?: () => void;
  readonly className?: string;
}

// ========================================
// Login Form Component
// ========================================

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
  className = ''
}) => {
  const { login, isLoading, lastError } = useAuth();

  const [formData, setFormData] = useState<AuthCredentials>({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ========================================
  // Form Handlers
  // ========================================

  const handleInputChange = useCallback((field: keyof AuthCredentials, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear validation errors for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }

    // Clear auth errors
    if (lastError) {

    }
  }, [validationErrors, lastError]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setValidationErrors({});


    // Validate form data
    const validation = validateLogin(formData);
    if (!validation.success) {
      setValidationErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(formData);

      if (result.success) {
        onSuccess?.();
      }
      // Error handling is done by the auth context
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, login, onSuccess]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // ========================================
  // Demo Account Info
  // ========================================

  const demoAccounts = [
    { email: 'admin@vienora.com', password: 'VienoraDemo123!', role: 'Super Admin' },
    { email: 'vip@example.com', password: 'VienoraDemo123!', role: 'VIP Member' },
    { email: 'user@example.com', password: 'VienoraDemo123!', role: 'Basic User' }
  ];

  const fillDemoAccount = useCallback((email: string, password: string) => {
    setFormData({ email, password });

    setValidationErrors({});
  }, []);

  // ========================================
  // Error Display
  // ========================================

  const getErrorMessage = (error: any): string => {
    if (error?.code === AuthErrorCode.INVALID_CREDENTIALS || error?.code === AuthErrorCode.USER_NOT_FOUND) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    if (error?.code === AuthErrorCode.ACCOUNT_DISABLED) {
      return 'Your account has been disabled. Please contact support for assistance.';
    }
    if (error?.code === AuthErrorCode.RATE_LIMIT_EXCEEDED) {
      return 'Too many login attempts. Please wait a few minutes before trying again.';
    }
    return error?.message || 'An unexpected error occurred. Please try again.';
  };

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-600">
          Sign in to your Vienora account
        </p>
      </div>

      {/* Demo Accounts */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-amber-800 mb-3 flex items-center">
          <CheckCircle className="w-4 h-4 mr-2" />
          Demo Accounts
        </h3>
        <div className="space-y-2">
          {demoAccounts.map((account, index) => (
            <button
              key={index}
              onClick={() => fillDemoAccount(account.email, account.password)}
              className="w-full text-left p-2 bg-white border border-amber-200 rounded text-sm hover:bg-amber-50 transition-colors"
            >
              <div className="font-medium text-amber-900">{account.role}</div>
              <div className="text-amber-700">{account.email}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {lastError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center text-red-800">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{getErrorMessage(lastError)}</span>
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={isLoading || isSubmitting}
            />
          </div>
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.email[0]}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={isLoading || isSubmitting}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              disabled={isLoading || isSubmitting}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.password[0]}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              disabled={isLoading || isSubmitting}
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <button
            type="button"
            className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
            disabled={isLoading || isSubmitting}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading || isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Signing in...
            </div>
          ) : (
            'Sign In'
          )}
        </button>

        {/* Switch to Register */}
        {onSwitchToRegister && (
          <div className="text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                disabled={isLoading || isSubmitting}
              >
                Create one now
              </button>
            </span>
          </div>
        )}
      </form>
    </div>
  );
};
