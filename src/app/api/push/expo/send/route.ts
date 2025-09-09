import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getExpoPushTokens } from '@/lib/notifications/subscribers';

const schema = z.object({
  recipientId: z.string(),
  notification: z.object({
    title: z.string(),
    body: z.string().optional(),
    data: z.record(z.any()).optional(),
    sound: z.string().optional(),
    priority: z.enum(['default', 'normal', 'high']).optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { recipientId, notification } = schema.parse(body);

    const tokens = getExpoPushTokens();
    if (tokens.length === 0) {
      return NextResponse.json({ error: 'No Expo tokens for user' }, { status: 404 });
    }

    const messages = tokens
      .filter((t): t is string => !!t)
      .map((to) => ({
        to,
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        sound: notification.sound ?? 'default',
        priority: notification.priority ?? 'high',
      }));

    const resp = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const json = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return NextResponse.json({ error: 'Expo push failed', details: json }, { status: 502 });
    }

    return NextResponse.json({ success: true, results: json });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to send push' }, { status: 500 });
  }
}
