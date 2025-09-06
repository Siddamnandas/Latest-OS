import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const prisma = db;

// Sync entry validation schema
const syncSchema = z.object({
  mood_score: z.number().min(1).max(5), // 1-5 scale
  energy_level: z.number().min(1).max(10), // 1-10 scale
  mood_tags: z.array(z.string()).optional(),
  context_notes: z.string().optional(),
  sync_with_partner: z.boolean().optional(),
});

type SyncFormData = z.infer<typeof syncSchema>;

// POST - Create new sync entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the incoming data
    const validationResult = syncSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const syncData = validationResult.data;

    // For now, get user ID from mock (in real app, from session/auth)
    const mockCoupleId = '1';
    const mockPartner = 'partner1'; // Alternating between partners

    // Create sync entry in database
    const syncEntry = await prisma.syncEntry.create({
      data: {
        couple_id: mockCoupleId,
        partner: mockPartner,
        mood_score: syncData.mood_score,
        energy_level: syncData.energy_level,
        mood_tags: syncData.mood_tags ? JSON.stringify(syncData.mood_tags) : '[]',
        context_notes: syncData.context_notes || null,
        // completion_data will be stored separately when sync is completed
      },
    });

    // Calculate relationship balance based on recent syncs
    await updateRelationshipBalance(mockCoupleId);

    // Transform response to match frontend expectations
    const responseData = {
      id: syncEntry.id,
      mood_score: syncEntry.mood_score,
      energy_level: syncEntry.energy_level,
      mood_tags: syncData.mood_tags || [],
      context_notes: syncEntry.context_notes,
      sync_with_partner: syncData.sync_with_partner || false,
      created_at: syncEntry.created_at.toISOString(),
      // Add couple info for display
      couple: {
        partner_a_name: 'Arjun',
        partner_b_name: 'Priya',
        city: 'Mumbai',
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error creating sync entry:', error);

    // Handle specific database errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Couple not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create sync entry' },
      { status: 500 }
    );
  }
}

// GET - Fetch sync entries for couple
export async function GET() {
  try {
    // For now, get mock couple ID
    const mockCoupleId = '1';

    // Fetch recent sync entries
    const syncEntries = await prisma.syncEntry.findMany({
      where: { couple_id: mockCoupleId },
      orderBy: { created_at: 'desc' },
      take: 10, // Get last 10 syncs
    });

    // Transform data for response
    const formattedEntries = syncEntries.map(entry => ({
      id: entry.id,
      partner: entry.partner,
      mood_score: entry.mood_score,
      energy_level: entry.energy_level,
      mood_tags: JSON.parse(entry.mood_tags || '[]'),
      context_notes: entry.context_notes,
      created_at: entry.created_at.toISOString(),
    }));

    // Calculate current relationship stats
    const stats = await calculateSyncStats(mockCoupleId);

    return NextResponse.json({
      syncs: formattedEntries,
      stats: stats,
    });
  } catch (error) {
    console.error('Error fetching sync entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sync entries' },
      { status: 500 }
    );
  }
}

// Helper function to update relationship balance
async function updateRelationshipBalance(coupleId: string) {
  try {
    // Get recent sync entries
    const recentSyncs = await prisma.syncEntry.findMany({
      where: {
        couple_id: coupleId,
        created_at: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    });

    if (recentSyncs.length === 0) return;

    // Calculate average scores for relationship balance
    const totalPlayScore = recentSyncs.reduce((sum, sync) => {
      // Higher energy + lower mood = more play time
      // This is a simplified algorithm
      return sum + (sync.energy_level - (6 - sync.mood_score)) / 2;
    }, 0);

    const playPercentage = Math.max(0, Math.min(100, 50 + (totalPlayScore / recentSyncs.length) * 20));
    const dutyPercentage = 100 - playPercentage;
    const balancePercentage = 100 - Math.abs(playPercentage - 50);

    // Update relationship balance
    await prisma.rasaBalance.upsert({
      where: { couple_id: coupleId },
      update: {
        play_percentage: playPercentage,
        duty_percentage: dutyPercentage,
        balance_percentage: balancePercentage,
        updated_at: new Date(),
      },
      create: {
        couple_id: coupleId,
        play_percentage: playPercentage,
        duty_percentage: dutyPercentage,
        balance_percentage: balancePercentage,
      },
    });
  } catch (error) {
    console.error('Error updating relationship balance:', error);
    // Don't throw error as this is optional
  }
}

// Helper function to calculate sync statistics
async function calculateSyncStats(coupleId: string) {
  try {
    // Get sync entries from the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const recentSyncs = await prisma.syncEntry.findMany({
      where: {
        couple_id: coupleId,
        created_at: {
          gte: thirtyDaysAgo,
        },
      },
    });

    if (recentSyncs.length === 0) {
      return {
        totalSyncs: 0,
        averageMood: 3,
        averageEnergy: 5,
        syncFrequency: 'No data',
        streak: 0,
      };
    }

    // Calculate statistics
    const totalSyncs = recentSyncs.length;
    const averageMood = recentSyncs.reduce((sum, sync) => sum + sync.mood_score, 0) / totalSyncs;
    const averageEnergy = recentSyncs.reduce((sum, sync) => sum + sync.energy_level, 0) / totalSyncs;

    // Calculate current streak (consecutive days)
    const now = new Date();
    const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const yesterdayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    yesterdayEnd.setHours(23, 59, 59, 999);
    yesterdayStart.setHours(0, 0, 0, 0);

    const yesterdaySyncs = await prisma.syncEntry.findMany({
      where: {
        couple_id: coupleId,
        created_at: {
          gte: yesterdayStart,
          lte: yesterdayEnd,
        },
      },
    });

    let currentStreak = 0;
    if (yesterdaySyncs.length > 0) {
      // Calculate streak by going backwards from yesterday
      let checkDate = new Date(yesterdayStart);
      const streakMaxDays = 30; // Max streak to check

      for (let i = 0; i < streakMaxDays; i++) {
        const dayStart = new Date(checkDate);
        const dayEnd = new Date(checkDate);
        dayEnd.setHours(23, 59, 59, 999);

        const daySyncs = await prisma.syncEntry.findMany({
          where: {
            couple_id: coupleId,
            created_at: {
              gte: dayStart,
              lte: dayEnd,
            },
          },
        });

        if (daySyncs.length > 0) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Calculate sync frequency
    const uniqueDays = new Set();
    recentSyncs.forEach(sync => {
      const dateKey = sync.created_at.toISOString().split('T')[0];
      uniqueDays.add(dateKey);
    });

    const totalDays = 30;
    const syncDays = uniqueDays.size;
    const frequency = syncDays / totalDays;
    let frequencyLabel = 'Rare';
    if (frequency > 0.8) frequencyLabel = 'Excellent';
    else if (frequency > 0.6) frequencyLabel = 'Good';
    else if (frequency > 0.4) frequencyLabel = 'Fair';
    else if (frequency > 0.2) frequencyLabel = 'Poor';

    return {
      totalSyncs,
      averageMood: Math.round(averageMood * 10) / 10,
      averageEnergy: Math.round(averageEnergy * 10) / 10,
      syncFrequency: frequencyLabel,
      streak: currentStreak,
    };
  } catch (error) {
    console.error('Error calculating sync stats:', error);
    return {
      totalSyncs: 0,
      averageMood: 3,
      averageEnergy: 5,
      syncFrequency: 'Error',
      streak: 0,
    };
  }
}
