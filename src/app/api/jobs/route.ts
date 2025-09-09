import { NextRequest, NextResponse } from 'next/server';
import { addEmailJob } from '@/queues/email';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    await addEmailJob(data);
    return NextResponse.json({ status: 'queued' });
  } catch (err) {
    console.error('Failed to schedule job', err);
    return NextResponse.json({ error: 'Failed to schedule job' }, { status: 500 });
  }
}
