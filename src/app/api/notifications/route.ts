import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coupleId = searchParams.get('coupleId');
    const userId = searchParams.get('userId');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!coupleId) {
      return NextResponse.json(
        { error: 'Couple ID is required' },
        { status: 400 }
      );
    }

    const where: any = { couple_id: coupleId };
    if (userId) {
      where.user_id = userId;
    }
    if (unreadOnly) {
      where.is_read = false;
    }

    const notifications = await db.notification.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, partner_role: true }
        }
      },
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
  try {
    const { coupleId, userId, type, title, message, data } = await request.json();

    if (!coupleId || !type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const notification = await db.notification.create({
      data: {
        couple_id: coupleId,
        user_id: userId || null,
        type,
        title,
        message,
        data: data || null,
        is_delivered: false
      }
    });

    return NextResponse.json({
      message: 'Notification created successfully',
      notification
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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
        updateData = { is_read: true };
        break;
      case 'mark_delivered':
        updateData = { is_delivered: true, delivered_at: new Date() };
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