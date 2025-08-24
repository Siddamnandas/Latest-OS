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
    if (userId) {
      where.user_id = userId;
    }
    if (unreadOnly) {
      where.is_read = false;
    }
    if (userGroup || locale) {
      where.user = {};
      if (userGroup) {
        // @ts-ignore - dynamic field for segmentation
        where.user.group = userGroup;
      }
      if (locale) {
        // @ts-ignore - dynamic field for segmentation
        where.user.locale = locale;
      }
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
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const {
      coupleId,
      userId,
      type,
      title,
      message,
      data,
      userGroup,
      locale,
      sendAt
    } = await request.json();

    if (!coupleId || !type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const targetUserIds: string[] = [];
    if (userId) {
      targetUserIds.push(userId);
    } else if (userGroup || locale) {
      const userWhere: any = { couple_id: coupleId };
      if (userGroup) {
        // @ts-ignore
        userWhere.group = userGroup;
      }
      if (locale) {
        // @ts-ignore
        userWhere.locale = locale;
      }
      const users = await db.user.findMany({ where: userWhere, select: { id: true } });
      targetUserIds.push(...users.map(u => u.id));
    }

    if (targetUserIds.length === 0) {
      return NextResponse.json(
        { error: 'No target users found' },
        { status: 400 }
      );
    }

    const notifications = await Promise.all(
      targetUserIds.map((uid) =>
        db.notification.create({
          data: {
            couple_id: coupleId,
            user_id: uid,
            type,
            title,
            message,
            data: data || null,
            is_delivered: false
          }
        })
      )
    );

    const scheduleDate = sendAt ? new Date(sendAt) : undefined;
    for (const n of notifications) {
      await addNotificationJob({ notificationId: n.id }, scheduleDate);
    }

    return NextResponse.json(
      {
        message: 'Notification(s) created successfully',
        notifications
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
