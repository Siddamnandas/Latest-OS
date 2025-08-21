import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        conversations: true,
        voice_sessions: true,
        notifications: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password_hash, ...exportData } = user;

    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': 'attachment; filename="user-export.json"',
      },
    });
  } catch (error) {
    console.error('Error exporting user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

