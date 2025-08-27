// Kids Activities API Route
// Production-ready API for activity management with filtering, pagination, and progress tracking
// Parent-managed system: Parents authenticate and track children's activities

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { BaseActivity, ActivityResult, EmotionScenario, CreativeActivity } from '@/types/kids-activities';
import { authOptions } from '@/lib/auth';
import { logger, apiLogger, performanceLogger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { kidsCache, cacheHelpers } from '@/lib/kids-cache';
import { performanceMonitor } from '@/lib/performance-monitor';
import { monitoring } from '@/lib/monitoring';

// Validation schemas
const ActivityFilterSchema = z.object({
  childId: z.string().uuid('Invalid child ID format').optional(),
  type: z.array(z.enum(['emotion', 'mythology', 'creativity', 'kindness', 'story', 'music', 'movement'])).optional(),
  difficulty: z.array(z.enum(['easy', 'medium', 'hard'])).optional(),
  ageMin: z.number().min(3).max(18).optional(),
  ageMax: z.number().min(3).max(18).optional(),
  durationMin: z.number().min(1).optional(),
  durationMax: z.number().min(1).optional(),
  tags: z.array(z.string()).optional(),
  completed: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0)
});

const ActivityResultSchema = z.object({
  activityId: z.string(),
  childId: z.string().uuid('Invalid child ID format'),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  completed: z.boolean(),
  score: z.number().min(0).max(100).optional(),
  answers: z.record(z.string(), z.any()).optional(),
  reflection: z.string().optional(),
  parentFeedback: z.string().optional(),
  media: z.array(z.object({
    type: z.enum(['photo', 'video', 'audio', 'drawing']),
    url: z.string().url(),
    caption: z.string().optional(),
    timestamp: z.string().datetime(),
    createdBy: z.string()
  })).optional()
});



// GET /api/kids/activities - Retrieve activities with filtering and pagination (parent-authenticated)
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Authenticate parent user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      const responseTime = Date.now() - startTime;
      monitoring.recordAPIMetric('/api/kids/activities', 'GET', 401, responseTime);
      apiLogger.warn('Unauthorized access attempt to kids activities API');
      return NextResponse.json(
        { error: 'Authentication required. Parents must be logged in to access activities.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    // Parse and validate query parameters
    const filters = {
      childId: searchParams.get('childId') || undefined,
      type: searchParams.get('type')?.split(','),
      difficulty: searchParams.get('difficulty')?.split(','),
      ageMin: searchParams.get('ageMin') ? parseInt(searchParams.get('ageMin')!) : undefined,
      ageMax: searchParams.get('ageMax') ? parseInt(searchParams.get('ageMax')!) : undefined,
      durationMin: searchParams.get('durationMin') ? parseInt(searchParams.get('durationMin')!) : undefined,
      durationMax: searchParams.get('durationMax') ? parseInt(searchParams.get('durationMax')!) : undefined,
      tags: searchParams.get('tags')?.split(','),
      completed: searchParams.get('completed') === 'true' ? true : searchParams.get('completed') === 'false' ? false : undefined,
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0')
    };

    // Validate filters
    const validationResult = ActivityFilterSchema.safeParse(filters);
    if (!validationResult.success) {
      logger.warn({ filters, errors: validationResult.error.issues }, 'Invalid activity filter parameters');
      return NextResponse.json(
        {
          error: 'Invalid filter parameters',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const validatedFilters = validationResult.data;
    
    // Check cache first
    const cacheKey = { ...validatedFilters, parentId: session.user.id };
    const cachedActivities = cacheHelpers.getCachedActivityList(cacheKey);
    
    if (cachedActivities) {
      const responseTime = Date.now() - startTime;
      monitoring.recordAPIMetric('/api/kids/activities', 'GET', 200, responseTime);
      monitoring.recordUserActivity(session.user.id, 'get_activities_cached', validatedFilters.childId);
      
      apiLogger.info({
        parentId: session.user.id,
        childId: validatedFilters.childId,
        cacheHit: true,
        totalResults: cachedActivities.length,
        responseTime
      }, 'Activities retrieved from cache');
      
      return NextResponse.json({
        activities: cachedActivities,
        cached: true,
        timestamp: new Date()
      });
    }
    
    // If childId is specified, verify parent-child relationship
    if (validatedFilters.childId) {
      try {
        const child = await prisma.childProfile.findFirst({
          where: {
            id: validatedFilters.childId,
            parentId: session.user.id
          }
        });

        if (!child) {
          logger.warn({
            parentId: session.user.id,
            childId: validatedFilters.childId
          }, 'Parent attempted to access unauthorized child activities');
          return NextResponse.json(
            { error: 'Child not found or access denied. You can only access activities for your own children.' },
            { status: 404 }
          );
        }
      } catch (dbError) {
        logger.error({
          error: dbError,
          parentId: session.user.id,
          childId: validatedFilters.childId
        }, 'Database error verifying child access');
        return NextResponse.json(
          { error: 'Database error occurred while verifying access' },
          { status: 500 }
        );
      }
    }
    
    try {
      // Build database query based on filters
      const whereClause: any = {
        isActive: true
      };
      
      // Add filters to where clause
      if (validatedFilters.type && validatedFilters.type.length > 0) {
        whereClause.type = { in: validatedFilters.type };
      }
      
      if (validatedFilters.difficulty && validatedFilters.difficulty.length > 0) {
        whereClause.difficulty = { in: validatedFilters.difficulty };
      }
      
      if (validatedFilters.ageMin || validatedFilters.ageMax) {
        whereClause.AND = [];
        if (validatedFilters.ageMin) {
          whereClause.AND.push({ ageMax: { gte: validatedFilters.ageMin } });
        }
        if (validatedFilters.ageMax) {
          whereClause.AND.push({ ageMin: { lte: validatedFilters.ageMax } });
        }
      }
      
      if (validatedFilters.durationMin || validatedFilters.durationMax) {
        if (!whereClause.AND) whereClause.AND = [];
        if (validatedFilters.durationMin) {
          whereClause.AND.push({ estimatedDuration: { gte: validatedFilters.durationMin } });
        }
        if (validatedFilters.durationMax) {
          whereClause.AND.push({ estimatedDuration: { lte: validatedFilters.durationMax } });
        }
      }
      
      // Get total count for pagination
      const totalCount = await prisma.activity.count({ where: whereClause });
      
      // Get activities from database
      let activities = await prisma.activity.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc'
        },
        skip: validatedFilters.offset,
        take: validatedFilters.limit
      });
      
      // Apply age-based filtering if childId is provided
      if (validatedFilters.childId) {
        const child = await prisma.childProfile.findUnique({
          where: { id: validatedFilters.childId },
          select: { birthDate: true }
        });
        
        if (child?.birthDate) {
          const childAge = Math.floor((Date.now() - child.birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
          activities = activities.filter(activity => 
            activity.ageMin <= childAge && activity.ageMax >= childAge
          );
        }
      }
      
      // Apply tag filtering (if implemented)
      if (validatedFilters.tags && validatedFilters.tags.length > 0) {
        activities = activities.filter(activity => {
          const activityTags = JSON.parse(activity.tags || '[]');
          return validatedFilters.tags!.some(tag => activityTags.includes(tag));
        });
      }

      // Get completion status if childId is provided
      let activitiesWithProgress = activities.map(activity => ({
        ...activity,
        tags: JSON.parse(activity.tags || '[]'),
        instructions: JSON.parse(activity.instructions || '[]'),
        materials: JSON.parse(activity.materials || '[]'),
        learningObjectives: JSON.parse(activity.learningObjectives || '[]'),
        safetyNotes: JSON.parse(activity.safetyNotes || '[]'),
        accessibility: JSON.parse(activity.accessibility || '{}')
      }));
      
      if (validatedFilters.childId) {
        const completions = await prisma.activityCompletion.findMany({
          where: {
            childId: validatedFilters.childId,
            activityId: { in: activities.map(a => a.id) }
          },
          select: {
            activityId: true,
            completed: true,
            score: true,
            completedAt: true
          }
        });

        activitiesWithProgress = activitiesWithProgress.map(activity => ({
          ...activity,
          completion: completions.find(c => c.activityId === activity.id)
        }));
      }
        
      // Cache the results
      const resultWithMeta = {
        activities: activitiesWithProgress,
        meta: {
          total: totalCount,
          offset: validatedFilters.offset,
          limit: validatedFilters.limit,
          hasMore: validatedFilters.offset + validatedFilters.limit < totalCount
        },
        filters: validatedFilters
      };
      
      cacheHelpers.cacheActivityList(cacheKey, activitiesWithProgress);

      const responseTime = Date.now() - startTime;
      monitoring.recordAPIMetric('/api/kids/activities', 'GET', 200, responseTime);
      monitoring.recordUserActivity(session.user.id, 'get_activities', validatedFilters.childId);

      apiLogger.info({
        parentId: session.user.id,
        childId: validatedFilters.childId,
        totalResults: totalCount,
        returnedResults: activitiesWithProgress.length,
        cached: false,
        responseTime
      }, 'Activities retrieved successfully');

      return NextResponse.json({
        ...resultWithMeta,
        timestamp: new Date()
      });
      
    } catch (dbError) {
      const responseTime = Date.now() - startTime;
      monitoring.recordAPIMetric('/api/kids/activities', 'GET', 500, responseTime);
      apiLogger.error({
        error: dbError,
        parentId: session.user.id,
        childId: validatedFilters.childId,
        responseTime
      }, 'Database error retrieving activities');
      return NextResponse.json(
        { error: 'Database error occurred while retrieving activities' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    monitoring.recordAPIMetric('/api/kids/activities', 'GET', 500, responseTime);
    apiLogger.error({ 
      error, 
      responseTime 
    }, 'Unexpected error in kids activities GET endpoint');
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// POST /api/kids/activities - Submit activity result (parent-authenticated)
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Authenticate parent user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      const responseTime = Date.now() - startTime;
      monitoring.recordAPIMetric('/api/kids/activities', 'POST', 401, responseTime);
      apiLogger.warn('Unauthorized access attempt to submit activity result');
      return NextResponse.json(
        { error: 'Authentication required. Parents must be logged in to submit activity results.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate activity result
    const validationResult = ActivityResultSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn({ errors: validationResult.error.issues }, 'Invalid activity result data');
      return NextResponse.json(
        {
          error: 'Invalid activity result data',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const resultData = validationResult.data;
    
    try {
      // Verify parent-child relationship
      const child = await prisma.childProfile.findFirst({
        where: {
          id: resultData.childId,
          parentId: session.user.id
        }
      });

      if (!child) {
        logger.warn({
          parentId: session.user.id,
          childId: resultData.childId
        }, 'Parent attempted to submit result for unauthorized child');
        return NextResponse.json(
          { error: 'Child not found or access denied. You can only submit results for your own children.' },
          { status: 404 }
        );
      }

      // Verify activity exists
      const activity = await prisma.activity.findUnique({
        where: { id: resultData.activityId }
      });
      
      if (!activity) {
        logger.warn({
          activityId: resultData.activityId,
          childId: resultData.childId
        }, 'Activity not found for result submission');
        return NextResponse.json(
          { error: 'Activity not found' },
          { status: 404 }
        );
      }

      // Create activity completion record
      const completion = await prisma.activityCompletion.create({
        data: {
          childId: resultData.childId,
          activityId: resultData.activityId,
          startTime: new Date(resultData.startTime),
          endTime: new Date(resultData.endTime),
          completed: resultData.completed,
          score: resultData.score,
          answers: JSON.stringify(resultData.answers || {}),
          reflection: resultData.reflection,
          parentFeedback: resultData.parentFeedback,
          media: JSON.stringify(resultData.media || [])
        }
      });

      // Update child progress if activity was completed
      if (resultData.completed) {
        await updateChildProgress(resultData.childId, activity, resultData.score || 0);
        // Invalidate progress cache since it changed
        cacheHelpers.invalidateChildData(resultData.childId);
      }

      // Calculate new achievements
      const achievements = await calculateAndAwardAchievements(resultData.childId);

      const responseTime = Date.now() - startTime;
      monitoring.recordAPIMetric('/api/kids/activities', 'POST', 201, responseTime);
      monitoring.recordUserActivity(session.user.id, 'submit_activity', resultData.childId);
      
      // Record kids activity metrics
      if (activity) {
        monitoring.recordKidsActivity(
          activity.type,
          resultData.completed,
          // Calculate child age based on birth date if available
          18 // Default age for now
        );
      }

      apiLogger.info({
        parentId: session.user.id,
        childId: resultData.childId,
        activityId: resultData.activityId,
        completed: resultData.completed,
        newAchievements: achievements.length,
        responseTime
      }, 'Activity result submitted successfully');

      return NextResponse.json({
        completion,
        achievements,
        message: 'Activity result submitted successfully'
      }, { status: 201 });

    } catch (dbError) {
      logger.error({
        error: dbError,
        parentId: session.user.id,
        childId: resultData.childId
      }, 'Database error submitting activity result');
      return NextResponse.json(
        { error: 'Database error occurred while submitting result' },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error({ error }, 'Unexpected error in kids activities POST endpoint');
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Helper function to update child progress
async function updateChildProgress(childId: string, activity: any, score: number) {
  try {
    const currentProgress = await prisma.childProgress.findUnique({
      where: { childId }
    });

    if (!currentProgress) {
      // Create initial progress record
      await prisma.childProgress.create({
        data: {
          childId,
          totalActivitiesCompleted: 1,
          currentStreak: 1,
          longestStreak: 1,
          kindnessPoints: activity.type === 'kindness' ? 10 : 0,
          creativityScore: activity.type === 'creativity' ? score : 0,
          emotionalIntelligenceLevel: activity.type === 'emotion' ? 2 : 1
        }
      });
    } else {
      // Update existing progress
      const updates: any = {
        totalActivitiesCompleted: currentProgress.totalActivitiesCompleted + 1,
        currentStreak: currentProgress.currentStreak + 1,
        longestStreak: Math.max(currentProgress.longestStreak, currentProgress.currentStreak + 1)
      };

      // Update category-specific scores
      if (activity.type === 'kindness') {
        updates.kindnessPoints = currentProgress.kindnessPoints + 10;
      }
      if (activity.type === 'creativity') {
        updates.creativityScore = currentProgress.creativityScore + score;
      }
      if (activity.type === 'emotion') {
        updates.emotionalIntelligenceLevel = Math.min(10, currentProgress.emotionalIntelligenceLevel + 1);
      }

      await prisma.childProgress.update({
        where: { childId },
        data: updates
      });
    }
  } catch (error) {
    logger.error({ error, childId }, 'Error updating child progress');
    throw error;
  }
}

// Helper function to calculate and award achievements
async function calculateAndAwardAchievements(childId: string) {
  try {
    const progress = await prisma.childProgress.findUnique({
      where: { childId }
    });

    if (!progress) return [];

    const newAchievements = [];
    const existingAchievements = await prisma.childAchievement.findMany({
      where: { childId },
      select: { achievementId: true }
    });

    const existingIds = existingAchievements.map(a => a.achievementId);

    // Define achievement criteria
    const achievementCriteria = [
      {
        id: 'first_activity',
        name: 'First Steps',
        description: 'Completed your very first activity!',
        icon: '👶',
        rarity: 'common',
        condition: () => progress.totalActivitiesCompleted >= 1
      },
      {
        id: 'learning_explorer',
        name: 'Learning Explorer',
        description: 'Completed 5 activities - you love learning!',
        icon: '🗺️',
        rarity: 'common',
        condition: () => progress.totalActivitiesCompleted >= 5
      },
      {
        id: 'super_learner',
        name: 'Super Learner',
        description: 'Completed 20 activities - amazing dedication!',
        icon: '🚀',
        rarity: 'rare',
        condition: () => progress.totalActivitiesCompleted >= 20
      },
      {
        id: 'kind_heart',
        name: 'Kind Heart',
        description: 'Earned 10 kindness points - you have a beautiful heart!',
        icon: '💖',
        rarity: 'common',
        condition: () => progress.kindnessPoints >= 10
      },
      {
        id: 'kindness_champion',
        name: 'Kindness Champion',
        description: 'Earned 50 kindness points - you make the world brighter!',
        icon: '🏆',
        rarity: 'rare',
        condition: () => progress.kindnessPoints >= 50
      },
      {
        id: 'consistency_star',
        name: 'Consistency Star',
        description: '3 days in a row - building great habits!',
        icon: '⭐',
        rarity: 'common',
        condition: () => progress.currentStreak >= 3
      },
      {
        id: 'week_warrior',
        name: 'Week Warrior',
        description: '7 days in a row - incredible dedication!',
        icon: '🛡️',
        rarity: 'rare',
        condition: () => progress.longestStreak >= 7
      }
    ];

    // Check and award new achievements
    for (const achievement of achievementCriteria) {
      if (!existingIds.includes(achievement.id) && achievement.condition()) {
        const newAchievement = await prisma.childAchievement.create({
          data: {
            childId,
            achievementId: achievement.id,
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            rarity: achievement.rarity,
            requirements: JSON.stringify([achievement.description])
          }
        });
        newAchievements.push(newAchievement);
      }
    }

    return newAchievements;
  } catch (error) {
    logger.error({ error, childId }, 'Error calculating achievements');
    return [];
  }
}

// PUT /api/kids/activities - Update activity (admin only)
export async function PUT(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check admin role (implement based on your auth system)
    // if (session.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'Admin privileges required for activity updates' },
    //     { status: 403 }
    //   );
    // }

    return NextResponse.json(
      { error: 'Activity updates require admin privileges' },
      { status: 403 }
    );
  } catch (error) {
    logger.error({ error }, 'Error in activities PUT endpoint');
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// DELETE /api/kids/activities - Delete activity (admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check admin role (implement based on your auth system)
    // if (session.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'Admin privileges required for activity deletion' },
    //     { status: 403 }
    //   );
    // }

    return NextResponse.json(
      { error: 'Activity deletion requires admin privileges' },
      { status: 403 }
    );
  } catch (error) {
    logger.error({ error }, 'Error in activities DELETE endpoint');
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}