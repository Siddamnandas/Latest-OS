import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get children data from database
    const children = await db.child.findMany({
      where: { 
        OR: [
          { parentId: userId },
          { coParentId: userId }
        ]
      },
      include: {
        milestones: true,
        activities: true,
        developmentRecords: true
      }
    });

    // Calculate development scores using AI
    const zai = await ZAI.create();
    
    const childrenWithScores = await Promise.all(
      children.map(async (child) => {
        const developmentData = {
          age: child.age,
          milestones: child.milestones,
          activities: child.activities,
          developmentRecords: child.developmentRecords
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
  try {
    const { userId, childData } = await request.json();

    if (!userId || !childData) {
      return NextResponse.json({ error: 'User ID and child data required' }, { status: 400 });
    }

    // Create new child record
    const newChild = await db.child.create({
      data: {
        name: childData.name,
        age: childData.age,
        parentId: userId,
        coParentId: childData.coParentId || null,
        avatar: childData.avatar || null,
        birthDate: childData.birthDate,
        gender: childData.gender
      }
    });

    // Initialize standard milestones based on age
    const zai = await ZAI.create();
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
    
    // Create milestone records
    await Promise.all(
      milestonesData.milestones.map((milestone: any) =>
        db.childMilestone.create({
          data: {
            childId: newChild.id,
            title: milestone.title,
            category: milestone.category,
            ageAchieved: milestone.ageAchieved,
            importance: milestone.importance,
            description: milestone.description,
            isAchieved: false
          }
        })
      )
    );

    return NextResponse.json({ 
      child: newChild,
      milestones: milestonesData.milestones 
    });
  } catch (error) {
    console.error('Error creating child:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}