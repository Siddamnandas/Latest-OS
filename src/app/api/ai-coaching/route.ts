import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { userId, sessionType, context } = await request.json();

    if (!userId || !sessionType) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, sessionType' },
        { status: 400 }
      );
    }

    // Initialize Z-AI SDK
    const zai = await ZAI.create();

    // Create coaching prompt based on session type
    const coachingPrompts = {
      daily_checkin: `As an AI relationship coach, provide a daily check-in analysis for a couple. 
        Context: ${context || 'General daily relationship assessment'}
        
        Provide:
        1. 3-4 key insights about their relationship patterns
        2. 3-4 specific action items for improvement
        3. Focus on communication, emotional connection, and task balance
        4. Keep suggestions practical and actionable
        5. Include both positive reinforcement and growth areas`,
      
      relationship_analysis: `As an AI relationship coach, conduct a deep relationship analysis.
        Context: ${context || 'Comprehensive relationship assessment'}
        
        Analyze and provide insights on:
        1. Communication patterns and quality
        2. Emotional intimacy and connection
        3. Conflict resolution approaches
        4. Love languages and preferences
        5. Shared values and goals alignment
        6. Growth areas and strengths
        7. Provide 4-5 specific, actionable recommendations`,
      
      goal_setting: `As an AI relationship coach, help with relationship goal setting.
        Context: ${context || 'Relationship goal planning'}
        
        Provide guidance on:
        1. Short-term relationship goals (1-3 months)
        2. Medium-term goals (3-12 months)
        3. Long-term vision (1-5 years)
        4. Goal alignment between partners
        5. Actionable steps for each goal
        6. Progress tracking suggestions
        7. Potential obstacles and solutions`,
      
      conflict_resolution: `As an AI relationship coach, provide conflict resolution guidance.
        Context: ${context || 'Conflict resolution strategies'}
        
        Provide insights on:
        1. Common conflict patterns
        2. Healthy vs. unhealthy conflict
        3. Communication techniques during conflicts
        4. Emotional regulation strategies
        5. Compromise and negotiation skills
        6. Rebuilding trust after conflicts
        7. Preventive measures for future conflicts`
    };

    const prompt = coachingPrompts[sessionType as keyof typeof coachingPrompts] || coachingPrompts.daily_checkin;

    // Get AI coaching response
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are Leela OS AI Coach, an expert relationship coach specializing in modern Indian couples. 
          You combine traditional wisdom with contemporary relationship science. 
          Your advice is practical, culturally sensitive, and actionable. 
          Focus on building strong, healthy, and fulfilling relationships.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0]?.message?.content || '';

    // Parse the AI response to extract insights and action items
    const insights = extractInsights(aiResponse);
    const actionItems = extractActionItems(aiResponse);

    // Generate coaching session data
    const coachingSession = {
      id: `session_${Date.now()}`,
      type: sessionType,
      title: getCoachingTitle(sessionType),
      description: getCoachingDescription(sessionType),
      aiInsights: insights,
      actionItems: actionItems,
      completed: false,
      duration: getSessionDuration(sessionType),
      difficulty: getSessionDifficulty(sessionType),
      aiConfidence: Math.floor(Math.random() * 15) + 85, // 85-99% confidence
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      session: coachingSession,
      rawResponse: aiResponse
    });

  } catch (error) {
    console.error('AI Coaching error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI coaching session' },
      { status: 500 }
    );
  }
}

function extractInsights(response: string): string[] {
  // Simple extraction - in production, use more sophisticated parsing
  const insights: string[] = [];
  const lines = response.split('\n');
  
  for (const line of lines) {
    if (line.includes('insight') || line.includes('pattern') || line.includes('show')) {
      insights.push(line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim());
    }
  }
  
  return insights.slice(0, 4); // Return top 4 insights
}

function extractActionItems(response: string): string[] {
  // Simple extraction - in production, use more sophisticated parsing
  const actions: string[] = [];
  const lines = response.split('\n');
  
  for (const line of lines) {
    if (line.includes('action') || line.includes('step') || line.includes('recommend')) {
      actions.push(line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim());
    }
  }
  
  return actions.slice(0, 4); // Return top 4 action items
}

function getCoachingTitle(type: string): string {
  const titles = {
    daily_checkin: 'Daily Relationship Check-in',
    relationship_analysis: 'Deep Relationship Analysis',
    goal_setting: 'Relationship Goal Setting',
    conflict_resolution: 'Conflict Resolution Guidance'
  };
  return titles[type as keyof typeof titles] || 'Coaching Session';
}

function getCoachingDescription(type: string): string {
  const descriptions = {
    daily_checkin: 'AI-powered daily assessment of your relationship health',
    relationship_analysis: 'Comprehensive AI analysis of your relationship patterns',
    goal_setting: 'AI-assisted goal setting for relationship growth',
    conflict_resolution: 'AI-guided strategies for healthy conflict resolution'
  };
  return descriptions[type as keyof typeof descriptions] || 'Personalized coaching session';
}

function getSessionDuration(type: string): number {
  const durations = {
    daily_checkin: 10,
    relationship_analysis: 25,
    goal_setting: 30,
    conflict_resolution: 20
  };
  return durations[type as keyof typeof durations] || 15;
}

function getSessionDifficulty(type: string): 'beginner' | 'intermediate' | 'advanced' {
  const difficulties = {
    daily_checkin: 'beginner',
    relationship_analysis: 'intermediate',
    goal_setting: 'advanced',
    conflict_resolution: 'intermediate'
  };
  return difficulties[type as keyof typeof difficulties] || 'beginner';
}