import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get the first couple's goals (in a real app, this would be based on user authentication)
    const couple = await prisma.couple.findFirst();
    
    if (!couple) {
      return NextResponse.json([]);
    }

    const goals = await prisma.sharedGoal.findMany({
      where: {
        couple_id: couple.id,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}