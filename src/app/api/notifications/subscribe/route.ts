import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { addWebSubscription, addExpoToken } from '@/lib/notifications/subscribers';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { subscription, token, platform } = await req.json();

  if (platform === 'web' && subscription) {
    addWebSubscription(subscription);
    return NextResponse.json({ success: true });
  }

  if (platform === 'expo' && token) {
    addExpoToken(token);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
}

// No other exports are allowed from a route module in Next.js 15
