import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Achievement categories
enum AchievementCategory {
  DAILY_ACTIVITY = 'daily_activity',
  RELATIONSHIP_GROWTH = 'relationship_growth',
  FAMILY_ENGAGEMENT = 'family_engagement',
  PERSONAL_DEVELOPMENT = 'personal_development',
  SPECIAL_OCCASIONS = 'special_occasions'
}

// Achievement types
enum AchievementType {
  STREAK = 'streak',
  COUNT = 'count',
  QUALITY = 'quality',
  MILESTONE = 'milestone',
  TIME_BASED = 'time_based'
}

// Reward calculation schema
const rewardCalculationSchema = z.object({
  action: z.string().min(1),
  context: z.record(z.unknown()).optional(),
  partner: z.boolean().optional(),
});

// Achievement definitions (would normally be in database)
const ACHIEVEMENT_DEFINITIONS = [
  {
    id: 'first_sync',
    name: 'First Steps',
    description: 'Complete your first daily sync',
    category: AchievementCategory.DAILY_ACTIVITY,
    type: AchievementType.COUNT,
    icon: '🎯',
    rarity: 'common',
    requirements: { count: 1 },
    rewards: { coins: 50, xp: 100 },
    motivational_message: "Congratulations on taking your first step!",
    psychological_impact: 'momentum'
  },
  {
    id: 'sync_streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day sync streak',
    category: AchievementCategory.DAILY_ACTIVITY,
    type: AchievementType.STREAK,
    icon: '🔥',
    rarity: 'rare',
    requirements: { streak: 7 },
    rewards: { coins: 150, xp: 300 },
    motivational_message: "Seven days of connection! Keep the flame burning!",
    psychological_impact: 'consistency'
  },
  {
    id: 'memory_creator',
    name: 'Memory Weaver',
    description: 'Create 10 cherished memories',
    category: AchievementCategory.RELATIONSHIP_GROWTH,
    type: AchievementType.COUNT,
    icon: '💝',
    rarity: 'uncommon',
    requirements: { count: 10 },
    rewards: { coins: 200, xp: 400 },
    motivational_message: "Building a beautiful tapestry of memories together!",
    psychological_impact: 'connection'
  },
  {
    id: 'emotion_explorer',
    name: 'Emotion Explorer',
    description: 'Share 20 different emotional experiences',
    category: AchievementCategory.PERSONAL_DEVELOPMENT,
    type: AchievementType.QUALITY,
    icon: '🌈',
    rarity: 'epic',
    requirements: { unique_emotions: 20 },
    rewards: { coins: 300, xp: 600 },
    motivational_message: "Your emotional intelligence is growing beautifully!",
    psychological_impact: 'self_awareness'
  },
  {
    id: 'consistency_master',
    name: 'Consistency Master',
    description: 'Complete daily syncs for 30 consecutive days',
    category: AchievementCategory.DAILY_ACTIVITY,
    type: AchievementType.STREAK,
    icon: '👑',
    rarity: 'legendary',
    requirements: { streak: 30 },
    rewards: { coins: 500, xp: 1000, special_badge: 'Consistency Champion' },
    motivational_message: "The crown of consistency! A true relationship champion!",
    psychological_impact: 'mastery'
  },
  {
    id: 'kindness_angel',
    name: 'Kindness Angel',
    description: 'Create 25 kindness memories',
    category: AchievementCategory.RELATIONSHIP_GROWTH,
    type: AchievementType.COUNT,
    icon: '🕊️',
    rarity: 'epic',
    requirements: { count: 25, category: 'kindness' },
    rewards: { coins: 350, xp: 700 },
    motivational_message: "Your kindness lights up the world around you! 💫",
    psychological_impact: 'generosity'
  },
  {
    id: 'anniversary_guardian',
    name: 'Anniversary Guardian',
    description: 'Celebrate 10 important anniversaries',
    category: AchievementCategory.SPECIAL_OCCASIONS,
    type: AchievementType.MILESTONE,
    icon: '📅',
    rarity: 'rare',
    requirements: { anniversary_count: 10 },
    rewards: { coins: 250, xp: 500 },
    motivational_message: "Preserving the sacred moments that matter most! 📜",
    psychological_impact: 'gratitude'
  },
  {
    id: 'storyteller',
    name: 'Storyteller',
    description: 'Create 50 storybook memories with kids',
    category: AchievementCategory.FAMILY_ENGAGEMENT,
    type: AchievementType.COUNT,
    icon: '📚',
    rarity: 'epic',
    requirements: { count: 50, category: 'storybook' },
    rewards: { coins: 400, xp: 800 },
    motivational_message: "Crafting magical stories for generations to come! ✨",
    psychological_impact: 'legacy'
  }
];

// Helper function to calculate achievement progress
async function calculateAchievementProgress(coupleId: string, achievement: any) {
  try {
    let currentProgress = 0;
    let isCompleted = false;

    switch (achievement.type) {
      case AchievementType.STREAK:
        // Calculate current sync streak
        currentProgress = await calculateCurrentStreak(coupleId, 'sync');
        isCompleted = currentProgress >= achievement.requirements.streak;
        break;

      case AchievementType.COUNT:
        if (achievement.id.includes('memory')) {
          // Count memories
          const memoryCount = await prisma.memory.count({
            where: {
              couple_id: coupleId,
              ...(achievement.requirements.category && {
                memory_type: achievement.requirements.category
              })
            }
          });
          currentProgress = memoryCount;
          isCompleted = currentProgress >= achievement.requirements.count;
        }
        break;

      case AchievementType.QUALITY:
        if (achievement.id === 'emotion_explorer') {
          // Count unique emotions in memories
          const memories = await prisma.memory.findMany({
            where: { couple_id: coupleId },
            select: { tags: true }
          });

          const uniqueEmotions = new Set();
          memories.forEach(mem => {
            const tags = JSON.parse(mem.tags || '[]');
            tags.forEach((tag: string) => {
              // Consider emotion-related tags
              if (['happy', 'joy', 'sad', 'excited', 'grateful'].includes(tag.toLowerCase())) {
                uniqueEmotions.add(tag.toLowerCase());
              }
            });
          });

          currentProgress = uniqueEmotions.size;
          isCompleted = currentProgress >= achievement.requirements.unique_emotions;
        }
        break;

      case AchievementType.MILESTONE:
        // Check if enough anniversaries stored
        // This would require a separate anniversaries table
        currentProgress = 0; // Placeholder
        isCompleted = currentProgress >= achievement.requirements.anniversary_count;
        break;
    }

    return {
      current: currentProgress,
      target: achievement.requirements[
        achievement.type === AchievementType.STREAK ? 'streak' :
        achievement.type === AchievementType.COUNT ? 'count' :
        'unique_emotions' in achievement.requirements ? 'unique_emotions' : achievement.requirements[Object.keys(achievement.requirements)[0]]
      ] || 1,
      percentage: Math.min(currentProgress / achievement.requirements[
        achievement.type === AchievementType.STREAK ? 'streak' :
        achievement.type === AchievementType.COUNT ? 'count' :
        'unique_emotions' in achievement.requirements ? 'unique_emotions' : achievement.requirements[Object.keys(achievement.requirements)[0]]
      ] * 100 || 0, 100),
      completed: isCompleted
    };
  } catch (error) {
    console.error('Error calculating achievement progress:', error);
    return { current: 0, target: 1, percentage: 0, completed: false };
  }
}

// Helper function to calculate current streak
async function calculateCurrentStreak(coupleId: string, activityType: string) {
  // For now, simplified streak calculation based on sync entries
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  if (activityType === 'sync') {
    const syncEntries = await prisma.syncEntry.findMany({
      where: {
        couple_id: coupleId,
        created_at: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: { created_at: 'desc' },
    });

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];

    if (syncEntries.length > 0) {
      let currentDate = new Date(today);

      for (let i = 0; i < 30; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const hasSync = syncEntries.some(sync =>
          sync.created_at.toISOString().split('T')[0] === dateStr
        );

        if (hasSync) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return streak;
  }

  return 0;
}

// POST - Calculate and award rewards for actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = rewardCalculationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const { action, context, partner } = validationResult.data;

    // Mock couple ID (would come from authentication)
    const mockCoupleId = '1';

    // Calculate reward based on action
    let rewards = { coins: 0, xp: 0, achievements: [] as any[] };

    switch (action) {
      case 'daily_sync':
        rewards.coins = 20;
        rewards.xp = 10;
        break;

      case 'memory_created':
        rewards.coins = context?.memory_type === 'kindness' ? 25 : 15;
        rewards.xp = 50;
        break;

      case 'task_completed':
        rewards.coins = context?.urgency === 'high' ? 50 : 30;
        rewards.xp = 25;
        break;

      case 'weekly_streak':
        rewards.coins = 150;
        rewards.xp = 300;
        break;

      case 'milestone_reached':
        rewards.coins = 100;
        rewards.xp = 200;
        break;

      default:
        rewards.coins = 10;
        rewards.xp = 5;
    }

    // Calculate potential new achievements
    const newAchievements = [];
    for (const achievement of ACHIEVEMENT_DEFINITIONS) {
      const progress = await calculateAchievementProgress(mockCoupleId, achievement);

      if (progress.completed) {
        // Check if already unlocked
        const existingAchievement = await prisma.achievement.findFirst({
          where: {
            // This would need proper user identification
            // For now, just mark as newly unlocked
          }
        });

        if (!existingAchievement) {
          // Award achievement
          newAchievements.push({
            id: achievement.id,
            name: achievement.name,
            description: achievement.description,
            rarity: achievement.rarity,
            rewards: achievement.rewards,
            motivational_message: achievement.motivational_message,
            psychological_impact: achievement.psychological_impact
          });
        }
      }
    }

    // Partner bonus multiplier (15% more rewards)
    if (partner) {
      rewards.coins = Math.round(rewards.coins * 1.15);
      rewards.xp = Math.round(rewards.xp * 1.15);
    }

    // Calculate motivational context
    const motivationalContext = {
      encouragement: partner ? "Teamwork makes the dream work! 👏" : "You're making amazing progress! 🌟",
      nextGoal: "Keep going for even greater achievements!",
      timeOfDay: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening',
      streakImpact: await calculateCurrentStreak(mockCoupleId, 'sync') > 0 ? 'Maintaining your streak! 🔥' : 'Starting fresh today!',
    };

    return NextResponse.json({
      rewards,
      achievements: newAchievements,
      motivational_context: motivationalContext,
      psychology_insights: {
        primary_motivation: partner ? 'social_connection' : 'personal_growth',
        behavior_pattern: 'consistent_engagement',
        psychological_state: 'flow',
        intrinsic_value: action.includes('memory') ? 'legacy_building' : 'relationship_strengthening'
      }
    });

  } catch (error) {
    console.error('Error calculating rewards:', error);
    return NextResponse.json(
      { error: 'Failed to calculate rewards' },
      { status: 500 }
    );
  }
}

// GET - Fetch achievements and progress
export async function GET() {
  try {
    // Mock couple ID
    const mockCoupleId = '1';

    // Calculate progress for all achievements
    const achievementsWithProgress = await Promise.all(
      ACHIEVEMENT_DEFINITIONS.map(async (achievement) => {
        const progress = await calculateAchievementProgress(mockCoupleId, achievement);

        return {
          ...achievement,
          progress,
          unlocked: progress.completed,
          unlocked_at: progress.completed ? new Date().toISOString() : null,
        };
      })
    );

    // Calculate overall gamification stats
    const completedCount = achievementsWithProgress.filter(a => a.progress.completed).length;
    const totalXp = completedCount * 100; // Mock XP calculation
    const currentLevel = Math.floor(totalXp / 500) + 1;
    const xpToNextLevel = (currentLevel * 500) - (totalXp % 500);

    // Calculate motivation insights
    const motivationInsights = {
      engagement: completedCount / ACHIEVEMENT_DEFINITIONS.length * 100,
      consistency: await calculateCurrentStreak(mockCoupleId, 'sync') > 5,
      growth_mindset: completedCount > 3,
      psychological_strength: (await calculateCurrentStreak(mockCoupleId, 'sync')) > 10 ? 'excellent' : 'good',
    };

    return NextResponse.json({
      achievements: achievementsWithProgress,
      stats: {
        total_achievements: ACHIEVEMENT_DEFINITIONS.length,
        completed_achievements: completedCount,
        total_xp: totalXp,
        current_level: currentLevel,
        xp_to_next_level: xpToNextLevel,
        completion_rate: (completedCount / ACHIEVEMENT_DEFINITIONS.length) * 100
      },
      motivation_insights: motivationInsights,
      next_recommendations: [
        {
          id: 'next_achievement',
          title: 'Weekly Sync Champion',
          description: 'Complete 7 consecutive daily syncs',
          potential_reward: '150 coins + Progress Badge',
          psychological_benefit: 'Builds habit consistency'
        }
      ]
    });

  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}
