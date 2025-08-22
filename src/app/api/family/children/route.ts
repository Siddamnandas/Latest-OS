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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id: userId }});
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get children data from database
    const children = await db.child.findMany({
      where: { coupleId: user.couple_id },
      include: {
        activities: true
      }
    });

    // Calculate development scores using AI
    const zai = await ZAI.create();
    
    const childrenWithScores = await Promise.all(
      children.map(async (child) => {
        const age = calculateAge(child.birthdate);
        const developmentData = {
          age: age,
          activities: child.activities,
        };

        const analysis = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `You are a child development expert. Analyze the provided child development data and calculate an overall development score (0-100). 
              Consider activities completed. Return a JSON response with:
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

    const user = await db.user.findUnique({ where: { id: userId }});
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create new child record
    const newChild = await db.child.create({
      data: {
        coupleId: user.couple_id,
        name: childData.name,
        birthdate: childData.birthdate ? new Date(childData.birthdate) : null,
      }
    });

    return NextResponse.json({ 
      child: newChild,
    });
  } catch (error) {
    console.error('Error creating child:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
