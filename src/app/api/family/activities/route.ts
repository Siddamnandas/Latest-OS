import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

// Mock AI implementation to replace z-ai-web-dev-sdk
class MockZAI {
  chat = {
    completions: {
      create: async (params: any) => {
        const systemMessage = params.messages[0]?.content || '';
        const userMessage = params.messages[1]?.content || '';
        
        if (systemMessage.includes('activity recommendations')) {
          return {
            choices: [{
              message: {
                content: JSON.stringify({
                  recommendations: [
                    {
                      title: 'Creative Art Session',
                      description: 'Finger painting and drawing to develop fine motor skills',
                      category: 'cognitive',
                      difficulty: 'easy',
                      estimatedDuration: 30
                    },
                    {
                      title: 'Story Reading Time',
                      description: 'Interactive reading session to enhance language skills',
                      category: 'cognitive',
                      difficulty: 'easy',
                      estimatedDuration: 20
                    },
                    {
                      title: 'Outdoor Nature Walk',
                      description: 'Exploring nature to develop observation skills',
                      category: 'physical',
                      difficulty: 'medium',
                      estimatedDuration: 45
                    }
                  ],
                  insights: [
                    'Child shows strong interest in creative activities',
                    'Physical activities help improve coordination',
                    'Regular routine activities build confidence'
                  ],
                  nextMilestones: [
                    'Develop independent play skills',
                    'Improve social interaction abilities',
                    'Enhance problem-solving capabilities'
                  ]
                })
              }
            }]
          };
        } else {
          return {
            choices: [{
              message: {
                content: JSON.stringify({
                  suggestions: [
                    {
                      title: 'Building Blocks Challenge',
                      description: 'Create structures using different colored blocks',
                      type: 'learning',
                      duration: 25,
                      benefits: ['Spatial awareness', 'Problem solving', 'Fine motor skills'],
                      materials: ['Building blocks', 'Colored paper', 'Markers']
                    },
                    {
                      title: 'Family Cooking Activity',
                      description: 'Simple cooking tasks appropriate for child\'s age',
                      type: 'family',
                      duration: 35,
                      benefits: ['Following instructions', 'Measuring skills', 'Family bonding'],
                      materials: ['Simple ingredients', 'Child-safe utensils', 'Apron']
                    },
                    {
                      title: 'Musical Expression Time',
                      description: 'Singing, dancing, and playing simple instruments',
                      type: 'play',
                      duration: 20,
                      benefits: ['Rhythm development', 'Self-expression', 'Coordination'],
                      materials: ['Simple instruments', 'Music player', 'Scarves for dancing']
                    }
                  ]
                })
              }
            }]
          };
        }
      }
    }
  };
  
  static async create() {
    return new MockZAI();
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { childId, activityData, userId } = await request.json();

    if (!childId || !activityData || !userId) {
      return NextResponse.json({ error: 'Child ID, activity data, and user ID required' }, { status: 400 });
    }

    // Verify the user has access to this child
    const child = await db.child.findFirst({
      where: {
        id: childId,
        OR: [
          { parentId: userId },
          { coParentId: userId }
        ]
      }
    });

    if (!child) {
      return NextResponse.json({ error: 'Child not found or access denied' }, { status: 404 });
    }

    // Create activity record
    const newActivity = await db.childActivity.create({
      data: {
        childId,
        title: activityData.title,
        type: activityData.type,
        duration: activityData.duration,
        completed: activityData.completed || false,
        date: activityData.date || new Date().toISOString(),
        participants: activityData.participants || [],
        notes: activityData.notes,
        location: activityData.location
      }
    });

    // Get AI-powered activity recommendations based on this activity
    const zai = await MockZAI.create();
    const recommendationResponse = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a child development expert. Based on the logged activity, provide personalized recommendations for the child's development.
          Return a JSON response with:
          {
            "recommendations": [
              {
                "title": string,
                "description": string,
                "category": "physical" | "cognitive" | "emotional" | "social",
                "difficulty": "easy" | "medium" | "hard",
                "estimatedDuration": number (in minutes)
              }
            ],
            "insights": string[],
            "nextMilestones": string[]
          }`
        },
        {
          role: 'user',
          content: `Child age: ${child.age}, Activity: ${activityData.title}, Type: ${activityData.type}, Duration: ${activityData.duration} minutes`
        }
      ],
      temperature: 0.4,
      max_tokens: 600
    });

    const recommendationData = JSON.parse(recommendationResponse.choices[0].message.content || '{}');

    // Update child's development progress
    await db.developmentRecord.create({
      data: {
        childId,
        activityId: newActivity.id,
        type: activityData.type,
        duration: activityData.duration,
        date: new Date().toISOString(),
        impact: 'positive' // Default impact, could be calculated based on activity type and duration
      }
    });

    return NextResponse.json({
      activity: newActivity,
      recommendations: recommendationData.recommendations || [],
      insights: recommendationData.insights || [],
      nextMilestones: recommendationData.nextMilestones || []
    });
  } catch (error) {
    logger.error('Error logging activity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');
    const userId = searchParams.get('userId');

    if (!childId || !userId) {
      return NextResponse.json({ error: 'Child ID and user ID required' }, { status: 400 });
    }

    // Verify access
    const child = await db.child.findFirst({
      where: {
        id: childId,
        OR: [
          { parentId: userId },
          { coParentId: userId }
        ]
      }
    });

    if (!child) {
      return NextResponse.json({ error: 'Child not found or access denied' }, { status: 404 });
    }

    // Get activities
    const activities = await db.childActivity.findMany({
      where: { childId },
      orderBy: { date: 'desc' },
      take: 50 // Limit to last 50 activities
    });

    // Get activity statistics
    const stats = await db.childActivity.groupBy({
      by: ['type'],
      where: { childId },
      _count: {
        type: true
      },
      _sum: {
        duration: true
      }
    });

    // Get AI-powered activity suggestions
    const zai = await MockZAI.create();
    const suggestionsResponse = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a child development expert. Based on the child's age and activity history, suggest age-appropriate activities.
          Return a JSON array of activity suggestions with:
          {
            "suggestions": [
              {
                "title": string,
                "description": string,
                "type": "learning" | "play" | "family" | "routine",
                "duration": number,
                "benefits": string[],
                "materials": string[]
              }
            ]
          }`
        },
        {
          role: 'user',
          content: `Child age: ${child.age}, Recent activities: ${activities.slice(0, 10).map(a => a.type).join(', ')}`
        }
      ],
      temperature: 0.4,
      max_tokens: 800
    });

    const suggestionsData = JSON.parse(suggestionsResponse.choices[0].message.content || '{"suggestions": []}');

    return NextResponse.json({
      activities,
      stats,
      suggestions: suggestionsData.suggestions || []
    });
  } catch (error) {
    logger.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}