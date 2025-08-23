'use client';

/**
 * Authentication Modal Component
 * Comprehensive modal for login and registration with VIP styling
 */

import React, { useState, useCallback, useEffect } from 'react';
import { X, Crown, Sparkles } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

// ========================================
// Component Props
// ========================================

interface AuthModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly initialMode?: 'login' | 'register';
  readonly onSuccess?: () => void;
}

type AuthMode = 'login' | 'register';

// ========================================
// Authentication Modal Component
// ========================================

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess
}) => {
  const [currentMode, setCurrentMode] = useState<AuthMode>(initialMode);

  // Reset mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentMode(initialMode);
    }
  }, [isOpen, initialMode]);

  // Handle successful authentication
  const handleAuthSuccess = useCallback(() => {
    onSuccess?.();
    onClose();
  }, [onSuccess, onClose]);

  // Handle mode switching
  const switchToLogin = useCallback(() => {
    setCurrentMode('login');
  }, []);

  const switchToRegister = useCallback(() => {
    setCurrentMode('register');
  }, []);

  // Handle modal close
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="auth-modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        onClick={handleBackdropClick}
      >
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        />

        {/* Center positioning */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Modal header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 relative">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header content */}
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mr-4">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Vienora
                </h2>
                <p className="text-purple-100 text-sm">
                  Luxury Marketplace
                </p>
              </div>
            </div>

            {/* VIP Benefits Banner */}
            <div className="mt-4 p-3 bg-white bg-opacity-10 rounded-lg">
              <div className="flex items-center text-white text-sm">
                <Sparkles className="w-4 h-4 mr-2 text-amber-300" />
                <span className="font-medium">
                  Join our exclusive community of luxury connoisseurs
                </span>
              </div>
            </div>
          </div>

          {/* Modal content */}
          <div className="bg-white px-6 py-8">
            {/* Mode tabs */}
            <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
              <button
                onClick={switchToLogin}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  currentMode === 'login'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={switchToRegister}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  currentMode === 'register'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Join Now
              </button>
            </div>

            {/* Form content */}
            <div className="transition-all duration-300">
              {currentMode === 'login' ? (
                <LoginForm
                  onSuccess={handleAuthSuccess}
                  onSwitchToRegister={switchToRegister}
                  className="mb-0"
                />
              ) : (
                <RegisterForm
                  onSuccess={handleAuthSuccess}
                  onSwitchToLogin={switchToLogin}
                  className="mb-0"
                />
              )}
            </div>
          </div>

          {/* Modal footer */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">
                By continuing, you agree to our{' '}
                <button className="text-amber-600 hover:text-amber-700 font-medium">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button className="text-amber-600 hover:text-amber-700 font-medium">
                  Privacy Policy
                </button>
              </p>

              {/* VIP Benefits */}
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                  <span>Exclusive Access</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mr-1"></div>
                  <span>Premium Support</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-1"></div>
                  <span>Luxury Rewards</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================
// Hook for Auth Modal State
// ========================================

export const useAuthModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');

  const openLogin = useCallback(() => {
    setMode('login');
    setIsOpen(true);
  }, []);

  const openRegister = useCallback(() => {
    setMode('register');
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    mode,
    openLogin,
    openRegister,
    close
  };
};
