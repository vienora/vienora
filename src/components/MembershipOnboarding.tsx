'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Award,
  Crown,
  Shield,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Eye,
  Star,
  Gift
} from 'lucide-react';

interface OnboardingData {
  invitationCode: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    title: string;
    company: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    categories: string[];
    budgetRange: string;
    communicationPrefs: string[];
    specialRequests: string;
  };
  verification: {
    agreedToTerms: boolean;
    agreedToPrivacy: boolean;
    wantsNewsletters: boolean;
  };
}

interface MembershipOnboardingProps {
  onComplete: (data: OnboardingData) => void;
  onCancel: () => void;
}

const membershipTiers = [
  {
    name: 'Elite',
    icon: Star,
    color: 'amber',
    features: ['Exclusive Collections', 'White-Glove Service', 'Priority Support']
  },
  {
    name: 'Prestige',
    icon: Crown,
    color: 'purple',
    features: ['Private Auctions', 'Personal Curator', 'Rare Finds Access']
  },
  {
    name: 'Sovereign',
    icon: Award,
    color: 'gold',
    features: ['Bespoke Services', 'Global Concierge', 'Museum Quality']
  }
];

const categories = [
  'Fine Art & Collectibles',
  'Luxury Timepieces',
  'Designer Furniture',
  'Premium Electronics',
  'Exotic Vehicles',
  'Rare Wines & Spirits',
  'Jewelry & Precious Stones',
  'Bespoke Fashion'
];

const budgetRanges = [
  '$10,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000 - $500,000',
  '$500,000+'
];

export default function MembershipOnboarding({ onComplete, onCancel }: MembershipOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    invitationCode: '',
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      title: '',
      company: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    preferences: {
      categories: [],
      budgetRange: '',
      communicationPrefs: [],
      specialRequests: ''
    },
    verification: {
      agreedToTerms: false,
      agreedToPrivacy: false,
      wantsNewsletters: true
    }
  });

  const steps = [
    'Invitation',
    'Personal Details',
    'Address',
    'Preferences',
    'Verification'
  ];

  const updateData = (section: keyof OnboardingData, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  const toggleCategory = (category: string) => {
    const current = data.preferences.categories;
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    updateData('preferences', 'categories', updated);
  };

  const toggleCommunicationPref = (pref: string) => {
    const current = data.preferences.communicationPrefs;
    const updated = current.includes(pref)
      ? current.filter(p => p !== pref)
      : [...current, pref];
    updateData('preferences', 'communicationPrefs', updated);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(data);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return data.invitationCode.length >= 8;
      case 1:
        return data.personalInfo.firstName && data.personalInfo.lastName && data.personalInfo.email;
      case 2:
        return data.address.street && data.address.city && data.address.state;
      case 3:
        return data.preferences.categories.length > 0 && data.preferences.budgetRange;
      case 4:
        return data.verification.agreedToTerms && data.verification.agreedToPrivacy;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl font-bold text-white">Elite Membership</h1>
          </div>
          <p className="text-gray-300">Welcome to the world's most exclusive luxury marketplace</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep ? 'bg-amber-600 text-white' : 'bg-gray-600 text-gray-300'
                }`}>
                  {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentStep ? 'bg-amber-600' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            {steps.map((step, index) => (
              <span key={step} className={index === currentStep ? 'text-amber-400' : ''}>
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 0 && <Mail className="w-5 h-5" />}
              {currentStep === 1 && <Eye className="w-5 h-5" />}
              {currentStep === 2 && <MapPin className="w-5 h-5" />}
              {currentStep === 3 && <Star className="w-5 h-5" />}
              {currentStep === 4 && <Shield className="w-5 h-5" />}
              {steps[currentStep]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 0: Invitation Code */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Gift className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Invitation Required</h3>
                  <p className="text-muted-foreground">
                    Enter your exclusive invitation code to begin your elite membership journey
                  </p>
                </div>
                <div className="max-w-md mx-auto">
                  <Input
                    placeholder="Enter invitation code"
                    value={data.invitationCode}
                    onChange={(e) => updateData('invitationCode', '', e.target.value)}
                    className="text-center text-lg tracking-widest"
                  />
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Don't have an invitation? <a href="#" className="text-amber-600 hover:underline">Request access</a>
                  </p>
                </div>
              </div>
            )}

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <Input
                      value={data.personalInfo.firstName}
                      onChange={(e) => updateData('personalInfo', 'firstName', e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <Input
                      value={data.personalInfo.lastName}
                      onChange={(e) => updateData('personalInfo', 'lastName', e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input
                    type="email"
                    value={data.personalInfo.email}
                    onChange={(e) => updateData('personalInfo', 'email', e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input
                      value={data.personalInfo.phone}
                      onChange={(e) => updateData('personalInfo', 'phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Professional Title</label>
                    <Input
                      value={data.personalInfo.title}
                      onChange={(e) => updateData('personalInfo', 'title', e.target.value)}
                      placeholder="CEO, Art Collector, etc."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company/Organization</label>
                  <Input
                    value={data.personalInfo.company}
                    onChange={(e) => updateData('personalInfo', 'company', e.target.value)}
                    placeholder="Company name (optional)"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Address */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Street Address</label>
                  <Input
                    value={data.address.street}
                    onChange={(e) => updateData('address', 'street', e.target.value)}
                    placeholder="Enter street address"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <Input
                      value={data.address.city}
                      onChange={(e) => updateData('address', 'city', e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State/Province</label>
                    <Input
                      value={data.address.state}
                      onChange={(e) => updateData('address', 'state', e.target.value)}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP/Postal Code</label>
                    <Input
                      value={data.address.zipCode}
                      onChange={(e) => updateData('address', 'zipCode', e.target.value)}
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <Input
                    value={data.address.country}
                    onChange={(e) => updateData('address', 'country', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Areas of Interest</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={data.preferences.categories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <label htmlFor={category} className="text-sm cursor-pointer">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Investment Range</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {budgetRanges.map((range) => (
                      <Button
                        key={range}
                        variant={data.preferences.budgetRange === range ? "default" : "outline"}
                        onClick={() => updateData('preferences', 'budgetRange', range)}
                        className="justify-start"
                      >
                        {range}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Communication Preferences</h4>
                  <div className="space-y-2">
                    {['Private Sales Alerts', 'Auction Notifications', 'Curator Recommendations', 'Event Invitations'].map((pref) => (
                      <div key={pref} className="flex items-center space-x-2">
                        <Checkbox
                          id={pref}
                          checked={data.preferences.communicationPrefs.includes(pref)}
                          onCheckedChange={() => toggleCommunicationPref(pref)}
                        />
                        <label htmlFor={pref} className="text-sm cursor-pointer">
                          {pref}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Special Requests or Notes</label>
                  <Textarea
                    value={data.preferences.specialRequests}
                    onChange={(e) => updateData('preferences', 'specialRequests', e.target.value)}
                    placeholder="Any specific interests, requirements, or requests..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Verification */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Crown className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Welcome to Elite Status</h3>
                  <p className="text-muted-foreground">
                    Review and accept our terms to complete your membership
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 my-8">
                  {membershipTiers.map((tier) => (
                    <Card key={tier.name} className="text-center p-4">
                      <tier.icon className={`w-8 h-8 mx-auto mb-2 text-${tier.color}-600`} />
                      <h4 className="font-semibold">{tier.name}</h4>
                      <ul className="text-sm text-muted-foreground mt-2">
                        {tier.features.map((feature) => (
                          <li key={feature}>• {feature}</li>
                        ))}
                      </ul>
                    </Card>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={data.verification.agreedToTerms}
                      onCheckedChange={(checked) => updateData('verification', 'agreedToTerms', checked)}
                    />
                    <label htmlFor="terms" className="text-sm cursor-pointer">
                      I agree to the <a href="#" className="text-amber-600 hover:underline">Terms of Service</a> and
                      understand the exclusive nature of this membership
                    </label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="privacy"
                      checked={data.verification.agreedToPrivacy}
                      onCheckedChange={(checked) => updateData('verification', 'agreedToPrivacy', checked)}
                    />
                    <label htmlFor="privacy" className="text-sm cursor-pointer">
                      I agree to the <a href="#" className="text-amber-600 hover:underline">Privacy Policy</a> and
                      consent to premium service communications
                    </label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={data.verification.wantsNewsletters}
                      onCheckedChange={(checked) => updateData('verification', 'wantsNewsletters', checked)}
                    />
                    <label htmlFor="newsletter" className="text-sm cursor-pointer">
                      I want to receive exclusive newsletters and luxury insights
                    </label>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep} disabled={!isStepValid()}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={!isStepValid()} className="bg-amber-600 hover:bg-amber-700">
                <Crown className="w-4 h-4 mr-2" />
                Complete Membership
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
