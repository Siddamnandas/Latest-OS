'use client';

import { useState, useEffect } from 'react';
import { useFeatureFlag } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Star, 
  Target, 
  Calendar, 
  Award, 
  Clock,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Users,
  Heart,
  Brain,
  Zap,
  Gift,
  Crown,
  Medal,
  Gem,
  Hash,
  Share,
  Lock
} from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  category: 'relationship' | 'communication' | 'intimacy' | 'growth' | 'wellness' | 'achievement';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  progress: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  requirements: {
    type: 'streak' | 'activities' | 'syncs' | 'programs' | 'coins' | 'time';
    target: number;
    current: number;
    unit: string;
  };
  rewards: {
    coins: number;
    experience: number;
    badges: string[];
    specialFeatures: string[];
  };
  dateCompleted?: string;
  shareable: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedDate?: string;
  progress: number;
  maxProgress: number;
  category: string;
}

export function MilestoneSystem() {
  const enabled = useFeatureFlag('milestone-system');
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userStats, setUserStats] = useState({
    totalMilestones: 0,
    completedMilestones: 0,
    totalAchievements: 0,
    unlockedAchievements: 0,
    currentLevel: 5,
    totalExperience: 1250,
    nextLevelExperience: 1500,
    longestStreak: 15,
    currentStreak: 7,
    totalCoins: 850
  });

  useEffect(() => {
    if (!enabled) return;
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMilestones([
        {
          id: 'first-sync',
          title: 'First Connection',
          description: 'Complete your first daily sync together',
          category: 'relationship',
          tier: 'bronze',
          progress: 100,
          isCompleted: true,
          isUnlocked: true,
          requirements: {
            type: 'syncs',
            target: 1,
            current: 1,
            unit: 'sync'
          },
          rewards: {
            coins: 50,
            experience: 100,
            badges: ['First Steps'],
            specialFeatures: ['Profile badge']
          },
          dateCompleted: '2024-01-01',
          shareable: true
        },
        {
          id: 'week-streak',
          title: 'Week Warrior',
          description: 'Maintain a 7-day sync streak',
          category: 'relationship',
          tier: 'silver',
          progress: 100,
          isCompleted: true,
          isUnlocked: true,
          requirements: {
            type: 'streak',
            target: 7,
            current: 7,
            unit: 'days'
          },
          rewards: {
            coins: 150,
            experience: 250,
            badges: ['Consistency Keeper'],
            specialFeatures: ['Streak bonus']
          },
          dateCompleted: '2024-01-07',
          shareable: true
        },
        {
          id: 'communication-master',
          title: 'Communication Master',
          description: 'Complete 50 meaningful conversations',
          category: 'communication',
          tier: 'gold',
          progress: 75,
          isCompleted: false,
          isUnlocked: true,
          requirements: {
            type: 'activities',
            target: 50,
            current: 38,
            unit: 'conversations'
          },
          rewards: {
            coins: 300,
            experience: 500,
            badges: ['Communication Expert'],
            specialFeatures: ['Advanced conversation tools']
          },
          shareable: true
        },
        {
          id: 'intimacy-builder',
          title: 'Intimacy Builder',
          description: 'Complete 20 intimacy-building activities',
          category: 'intimacy',
          tier: 'silver',
          progress: 60,
          isCompleted: false,
          isUnlocked: true,
          requirements: {
            type: 'activities',
            target: 20,
            current: 12,
            unit: 'activities'
          },
          rewards: {
            coins: 200,
            experience: 350,
            badges: ['Connection Builder'],
            specialFeatures: ['Intimacy insights']
          },
          shareable: true
        },
        {
          id: 'wellness-champion',
          title: 'Wellness Champion',
          description: 'Complete 3 wellness programs',
          category: 'wellness',
          tier: 'gold',
          progress: 33,
          isCompleted: false,
          isUnlocked: true,
          requirements: {
            type: 'programs',
            target: 3,
            current: 1,
            unit: 'programs'
          },
          rewards: {
            coins: 400,
            experience: 600,
            badges: ['Wellness Master'],
            specialFeatures: ['Personalized wellness plan']
          },
          shareable: true
        },
        {
          id: 'relationship-guru',
          title: 'Relationship Guru',
          description: 'Reach 100 days of consistent growth',
          category: 'growth',
          tier: 'platinum',
          progress: 15,
          isCompleted: false,
          isUnlocked: true,
          requirements: {
            type: 'time',
            target: 100,
            current: 15,
            unit: 'days'
          },
          rewards: {
            coins: 1000,
            experience: 1500,
            badges: ['Relationship Master'],
            specialFeatures: ['Exclusive content', 'Expert consultation']
          },
          shareable: true
        }
      ]);

      setAchievements([
        {
          id: 'first-sync-achievement',
          title: 'First Steps',
          description: 'Completed your first daily sync',
          icon: '👣',
          rarity: 'common',
          unlocked: true,
          unlockedDate: '2024-01-01',
          progress: 1,
          maxProgress: 1,
          category: 'relationship'
        },
        {
          id: 'streak-warrior',
          title: 'Streak Warrior',
          description: 'Maintained a 7-day streak',
          icon: '🔥',
          rarity: 'rare',
          unlocked: true,
          unlockedDate: '2024-01-07',
          progress: 1,
          maxProgress: 1,
          category: 'relationship'
        },
        {
          id: 'communication-explorer',
          title: 'Communication Explorer',
          description: 'Tried 5 different communication techniques',
          icon: '🗣️',
          rarity: 'rare',
          unlocked: true,
          unlockedDate: '2024-01-10',
          progress: 1,
          maxProgress: 1,
          category: 'communication'
        },
        {
          id: 'wellness-beginner',
          title: 'Wellness Beginner',
          description: 'Started your first wellness program',
          icon: '🌱',
          rarity: 'common',
          unlocked: true,
          unlockedDate: '2024-01-05',
          progress: 1,
          maxProgress: 1,
          category: 'wellness'
        },
        {
          id: 'milestone-collector',
          title: 'Milestone Collector',
          description: 'Complete 10 milestones',
          icon: '🏆',
          rarity: 'epic',
          unlocked: false,
          progress: 2,
          maxProgress: 10,
          category: 'achievement'
        },
        {
          id: 'relationship-legend',
          title: 'Relationship Legend',
          description: 'Reach level 20 in relationship mastery',
          icon: '👑',
          rarity: 'legendary',
          unlocked: false,
          progress: 5,
          maxProgress: 20,
          category: 'achievement'
        }
      ]);

      setLoading(false);
    };

    fetchData();
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'relationship':
        return { 
          name: 'Relationship', 
          icon: Heart, 
          color: 'bg-pink-100 text-pink-700',
          borderColor: 'border-pink-200'
        };
      case 'communication':
        return { 
          name: 'Communication', 
          icon: Brain, 
          color: 'bg-blue-100 text-blue-700',
          borderColor: 'border-blue-200'
        };
      case 'intimacy':
        return { 
          name: 'Intimacy', 
          icon: Heart, 
          color: 'bg-red-100 text-red-700',
          borderColor: 'border-red-200'
        };
      case 'growth':
        return { 
          name: 'Growth', 
          icon: TrendingUp, 
          color: 'bg-green-100 text-green-700',
          borderColor: 'border-green-200'
        };
      case 'wellness':
        return { 
          name: 'Wellness', 
          icon: Sparkles, 
          color: 'bg-purple-100 text-purple-700',
          borderColor: 'border-purple-200'
        };
      case 'achievement':
        return { 
          name: 'Achievement', 
          icon: Trophy, 
          color: 'bg-yellow-100 text-yellow-700',
          borderColor: 'border-yellow-200'
        };
      default:
        return { 
          name: 'All', 
          icon: Star, 
          color: 'bg-gray-100 text-gray-700',
          borderColor: 'border-gray-200'
        };
    }
  };

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return { 
          name: 'Bronze', 
          color: 'bg-amber-100 text-amber-700',
          icon: Medal,
          borderColor: 'border-amber-200'
        };
      case 'silver':
        return { 
          name: 'Silver', 
          color: 'bg-gray-100 text-gray-700',
          icon: Medal,
          borderColor: 'border-gray-200'
        };
      case 'gold':
        return { 
          name: 'Gold', 
          color: 'bg-yellow-100 text-yellow-700',
          icon: Crown,
          borderColor: 'border-yellow-200'
        };
      case 'platinum':
        return { 
          name: 'Platinum', 
          color: 'bg-indigo-100 text-indigo-700',
          icon: Gem,
          borderColor: 'border-indigo-200'
        };
      case 'diamond':
        return { 
          name: 'Diamond', 
          color: 'bg-cyan-100 text-cyan-700',
          icon: Gem,
          borderColor: 'border-cyan-200'
        };
      default:
        return { 
          name: 'Basic', 
          color: 'bg-gray-100 text-gray-700',
          icon: Star,
          borderColor: 'border-gray-200'
        };
    }
  };

  const getRarityInfo = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return { 
          name: 'Common', 
          color: 'bg-gray-100 text-gray-700',
          textColor: 'text-gray-700'
        };
      case 'rare':
        return { 
          name: 'Rare', 
          color: 'bg-blue-100 text-blue-700',
          textColor: 'text-blue-700'
        };
      case 'epic':
        return { 
          name: 'Epic', 
          color: 'bg-purple-100 text-purple-700',
          textColor: 'text-purple-700'
        };
      case 'legendary':
        return { 
          name: 'Legendary', 
          color: 'bg-yellow-100 text-yellow-700',
          textColor: 'text-yellow-700'
        };
      default:
        return { 
          name: 'Common', 
          color: 'bg-gray-100 text-gray-700',
          textColor: 'text-gray-700'
        };
    }
  };

  const filteredMilestones = selectedCategory === 'all' 
    ? milestones 
    : milestones.filter(milestone => milestone.category === selectedCategory);

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Milestones & Achievements</h2>
          <p className="text-gray-600">Track your relationship journey and celebrate your progress</p>
        </div>
        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          <Trophy className="w-3 h-3 mr-1" />
          Level {userStats.currentLevel}
        </Badge>
      </div>

      {/* User Stats Overview */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{userStats.completedMilestones}/{userStats.totalMilestones}</div>
              <div className="text-sm text-purple-100">Milestones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{userStats.unlockedAchievements}/{userStats.totalAchievements}</div>
              <div className="text-sm text-purple-100">Achievements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{userStats.currentStreak}</div>
              <div className="text-sm text-purple-100">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{userStats.totalCoins}</div>
              <div className="text-sm text-purple-100">Lakshmi Coins</div>
            </div>
          </div>
          
          {/* Experience Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Level {userStats.currentLevel}</span>
              <span className="text-sm text-purple-100">
                {userStats.totalExperience}/{userStats.nextLevelExperience} XP
              </span>
            </div>
            <Progress 
              value={(userStats.totalExperience / userStats.nextLevelExperience) * 100} 
              className="h-3 bg-white/20" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'relationship', 'communication', 'intimacy', 'growth', 'wellness', 'achievement'].map((category) => {
          const info = getCategoryInfo(category);
          const Icon = info.icon;
          return (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Icon className="w-4 h-4" />
              {category === 'all' ? 'All' : info.name}
            </Button>
          );
        })}
      </div>

      <Tabs defaultValue="milestones" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="progress">Your Journey</TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="space-y-4">
          <div className="grid gap-4">
            {filteredMilestones.map((milestone) => {
              const categoryInfo = getCategoryInfo(milestone.category);
              const tierInfo = getTierInfo(milestone.tier);
              const TierIcon = tierInfo.icon;
              const CategoryIcon = categoryInfo.icon;

              return (
                <Card 
                  key={milestone.id} 
                  className={`transition-all duration-300 hover:shadow-lg ${
                    milestone.isCompleted ? 'ring-2 ring-green-500' : 
                    milestone.isUnlocked ? 'border-2 border-gray-200' : 'opacity-50'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
                          <CategoryIcon className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded ${tierInfo.color}`}>
                            <TierIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {milestone.title}
                              {milestone.isCompleted && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              )}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                          </div>
                        </div>
                      </div>
                      <Badge className={tierInfo.color}>
                        {tierInfo.name}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {milestone.requirements.type === 'streak' && 'Streak Progress'}
                            {milestone.requirements.type === 'activities' && 'Activities Progress'}
                            {milestone.requirements.type === 'syncs' && 'Syncs Progress'}
                            {milestone.requirements.type === 'programs' && 'Programs Progress'}
                            {milestone.requirements.type === 'coins' && 'Coins Progress'}
                            {milestone.requirements.type === 'time' && 'Time Progress'}
                          </span>
                          <span className="text-sm text-gray-600">
                            {milestone.requirements.current}/{milestone.requirements.target} {milestone.requirements.unit}
                          </span>
                        </div>
                        <Progress value={milestone.progress} className="h-2" />
                      </div>

                      {/* Rewards */}
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Gift className="w-4 h-4" />
                          Rewards
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">
                            <Hash className="w-3 h-3 mr-1" />
                            {milestone.rewards.coins} coins
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            {milestone.rewards.experience} XP
                          </Badge>
                          {milestone.rewards.badges.map((badge, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Completion Date */}
                      {milestone.isCompleted && milestone.dateCompleted && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          Completed on {new Date(milestone.dateCompleted).toLocaleDateString()}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {milestone.isCompleted ? (
                          <Button variant="outline" size="sm" className="flex-1">
                            <Share className="w-4 h-4 mr-2" />
                            Share Achievement
                          </Button>
                        ) : milestone.isUnlocked ? (
                          <Button size="sm" className="flex-1">
                            <Target className="w-4 h-4 mr-2" />
                            Continue Progress
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="flex-1" disabled>
                            <Lock className="w-4 h-4 mr-2" />
                            Locked
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAchievements.map((achievement) => {
              const rarityInfo = getRarityInfo(achievement.rarity);
              
              return (
                <Card 
                  key={achievement.id} 
                  className={`transition-all duration-300 hover:shadow-lg ${
                    achievement.unlocked ? 'ring-2 ring-yellow-500' : 'opacity-60'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-3 rounded-lg ${rarityInfo.color} text-2xl`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                          </div>
                          <Badge className={rarityInfo.color}>
                            {rarityInfo.name}
                          </Badge>
                        </div>
                        
                        {/* Progress */}
                        {achievement.maxProgress > 1 && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">Progress</span>
                              <span className="text-xs text-gray-600">
                                {achievement.progress}/{achievement.maxProgress}
                              </span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.maxProgress) * 100} 
                              className="h-1" 
                            />
                          </div>
                        )}
                        
                        {/* Unlocked Date */}
                        {achievement.unlocked && achievement.unlockedDate && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid gap-6">
            {/* Journey Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Your Relationship Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Timeline items */}
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">First Connection</h4>
                          <p className="text-sm text-gray-600">Completed first daily sync</p>
                          <p className="text-xs text-gray-500">January 1, 2024</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center z-10">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Week Warrior</h4>
                          <p className="text-sm text-gray-600">Achieved 7-day streak</p>
                          <p className="text-xs text-gray-500">January 7, 2024</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center z-10">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Communication Explorer</h4>
                          <p className="text-sm text-gray-600">Tried 5 communication techniques</p>
                          <p className="text-xs text-gray-500">January 10, 2024</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center z-10">
                          <Target className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Currently Working On</h4>
                          <p className="text-sm text-gray-600">Communication Master - 38/50 conversations</p>
                          <p className="text-xs text-gray-500">In Progress</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Growth Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{userStats.longestStreak}</div>
                    <div className="text-sm text-gray-600">Longest Streak</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{userStats.totalExperience}</div>
                    <div className="text-sm text-gray-600">Total XP</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">{userStats.completedMilestones}</div>
                    <div className="text-sm text-gray-600">Milestones Completed</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-xl font-bold text-yellow-600">{userStats.unlockedAchievements}</div>
                    <div className="text-sm text-gray-600">Achievements Unlocked</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Next Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {milestones
                    .filter(m => !m.isCompleted && m.isUnlocked)
                    .slice(0, 3)
                    .map((milestone) => {
                      const tierInfo = getTierInfo(milestone.tier);
                      return (
                        <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`p-1 rounded ${tierInfo.color}`}>
                              <tierInfo.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                              <p className="text-sm text-gray-600">
                                {milestone.requirements.current}/{milestone.requirements.target} {milestone.requirements.unit}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{Math.round(milestone.progress)}%</div>
                            <Progress value={milestone.progress} className="w-20 h-1" />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}