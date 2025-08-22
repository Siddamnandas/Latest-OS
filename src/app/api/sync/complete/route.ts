import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mood, energy, tags, partner } = body;

    // Get the first couple (in real app, would use auth)
    const couple = await prisma.couple.findFirst();
    
    if (!couple) {
      return NextResponse.json({ error: 'No couple found' }, { status: 404 });
    }

    // Create sync entry
    const syncEntry = await prisma.syncEntry.create({
      data: {
        couple_id: couple.id,
        partner: partner || 'partner_a',
        mood_score: mood,
        energy_level: energy,
        mood_tags: JSON.stringify(tags || []),
        context_notes: `Sync completed with mood: ${mood}/5, energy: ${energy}/10`
      }
    });

    // Award coins for completing sync
    await prisma.rewardTransaction.create({
      data: {
        couple_id: couple.id,
        coins_earned: 25,
        coins_spent: 0,
        activity: 'Daily Sync Completed'
      }
    });

    // Update Rasa balance based on mood and energy
    const playPercentage = Math.min(100, (mood * 10) + (energy * 5));
    const dutyPercentage = Math.max(0, 100 - playPercentage);
    const balancePercentage = Math.abs(playPercentage - dutyPercentage);

    await prisma.rasaBalance.upsert({
      where: { couple_id: couple.id },
      update: {
        play_percentage: playPercentage,
        duty_percentage: dutyPercentage,
        balance_percentage: balancePercentage
      },
      create: {
        couple_id: couple.id,
        play_percentage: playPercentage,
        duty_percentage: dutyPercentage,
        balance_percentage: balancePercentage
      }
    });

    return NextResponse.json({
      success: true,
      syncEntry,
      coinsEarned: 25,
      message: 'Daily sync completed successfully!'
    });
  } catch (error) {
    console.error('Error completing sync:', error);
    return NextResponse.json({ error: 'Failed to complete sync' }, { status: 500 });
  }
}