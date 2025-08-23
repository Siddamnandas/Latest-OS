import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

const unsubscribeSchema = z.object({
  endpoint: z.string().url(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint } = unsubscribeSchema.parse(body);

    // For now, we'll use a demo user ID since auth is bypassed in development
    // In production, get user ID from session
    const userId = 'demo-user-1'; // TODO: Get from authenticated session

    // Find and deactivate the subscription
    const subscription = await db.pushSubscription.findFirst({
      where: {
        userId: userId,
        endpoint: endpoint,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Mark subscription as inactive instead of deleting
    await db.pushSubscription.update({
      where: { id: subscription.id },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });

    logger.info({
      userId: userId,
      endpoint: endpoint,
      subscriptionId: subscription.id,
    }, 'Push subscription deactivated');

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully unsubscribed' 
    });

  } catch (error) {
    logger.error({ error }, 'Failed to process unsubscription');
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}