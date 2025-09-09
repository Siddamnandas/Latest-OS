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

    const conversations = await db.conversation.findMany({
      where: { couple_id: coupleId },
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
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { coupleId, title, messages } = await request.json();

    if (!coupleId || !messages) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const conversation = await db.conversation.create({
      data: {
        couple_id: coupleId,
        title,
        content: typeof messages === 'string' ? messages : JSON.stringify(messages),
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
