import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { addExpoToken } from '@/lib/notifications/subscribers';

const schema = z.object({
  token: z.string().min(10),
  userAgent: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { token, userAgent } = schema.parse(body);

    // Store token in in-memory subscribers (DB-backed storage can be added later)
    addExpoToken(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to register token' }, { status: 500 });
  }
}
