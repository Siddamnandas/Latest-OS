'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Heart, 
  Target, 
  TrendingUp, 
  Clock, 
  Star,
  Sparkles,
  MessageCircle,
  Lightbulb,
  Users,
  Zap,
  Award
} from 'lucide-react';
import { MagicButton } from '@/components/MagicButton';
import { InteractiveConfetti } from '@/components/InteractiveConfetti';
import { FloatingEmoji } from '@/components/FloatingEmoji';
import { AIConversationInterface } from '@/components/AIConversationInterface';
import { useToast } from '@/hooks/use-toast';

interface AICoachingSession {
  id: string;
  type: 'daily_checkin' | 'relationship_analysis' | 'goal_setting' | 'conflict_resolution';
  title: string;
  description: string;
  aiInsights: string[];
  actionItems: string[];
  completed: boolean;
  scheduledFor?: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface RelationshipInsight {
  id: string;
  category: 'communication' | 'intimacy' | 'conflict' | 'growth' | 'values';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  aiRecommendation: string;
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: string;
}

interface CoachingProgress {
  totalSessions: number;
  completedSessions: number;
  currentStreak: number;
  longestStreak: number;
  insightsGenerated: number;
  actionItemsCompleted: number;
  relationshipScore: number;
}

export function AICoachingDashboard() {
  const [coachingSessions, setCoachingSessions] = useState<AICoachingSession[]>([]);
  const [insights, setInsights] = useState<RelationshipInsight[]>([]);
  const [progress, setProgress] = useState<CoachingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFloatingEmoji, setShowFloatingEmoji] = useState(false);
  const [celebrationEmoji, setCelebrationEmoji] = useState('🎉');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showConversation, setShowConversation] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeCoachingData();
  }, []);

  const initializeCoachingData = () => {
    // Mock AI coaching sessions
    const sessionsData: AICoachingSession[] = [
      {
        id: '1',
        type: 'daily_checkin',
        title: 'Daily Relationship Check-in',
        description: 'AI-powered daily assessment of your relationship health',
        aiInsights: [
          'Communication patterns show 85% positivity',
          'Task balance is well-maintained this week',
          'Emotional connection indicators are strong',
          'Quality time spent together increased by 20%'
        ],
        actionItems: [
          'Schedule 15 minutes of uninterrupted conversation tonight',
          'Express appreciation for partner\'s effort on household tasks',
          'Plan a weekend activity that both enjoy',
          'Practice active listening during next conversation'
        ],
        completed: false,
        duration: 10,
        difficulty: 'beginner'
      },
      {
        id: '2',
        type: 'relationship_analysis',
        title: 'Deep Relationship Analysis',
        description: 'Comprehensive AI analysis of your relationship patterns',
        aiInsights: [
          'Love languages: Words of Affirmation and Quality Time',
          'Conflict resolution style: Collaborative and constructive',
          'Stress management: Good support system during challenges',
          'Growth areas: More shared decision-making needed'
        ],
        actionItems: [
          'Take love language assessment together',
          'Practice collaborative decision-making on next major purchase',
          'Establish weekly stress-check conversations',
          'Create shared vision board for future goals'
        ],
        completed: false,
        duration: 25,
        difficulty: 'intermediate'
      },
      {
        id: '3',
        type: 'goal_setting',
        title: 'Relationship Goal Setting',
        description: 'AI-assisted goal setting for relationship growth',
        aiInsights: [
          'Current goals: 75% aligned between partners',
          'Short-term goals well-defined, long-term needs clarity',
          'Financial goals are synchronized and realistic',
          'Family planning goals need more detailed timeline'
        ],
        actionItems: [
          'Schedule goal alignment session for this weekend',
          'Create 5-year relationship vision document',
          'Break down long-term goals into quarterly milestones',
          'Set up monthly goal review meetings'
        ],
        completed: false,
        duration: 30,
        difficulty: 'advanced'
      }
    ];

    // Mock relationship insights
    const insightsData: RelationshipInsight[] = [
      {
        id: '1',
        category: 'communication',
        title: 'Communication Quality',
        description: 'Your communication patterns show healthy expression and active listening',
        impact: 'high',
        aiRecommendation: 'Continue daily check-ins and practice expressing appreciation verbally',
        trend: 'improving',
        lastUpdated: '2 hours ago'
      },
      {
        id: '2',
        category: 'intimacy',
        title: 'Emotional Connection',
        description: 'Emotional intimacy is strong but could benefit from more quality time',
        impact: 'medium',
        aiRecommendation: 'Schedule regular date nights and practice daily gratitude sharing',
        trend: 'stable',
        lastUpdated: '1 day ago'
      },
      {
        id: '3',
        category: 'conflict',
        title: 'Conflict Resolution',
        description: 'Conflict resolution skills are excellent with constructive approaches',
        impact: 'high',
        aiRecommendation: 'Maintain current conflict resolution strategies and share successes',
        trend: 'improving',
        lastUpdated: '3 hours ago'
      },
      {
        id: '4',
        category: 'growth',
        title: 'Personal Growth',
        description: 'Both partners showing strong personal development and mutual support',
        impact: 'medium',
        aiRecommendation: 'Set individual growth goals that align with relationship vision',
        trend: 'improving',
        lastUpdated: '5 hours ago'
      },
      {
        id: '5',
        category: 'values',
        title: 'Value Alignment',
        description: 'Core values are well-aligned with minor differences in lifestyle preferences',
        impact: 'high',
        aiRecommendation: 'Explore lifestyle compromises that honor both partners\' preferences',
        trend: 'stable',
        lastUpdated: '1 day ago'
      }
    ];

    // Mock progress data
    const progressData: CoachingProgress = {
      totalSessions: 24,
      completedSessions: 18,
      currentStreak: 7,
      longestStreak: 14,
      insightsGenerated: 156,
      actionItemsCompleted: 89,
      relationshipScore: 85
    };

    setCoachingSessions(sessionsData);
    setInsights(insightsData);
    setProgress(progressData);
    setLoading(false);
  };

  // Handle session completion
  const handleSessionComplete = (sessionId: string) => {
    setCoachingSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, completed: true }
          : session
      )
    );
    
    setCelebrationEmoji('🎯');
    setShowFloatingEmoji(true);
    setShowConfetti(true);
    
    toast({
      title: "Coaching Session Complete! 🎉",
      description: "Great job completing your AI coaching session!",
      duration: 3000,
    });
    
    setTimeout(() => setShowFloatingEmoji(false), 2000);
    setTimeout(() => setShowConfetti(false), 3000);
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

  const handleStartConversation = () => {
    setShowConversation(true);
    setActiveTab('conversation');
  };

  const handleSessionSummary = (summary: any) => {
    setShowConversation(false);
    setActiveTab('dashboard');
    
    setCelebrationEmoji('🎯');
    setShowFloatingEmoji(true);
    setShowConfetti(true);
    
    toast({
      title: "Coaching Session Complete! 🎉",
      description: "Great job completing your AI coaching session!",
      duration: 3000,
    });
    
    setTimeout(() => setShowFloatingEmoji(false), 2000);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'daily_checkin': return <Clock className="w-5 h-5" />;
      case 'relationship_analysis': return <Brain className="w-5 h-5" />;
      case 'goal_setting': return <Target className="w-5 h-5" />;
      case 'conflict_resolution': return <Heart className="w-5 h-5" />;
      default: return <MessageCircle className="w-5 h-5" />;
    }
  };

  const getSessionColor = (type: string) => {
    switch (type) {
      case 'daily_checkin': return 'from-blue-500 to-cyan-500';
      case 'relationship_analysis': return 'from-purple-500 to-pink-500';
      case 'goal_setting': return 'from-green-500 to-emerald-500';
      case 'conflict_resolution': return 'from-red-500 to-orange-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'communication': return <MessageCircle className="w-4 h-4" />;
      case 'intimacy': return <Heart className="w-4 h-4" />;
      case 'conflict': return <Zap className="w-4 h-4" />;
      case 'growth': return <TrendingUp className="w-4 h-4" />;
      case 'values': return <Star className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'stable': return '➡️';
      case 'declining': return '📉';
      default: return '📊';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
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

  return (
    <div className="p-4 space-y-6">
      {/* Interactive Elements */}
      <InteractiveConfetti trigger={showConfetti} />
      <FloatingEmoji emoji={celebrationEmoji} trigger={showFloatingEmoji} />

      {/* Animated Header */}
      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AI Coaching</h1>
            <p className="text-gray-600 text-sm">Personalized guidance for your relationship</p>
          </div>
        </div>
        <MagicButton onClick={handleStartConversation} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg">
          <Sparkles className="w-4 h-4 mr-2" />
          Start Conversation
        </MagicButton>
      </div>

      {/* Progress Overview */}
      {progress && (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Your Coaching Journey</h3>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                Level {Math.floor(progress.completedSessions / 5) + 1}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{progress.currentStreak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{progress.relationshipScore}%</div>
                <div className="text-sm text-gray-600">Relationship Score</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Session Progress</span>
                  <span>{progress.completedSessions}/{progress.totalSessions}</span>
                </div>
                <Progress value={(progress.completedSessions / progress.totalSessions) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Action Items Completed</span>
                  <span>{progress.actionItemsCompleted} completed</span>
                </div>
                <Progress value={(progress.actionItemsCompleted / 100) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all duration-200">
            <Brain className="w-4 h-4 mr-2" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="conversation" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all duration-200">
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all duration-200">
            <Lightbulb className="w-4 h-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all duration-200">
            <TrendingUp className="w-4 h-4 mr-2" />
            Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="space-y-4">
            {coachingSessions.map((session) => (
              <Card key={session.id} className={`overflow-hidden card-hover-lift interactive-card ${
                session.completed ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-white'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${getSessionColor(session.type)} text-white`}>
                        {getSessionIcon(session.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{session.title}</h3>
                        <p className="text-sm text-gray-600">{session.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getDifficultyColor(session.difficulty)}>
                            {session.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {session.duration} min
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {session.completed && (
                      <Badge className="bg-green-100 text-green-700">
                        ✓ Completed
                      </Badge>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-500" />
                      AI Insights:
                    </h4>
                    <ul className="space-y-1">
                      {session.aiInsights.map((insight, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-purple-500 mt-0.5">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 mb-3">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      Action Items:
                    </h4>
                    <ol className="space-y-1">
                      {session.actionItems.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-blue-500 font-medium">{index + 1}.</span>
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {!session.completed && (
                    <div className="flex justify-end">
                      <MagicButton 
                        size="sm"
                        onClick={() => handleSessionComplete(session.id)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Award className="w-4 h-4 mr-2" />
                        Start Session
                      </MagicButton>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="conversation" className="space-y-4">
          <AIConversationInterface 
            sessionId="current-session"
            onSessionComplete={handleSessionSummary}
          />
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="space-y-4">
            {insights.map((insight) => (
              <Card key={insight.id} className="bg-white card-hover-lift interactive-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {getCategoryIcon(insight.category)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getImpactColor(insight.impact)}>
                            {insight.impact} impact
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getTrendIcon(insight.trend)} {insight.trend}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Updated {insight.lastUpdated}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 mb-3">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      AI Recommendation:
                    </h4>
                    <p className="text-sm text-gray-700">{insight.aiRecommendation}</p>
                  </div>

                  <div className="flex justify-end">
                    <MagicButton 
                      size="sm"
                      onClick={() => handleInsightAction(insight.id)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Apply Insight
                    </MagicButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          {progress && (
            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Coaching Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{progress.totalSessions}</div>
                      <div className="text-sm text-gray-600">Total Sessions</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{progress.completedSessions}</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{progress.insightsGenerated}</div>
                      <div className="text-sm text-gray-600">AI Insights</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-pink-600">{progress.actionItemsCompleted}</div>
                      <div className="text-sm text-gray-600">Actions Taken</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🔥</div>
                        <div>
                          <div className="font-medium">On Fire!</div>
                          <div className="text-sm text-gray-600">{progress.currentStreak} day streak</div>
                        </div>
                      </div>
                      {progress.currentStreak >= 7 && (
                        <Badge className="bg-orange-100 text-orange-700">Active</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🎯</div>
                        <div>
                          <div className="font-medium">Goal Getter</div>
                          <div className="text-sm text-gray-600">75% session completion</div>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">Earned</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">💡</div>
                        <div>
                          <div className="font-medium">Insight Master</div>
                          <div className="text-sm text-gray-600">150+ insights generated</div>
                        </div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700">Earned</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}