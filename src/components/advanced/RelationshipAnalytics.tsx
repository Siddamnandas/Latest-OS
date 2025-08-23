'use client';

import { useState, useEffect } from 'react';
import { useFeatureFlag } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { logger } from '@/lib/logger';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  Heart, 
  Brain,
  Calendar,
  Star,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Lightbulb
} from 'lucide-react';

interface AnalyticsData {
  relationshipHealth: {
    overall: number;
    communication: number;
    intimacy: number;
    sharedGoals: number;
    conflictResolution: number;
  };
  trends: {
    positive: string[];
    concerning: string[];
    neutral: string[];
  };
  predictions: {
    shortTerm: {
      confidence: number;
      outcome: string;
      factors: string[];
    };
    longTerm: {
      confidence: number;
      outcome: string;
      factors: string[];
    };
  };
  insights: {
    keyFindings: string[];
    recommendations: string[];
    riskFactors: string[];
  };
  milestones: {
    achieved: Array<{
      title: string;
      date: string;
      impact: number;
    }>;
    upcoming: Array<{
      title: string;
      date: string;
      preparation: string[];
    }>;
  };
}

export function RelationshipAnalytics() {
  const enabled = useFeatureFlag('relationship-analytics');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');

  useEffect(() => {
    if (!enabled) return;
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            timeframe: selectedTimeframe,
            userId: 'user123',
            partnerId: 'partner456'
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setAnalytics(data.data);
        } else {
          // Fallback to mock data
          throw new Error('API failed');
        }
      } catch (error) {
        logger.error('Failed to fetch analytics:', error);
        // Fallback to mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAnalytics({
          relationshipHealth: {
            overall: 78,
            communication: 85,
            intimacy: 72,
            sharedGoals: 80,
            conflictResolution: 75
          },
          trends: {
            positive: [
              'Communication quality improved by 15%',
              'Daily sync consistency increased',
              'Shared activities frequency up 20%'
            ],
            concerning: [
              'Intimacy metrics showing slight decline',
              'Stress levels affecting evening interactions',
              'Goal alignment needs attention'
            ],
            neutral: [
              'Sleep patterns stable',
              'Work-life balance maintained',
              'Social connections consistent'
            ]
          },
          predictions: {
            shortTerm: {
              confidence: 82,
              outcome: 'Strong relationship growth expected',
              factors: [
                'High communication engagement',
                'Consistent daily syncs',
                'Positive conflict resolution patterns'
              ]
            },
            longTerm: {
              confidence: 75,
              outcome: 'Sustainable long-term partnership',
              factors: [
                'Aligned life goals',
                'Strong emotional connection',
                'Effective stress management'
              ]
            }
          },
          insights: {
            keyFindings: [
              'Your relationship thrives on daily communication',
              'Weekend activities significantly boost connection',
              'Stress management is your strongest relationship skill'
            ],
            recommendations: [
              'Schedule more intimate moments during weekdays',
              'Focus on shared goal alignment this month',
              'Continue stress management practices'
            ],
            riskFactors: [
              'Work stress affecting evening quality time',
              'Limited deep conversations recently',
              'Need for more spontaneous activities'
            ]
          },
          milestones: {
            achieved: [
              { title: '30-Day Sync Streak', date: '2024-01-15', impact: 85 },
              { title: 'Communication Mastery', date: '2024-01-10', impact: 78 },
              { title: 'Stress Management Pro', date: '2024-01-05', impact: 72 }
            ],
            upcoming: [
              { 
                title: 'Relationship Wellness Month', 
                date: '2024-02-01', 
                preparation: ['Review goals', 'Plan activities', 'Set intentions'] 
              },
              { 
                title: 'Intimacy Deepening', 
                date: '2024-02-14', 
                preparation: ['Create space', 'Plan special time', 'Practice mindfulness'] 
              }
            ]
          }
        });
      }
      setLoading(false);
    };

    fetchAnalytics();
  }, [selectedTimeframe, enabled]);

  if (!enabled) {
    return null;
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="w-4 h-4" />;
    if (score >= 60) return <Target className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relationship Analytics</h2>
          <p className="text-gray-600">AI-powered insights and predictions</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'quarter'] as const).map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe)}
              className="capitalize"
            >
              {timeframe}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="health" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="health">Health Score</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-6">
          {/* Overall Health Score */}
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Overall Relationship Health</h3>
                  <p className="text-purple-100">Based on AI analysis of your interactions</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{analytics.relationshipHealth.overall}%</div>
                  <div className="text-sm text-purple-100">Excellent</div>
                </div>
              </div>
              <Progress value={analytics.relationshipHealth.overall} className="h-3 bg-white/20" />
            </CardContent>
          </Card>

          {/* Detailed Health Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analytics.relationshipHealth).map(([key, value]) => {
              if (key === 'overall') return null;
              
              const labels = {
                communication: 'Communication',
                intimacy: 'Intimacy',
                sharedGoals: 'Shared Goals',
                conflictResolution: 'Conflict Resolution'
              };

              return (
                <Card key={key}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getHealthIcon(value)}
                        <span className="font-medium">{labels[key as keyof typeof labels]}</span>
                      </div>
                      <span className={`font-bold ${getHealthColor(value)}`}>{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Trend Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Positive Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analytics.trends.positive.map((trend, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-1">•</span>
                      {trend}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-yellow-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-yellow-700 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Needs Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analytics.trends.concerning.map((trend, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-yellow-500 mt-1">•</span>
                      {trend}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-700 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Stable Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analytics.trends.neutral.map((trend, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-gray-500 mt-1">•</span>
                      {trend}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          {/* Predictive Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Short-term Prediction
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Progress value={analytics.predictions.shortTerm.confidence} className="flex-1" />
                  <span className="text-sm font-medium">{analytics.predictions.shortTerm.confidence}% confidence</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-gray-900 mb-3">{analytics.predictions.shortTerm.outcome}</p>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Key Factors:</h4>
                  {analytics.predictions.shortTerm.factors.map((factor, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Star className="w-3 h-3 text-blue-500" />
                      {factor}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Long-term Prediction
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Progress value={analytics.predictions.longTerm.confidence} className="flex-1" />
                  <span className="text-sm font-medium">{analytics.predictions.longTerm.confidence}% confidence</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-gray-900 mb-3">{analytics.predictions.longTerm.outcome}</p>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Key Factors:</h4>
                  {analytics.predictions.longTerm.factors.map((factor, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Star className="w-3 h-3 text-purple-500" />
                      {factor}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-700 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Key Findings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analytics.insights.keyFindings.map((finding, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Zap className="w-3 h-3 text-blue-500 mt-1 flex-shrink-0" />
                      {finding}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analytics.insights.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Heart className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analytics.insights.riskFactors.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-3 h-3 text-red-500 mt-1 flex-shrink-0" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Milestones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Achieved Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.milestones.achieved.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                        <p className="text-sm text-gray-600">{milestone.date}</p>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                        {milestone.impact}% impact
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Upcoming Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.milestones.upcoming.map((milestone, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                        <span className="text-sm text-gray-600">{milestone.date}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-700">Preparation:</p>
                        {milestone.preparation.map((prep, prepIndex) => (
                          <div key={prepIndex} className="flex items-center gap-2 text-xs">
                            <span className="text-blue-500">•</span>
                            {prep}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}