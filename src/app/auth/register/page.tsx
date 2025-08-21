/**
 * Enhanced Registration Page for Vienora Complete Luxury Marketplace
 * Comprehensive signup with VIP tier selection and real backend integration
 */

'use client';

// Force dynamic rendering for client-side auth context
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Eye,
  EyeOff,
  Crown,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Loader2,
  Check,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth/context';
import { RegisterCredentials, MembershipTier } from '@/lib/types/auth';
import { validateRegister } from '@/lib/validation/auth';
import { MEMBERSHIP_BENEFITS } from '@/lib/constants/membership';
import { ClientAuthWrapper } from '@/components/auth/ClientAuthWrapper';

// ========================================
// VIP Tier Information
// ========================================

const membershipTiers = [
  {
    tier: MembershipTier.BASIC,
    name: 'Basic',
    price: 'Free',
    color: 'bg-gray-100 border-gray-300 text-gray-700',
    selectedColor: 'bg-gray-50 border-gray-400',
    benefits: [
      'Access to marketplace',
      'Standard customer support',
      'Basic product catalog'
    ]
  },
  {
    tier: MembershipTier.PREMIUM,
    name: 'Premium',
    price: '$29/month',
    color: 'bg-blue-50 border-blue-300 text-blue-700',
    selectedColor: 'bg-blue-100 border-blue-500',
    benefits: [
      '5% discount on all products',
      '50% off shipping',
      'Priority customer support',
      'Early access to new products'
    ]
  },
  {
    tier: MembershipTier.ELITE,
    name: 'Elite',
    price: '$79/month',
    color: 'bg-purple-50 border-purple-300 text-purple-700',
    selectedColor: 'bg-purple-100 border-purple-500',
    popular: true,
    benefits: [
      '10% discount on all products',
      'Free shipping on all orders',
      'VIP customer support',
      'Exclusive product collections',
      'Personal shopping assistant'
    ]
  },
  {
    tier: MembershipTier.ULTRA_ELITE,
    name: 'Ultra Elite',
    price: '$199/month',
    color: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300 text-amber-700',
    selectedColor: 'bg-gradient-to-br from-amber-100 to-yellow-100 border-amber-500',
    benefits: [
      '15% discount on all products',
      'Free expedited shipping',
      'Dedicated concierge service',
      'Limited edition collections',
      'Private shopping events',
      'White-glove delivery service'
    ]
  }
];

// ========================================
// Registration Page Component
// ========================================

function RegisterPageContent(): JSX.Element {
  const router = useRouter();
  const { register, isAuthenticated, isLoading } = useAuth();

  const [formData, setFormData] = useState<RegisterCredentials>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    acceptedTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [selectedTier, setSelectedTier] = useState<MembershipTier>(MembershipTier.BASIC);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (field: keyof RegisterCredentials, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field-specific errors when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: [] }));
    }

    // Clear auth error
    if (authError) {
      setAuthError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateRegister(formData);
    if (!validation.success) {
      setValidationErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);
    setValidationErrors({});

    try {
      // Create registration data with selected tier
      const registrationData = {
        ...formData,
        membershipTier: selectedTier,
        subscribeNewsletter
      };

      await register(registrationData);

      // Redirect to login with success message
      router.push('/auth/login?message=registration-success');

    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : 'Registration failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-amber-50 py-8 px-4">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Vienora
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join the Elite</h1>
          <p className="text-gray-600">Create your luxury marketplace account and choose your membership tier</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Create Your Account</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* First Name */}
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className={`pl-10 ${
                              validationErrors.firstName?.length ? 'border-red-300' : ''
                            }`}
                            placeholder="Enter your first name"
                            disabled={isSubmitting}
                          />
                        </div>
                        {validationErrors.firstName?.map((error, index) => (
                          <p key={index} className="text-red-600 text-sm mt-1">{error}</p>
                        ))}
                      </div>

                      {/* Last Name */}
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className={`pl-10 ${
                              validationErrors.lastName?.length ? 'border-red-300' : ''
                            }`}
                            placeholder="Enter your last name"
                            disabled={isSubmitting}
                          />
                        </div>
                        {validationErrors.lastName?.map((error, index) => (
                          <p key={index} className="text-red-600 text-sm mt-1">{error}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      {/* Email */}
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`pl-10 ${
                              validationErrors.email?.length ? 'border-red-300' : ''
                            }`}
                            placeholder="Enter your email"
                            disabled={isSubmitting}
                          />
                        </div>
                        {validationErrors.email?.map((error, index) => (
                          <p key={index} className="text-red-600 text-sm mt-1">{error}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Password Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                    <div className="space-y-4">
                      {/* Password */}
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className={`pl-10 pr-12 ${
                              validationErrors.password?.length ? 'border-red-300' : ''
                            }`}
                            placeholder="Create a strong password"
                            disabled={isSubmitting}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            disabled={isSubmitting}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {validationErrors.password?.map((error, index) => (
                          <p key={index} className="text-red-600 text-sm mt-1">{error}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Terms and Newsletter */}
                  <div className="space-y-4">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={formData.acceptedTerms}
                        onChange={(e) => handleInputChange('acceptedTerms', e.target.checked)}
                        className="mt-1 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        disabled={isSubmitting}
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        I accept the{' '}
                        <Link href="/terms" className="text-amber-600 hover:text-amber-500">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-amber-600 hover:text-amber-500">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    {validationErrors.acceptedTerms?.map((error, index) => (
                      <p key={index} className="text-red-600 text-sm">{error}</p>
                    ))}

                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={subscribeNewsletter}
                        onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                        className="mt-1 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        disabled={isSubmitting}
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Subscribe to our newsletter for exclusive offers and updates
                      </span>
                    </label>
                  </div>

                  {/* Auth Error */}
                  {authError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                      <p className="text-red-800 text-sm">{authError}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold py-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* VIP Tier Selection */}
          <div>
            <VipTierSelection
              selectedTier={selectedTier}
              onTierChange={setSelectedTier}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-amber-600 hover:text-amber-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage(): JSX.Element {
  return (
    <ClientAuthWrapper>
      <React.Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-amber-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }>
        <RegisterPageContent />
      </React.Suspense>
    </ClientAuthWrapper>
  );
}

// ========================================
// VIP Tier Selection Component
// ========================================

interface VipTierSelectionProps {
  selectedTier: MembershipTier;
  onTierChange: (tier: MembershipTier) => void;
  disabled: boolean;
}

function VipTierSelection({ selectedTier, onTierChange, disabled }: VipTierSelectionProps): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Crown className="w-5 h-5 mr-2 text-amber-600" />
          Choose Your Membership
        </CardTitle>
        <p className="text-sm text-gray-600">Select your VIP tier to unlock exclusive benefits</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {membershipTiers.map((tier) => (
          <div
            key={tier.tier}
            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedTier === tier.tier
                ? tier.selectedColor
                : tier.color
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
            onClick={() => !disabled && onTierChange(tier.tier)}
          >
            {tier.popular && (
              <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-amber-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                Popular
              </Badge>
            )}

            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{tier.name}</h3>
              <span className="font-bold">{tier.price}</span>
            </div>

            <ul className="space-y-1">
              {tier.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center text-sm">
                  <Check className="w-3 h-3 mr-2 text-green-600" />
                  {benefit}
                </li>
              ))}
            </ul>

            {selectedTier === tier.tier && (
              <div className="absolute top-2 right-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            )}
          </div>
        ))}

        <div className="text-center text-xs text-gray-500 mt-4">
          You can change your membership tier anytime in your account settings
        </div>
      </CardContent>
    </Card>
  );
}
