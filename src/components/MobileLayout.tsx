'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MobileNavigation } from './MobileNavigation';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { OfflineMode } from './OfflineMode';
import { usePullToRefresh } from '@/hooks/useMobileGestures';
import { useWebPush } from '@/hooks/use-web-push';
import { useIsMobile } from '@/hooks/use-mobile';
import { RefreshCw } from 'lucide-react';
import { logger } from '@/lib/logger';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showInstallPrompt?: boolean;
  enablePullToRefresh?: boolean;
  onRefresh?: () => Promise<void>;
  className?: string;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  title,
  showInstallPrompt = true,
  enablePullToRefresh = true,
  onRefresh,
  className = ''
}) => {
  const isMobile = useIsMobile();
  const [isOnline, setIsOnline] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showSearch, setShowSearch] = useState(false);

  // Push notification setup
  const { isSupported: isPushSupported, subscribe: subscribeToPush } = useWebPush();

  // Pull to refresh setup
  const { 
    isPulling, 
    isRefreshing, 
    pullDistance, 
    bindGestures: bindPullGestures,
    maxDistance 
  } = usePullToRefresh(
    onRefresh || (async () => {
      // Default refresh action
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.location.reload();
    })
  );

  // Monitor online status
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Set up pull to refresh
  useEffect(() => {
    if (enablePullToRefresh && isMobile) {
      bindPullGestures(document.body);
    }
  }, [enablePullToRefresh, isMobile, bindPullGestures]);

  // Auto-subscribe to push notifications
  useEffect(() => {
    const setupPushNotifications = async () => {
      if (isPushSupported && 'Notification' in window) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            await subscribeToPush();
            console.info('Push notifications enabled');
          }
        } catch (error) {
          console.error('Failed to setup push notifications', { error });
        }
      }
    };

    // Delay to avoid overwhelming the user
    setTimeout(setupPushNotifications, 5000);
  }, [isPushSupported, subscribeToPush]);

  // Handle search toggle
  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
  };

  // Calculate pull to refresh progress
  const refreshProgress = pullDistance / maxDistance;
  const refreshOpacity = Math.min(refreshProgress, 1);

  // Manage focus for search input without using autoFocus
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (showSearch) {
      // Slight delay to ensure element is mounted
      const id = requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
      return () => cancelAnimationFrame(id);
    }
  }, [showSearch]);

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Pull to refresh indicator */}
      {isPulling && enablePullToRefresh && (
        <div 
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-blue-500 text-white transition-all duration-200"
          style={{ 
            height: Math.min(pullDistance, maxDistance),
            opacity: refreshOpacity
          }}
        >
          <RefreshCw 
            className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
            style={{ 
              transform: `rotate(${refreshProgress * 360}deg)` 
            }}
          />
          <span className="ml-2 text-sm font-medium">
            {isRefreshing ? 'Refreshing...' : 
             refreshProgress >= 1 ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      )}

      {/* Mobile Navigation */}
      <MobileNavigation
        isOnline={isOnline}
        notificationCount={notificationCount}
        onSearch={handleSearchToggle}
      />

      {/* Main Content Area */}
      <main className={`flex-1 ${isMobile ? 'pb-16' : 'lg:ml-64'}`}>
        {/* Page Header */}
        {title && (
          <div className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>
        )}

        {/* Offline Banner */}
        {!isOnline && (
          <div className="bg-orange-100 border-b border-orange-200 px-4 py-2">
            <OfflineMode 
              currentUserId="anonymous"
              onRefreshCwNow={() => {}}
              onClearOfflineData={() => {}}
              onSettingsUpdate={() => {}}
            />
          </div>
        )}

        {/* Content */}
        <div className={`${title ? 'pt-0' : 'pt-4'} ${
          isMobile ? 'px-4 pb-20' : 'lg:px-6 lg:pb-6'
        }`}>
          {children}
        </div>
      </main>

      {/* PWA Install Prompt */}
      {showInstallPrompt && (
        <PWAInstallPrompt
          onInstall={() => {
            console.info('PWA installed from layout');
            setNotificationCount(prev => prev + 1);
          }}
          onDismiss={() => {
            console.info('PWA install prompt dismissed');
          }}
        />
      )}

      {/* Search Overlay */}
      {showSearch && (
        <div
          className="fixed inset-0 bg-gray-700 bg-opacity-50 z-50 flex items-start justify-center pt-20"
          onClick={() => setShowSearch(false)}
        >
          <div className="bg-white rounded-lg w-full max-w-md mx-4 p-4">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="text"
                placeholder="Search memories, tasks, conversations..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                ref={searchInputRef}
              />
            </div>
            <div className="text-sm text-gray-500">
              Search functionality coming soon...
            </div>
          </div>
        </div>
      )}

      {/* Mobile-specific styles */}
      <style jsx global>{`
        @media (max-width: 768px) {
          body {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }
          
          /* Prevent zoom on input focus */
          input, select, textarea {
            font-size: 16px !important;
          }
          
          /* Smooth scrolling for mobile */
          html {
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
          }
          
          /* Safe area handling for iOS */
          .safe-area-top {
            padding-top: env(safe-area-inset-top);
          }
          
          .safe-area-bottom {
            padding-bottom: env(safe-area-inset-bottom);
          }
          
          /* Hide scrollbars on mobile */
          ::-webkit-scrollbar {
            display: none;
          }
          
          /* Enhanced touch targets */
          button, a, [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }
        }
        
        /* PWA specific styles */
        @media (display-mode: standalone) {
          .pwa-only {
            display: block !important;
          }
          
          .browser-only {
            display: none !important;
          }
        }
        
        /* Loading states */
        .loading-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};
