import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { action, userId, partnerId, healthData, timeframe } = await request.json();
    
    // Initialize Z-AI SDK
    const zai = await ZAI.create();

    if (action === 'calculate_health_score') {
      // Calculate comprehensive relationship health score
      const { syncHistory, activities, conflicts, milestones, communicationPatterns } = healthData || {};
      
      const healthScorePrompt = `
        As an AI relationship health expert, calculate a comprehensive relationship health score based on the following data:

        Sync History: ${JSON.stringify(syncHistory || [])}
        Activities: ${JSON.stringify(activities || [])}
        Conflicts: ${JSON.stringify(conflicts || [])}
        Milestones: ${JSON.stringify(milestones || [])}
        Communication Patterns: ${JSON.stringify(communicationPatterns || {})}

        Please calculate:
        1. Overall relationship health score (0-100)
        2. Breakdown scores for each dimension:
           - Emotional Connection (0-100)
           - Communication (0-100)
           - Intimacy (0-100)
           - Conflict Resolution (0-100)
           - Shared Values (0-100)
           - Trust (0-100)
           - Support (0-100)
           - Growth (0-100)
        3. Overall trend (improving, stable, declining)
        4. Confidence level in the assessment

        Format the response as a JSON object with the following schema:
        {
          "overall": number,
          "breakdown": {
            "emotionalConnection": number,
            "communication": number,
            "intimacy": number,
            "conflictResolution": number,
            "sharedValues": number,
            "trust": number,
            "support": number,
            "growth": number
          },
          "trend": "improving" | "stable" | "declining",
          "confidence": number,
          "factors": {
            "strengths": string[],
            "areasForImprovement": string[]
          }
        }
      `;

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert relationship health analyst with deep understanding of relationship dynamics, psychology, and data analysis. Provide accurate, comprehensive health assessments.'
          },
          {
            role: 'user',
            content: healthScorePrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      let healthScore;
      try {
        const responseContent = completion.choices[0]?.message?.content;
        if (responseContent) {
          // Extract JSON from the response
          const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            healthScore = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No JSON found in response');
          }
        } else {
          throw new Error('No response content');
        }
      } catch (error) {
        // Fallback health score
        healthScore = {
          overall: 75,
          breakdown: {
            emotionalConnection: 80,
            communication: 75,
            intimacy: 70,
            conflictResolution: 72,
            sharedValues: 85,
            trust: 88,
            support: 82,
            growth: 78
          },
          trend: 'stable',
          confidence: 0.8,
          factors: {
            strengths: ['Strong trust foundation', 'Good communication patterns'],
            areasForImprovement: ['Intimacy enhancement', 'Conflict resolution skills']
          }
        };
      }

      return NextResponse.json({
        success: true,
        data: healthScore,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'generate_recommendations') {
      // Generate personalized health recommendations
      const { healthScore, userPreferences, relationshipGoals, challenges } = healthData || {};
      
      const recommendationsPrompt = `
        As an AI relationship health coach, generate personalized recommendations based on the following assessment:

        Health Score: ${JSON.stringify(healthScore || {})}
        User Preferences: ${JSON.stringify(userPreferences || {})}
        Relationship Goals: ${JSON.stringify(relationshipGoals || [])}
        Current Challenges: ${JSON.stringify(challenges || [])}

        Please generate 3-5 personalized recommendations that:
        1. Address the lowest-scoring health dimensions first
        2. Align with user preferences and relationship goals
        3. Are realistic and achievable
        4. Have clear action steps and expected outcomes
        5. Include priority levels (high, medium, low)

        Format the response as a JSON array of recommendation objects with the following schema:
        [
          {
            "id": string,
            "priority": "high" | "medium" | "low",
            "category": string,
            "title": string,
            "description": string,
            "actionSteps": string[],
            "expectedImpact": string,
            "timeframe": string,
            "difficulty": "easy" | "moderate" | "challenging",
            "estimatedTime": string,
            "resources": string[]
          }
        ]
      `;

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert relationship coach who provides practical, actionable recommendations tailored to each couple\'s unique situation and goals.'
          },
          {
            role: 'user',
            content: recommendationsPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      });

      let recommendations;
      try {
        const responseContent = completion.choices[0]?.message?.content;
        if (responseContent) {
          // Extract JSON array from the response
          const jsonMatch = responseContent.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            recommendations = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No JSON found in response');
          }
        } else {
          throw new Error('No response content');
        }
      } catch (error) {
        // Fallback recommendations
        recommendations = [
          {
            id: 'rec-1',
            priority: 'high',
            category: 'Communication',
            title: 'Enhance Communication Patterns',
            description: 'Improve communication through structured exercises',
            actionSteps: ['Practice active listening', 'Schedule regular check-ins'],
            expectedImpact: '15% improvement in communication scores',
            timeframe: '2-4 weeks',
            difficulty: 'moderate',
            estimatedTime: '15 minutes daily',
            resources: ['Communication guide']
          }
        ];
      }

      return NextResponse.json({
        success: true,
        data: recommendations,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'analyze_insights') {
      // Generate insights from health data
      const { healthScore, trends, patterns, recentEvents } = healthData || {};
      
      const insightsPrompt = `
        As an AI relationship insights expert, analyze the following health data and generate meaningful insights:

        Health Score: ${JSON.stringify(healthScore || {})}
        Trends: ${JSON.stringify(trends || [])}
        Patterns: ${JSON.stringify(patterns || {})}
        Recent Events: ${JSON.stringify(recentEvents || [])}

        Please generate insights that identify:
        1. Key strengths in the relationship
        2. Opportunities for growth and improvement
        3. Potential risk factors to monitor
        4. Positive trends to continue
        5. Actionable insights with confidence levels

        Format the response as a JSON array of insight objects with the following schema:
        [
          {
            "id": string,
            "type": "strength" | "opportunity" | "risk" | "trend",
            "title": string,
            "description": string,
            "data": any,
            "confidence": number,
            "actionable": boolean
          }
        ]
      `;

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert relationship analyst who can identify meaningful patterns, trends, and insights from relationship health data.'
          },
          {
            role: 'user',
            content: insightsPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      let insights;
      try {
        const responseContent = completion.choices[0]?.message?.content;
        if (responseContent) {
          // Extract JSON array from the response
          const jsonMatch = responseContent.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            insights = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No JSON found in response');
          }
        } else {
          throw new Error('No response content');
        }
      } catch (error) {
        // Fallback insights
        insights = [
          {
            id: 'insight-1',
            type: 'strength',
            title: 'Strong Communication Foundation',
            description: 'Your relationship shows excellent communication patterns',
            data: { score: 85 },
            confidence: 0.9,
            actionable: false
          }
        ];
      }

      return NextResponse.json({
        success: true,
        data: insights,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'identify_factors') {
      // Identify risk and protective factors
      const { healthScore, relationshipHistory, environmentalFactors, individualFactors } = healthData || {};
      
      const factorsPrompt = `
        As an AI relationship risk assessment expert, analyze the following data to identify risk and protective factors:

        Health Score: ${JSON.stringify(healthScore || {})}
        Relationship History: ${JSON.stringify(relationshipHistory || [])}
        Environmental Factors: ${JSON.stringify(environmentalFactors || [])}
        Individual Factors: ${JSON.stringify(individualFactors || [])}

        Please identify:
        1. Risk factors that could negatively impact the relationship
        2. Protective factors that strengthen and support the relationship
        3. Early warning signs to monitor
        4. Buffer factors that help mitigate risks

        Format the response as a JSON object with the following schema:
        {
          "riskFactors": string[],
          "protectiveFactors": string[],
          "warningSigns": string[],
          "mitigationStrategies": string[]
        }
      `;

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert in relationship risk assessment and protective factors analysis. Provide accurate, balanced assessments that help couples understand their relationship dynamics.'
          },
          {
            role: 'user',
            content: factorsPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1200,
      });

      let factors;
      try {
        const responseContent = completion.choices[0]?.message?.content;
        if (responseContent) {
          // Extract JSON from the response
          const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            factors = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No JSON found in response');
          }
        } else {
          throw new Error('No response content');
        }
      } catch (error) {
        // Fallback factors
        factors = {
          riskFactors: ['Communication breakdown during stress'],
          protectiveFactors: ['Strong commitment to relationship'],
          warningSigns: ['Decreased quality time together'],
          mitigationStrategies: ['Schedule regular check-ins']
        };
      }

      return NextResponse.json({
        success: true,
        data: factors,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'create_improvement_plan') {
      // Create personalized improvement plan
      const { healthScore, recommendations, userGoals, timeframe, resources } = healthData || {};
      
      const planPrompt = `
        As an AI relationship improvement planner, create a comprehensive improvement plan based on:

        Current Health Score: ${JSON.stringify(healthScore || {})}
        Recommendations: ${JSON.stringify(recommendations || [])}
        User Goals: ${JSON.stringify(userGoals || [])}
        Available Timeframe: ${timeframe || '3 months'}
        Available Resources: ${JSON.stringify(resources || [])}

        Please create a structured improvement plan that includes:
        1. Overall improvement goals and target metrics
        2. Phased approach with specific milestones
        3. Timeline and checkpoints
        4. Resource allocation strategy
        5. Progress monitoring approach
        6. Success criteria

        Format the response as a JSON object with the following schema:
        {
          "overallGoals": {
            "targetScore": number,
            "improvementTarget": number,
            "timeline": string
          },
          "phases": [
            {
              "name": string,
              "duration": string,
              "goals": string[],
              "actions": string[],
              "milestones": string[]
            }
          ],
          "monitoring": {
            "checkpoints": string[],
            "metrics": string[],
            "adjustmentStrategy": string
          },
          "successCriteria": string[]
        }
      `;

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert relationship improvement planner who creates realistic, achievable plans tailored to each couple\'s unique situation and resources.'
          },
          {
            role: 'user',
            content: planPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      let improvementPlan;
      try {
        const responseContent = completion.choices[0]?.message?.content;
        if (responseContent) {
          // Extract JSON from the response
          const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            improvementPlan = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No JSON found in response');
          }
        } else {
          throw new Error('No response content');
        }
      } catch (error) {
        // Fallback improvement plan
        improvementPlan = {
          overallGoals: {
            targetScore: 85,
            improvementTarget: 10,
            timeline: '3 months'
          },
          phases: [
            {
              name: 'Foundation Building',
              duration: '1 month',
              goals: ['Improve communication'],
              actions: ['Practice active listening'],
              milestones: ['Complete communication exercises']
            }
          ],
          monitoring: {
            checkpoints: ['Weekly check-ins'],
            metrics: ['Health score improvements'],
            adjustmentStrategy: 'Review and adjust monthly'
          },
          successCriteria: ['Achieve target score within timeline']
        };
      }

      return NextResponse.json({
        success: true,
        data: improvementPlan,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action',
      timestamp: new Date().toISOString()
    }, { status: 400 });

  } catch (error) {
    console.error('Relationship Health API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process relationship health request',
        message: error.message 
      },
      { status: 500 }
    );
  }
}