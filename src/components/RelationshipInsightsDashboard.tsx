'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Brain, 
  Heart, 
  MessageCircle, 
  Target, 
  Star,
  Clock,
  Zap,
  Users,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Award,
  Shield
} from 'lucide-react';
import { MagicButton } from '@/components/MagicButton';
import { InteractiveConfetti } from '@/components/InteractiveConfetti';
import { FloatingEmoji } from '@/components/FloatingEmoji';
import { useToast } from '@/hooks/use-toast';

interface InsightMetric {
  category: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  icon: any;
  color: string;
  description: string;
}

interface RelationshipPattern {
  id: string;
  title: string;
  description: string;
  frequency: number;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  suggestions: string[];
}

interface PredictiveInsight {
  id: string;
  title: string;
  description: string;
  probability: number;
  timeframe: string;
  actionItems: string[];
  severity: 'low' | 'medium' | 'high';
}

interface InsightTrend {
  date: string;
  communication: number;
  intimacy: number;
  conflict: number;
  growth: number;
  overall: number;
}

export function RelationshipInsightsDashboard() {
  const [metrics, setMetrics] = useState<InsightMetric[]>([]);
  const [patterns, setPatterns] = useState<RelationshipPattern[]>([]);
  const [predictions, setPredictions] = useState<PredictiveInsight[]>([]);
  const [trends, setTrends] = useState<InsightTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFloatingEmoji, setShowFloatingEmoji] = useState(false);
  const [celebrationEmoji, setCelebrationEmoji] = useState('🎉');
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    initializeInsightsData();
  }, []);

  const initializeInsightsData = () => {
    // Mock metrics data
    const metricsData: InsightMetric[] = [
      {
        category: 'Communication',
        score: 85,
        trend: 'up',
        change: 12,
        icon: MessageCircle,
        color: 'text-blue-600',
        description: 'Excellent communication patterns with active listening'
      },
      {
        category: 'Emotional Intimacy',
        score: 72,
        trend: 'up',
        change: 8,
        icon: Heart,
        color: 'text-pink-600',
        description: 'Strong emotional connection with room for growth'
      },
      {
        category: 'Conflict Resolution',
        score: 78,
        trend: 'stable',
        change: 2,
        icon: Zap,
        color: 'text-orange-600',
        description: 'Healthy conflict resolution with constructive approaches'
      },
      {
        category: 'Shared Goals',
        score: 90,
        trend: 'up',
        change: 15,
        icon: Target,
        color: 'text-green-600',
        description: 'Excellent alignment on life goals and aspirations'
      },
      {
        category: 'Trust & Security',
        score: 88,
        trend: 'stable',
        change: 1,
        icon: Shield,
        color: 'text-purple-600',
        description: 'High level of trust and emotional security'
      },
      {
        category: 'Fun & Play',
        score: 65,
        trend: 'down',
        change: -5,
        icon: Star,
        color: 'text-yellow-600',
        description: 'Could benefit from more shared enjoyable activities'
      }
    ];

    // Mock patterns data
    const patternsData: RelationshipPattern[] = [
      {
        id: '1',
        title: 'Weekly Quality Time',
        description: 'Consistent weekend date nights strengthen connection',
        frequency: 85,
        impact: 'positive',
        confidence: 92,
        suggestions: ['Continue weekend ritual', 'Try new activities', 'Minimize distractions']
      },
      {
        id: '2',
        title: 'Stress Communication',
        description: 'Work stress affects evening interactions',
        frequency: 70,
        impact: 'negative',
        confidence: 88,
        suggestions: ['Implement stress debrief ritual', 'Practice patience', 'Create calming evening routine']
      },
      {
        id: '3',
        title: 'Gratitude Expression',
        description: 'Daily appreciation improves relationship satisfaction',
        frequency: 60,
        impact: 'positive',
        confidence: 85,
        suggestions: ['Continue gratitude practice', 'Be specific in appreciation', 'Vary expressions of thanks']
      },
      {
        id: '4',
        title: 'Decision Making',
        description: 'Major decisions show collaborative approach',
        frequency: 75,
        impact: 'positive',
        confidence: 90,
        suggestions: ['Maintain collaborative style', 'Include both perspectives', 'Document decisions']
      }
    ];

    // Mock predictions data
    const predictionsData: PredictiveInsight[] = [
      {
        id: '1',
        title: 'Relationship Growth Opportunity',
        description: 'Based on current patterns, next month shows potential for significant relationship growth',
        probability: 85,
        timeframe: 'Next 30 days',
        actionItems: [
          'Plan a special weekend getaway',
          'Start a new shared hobby',
          'Have deep conversations about future dreams'
        ],
        severity: 'low'
      },
      {
        id: '2',
        title: 'Stress Period Alert',
        description: 'Upcoming work deadlines may create temporary relationship tension',
        probability: 70,
        timeframe: 'Next 2 weeks',
        actionItems: [
          'Discuss work schedules in advance',
          'Plan stress-reduction activities',
          'Establish communication check-ins'
        ],
        severity: 'medium'
      },
      {
        id: '3',
        title: 'Intimacy Enhancement',
        description: 'Current patterns indicate opportunity for deeper emotional connection',
        probability: 75,
        timeframe: 'Next 3 weeks',
        actionItems: [
          'Schedule dedicated quality time',
          'Practice vulnerability exercises',
          'Share personal goals and fears'
        ],
        severity: 'low'
      }
    ];

    // Mock trends data
    const trendsData: InsightTrend[] = [
      { date: '2024-01-01', communication: 70, intimacy: 65, conflict: 60, growth: 75, overall: 67 },
      { date: '2024-01-08', communication: 72, intimacy: 68, conflict: 62, growth: 77, overall: 70 },
      { date: '2024-01-15', communication: 75, intimacy: 70, conflict: 65, growth: 80, overall: 72 },
      { date: '2024-01-22', communication: 78, intimacy: 72, conflict: 70, growth: 82, overall: 75 },
      { date: '2024-01-29', communication: 80, intimacy: 74, conflict: 72, growth: 85, overall: 78 },
      { date: '2024-02-05', communication: 82, intimacy: 76, conflict: 75, growth: 87, overall: 80 },
      { date: '2024-02-12', communication: 85, intimacy: 72, conflict: 78, growth: 90, overall: 81 }
    ];

    setMetrics(metricsData);
    setPatterns(patternsData);
    setPredictions(predictionsData);
    setTrends(trendsData);
    setLoading(false);
  };

  const handleInsightAction = (insightId: string) => {
    setCelebrationEmoji('💡');
    setShowFloatingEmoji(true);
    
    toast({
      title: "Insight Applied! ✨",
      description: "Great job taking action on the AI insight!",
      duration: 3000,
    });
    
    setTimeout(() => setShowFloatingEmoji(false), 2000);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'bg-green-100 text-green-700';
      case 'negative': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getOverallScore = () => {
    if (metrics.length === 0) return 0;
    const total = metrics.reduce((sum, metric) => sum + metric.score, 0);
    return Math.round(total / metrics.length);
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const overallScore = getOverallScore();

  return (
    <div className="p-4 space-y-6">
      {/* Interactive Elements */}
      <InteractiveConfetti trigger={showConfetti} />
      <FloatingEmoji emoji={celebrationEmoji} trigger={showFloatingEmoji} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Relationship Insights</h1>
            <p className="text-gray-600 text-sm">AI-powered analysis of your relationship patterns</p>
          </div>
        </div>
        <MagicButton className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
          <BarChart3 className="w-4 h-4 mr-2" />
          Generate Report
        </MagicButton>
      </div>

      {/* Overall Score Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Relationship Health Score</h3>
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              {overallScore}/100
            </Badge>
          </div>
          
          <div className="mb-4">
            <Progress value={overallScore} className="h-3" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{metrics.filter(m => m.trend === 'up').length}</div>
              <div className="text-sm text-gray-600">Improving</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">{patterns.filter(p => p.impact === 'positive').length}</div>
              <div className="text-sm text-gray-600">Positive Patterns</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
            <Activity className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="patterns" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
            <PieChart className="w-4 h-4 mr-2" />
            Patterns
          </TabsTrigger>
          <TabsTrigger value="predictions" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
            <TrendingUp className="w-4 h-4 mr-2" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
            <BarChart3 className="w-4 h-4 mr-2" />
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.category} className="bg-white card-hover-lift">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gray-100 ${metric.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{metric.category}</h3>
                          <p className="text-sm text-gray-600">{metric.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(metric.trend)}
                        <span className={`text-sm font-medium ${
                          metric.trend === 'up' ? 'text-green-600' : 
                          metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Score</span>
                        <span className="font-medium">{metric.score}/100</span>
                      </div>
                      <Progress value={metric.score} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="space-y-4">
            {patterns.map((pattern) => (
              <Card key={pattern.id} className="bg-white card-hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{pattern.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{pattern.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={getImpactColor(pattern.impact)}>
                          {pattern.impact}
                        </Badge>
                        <Badge variant="outline">
                          <Activity className="w-3 h-3 mr-1" />
                          {pattern.frequency}% frequency
                        </Badge>
                        <Badge variant="outline">
                          {pattern.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      AI Suggestions:
                    </h4>
                    <ul className="space-y-1">
                      {pattern.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-end mt-3">
                    <MagicButton 
                      size="sm"
                      onClick={() => handleInsightAction(pattern.id)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500"
                    >
                      Apply Suggestions
                    </MagicButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <Card key={prediction.id} className={`bg-white card-hover-lift border-l-4 ${
                prediction.severity === 'high' ? 'border-l-red-500' :
                prediction.severity === 'medium' ? 'border-l-yellow-500' :
                'border-l-blue-500'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{prediction.title}</h3>
                        <Badge className={getSeverityColor(prediction.severity)}>
                          {prediction.severity} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{prediction.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          <Target className="w-3 h-3 mr-1" />
                          {prediction.probability}% probability
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {prediction.timeframe}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      Recommended Actions:
                    </h4>
                    <ol className="space-y-1">
                      {prediction.actionItems.map((action, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-blue-500 font-medium">{index + 1}.</span>
                          {action}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex justify-end mt-3">
                    <MagicButton 
                      size="sm"
                      onClick={() => handleInsightAction(prediction.id)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500"
                    >
                      Take Action
                    </MagicButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Relationship Health Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trends.map((trend, index) => (
                  <div key={trend.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-gray-600">
                        {new Date(trend.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-blue-600">{trend.communication}</div>
                        <div className="text-xs text-gray-500">Comm</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-pink-600">{trend.intimacy}</div>
                        <div className="text-xs text-gray-500">Intimacy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-orange-600">{trend.conflict}</div>
                        <div className="text-xs text-gray-500">Conflict</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-green-600">{trend.growth}</div>
                        <div className="text-xs text-gray-500">Growth</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-purple-600">{trend.overall}</div>
                        <div className="text-xs text-gray-500">Overall</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}