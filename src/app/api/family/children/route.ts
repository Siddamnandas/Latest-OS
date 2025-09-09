import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Mock AI implementation to replace z-ai-web-dev-sdk
class MockZAI {
  chat = {
    completions: {
      create: async (params: any) => {
        const userMessage = params.messages[1]?.content || '';
        
        if (userMessage.includes('development data')) {
          return {
            choices: [{
              message: {
                content: JSON.stringify({
                  overallScore: Math.floor(Math.random() * 25) + 75, // 75-100
                  breakdown: {
                    physical: Math.floor(Math.random() * 20) + 80,
                    cognitive: Math.floor(Math.random() * 20) + 75,
                    emotional: Math.floor(Math.random() * 25) + 70,
                    social: Math.floor(Math.random() * 20) + 75
                  },
                  insights: [
                    'Child shows excellent progress in physical development',
                    'Cognitive skills are developing well for this age group',
                    'Social interactions are improving consistently'
                  ],
                  recommendations: [
                    'Continue encouraging creative play activities',
                    'Introduce more challenging cognitive tasks gradually',
                    'Plan regular social interaction opportunities'
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
                  milestones: [
                    {
                      title: 'Can walk independently',
                      category: 'physical',
                      ageAchieved: 12,
                      importance: 'high',
                      description: 'Child can walk without support for several steps'
                    },
                    {
                      title: 'Says first words',
                      category: 'cognitive',
                      ageAchieved: 12,
                      importance: 'high',
                      description: 'Child can say simple words like mama, dada'
                    },
                    {
                      title: 'Shows affection to familiar people',
                      category: 'emotional',
                      ageAchieved: 15,
                      importance: 'medium',
                      description: 'Child shows affection through hugs and kisses'
                    },
                    {
                      title: 'Plays simple games',
                      category: 'social',
                      ageAchieved: 18,
                      importance: 'medium',
                      description: 'Child engages in simple interactive games'
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

    // Get children data by user's couple (schema-aligned)
    const parent = await db.user.findUnique({ where: { id: userId } });
    const children = await db.child.findMany({
      where: { couple_id: parent?.couple_id || '' },
      orderBy: { created_at: 'desc' }
    });

    // Calculate development scores using Mock AI
    const zai = await MockZAI.create();
    
    const childrenWithScores = await Promise.all(
      children.map(async (child) => {
        const developmentData = {
          age: child.age,
          milestones: [],
          activities: [],
          developmentRecords: []
        };

        const analysis = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `You are a child development expert. Analyze the provided child development data and calculate an overall development score (0-100). 
              Consider milestones achieved, activities completed, and developmental progress. Return a JSON response with:
              {
                "overallScore": number,
                "breakdown": {
                  "physical": number,
                  "cognitive": number,
                  "emotional": number,
                  "social": number
                },
                "insights": string[],
                "recommendations": string[]
              }`
            },
            {
              role: 'user',
              content: JSON.stringify(developmentData)
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        });

        const analysisResult = JSON.parse(analysis.choices[0].message.content || '{}');
        
        return {
          ...child,
          developmentScore: analysisResult.overallScore || 75,
          developmentBreakdown: analysisResult.breakdown,
          insights: analysisResult.insights || [],
          recommendations: analysisResult.recommendations || []
        };
      })
    );

    return NextResponse.json({ children: childrenWithScores });
  } catch (error) {
    console.error('Error fetching children:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { userId, childData } = await request.json();

    if (!userId || !childData) {
      return NextResponse.json({ error: 'User ID and child data required' }, { status: 400 });
    }

    // Create new child record under the parent's couple; extra fields packed in preferences JSON
    const parent = await db.user.findUnique({ where: { id: userId } });
    const prefs = {
      avatar: childData.avatar || null,
      birthDate: childData.birthDate || null,
      gender: childData.gender || null,
      coParentId: childData.coParentId || null
    };
    const newChild = await db.child.create({
      data: {
        couple_id: parent?.couple_id || '',
        name: childData.name,
        age: Number(childData.age || 0),
        preferences: JSON.stringify(prefs)
      }
    });

    // Initialize standard milestones based on age
    const zai = await MockZAI.create();
    const milestonesResponse = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a child development expert. Generate age-appropriate developmental milestones for a ${childData.age}-year-old child.
          Return a JSON array of milestones with:
          {
            "milestones": [
              {
                "title": string,
                "category": "physical" | "cognitive" | "emotional" | "social",
                "ageAchieved": number (in months),
                "importance": "low" | "medium" | "high",
                "description": string
              }
            ]
          }`
        },
        {
          role: 'user',
          content: `Generate milestones for a ${childData.age}-year-old ${childData.gender || 'child'}`
        }
      ],
      temperature: 0.3,
      max_tokens: 800
    });

    const milestonesData = JSON.parse(milestonesResponse.choices[0].message.content || '{"milestones": []}');
    
    // TODO: Persist milestones when milestone model is available; return generated list for now

    return NextResponse.json({ 
      child: newChild,
      milestones: milestonesData.milestones 
    });
  } catch (error) {
    console.error('Error creating child:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
