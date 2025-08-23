'use client';

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface PushSubscriptionState {
  subscription: PushSubscription | null;
  isSupported: boolean;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
}

interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: any;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export const useWebPush = () => {
  const [state, setState] = useState<PushSubscriptionState>({
    subscription: null,
    isSupported: false,
    isSubscribed: false,
    isLoading: true,
    error: null,
  });

  // VAPID public key - in production, this should come from environment variables
  const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_KEY || 
    'BMqSvZyb-p4-JPH8Eq7lYKdBs1W3cqjzQmkP_g2YlI8Tr7z2ZmRqZM9Xo8Gc3vPxLKkEe0Wd-L8nF7mP4O3FsT0';

  // Convert VAPID key to Uint8Array
  const urlBase64ToUint8Array = useCallback((base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }, []);

  // Check if push notifications are supported
  const checkSupport = useCallback(() => {
    const isSupported = 
      'serviceWorker' in navigator && 
      'PushManager' in window && 
      'Notification' in window;
    
    setState(prev => ({ ...prev, isSupported, isLoading: false }));
    return isSupported;
  }, []);

  // Get current subscription status
  const checkSubscription = useCallback(async () => {
    if (!checkSupport()) return null;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      setState(prev => ({
        ...prev,
        subscription,
        isSubscribed: !!subscription,
        isLoading: false,
      }));

      return subscription;
    } catch (error) {
      logger.error({ error }, 'Failed to check push subscription');
      setState(prev => ({
        ...prev,
        error: 'Failed to check subscription status',
        isLoading: false,
      }));
      return null;
    }
  }, [checkSupport]);

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    if (!state.isSupported) {
      throw new Error('Push notifications are not supported');
    }

    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userAgent: navigator.userAgent,
        }),
      });

      setState(prev => ({
        ...prev,
        subscription,
        isSubscribed: true,
        isLoading: false,
      }));

      logger.info('Push notification subscription successful');
      return subscription;
    } catch (error) {
      logger.error({ error }, 'Failed to subscribe to push notifications');
      setState(prev => ({
        ...prev,
        error: 'Failed to subscribe to notifications',
        isLoading: false,
      }));
      throw error;
    }
  }, [state.isSupported, urlBase64ToUint8Array, VAPID_PUBLIC_KEY]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    if (!state.subscription) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await state.subscription.unsubscribe();
      
      // Notify server about unsubscription
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: state.subscription.endpoint,
        }),
      });

      setState(prev => ({
        ...prev,
        subscription: null,
        isSubscribed: false,
        isLoading: false,
      }));

      logger.info('Push notification unsubscription successful');
    } catch (error) {
      logger.error({ error }, 'Failed to unsubscribe from push notifications');
      setState(prev => ({
        ...prev,
        error: 'Failed to unsubscribe from notifications',
        isLoading: false,
      }));
      throw error;
    }
  }, [state.subscription]);

  // Show local notification (for testing)
  const showLocalNotification = useCallback(async (options: NotificationOptions) => {
    if (!state.isSupported) {
      throw new Error('Notifications are not supported');
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon || '/icons/icon-192x192.png',
      badge: options.badge || '/icons/icon-72x72.png',
      image: options.image,
      data: options.data,
      tag: options.tag,
      requireInteraction: options.requireInteraction,
      silent: options.silent,
      actions: options.actions,
    });

    return notification;
  }, [state.isSupported]);

  // Send push notification via server
  const sendPushNotification = useCallback(async (
    recipientId: string, 
    notification: NotificationOptions
  ) => {
    try {
      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId,
          notification,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send push notification');
      }

      logger.info('Push notification sent successfully');
      return true;
    } catch (error) {
      logger.error({ error }, 'Failed to send push notification');
      throw error;
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    checkSupport();
    checkSubscription();
  }, [checkSupport, checkSubscription]);

  return {
    ...state,
    subscribe,
    unsubscribe,
    showLocalNotification,
    sendPushNotification,
    checkSubscription,
  };
};

export type { NotificationOptions, PushSubscriptionState };