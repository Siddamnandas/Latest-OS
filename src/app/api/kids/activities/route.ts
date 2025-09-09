import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/kids/activities - Fetch activities for kids
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the couple this user belongs to
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { couple: true },
    });

    if (!user?.couple) {
      return NextResponse.json({ error: 'User not associated with a couple' }, { status: 404 });
    }

    const url = new URL(request.url);
    const type = url.searchParams.get('type'); // emotion, mythology, creativity, etc.
    const ageMin = parseInt(url.searchParams.get('ageMin') || '3');
    const ageMax = parseInt(url.searchParams.get('ageMax') || '12');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const childId = url.searchParams.get('childId');

    // Build where clause
    const where: any = {
      isActive: true,
      ageMin: { lte: ageMax },
      ageMax: { gte: ageMin },
    };

    if (type) {
      where.type = type;
    }

    // Get child profile if specified
    let childProfile: any = null;
    if (childId) {
      childProfile = await prisma.childProfile.findFirst({
        where: { id: childId, parentId: session.user.id },
        include: { progress: true },
      });
    }

    // Fetch activities
    const activities = await prisma.activity.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        difficulty: true,
        ageMin: true,
        ageMax: true,
        estimatedDuration: true,
        tags: true,
        instructions: true,
        materials: true,
        learningObjectives: true,
        parentGuidance: true,
        safetyNotes: true,
        accessibility: true,
        createdAt: true,
      },
    });

    // Process JSON fields
    const processedActivities = activities.map(activity => ({
      ...activity,
      tags: JSON.parse(activity.tags),
      instructions: JSON.parse(activity.instructions),
      materials: JSON.parse(activity.materials),
      learningObjectives: JSON.parse(activity.learningObjectives),
      safetyNotes: JSON.parse(activity.safetyNotes),
      accessibility: JSON.parse(activity.accessibility),
    }));

    // If child profile is provided, add completion status
    let activitiesWithProgress = processedActivities;
    if (childProfile) {
      // Get activity completions for this child
      const completions = await prisma.activityCompletion.findMany({
        where: {
          childId: childId as string,
          completed: true,
        },
        select: {
          activityId: true,
          completedAt: true,
          score: true,
        },
      });

      const completionMap = new Map(completions.map(c => [c.activityId, c]));

      activitiesWithProgress = processedActivities.map(activity => ({
        ...activity,
        completed: completionMap.has(activity.id),
        lastCompleted: completionMap.get(activity.id)?.completedAt,
        bestScore: completionMap.get(activity.id)?.score,
      }));
    }

    return NextResponse.json({
      activities: activitiesWithProgress,
      childProfile: childProfile ? {
        id: childProfile.id,
        name: childProfile.name,
        currentLevel: childProfile.progress?.emotionalIntelligenceLevel || 1,
        totalPoints: childProfile.progress?.kindnessPoints || 0,
      } : null,
    });

  } catch (error) {
    console.error('Error fetching kids activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/kids/activities - Create or complete an activity
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { activityId, childId, action, data } = body;

    // Validate required fields
    if (!activityId || !childId || !action) {
      return NextResponse.json(
        { error: 'activityId, childId, and action are required' },
        { status: 400 }
      );
    }

    // Verify child ownership
    const childProfile = await prisma.childProfile.findFirst({
      where: {
        id: childId,
        parentId: session.user.id,
      },
      include: { progress: true },
    });

    if (!childProfile) {
      return NextResponse.json({ error: 'Child profile not found or access denied' }, { status: 404 });
    }

    switch (action) {
      case 'start':
        // Create or update activity completion record (no composite unique key in schema)
        {
          const existing = await prisma.activityCompletion.findFirst({
            where: { childId: childId as string, activityId: activityId as string },
          });
          const completion = existing
            ? await prisma.activityCompletion.update({
                where: { id: existing.id },
                data: {
                  startTime: new Date(),
                  answers: JSON.stringify(data?.answers || {}),
                },
              })
            : await prisma.activityCompletion.create({
                data: {
                  childId: childId as string,
                  activityId: activityId as string,
                  startTime: new Date(),
                  endTime: new Date(),
                  answers: JSON.stringify(data?.answers || {}),
                },
              });

          return NextResponse.json({
            success: true,
            action: 'started',
            completion,
            message: 'Activity started',
          });
        }

      case 'complete':
        // Mark activity as completed and award points
        {
          const existing = await prisma.activityCompletion.findFirst({
            where: { childId: childId as string, activityId: activityId as string },
          });
          const completedActivity = existing
            ? await prisma.activityCompletion.update({
                where: { id: existing.id },
                data: {
                  endTime: new Date(),
                  completed: true,
                  score: data?.score || 100,
                  reflection: data?.reflection,
                  completedAt: new Date(),
                },
              })
            : await prisma.activityCompletion.create({
                data: {
                  childId: childId as string,
                  activityId: activityId as string,
                  startTime: new Date(),
                  endTime: new Date(),
                  completed: true,
                  score: data?.score || 100,
                  answers: JSON.stringify(data?.answers || {}),
                  reflection: data?.reflection,
                  completedAt: new Date(),
                },
              });

        // Award points based on activity type and difficulty
        const activity = await prisma.activity.findUnique({
          where: { id: activityId },
        });

        let pointsAwarded = 10; // Base points
        if (activity) {
          switch (activity.difficulty) {
            case 'easy': pointsAwarded = 15; break;
            case 'medium': pointsAwarded = 25; break;
            case 'hard': pointsAwarded = 40; break;
          }

          switch (activity.type) {
            case 'emotion': pointsAwarded += 5; break;
            case 'mythology': pointsAwarded += 10; break;
            case 'creativity': pointsAwarded += 7; break;
          }
        }

        // Update child progress
        await prisma.childProgress.upsert({
          where: { childId: childId },
          create: {
            childId: childId,
            emotionalIntelligenceLevel: 1,
            skillsAcquired: JSON.stringify([activity?.type || 'activity']),
            kindnessPoints: pointsAwarded,
          },
          update: {
            totalActivitiesCompleted: { increment: 1 },
            kindnessPoints: { increment: pointsAwarded },
            skillsAcquired: JSON.stringify(
              [
                ...JSON.parse(childProfile.progress?.skillsAcquired || '[]'),
                activity?.type || 'activity'
              ].filter((v, i, a) => a.indexOf(v) === i) // Unique
            ),
          },
        });

        // Create achievement if milestones reached
        const completedCount = await prisma.activityCompletion.count({
          where: {
            childId: childId,
            completed: true,
          },
        });

        if (completedCount === 5 || completedCount === 10 || completedCount === 25) {
          await prisma.childAchievement.create({
            data: {
              childId: childId,
              achievementId: `activities-${completedCount}`,
              name: `${completedCount} Activities Completed!`,
              description: `Amazing! You've completed ${completedCount} activities!`,
              icon: '🏆',
              rarity: completedCount >= 25 ? 'legendary' : completedCount >= 10 ? 'epic' : 'rare',
              requirements: JSON.stringify({ activitiesCompleted: completedCount }),
            },
          });
        }

        return NextResponse.json({
          success: true,
          action: 'completed',
          completion: completedActivity,
          pointsAwarded,
          totalActivities: completedCount,
          message: `Activity completed! You earned ${pointsAwarded} points!`,
        });
        }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "start" or "complete"' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error managing activity completion:', error);
    return NextResponse.json(
      { error: 'Failed to manage activity', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
