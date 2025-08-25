// Kids Progress Tracking API Route
// Production-ready API for progress analytics, achievements, and personalized learning paths

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { UserProgress, Skill, Badge, Goal, Milestone } from '@/types/kids-activities';

// Validation schemas
const UpdateProgressSchema = z.object({
  totalActivitiesCompleted: z.number().min(0).optional(),
  skillsAcquired: z.array(z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    level: z.number().min(1).max(10),
    xpRequired: z.number().min(0),
    currentXp: z.number().min(0),
    dateAcquired: z.string().datetime()
  })).optional(),
  currentStreak: z.number().min(0).optional(),
  longestStreak: z.number().min(0).optional(),
  kindnessPoints: z.number().min(0).optional(),
  creativityScore: z.number().min(0).optional(),
  emotionalIntelligenceLevel: z.number().min(1).max(10).optional()
});

const CreateGoalSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  target: z.number().min(1),
  deadline: z.string().datetime(),
  category: z.enum(['emotion', 'mythology', 'creativity', 'kindness', 'story', 'music', 'movement']),
  priority: z.enum(['low', 'medium', 'high']).default('medium')
});

// Mock progress database
const mockProgress: Map<string, UserProgress> = new Map();
const mockAchievements: Map<string, Badge[]> = new Map();

// Default progress template
function createDefaultProgress(): UserProgress {
  return {
    totalActivitiesCompleted: 0,
    skillsAcquired: [],
    currentStreak: 0,
    longestStreak: 0,
    kindnessPoints: 0,
    creativityScore: 0,
    emotionalIntelligenceLevel: 1,
    weeklyGoals: [],
    monthlyMilestones: [
      {
        id: 'first_week',
        title: 'First Week Complete',
        description: 'Complete activities for 7 days',
        achieved: false
      },
      {
        id: 'kindness_hero',
        title: 'Kindness Hero',
        description: 'Earn 50 kindness points',
        achieved: false
      },
      {
        id: 'creative_artist',
        title: 'Creative Artist',
        description: 'Complete 10 creative activities',
        achieved: false
      }
    ],
    learningPath: {
      currentLevel: 1,
      nextMilestone: {
        id: 'first_steps',
        title: 'First Steps',
        description: 'Complete your first activity',
        achieved: false
      },
      recommendedActivities: ['emotion_1', 'kindness_1'],
      weakAreas: [],
      strengthAreas: [],
      adaptiveContent: true
    }
  };
}

// Achievement calculation engine
function calculateAchievements(userId: string, progress: UserProgress): Badge[] {
  const achievements: Badge[] = [];
  
  // Activity completion achievements
  if (progress.totalActivitiesCompleted >= 1) {
    achievements.push({
      id: 'first_activity',
      name: 'First Steps',
      description: 'Completed your very first activity!',
      icon: '👶',
      rarity: 'common',
      requirements: ['Complete 1 activity']
    });
  }
  
  if (progress.totalActivitiesCompleted >= 5) {
    achievements.push({
      id: 'learning_explorer',
      name: 'Learning Explorer',
      description: 'Completed 5 activities - you love learning!',
      icon: '🗺️',
      rarity: 'common',
      requirements: ['Complete 5 activities']
    });
  }
  
  if (progress.totalActivitiesCompleted >= 20) {
    achievements.push({
      id: 'super_learner',
      name: 'Super Learner',
      description: 'Completed 20 activities - amazing dedication!',
      icon: '🚀',
      rarity: 'rare',
      requirements: ['Complete 20 activities']
    });
  }
  
  // Kindness achievements
  if (progress.kindnessPoints >= 10) {
    achievements.push({
      id: 'kind_heart',
      name: 'Kind Heart',
      description: 'Earned 10 kindness points - you have a beautiful heart!',
      icon: '💖',
      rarity: 'common',
      requirements: ['Earn 10 kindness points']
    });
  }
  
  if (progress.kindnessPoints >= 50) {
    achievements.push({
      id: 'kindness_champion',
      name: 'Kindness Champion',
      description: 'Earned 50 kindness points - you make the world brighter!',
      icon: '🏆',
      rarity: 'rare',
      requirements: ['Earn 50 kindness points']
    });
  }
  
  // Streak achievements
  if (progress.currentStreak >= 3) {
    achievements.push({
      id: 'consistency_star',
      name: 'Consistency Star',
      description: '3 days in a row - building great habits!',
      icon: '⭐',
      rarity: 'common',
      requirements: ['3 day streak']
    });
  }
  
  if (progress.longestStreak >= 7) {
    achievements.push({
      id: 'week_warrior',
      name: 'Week Warrior',
      description: '7 days in a row - incredible dedication!',
      icon: '🛡️',
      rarity: 'rare',
      requirements: ['7 day streak']
    });
  }
  
  // Creativity achievements
  if (progress.creativityScore >= 25) {
    achievements.push({
      id: 'creative_spark',
      name: 'Creative Spark',
      description: 'High creativity score - your imagination shines!',
      icon: '✨',
      rarity: 'common',
      requirements: ['25 creativity points']
    });
  }
  
  // Emotional intelligence achievements
  if (progress.emotionalIntelligenceLevel >= 3) {
    achievements.push({
      id: 'emotion_expert',
      name: 'Emotion Expert',
      description: 'Level 3 emotional intelligence - you understand feelings!',
      icon: '🧠',
      rarity: 'rare',
      requirements: ['Reach EI level 3']
    });
  }
  
  // Special combination achievements
  if (progress.kindnessPoints >= 20 && progress.creativityScore >= 20) {
    achievements.push({
      id: 'kind_creator',
      name: 'Kind Creator',
      description: 'High kindness and creativity - a perfect combination!',
      icon: '🌈',
      rarity: 'epic',
      requirements: ['20 kindness points', '20 creativity points']
    });
  }
  
  return achievements;
}

// Learning path optimization
function optimizeLearningPath(progress: UserProgress): UserProgress['learningPath'] {
  const recommendedActivities: string[] = [];
  const weakAreas: string[] = [];
  const strengthAreas: string[] = [];
  
  // Analyze skill distribution
  const skillsByCategory = progress.skillsAcquired.reduce((acc, skill) => {
    acc[skill.category] = (acc[skill.category] || 0) + skill.level;
    return acc;
  }, {} as Record<string, number>);
  
  // Identify weak areas (categories with low skill levels)
  const categories = ['emotion', 'kindness', 'creativity', 'mythology', 'story'];
  categories.forEach(category => {
    const categoryScore = skillsByCategory[category] || 0;
    if (categoryScore < 10) {
      weakAreas.push(category);
      // Recommend activities for weak areas
      switch (category) {
        case 'emotion':
          recommendedActivities.push('emotion_1');
          break;
        case 'kindness':
          recommendedActivities.push('kindness_1');
          break;
        case 'creativity':
          recommendedActivities.push('creative_1');
          break;
        case 'mythology':
          recommendedActivities.push('story_1');
          break;
      }
    } else if (categoryScore >= 20) {
      strengthAreas.push(category);
    }
  });
  
  // Determine current level based on total progress
  const totalSkillPoints = Object.values(skillsByCategory).reduce((sum, score) => sum + score, 0);
  const currentLevel = Math.max(1, Math.floor(totalSkillPoints / 10) + 1);
  
  // Set next milestone based on current progress
  let nextMilestone: Milestone;
  if (progress.totalActivitiesCompleted < 5) {
    nextMilestone = {
      id: 'explorer',
      title: 'Learning Explorer',
      description: 'Complete 5 activities',
      achieved: false
    };
  } else if (progress.kindnessPoints < 25) {
    nextMilestone = {
      id: 'kind_heart',
      title: 'Kind Heart',
      description: 'Earn 25 kindness points',
      achieved: false
    };
  } else {
    nextMilestone = {
      id: 'master_learner',
      title: 'Master Learner',
      description: 'Become a well-rounded learner',
      achieved: false
    };
  }
  
  return {
    currentLevel,
    nextMilestone,
    recommendedActivities: recommendedActivities.slice(0, 3), // Limit to 3 recommendations
    weakAreas,
    strengthAreas,
    adaptiveContent: true
  };
}

// GET - Retrieve user progress
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'current';
    const includeAnalytics = searchParams.get('analytics') === 'true';
    
    let progress = mockProgress.get(userId);
    if (!progress) {
      progress = createDefaultProgress();
      mockProgress.set(userId, progress);
    }
    
    // Optimize learning path
    progress.learningPath = optimizeLearningPath(progress);
    
    // Calculate achievements
    const achievements = calculateAchievements(userId, progress);
    mockAchievements.set(userId, achievements);
    
    let response: any = {
      success: true,
      data: progress,
      achievements,
      timestamp: new Date()
    };
    
    // Include detailed analytics if requested
    if (includeAnalytics) {
      response.analytics = {
        weeklyProgress: calculateWeeklyProgress(progress),
        monthlyTrends: calculateMonthlyTrends(progress),
        skillDistribution: calculateSkillDistribution(progress),
        recommendations: generatePersonalizedRecommendations(progress)
      };
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Progress GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve progress'
        }
      },
      { status: 500 }
    );
  }
}

// PUT - Update user progress
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'current';
    
    // Validate input
    const validationResult = UpdateProgressSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid progress data',
            details: validationResult.error.errors
          }
        },
        { status: 400 }
      );
    }
    
    const updates = validationResult.data;
    let currentProgress = mockProgress.get(userId) || createDefaultProgress();
    
    // Merge updates
    const updatedProgress: UserProgress = {
      ...currentProgress,
      ...updates,
      skillsAcquired: updates.skillsAcquired?.map(skill => ({
        ...skill,
        dateAcquired: new Date(skill.dateAcquired)
      })) || currentProgress.skillsAcquired
    };
    
    // Update streak logic
    if (updates.totalActivitiesCompleted && updates.totalActivitiesCompleted > currentProgress.totalActivitiesCompleted) {
      updatedProgress.currentStreak = (updatedProgress.currentStreak || 0) + 1;
      updatedProgress.longestStreak = Math.max(updatedProgress.longestStreak, updatedProgress.currentStreak);
    }
    
    // Optimize learning path with new data
    updatedProgress.learningPath = optimizeLearningPath(updatedProgress);
    
    // Store updated progress
    mockProgress.set(userId, updatedProgress);
    
    // Calculate new achievements
    const achievements = calculateAchievements(userId, updatedProgress);
    const newAchievements = achievements.filter(achievement => {
      const existing = mockAchievements.get(userId) || [];
      return !existing.some(a => a.id === achievement.id);
    });
    mockAchievements.set(userId, achievements);
    
    return NextResponse.json({
      success: true,
      data: updatedProgress,
      newAchievements,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Progress PUT error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update progress'
        }
      },
      { status: 500 }
    );
  }
}

// POST - Create new goal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'current';
    
    // Validate goal data
    const validationResult = CreateGoalSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid goal data',
            details: validationResult.error.errors
          }
        },
        { status: 400 }
      );
    }
    
    const goalData = validationResult.data;
    const newGoal: Goal = {
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: goalData.title,
      description: goalData.description,
      target: goalData.target,
      current: 0,
      deadline: new Date(goalData.deadline),
      category: goalData.category
    };
    
    // Add goal to user's progress
    let progress = mockProgress.get(userId) || createDefaultProgress();
    progress.weeklyGoals.push(newGoal);
    mockProgress.set(userId, progress);
    
    return NextResponse.json({
      success: true,
      data: newGoal,
      timestamp: new Date()
    }, { status: 201 });
  } catch (error) {
    console.error('Goal POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create goal'
        }
      },
      { status: 500 }
    );
  }
}

// Helper functions for analytics
function calculateWeeklyProgress(progress: UserProgress) {
  // Mock weekly progress data
  return {
    activitiesCompleted: progress.totalActivitiesCompleted % 10 || 1,
    kindnessPointsEarned: progress.kindnessPoints % 15 || 2,
    newSkillsLearned: progress.skillsAcquired.length % 3 || 1,
    streakDays: progress.currentStreak
  };
}

function calculateMonthlyTrends(progress: UserProgress) {
  // Mock monthly trend data
  return {
    growthRate: Math.min(progress.totalActivitiesCompleted * 5, 100),
    improvementAreas: progress.learningPath.weakAreas,
    consistencyScore: Math.min(progress.longestStreak * 10, 100)
  };
}

function calculateSkillDistribution(progress: UserProgress) {
  const distribution: Record<string, number> = {};
  progress.skillsAcquired.forEach(skill => {
    distribution[skill.category] = (distribution[skill.category] || 0) + skill.level;
  });
  return distribution;
}

function generatePersonalizedRecommendations(progress: UserProgress) {
  const recommendations = [];
  
  if (progress.kindnessPoints < 10) {
    recommendations.push({
      type: 'activity',
      title: 'Try a kindness activity',
      description: 'Build your kindness score with helping activities',
      priority: 'high'
    });
  }
  
  if (progress.currentStreak === 0) {
    recommendations.push({
      type: 'habit',
      title: 'Start a learning streak',
      description: 'Try to complete an activity every day',
      priority: 'medium'
    });
  }
  
  if (progress.skillsAcquired.length < 3) {
    recommendations.push({
      type: 'skill',
      title: 'Learn a new skill',
      description: 'Complete activities to unlock new skills',
      priority: 'medium'
    });
  }
  
  return recommendations;
}