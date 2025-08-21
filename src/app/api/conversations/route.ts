import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
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

    const conversations = await db.conversation.findMany({
      where: { couple_id: coupleId },
      include: {
        user: {
          select: { id: true, name: true, email: true, partner_role: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({ conversations }, { status: 200 });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { coupleId, userId, title, messages, sessionSummary, duration, sentiment, topics, insights } = await request.json();

    if (!coupleId || !userId || !messages) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const conversation = await db.conversation.create({
      data: {
        couple_id: coupleId,
        user_id: userId,
        title,
        messages,
        session_summary: sessionSummary || null,
        duration: duration || 0,
        sentiment: sentiment || null,
        topics: topics || null,
        insights: insights || null
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, partner_role: true }
        }
      }
    });

    return NextResponse.json({
      message: 'Conversation saved successfully',
      conversation
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}