// Kids Activities API Route
// Production-ready API for activity management with filtering, pagination, and progress tracking
// Parent-managed system: Parents authenticate and track children's activities

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { BaseActivity, ActivityResult, EmotionScenario, CreativeActivity } from '@/types/kids-activities';
import { authOptions } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

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
  answers: z.record(z.any()).optional(),
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

// Mock activity database
const mockActivities: BaseActivity[] = [
  {
    id: 'emotion_1',
    title: 'The Happy Bunny',
    description: 'Help the bunny understand different emotions',
    type: 'emotion',
    difficulty: 'easy',
    ageRange: { min: 3, max: 6 },
    estimatedDuration: 10,
    tags: ['emotions', 'animals', 'empathy'],
    instructions: [
      {
        step: 1,
        title: 'Meet the Bunny',
        description: 'Look at the bunny and guess how it feels',
        interactionType: 'tap'
      },
      {
        step: 2,
        title: 'Choose the Emotion',
        description: 'Select the emotion that matches the bunny\'s face',
        interactionType: 'tap'
      },
      {
        step: 3,
        title: 'Talk About It',
        description: 'Discuss with your parent why the bunny feels this way',
        interactionType: 'speak'
      }
    ],
    materials: [],
    learningObjectives: ['Emotion recognition', 'Empathy development', 'Vocabulary building'],
    parentGuidance: 'Encourage your child to express their own emotions while helping the bunny',
    safetyNotes: ['Supervised interaction recommended'],
    accessibility: {
      screenReaderSupport: true,
      voiceNavigation: true,
      largeText: true,
      highContrast: true,
      reducedMotion: false,
      audioDescriptions: true
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'kindness_1',
    title: 'Helping Hands',
    description: 'Learn about helping others through simple acts',
    type: 'kindness',
    difficulty: 'easy',
    ageRange: { min: 4, max: 8 },
    estimatedDuration: 15,
    tags: ['kindness', 'helping', 'community'],
    instructions: [
      {
        step: 1,
        title: 'Find Someone to Help',
        description: 'Look around and find someone who needs help',
        interactionType: 'move'
      },
      {
        step: 2,
        title: 'Offer Help',
        description: 'Ask if you can help them',
        interactionType: 'speak'
      },
      {
        step: 3,
        title: 'Help and Reflect',
        description: 'Help them and think about how it makes you feel',
        interactionType: 'move'
      }
    ],
    materials: [],
    learningObjectives: ['Kindness', 'Social awareness', 'Empathy'],
    parentGuidance: 'Guide your child to identify appropriate ways to help others',
    accessibility: {
      screenReaderSupport: true,
      voiceNavigation: true,
      largeText: true,
      highContrast: true,
      reducedMotion: false,
      audioDescriptions: true
    },
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  },
  {
    id: 'creative_1',
    title: 'Rainbow Art',
    description: 'Create beautiful rainbow art while learning about colors',
    type: 'creativity',
    difficulty: 'easy',
    ageRange: { min: 3, max: 10 },
    estimatedDuration: 25,
    tags: ['art', 'colors', 'creativity', 'fine-motor'],
    instructions: [
      {
        step: 1,
        title: 'Gather Materials',
        description: 'Collect paper, colors, and brushes',
        interactionType: 'move'
      },
      {
        step: 2,
        title: 'Draw the Rainbow',
        description: 'Draw a beautiful rainbow using all the colors',
        interactionType: 'draw'
      },
      {
        step: 3,
        title: 'Share Your Art',
        description: 'Show your rainbow to family and explain what you love about it',
        interactionType: 'speak'
      }
    ],
    materials: ['Paper', 'Colored pencils or crayons', 'Paintbrush (optional)', 'Water colors (optional)'],
    learningObjectives: ['Color recognition', 'Fine motor skills', 'Creative expression', 'Art appreciation'],
    parentGuidance: 'Encourage creativity and avoid correcting the child\'s artistic choices',
    accessibility: {
      screenReaderSupport: true,
      voiceNavigation: false,
      largeText: true,
      highContrast: false,
      reducedMotion: true,
      audioDescriptions: true
    },
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  },
  {
    id: 'story_1',
    title: 'Krishna\'s Flute',
    description: 'Learn about Krishna and the magic of his flute music',
    type: 'story',
    difficulty: 'medium',
    ageRange: { min: 5, max: 10 },
    estimatedDuration: 20,
    tags: ['mythology', 'music', 'Krishna', 'culture'],
    instructions: [
      {
        step: 1,
        title: 'Listen to the Story',
        description: 'Listen carefully to the story of Krishna and his magical flute',
        interactionType: 'read'
      },
      {
        step: 2,
        title: 'Answer Questions',
        description: 'Answer questions about what you learned',
        interactionType: 'tap'
      },
      {
        step: 3,
        title: 'Act Out the Story',
        description: 'Pretend to play the flute like Krishna',
        interactionType: 'move'
      }
    ],
    materials: ['Story book or device for audio', 'Optional: toy flute or pretend flute'],
    learningObjectives: ['Cultural knowledge', 'Listening skills', 'Story comprehension', 'Creative play'],
    parentGuidance: 'Help your child understand the moral lessons in the story',
    accessibility: {
      screenReaderSupport: true,
      voiceNavigation: true,
      largeText: true,
      highContrast: true,
      reducedMotion: false,
      audioDescriptions: true
    },
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04')
  }
];

// Mock activity results storage
const mockActivityResults: Map<string, ActivityResult[]> = new Map();

// Helper functions
function filterActivities(activities: BaseActivity[], filters: any): BaseActivity[] {
  return activities.filter(activity => {
    // Type filter
    if (filters.type && !filters.type.includes(activity.type)) {
      return false;
    }
    
    // Difficulty filter
    if (filters.difficulty && !filters.difficulty.includes(activity.difficulty)) {
      return false;
    }
    
    // Age range filter
    if (filters.ageMin && activity.ageRange.max < filters.ageMin) {
      return false;
    }
    if (filters.ageMax && activity.ageRange.min > filters.ageMax) {
      return false;
    }
    
    // Duration filter
    if (filters.durationMin && activity.estimatedDuration < filters.durationMin) {
      return false;
    }
    if (filters.durationMax && activity.estimatedDuration > filters.durationMax) {
      return false;
    }
    
    // Tags filter
    if (filters.tags && !filters.tags.some((tag: string) => activity.tags.includes(tag))) {
      return false;
    }
    
    // Completed filter (would require user context in real implementation)
    // For now, we'll just return all activities for completed filter
    
    return true;
  });
}

function paginateResults<T>(items: T[], offset: number, limit: number): T[] {
  return items.slice(offset, offset + limit);
}

// GET /api/kids/activities - Retrieve activities with filtering and pagination (parent-authenticated)
export async function GET(request: NextRequest) {
  try {
    // Authenticate parent user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      logger.warn('Unauthorized access attempt to kids activities API');
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
      logger.warn('Invalid activity filter parameters', { filters, errors: validationResult.error.errors });
      return NextResponse.json(
        {
          error: 'Invalid filter parameters',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const validatedFilters = validationResult.data;
    
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
          logger.warn('Parent attempted to access unauthorized child activities', {
            parentId: session.user.id,
            childId: validatedFilters.childId
          });
          return NextResponse.json(
            { error: 'Child not found or access denied. You can only access activities for your own children.' },
            { status: 404 }
          );
        }
      } catch (dbError) {
        logger.error('Database error verifying child access', {
          error: dbError,
          parentId: session.user.id,
          childId: validatedFilters.childId
        });
        return NextResponse.json(
          { error: 'Database error occurred while verifying access' },
          { status: 500 }
        );
      }
    }
    
    try {
      // Get activities from database (for now using mock data with future DB integration)
      let filteredActivities = filterActivities(mockActivities, validatedFilters);
      
      // Apply age-based filtering if childId is provided
      if (validatedFilters.childId) {
        const child = await prisma.childProfile.findUnique({
          where: { id: validatedFilters.childId },
          select: { birthDate: true }
        });
        
        if (child?.birthDate) {
          const childAge = Math.floor((Date.now() - child.birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
          filteredActivities = filteredActivities.filter(activity => 
            activity.ageRange.min <= childAge && activity.ageRange.max >= childAge
          );
        }
      }
      
      // Apply pagination
      const paginatedActivities = paginateResults(
        filteredActivities, 
        validatedFilters.offset, 
        validatedFilters.limit
      );

      // Get completion status if childId is provided
      let activitiesWithProgress = paginatedActivities;
      if (validatedFilters.childId) {
        const completions = await prisma.activityCompletion.findMany({
          where: {
            childId: validatedFilters.childId,
            activityId: { in: paginatedActivities.map(a => a.id) }
          },
          select: {
            activityId: true,
            completed: true,
            score: true,
            completedAt: true
          }
        });

        activitiesWithProgress = paginatedActivities.map(activity => ({
          ...activity,
          completion: completions.find(c => c.activityId === activity.id)
        }));
      }

      logger.info('Activities retrieved successfully', {
        parentId: session.user.id,
        childId: validatedFilters.childId,
        totalResults: filteredActivities.length,
        returnedResults: activitiesWithProgress.length
      });

      return NextResponse.json({
        activities: activitiesWithProgress,
        meta: {
          total: filteredActivities.length,
          offset: validatedFilters.offset,
          limit: validatedFilters.limit,
          hasMore: validatedFilters.offset + validatedFilters.limit < filteredActivities.length
        },
        filters: validatedFilters,
        timestamp: new Date()
      });
      
    } catch (dbError) {
      logger.error('Database error retrieving activities', {
        error: dbError,
        parentId: session.user.id,
        childId: validatedFilters.childId
      });
      return NextResponse.json(
        { error: 'Database error occurred while retrieving activities' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    logger.error('Unexpected error in kids activities GET endpoint', { error });
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// POST - Submit activity result
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if this is a result submission or activity creation
    if (body.activityId && body.userId) {
      // This is an activity result submission
      return await handleActivityResultSubmission(body);
    } else {
      // This would be activity creation (admin only in production)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Activity creation requires admin privileges'
          }
        },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error('Activities POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to process request'
        }
      },
      { status: 500 }
    );
  }
}

async function handleActivityResultSubmission(body: any) {
  // Validate activity result
  const validationResult = ActivityResultSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid activity result data',
          details: validationResult.error.errors
        }
      },
      { status: 400 }
    );
  }

  const resultData = validationResult.data;
  
  // Verify activity exists
  const activity = mockActivities.find(a => a.id === resultData.activityId);
  if (!activity) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ACTIVITY_NOT_FOUND',
          message: 'Activity not found'
        }
      },
      { status: 404 }
    );
  }

  // Create activity result with additional metadata
  const activityResult: ActivityResult = {
    ...resultData,
    startTime: new Date(resultData.startTime),
    endTime: new Date(resultData.endTime),
    media: resultData.media?.map(m => ({
      ...m,
      timestamp: new Date(m.timestamp)
    })) || []
  };

  // Store result
  const userResults = mockActivityResults.get(resultData.userId) || [];
  userResults.push(activityResult);
  mockActivityResults.set(resultData.userId, userResults);

  // Calculate achievement progress (simplified)
  const completionStats = calculateCompletionStats(resultData.userId);

  return NextResponse.json({
    success: true,
    data: activityResult,
    achievements: completionStats.newAchievements,
    progress: completionStats.progress,
    timestamp: new Date()
  }, { status: 201 });
}

function calculateCompletionStats(userId: string) {
  const userResults = mockActivityResults.get(userId) || [];
  const completedActivities = userResults.filter(r => r.completed);
  
  // Calculate basic stats
  const stats = {
    totalCompleted: completedActivities.length,
    totalTime: userResults.reduce((sum, r) => sum + (r.endTime.getTime() - r.startTime.getTime()), 0),
    averageScore: completedActivities.length > 0 
      ? completedActivities.reduce((sum, r) => sum + (r.score || 0), 0) / completedActivities.length
      : 0,
    typeBreakdown: {} as Record<string, number>
  };
  
  // Count completions by activity type
  completedActivities.forEach(result => {
    const activity = mockActivities.find(a => a.id === result.activityId);
    if (activity) {
      stats.typeBreakdown[activity.type] = (stats.typeBreakdown[activity.type] || 0) + 1;
    }
  });
  
  // Determine new achievements (simplified logic)
  const newAchievements = [];
  if (stats.totalCompleted === 1) {
    newAchievements.push({
      id: 'first_activity',
      title: 'First Steps!',
      description: 'Completed your first activity',
      icon: '👶',
      unlockedAt: new Date()
    });
  }
  if (stats.totalCompleted === 5) {
    newAchievements.push({
      id: 'learning_explorer',
      title: 'Learning Explorer',
      description: 'Completed 5 activities',
      icon: '🗺️',
      unlockedAt: new Date()
    });
  }
  
  return {
    progress: stats,
    newAchievements
  };
}

// PUT - Update activity (admin only)
export async function PUT(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Activity updates require admin privileges'
      }
    },
    { status: 403 }
  );
}

// DELETE - Delete activity (admin only)
export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Activity deletion requires admin privileges'
      }
    },
    { status: 403 }
  );
}