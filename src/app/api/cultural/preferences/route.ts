import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get user cultural preferences
    const preferences = await db.culturalPreference.findUnique({
      where: { userId }
    });

    // Get personalized content recommendations
    const personalizedContent = await getPersonalizedContent(userId, preferences);

    // Get cultural insights
    const insights = await getCulturalInsights(userId, preferences);

    return NextResponse.json({
      preferences,
      personalizedContent,
      insights
    });
  } catch (error) {
    console.error('Error fetching cultural preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { userId, preferences } = await request.json();

    if (!userId || !preferences) {
      return NextResponse.json({ error: 'User ID and preferences required' }, { status: 400 });
    }

    // Update cultural preferences
    const updatedPreferences = await db.culturalPreference.upsert({
      where: { userId },
      update: preferences,
      create: {
        userId,
        ...preferences
      }
    });

    // Generate new personalized content based on updated preferences
    const personalizedContent = await getPersonalizedContent(userId, updatedPreferences);

    return NextResponse.json({
      preferences: updatedPreferences,
      personalizedContent
    });
  } catch (error) {
    console.error('Error updating cultural preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getPersonalizedContent(userId: string, preferences: any) {
  const zai = await ZAI.create();
  
  const contentResponse = await zai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are a cultural expert specializing in Indian traditions and relationships. 
        Generate personalized content recommendations based on the user's cultural preferences.
        Return a JSON array of content items with:
        {
          "content": [
            {
              "id": string,
              "type": "festival" | "recipe" | "music" | "tradition" | "story",
              "title": string,
              "description": string,
              "culturalContext": string,
              "relevanceScore": number (0-100),
              "category": string,
              "actionItems": string[]
            }
          ]
        }`
      },
      {
        role: 'user',
        content: `Generate personalized content for a user with these preferences: ${JSON.stringify(preferences)}`
      }
    ],
    temperature: 0.4,
    max_tokens: 1000
  });

  const contentData = JSON.parse(contentResponse.choices[0].message.content || '{"content": []}');
  return contentData.content || [];
}

async function getCulturalInsights(userId: string, preferences: any) {
  const zai = await ZAI.create();
  
  const insightsResponse = await zai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are a cultural relationship expert. Analyze the user's cultural preferences and provide insights.
        Return a JSON response with:
        {
          "compatibilityScore": number (0-100),
          "strengths": string[],
          "recommendations": string[],
          "seasonalSuggestions": string[],
          "relationshipTips": string[]
        }`
      },
      {
        role: 'user',
        content: `Analyze cultural preferences for relationship insights: ${JSON.stringify(preferences)}`
      }
    ],
    temperature: 0.3,
    max_tokens: 600
  });

  const insightsData = JSON.parse(insightsResponse.choices[0].message.content || '{}');
  return insightsData;
}