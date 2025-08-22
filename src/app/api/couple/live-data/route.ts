import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';

export async function GET() {
  try {
    // Check Redis cache first
    const cacheKey = 'couple:live-data';
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }
    // For now, create a demo couple if none exists
    let couple = await db.couple.findFirst();
    
    if (!couple) {
      // Create demo couple data
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

    // Get relationship statistics
    const totalSyncs = await db.syncEntry.count({
      where: { couple_id: couple.id }
    });

    const completedTasks = await db.task.count({
      where: { 
        couple_id: couple.id,
        status: 'COMPLETED'
      }
    });

    const totalRituals = await db.ritualSession.count({
      where: { couple_id: couple.id }
    });

    const totalMemories = await db.memory.count({
      where: { couple_id: couple.id }
    });

    const totalRewardTransactions = await db.rewardTransaction.findMany({
      where: { couple_id: couple.id }
    });

    const totalCoins = totalRewardTransactions.reduce((sum, transaction) => 
      sum + transaction.coins_earned - transaction.coins_spent, 0
    ) || 250; // Default coins

    // Calculate streak (simplified - count consecutive days with sync entries)
    const recentSyncs = await db.syncEntry.findMany({
      where: { couple_id: couple.id },
      orderBy: { created_at: 'desc' },
      take: 30
    });

    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);
    
    for (let i = 0; i < 30; i++) {
      const dayString = currentDate.toISOString().split('T')[0];
      const hasSync = recentSyncs.some(sync => 
        sync.created_at.toISOString().split('T')[0] === dayString
      );
      
      if (hasSync) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Get recent activity
    const recentSyncEntries = await db.syncEntry.findMany({
      where: { couple_id: couple.id },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    const recentTaskEntries = await db.task.findMany({
      where: { couple_id: couple.id },
      orderBy: { updated_at: 'desc' },
      take: 5
    });

    const recentMemoryEntries = await db.memory.findMany({
      where: { couple_id: couple.id },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    // Get Rasa balance
    const rasaBalance = await db.rasaBalance.findUnique({
      where: { couple_id: couple.id }
    });

    // Get children
    const children = await db.child.findMany({
      where: { couple_id: couple.id }
    });

    // Calculate relationship level based on stats
    const getRelationshipLevel = () => {
      const totalActivities = totalSyncs + completedTasks + totalRituals;
      if (totalActivities >= 50) return 'Soul Partners';
      if (totalActivities >= 30) return 'Deep Connection';
      if (totalActivities >= 15) return 'Good Partners';
      if (totalActivities >= 5) return 'Growing Together';
      return 'New Journey';
    };

    const liveData = {
      couple: {
        id: couple.id,
        partner_a: couple.partner_a_name,
        partner_b: couple.partner_b_name,
        anniversary: couple.anniversary_date?.toISOString() || '',
        city: couple.city,
        region: couple.region,
        language: couple.language
      },
      stats: {
        streak: Math.max(streak, 1), // Ensure at least 1 for demo
        coins: totalCoins,
        relationshipLevel: getRelationshipLevel(),
        relationshipEmoji: '💗',
        totalSyncs,
        completedTasks,
        totalRituals,
        totalMemories
      },
      recentActivity: {
        syncs: recentSyncEntries.map(sync => ({
          id: sync.id,
          partner: sync.partner,
          mood: sync.mood_score,
          energy: sync.energy_level,
          tags: JSON.parse(sync.mood_tags || '[]'),
          date: sync.created_at.toISOString()
        })),
        tasks: recentTaskEntries.map(task => ({
          id: task.id,
          title: task.title,
          status: task.status,
          assignedTo: task.assigned_to,
          category: task.category,
          dueAt: task.due_at?.toISOString() || null,
          completedAt: task.completed_at?.toISOString() || null
        })),
        memories: recentMemoryEntries.map(memory => ({
          id: memory.id,
          title: memory.title,
          type: memory.type,
          date: memory.date.toISOString(),
          sentiment: memory.sentiment
        }))
      },
      rasaBalance: {
        play: rasaBalance?.play_percentage || 35,
        duty: rasaBalance?.duty_percentage || 45,
        balance: rasaBalance?.balance_percentage || 20
      },
      children: children.map(child => ({
        id: child.id,
        name: child.name,
        age: child.age
      }))
    };

    // Cache the response for 2 minutes
    await redis.setex(cacheKey, 120, JSON.stringify(liveData));

    return NextResponse.json(liveData);
  } catch (error) {
    console.error('Error fetching live data:', error);
    
    // Return fallback demo data on error
    return NextResponse.json({
      couple: {
        id: 'demo',
        partner_a: 'Arjun',
        partner_b: 'Priya',
        anniversary: '2022-02-14',
        city: 'Mumbai',
        region: 'north-india',
        language: 'hindi'
      },
      stats: {
        streak: 7,
        coins: 250,
        relationshipLevel: 'Good Partners',
        relationshipEmoji: '💗',
        totalSyncs: 15,
        completedTasks: 8,
        totalRituals: 5,
        totalMemories: 12
      },
      recentActivity: {
        syncs: [],
        tasks: [],
        memories: []
      },
      rasaBalance: {
        play: 35,
        duty: 45,
        balance: 20
      },
      children: []
    });
  }
}