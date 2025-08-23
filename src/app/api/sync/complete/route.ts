import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const syncCompleteSchema = z.object({
  partner: z.enum(['partner_a', 'partner_b']),
  mood_score: z.number().min(1).max(5),
  energy_level: z.number().min(1).max(10),
  mood_tags: z.array(z.string()).optional(),
  context_notes: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = syncCompleteSchema.parse(body);

    // Get or create demo couple
    let couple = await db.couple.findFirst();
    if (!couple) {
      couple = await db.couple.create({
        data: {
          partner_a_name: 'Arjun',
          partner_b_name: 'Priya', 
          anniversary_date: new Date('2022-02-14'),
          city: 'Mumbai',
          region: 'north-india',
          language: 'hindi',
          children: JSON.stringify([]),
          encryption_key: 'demo-key-12345678901234567890123456789012'
        }
      });
    }

    // Create sync entry
    const syncEntry = await db.syncEntry.create({
      data: {
        couple_id: couple.id,
        partner: validatedData.partner,
        mood_score: validatedData.mood_score,
        energy_level: validatedData.energy_level,
        mood_tags: JSON.stringify(validatedData.mood_tags || []),
        context_notes: validatedData.context_notes || ''
      }
    });

    // Award coins for completing sync
    const coinsEarned = 25; // Base coins for daily sync
    await db.rewardTransaction.create({
      data: {
        couple_id: couple.id,
        coins_earned: coinsEarned,
        coins_spent: 0,
        activity: `Daily sync completed by ${validatedData.partner}`
      }
    });

    // Calculate if this extends the streak
    const today = new Date().toISOString().split('T')[0];
    const todaysSyncs = await db.syncEntry.count({
      where: {
        couple_id: couple.id,
        created_at: {
          gte: new Date(today),
          lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000)
        }
      }
    });

    // Check if both partners have synced today
    const bothPartnersSynced = await Promise.all([
      db.syncEntry.findFirst({
        where: {
          couple_id: couple.id,
          partner: 'partner_a',
          created_at: {
            gte: new Date(today),
            lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000)
          }
        }
      }),
      db.syncEntry.findFirst({
        where: {
          couple_id: couple.id,
          partner: 'partner_b',
          created_at: {
            gte: new Date(today),
            lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    const streakBonus = bothPartnersSynced[0] && bothPartnersSynced[1];
    let totalCoinsEarned = coinsEarned;

    if (streakBonus) {
      // Award streak bonus
      const bonusCoins = 25;
      await db.rewardTransaction.create({
        data: {
          couple_id: couple.id,
          coins_earned: bonusCoins,
          coins_spent: 0,
          activity: 'Daily sync streak bonus - both partners synced'
        }
      });
      totalCoinsEarned += bonusCoins;
    }

    return NextResponse.json({
      success: true,
      syncEntry: {
        id: syncEntry.id,
        partner: syncEntry.partner,
        mood_score: syncEntry.mood_score,
        energy_level: syncEntry.energy_level,
        created_at: syncEntry.created_at
      },
      rewards: {
        coins_earned: totalCoinsEarned,
        streak_bonus: streakBonus,
        both_partners_synced: streakBonus
      },
      message: streakBonus 
        ? 'Daily sync completed! Streak bonus earned - both partners synced today! 🔥'
        : 'Daily sync completed! Waiting for your partner to sync for streak bonus. 💗'
    });

  } catch (error) {
    console.error('Error completing sync:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to complete sync' },
      { status: 500 }
    );
  }
}

// Get today's sync status
export async function GET() {
  try {
    const couple = await db.couple.findFirst();
    if (!couple) {
      return NextResponse.json({
        synced_today: false,
        partner_a_synced: false,
        partner_b_synced: false,
        can_sync: true
      });
    }

    const today = new Date().toISOString().split('T')[0];
    
    const [partnerASync, partnerBSync] = await Promise.all([
      db.syncEntry.findFirst({
        where: {
          couple_id: couple.id,
          partner: 'partner_a',
          created_at: {
            gte: new Date(today),
            lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000)
          }
        }
      }),
      db.syncEntry.findFirst({
        where: {
          couple_id: couple.id,
          partner: 'partner_b',
          created_at: {
            gte: new Date(today),
            lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    return NextResponse.json({
      synced_today: !!(partnerASync && partnerBSync),
      partner_a_synced: !!partnerASync,
      partner_b_synced: !!partnerBSync,
      can_sync: true,
      last_sync: partnerASync?.created_at || partnerBSync?.created_at || null
    });

  } catch (error) {
    console.error('Error getting sync status:', error);
    return NextResponse.json(
      { error: 'Failed to get sync status' },
      { status: 500 }
    );
  }
}