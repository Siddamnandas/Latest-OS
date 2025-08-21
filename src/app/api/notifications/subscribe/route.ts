import { registry } from "@/lib/openapi";
registry.registerPath({ method: "post", path: "/api/notifications/subscribe", responses: { 200: { description: "Success" } } });

import { NextRequest, NextResponse } from 'next/server';

// In-memory stores for demonstration purposes. In production these would
// be persisted in a database.
const webSubscriptions: any[] = [];
const expoPushTokens: string[] = [];

export async function POST(req: NextRequest) {
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

