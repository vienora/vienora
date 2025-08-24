'use client';

/**
 * VIP Registration Form Component
 * Premium registration form with membership tier selection and validation
 */

import React, { useState, useCallback } from 'react';
import { Eye, EyeOff, User, Mail, AlertCircle, Crown, Sparkles, Star } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { RegisterCredentials, AuthErrorCode, MembershipTier } from '@/lib/types/auth';
import { validateRegister } from '@/lib/validation/auth';
import { MEMBERSHIP_BENEFITS } from '@/lib/constants/membership';

// ========================================
// Component Props
// ========================================

interface RegisterFormProps {
  readonly onSuccess?: () => void;
  readonly onSwitchToLogin?: () => void;
  readonly className?: string;
}

// ========================================
// Registration Form Component
// ========================================

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
  className = ''
}) => {
  const { register, isLoading, lastError, clearError } = useAuth();

  const [formData, setFormData] = useState<RegisterCredentials>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    acceptedTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMembershipInfo, setShowMembershipInfo] = useState(false);

  // ========================================
  // Form Handlers
  // ========================================

  const handleInputChange = useCallback((field: keyof RegisterCredentials, value: string | boolean) => {
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
      clearError();
    }
  }, [validationErrors, lastError, clearError]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setValidationErrors({});
    clearError();

    // Validate form data
    const validation = validateRegister(formData);
    if (!validation.success) {
      setValidationErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register(formData);

      if (result.success) {
        onSuccess?.();
      }
      // Error handling is done by the auth context
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, register, onSuccess, clearError]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // ========================================
  // Error Display
  // ========================================

  const getErrorMessage = (error: any): string => {
    if (error?.code === AuthErrorCode.EMAIL_ALREADY_EXISTS) {
      return 'An account with this email already exists. Please sign in instead.';
    }
    if (error?.code === AuthErrorCode.WEAK_PASSWORD) {
      return 'Password does not meet security requirements. Please choose a stronger password.';
    }
    if (error?.code === AuthErrorCode.RATE_LIMIT_EXCEEDED) {
      return 'Too many registration attempts. Please wait a few minutes before trying again.';
    }
    return error?.message || 'An unexpected error occurred. Please try again.';
  };

  // ========================================
  // Password Strength Indicator
  // ========================================

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    const strength = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][score];
    const color = ['red', 'red', 'yellow', 'blue', 'green'][score];

    return { score, strength, color };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Join Vienora
        </h2>
        <p className="text-gray-600">
          Begin your luxury journey today
        </p>
      </div>

      {/* Membership Benefits Preview */}
      <div className="bg-gradient-to-r from-purple-50 to-amber-50 border border-purple-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-purple-800 flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            Premium Benefits
          </h3>
          <button
            type="button"
            onClick={() => setShowMembershipInfo(!showMembershipInfo)}
            className="text-purple-600 text-sm hover:text-purple-700"
          >
            {showMembershipInfo ? 'Hide' : 'View All'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center text-purple-700">
            <Star className="w-3 h-3 mr-1 text-amber-500" />
            <span>Exclusive Access</span>
          </div>
          <div className="flex items-center text-purple-700">
            <Star className="w-3 h-3 mr-1 text-amber-500" />
            <span>Premium Support</span>
          </div>
          <div className="flex items-center text-purple-700">
            <Star className="w-3 h-3 mr-1 text-amber-500" />
            <span>VIP Events</span>
          </div>
          <div className="flex items-center text-purple-700">
            <Star className="w-3 h-3 mr-1 text-amber-500" />
            <span>Luxury Rewards</span>
          </div>
        </div>

        {showMembershipInfo && (
          <div className="mt-4 p-3 bg-white bg-opacity-50 rounded">
            <div className="text-xs text-purple-800 space-y-1">
              <p>• Access to exclusive luxury collections</p>
              <p>• Personal shopping concierge service</p>
              <p>• Priority customer support</p>
              <p>• VIP member events and previews</p>
              <p>• Monthly luxury credits and discounts</p>
            </div>
          </div>
        )}
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

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                  validationErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="First name"
                autoComplete="given-name"
                disabled={isLoading || isSubmitting}
              />
            </div>
            {validationErrors.firstName && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.firstName[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                validationErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Last name"
              autoComplete="family-name"
              disabled={isLoading || isSubmitting}
            />
            {validationErrors.lastName && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.lastName[0]}</p>
            )}
          </div>
        </div>

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
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`block w-full px-3 py-3 pr-12 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Create a strong password"
              autoComplete="new-password"
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

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Password strength:</span>
                <span className={`font-medium text-${passwordStrength.color}-600`}>
                  {passwordStrength.strength}
                </span>
              </div>
              <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-${passwordStrength.color}-500 h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.password[0]}</p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div>
          <div className="flex items-start">
            <input
              id="acceptedTerms"
              type="checkbox"
              checked={formData.acceptedTerms}
              onChange={(e) => handleInputChange('acceptedTerms', e.target.checked)}
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded mt-1"
              disabled={isLoading || isSubmitting}
            />
            <label htmlFor="acceptedTerms" className="ml-3 text-sm text-gray-700">
              I agree to Vienora's{' '}
              <button type="button" className="text-amber-600 hover:text-amber-700 font-medium">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" className="text-amber-600 hover:text-amber-700 font-medium">
                Privacy Policy
              </button>
            </label>
          </div>
          {validationErrors.acceptedTerms && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.acceptedTerms[0]}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || isSubmitting || !formData.acceptedTerms}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading || isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating your account...
            </div>
          ) : (
            <div className="flex items-center">
              <Crown className="w-5 h-5 mr-2" />
              Join Vienora
            </div>
          )}
        </button>

        {/* Switch to Login */}
        {onSwitchToLogin && (
          <div className="text-center">
            <span className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                disabled={isLoading || isSubmitting}
              >
                Sign in here
              </button>
            </span>
          </div>
        )}
      </form>
    </div>
  );
};
