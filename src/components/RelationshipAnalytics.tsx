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
  Heart, 
  Brain, 
  Target, 
  Calendar,
  Users,
  Clock,
  Star,
  Award,
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  Sparkles,
  BarChart3,
  PieChart,
  LineChart,
  Timer,
  MessageSquare,
  Gift,
  Crown,
  Lightbulb,
  BookOpen,
  Music,
  Home,
  DollarSign,
  Baby
} from 'lucide-react';

interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  category: string;
}

interface RelationshipInsight {
  id: string;
  type: 'strength' | 'opportunity' | 'warning' | 'milestone';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  category: string;
  impact: 'low' | 'medium' | 'high';
  timeframe: string;
}

interface PatternData {
  id: string;
  pattern: string;
  frequency: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  description: string;
  recommendation: string;
}

interface GoalProgress {
  id: string;
  title: string;
  category: string;
  progress: number;
  targetDate: Date;
  milestones: { completed: number; total: number };
  lastUpdated: Date;
}

interface CommunicationMetric {
  date: string;
  messages: number;
  positive: number;
  negative: number;
  syncSessions: number;
  voiceInteractions: number;
}

interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export function RelationshipAnalytics() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [analytics, setAnalytics] = useState({
    relationshipHealth: 78,
    communicationScore: 85,
    emotionalConnection: 72,
    sharedGoalsProgress: 65,
    intimacyScore: 80,
    conflictResolution: 88
  });
  
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([
    { id: '1', name: 'Daily Syncs', value: 85, target: 90, unit: '%', trend: 'up', change: 12, category: 'consistency' },
    { id: '2', name: 'Quality Time', value: 65, target: 80, unit: 'hours', trend: 'up', change: 8, category: 'connection' },
    { id: '3', name: 'Conflict Resolution', value: 88, target: 85, unit: '%', trend: 'stable', change: 0, category: 'harmony' },
    { id: '4', name: 'Shared Activities', value: 45, target: 60, unit: '%', trend: 'down', change: -5, category: 'engagement' },
    { id: '5', name: 'Emotional Support', value: 92, target: 90, unit: '%', trend: 'up', change: 15, category: 'support' },
    { id: '6', name: 'Financial Harmony', value: 70, target: 80, unit: '%', trend: 'up', change: 10, category: 'practical' }
  ]);

  const [insights, setInsights] = useState<RelationshipInsight[]>([
    {
      id: '1',
      type: 'strength',
      title: 'Excellent Communication Patterns',
      description: 'Your active listening skills have improved by 40% this month. Keep up the great work!',
      confidence: 92,
      actionable: false,
      category: 'communication',
      impact: 'high',
      timeframe: 'ongoing'
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'Quality Time Enhancement',
      description: 'Consider scheduling 15-minute daily check-ins to strengthen your emotional connection.',
      confidence: 85,
      actionable: true,
      category: 'connection',
      impact: 'medium',
      timeframe: '2 weeks'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Shared Activities Decline',
      description: 'Shared activities have decreased by 15% this month. Plan more joint activities.',
      confidence: 78,
      actionable: true,
      category: 'engagement',
      impact: 'medium',
      timeframe: '1 week'
    },
    {
      id: '4',
      type: 'milestone',
      title: '30-Day Sync Streak!',
      description: 'Congratulations on maintaining a 30-day daily sync streak!',
      confidence: 100,
      actionable: false,
      category: 'achievement',
      impact: 'high',
      timeframe: 'achieved'
    }
  ]);

  const [patterns, setPatterns] = useState<PatternData[]>([
    {
      id: '1',
      pattern: 'Evening Connection',
      frequency: 85,
      trend: 'increasing',
      description: 'Most meaningful conversations happen between 8-10 PM',
      recommendation: 'Protect this time for deeper connections'
    },
    {
      id: '2',
      pattern: 'Weekend Planning',
      frequency: 70,
      trend: 'stable',
      description: 'Weekend planning sessions increase relationship satisfaction',
      recommendation: 'Continue weekly planning rituals'
    },
    {
      id: '3',
      pattern: 'Stress Communication',
      frequency: 45,
      trend: 'decreasing',
      description: 'Work stress discussions have decreased by 20%',
      recommendation: 'Maintain healthy work-life boundaries'
    }
  ]);

  const [goalProgress, setGoalProgress] = useState<GoalProgress[]>([
    {
      id: '1',
      title: 'Weekly Date Night',
      category: 'romance',
      progress: 85,
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      milestones: { completed: 4, total: 5 },
      lastUpdated: new Date()
    },
    {
      id: '2',
      title: 'Financial Planning',
      category: 'finance',
      progress: 60,
      targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      milestones: { completed: 3, total: 5 },
      lastUpdated: new Date()
    },
    {
      id: '3',
      title: 'Home Renovation',
      category: 'home',
      progress: 30,
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      milestones: { completed: 1, total: 4 },
      lastUpdated: new Date()
    }
  ]);

  const [communicationData, setCommunicationData] = useState<CommunicationMetric[]>([
    { date: '2024-01-01', messages: 45, positive: 38, negative: 7, syncSessions: 7, voiceInteractions: 12 },
    { date: '2024-01-02', messages: 52, positive: 44, negative: 8, syncSessions: 7, voiceInteractions: 15 },
    { date: '2024-01-03', messages: 48, positive: 41, negative: 7, syncSessions: 7, voiceInteractions: 18 },
    { date: '2024-01-04', messages: 55, positive: 47, negative: 8, syncSessions: 7, voiceInteractions: 14 },
    { date: '2024-01-05', messages: 62, positive: 54, negative: 8, syncSessions: 7, voiceInteractions: 20 },
    { date: '2024-01-06', messages: 58, positive: 50, negative: 8, syncSessions: 7, voiceInteractions: 16 },
    { date: '2024-01-07', messages: 67, positive: 59, negative: 8, syncSessions: 7, voiceInteractions: 22 }
  ]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return <Star className="w-5 h-5 text-yellow-600" />;
      case 'opportunity': return <Lightbulb className="w-5 h-5 text-blue-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'milestone': return <Award className="w-5 h-5 text-purple-600" />;
      default: return <Brain className="w-5 h-5 text-gray-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'strength': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'opportunity': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'milestone': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'communication': return <MessageSquare className="w-4 h-4" />;
      case 'connection': return <Heart className="w-4 h-4" />;
      case 'romance': return <Gift className="w-4 h-4" />;
      case 'finance': return <DollarSign className="w-4 h-4" />;
      case 'home': return <Home className="w-4 h-4" />;
      case 'family': return <Users className="w-4 h-4" />;
      case 'achievement': return <Crown className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const calculateOverallHealth = () => {
    const scores = Object.values(analytics);
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const generatePersonalizedRecommendations = () => {
    const recommendations: Recommendation[] = [];
    
    // Based on metrics
    const lowMetrics = metrics.filter(m => m.value < m.target * 0.8);
    lowMetrics.forEach(metric => {
      switch (metric.name) {
        case 'Quality Time':
          recommendations.push({
            title: 'Increase Quality Time',
            description: 'Schedule dedicated time for meaningful conversations and activities.',
            priority: 'high',
            category: 'connection'
          });
          break;
        case 'Shared Activities':
          recommendations.push({
            title: 'Plan Shared Activities',
            description: 'Find new hobbies or activities you both enjoy doing together.',
            priority: 'medium',
            category: 'engagement'
          });
          break;
      }
    });

    // Based on insights
    const actionableInsights = insights.filter(i => i.actionable);
    actionableInsights.forEach(insight => {
      recommendations.push({
        title: insight.title,
        description: insight.description,
        priority: insight.impact === 'high' ? 'high' : insight.impact === 'medium' ? 'medium' : 'low',
        category: insight.category
      });
    });

    return recommendations.slice(0, 5); // Top 5 recommendations
  };

  const recommendations = generatePersonalizedRecommendations();

  return (
    <div className="space-y-6">
      {/* Header with Overall Health Score */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6" />
              <div>
                <CardTitle className="text-lg">Relationship Analytics</CardTitle>
                <p className="text-sm opacity-90">Personalized insights and recommendations</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="bg-white/20 text-white border-white/30 rounded px-3 py-1 text-sm"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className={`text-3xl font-bold ${calculateOverallHealth() >= 80 ? 'text-green-300' : calculateOverallHealth() >= 60 ? 'text-yellow-300' : 'text-red-300'}`}>
                  {calculateOverallHealth()}%
                </div>
                <div>
                  <p className="text-sm opacity-90">Overall Relationship Health</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon('up')}
                    <span className="text-xs opacity-75">+5% from last month</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">AI-Powered Insights</span>
              </div>
              <p className="text-xs opacity-75">Updated in real-time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="recommendations">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(analytics).map(([key, value]) => {
              const labels = {
                relationshipHealth: 'Relationship Health',
                communicationScore: 'Communication',
                emotionalConnection: 'Emotional Connection',
                sharedGoalsProgress: 'Goals Progress',
                intimacyScore: 'Intimacy',
                conflictResolution: 'Conflict Resolution'
              };
              
              return (
                <Card key={key} className="relative overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 text-sm">{labels[key as keyof typeof labels]}</h3>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        value >= 80 ? 'bg-green-100 text-green-600' :
                        value >= 60 ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {value >= 80 ? <CheckCircle className="w-4 h-4" /> : 
                         value >= 60 ? <Activity className="w-4 h-4" /> : 
                         <AlertTriangle className="w-4 h-4" />}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-2">{value}%</div>
                    <Progress value={value} className="h-2" />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Detailed Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(metric.category)}
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{metric.name}</h4>
                          <p className="text-xs text-gray-600">Target: {metric.target}{metric.unit}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{metric.value}{metric.unit}</div>
                        <div className="flex items-center gap-1 text-xs">
                          {getTrendIcon(metric.trend)}
                          <span className={metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'}>
                            {metric.change > 0 ? '+' : ''}{metric.change}%
                          </span>
                        </div>
                      </div>
                      <div className="w-16">
                        <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Communication Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Communication Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">
                      {communicationData.reduce((sum, day) => sum + day.messages, 0)}
                    </div>
                    <div className="text-xs text-blue-600">Total Messages</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">
                      {Math.round(communicationData.reduce((sum, day) => sum + (day.positive / day.messages), 0) / communicationData.length * 100)}%
                    </div>
                    <div className="text-xs text-green-600">Positive Ratio</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">
                      {communicationData[communicationData.length - 1]?.syncSessions || 0}
                    </div>
                    <div className="text-xs text-purple-600">Sync Sessions</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">
                      {communicationData.reduce((sum, day) => sum + day.voiceInteractions, 0)}
                    </div>
                    <div className="text-xs text-orange-600">Voice Interactions</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Weekly Communication Health</span>
                    <Badge className="bg-green-100 text-green-700 text-xs">Excellent</Badge>
                  </div>
                  <Progress value={85} className="h-3" />
                  <p className="text-xs text-gray-600 mt-2">Communication quality has improved by 15% this week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI-Generated Insights
                </div>
                <Badge variant="outline" className="text-xs">
                  {insights.length} insights
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div key={insight.id} className={`p-4 border rounded-lg ${getInsightColor(insight.type)}`}>
                    <div className="flex items-start gap-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{insight.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>
                              {insight.impact} impact
                            </Badge>
                            <span className="text-xs text-gray-500">{insight.confidence}% confidence</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(insight.category)}
                            <span className="text-xs text-gray-600">{insight.category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {insight.timeframe}
                            </Badge>
                            {insight.actionable && (
                              <Badge className="bg-blue-100 text-blue-700 text-xs">
                                Actionable
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Goal Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Shared Goals Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goalProgress.map((goal) => (
                  <div key={goal.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(goal.category)}
                        <div>
                          <h4 className="font-medium text-gray-900">{goal.title}</h4>
                          <p className="text-xs text-gray-600">
                            Target: {goal.targetDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        {goal.progress}%
                      </Badge>
                    </div>
                    <Progress value={goal.progress} className="h-2 mb-2" />
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Milestones: {goal.milestones.completed}/{goal.milestones.total}</span>
                      <span>Updated: {goal.lastUpdated.toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Behavioral Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patterns.map((pattern) => (
                  <div key={pattern.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{pattern.pattern}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-purple-100 text-purple-700 text-xs">
                          {pattern.frequency}% frequency
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${
                          pattern.trend === 'increasing' ? 'text-green-600' :
                          pattern.trend === 'decreasing' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {pattern.trend}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{pattern.description}</p>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-1">Recommendation:</p>
                      <p className="text-sm text-blue-700">{pattern.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pattern Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Relationship Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-pink-50 rounded-lg">
                  <div className="text-2xl font-bold text-pink-600">35%</div>
                  <div className="text-sm text-pink-600">Play & Romance</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">40%</div>
                  <div className="text-sm text-blue-600">Duty & Balance</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">25%</div>
                  <div className="text-sm text-purple-600">Harmony & Growth</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">Well Balanced</div>
                  <div className="text-sm text-green-600">Overall Status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-600' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        <Target className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{rec.title}</h4>
                          <Badge className={`text-xs ${
                            rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {rec.priority} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(rec.category)}
                          <span className="text-xs text-gray-600">{rec.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button className="h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-xs">Start Conversation</span>
                </Button>
                <Button className="h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                  <Calendar className="w-5 h-5" />
                  <span className="text-xs">Schedule Date</span>
                </Button>
                <Button className="h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                  <Target className="w-5 h-5" />
                  <span className="text-xs">Set Goal</span>
                </Button>
                <Button className="h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  <Heart className="w-5 h-5" />
                  <span className="text-xs">Plan Ritual</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}