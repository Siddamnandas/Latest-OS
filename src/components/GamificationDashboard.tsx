'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  Star,
  Coins,
  Target,
  Flame,
  Crown,
  Heart,
  Zap,
  Award,
  TrendingUp,
  Gift,
  Sparkles,
  Unlock,
  Lock,
  Medal,
  Reward
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: string;
  type: string;
  requirements: Record<string, any>;
  rewards: {
    coins: number;
    xp: number;
    special_badge?: string;
  };
  motivational_message: string;
  psychological_impact: string;
  progress: {
    current: number;
    target: number;
    percentage: number;
    completed: boolean;
  };
  unlocked: boolean;
  unlocked_at?: string;
}

interface GamificationStats {
  total_achievements: number;
  completed_achievements: number;
  total_xp: number;
  current_level: number;
  xp_to_next_level: number;
  completion_rate: number;
}

interface MotivationInsights {
  engagement: number;
  consistency: boolean;
  growth_mindset: boolean;
  psychological_strength: string;
}

export function GamificationDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch achievements data
  const { data: achievementsData, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const response = await axios.get('/api/achievements');
      return response.data;
    },
  });

  // Test reward system
  const testRewardMutation = useMutation({
    mutationFn: async (action: string) => {
      const response = await axios.post('/api/achievements', {
        action,
        context: {},
        partner: false
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: `Rewards Earned! 🎉`,
        description: `${data.rewards.coins} coins, ${data.rewards.xp} XP`,
      });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'uncommon': return 'bg-green-100 text-green-700 border-green-300';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return '⭐';
      case 'uncommon': return '🌟';
      case 'rare': return '💎';
      case 'epic': return '👑';
      case 'legendary': return '🔥';
      default: return '⭐';
    }
  };

  const getPsychologicalImpactColor = (impact: string) => {
    switch (impact) {
      case 'momentum': return 'text-blue-500';
      case 'consistency': return 'text-green-500';
      case 'connection': return 'text-pink-500';
      case 'self_awareness': return 'text-purple-500';
      case 'mastery': return 'text-yellow-500';
      case 'generosity': return 'text-orange-500';
      case 'legacy': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const filterAchievements = (achievements: Achievement[]) => {
    if (!achievements || !selectedCategory || selectedCategory === 'all') {
      return achievements;
    }
    return achievements.filter(achievement => achievement.category === selectedCategory);
  };

  const stats = achievementsData?.stats || {};
  const achievements = achievementsData?.achievements || [];
  const motivationalInsights = achievementsData?.motivation_insights || {};
  const recommendations = achievementsData?.next_recommendations || [];

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-48 bg-gray-200 rounded-xl"></div>
            <div className="h-48 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 p-6 shadow-xl">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Achievement Center</h1>
              <p className="text-white/80 text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Level up your relationship journey through consistent growth! 🌟
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 text-center min-w-[80px]">
                <div className="text-white font-bold text-lg">
                  Level {stats.current_level || 1}
                </div>
                <div className="text-white/80 text-xs">Progress</div>
              </div>
              <div className="bg-yellow-400/90 backdrop-blur-lg rounded-xl p-4 text-center min-w-[100px]">
                <div className="flex items-center justify-center gap-1">
                  <Coins className="w-5 h-5 text-white" />
                  <span className="text-white font-bold">2,500</span>
                </div>
                <div className="text-white/80 text-xs">Coins Earned</div>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-white/90 font-medium">Experience Points</span>
              </div>
              <span className="text-white/90">
                {stats.total_xp || 0} / {(stats.current_level || 1) * 500} XP
              </span>
            </div>
            <Progress
              value={((stats.total_xp || 0) % 500) / 5}
              className="h-3 bg-white/30"
            />
            <p className="text-white/70 text-xs mt-1">
              {stats.xp_to_next_level || 0} XP until Level {(stats.current_level || 1) + 1}
            </p>
          </div>
        </div>
      </div>

      {/* Test Actions Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
        <h3 className="font-semibold mb-3 text-gray-800">🎮 Test Gamification Engine</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => testRewardMutation.mutate('daily_sync')}
            disabled={testRewardMutation.isPending}
            variant="outline"
            className="bg-blue-50 border-blue-200 hover:bg-blue-100"
          >
            <Heart className="w-4 h-4 mr-2" />
            Daily Sync Reward
          </Button>
          <Button
            onClick={() => testRewardMutation.mutate('memory_created')}
            disabled={testRewardMutation.isPending}
            variant="outline"
            className="bg-pink-50 border-pink-200 hover:bg-pink-100"
          >
            <Target className="w-4 h-4 mr-2" />
            Memory Created Reward
          </Button>
          <Button
            onClick={() => testRewardMutation.mutate('task_completed')}
            disabled={testRewardMutation.isPending}
            variant="outline"
            className="bg-green-50 border-green-200 hover:bg-green-100"
          >
            <Reward className="w-4 h-4 mr-2" />
            Task Completed Reward
          </Button>
        </div>
      </div>

      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          {/* Achievement Categories */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { id: 'all', label: 'All', icon: Trophy },
                  { id: 'daily_activity', label: 'Daily', icon: Heart },
                  { id: 'relationship_growth', label: 'Growth', icon: Target },
                  { id: 'family_engagement', label: 'Family', icon: Crown },
                  { id: 'personal_development', label: 'Personal', icon: Star },
                  { id: 'special_occasions', label: 'Special', icon: Gift }
                ].map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-purple-500 text-white border-purple-500 shadow-lg'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    {category.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievement Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterAchievements(achievements).map((achievement: Achievement) => (
              <Card
                key={achievement.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  achievement.progress.completed
                    ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
                    : 'border-gray-200'
                }`}
              >
                {achievement.progress.completed && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-green-500 text-white rounded-full p-1">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {getRarityIcon(achievement.rarity)} {achievement.rarity}
                      </Badge>
                    </div>
                    {achievement.progress.completed && (
                      <div className="text-2xl animate-pulse">🏆</div>
                    )}
                  </div>

                  <CardTitle className="text-lg leading-tight">{achievement.name}</CardTitle>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">
                        {achievement.progress.current} / {achievement.progress.target}
                      </span>
                    </div>
                    <Progress
                      value={achievement.progress.percentage}
                      className="h-2"
                    />
                  </div>

                  {/* Rewards */}
                  <div className="bg-gradient-to-r from-yellow-50 to-purple-50 rounded-lg p-3">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Gift className="w-4 h-4 text-purple-600" />
                      Rewards
                    </h4>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-yellow-600" />
                        <span className="font-semibold">{achievement.rewards.coins}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold">{achievement.rewards.xp} XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Psychological Insight */}
                  <div className="text-xs text-gray-600">
                    <span className={`font-medium ${getPsychologicalImpactColor(achievement.psychological_impact)}`}>
                      {achievement.psychological_impact.replace('_', ' ')}
                    </span>
                    {achievement.progress.completed && (
                      <p className="mt-1 text-green-600 font-medium">
                        🎉 {achievement.motivational_message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          {/* Overall Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-3xl font-bold text-purple-600">{stats.completed_achievements || 0}</div>
                <p className="text-sm text-gray-600">Achievements Unlocked</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-3xl font-bold text-blue-600">{stats.completion_rate?.toFixed(0) || 0}%</div>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Flame className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <div className="text-3xl font-bold text-red-600">7</div>
                <p className="text-sm text-gray-600">Longest Streak</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Medal className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <div className="text-3xl font-bold text-green-600">{stats.current_level || 1}</div>
                <p className="text-sm text-gray-600">Current Level</p>
              </CardContent>
            </Card>
          </div>

          {/* Motivation Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Motivation Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">💡 Engagement</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Engagement</span>
                      <span className="font-medium">{motivationalInsights.engagement?.toFixed(0) || 0}%</span>
                    </div>
                    <Progress value={motivationalInsights.engagement || 0} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Growth Mindset</span>
                      <span className="font-medium">{motivationalInsights.growth_mindset ? 'Yes' : 'Developing'}</span>
                    </div>
                    <div className="text-xs text-gray-600">Creating new habits and learning opportunities</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">🔥 Consistency</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Streak Performance</span>
                      <span className="font-medium">{motivationalInsights.psychological_strength || 'Good'}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {motivationalInsights.consistency
                        ? 'Great job maintaining regular engagement!'
                        : 'Keep building your participation habits'
                      }
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-sm">Daily Check-ins: 23 days this month</span>
                    </div>
                    <div className="text-xs text-gray-600">You're building momentum! 🚀</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec: any, index: number) => (
                  <div key={rec.id} className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-purple-600 font-medium">
                          🎁 {rec.potential_reward}
                        </span>
                        <span className="text-gray-600">
                          💡 {rec.psychological_benefit}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Unlock className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                  </div>
                ))}

                {recommendations.length === 0 && (
                  <div className="text-center py-8">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">All Achievements Unlocked!</h3>
                    <p className="text-gray-500">Keep engaging to earn more rewards and unlock new achievements.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Motivation Boosters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-600" />
                Motivation Boosters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">🔥 Habit Streaks</h4>
                  <p className="text-sm text-orange-700 mb-3">
                    Build the power of consistency! Every day you engage strengthens your relationship muscles.
                  </p>
                  <div className="text-2xl font-bold text-orange-600">7 🔥</div>
                  <div className="text-xs text-orange-600 mt-1">Current streak</div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">🎯 Achievement Psychology</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    Each unlocked achievement celebrates your journey and motivates continued growth.
                  </p>
                  <div className="text-2xl font-bold text-purple-600">{stats.completed_achievements || 0}</div>
                  <div className="text-xs text-purple-600 mt-1">Achievements earned</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
