import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { getWebSubscriptions, getExpoPushTokens } from '../subscribe/route';

const WEB_PUSH_CONTACT = process.env.WEB_PUSH_CONTACT || 'mailto:example@example.com';
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    WEB_PUSH_CONTACT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { title, body, url } = await req.json();
  const payload = JSON.stringify({ title, body, url });

  const webSubs = getWebSubscriptions();
  const expoTokens = getExpoPushTokens();

  const webPromises = webSubs.map((sub) =>
    webpush.sendNotification(sub, payload).catch((err) => {
      console.error('Web push error:', err);
    })
  );

  const expoMessages = expoTokens.map((token) => ({
    to: token,
    sound: 'default',
    title,
    body,
    data: { url },
  }));

  const expoPromise = expoMessages.length
    ? fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expoMessages),
      }).catch((err) => console.error('Expo push error:', err))
    : Promise.resolve();

  await Promise.all([...webPromises, expoPromise]);

  return NextResponse.json({ success: true });
}

