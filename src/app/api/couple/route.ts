import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get the first couple (in a real app, this would be based on user authentication)
    const couple = await prisma.couple.findFirst({
      include: {
        users: true,
      },
    });

    if (!couple) {
      return NextResponse.json({ error: 'No couple found' }, { status: 404 });
    }

    return NextResponse.json(couple);
  } catch (error) {
    console.error('Error fetching couple:', error);
    return NextResponse.json({ error: 'Failed to fetch couple data' }, { status: 500 });
  }
}