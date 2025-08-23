import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import webpush from 'web-push';

// Configure web-push
webpush.setVapidDetails(
  'mailto:support@latest-os.com',
  process.env.VAPID_PUBLIC_KEY || 'BMqSvZyb-p4-JPH8Eq7lYKdBs1W3cqjzQmkP_g2YlI8Tr7z2ZmRqZM9Xo8Gc3vPxLKkEe0Wd-L8nF7mP4O3FsT0',
  process.env.VAPID_PRIVATE_KEY || 'demo-private-key'
);

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

    // Get the couple and find the other partner
    const couple = await db.couple.findUnique({
      where: { id: coupleId },
      include: {
        users: {
          include: {
            push_subscriptions: {
              where: { isActive: true }
            }
          }
        }
      }
    });

    if (!couple) {
      return NextResponse.json(
        { error: 'Couple not found' },
        { status: 404 }
      );
    }

    // Find the other partner (not the one who performed the activity)
    const otherPartner = couple.users.find(user => user.id !== partnerId);
    
    if (!otherPartner || otherPartner.push_subscriptions.length === 0) {
      logger.info({
        coupleId,
        partnerId,
        activity,
      }, 'No partner or push subscriptions found for activity notification');
      
      return NextResponse.json({
        success: true,
        message: 'No subscriptions to notify',
        stats: { sent: 0, failed: 0 }
      });
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
      otherPartner.push_subscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.p256dhKey,
                auth: subscription.authKey,
              },
            },
            payload
          );
          return { success: true, subscriptionId: subscription.id };
        } catch (error) {
          logger.error({ 
            error, 
            subscriptionId: subscription.id, 
            endpoint: subscription.endpoint 
          }, 'Failed to send partner activity notification');
          
          // If subscription is invalid, mark it as inactive
          if (error.statusCode === 410 || error.statusCode === 404) {
            await db.pushSubscription.update({
              where: { id: subscription.id },
              data: { isActive: false },
            });
          }
          
          return { success: false, subscriptionId: subscription.id, error };
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
      otherPartnerId: otherPartner.id,
      activity,
      title: notification.title,
      totalSubscriptions: otherPartner.push_subscriptions.length,
      successful,
      failed,
    }, 'Partner activity notification completed');

    return NextResponse.json({
      success: true,
      message: 'Partner activity notification sent',
      stats: {
        sent: successful,
        failed,
        total: otherPartner.push_subscriptions.length,
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