import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getWebSubscriptions } from '@/lib/notifications/subscribers';
import { logger } from '@/lib/logger';
import webpush from 'web-push';

// Guard web-push initialization to avoid build-time failures when keys are missing/invalid
let pushConfigured = false;
(() => {
  const subject = 'mailto:support@latest-os.com';
  const pub = process.env.VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  try {
    if (pub && priv) {
      webpush.setVapidDetails(subject, pub, priv);
      pushConfigured = true;
    }
  } catch (e) {
    // Leave pushConfigured as false and continue; server can still run without web push
  }
})();


const sendNotificationSchema = z.object({
  recipientId: z.string(),
  notification: z.object({
    title: z.string(),
    body: z.string().optional(),
    icon: z.string().optional(),
    badge: z.string().optional(),
    image: z.string().optional(),
    data: z.any().optional(),
    tag: z.string().optional(),
    requireInteraction: z.boolean().optional(),
    silent: z.boolean().optional(),
    actions: z.array(z.object({
      action: z.string(),
      title: z.string(),
      icon: z.string().optional(),
    })).optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    if (!pushConfigured) {
      return NextResponse.json(
        { error: 'Push not configured', details: 'VAPID keys not set on server' },
        { status: 503 }
      );
    }
    const body = await request.json();
    const { recipientId, notification } = sendNotificationSchema.parse(body);

    // Use in-memory web subscriptions for now
    const subscriptions = getWebSubscriptions();

    if (subscriptions.length === 0) {
      return NextResponse.json(
        { error: 'No active subscriptions found for user' },
        { status: 404 }
      );
    }

    const payload = JSON.stringify({
      title: notification.title,
      body: notification.body || '',
      icon: notification.icon || '/icons/icon-192x192.png',
      badge: notification.badge || '/icons/icon-72x72.png',
      image: notification.image,
      data: notification.data || {},
      tag: notification.tag,
      requireInteraction: notification.requireInteraction || false,
      silent: notification.silent || false,
      actions: notification.actions || [],
    });

    const results = await Promise.allSettled(
      subscriptions.map(async (sub: any) => {
        try {
          await webpush.sendNotification(
            sub,
            payload
          );
          return { success: true } as any;
        } catch (error) {
          logger.error({ 
            error, 
            endpoint: sub?.endpoint 
          }, 'Failed to send push notification');
          return { success: false, error } as any;
        }
      })
    );

    const successful = results.filter(result => 
      result.status === 'fulfilled' && result.value.success
    ).length;
    
    const failed = results.length - successful;

    logger.info({
      recipientId,
      totalSubscriptions: subscriptions.length,
      successful,
      failed,
      title: notification.title,
    }, 'Push notification batch completed');

    return NextResponse.json({
      success: true,
      message: 'Notifications sent',
      stats: {
        total: subscriptions.length,
        successful,
        failed,
      },
    });

  } catch (error) {
    logger.error({ error }, 'Failed to send push notifications');
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid notification data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
