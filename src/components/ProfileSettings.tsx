'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Heart, 
  Star, 
  Settings, 
  Crown,
  Award,
  Target,
  Zap,
  Gift,
  TrendingUp,
  Shield,
  Bell,
  Moon,
  Sun,
  Palette,
  LogOut,
  Globe,
  Wifi,
  Lock,
  Database
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ProfileSettingsProps {
  streak: number;
  coins: number;
}

export function ProfileSettings({ streak, coins }: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements' | 'settings' | 'privacy' | 'cultural' | 'offline'>('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Sync',
      description: 'Complete your first daily sync',
      icon: '🎯',
      unlocked: true,
      unlockedAt: '2024-01-10',
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      unlocked: true,
      unlockedAt: '2024-01-15',
      rarity: 'rare'
    },
    {
      id: '3',
      title: 'Ritual Master',
      description: 'Complete all sacred rituals',
      icon: '🧘',
      unlocked: false,
      rarity: 'epic'
    },
    {
      id: '4',
      title: 'Perfect Balance',
      description: 'Achieve perfect Rasa balance for 30 days',
      icon: '⚖️',
      unlocked: false,
      rarity: 'legendary'
    },
    {
      id: '5',
      title: 'Family Champion',
      description: 'Complete all 6 days of family activities',
      icon: '👨‍👩‍👧‍👦',
      unlocked: false,
      rarity: 'rare'
    },
    {
      id: '6',
      title: 'Coin Collector',
      description: 'Earn 1000 Lakshmi Coins',
      icon: '🪙',
      unlocked: false,
      rarity: 'rare'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-400';
      case 'epic': return 'border-purple-400';
      case 'legendary': return 'border-yellow-400';
      default: return 'border-gray-300';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;
  const achievementProgress = (unlockedAchievements / totalAchievements) * 100;

  const getLevel = () => {
    if (coins >= 1000) return { level: 5, title: 'Love Guru', color: 'text-purple-600' };
    if (coins >= 500) return { level: 4, title: 'Relationship Expert', color: 'text-blue-600' };
    if (coins >= 250) return { level: 3, title: 'Harmony Keeper', color: 'text-green-600' };
    if (coins >= 100) return { level: 2, title: 'Connection Builder', color: 'text-yellow-600' };
    return { level: 1, title: 'Love Beginner', color: 'text-gray-600' };
  };

  const levelInfo = getLevel();

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-6 shadow-xl">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center border-4 border-white/30">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                AK
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">Aisha & Karan</h1>
              <p className="text-white/80 text-sm mb-2">Together since Jan 2024</p>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white border-white/30">
                  <Crown className="w-3 h-3 mr-1" />
                  Level {levelInfo.level}
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30">
                  <Heart className="w-3 h-3 mr-1" />
                  {streak} days
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-white" />
                <span className="text-sm text-white/80">Level</span>
              </div>
              <p className={`text-lg font-bold text-white`}>{levelInfo.title}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-white" />
                <span className="text-sm text-white/80">Coins</span>
              </div>
              <p className="text-lg font-bold text-white">{coins} 🪙</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/90 backdrop-blur-lg border border-white/50 shadow-lg rounded-2xl">
        <div className="p-2">
          <div className="grid grid-cols-6 gap-2">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'achievements', label: 'Achievements', icon: Award },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'privacy', label: 'Privacy', icon: Shield },
              { id: 'cultural', label: 'Cultural', icon: Globe },
              { id: 'offline', label: 'Offline', icon: Wifi }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      {activeTab === 'profile' && (
        <div className="space-y-4">
          {/* Stats Overview */}
          <div className="bg-white/90 backdrop-blur-lg border border-white/50 shadow-lg rounded-2xl">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                Your Journey
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{streak}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">{levelInfo.level}</div>
                  <div className="text-sm text-gray-600">Current Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">47</div>
                  <div className="text-sm text-gray-600">Tasks Done</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-sm text-gray-600">Rituals Mastered</div>
                </div>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 rounded-2xl">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-600" />
                Level Progress
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Level {levelInfo.level} - {levelInfo.title}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {coins}/1000 coins
                  </span>
                </div>
                <Progress value={(coins / 1000) * 100} className="h-2" />
                <p className="text-xs text-gray-600">
                  Earn {1000 - coins} more coins to reach the next level!
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/90 backdrop-blur-lg border border-white/50 shadow-lg rounded-2xl">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  <Gift className="w-4 h-4 mr-2" />
                  Redeem Rewards
                </Button>
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Heart className="w-4 h-4 mr-2" />
                  Invite Partner
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Content */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          {/* Achievement Stats */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 rounded-2xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-600" />
                  Achievement Progress
                </h3>
                <Badge className="bg-yellow-100 text-yellow-700">
                  {unlockedAchievements}/{totalAchievements}
                </Badge>
              </div>
              <Progress value={achievementProgress} className="h-2 mb-2" />
              <p className="text-sm text-gray-600">
                {achievementProgress.toFixed(0)}% of achievements unlocked
              </p>
            </div>
          </div>

          {/* Achievement List */}
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`bg-white/90 backdrop-blur-lg border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl ${
                  achievement.unlocked ? getRarityBorder(achievement.rarity) : ''
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-400 shadow-lg' 
                        : 'bg-gray-100'
                    }`}>
                      {achievement.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                          {achievement.title}
                        </h4>
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                        {achievement.unlocked && (
                          <Badge className="bg-green-100 text-green-700">
                            <Star className="w-3 h-3 mr-1" />
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                        {achievement.description}
                      </p>
                      {achievement.unlocked && achievement.unlockedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Content */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          {/* Preferences */}
          <div className="bg-white/90 backdrop-blur-lg border border-white/50 shadow-lg rounded-2xl">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-600" />
                Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {darkMode ? <Moon className="w-5 h-5 text-gray-600" /> : <Sun className="w-5 h-5 text-gray-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Dark Mode</p>
                      <p className="text-sm text-gray-600">Easier on the eyes at night</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDarkMode(!darkMode)}
                    className={`${
                      darkMode 
                        ? 'bg-purple-600 text-white border-purple-600' 
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    {darkMode ? 'On' : 'Off'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Bell className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Notifications</p>
                      <p className="text-sm text-gray-600">Daily reminders and updates</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNotifications(!notifications)}
                    className={`${
                      notifications 
                        ? 'bg-green-600 text-white border-green-600' 
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    {notifications ? 'On' : 'Off'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="bg-white/90 backdrop-blur-lg border border-white/50 shadow-lg rounded-2xl">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                Account
              </h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Heart className="w-4 h-4 mr-2" />
                  Partner Settings
                </Button>
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Settings className="w-4 h-4 mr-2" />
                  Privacy Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border-red-200 rounded-2xl">
            <div className="p-4">
              <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Account Actions
              </h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-50">
                  Export Data
                </Button>
                <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-50">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'privacy' && (
        <div className="space-y-4">
          <div className="bg-white/90 backdrop-blur-lg border border-white/50 shadow-lg rounded-2xl">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                Privacy & Security
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Data Protection</h4>
                  <p className="text-sm text-gray-700 mb-3">Your data is encrypted and secure</p>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700">End-to-end encryption enabled</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-gray-600">Add extra security to your account</div>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Enable
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Privacy Mode</div>
                      <div className="text-sm text-gray-600">Control who can see your activity</div>
                    </div>
                    <Button size="sm" variant="outline">
                      Configure
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cultural' && (
        <div className="space-y-4">
          <div className="bg-white/90 backdrop-blur-lg border border-white/50 shadow-lg rounded-2xl">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-600" />
                Cultural Preferences
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium mb-2">Regional Settings</h4>
                  <p className="text-sm text-gray-700 mb-3">Personalize your experience based on your culture</p>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-orange-700">India • English • Hindu</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Language</div>
                      <div className="text-sm text-gray-600">App display language</div>
                    </div>
                    <Button size="sm" variant="outline">
                      English
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Region</div>
                      <div className="text-sm text-gray-600">Local content and festivals</div>
                    </div>
                    <Button size="sm" variant="outline">
                      West India
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Traditions</div>
                      <div className="text-sm text-gray-600">Cultural practices and rituals</div>
                    </div>
                    <Button size="sm" variant="outline">
                      Customize
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'offline' && (
        <div className="space-y-4">
          <div className="bg-white/90 backdrop-blur-lg border border-white/50 shadow-lg rounded-2xl">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Wifi className="w-4 h-4 text-green-600" />
                Offline Mode
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium mb-2">Offline Access</h4>
                  <p className="text-sm text-gray-700 mb-3">Use the app without internet connection</p>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">156 MB stored offline</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Auto-Sync</div>
                      <div className="text-sm text-gray-600">Sync data when online</div>
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Enabled
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">WiFi Only</div>
                      <div className="text-sm text-gray-600">Only sync over WiFi</div>
                    </div>
                    <Button size="sm" variant="outline">
                      Configure
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Storage</div>
                      <div className="text-sm text-gray-600">Manage offline storage</div>
                    </div>
                    <Button size="sm" variant="outline">
                      Manage
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}