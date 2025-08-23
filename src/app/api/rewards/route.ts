import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get the first couple's reward transactions (in a real app, this would be based on user authentication)
    const couple = await prisma.couple.findFirst();
    
    if (!couple) {
      return NextResponse.json([]);
    }

    const rewards = await prisma.rewardTransaction.findMany({
      where: {
        couple_id: couple.id,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json(rewards);
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return NextResponse.json({ error: 'Failed to fetch rewards' }, { status: 500 });
  }
}