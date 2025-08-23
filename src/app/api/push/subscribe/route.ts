import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { authOptions } from '@/lib/auth';

const subscriptionSchema = z.object({
  subscription: z.object({
    endpoint: z.string().url(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string(),
    }),
  }),
  userAgent: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscription, userAgent } = subscriptionSchema.parse(body);

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const userId = session.user.id;

    // Store or update push subscription
    const existingSubscription = await db.pushSubscription.findFirst({
      where: {
        userId: userId,
        endpoint: subscription.endpoint,
      },
    });

    if (existingSubscription) {
      // Update existing subscription
      await db.pushSubscription.update({
        where: { id: existingSubscription.id },
        data: {
          p256dhKey: subscription.keys.p256dh,
          authKey: subscription.keys.auth,
          userAgent: userAgent || null,
          isActive: true,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new subscription
      await db.pushSubscription.create({
        data: {
          userId: userId,
          endpoint: subscription.endpoint,
          p256dhKey: subscription.keys.p256dh,
          authKey: subscription.keys.auth,
          userAgent: userAgent || null,
          isActive: true,
        },
      });
    }

    logger.info(
      {
        userId: userId,
        endpoint: subscription.endpoint,
      },
      'Push subscription created/updated'
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription saved successfully' 
    });

  } catch (error) {
    logger.error({ error }, 'Failed to process push subscription');
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid subscription data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to save subscription' },
      { status: 500 }
    );
  }
}
