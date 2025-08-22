'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Gift, 
  Target, 
  Zap,
  Crown,
  Sparkles,
  Medal,
  Award,
  Flame,
  TrendingUp
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  reward: {
    coins: number;
    badge: string;
  };
}

interface GamificationEngineProps {
  coins: number;
  level: number;
  experience: number;
  achievements: Achievement[];
  onAchievementUnlock: (achievementId: string) => void;
}

export function GamificationEngine({ 
  coins, 
  level, 
  experience, 
  achievements, 
  onAchievementUnlock 
}: GamificationEngineProps) {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<'achievements' | 'rewards' | 'leaderboard'>('achievements');

  // Calculate experience needed for next level
  const expForNextLevel = level * 100;
  const expProgress = (experience / expForNextLevel) * 100;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star className="w-4 h-4" />;
      case 'rare': return <Medal className="w-4 h-4" />;
      case 'epic': return <Award className="w-4 h-4" />;
      case 'legendary': return <Crown className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getLevelTitle = (level: number) => {
    if (level >= 20) return "Relationship Master";
    if (level >= 15) return "Love Expert";
    if (level >= 10) return "Relationship Guru";
    if (level >= 5) return "Connection Builder";
    return "Love Explorer";
  };

  return (
    <div className="space-y-4">
      {/* Level Progress */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">Level {level}</div>
                <div className="text-sm opacity-90">{getLevelTitle(level)}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold flex items-center gap-1">
                <Gift className="w-5 h-5" />
                {coins}
              </div>
              <div className="text-sm opacity-90">Lakshmi Coins</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {level + 1}</span>
              <span>{experience}/{expForNextLevel} XP</span>
            </div>
            <Progress value={expProgress} className="h-3 bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'achievements', label: 'Achievements', icon: Trophy },
          { id: 'rewards', label: 'Rewards', icon: Gift },
          { id: 'leaderboard', label: 'Leaderboard', icon: Target }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={selectedTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex-1 ${selectedTab === tab.id ? 'bg-white shadow-sm' : ''}`}
            >
              <Icon className="w-4 h-4 mr-1" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Achievements Tab */}
      {selectedTab === 'achievements' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Your Achievements</h4>
            <Badge variant="outline">
              {achievements.filter(a => a.unlocked).length}/{achievements.length} Unlocked
            </Badge>
          </div>
          
          <div className="grid gap-3">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id}
                className={`transition-all duration-300 ${achievement.unlocked ? 'bg-white' : 'bg-gray-50 opacity-75'}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg border-2 ${getRarityColor(achievement.rarity)}`}>
                      <div className="text-2xl">{achievement.icon}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium">{achievement.title}</h5>
                        {getRarityIcon(achievement.rarity)}
                        {achievement.unlocked && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                      
                      {!achievement.unlocked && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <Progress 
                            value={(achievement.progress / achievement.maxProgress) * 100} 
                            className="h-2" 
                          />
                        </div>
                      )}
                      
                      {achievement.unlocked && achievement.unlockedAt && (
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-purple-600">
                        +{achievement.reward.coins}
                      </div>
                      <div className="text-xs text-gray-500">coins</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Rewards Tab */}
      {selectedTab === 'rewards' && (
        <div className="space-y-4">
          <h4 className="font-medium">Available Rewards</h4>
          
          <div className="grid gap-3">
            {[
              { 
                title: "Premium Ritual Pack", 
                cost: 500, 
                description: "Unlock exclusive relationship rituals",
                icon: "🎁",
                claimed: false
              },
              { 
                title: "Personalized Date Ideas", 
                cost: 300, 
                description: "AI-curated date experiences",
                icon: "💝",
                claimed: false
              },
              { 
                title: "Relationship Coaching Session", 
                cost: 1000, 
                description: "1-on-1 session with expert",
                icon: "🎯",
                claimed: false
              },
              { 
                title: "Custom Avatar Themes", 
                cost: 200, 
                description: "Exclusive visual themes",
                icon: "🎨",
                claimed: true
              }
            ].map((reward, index) => (
              <Card key={index} className={reward.claimed ? 'bg-green-50 border-green-200' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{reward.icon}</div>
                    <div className="flex-1">
                      <h5 className="font-medium">{reward.title}</h5>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-600 mb-2">
                        {reward.cost}
                      </div>
                      <Button 
                        size="sm" 
                        variant={reward.claimed ? "outline" : "default"}
                        disabled={coins < reward.cost || reward.claimed}
                        className={reward.claimed ? 'bg-green-600 text-white' : ''}
                      >
                        {reward.claimed ? 'Claimed' : 'Redeem'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {selectedTab === 'leaderboard' && (
        <div className="space-y-4">
          <h4 className="font-medium">Weekly Leaderboard</h4>
          
          <div className="space-y-3">
            {[
              { rank: 1, name: "You", score: 2450, change: "up", icon: "👑" },
              { rank: 2, name: "Priya & Raj", score: 2380, change: "down", icon: "🥈" },
              { rank: 3, name: "Anita & Vikram", score: 2290, change: "up", icon: "🥉" },
              { rank: 4, name: "Neha & Arjun", score: 2150, change: "same", icon: "⭐" },
              { rank: 5, name: "Meera & Rohan", score: 2080, change: "up", icon: <Flame className="w-4 h-4 text-orange-500" /> }
            ].map((player, index) => (
              <Card key={index} className={player.name === "You" ? 'bg-purple-50 border-purple-200' : ''}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-600">#{player.rank}</span>
                      <span className="text-xl">{player.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h5 className={`font-medium ${player.name === "You" ? 'text-purple-700' : ''}`}>
                        {player.name}
                      </h5>
                      <div className="text-sm text-gray-600">{player.score} points</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {player.change === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                      {player.change === 'down' && <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />}
                      {player.change === 'same' && <Target className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}