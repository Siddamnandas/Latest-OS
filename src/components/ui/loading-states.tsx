import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, RefreshCw } from 'lucide-react';

// Basic loading spinner
export function LoadingSpinner({ size = 'default', className = '' }: { 
  size?: 'sm' | 'default' | 'lg'; 
  className?: string; 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
}

// Full page loading screen
export function PageLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 mx-auto">
            <LoadingSpinner size="lg" className="w-full h-full text-purple-600" />
          </div>
          <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-purple-200 dark:border-purple-800 rounded-full animate-pulse" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {message}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we prepare your experience...
        </p>
      </div>
    </div>
  );
}

// Section loading component
export function SectionLoading({ 
  title = 'Loading...', 
  description,
  className = '' 
}: { 
  title?: string; 
  description?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <LoadingSpinner size="lg" className="text-purple-600 mb-4" />
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
          {description}
        </p>
      )}
    </div>
  );
}

// Inline loading component
export function InlineLoading({ 
  text = 'Loading...', 
  size = 'default' 
}: { 
  text?: string; 
  size?: 'sm' | 'default' | 'lg';
}) {
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size={size} className="text-purple-600" />
      <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
    </div>
  );
}

// Button loading state
export function ButtonLoading({ 
  children, 
  loading = false, 
  loadingText = 'Loading...',
  ...props 
}: { 
  children: React.ReactNode; 
  loading?: boolean; 
  loadingText?: string;
  [key: string]: any;
}) {
  return (
    <button disabled={loading} {...props}>
      {loading ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          {loadingText}
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// Kids Activities specific loading skeletons
export function ActivitiesGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-9 w-full rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Progress dashboard skeleton
export function ProgressDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 w-20" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress section */}
      <Card className="p-6">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-2 w-full rounded" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center space-y-2">
                  <Skeleton className="h-8 w-8 rounded-full mx-auto" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                  <Skeleton className="h-6 w-12 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Profile skeleton
export function ProfileSkeleton() {
  return (
    <Card className="p-6">
      <CardHeader className="text-center">
        <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
        <Skeleton className="h-6 w-32 mx-auto" />
        <Skeleton className="h-4 w-24 mx-auto" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-10 w-full rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

// Generic list skeleton
export function ListSkeleton({ count = 5, showAvatar = false }: { count?: number; showAvatar?: boolean }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
          {showAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-8 w-16 rounded" />
        </div>
      ))}
    </div>
  );
}

// Tab content skeleton
export function TabContentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex space-x-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-24" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-8 w-24" />
          </Card>
        ))}
      </div>
    </div>
  );
}

// Loading overlay for existing content
export function LoadingOverlay({ 
  show, 
  message = 'Loading...', 
  children 
}: { 
  show: boolean; 
  message?: string; 
  children: React.ReactNode; 
}) {
  return (
    <div className="relative">
      {children}
      {show && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <LoadingSpinner size="lg" className="text-purple-600 mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Retry loading component for failed states
export function RetryLoading({ 
  onRetry, 
  error, 
  loading = false 
}: { 
  onRetry: () => void; 
  error?: string; 
  loading?: boolean;
}) {
  return (
    <div className="text-center py-8">
      <div className="mb-4">
        <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          Failed to Load
        </h3>
        {error && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{error}</p>
        )}
      </div>
      <button
        onClick={onRetry}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <RefreshCw className="w-4 h-4" />
        )}
        Try Again
      </button>
    </div>
  );
}

// Enhanced Skeleton component (if not available)
function SkeletonComponent({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

// Export Skeleton if not already available
export { SkeletonComponent as Skeleton };