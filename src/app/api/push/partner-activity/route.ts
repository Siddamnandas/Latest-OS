import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getWebSubscriptions } from '@/lib/notifications/subscribers';
import { logger } from '@/lib/logger';
import webpush from 'web-push';

// Configure web-push guarded (avoid build-time failures)
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
    // leave disabled
  }
})();

const partnerActivitySchema = z.object({
  coupleId: z.string(),
  partnerId: z.string(),
  partnerName: z.string(),
  activity: z.enum([
    'task_completed',
    'sync_completed',
    'memory_added',
    'goal_updated',
    'message_sent',
    'login',
    'ritual_completed',
    'achievement_earned'
  ]),
  data: z.any().optional(),
});

// Activity-specific notification templates
const getNotificationTemplate = (activity: string, partnerName: string, data: any = {}) => {
  const templates = {
    task_completed: {
      title: `${partnerName} completed a task! 🎉`,
      body: `"${data.taskTitle || 'A task'}" has been completed`,
      icon: '/icons/shortcut-tasks.png',
      data: { url: '/tasks', activity: 'task_completed' },
      actions: [
        { action: 'view_tasks', title: 'View Tasks', icon: '/icons/shortcut-tasks.png' },
        { action: 'celebrate', title: 'Celebrate! 🎉' }
      ]
    },
    sync_completed: {
      title: `${partnerName} completed daily sync 💫`,
      body: `Mood: ${data.mood || 'Good'}, Energy: ${data.energy || 'High'}`,
      icon: '/icons/shortcut-sync.png',
      data: { url: '/sync', activity: 'sync_completed' },
      actions: [
        { action: 'view_sync', title: 'View Sync', icon: '/icons/shortcut-sync.png' },
        { action: 'complete_sync', title: 'Complete Yours' }
      ]
    },
    memory_added: {
      title: `${partnerName} added a new memory 📸`,
      body: `"${data.memoryTitle || 'A special moment'}" has been saved`,
      icon: '/icons/shortcut-memories.png',
      data: { url: '/memories', activity: 'memory_added' },
      actions: [
        { action: 'view_memories', title: 'View Memories', icon: '/icons/shortcut-memories.png' },
        { action: 'add_memory', title: 'Add Your Own' }
      ]
    },
    goal_updated: {
      title: `${partnerName} updated a shared goal 🎯`,
      body: `Progress on "${data.goalTitle || 'your goal'}" has been updated`,
      icon: '/icons/icon-192x192.png',
      data: { url: '/goals', activity: 'goal_updated' }
    },
    message_sent: {
      title: `💌 Message from ${partnerName}`,
      body: data.message || 'Sent you a message',
      icon: '/icons/icon-192x192.png',
      data: { url: '/messages', activity: 'message_sent' },
      requireInteraction: true
    },
    login: {
      title: `${partnerName} is online 💚`,
      body: 'Your partner just logged in',
      icon: '/icons/icon-192x192.png',
      data: { url: '/', activity: 'login' },
      silent: true
    },
    ritual_completed: {
      title: `${partnerName} completed a ritual 🕉️`,
      body: `Finished a ${data.ritualType || 'connection'} ritual`,
      icon: '/icons/icon-192x192.png',
      data: { url: '/rituals', activity: 'ritual_completed' }
    },
    achievement_earned: {
      title: `${partnerName} earned an achievement! 🏆`,
      body: `"${data.achievementTitle || 'New milestone'}" unlocked`,
      icon: '/icons/icon-192x192.png',
      data: { url: '/achievements', activity: 'achievement_earned' },
      requireInteraction: true,
      actions: [
        { action: 'celebrate', title: 'Celebrate! 🎉' },
        { action: 'view_achievements', title: 'View All' }
      ]
    }
  };

  return templates[activity] || {
    title: `Activity from ${partnerName}`,
    body: `${partnerName} performed an activity`,
    icon: '/icons/icon-192x192.png',
    data: { url: '/', activity }
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { coupleId, partnerId, partnerName, activity, data } = partnerActivitySchema.parse(body);

    // Use in-memory web subscriptions (DB-backed lookup TBD)
    const webSubs = getWebSubscriptions();
    if (webSubs.length === 0) {
      logger.info({ coupleId, partnerId, activity }, 'No web subscriptions found');
      return NextResponse.json({ success: true, message: 'No subscriptions to notify', stats: { sent: 0, failed: 0 } });
    }

    // Get notification template
    const notification = getNotificationTemplate(activity, partnerName, data);

    // Prepare payload
    const payload = JSON.stringify({
      title: notification.title,
      body: notification.body,
      icon: notification.icon,
      badge: '/icons/icon-72x72.png',
      data: notification.data,
      tag: `partner_activity_${activity}`,
      requireInteraction: notification.requireInteraction || false,
      silent: notification.silent || false,
      actions: notification.actions || [],
    });

    // Send notifications to all partner's devices
    const results = await Promise.allSettled(
      webSubs.map(async (subscription: any) => {
        try {
          await webpush.sendNotification(
            subscription,
            payload
          );
          return { success: true } as any;
        } catch (error) {
          logger.error({ 
            error, 
            endpoint: subscription?.endpoint 
          }, 'Failed to send partner activity notification');
          
          return { success: false, error } as any;
        }
      })
    );

    const successful = results.filter(result => 
      result.status === 'fulfilled' && result.value.success
    ).length;
    
    const failed = results.length - successful;

    // Store notification in database for history
    await db.notification.create({
      data: {
        couple_id: coupleId,
        title: notification.title,
        message: notification.body,
        read: false,
      },
    });

    logger.info({
      coupleId,
      partnerId,
      otherPartnerId: 'unknown',
      activity,
      title: notification.title,
      totalSubscriptions: webSubs.length,
      successful,
      failed,
    }, 'Partner activity notification completed');

    return NextResponse.json({
      success: true,
      message: 'Partner activity notification sent',
      stats: {
        sent: successful,
        failed,
        total: webSubs.length,
      },
    });

  } catch (error) {
    logger.error({ error }, 'Failed to send partner activity notification');
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid activity data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send partner activity notification' },
      { status: 500 }
    );
  }
}
