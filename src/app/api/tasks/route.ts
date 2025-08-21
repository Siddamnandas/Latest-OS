import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { TaskCategory, TaskStatus } from '@prisma/client';

const querySchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
});

const createSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  assignedTo: z.enum(['partner_a', 'partner_b', 'both']),
  category: z.nativeEnum(TaskCategory),
  dueAt: z.string().datetime().optional(),
});

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.couple?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsedQuery = querySchema.safeParse({
    status: searchParams.get('status') as TaskStatus | undefined,
  });
  if (!parsedQuery.success) {
    return NextResponse.json({ error: parsedQuery.error.flatten() }, { status: 400 });
  }

  try {
    const tasks = await db.task.findMany({
      where: {
        couple_id: session.user.couple.id,
        ...(parsedQuery.data.status ? { status: parsedQuery.data.status } : {}),
      },
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.couple?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createSchema.parse(body);

    const task = await db.task.create({
      data: {
        couple_id: session.user.couple.id,
        title: parsed.title,
        description: parsed.description,
        assigned_to: parsed.assignedTo,
        category: parsed.category,
        due_at: parsed.dueAt ? new Date(parsed.dueAt) : null,
        status: TaskStatus.PENDING,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}