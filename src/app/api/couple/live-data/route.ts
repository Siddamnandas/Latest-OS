import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get the first couple for demo (in real app, would use auth)
    const couple = await prisma.couple.findFirst({
      include: {
        sync_entries: {
          orderBy: { created_at: 'desc' },
          take: 10
        },
        tasks: {
          orderBy: { created_at: 'desc' },
          take: 10
        },
        ritual_sessions: {
          orderBy: { started_at: 'desc' },
          take: 5
        },
        memories: {
          orderBy: { created_at: 'desc' },
          take: 10
        },
        reward_transactions: {
          orderBy: { created_at: 'desc' },
          take: 20
        },
        rasa_balance: true,
        children_profiles: true
      }
    });

    if (!couple) {
      return NextResponse.json({ error: 'No couple found' }, { status: 404 });
    }

    // Calculate current streak (simplified)
    const recentSyncs = couple.sync_entries.filter(sync => {
      const syncDate = new Date(sync.created_at);
      const today = new Date();
      const diffTime = today.getTime() - syncDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 10; // Last 10 days
    });

    const streak = Math.min(recentSyncs.length, 10);

    // Calculate total coins
    const totalCoins = couple.reward_transactions.reduce((total, transaction) => 
      total + transaction.coins_earned - transaction.coins_spent, 0
    );

    // Get relationship level based on streak
    const getRelationshipLevel = (streak: number) => {
      if (streak >= 30) return { level: 'Soul Mates', emoji: '💕' };
      if (streak >= 21) return { level: 'Deep Connection', emoji: '💖' };
      if (streak >= 14) return { level: 'Growing Bond', emoji: '💝' };
      if (streak >= 7) return { level: 'Good Partners', emoji: '💗' };
      return { level: 'New Beginning', emoji: '❤️' };
    };

    const relationshipLevel = getRelationshipLevel(streak);

    // Format response
    const liveData = {
      couple: {
        id: couple.id,
        partner_a: couple.partner_a_name,
        partner_b: couple.partner_b_name,
        anniversary: couple.anniversary_date,
        city: couple.city,
        region: couple.region,
        language: couple.language
      },
      stats: {
        streak,
        coins: totalCoins,
        relationshipLevel: relationshipLevel.level,
        relationshipEmoji: relationshipLevel.emoji,
        totalSyncs: couple.sync_entries.length,
        completedTasks: couple.tasks.filter(task => task.status === 'COMPLETED').length,
        totalRituals: couple.ritual_sessions.length,
        totalMemories: couple.memories.length
      },
      recentActivity: {
        syncs: couple.sync_entries.slice(0, 5).map(sync => ({
          id: sync.id,
          partner: sync.partner,
          mood: sync.mood_score,
          energy: sync.energy_level,
          tags: JSON.parse(sync.mood_tags || '[]'),
          date: sync.created_at
        })),
        tasks: couple.tasks.slice(0, 5).map(task => ({
          id: task.id,
          title: task.title,
          status: task.status,
          assignedTo: task.assigned_to,
          category: task.category,
          dueAt: task.due_at,
          completedAt: task.completed_at
        })),
        memories: couple.memories.slice(0, 3).map(memory => ({
          id: memory.id,
          title: memory.title,
          type: memory.type,
          date: memory.date,
          sentiment: memory.sentiment
        }))
      },
      rasaBalance: couple.rasa_balance[0] ? {
        play: couple.rasa_balance[0].play_percentage,
        duty: couple.rasa_balance[0].duty_percentage,
        balance: couple.rasa_balance[0].balance_percentage
      } : {
        play: 35,
        duty: 45,
        balance: 20
      },
      children: couple.children_profiles.map(child => ({
        id: child.id,
        name: child.name,
        age: child.age
      }))
    };

    return NextResponse.json(liveData);
  } catch (error) {
    console.error('Error fetching live data:', error);
    return NextResponse.json({ error: 'Failed to fetch live data' }, { status: 500 });
  }
}