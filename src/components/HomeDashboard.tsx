'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import dynamic from 'next/dynamic';

// Importing components directly to avoid dynamic import issues
import { DailySyncCard } from '@/components/DailySyncCard';
import { AISuggestionCard } from '@/components/AISuggestionCard';
import { CoinStreakAnimation } from '@/components/CoinStreakAnimation';
import { AchievementCelebration } from '@/components/AchievementCelebration';
import { MemoryJukebox } from '@/components/MemoryJukebox';
import { StreakCelebration } from '@/components/StreakCelebration';

import { GamificationEngine } from '@/components/GamificationEngine';
import { ArchetypalHealthCard } from '@/components/ArchetypalHealthCard';
import { useLatestOSSocket } from '@/hooks/useSocket';
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

} from 'lucide-react';

interface HomeDashboardProps {
  streak: number;
  coins: number;
}

export function HomeDashboard({ streak, coins }: HomeDashboardProps) {
  const { socket } = useLatestOSSocket();
  const [dailySyncCompleted, setDailySyncCompleted] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [showMemoryJukebox, setShowMemoryJukebox] = useState(false);
  // Add state for handling button functionalities
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<string[]>([]);
  const [postponedSuggestions, setPostponedSuggestions] = useState<string[]>([]);
  const [detailedSuggestions, setDetailedSuggestions] = useState<string[]>([]);
  const [showAllMemories, setShowAllMemories] = useState(false);


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
      unlockedAt: streak >= 7 ? new Date().toISOString() : undefined,
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
    type: 'ritual' as const,
    archetype: 'radha_krishna' as const,
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
    },
    archetypalBalance: { krishna: 45, ram: 65, shiva: 30 },
    targetArchetype: 'krishna' as const
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

  // Functional handlers for button actions
  const handleViewMemoryJukebox = () => {
    setShowMemoryJukebox(true);
  };

  const handleCloseMemoryJukebox = () => {
    setShowMemoryJukebox(false);
  };



  const handleToggleMemories = () => {
    setShowAllMemories(!showAllMemories);
  };

  // Live event: streak bonus
  useEffect(() => {
    if (!socket) return;
    const onBonus = (data: any) => {
      setShowStreakCelebration(true);
      setTimeout(() => setShowStreakCelebration(false), 5000);
    };
    socket.on('streak:bonus', onBonus);
    return () => {
      socket.off('streak:bonus', onBonus);
    };
  }, [socket]);

  const handleAchievementUnlock = (achievementId: string) => {
    console.log('Achievement unlocked:', achievementId);
    // Handle achievement unlock logic
  };

  // Functional handlers for AI suggestion buttons
  const handleAcceptSuggestion = () => {
    // Add to accepted suggestions
    setAcceptedSuggestions(prev => [...prev, aiSuggestion.title]);
    // Show some feedback
    alert('Great! Starting your Evening Connection Ritual. You earned 25 Lakshmi Coins! 🎉');
    // Close the card or mark as accepted
  };

  const handlePostponeSuggestion = () => {
    setPostponedSuggestions(prev => [...prev, aiSuggestion.title]);
    alert('No problem! We\'ll suggest this again tomorrow. 💙');
  };

  const handleShowDetails = () => {
    setDetailedSuggestions(prev => [...prev, aiSuggestion.title]);
    alert('This ritual draws from Radha-Krishna archetypes of divine love and playfulness. Try establishing a "magic hour" before bed for deep connection. 🌙💕');
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
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleMemories}
          >
            {showAllMemories ? 'Collapse' : 'View All'}
          </Button>
        </div>

        {/* Recent Memories Preview */}
        {showMemoryJukebox && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Memory Jukebox</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseMemoryJukebox}
                >
                  ✕
                </Button>
              </div>
              <p className="text-gray-600 mb-4">
                Here you can access all your precious memories and moments shared with your partner.
              </p>
              <div className="space-y-3">
                <div className="bg-pink-50 p-3 rounded-lg">
                  <p className="font-medium">Baby's First Laugh (Audio)</p>
                  <p className="text-sm text-gray-600">🎵 Available now</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium">Beach Sunset (Photo)</p>
                  <p className="text-sm text-gray-600">📷 Available now</p>
                </div>
              </div>
            </div>
          </div>
        )}

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
              <Button
                size="sm"
                variant="ghost"
                className="text-pink-600 hover:text-pink-700"
                onClick={() => {
                  alert('🎵 Playing: Baby\'s first laugh...\nEnjoy this precious memory! 💕');
                }}
              >
                ▶ Play
              </Button>
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

        <Button
          variant="outline"
          className="w-full"
          onClick={handleViewMemoryJukebox}
        >
          <Heart className="w-4 h-4 mr-2" />
          View Memory Jukebox
        </Button>
      </div>

      {/* Archetypal Health Card - Sacred Relationship Balance */}
      <div className="space-y-4">
        <ArchetypalHealthCard
          balance={{ krishna: 65, ram: 45, shiva: 30 }}
          onRebalance={() => {
            // Navigate to Rituals tab or show rebalance modal
            console.log('Navigate to Rituals for rebalancing');
            // You could emit an event here or use a navigation hook
          }}
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
          onAccept={handleAcceptSuggestion}
          onLater={handlePostponeSuggestion}
          onTellMe={handleShowDetails}
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
          onClose={() => setShowAchievement(false)}
          achievement={{
            title: "Daily Sync Complete!",
            description: "You've earned 50 Lakshmi Coins",
            icon: "🎉",
            rarity: "common" as const,
            coins: 50
          }}
        />
      )}
    </div>
  );
}
