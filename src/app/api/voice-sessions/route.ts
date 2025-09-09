import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const coupleId = searchParams.get('coupleId');
    const userId = searchParams.get('userId');

    if (!coupleId) {
      return NextResponse.json(
        { error: 'Couple ID is required' },
        { status: 400 }
      );
    }

    const voiceSessions = await db.voiceSession.findMany({
      where: { couple_id: coupleId },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({ voiceSessions }, { status: 200 });

  } catch (error) {
    console.error('Error fetching voice sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { coupleId, userId, transcript, duration } = await request.json();

    if (!coupleId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const voiceSession = await db.voiceSession.create({
      data: {
        couple_id: coupleId,
        title: transcript ? String(transcript).slice(0, 50) : 'Voice Session',
        duration: Number(duration || 0),
      },
    });

    return NextResponse.json({
      message: 'Voice session saved successfully',
      voiceSession
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating voice session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
