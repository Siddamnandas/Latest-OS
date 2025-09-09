import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addWebSubscription } from '@/lib/notifications/subscribers';
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

    // Store subscription in in-memory registry for now
    addWebSubscription({
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
      userAgent: userAgent || null,
    });

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
