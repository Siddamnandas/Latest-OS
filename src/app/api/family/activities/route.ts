import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';

function calculateAge(birthdate: Date | null): number | null {
  if (!birthdate) return null;
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const m = today.getMonth() - birthdate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  return age;
}

export async function POST(request: NextRequest) {
  try {
    const { childId, activityData, userId } = await request.json();

    if (!childId || !activityData || !userId) {
      return NextResponse.json({ error: 'Child ID, activity data, and user ID required' }, { status: 400 });
    }

    // Verify the user has access to this child
    const child = await db.child.findUnique({
      where: { id: childId },
      include: { couple: { include: { users: true } } }
    });

    if (!child || !child.couple.users.some(user => user.id === userId)) {
      return NextResponse.json({ error: 'Child not found or access denied' }, { status: 404 });
    }

    // Create activity record
    const newActivity = await db.familyActivity.create({
      data: {
        child_id: childId,
        activity_type: activityData.type,
        activity_theme: activityData.theme,
        completion_data: {
          title: activityData.title,
          duration: activityData.duration,
          completed: activityData.completed || false,
          date: activityData.date || new Date().toISOString(),
          participants: activityData.participants || [],
          notes: activityData.notes,
          location: activityData.location
        }
      }
    });

    // Get AI-powered activity recommendations based on this activity
    const zai = await ZAI.create();
    const age = calculateAge(child.birthdate);
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
          content: `Child age: ${age}, Activity: ${activityData.title}, Type: ${activityData.type}, Duration: ${activityData.duration} minutes`
        }
      ],
      temperature: 0.4,
      max_tokens: 600
    });

    const recommendationData = JSON.parse(recommendationResponse.choices[0].message.content || '{}');

    return NextResponse.json({
      activity: newActivity,
      recommendations: recommendationData.recommendations || [],
      insights: recommendationData.insights || [],
      nextMilestones: recommendationData.nextMilestones || []
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');
    const userId = searchParams.get('userId');

    if (!childId || !userId) {
      return NextResponse.json({ error: 'Child ID and user ID required' }, { status: 400 });
    }

    // Verify access
    const child = await db.child.findUnique({
        where: { id: childId },
        include: { couple: { include: { users: true } } }
    });

    if (!child || !child.couple.users.some(user => user.id === userId)) {
      return NextResponse.json({ error: 'Child not found or access denied' }, { status: 404 });
    }

    // Get activities
    const activities = await db.familyActivity.findMany({
      where: { child_id: childId },
      orderBy: { created_at: 'desc' },
      take: 50 // Limit to last 50 activities
    });

    // Get activity statistics
    const stats = await db.familyActivity.groupBy({
      by: ['activity_type'],
      where: { child_id: childId },
      _count: {
        activity_type: true
      }
    });

    // Get AI-powered activity suggestions
    const zai = await ZAI.create();
    const age = calculateAge(child.birthdate);
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
          content: `Child age: ${age}, Recent activities: ${activities.slice(0, 10).map(a => a.activity_type).join(', ')}`
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
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
