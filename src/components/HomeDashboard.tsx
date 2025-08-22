'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DailySyncCard } from '@/components/DailySyncCard';
import { AISuggestionCard } from '@/components/AISuggestionCard';
import { CoinStreakAnimation } from '@/components/CoinStreakAnimation';
import { AchievementCelebration } from '@/components/AchievementCelebration';
import { RewardModal, LevelUpModal, MilestoneModal } from '@/components/PremiumModal';
import { MemoryJukebox } from '@/components/MemoryJukebox';
import { StreakCelebration } from '@/components/StreakCelebration';
import { RelationshipInsights } from '@/components/RelationshipInsights';
import { GamificationEngine } from '@/components/GamificationEngine';
import { 
  Sparkles, 
  Heart, 
  Target, 
  TrendingUp, 
  Gift, 
  Clock,
  Trophy,
  Star,
  Zap,
  Crown,
  Brain
} from 'lucide-react';

interface HomeDashboardProps {
  streak: number;
  coins: number;
}

export function HomeDashboard({ streak, coins }: HomeDashboardProps) {
  const [dailySyncCompleted, setDailySyncCompleted] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);

  // Sample data for new components
  const relationshipInsights = [
    {
      id: '1',
      type: 'strength' as const,
      title: 'Excellent Communication Patterns',
      description: 'Your active listening skills have improved by 40% this month. Keep up the great work!',
      impact: 'high' as const,
      confidence: 92,
      actionable: true,
      category: 'communication',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      type: 'opportunity' as const,
      title: 'Quality Time Enhancement',
      description: 'Consider scheduling 15-minute daily check-ins to strengthen your emotional connection.',
      impact: 'medium' as const,
      confidence: 85,
      actionable: true,
      category: 'emotional',
      timestamp: new Date().toISOString()
    }
  ];

  const achievements = [
    {
      id: '1',
      title: 'First Sync',
      description: 'Complete your first daily sync',
      icon: '🎯',
      rarity: 'common' as const,
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      unlockedAt: new Date().toISOString(),
      reward: { coins: 50, badge: 'First Steps' }
    },
    {
      id: '2',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      rarity: 'rare' as const,
      progress: streak,
      maxProgress: 7,
      unlocked: streak >= 7,
      ...(streak >= 7 && { unlockedAt: new Date().toISOString() }), // Fix: Use conditional spread
      reward: { coins: 100, badge: 'Consistency Master' }
    },
    {
      id: '3',
      title: 'Ritual Master',
      description: 'Complete 10 relationship rituals',
      icon: '🕉️',
      rarity: 'epic' as const,
      progress: 3,
      maxProgress: 10,
      unlocked: false,
      reward: { coins: 250, badge: 'Ritual Expert' }
    }
  ];

  const aiSuggestion = {
    type: 'ritual' as const, // Fix: Use 'as const' for literal type
    archetype: 'radha_krishna' as const, // Fix: Use 'as const' for literal type
    title: 'Evening Connection Ritual',
    description: 'Reignite your romance with a 15-minute tech-free evening ritual that deepens your emotional bond.',
    actionSteps: [
      'Set phones aside for 15 minutes',
      'Share highlights of your day',
      'Express one thing you appreciate about each other',
      'Plan tomorrow together'
    ],
    estimatedDuration: 900,
    rewardCoins: 25,
    reasoning: {
      trigger: 'low_quality_time',
      severity: 2,
      factors: ['high_stress', 'limited_connection_time']
    }
  };

  const handleSyncComplete = (data: any) => {
    setDailySyncCompleted(true);
    // Show achievement celebration
    setShowAchievement(true);
    setTimeout(() => setShowAchievement(false), 5000);
  };

  const handleCoinClick = () => {
    // Handle coin click animation
    console.log('Coin clicked!');
  };

  const handleStreakClick = () => {
    setShowStreakCelebration(true);
  };

  const handleAchievementUnlock = (achievementId: string) => {
    console.log('Achievement unlocked:', achievementId);
    // Handle achievement unlock logic
  };

  const getStreakColor = () => {
    if (streak >= 30) return 'text-purple-600';
    if (streak >= 14) return 'text-blue-600';
    if (streak >= 7) return 'text-green-600';
    return 'text-orange-600';
  };

  const getStreakEmoji = () => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '✨';
    return '🌟';
  };

  // Fix: Data for the achievement celebration modal
  const dailySyncAchievement = {
    title: "Daily Sync Complete!",
    description: "You've earned 50 Lakshmi Coins",
    icon: '🎯',
    rarity: 'common' as const,
    coins: 50,
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header with premium glass effect */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-6 shadow-xl">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Good Morning! 💕</h1>
              <p className="text-white/80 text-sm">Ready to strengthen your bond today? • {streak} day streak 🔥</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Couple Photo */}
              <div className="flex flex-col items-center bg-white/20 backdrop-blur-lg rounded-xl p-3 min-w-[80px]">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-xl">💑</span>
                </div>
                <span className="text-xs text-white/80">Together</span>
              </div>
              
              <div className="flex flex-col items-center bg-yellow-400/90 backdrop-blur-lg rounded-xl p-3 min-w-[80px]">
                <div className="flex items-center gap-1">
                  <span className="text-xl animate-bounce">🪙</span>
                  <span className="text-xl font-bold text-yellow-900">{coins}</span>
                </div>
                <span className="text-xs text-yellow-900">coins</span>
              </div>
            </div>
          </div>
          
          {/* Daily progress bar */}
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/90 font-medium">Daily Progress</span>
              <span className="text-sm text-white/90">75%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Coin & Streak Animation */}
      <CoinStreakAnimation 
        coins={coins}
        streak={streak}
        onCoinClick={handleCoinClick}
        onStreakClick={handleStreakClick}
      />

      {/* Daily Sync Card with premium styling */}
      {!dailySyncCompleted && (
        <div className="animate-fade-in">
          <DailySyncCard onCompleteSync={handleSyncComplete} />
        </div>
      )}

      {/* Memory Jukebox Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Memory Jukebox
          </h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        {/* Recent Memories Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-pink-200 rounded-lg flex items-center justify-center">
                <span className="text-lg">🎵</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Recent Audio</h3>
                <p className="text-sm text-gray-600">Baby's first laugh</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-pink-200 rounded-full h-2">
                <div className="bg-pink-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <span className="text-xs text-gray-500">0:45</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                <span className="text-lg">📷</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Latest Photo</h3>
                <p className="text-sm text-gray-600">Beach sunset</p>
              </div>
            </div>
            <div className="w-full h-16 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🌅</span>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          <Heart className="w-4 h-4 mr-2" />
          View Memory Jukebox
        </Button>
      </div>

      {/* AI Relationship Insights */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            AI Insights
          </h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        <RelationshipInsights 
          insights={relationshipInsights}
          onAction={handleAchievementUnlock}
        />
      </div>

      {/* Gamification Engine */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Achievements & Rewards
          </h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        <GamificationEngine 
          coins={coins}
          level={Math.floor(streak / 7) + 1}
          experience={streak * 10}
          achievements={achievements}
          onAchievementUnlock={handleAchievementUnlock}
        />
      </div>

      {/* AI Suggestion */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Today's AI Suggestion
          </h2>
          <Badge variant="outline" className="text-xs">
            Personalized
          </Badge>
        </div>
        
        <AISuggestionCard 
          suggestion={aiSuggestion}
          onAccept={() => console.log('Suggestion accepted')}
          onLater={() => console.log('Suggestion postponed')}
          onTellMe={() => console.log('More info requested')}
        />
      </div>

      {/* Streak Celebration Modal */}
      {showStreakCelebration && (
        <StreakCelebration 
          streak={streak}
          coins={coins}
          onClose={() => setShowStreakCelebration(false)}
        />
      )}

      {/* Achievement Celebration */}
      {showAchievement && (
        <AchievementCelebration
          isOpen={showAchievement}
          achievement={dailySyncAchievement}
          onClose={() => setShowAchievement(false)}
        />
      )}
    </div>
  );
}