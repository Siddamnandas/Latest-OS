// Kids Activities Profile API Route
// Production-ready API with error handling, validation, and security

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { KidsProfile } from '@/types/kids-activities';

// Validation schemas
const CreateProfileSchema = z.object({
  name: z.string().min(1).max(50),
  age: z.number().min(3).max(18),
  ageGroup: z.enum(['toddler', 'preschool', 'elementary', 'preteen']),
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

// GET - Retrieve profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('id') || 'current';

    // In production, this would query the database
    const profile = mockProfiles.get(profileId);
    
    if (!profile) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'PROFILE_NOT_FOUND', 
            message: 'Profile not found' 
          } 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve profile'
        }
      },
      { status: 500 }
    );
  }
}

// POST - Create new profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = CreateProfileSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid profile data',
            details: validationResult.error.errors
          }
        },
        { status: 400 }
      );
    }

    const profileData = validationResult.data;
    const newProfile = createDefaultProfile(profileData);
    
    // Store in mock database
    mockProfiles.set(newProfile.id, newProfile);
    mockProfiles.set('current', newProfile); // Also store as current user

    return NextResponse.json({
      success: true,
      data: newProfile,
      timestamp: new Date()
    }, { status: 201 });
  } catch (error) {
    console.error('Profile POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create profile'
        }
      },
      { status: 500 }
    );
  }
}

// PUT - Update profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('id') || 'current';

    // Validate input
    const validationResult = UpdateProfileSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid profile data',
            details: validationResult.error.errors
          }
        },
        { status: 400 }
      );
    }

    const existingProfile = mockProfiles.get(profileId);
    if (!existingProfile) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PROFILE_NOT_FOUND',
            message: 'Profile not found'
          }
        },
        { status: 404 }
      );
    }

    // Merge updates with existing profile
    const updatedProfile: KidsProfile = {
      ...existingProfile,
      ...validationResult.data,
      preferences: {
        ...existingProfile.preferences,
        ...validationResult.data.preferences
      },
      updatedAt: new Date()
    };

    mockProfiles.set(profileId, updatedProfile);
    if (profileId === 'current') {
      mockProfiles.set(updatedProfile.id, updatedProfile);
    }

    return NextResponse.json({
      success: true,
      data: updatedProfile,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Profile PUT error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update profile'
        }
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete profile (with safety checks)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('id');
    
    if (!profileId || profileId === 'current') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Profile ID required and cannot be "current"'
          }
        },
        { status: 400 }
      );
    }

    const existingProfile = mockProfiles.get(profileId);
    if (!existingProfile) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PROFILE_NOT_FOUND',
            message: 'Profile not found'
          }
        },
        { status: 404 }
      );
    }

    // Safety check - require parent approval for deletion
    const confirmHeader = request.headers.get('x-parent-confirmation');
    if (confirmHeader !== 'confirmed') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PARENT_APPROVAL_REQUIRED',
            message: 'Parent confirmation required for profile deletion'
          }
        },
        { status: 403 }
      );
    }

    mockProfiles.delete(profileId);

    return NextResponse.json({
      success: true,
      message: 'Profile deleted successfully',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Profile DELETE error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete profile'
        }
      },
      { status: 500 }
    );
  }
}