'use client';

/**
 * Profile Dashboard Component
 * Comprehensive user profile management with settings, security, and analytics
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  User,
  Settings,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Camera,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Globe,
  Smartphone,
  Mail,
  Lock,
  Key,
  Trash2,
  Upload,
  Download,
  Calendar,
  MapPin,
  Phone,
  Languages,
  Palette,
  Clock,
  BarChart3,
  Activity,
  Star,
  Heart,
  MessageSquare,
  UserPlus,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { UserProfile, DashboardResult } from '@/lib/types/dashboard';

// ========================================
// Component Props
// ========================================

interface ProfileDashboardProps {
  readonly className?: string;
}

// ========================================
// Profile Dashboard Component
// ========================================

export const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ className = '' }) => {
  const { user, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'preferences' | 'security' | 'privacy' | 'notifications' | 'analytics'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ========================================
  // Data Fetching
  // ========================================

  const fetchProfileData = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setError('Authentication required');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vienora_access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to load profile');
      }

      const result: DashboardResult<UserProfile> = await response.json();

      if (result.success) {
        setProfileData(result.data);
      } else {
        throw new Error(result.error.message);
      }

    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // ========================================
  // Avatar Upload
  // ========================================

  const handleAvatarUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      alert('File size too large. Maximum size is 5MB');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload a JPEG, PNG, or WebP image');
      return;
    }

    try {
      setUploadingAvatar(true);

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vienora_access_token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to upload avatar');
      }

      const result = await response.json();

      if (result.success) {
        // Refresh profile data to get updated avatar
        await fetchProfileData();
      } else {
        throw new Error(result.error?.message || 'Failed to upload avatar');
      }

    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [fetchProfileData]);

  const handleAvatarDelete = useCallback(async () => {
    if (!confirm('Are you sure you want to remove your avatar?')) return;

    try {
      setUploadingAvatar(true);

      const response = await fetch('/api/profile/avatar', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vienora_access_token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to remove avatar');
      }

      const result = await response.json();

      if (result.success) {
        // Refresh profile data to get updated avatar
        await fetchProfileData();
      } else {
        throw new Error(result.error?.message || 'Failed to remove avatar');
      }

    } catch (error) {
      console.error('Error removing avatar:', error);
      alert(error instanceof Error ? error.message : 'Failed to remove avatar');
    } finally {
      setUploadingAvatar(false);
    }
  }, [fetchProfileData]);

  // ========================================
  // Profile Update
  // ========================================

  const handleSaveProfile = useCallback(async (section: string, data: any) => {
    try {
      setIsSaving(true);

      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vienora_access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          section,
          data
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update profile');
      }

      const result = await response.json();

      if (result.success) {
        setProfileData(result.data);
        setIsEditing(false);
      } else {
        throw new Error(result.error?.message || 'Failed to update profile');
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  }, []);

  // ========================================
  // Loading and Error States
  // ========================================

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gray-50 ${className}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="text-xl font-semibold text-gray-900 mb-2">Loading Profile</div>
            <div className="text-gray-600">Preparing your settings...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProfileData}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  {profileData.personalInfo.avatar ? (
                    <img
                      src={profileData.personalInfo.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {uploadingAvatar ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-3 h-3" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profileData.personalInfo.firstName} {profileData.personalInfo.lastName}
                </h1>
                <p className="text-gray-600">{profileData.personalInfo.email}</p>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500">Member since</span>
                  <span className="text-sm font-medium text-gray-900 ml-1">
                    {Math.floor(profileData.analytics.accountAge / 365)} years ago
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {profileData.personalInfo.avatar && (
                <button
                  onClick={handleAvatarDelete}
                  disabled={uploadingAvatar}
                  className="text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              <div className="text-right">
                <div className="text-sm text-gray-600">Lifetime Value</div>
                <div className="text-lg font-semibold text-green-600">
                  ${profileData.analytics.lifetimeValue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'personal', label: 'Personal Info', icon: User },
              { id: 'preferences', label: 'Preferences', icon: Settings },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'privacy', label: 'Privacy', icon: Eye },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'personal' && (
          <PersonalInfoTab
            data={profileData.personalInfo}
            onSave={(data) => handleSaveProfile('personalInfo', data)}
            isEditing={isEditing}
            onEditToggle={setIsEditing}
            isSaving={isSaving}
          />
        )}
        {activeTab === 'preferences' && (
          <PreferencesTab
            data={profileData.preferences}
            onSave={(data) => handleSaveProfile('preferences', data)}
          />
        )}
        {activeTab === 'security' && (
          <SecurityTab
            data={profileData.security}
            onSave={(data) => handleSaveProfile('security', data)}
          />
        )}
        {activeTab === 'privacy' && (
          <PrivacyTab
            data={profileData.privacy}
            onSave={(data) => handleSaveProfile('privacy', data)}
          />
        )}
        {activeTab === 'notifications' && (
          <NotificationsTab
            data={profileData.notifications}
            onSave={(data) => handleSaveProfile('notifications', data)}
          />
        )}
        {activeTab === 'analytics' && (
          <AnalyticsTab data={profileData.analytics} />
        )}
      </div>
    </div>
  );
};

// ========================================
// Personal Info Tab Component
// ========================================

const PersonalInfoTab: React.FC<{
  data: any;
  onSave: (data: any) => void;
  isEditing: boolean;
  onEditToggle: (editing: boolean) => void;
  isSaving: boolean;
}> = ({ data, onSave, isEditing, onEditToggle, isSaving }) => {
  const [formData, setFormData] = useState(data);

  const handleSave = () => {
    onSave(formData);
  };

  const handleCancel = () => {
    setFormData(data);
    onEditToggle(false);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4 mr-2 inline" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline" />
                  ) : (
                    <Save className="w-4 h-4 mr-2 inline" />
                  )}
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => onEditToggle(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-2 inline" />
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            ) : (
              <div className="text-gray-900">{data.firstName}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            ) : (
              <div className="text-gray-900">{data.lastName}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="flex items-center">
              <div className="text-gray-900">{data.email}</div>
              <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            ) : (
              <div className="text-gray-900">{data.phone || 'Not provided'}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            {isEditing ? (
              <input
                type="date"
                value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            ) : (
              <div className="text-gray-900">
                {data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : 'Not provided'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Information */}
      {data.address && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <div className="text-gray-900">{data.address.street}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <div className="text-gray-900">{data.address.city}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <div className="text-gray-900">{data.address.state}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
              <div className="text-gray-900">{data.address.zipCode}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <div className="text-gray-900">{data.address.country}</div>
            </div>
          </div>
        </div>
      )}

      {/* Social Profiles */}
      {data.socialProfiles && data.socialProfiles.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Profiles</h3>
          <div className="space-y-3">
            {data.socialProfiles.map((profile: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Globe className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 capitalize">{profile.platform}</div>
                    <div className="text-sm text-gray-500">{profile.profileUrl}</div>
                  </div>
                </div>
                {profile.verified && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ========================================
// Preferences Tab Component
// ========================================

const PreferencesTab: React.FC<{
  data: any;
  onSave: (data: any) => void;
}> = ({ data, onSave }) => {
  const [preferences, setPreferences] = useState(data);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (section: string, field: string, value: any) => {
    const updated = {
      ...preferences,
      [section]: {
        ...preferences[section],
        [field]: value
      }
    };
    setPreferences(updated);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(preferences);
    setHasChanges(false);
  };

  return (
    <div className="space-y-8">
      {/* General Preferences */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">General Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={preferences.theme}
              onChange={(e) => handleChange('', 'theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={preferences.language}
              onChange={(e) => handleChange('', 'language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={preferences.timezone}
              onChange={(e) => handleChange('', 'timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/New_York">Eastern Time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              value={preferences.currency}
              onChange={(e) => handleChange('', 'currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shopping Preferences */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shopping Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Categories</label>
            <div className="flex flex-wrap gap-2">
              {preferences.shopping.favoriteCategories.map((category: string, index: number) => (
                <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {category}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Alert Threshold: ${preferences.shopping.priceAlertThreshold}
            </label>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={preferences.shopping.priceAlertThreshold}
              onChange={(e) => handleChange('shopping', 'priceAlertThreshold', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.shopping.autoSaveWishlist}
                onChange={(e) => handleChange('shopping', 'autoSaveWishlist', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-900">Auto-save items to wishlist</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.shopping.recommendationEngine}
                onChange={(e) => handleChange('shopping', 'recommendationEngine', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-900">Enable personalized recommendations</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.shopping.quickOrderEnabled}
                onChange={(e) => handleChange('shopping', 'quickOrderEnabled', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-900">Enable quick order feature</span>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      {hasChanges && (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">You have unsaved changes</span>
            <button
              onClick={handleSave}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ========================================
// Security Tab Component
// ========================================

const SecurityTab: React.FC<{
  data: any;
  onSave: (data: any) => void;
}> = ({ data, onSave }) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  return (
    <div className="space-y-8">
      {/* Security Overview */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
              data.twoFactorEnabled ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <Shield className={`w-6 h-6 ${data.twoFactorEnabled ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div className="text-sm font-medium text-gray-900">Two-Factor Auth</div>
            <div className={`text-xs ${data.twoFactorEnabled ? 'text-green-600' : 'text-red-600'}`}>
              {data.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Key className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-sm font-medium text-gray-900">Password</div>
            <div className="text-xs text-gray-600">
              Last changed {Math.floor((Date.now() - new Date(data.passwordLastChanged).getTime()) / (1000 * 60 * 60 * 24))} days ago
            </div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-sm font-medium text-gray-900">Active Sessions</div>
            <div className="text-xs text-gray-600">{data.activeSessions.length} sessions</div>
          </div>
        </div>
      </div>

      {/* Password Management */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Password</h3>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Change Password
          </button>
        </div>

        {showPasswordForm && (
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-2">
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Update Password
              </button>
              <button
                onClick={() => setShowPasswordForm(false)}
                className="text-gray-600 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
        <div className="space-y-4">
          {data.activeSessions.map((session: any) => (
            <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  {session.device.includes('iPhone') || session.device.includes('iPad') ? (
                    <Smartphone className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Globe className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{session.device}</div>
                  <div className="text-sm text-gray-500">{session.location} • {session.ipAddress}</div>
                  <div className="text-xs text-gray-400">
                    Last active: {new Date(session.lastActivity).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {session.isCurrent && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Current</span>
                )}
                {!session.isCurrent && (
                  <button className="text-red-600 hover:text-red-700 text-sm">Revoke</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Login History */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Login History</h3>
        <div className="space-y-3">
          {data.loginHistory.slice(0, 5).map((login: any, index: number) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${login.success ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <div className="text-sm text-gray-900">{login.device}</div>
                  <div className="text-xs text-gray-500">{login.location || 'Unknown location'}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-900">
                  {new Date(login.timestamp).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(login.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ========================================
// Privacy Tab Component
// ========================================

const PrivacyTab: React.FC<{
  data: any;
  onSave: (data: any) => void;
}> = ({ data, onSave }) => {
  const [privacy, setPrivacy] = useState(data);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (section: string, field: string, value: any) => {
    const updated = {
      ...privacy,
      [section]: {
        ...privacy[section],
        [field]: value
      }
    };
    setPrivacy(updated);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(privacy);
    setHasChanges(false);
  };

  return (
    <div className="space-y-8">
      {/* Profile Visibility */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Visibility</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Who can see your profile?</label>
            <select
              value={privacy.profileVisibility}
              onChange={(e) => handleChange('', 'profileVisibility', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="public">Everyone</option>
              <option value="members_only">Members Only</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Sharing */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Sharing</h3>
        <div className="space-y-4">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={privacy.dataSharing.analytics}
              onChange={(e) => handleChange('dataSharing', 'analytics', e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-1"
            />
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">Analytics</div>
              <div className="text-sm text-gray-600">Help improve our platform with anonymous usage data</div>
            </div>
          </label>

          <label className="flex items-start">
            <input
              type="checkbox"
              checked={privacy.dataSharing.personalization}
              onChange={(e) => handleChange('dataSharing', 'personalization', e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-1"
            />
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">Personalization</div>
              <div className="text-sm text-gray-600">Use your data to personalize recommendations and content</div>
            </div>
          </label>

          <label className="flex items-start">
            <input
              type="checkbox"
              checked={privacy.dataSharing.thirdPartyIntegrations}
              onChange={(e) => handleChange('dataSharing', 'thirdPartyIntegrations', e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-1"
            />
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">Third-party Integrations</div>
              <div className="text-sm text-gray-600">Share data with integrated services for enhanced functionality</div>
            </div>
          </label>

          <label className="flex items-start">
            <input
              type="checkbox"
              checked={privacy.dataSharing.marketingPartners}
              onChange={(e) => handleChange('dataSharing', 'marketingPartners', e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-1"
            />
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">Marketing Partners</div>
              <div className="text-sm text-gray-600">Share anonymized data with marketing partners for relevant offers</div>
            </div>
          </label>
        </div>
      </div>

      {/* Cookie Preferences */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cookie Preferences</h3>
        <div className="space-y-4">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={privacy.cookieConsent.necessary}
              disabled
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-1 opacity-50"
            />
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">Necessary Cookies</div>
              <div className="text-sm text-gray-600">Required for basic site functionality (cannot be disabled)</div>
            </div>
          </label>

          <label className="flex items-start">
            <input
              type="checkbox"
              checked={privacy.cookieConsent.functional}
              onChange={(e) => handleChange('cookieConsent', 'functional', e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-1"
            />
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">Functional Cookies</div>
              <div className="text-sm text-gray-600">Remember your preferences and enhance your experience</div>
            </div>
          </label>

          <label className="flex items-start">
            <input
              type="checkbox"
              checked={privacy.cookieConsent.analytics}
              onChange={(e) => handleChange('cookieConsent', 'analytics', e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-1"
            />
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">Analytics Cookies</div>
              <div className="text-sm text-gray-600">Help us understand how visitors interact with our website</div>
            </div>
          </label>

          <label className="flex items-start">
            <input
              type="checkbox"
              checked={privacy.cookieConsent.marketing}
              onChange={(e) => handleChange('cookieConsent', 'marketing', e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-1"
            />
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">Marketing Cookies</div>
              <div className="text-sm text-gray-600">Show you relevant advertisements based on your interests</div>
            </div>
          </label>
        </div>
      </div>

      {/* Save Button */}
      {hasChanges && (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">You have unsaved changes</span>
            <button
              onClick={handleSave}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Save Privacy Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ========================================
// Notifications Tab Component
// ========================================

const NotificationsTab: React.FC<{
  data: any;
  onSave: (data: any) => void;
}> = ({ data, onSave }) => {
  const [notifications, setNotifications] = useState(data);
  const [hasChanges, setHasChanges] = useState(false);

  const handleTypeChange = (typeId: string, field: string, value: any) => {
    const updatedTypes = notifications.types.map((type: any) =>
      type.type === typeId ? { ...type, [field]: value } : type
    );
    setNotifications({ ...notifications, types: updatedTypes });
    setHasChanges(true);
  };

  const handleScheduleChange = (field: string, value: any) => {
    setNotifications({
      ...notifications,
      schedule: { ...notifications.schedule, [field]: value }
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(notifications);
    setHasChanges(false);
  };

  return (
    <div className="space-y-8">
      {/* Notification Channels */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Channels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {notifications.channels.map((channel: any) => (
            <div key={channel.channel} className="text-center">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 ${
                channel.enabled ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {channel.channel === 'email' && <Mail className={`w-6 h-6 ${channel.enabled ? 'text-green-600' : 'text-gray-400'}`} />}
                {channel.channel === 'sms' && <Smartphone className={`w-6 h-6 ${channel.enabled ? 'text-green-600' : 'text-gray-400'}`} />}
                {channel.channel === 'push' && <Bell className={`w-6 h-6 ${channel.enabled ? 'text-green-600' : 'text-gray-400'}`} />}
                {channel.channel === 'in_app' && <Activity className={`w-6 h-6 ${channel.enabled ? 'text-green-600' : 'text-gray-400'}`} />}
              </div>
              <div className="text-sm font-medium text-gray-900 capitalize">{channel.channel.replace('_', ' ')}</div>
              <div className={`text-xs ${channel.enabled ? 'text-green-600' : 'text-gray-500'}`}>
                {channel.enabled ? 'Enabled' : 'Disabled'}
              </div>
              {channel.verifiedAt && (
                <div className="text-xs text-gray-400 mt-1">
                  Verified {new Date(channel.verifiedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notification Types */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h3>
        <div className="space-y-6">
          {notifications.types.map((type: any) => (
            <div key={type.type} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{type.label}</div>
                  <div className="text-sm text-gray-600">{type.description}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={type.enabled}
                    onChange={(e) => handleTypeChange(type.type, 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {type.channels.map((channel: string) => (
                  <span key={channel} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs capitalize">
                    {channel.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Schedule */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Schedule</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notifications.schedule.quietHoursEnabled}
              onChange={(e) => handleScheduleChange('quietHoursEnabled', e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="ml-2 text-sm text-gray-900">Enable quiet hours</span>
          </label>

          {notifications.schedule.quietHoursEnabled && (
            <div className="grid grid-cols-2 gap-4 ml-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quiet hours start</label>
                <input
                  type="time"
                  value={notifications.schedule.quietStart}
                  onChange={(e) => handleScheduleChange('quietStart', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quiet hours end</label>
                <input
                  type="time"
                  value={notifications.schedule.quietEnd}
                  onChange={(e) => handleScheduleChange('quietEnd', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notifications.schedule.weekendsEnabled}
              onChange={(e) => handleScheduleChange('weekendsEnabled', e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="ml-2 text-sm text-gray-900">Send notifications on weekends</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      {hasChanges && (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">You have unsaved changes</span>
            <button
              onClick={handleSave}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Save Notification Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ========================================
// Analytics Tab Component
// ========================================

const AnalyticsTab: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{data.accountAge}</div>
          <div className="text-sm text-gray-600">Days as Member</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{data.totalOrders}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">${data.lifetimeValue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Lifetime Value</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">${data.averageOrderValue}</div>
          <div className="text-sm text-gray-600">Avg Order Value</div>
        </div>
      </div>

      {/* Favorite Categories */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Favorite Categories</h3>
        <div className="space-y-4">
          {data.favoriteCategories.map((category: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded mr-3" />
                <span className="font-medium text-gray-900">{category.category}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {category.percentage}%
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  category.trend === 'increasing' ? 'bg-green-100 text-green-800' :
                  category.trend === 'decreasing' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {category.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">{data.activitySummary.loginsThisMonth}</div>
            <div className="text-xs text-gray-600">Logins This Month</div>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">{data.activitySummary.ordersThisMonth}</div>
            <div className="text-xs text-gray-600">Orders This Month</div>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Heart className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">{data.activitySummary.wishlistItems}</div>
            <div className="text-xs text-gray-600">Wishlist Items</div>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <MessageSquare className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">{data.activitySummary.reviewsWritten}</div>
            <div className="text-xs text-gray-600">Reviews Written</div>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <UserPlus className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">{data.activitySummary.referralsSent}</div>
            <div className="text-xs text-gray-600">Referrals Sent</div>
          </div>
        </div>
      </div>
    </div>
  );
};
