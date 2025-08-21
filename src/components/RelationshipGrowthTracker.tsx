'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Calendar, 
  Star,
  Heart,
  Brain,
  Users,
  CheckCircle,
  Plus,
  BarChart3,
  PieChart,
  Activity,
  Flag,
  Zap,
  Lightbulb,
  Clock,
  Trophy,
  Medal,
  Gift,
  MessageCircle,
  Minus
} from 'lucide-react';
import { MagicButton } from '@/components/MagicButton';
import { InteractiveConfetti } from '@/components/InteractiveConfetti';
import { FloatingEmoji } from '@/components/FloatingEmoji';
import { useToast } from '@/hooks/use-toast';

interface GrowthGoal {
  id: string;
  title: string;
  description: string;
  category: 'communication' | 'intimacy' | 'conflict_resolution' | 'shared_goals' | 'personal_growth';
  targetDate: Date;
  progress: number;
  milestones: Milestone[];
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  partnerAligned: boolean;
  lastUpdated: Date;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completed: boolean;
  completedDate?: Date;
  evidence?: string;
}

interface GrowthMetric {
  category: string;
  score: number;
  trend: 'improving' | 'stable' | 'declining';
  change: number;
  weeklyData: { week: string; score: number }[];
  insights: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
}

interface GrowthJourney {
  phase: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  keyAchievements: string[];
  lessonsLearned: string[];
  overallProgress: number;
}

export function RelationshipGrowthTracker() {
  const [goals, setGoals] = useState<GrowthGoal[]>([]);
  const [metrics, setMetrics] = useState<GrowthMetric[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [journey, setJourney] = useState<GrowthJourney[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFloatingEmoji, setShowFloatingEmoji] = useState(false);
  const [celebrationEmoji, setCelebrationEmoji] = useState('🎉');
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    initializeGrowthData();
  }, []);

  const initializeGrowthData = () => {
    // Mock growth goals
    const goalsData: GrowthGoal[] = [
      {
        id: '1',
        title: 'Improve Daily Communication',
        description: 'Establish consistent, meaningful daily communication patterns',
        category: 'communication',
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        progress: 75,
        completed: false,
        priority: 'high',
        partnerAligned: true,
        lastUpdated: new Date(),
        milestones: [
          {
            id: '1-1',
            title: 'Daily Check-in Ritual',
            description: 'Establish 15-minute daily conversation ritual',
            targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            completed: true,
            completedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            evidence: 'Completed 30 consecutive days of daily check-ins'
          },
          {
            id: '1-2',
            title: 'Active Listening Practice',
            description: 'Practice active listening techniques in all conversations',
            targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            completed: true,
            completedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            evidence: 'Partner feedback shows improved listening skills'
          },
          {
            id: '1-3',
            title: 'Deep Conversations',
            description: 'Have weekly deep conversations about feelings and goals',
            targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            completed: false
          }
        ]
      },
      {
        id: '2',
        title: 'Strengthen Emotional Intimacy',
        description: 'Build deeper emotional connection and vulnerability',
        category: 'intimacy',
        targetDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days from now
        progress: 60,
        completed: false,
        priority: 'high',
        partnerAligned: true,
        lastUpdated: new Date(),
        milestones: [
          {
            id: '2-1',
            title: 'Vulnerability Practice',
            description: 'Practice sharing fears and dreams safely',
            targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
            completed: true,
            completedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
          },
          {
            id: '2-2',
            title: 'Emotional Support System',
            description: 'Create reliable emotional support patterns',
            targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            completed: false
          }
        ]
      },
      {
        id: '3',
        title: 'Master Conflict Resolution',
        description: 'Develop healthy conflict resolution strategies',
        category: 'conflict_resolution',
        targetDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000), // 150 days from now
        progress: 45,
        completed: false,
        priority: 'medium',
        partnerAligned: true,
        lastUpdated: new Date(),
        milestones: [
          {
            id: '3-1',
            title: 'Conflict Identification',
            description: 'Learn to identify early conflict signs',
            targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            completed: true,
            completedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    ];

    // Mock growth metrics
    const metricsData: GrowthMetric[] = [
      {
        category: 'Communication Quality',
        score: 85,
        trend: 'improving',
        change: 12,
        weeklyData: [
          { week: 'W1', score: 70 },
          { week: 'W2', score: 72 },
          { week: 'W3', score: 75 },
          { week: 'W4', score: 78 },
          { week: 'W5', score: 82 },
          { week: 'W6', score: 85 }
        ],
        insights: [
          'Consistent improvement in active listening',
          'Daily check-ins are strengthening connection',
          'Expressing appreciation more frequently'
        ]
      },
      {
        category: 'Emotional Intimacy',
        score: 72,
        trend: 'improving',
        change: 8,
        weeklyData: [
          { week: 'W1', score: 65 },
          { week: 'W2', score: 67 },
          { week: 'W3', score: 68 },
          { week: 'W4', score: 70 },
          { week: 'W5', score: 71 },
          { week: 'W6', score: 72 }
        ],
        insights: [
          'Vulnerability practice is paying off',
          'More comfortable sharing deeper emotions',
          'Emotional support patterns are strengthening'
        ]
      },
      {
        category: 'Conflict Resolution',
        score: 68,
        trend: 'stable',
        change: 2,
        weeklyData: [
          { week: 'W1', score: 65 },
          { week: 'W2', score: 66 },
          { week: 'W3', score: 67 },
          { week: 'W4', score: 68 },
          { week: 'W5', score: 67 },
          { week: 'W6', score: 68 }
        ],
        insights: [
          'Conflict identification skills improving',
          'Need more practice in de-escalation techniques',
          'Maintaining constructive approach during disagreements'
        ]
      },
      {
        category: 'Shared Goals Alignment',
        score: 90,
        trend: 'improving',
        change: 15,
        weeklyData: [
          { week: 'W1', score: 75 },
          { week: 'W2', score: 78 },
          { week: 'W3', score: 82 },
          { week: 'W4', score: 85 },
          { week: 'W5', score: 88 },
          { week: 'W6', score: 90 }
        ],
        insights: [
          'Excellent progress on goal alignment',
          'Regular goal reviews are effective',
          'Both partners highly committed to shared vision'
        ]
      }
    ];

    // Mock achievements
    const achievementsData: Achievement[] = [
      {
        id: '1',
        title: 'Communication Champion',
        description: 'Completed 30 days of consistent daily communication',
        icon: '🗣️',
        unlockedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        rarity: 'rare',
        progress: 30,
        maxProgress: 30
      },
      {
        id: '2',
        title: 'Vulnerability Hero',
        description: 'Successfully shared deep emotions and fears',
        icon: '💪',
        unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        rarity: 'rare',
        progress: 1,
        maxProgress: 1
      },
      {
        id: '3',
        title: 'Goal Master',
        description: 'Aligned 90% of relationship goals with partner',
        icon: '🎯',
        unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        rarity: 'epic',
        progress: 90,
        maxProgress: 100
      },
      {
        id: '4',
        title: 'Consistency King',
        description: 'Maintained relationship habits for 100 days',
        icon: '👑',
        unlockedAt: new Date(),
        rarity: 'legendary',
        progress: 100,
        maxProgress: 100
      }
    ];

    // Mock growth journey
    const journeyData: GrowthJourney[] = [
      {
        phase: 'Foundation Building',
        startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
        endDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
        description: 'Establishing basic communication patterns and trust',
        keyAchievements: [
          'Established daily communication ritual',
          'Built basic trust and safety',
          'Created shared relationship vision'
        ],
        lessonsLearned: [
          'Consistency is key to building trust',
          'Small daily actions create big impact',
          'Patience and understanding are essential'
        ],
        overallProgress: 100
      },
      {
        phase: 'Deepening Connection',
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
        endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
        description: 'Building emotional intimacy and vulnerability',
        keyAchievements: [
          'Deepened emotional connection',
          'Improved conflict resolution skills',
          'Strengthened emotional support system'
        ],
        lessonsLearned: [
          'Vulnerability creates deeper connection',
          'Emotional safety is crucial for growth',
          'Conflict can be constructive when handled well'
        ],
        overallProgress: 100
      },
      {
        phase: 'Growth Acceleration',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
        description: 'Accelerating personal and relationship growth',
        keyAchievements: [
          'Achieved goal alignment milestone',
          'Established advanced communication patterns',
          'Created sustainable growth systems'
        ],
        lessonsLearned: [
          'AI coaching provides valuable insights',
          'Regular check-ins prevent small issues from growing',
          'Celebrating progress maintains motivation'
        ],
        overallProgress: 65
      }
    ];

    setGoals(goalsData);
    setMetrics(metricsData);
    setAchievements(achievementsData);
    setJourney(journeyData);
    setLoading(false);
  };

  const handleGoalComplete = (goalId: string) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, completed: true, progress: 100 }
          : goal
      )
    );
    
    setCelebrationEmoji('🎯');
    setShowFloatingEmoji(true);
    setShowConfetti(true);
    
    toast({
      title: "Goal Completed! 🎉",
      description: "Congratulations on achieving your relationship goal!",
      duration: 3000,
    });
    
    setTimeout(() => setShowFloatingEmoji(false), 2000);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleMilestoneComplete = (goalId: string, milestoneId: string) => {
    setGoals(prev => 
      prev.map(goal => {
        if (goal.id === goalId) {
          const updatedMilestones = goal.milestones.map(milestone => 
            milestone.id === milestoneId 
              ? { ...milestone, completed: true, completedDate: new Date() }
              : milestone
          );
          
          const completedMilestones = updatedMilestones.filter(m => m.completed).length;
          const newProgress = (completedMilestones / updatedMilestones.length) * 100;
          
          return {
            ...goal,
            milestones: updatedMilestones,
            progress: newProgress,
            completed: newProgress === 100
          };
        }
        return goal;
      })
    );
    
    setCelebrationEmoji('✅');
    setShowFloatingEmoji(true);
    
    toast({
      title: "Milestone Completed! 🎯",
      description: "Great progress on your relationship journey!",
      duration: 3000,
    });
    
    setTimeout(() => setShowFloatingEmoji(false), 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'communication': return <MessageCircle className="w-4 h-4" />;
      case 'intimacy': return <Heart className="w-4 h-4" />;
      case 'conflict_resolution': return <Zap className="w-4 h-4" />;
      case 'shared_goals': return <Target className="w-4 h-4" />;
      case 'personal_growth': return <TrendingUp className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'communication': return 'from-blue-500 to-cyan-500';
      case 'intimacy': return 'from-pink-500 to-rose-500';
      case 'conflict_resolution': return 'from-orange-500 to-red-500';
      case 'shared_goals': return 'from-green-500 to-emerald-500';
      case 'personal_growth': return 'from-purple-500 to-violet-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700';
      case 'rare': return 'bg-blue-100 text-blue-700';
      case 'epic': return 'bg-purple-100 text-purple-700';
      case 'legendary': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getOverallProgress = () => {
    if (goals.length === 0) return 0;
    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0);
    return Math.round(totalProgress / goals.length);
  };

  const getCompletedGoals = () => {
    return goals.filter(goal => goal.completed).length;
  };

  const getActiveGoals = () => {
    return goals.filter(goal => !goal.completed).length;
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

  const overallProgress = getOverallProgress();
  const completedGoals = getCompletedGoals();
  const activeGoals = getActiveGoals();

  return (
    <div className="p-4 space-y-6">
      {/* Interactive Elements */}
      <InteractiveConfetti trigger={showConfetti} />
      <FloatingEmoji emoji={celebrationEmoji} trigger={showFloatingEmoji} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Growth Tracker</h1>
            <p className="text-gray-600 text-sm">Track your relationship development journey</p>
          </div>
        </div>
        <MagicButton className="bg-gradient-to-r from-green-500 to-blue-500">
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </MagicButton>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Growth Overview</h3>
            <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
              Level {Math.floor(overallProgress / 25) + 1}
            </Badge>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span className="font-medium">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{activeGoals}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{achievements.length}</div>
              <div className="text-sm text-gray-600">Achievements</div>
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
          <TabsTrigger value="goals" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
            <Target className="w-4 h-4 mr-2" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="metrics" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
            <BarChart3 className="w-4 h-4 mr-2" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="journey" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
            <Calendar className="w-4 h-4 mr-2" />
            Journey
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Active Goals */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Goals</h3>
            <div className="space-y-4">
              {goals.filter(goal => !goal.completed).slice(0, 2).map((goal) => (
                <Card key={goal.id} className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(goal.category)} text-white`}>
                          {getCategoryIcon(goal.category)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                          <p className="text-sm text-gray-600">{goal.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getPriorityColor(goal.priority)}>
                              {goal.priority}
                            </Badge>
                            {goal.partnerAligned && (
                              <Badge className="bg-green-100 text-green-700">
                                Partner Aligned
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{goal.progress}%</div>
                        <div className="text-xs text-gray-500">Complete</div>
                      </div>
                    </div>
                    
                    <Progress value={goal.progress} className="mb-3" />
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Target: {goal.targetDate.toLocaleDateString()}
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleGoalComplete(goal.id)}
                        disabled={goal.progress < 100}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Complete Goal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.slice(0, 4).map((achievement) => (
                <Card key={achievement.id} className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Unlocked {achievement.unlockedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="space-y-4">
            {goals.map((goal) => (
              <Card key={goal.id} className={`bg-white ${goal.completed ? 'border-green-200 bg-green-50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(goal.category)} text-white`}>
                        {getCategoryIcon(goal.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                          {goal.completed && (
                            <Badge className="bg-green-100 text-green-700">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(goal.priority)}>
                            {goal.priority}
                          </Badge>
                          {goal.partnerAligned && (
                            <Badge className="bg-green-100 text-green-700">
                              Partner Aligned
                            </Badge>
                          )}
                          <Badge variant="outline">
                            <Calendar className="w-3 h-3 mr-1" />
                            {goal.targetDate.toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{goal.progress}%</div>
                      <div className="text-xs text-gray-500">Progress</div>
                    </div>
                  </div>
                  
                  <Progress value={goal.progress} className="mb-4" />
                  
                  {/* Milestones */}
                  <div className="space-y-2 mb-4">
                    <h5 className="font-medium text-gray-900 text-sm">Milestones:</h5>
                    {goal.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          {milestone.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{milestone.title}</div>
                            <div className="text-xs text-gray-600">{milestone.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {milestone.targetDate.toLocaleDateString()}
                          </span>
                          {!milestone.completed && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleMilestoneComplete(goal.id, milestone.id)}
                              className="text-xs"
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {!goal.completed && (
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => handleGoalComplete(goal.id)}
                        disabled={goal.progress < 100}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Complete Goal
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.category} className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{metric.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl font-bold text-blue-600">{metric.score}</div>
                    <div className="flex items-center gap-1">
                      {metric.trend === 'improving' && <TrendingUp className="w-4 h-4 text-green-600" />}
                      {metric.trend === 'declining' && <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />}
                      {metric.trend === 'stable' && <Minus className="w-4 h-4 text-gray-600" />}
                      <span className={`text-sm font-medium ${
                        metric.trend === 'improving' ? 'text-green-600' : 
                        metric.trend === 'declining' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {metric.weeklyData.map((data, index) => (
                      <div key={data.week} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{data.week}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${data.score}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-900 font-medium">{data.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-3">
                    <h5 className="font-medium text-gray-900 mb-2">AI Insights:</h5>
                    <ul className="space-y-1">
                      {metric.insights.map((insight, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="journey" className="space-y-4">
          <div className="space-y-4">
            {journey.map((phase, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{phase.phase}</h3>
                      <p className="text-sm text-gray-600 mb-2">{phase.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{phase.startDate.toLocaleDateString()} - {phase.endDate?.toLocaleDateString() || 'Present'}</span>
                        <Badge className="bg-blue-100 text-blue-700">
                          {phase.overallProgress}% Complete
                        </Badge>
                      </div>
                    </div>
                    {phase.overallProgress === 100 && (
                      <div className="text-3xl">🏆</div>
                    )}
                  </div>
                  
                  <Progress value={phase.overallProgress} className="mb-4" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Key Achievements:</h5>
                      <ul className="space-y-1">
                        {phase.keyAchievements.map((achievement, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Lessons Learned:</h5>
                      <ul className="space-y-1">
                        {phase.lessonsLearned.map((lesson, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            {lesson}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}