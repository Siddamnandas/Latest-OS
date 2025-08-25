// Kids Activities Profile API Route
// Production-ready API with authentication, error handling, validation, and security
// Parent-managed system: Parents authenticate and manage their children's profiles

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { KidsProfile } from '@/types/kids-activities';
import { authOptions } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

// Validation schemas
const CreateProfileSchema = z.object({
  name: z.string().min(1).max(50),
  birthDate: z.string().datetime(),
  avatar: z.string().url().optional(),
  preferences: z.object({
    learningStyle: z.enum(['visual', 'auditory', 'kinesthetic', 'mixed']),
    favoriteActivities: z.array(z.string()),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    parentalControls: z.object({
      screenTimeLimit: z.number().min(10).max(480), // 10 minutes to 8 hours
      allowedTimeSlots: z.array(z.object({
        start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        days: z.array(z.number().min(0).max(6))
      })),
      contentFilters: z.array(z.string()),
      requireParentApproval: z.boolean(),
      accessibilityEnabled: z.boolean(),
      highContrastMode: z.boolean(),
      textToSpeechEnabled: z.boolean()
    })
  }).optional()
});

const GetProfileSchema = z.object({
  childId: z.string().uuid('Invalid child ID format').optional()
});

const UpdateProfileSchema = CreateProfileSchema.partial();

// Mock database - In production, this would be replaced with actual database operations
let mockProfiles: Map<string, KidsProfile> = new Map();

// Helper function to create default profile
function createDefaultProfile(data: any): KidsProfile {
  return {
    id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: data.name,
    age: data.age,
    ageGroup: data.ageGroup,
    avatar: data.avatar || '👶',
    preferences: {
      learningStyle: data.preferences?.learningStyle || 'mixed',
      favoriteActivities: data.preferences?.favoriteActivities || ['emotion', 'kindness'],
      difficulty: data.preferences?.difficulty || 'easy',
      parentalControls: {
        screenTimeLimit: 60, // 1 hour default
        allowedTimeSlots: [
          { start: '09:00', end: '17:00', days: [1, 2, 3, 4, 5] }, // Weekdays
          { start: '10:00', end: '18:00', days: [0, 6] } // Weekends
        ],
        contentFilters: ['age-appropriate'],
        requireParentApproval: true,
        accessibilityEnabled: false,
        highContrastMode: false,
        textToSpeechEnabled: false
      }
    },
    progress: {
      totalActivitiesCompleted: 0,
      skillsAcquired: [],
      currentStreak: 0,
      longestStreak: 0,
      kindnessPoints: 0,
      creativityScore: 0,
      emotionalIntelligenceLevel: 1,
      weeklyGoals: [],
      monthlyMilestones: [],
      learningPath: {
        currentLevel: 1,
        nextMilestone: {
          id: '1',
          title: 'First Steps',
          description: 'Complete your first activity',
          achieved: false
        },
        recommendedActivities: [],
        weakAreas: [],
        strengthAreas: [],
        adaptiveContent: true
      }
    },
    achievements: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// GET /api/kids/profile - Retrieve child profile(s) (parent-authenticated)
export async function GET(request: NextRequest) {
  try {
    // Authenticate parent user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      logger.warn('Unauthorized access attempt to kids profile API');
      return NextResponse.json(
        { error: 'Authentication required. Parents must be logged in to access child profiles.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');
    
    const validationResult = GetProfileSchema.safeParse({ childId });
    if (!validationResult.success) {
      logger.warn('Invalid profile request parameters', { errors: validationResult.error.errors });
      return NextResponse.json(
        {
          error: 'Invalid request parameters',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    try {
      if (childId) {
        // Get specific child profile
        const child = await prisma.childProfile.findFirst({
          where: {
            id: childId,
            parentId: session.user.id
          },
          include: {
            progress: true,
            achievements: true,
            goals: true
          }
        });

        if (!child) {
          logger.warn('Parent attempted to access unauthorized child profile', {
            parentId: session.user.id,
            childId
          });
          return NextResponse.json(
            { error: 'Child profile not found or access denied.' },
            { status: 404 }
          );
        }

        // Calculate age from birth date
        const age = Math.floor((Date.now() - child.birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        const ageGroup = age <= 4 ? 'toddler' : age <= 6 ? 'preschool' : age <= 12 ? 'elementary' : 'preteen';

        logger.info('Child profile retrieved successfully', {
          parentId: session.user.id,
          childId
        });

        return NextResponse.json({
          child: {
            ...child,
            age,
            ageGroup
          }
        });
      } else {
        // Get all children for this parent
        const children = await prisma.childProfile.findMany({
          where: {
            parentId: session.user.id
          },
          include: {
            progress: true,
            achievements: {
              orderBy: {
                earnedAt: 'desc'
              },
              take: 5 // Latest 5 achievements per child
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        });

        const childrenWithAge = children.map(child => {
          const age = Math.floor((Date.now() - child.birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
          const ageGroup = age <= 4 ? 'toddler' : age <= 6 ? 'preschool' : age <= 12 ? 'elementary' : 'preteen';
          return {
            ...child,
            age,
            ageGroup
          };
        });

        logger.info('All children profiles retrieved successfully', {
          parentId: session.user.id,
          childrenCount: children.length
        });

        return NextResponse.json({
          children: childrenWithAge,
          total: children.length
        });
      }

    } catch (dbError) {
      logger.error('Database error retrieving child profile', {
        error: dbError,
        parentId: session.user.id,
        childId
      });
      return NextResponse.json(
        { error: 'Database error occurred while retrieving profile' },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error('Unexpected error in kids profile GET endpoint', { error });
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// POST /api/kids/profile - Create new child profile (parent-authenticated)
export async function POST(request: NextRequest) {
  try {
    // Authenticate parent user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      logger.warn('Unauthorized access attempt to create child profile');
      return NextResponse.json(
        { error: 'Authentication required. Parents must be logged in to create child profiles.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = CreateProfileSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn('Invalid profile creation data', { errors: validationResult.error.errors });
      return NextResponse.json(
        {
          error: 'Invalid profile data',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const profileData = validationResult.data;

    try {
      // Check if parent already has maximum number of children (e.g., 10)
      const existingChildrenCount = await prisma.childProfile.count({
        where: {
          parentId: session.user.id
        }
      });

      if (existingChildrenCount >= 10) {
        logger.warn('Parent attempted to create too many child profiles', {
          parentId: session.user.id,
          currentCount: existingChildrenCount
        });
        return NextResponse.json(
          { error: 'Maximum number of child profiles reached (10). Please contact support if you need more.' },
          { status: 400 }
        );
      }

      // Create child profile in database
      const newChild = await prisma.childProfile.create({
        data: {
          name: profileData.name,
          birthDate: new Date(profileData.birthDate),
          avatar: profileData.avatar,
          parentId: session.user.id,
          preferences: profileData.preferences || {
            learningStyle: 'mixed',
            favoriteActivities: ['emotion', 'kindness'],
            difficulty: 'easy',
            parentalControls: {
              screenTimeLimit: 60,
              allowedTimeSlots: [
                { start: '09:00', end: '17:00', days: [1, 2, 3, 4, 5] },
                { start: '10:00', end: '18:00', days: [0, 6] }
              ],
              contentFilters: ['age-appropriate'],
              requireParentApproval: true,
              accessibilityEnabled: false,
              highContrastMode: false,
              textToSpeechEnabled: false
            }
          }
        }
      });

      // Create initial progress record
      await prisma.childProgress.create({
        data: {
          childId: newChild.id,
          totalActivitiesCompleted: 0,
          currentStreak: 0,
          longestStreak: 0,
          kindnessPoints: 0,
          creativityScore: 0,
          emotionalIntelligenceLevel: 1
        }
      });

      // Calculate age and age group
      const age = Math.floor((Date.now() - newChild.birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      const ageGroup = age <= 4 ? 'toddler' : age <= 6 ? 'preschool' : age <= 12 ? 'elementary' : 'preteen';

      logger.info('Child profile created successfully', {
        parentId: session.user.id,
        childId: newChild.id,
        childName: newChild.name,
        age
      });

      return NextResponse.json({
        child: {
          ...newChild,
          age,
          ageGroup
        },
        message: 'Child profile created successfully'
      }, { status: 201 });

    } catch (dbError) {
      logger.error('Database error creating child profile', {
        error: dbError,
        parentId: session.user.id
      });
      return NextResponse.json(
        { error: 'Database error occurred while creating profile' },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error('Unexpected error in kids profile POST endpoint', { error });
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// PUT /api/kids/profile - Update child profile (parent-authenticated)
export async function PUT(request: NextRequest) {
  try {
    // Authenticate parent user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      logger.warn('Unauthorized access attempt to update child profile');
      return NextResponse.json(
        { error: 'Authentication required. Parents must be logged in to update child profiles.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');

    if (!childId) {
      return NextResponse.json(
        { error: 'Child ID is required' },
        { status: 400 }
      );
    }

    // Validate input
    const UpdateProfileSchema = CreateProfileSchema.partial();
    const validationResult = UpdateProfileSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn('Invalid profile update data', { errors: validationResult.error.errors });
      return NextResponse.json(
        {
          error: 'Invalid profile data',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const updates = validationResult.data;

    try {
      // Verify parent-child relationship
      const existingChild = await prisma.childProfile.findFirst({
        where: {
          id: childId,
          parentId: session.user.id
        }
      });

      if (!existingChild) {
        logger.warn('Parent attempted to update unauthorized child profile', {
          parentId: session.user.id,
          childId
        });
        return NextResponse.json(
          { error: 'Child profile not found or access denied.' },
          { status: 404 }
        );
      }

      // Prepare update data
      const updateData: any = {};
      if (updates.name) updateData.name = updates.name;
      if (updates.birthDate) updateData.birthDate = new Date(updates.birthDate);
      if (updates.avatar) updateData.avatar = updates.avatar;
      if (updates.preferences) {
        // Merge preferences with existing ones
        updateData.preferences = {
          ...existingChild.preferences,
          ...updates.preferences
        };
      }
      updateData.updatedAt = new Date();

      // Update child profile in database
      const updatedChild = await prisma.childProfile.update({
        where: {
          id: childId
        },
        data: updateData,
        include: {
          progress: true,
          achievements: true
        }
      });

      // Calculate age and age group
      const age = Math.floor((Date.now() - updatedChild.birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      const ageGroup = age <= 4 ? 'toddler' : age <= 6 ? 'preschool' : age <= 12 ? 'elementary' : 'preteen';

      logger.info('Child profile updated successfully', {
        parentId: session.user.id,
        childId,
        updatedFields: Object.keys(updates)
      });

      return NextResponse.json({
        child: {
          ...updatedChild,
          age,
          ageGroup
        },
        message: 'Child profile updated successfully'
      });

    } catch (dbError) {
      logger.error('Database error updating child profile', {
        error: dbError,
        parentId: session.user.id,
        childId
      });
      return NextResponse.json(
        { error: 'Database error occurred while updating profile' },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error('Unexpected error in kids profile PUT endpoint', { error });
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// DELETE /api/kids/profile - Delete child profile (parent-authenticated)
export async function DELETE(request: NextRequest) {
  try {
    // Authenticate parent user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      logger.warn('Unauthorized access attempt to delete child profile');
      return NextResponse.json(
        { error: 'Authentication required. Parents must be logged in to delete child profiles.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');

    if (!childId) {
      return NextResponse.json(
        { error: 'Child ID is required' },
        { status: 400 }
      );
    }

    // Safety check - require parent confirmation
    const confirmHeader = request.headers.get('x-parent-confirmation');
    if (confirmHeader !== 'confirmed') {
      return NextResponse.json(
        { error: 'Parent confirmation required for profile deletion. Add x-parent-confirmation: confirmed header.' },
        { status: 403 }
      );
    }

    try {
      // Verify parent-child relationship
      const existingChild = await prisma.childProfile.findFirst({
        where: {
          id: childId,
          parentId: session.user.id
        }
      });

      if (!existingChild) {
        logger.warn('Parent attempted to delete unauthorized child profile', {
          parentId: session.user.id,
          childId
        });
        return NextResponse.json(
          { error: 'Child profile not found or access denied.' },
          { status: 404 }
        );
      }

      // Delete child profile and all related data (cascade delete)
      await prisma.childProfile.delete({
        where: {
          id: childId
        }
      });

      logger.info('Child profile deleted successfully', {
        parentId: session.user.id,
        childId,
        childName: existingChild.name
      });

      return NextResponse.json({
        message: 'Child profile deleted successfully'
      });

    } catch (dbError) {
      logger.error('Database error deleting child profile', {
        error: dbError,
        parentId: session.user.id,
        childId
      });
      return NextResponse.json(
        { error: 'Database error occurred while deleting profile' },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error('Unexpected error in kids profile DELETE endpoint', { error });
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} }
    );
  }
}