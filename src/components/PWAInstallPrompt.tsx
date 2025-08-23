'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Chrome, Safari, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { logger } from '@/lib/logger';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallPromptProps {
  appName?: string;
  appDescription?: string;
  onInstall?: () => void;
  onDismiss?: () => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  appName = 'Latest-OS',
  appDescription = 'Your relationship coaching companion',
  onInstall,
  onDismiss
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [browserType, setBrowserType] = useState<'chrome' | 'safari' | 'firefox' | 'other'>('other');
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    // Check if app is already installed/running as PWA
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                              (window.navigator as any).standalone ||
                              document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
    };

    // Detect browser and device type
    const detectEnvironment = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      
      // Detect browser
      if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
        setBrowserType('chrome');
      } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
        setBrowserType('safari');
      } else if (userAgent.includes('firefox')) {
        setBrowserType('firefox');
      } else {
        setBrowserType('other');
      }
      
      // Detect device
      if (/iphone|ipad|ipod/.test(userAgent)) {
        setDeviceType('ios');
      } else if (/android/.test(userAgent)) {
        setDeviceType('android');
      } else {
        setDeviceType('desktop');
      }
    };

    checkStandalone();
    detectEnvironment();

    // Check if prompt was previously dismissed
    const dismissedDate = localStorage.getItem('pwa-install-dismissed');
    const now = new Date().getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (dismissedDate && (now - parseInt(dismissedDate)) < oneDayMs) {
      return; // Don't show prompt if dismissed within 24 hours
    }

    // Listen for beforeinstallprompt event (Chrome/Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const beforeInstallEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(beforeInstallEvent);
      
      // Show prompt after a delay if not standalone
      if (!isStandalone) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
      
      logger.info('PWA install prompt available');
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      logger.info('PWA was installed');
      setDeferredPrompt(null);
      setShowPrompt(false);
      onInstall?.();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For iOS Safari, show manual instructions after delay
    if (deviceType === 'ios' && browserType === 'safari' && !isStandalone) {
      setTimeout(() => setShowPrompt(true), 5000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isStandalone, deviceType, browserType, onInstall]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    setIsInstalling(true);
    
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        logger.info('User accepted PWA install prompt');
        setShowPrompt(false);
        onInstall?.();
      } else {
        logger.info('User dismissed PWA install prompt');
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      logger.error({ error }, 'Failed to show PWA install prompt');
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', new Date().getTime().toString());
    onDismiss?.();
    logger.info('PWA install prompt dismissed');
  };

  const getInstallInstructions = () => {
    if (deviceType === 'ios' && browserType === 'safari') {
      return {
        icon: <Safari className="w-6 h-6" />,
        title: 'Install on iPhone/iPad',
        steps: [
          'Tap the Share button at the bottom',
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" to install the app'
        ]
      };
    } else if (deviceType === 'android' && browserType === 'chrome') {
      return {
        icon: <Chrome className="w-6 h-6" />,
        title: 'Install on Android',
        steps: [
          'Tap the menu (⋮) at the top right',
          'Select "Add to Home screen"',
          'Tap "Add" to install the app'
        ]
      };
    } else {
      return {
        icon: <Download className="w-6 h-6" />,
        title: 'Install App',
        steps: [
          'Look for install prompt in address bar',
          'Click install when available',
          'Enjoy the app experience!'
        ]
      };
    }
  };

  if (isStandalone || !showPrompt) {
    return null;
  }

  const instructions = getInstallInstructions();

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="shadow-lg border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg text-purple-800">Install {appName}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleDismiss}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-purple-700 mb-2">
              {appDescription}
            </p>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                📱 Works offline
              </Badge>
              <Badge variant="secondary" className="text-xs">
                🔔 Push notifications
              </Badge>
              <Badge variant="secondary" className="text-xs">
                ⚡ Fast loading
              </Badge>
            </div>
          </div>

          {deferredPrompt ? (
            <Button
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isInstalling ? (
                <>
                  <Download className="w-4 h-4 mr-2 animate-pulse" />
                  Installing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Install App
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-purple-800">
                {instructions.icon}
                {instructions.title}
              </div>
              <ol className="space-y-1">
                {instructions.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-purple-700">
                    <span className="bg-purple-200 text-purple-800 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              
              {deviceType === 'ios' && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                  <Plus className="w-4 h-4" />
                  <span>Look for the "Add to Home Screen" option in Safari</span>
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-gray-500 text-center">
            Installing gives you a native app experience with offline access and notifications.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};