import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get the first couple's tasks (in a real app, this would be based on user authentication)
    const couple = await prisma.couple.findFirst();
    
    if (!couple) {
      return NextResponse.json([]);
    }

    const tasks = await prisma.task.findMany({
      where: {
        couple_id: couple.id,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 10, // Limit to 10 most recent tasks
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}