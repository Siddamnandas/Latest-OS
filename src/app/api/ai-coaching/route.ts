import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Define a single source of truth for session types and their properties.
// 'as const' ensures that all values are inferred as their literal types (e.g., 'beginner' not string).
const sessionTypeConfig = {
  daily_checkin: {
    title: 'Daily Relationship Check-in',
    description: 'AI-powered daily assessment of your relationship health',
    duration: 10,
    difficulty: 'beginner',
    getPrompt: (context?: string) => `As an AI relationship coach, provide a daily check-in analysis for a couple.
        Context: ${context || 'General daily relationship assessment'}
        
        Provide:
        1. 3-4 key insights about their relationship patterns
        2. 3-4 specific action items for improvement
        3. Focus on communication, emotional connection, and task balance
        4. Keep suggestions practical and actionable
        5. Include both positive reinforcement and growth areas`,
  },
  relationship_analysis: {
    title: 'Deep Relationship Analysis',
    description: 'Comprehensive AI analysis of your relationship patterns',
    duration: 25,
    difficulty: 'intermediate',
    getPrompt: (context?: string) => `As an AI relationship coach, conduct a deep relationship analysis.
        Context: ${context || 'Comprehensive relationship assessment'}
        
        Analyze and provide insights on:
        1. Communication patterns and quality
        2. Emotional intimacy and connection
        3. Conflict resolution approaches
        4. Love languages and preferences
        5. Shared values and goals alignment
        6. Growth areas and strengths
        7. Provide 4-5 specific, actionable recommendations`,
  },
  goal_setting: {
    title: 'Relationship Goal Setting',
    description: 'AI-assisted goal setting for relationship growth',
    duration: 30,
    difficulty: 'advanced',
    getPrompt: (context?: string) => `As an AI relationship coach, help with relationship goal setting.
        Context: ${context || 'Relationship goal planning'}
        
        Provide guidance on:
        1. Short-term relationship goals (1-3 months)
        2. Medium-term goals (3-12 months)
        3. Long-term vision (1-5 years)
        4. Goal alignment between partners
        5. Actionable steps for each goal
        6. Progress tracking suggestions
        7. Potential obstacles and solutions`,
  },
  conflict_resolution: {
    title: 'Conflict Resolution Guidance',
    description: 'AI-guided strategies for healthy conflict resolution',
    duration: 20,
    difficulty: 'intermediate',
    getPrompt: (context?: string) => `As an AI relationship coach, provide conflict resolution guidance.
        Context: ${context || 'Conflict resolution strategies'}
        
        Provide insights on:
        1. Common conflict patterns
        2. Healthy vs. unhealthy conflict
        3. Communication techniques during conflicts
        4. Emotional regulation strategies
        5. Compromise and negotiation skills
        6. Rebuilding trust after conflicts
        7. Preventive measures for future conflicts`,
  },
} as const;

// Derive the SessionType union from the keys of our config object.
type SessionType = keyof typeof sessionTypeConfig;

// Type guard to validate sessionType from the untyped request body.
function isValidSessionType(type: any): type is SessionType {
  return type in sessionTypeConfig;
}

export async function POST(request: NextRequest) {
  try {
    const { userId, sessionType, context } = await request.json();

    // Use the type guard to validate the sessionType.
    if (!userId || !isValidSessionType(sessionType)) {
      return NextResponse.json(
        { error: 'Missing or invalid required fields: userId, sessionType' },
        { status: 400 }
      );
    }

    // Initialize Z-AI SDK
    const zai = await ZAI.create();

    // Safely access the prompt function from the config.
    const prompt = sessionTypeConfig[sessionType].getPrompt(context);

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

    // The CoachingSession type definition is no longer needed here.
    // We construct the session object by safely accessing properties from our typed config.
    const coachingSession = {
      id: `session_${Date.now()}`,
      type: sessionType,
      title: sessionTypeConfig[sessionType].title,
      description: sessionTypeConfig[sessionType].description,
      aiInsights: insights,
      actionItems: actionItems,
      completed: false,
      duration: sessionTypeConfig[sessionType].duration,
      difficulty: sessionTypeConfig[sessionType].difficulty,
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

// These helper functions remain unchanged as their logic is independent of the session types.
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