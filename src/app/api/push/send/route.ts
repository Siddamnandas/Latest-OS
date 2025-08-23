import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import webpush from 'web-push';

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  'mailto:support@latest-os.com',
  process.env.VAPID_PUBLIC_KEY || 'BMqSvZyb-p4-JPH8Eq7lYKdBs1W3cqjzQmkP_g2YlI8Tr7z2ZmRqZM9Xo8Gc3vPxLKkEe0Wd-L8nF7mP4O3FsT0',
  process.env.VAPID_PRIVATE_KEY || 'demo-private-key'
);

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
    const body = await request.json();
    const { recipientId, notification } = sendNotificationSchema.parse(body);

    // Get all active push subscriptions for the recipient
    const subscriptions = await db.pushSubscription.findMany({
      where: {
        userId: recipientId,
        isActive: true,
      },
    });

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
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dhKey,
                auth: sub.authKey,
              },
            },
            payload
          );
          return { success: true, subscriptionId: sub.id };
        } catch (error) {
          logger.error({ 
            error, 
            subscriptionId: sub.id, 
            endpoint: sub.endpoint 
          }, 'Failed to send push notification');
          
          // If subscription is invalid, mark it as inactive
          if (error.statusCode === 410 || error.statusCode === 404) {
            await db.pushSubscription.update({
              where: { id: sub.id },
              data: { isActive: false },
            });
          }
          
          return { success: false, subscriptionId: sub.id, error };
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