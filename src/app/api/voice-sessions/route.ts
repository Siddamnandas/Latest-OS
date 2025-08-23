import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

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
      include: {
        user: {
          select: { id: true, name: true, email: true, partner_role: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({ voiceSessions }, { status: 200 });

  } catch (error) {
    logger.error('Error fetching voice sessions:', error);
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
    const { coupleId, userId, transcript, commands, duration, sentiment, emotions, sessionData } = await request.json();

    if (!coupleId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const voiceSession = await db.voiceSession.create({
      data: {
        couple_id: coupleId,
        user_id: userId,
        transcript: transcript || null,
        commands: commands || [],
        duration: duration || 0,
        sentiment: sentiment || null,
        emotions: emotions || null,
        session_data: sessionData || null
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, partner_role: true }
        }
      }
    });

    return NextResponse.json({
      message: 'Voice session saved successfully',
      voiceSession
    }, { status: 201 });

  } catch (error) {
    logger.error('Error creating voice session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}