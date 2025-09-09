import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getExpoPushTokens } from '@/lib/notifications/subscribers';

const schema = z.object({ token: z.string().min(10) });

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { token } = schema.parse(body);

    // In-memory tokens cannot be mutated per-user; treat as no-op
    const tokens = getExpoPushTokens();
    if (!tokens.includes(token)) {
      return NextResponse.json({ success: true, message: 'Token not registered' });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to unregister token' }, { status: 500 });
  }
}
