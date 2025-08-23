import { NextRequest, NextResponse } from 'next/server';
import { emailQueue } from '@/queues/email';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    await emailQueue.add('send', data);
    return NextResponse.json({ status: 'queued' });
  } catch (err) {
    logger.error('Failed to schedule job', err);
    return NextResponse.json({ error: 'Failed to schedule job' }, { status: 500 });
  }
}