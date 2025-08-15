'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Crown, Loader2 } from 'lucide-react';

interface SafeLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'page' | 'inline' | 'card';
}

export default function SafeLoading({
  message = "Loading exclusive content...",
  size = 'md',
  variant = 'inline'
}: SafeLoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <Crown className={`${sizeClasses[size]} text-amber-600 animate-pulse`} />
        <Loader2 className={`${sizeClasses[size]} absolute inset-0 animate-spin`} />
      </div>
      <p className="text-muted-foreground text-sm font-medium">{message}</p>
    </div>
  );

  if (variant === 'page') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingContent />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card>
        <CardContent className="p-8">
          <LoadingContent />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <LoadingContent />
    </div>
  );
}
