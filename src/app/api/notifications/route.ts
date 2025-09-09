import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { addNotificationJob } from '@/queues/notifications';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const coupleId = searchParams.get('coupleId');
    const userId = searchParams.get('userId');
    const userGroup = searchParams.get('group');
    const locale = searchParams.get('locale');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!coupleId) {
      return NextResponse.json(
        { error: 'Couple ID is required' },
        { status: 400 }
      );
    }

    const where: any = { couple_id: coupleId };
    if (unreadOnly) {
      where.read = false;
    }

    const notifications = await db.notification.findMany({
      where,
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({ notifications }, { status: 200 });

  } catch (error) {
    console.error('Error fetching notifications:', error);
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
    const { coupleId, title, message } = await request.json();

    if (!coupleId || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const notification = await db.notification.create({
      data: {
        couple_id: coupleId,
        title,
        message,
        read: false,
      }
    });

    return NextResponse.json(
      {
        message: 'Notification(s) created successfully',
        notification
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');
    const { action } = await request.json();

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    let updateData = {};
    switch (action) {
      case 'mark_read':
        updateData = { read: true } as any;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    const notification = await db.notification.update({
      where: { id: notificationId },
      data: updateData
    });

    return NextResponse.json({
      message: 'Notification updated successfully',
      notification
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
