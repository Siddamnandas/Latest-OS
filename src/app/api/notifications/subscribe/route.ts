import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// In-memory stores for demonstration purposes. In production these would
// be persisted in a database.
const webSubscriptions: any[] = [];
const expoPushTokens: string[] = [];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { subscription, token, platform } = await req.json();

  if (platform === 'web' && subscription) {
    webSubscriptions.push(subscription);
    return NextResponse.json({ success: true });
  }

  if (platform === 'expo' && token) {
    expoPushTokens.push(token);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
}

export function getWebSubscriptions() {
  return webSubscriptions;
}

export function getExpoPushTokens() {
  return expoPushTokens;
}

