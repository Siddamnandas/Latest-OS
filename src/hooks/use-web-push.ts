import { useEffect, useState, useCallback } from 'react';
import { useToast } from './use-toast';

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  data?: any;
}

interface UseWebPushReturn {
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  sendTestNotification: () => void;
}

export function useWebPush(enabled = true): UseWebPushReturn {
  const { toast } = useToast();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Initialize web push support
  useEffect(() => {
    const setupWebPush = async () => {
      // Check if push is supported
      const supported = 'serviceWorker' in navigator &&
                       'PushManager' in window &&
                       'Notification' in window;

      setIsSupported(supported);

      if (!supported || !enabled) return;

      // Get notification permission
      setPermission(Notification.permission);

      // Register service worker if not already registered
      try {
        const swReg = await navigator.serviceWorker.register('/service-worker.js');
        setRegistration(swReg);

        // Check if already subscribed
        const subscription = await swReg.pushManager.getSubscription();
        setIsSubscribed(!!subscription);

      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    };

    setupWebPush();

    // Listen for notification button clicks from service worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NOTIFICATION_CLICK') {
        // Handle notification click - could navigate to specific section
        console.log('Notification clicked:', event.data.data);
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleMessage);
    };
  }, [enabled]);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported || !registration) {
      toast({
        title: "Not Supported",
        description: "Web push notifications are not supported in this browser",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Request permission if not already granted
      let permissionStatus = Notification.permission;

      if (permissionStatus === 'default') {
        permissionStatus = await Notification.requestPermission();
        setPermission(permissionStatus);
      }

      if (permissionStatus !== 'granted') {
        toast({
          title: "Permission Denied",
          description: "You need to grant notification permissions to receive updates",
          variant: "destructive",
        });
        return false;
      }

      // Get VAPID keys (in production, these should come from your backend)
      // For demo, we'll use placeholder keys
      const vapidKeys = {
        subject: 'mailto:contact@latest-os.com',
        publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BP3qA1s6GdBzK2nJF0mGj',
        privateKey: process.env.VAPID_PRIVATE_KEY || 'demo-private-key',
      };

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKeys.publicKey,
      });

      // Send subscription to backend (in a real app)
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription }),
      });

      if (!response.ok) {
        // Still consider it successful locally even if backend fails
        console.warn('Failed to send subscription to backend');
      }

      setIsSubscribed(true);

      toast({
        title: "Notifications Enabled! 🔔",
        description: "You'll now receive relationship reminders and updates",
        duration: 5000,
      });

      return true;

    } catch (error) {
      console.error('Push subscription failed:', error);
      toast({
        title: "Subscription Failed",
        description: error instanceof Error ? error.message : "Failed to enable notifications",
        variant: "destructive",
      });
      return false;
    }
  }, [isSupported, registration, toast, permission]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!registration) return false;

    try {
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Unsubscribe locally
        await subscription.unsubscribe();

        // Notify backend (in a real app)
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        }).catch(() => {}); // Ignore backend errors
      }

      setIsSubscribed(false);

      toast({
        title: "Notifications Disabled",
        description: "You'll no longer receive relationship notifications",
      });

      return true;

    } catch (error) {
      console.error('Push unsubscription failed:', error);
      toast({
        title: "Unsubscribe Failed",
        description: "Failed to disable notifications",
        variant: "destructive",
      });
      return false;
    }
  }, [registration, toast]);

  const sendTestNotification = useCallback(() => {
    if (!isSupported || permission !== 'granted') {
      toast({
        title: "Permissions Required",
        description: "Please enable notifications first",
        variant: "destructive",
      });
      return;
    }

    if (!('Notification' in window) || !Notification) {
      toast({
        title: "Not Supported",
        description: "This browser doesn't support notifications",
        variant: "destructive",
      });
      return;
    }

    // Create a test notification
    const notification = new Notification('🔔 Latest-OS Test', {
      body: 'Your relationship notifications are working perfectly!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge.png',
      tag: 'test-notification',
      requireInteraction: false,
      data: { type: 'test' },
    });

    // Auto-close after 5 seconds
    setTimeout(() => notification.close(), 5000);

    toast({
      title: "Test Notification Sent!",
      description: "Check your browser's notification area",
    });
  }, [isSupported, permission, toast]);

  return {
    isSupported,
    isSubscribed,
    permission,
    subscribe,
    unsubscribe,
    sendTestNotification,
  };
}
