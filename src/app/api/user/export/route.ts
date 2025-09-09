import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({ where: { id: session.user.id } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password: _password, ...exportData } = user as any;

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
