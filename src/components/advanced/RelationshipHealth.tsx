'use client';

import { useState, useEffect } from 'react';
import { useFeatureFlag } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Brain, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  Star,
  Zap,
  Lightbulb,
  Calendar,
  Clock,
  Award,
  BarChart3,
  PieChart,
  Users,
  MessageSquare,
  Shield,
  Sparkles,
  RefreshCw,
  Download,
  Share
} from 'lucide-react';

interface HealthScore {
  overall: number;
  breakdown: {
    emotionalConnection: number;
    communication: number;
    intimacy: number;
    conflictResolution: number;
    sharedValues: number;
    trust: number;
    support: number;
    growth: number;
  };
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: string;
}

interface HealthRecommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  actionSteps: string[];
  expectedImpact: string;
  timeframe: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  estimatedTime: string;
  resources: string[];
}

interface HealthInsight {
  id: string;
  type: 'strength' | 'opportunity' | 'risk' | 'trend';
  title: string;
  description: string;
  data: any;
  confidence: number;
  actionable: boolean;
}

interface HealthAssessment {
  scores: HealthScore;
  recommendations: HealthRecommendation[];
  insights: HealthInsight[];
  riskFactors: string[];
  protectiveFactors: string[];
  nextAssessment: string;
}

export function RelationshipHealth() {
  const enabled = useFeatureFlag('relationship-health');
  const [assessment, setAssessment] = useState<HealthAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'current' | 'week' | 'month' | 'quarter'>('current');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const fetchAssessment = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAssessment({
        scores: {
          overall: 78,
          breakdown: {
            emotionalConnection: 85,
            communication: 82,
            intimacy: 72,
            conflictResolution: 75,
            sharedValues: 88,
            trust: 90,
            support: 86,
            growth: 79
          },
          trend: 'improving',
          lastUpdated: new Date().toISOString()
        },
        recommendations: [
          {
            id: 'rec-1',
            priority: 'high',
            category: 'Intimacy',
            title: 'Deepen Emotional Intimacy',
            description: 'Focus on building deeper emotional connection through vulnerability exercises',
            actionSteps: [
              'Schedule weekly emotional check-ins',
              'Practice active listening without interruption',
              'Share feelings using "I" statements',
              'Create safe space for vulnerability'
            ],
            expectedImpact: '20% improvement in emotional connection scores',
            timeframe: '2-4 weeks',
            difficulty: 'moderate',
            estimatedTime: '15-20 minutes daily',
            resources: ['Emotional intimacy guide', 'Communication exercises']
          },
          {
            id: 'rec-2',
            priority: 'medium',
            category: 'Communication',
            title: 'Enhance Communication Patterns',
            description: 'Improve communication effectiveness through structured techniques',
            actionSteps: [
              'Practice reflective listening',
              'Use non-violent communication',
              'Schedule regular state-of-the-union meetings',
              'Learn each other\'s communication styles'
            ],
            expectedImpact: '15% improvement in communication scores',
            timeframe: '3-6 weeks',
            difficulty: 'easy',
            estimatedTime: '10-15 minutes daily',
            resources: ['Communication workbook', 'Style assessment tools']
          },
          {
            id: 'rec-3',
            priority: 'low',
            category: 'Growth',
            title: 'Explore New Activities Together',
            description: 'Try new experiences to strengthen bond and create shared memories',
            actionSteps: [
              'Plan monthly adventure dates',
              'Take up a new hobby together',
              'Attend relationship workshops',
              'Set and work on shared goals'
            ],
            expectedImpact: '10% improvement in overall satisfaction',
            timeframe: '1-3 months',
            difficulty: 'easy',
            estimatedTime: '2-4 hours weekly',
            resources: ['Activity ideas list', 'Goal planning templates']
          }
        ],
        insights: [
          {
            id: 'insight-1',
            type: 'strength',
            title: 'Strong Trust Foundation',
            description: 'Your relationship shows exceptional trust levels, which provides a solid foundation for growth',
            data: { score: 90, trend: 'stable' },
            confidence: 0.95,
            actionable: false
          },
          {
            id: 'insight-2',
            type: 'opportunity',
            title: 'Intimacy Enhancement Potential',
            description: 'Emotional intimacy shows room for growth and could significantly impact overall satisfaction',
            data: { current: 72, potential: 85, impact: 'high' },
            confidence: 0.88,
            actionable: true
          },
          {
            id: 'insight-3',
            type: 'trend',
            title: 'Positive Growth Trajectory',
            description: 'Your relationship shows consistent improvement across multiple dimensions',
            data: { growthRate: 0.12, areas: ['communication', 'support'] },
            confidence: 0.92,
            actionable: false
          }
        ],
        riskFactors: [
          'Occasional communication breakdown during stress',
          'Limited quality time due to busy schedules',
          'Different intimacy needs and preferences'
        ],
        protectiveFactors: [
          'Strong commitment to relationship growth',
          'Excellent conflict resolution skills',
          'Shared values and life goals',
          'Good support system'
        ],
        nextAssessment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
      setLoading(false);
    };

    fetchAssessment();
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
    if (score >= 80) return <CheckCircle className="w-4 h-4" />;
    if (score >= 60) return <Target className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Attention';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return <Star className="w-5 h-5 text-yellow-500" />;
      case 'opportunity': return <Lightbulb className="w-5 h-5 text-blue-500" />;
      case 'risk': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'trend': return <TrendingUp className="w-5 h-5 text-green-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const refreshAssessment = () => {
    setLoading(true);
    setTimeout(() => {
      fetchAssessment();
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!assessment) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relationship Health Assessment</h2>
          <p className="text-gray-600">Comprehensive scoring and personalized recommendations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refreshAssessment}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overall Health Score */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Overall Relationship Health</h3>
              <p className="text-purple-100">Based on comprehensive analysis of your relationship</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{assessment.scores.overall}%</div>
              <div className="text-sm text-purple-100">{getHealthLabel(assessment.scores.overall)}</div>
              <div className="flex items-center gap-1 mt-1">
                {assessment.scores.trend === 'improving' && <TrendingUp className="w-3 h-3" />}
                <span className="text-xs text-purple-100 capitalize">{assessment.scores.trend}</span>
              </div>
            </div>
          </div>
          <Progress value={assessment.scores.overall} className="h-3 bg-white/20" />
          <div className="flex items-center justify-between mt-2 text-xs text-purple-100">
            <span>Last updated: {new Date(assessment.scores.lastUpdated).toLocaleDateString()}</span>
            <span>Next assessment: {new Date(assessment.nextAssessment).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="breakdown" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="factors">Risk & Protective Factors</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="space-y-4">
          {/* Detailed Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(assessment.scores.breakdown).map(([key, value]) => {
              const labels = {
                emotionalConnection: 'Emotional Connection',
                communication: 'Communication',
                intimacy: 'Intimacy',
                conflictResolution: 'Conflict Resolution',
                sharedValues: 'Shared Values',
                trust: 'Trust',
                support: 'Support',
                growth: 'Growth'
              };

              return (
                <Card key={key}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getHealthIcon(value)}
                        <span className="font-medium">{labels[key as keyof typeof labels]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getHealthColor(value)}`}>{value}%</span>
                        <Badge variant="outline" className="text-xs">
                          {getHealthLabel(value)}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={value} className="h-2" />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Health Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Health Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Object.values(assessment.scores.breakdown).filter(score => score >= 80).length}
                  </div>
                  <div className="text-sm text-gray-600">Excellent Areas</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {Object.values(assessment.scores.breakdown).filter(score => score >= 60 && score < 80).length}
                  </div>
                  <div className="text-sm text-gray-600">Good Areas</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {Object.values(assessment.scores.breakdown).filter(score => score < 60).length}
                  </div>
                  <div className="text-sm text-gray-600">Needs Attention</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {/* Priority Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'high', 'medium', 'low'].map((priority) => (
              <Button
                key={priority}
                variant={selectedTimeframe === priority ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeframe(priority as any)}
                className="capitalize"
              >
                {priority === 'all' ? 'All Recommendations' : `${priority} Priority`}
              </Button>
            ))}
          </div>

          {/* Recommendations List */}
          <div className="space-y-4">
            {assessment.recommendations
              .filter(rec => selectedTimeframe === 'all' || rec.priority === selectedTimeframe)
              .map((recommendation) => (
                <Card key={recommendation.id} className="transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getPriorityColor(recommendation.priority)}`}>
                          <Target className="w-4 h-4" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                          <p className="text-sm text-gray-600">{recommendation.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(recommendation.priority)}>
                          {recommendation.priority} priority
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {recommendation.estimatedTime}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Action Steps */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Action Steps:</h4>
                        <ol className="space-y-1">
                          {recommendation.actionSteps.map((step, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <span className="text-purple-600 font-medium mt-0.5">{index + 1}.</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Expected Impact */}
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Expected Impact</h4>
                          <p className="text-sm text-gray-600">{recommendation.expectedImpact}</p>
                        </div>
                        <Badge variant="secondary">
                          {recommendation.timeframe}
                        </Badge>
                      </div>

                      {/* Resources */}
                      {recommendation.resources.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Resources:</h4>
                          <div className="flex flex-wrap gap-2">
                            {recommendation.resources.map((resource, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {resource}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          Start Now
                        </Button>
                        <Button variant="outline" size="sm">
                          Learn More
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {/* Insights Grid */}
          <div className="grid gap-4">
            {assessment.insights.map((insight) => (
              <Card key={insight.id} className="transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{insight.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            Confidence: {Math.round(insight.confidence * 100)}%
                          </Badge>
                          {insight.actionable && (
                            <Badge className="bg-blue-100 text-blue-700">
                              Actionable
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Data Visualization */}
                      {insight.data && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-700">
                            <strong>Data:</strong> {JSON.stringify(insight.data, null, 2)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="factors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assessment.riskFactors.map((risk, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{risk}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-red-100 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-1">Mitigation Strategies</h4>
                  <p className="text-sm text-red-700">
                    Focus on the high-priority recommendations to address these risk factors and strengthen your relationship.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Protective Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Shield className="w-5 h-5" />
                  Protective Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assessment.protectiveFactors.map((factor, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{factor}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">Leverage Your Strengths</h4>
                  <p className="text-sm text-green-700">
                    These protective factors are your relationship's superpowers. Continue to nurture and build upon these strengths.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Health Improvement Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Health Improvement Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-purple-600">3 Months</div>
                    <div className="text-sm text-gray-600">Target Timeline</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-blue-600">85%</div>
                    <div className="text-sm text-gray-600">Target Score</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-green-600">+7%</div>
                    <div className="text-sm text-gray-600">Improvement Goal</div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Next Steps:</h4>
                  <ol className="space-y-1 text-sm">
                    <li>Complete high-priority recommendations within 2 weeks</li>
                    <li>Schedule monthly relationship check-ins</li>
                    <li>Monitor progress through regular assessments</li>
                    <li>Celebrate improvements and milestones</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}