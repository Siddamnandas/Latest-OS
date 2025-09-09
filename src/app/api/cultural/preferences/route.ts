import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Mock AI implementation to replace z-ai-web-dev-sdk
class MockZAI {
  chat = {
    completions: {
      create: async (params: any) => {
        const systemMessage = params.messages[0]?.content || '';
        const userMessage = params.messages[1]?.content || '';
        
        if (systemMessage.includes('personalized content')) {
          return {
            choices: [{
              message: {
                content: JSON.stringify({
                  content: [
                    {
                      id: 'festival_1',
                      type: 'festival',
                      title: 'Karva Chauth Celebration Ideas',
                      description: 'Traditional festival celebrating marital love and commitment',
                      culturalContext: 'North Indian tradition strengthening couple bonds',
                      relevanceScore: 95,
                      category: 'festivals',
                      actionItems: ['Plan special dinner', 'Exchange meaningful gifts', 'Create photo memories']
                    },
                    {
                      id: 'recipe_1',
                      type: 'recipe',
                      title: 'Romantic Rajasthani Thali',
                      description: 'Traditional meal perfect for couple dining',
                      culturalContext: 'Rajasthani cuisine with aphrodisiac spices',
                      relevanceScore: 88,
                      category: 'cuisine',
                      actionItems: ['Shop for ingredients', 'Cook together', 'Share stories while eating']
                    },
                    {
                      id: 'music_1',
                      type: 'music',
                      title: 'Classical Ragas for Romance',
                      description: 'Traditional Indian music to enhance intimacy',
                      culturalContext: 'Evening ragas that promote emotional connection',
                      relevanceScore: 82,
                      category: 'arts',
                      actionItems: ['Create playlist', 'Listen during dinner', 'Learn about ragas together']
                    }
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
                  compatibilityScore: 85,
                  strengths: [
                    'Strong cultural values alignment',
                    'Shared interest in traditional practices',
                    'Good balance of modern and traditional approaches'
                  ],
                  recommendations: [
                    'Explore regional festivals together',
                    'Learn traditional cooking recipes',
                    'Plan cultural heritage trips'
                  ],
                  seasonalSuggestions: [
                    'Winter: Plan warm traditional meals and indoor cultural activities',
                    'Spring: Celebrate Holi with natural colors and traditional sweets',
                    'Summer: Focus on cooling traditional drinks and indoor cultural practices'
                  ],
                  relationshipTips: [
                    'Use cultural storytelling to deepen emotional connection',
                    'Involve families in cultural celebrations to strengthen bonds',
                    'Create new traditions that blend both partners\'s backgrounds'
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

    // Schema mismatch: CulturalPreference is not keyed by userId in current schema
    // For now, return no stored preferences and rely on generated recommendations
    const preferences = null;

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

    // Schema mismatch: store/update not supported yet; echo back
    const updatedPreferences = preferences;
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
  const zai = await MockZAI.create();
  
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
  const zai = await MockZAI.create();
  
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
