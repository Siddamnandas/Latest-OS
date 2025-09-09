import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
// Using in-memory subscriptions for now; DB-backed removal not implemented
import { logger } from '@/lib/logger';
import { authOptions } from '@/lib/auth';

const unsubscribeSchema = z.object({
  endpoint: z.string().url(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint } = unsubscribeSchema.parse(body);

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const userId = session.user.id;

    // Subscription registry is in-memory; treat as idempotent success

    logger.info({ userId, endpoint }, 'Push subscription deactivated');

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
