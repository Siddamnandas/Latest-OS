'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { logger } from '@/lib/logger';
import { 
  RefreshCw, 
  Heart, 
  Wifi,
  WifiOff,
  Clock,
  TrendingUp,
  Activity,
  MessageSquare,
  Zap,
  Users,
  Target
} from 'lucide-react';

interface SyncData {
  id: string;
  partner: 'partner_a' | 'partner_b';
  mood: number;
  energy: number;
  tags: string[];
  timestamp: string;
}

interface ConnectionStatus {
  isOnline: boolean;
  lastSeen: string;
  syncStreak: number;
  moodAlignment: number;
}

export function LiveCoupleSync() {
  const [partnerA, setPartnerA] = useState<ConnectionStatus>({
    isOnline: true,
    lastSeen: new Date().toISOString(),
    syncStreak: 7,
    moodAlignment: 92
  });
  
  const [partnerB, setPartnerB] = useState<ConnectionStatus>({
    isOnline: true,
    lastSeen: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    syncStreak: 7,
    moodAlignment: 92
  });

  const [recentSyncs, setRecentSyncs] = useState<SyncData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date(Date.now() - 2 * 60 * 1000).toISOString());

  useEffect(() => {
    fetchRecentSyncs();
    // Simulate real-time updates
    const interval = setInterval(() => {
      updateConnectionStatus();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchRecentSyncs = async () => {
    try {
      const sampleSyncs: SyncData[] = [
        {
          id: '1',
          partner: 'partner_a',
          mood: 4,
          energy: 8,
          tags: ['happy', 'energetic', 'grateful'],
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
        },
        {
          id: '2',
          partner: 'partner_b',
          mood: 5,
          energy: 7,
          tags: ['peaceful', 'content', 'loving'],
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
        },
        {
          id: '3',
          partner: 'partner_a',
          mood: 3,
          energy: 6,
          tags: ['tired', 'stressed'],
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
        },
        {
          id: '4',
          partner: 'partner_b',
          mood: 4,
          energy: 9,
          tags: ['excited', 'motivated', 'playful'],
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
        }
      ];
      
      setRecentSyncs(sampleSyncs);
    } catch (error) {
      logger.error('Error fetching syncs:', error);
    }
  };

  const updateConnectionStatus = () => {
    // Simulate random online/offline status changes
    const random = Math.random();
    if (random > 0.8) {
      setPartnerB(prev => ({
        ...prev,
        isOnline: !prev.isOnline,
        lastSeen: prev.isOnline ? new Date().toISOString() : prev.lastSeen
      }));
    }
  };

  const handleSyncNow = async () => {
    setIsLoading(true);
    
    // Simulate sync process
    setTimeout(() => {
      setLastSyncTime(new Date().toISOString());
      setPartnerA(prev => ({ ...prev, moodAlignment: Math.min(100, prev.moodAlignment + 2) }));
      setPartnerB(prev => ({ ...prev, moodAlignment: Math.min(100, prev.moodAlignment + 2) }));
      setIsLoading(false);
    }, 2000);
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 5) return '😍';
    if (mood >= 4) return '😊';
    if (mood >= 3) return '😐';
    if (mood >= 2) return '😔';
    return '😢';
  };

  const getEnergyColor = (energy: number) => {
    if (energy >= 8) return 'text-green-600';
    if (energy >= 6) return 'text-yellow-600';
    if (energy >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return time.toLocaleDateString();
  };

  const averageMoodAlignment = Math.round((partnerA.moodAlignment + partnerB.moodAlignment) / 2);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Couple Sync 🔄</h2>
            <p className="text-white/80">Stay connected and synchronized</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{averageMoodAlignment}%</div>
            <div className="text-sm text-white/80">Mood Alignment</div>
          </div>
        </div>
        
        <div className="bg-white/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Connection Strength</span>
            <span className="text-sm">{averageMoodAlignment}%</span>
          </div>
          <Progress value={averageMoodAlignment} className="h-2 bg-white/30" />
        </div>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-2 gap-4">
        {/* Partner A */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-blue-900">Arjun</h3>
            <div className="flex items-center gap-1">
              {partnerA.isOnline ? (
                <Wifi className="w-4 h-4 text-green-600" />
              ) : (
                <WifiOff className="w-4 h-4 text-gray-400" />
              )}
              <span className={`text-xs ${partnerA.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                {partnerA.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Last seen:</span>
              <span className="text-blue-600">{formatTimeAgo(partnerA.lastSeen)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Sync streak:</span>
              <span className="text-blue-600 font-medium">{partnerA.syncStreak} days 🔥</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Mood alignment:</span>
              <span className="text-blue-600 font-medium">{partnerA.moodAlignment}%</span>
            </div>
          </div>
        </div>

        {/* Partner B */}
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-pink-900">Priya</h3>
            <div className="flex items-center gap-1">
              {partnerB.isOnline ? (
                <Wifi className="w-4 h-4 text-green-600" />
              ) : (
                <WifiOff className="w-4 h-4 text-gray-400" />
              )}
              <span className={`text-xs ${partnerB.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                {partnerB.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-pink-700">Last seen:</span>
              <span className="text-pink-600">{formatTimeAgo(partnerB.lastSeen)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pink-700">Sync streak:</span>
              <span className="text-pink-600 font-medium">{partnerB.syncStreak} days 🔥</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pink-700">Mood alignment:</span>
              <span className="text-pink-600 font-medium">{partnerB.moodAlignment}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Controls */}
      <div className="bg-white/90 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Sync</h3>
            <p className="text-sm text-gray-600">Last sync: {formatTimeAgo(lastSyncTime)}</p>
          </div>
          <Button
            onClick={handleSyncNow}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Sync Now
              </>
            )}
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-sm font-medium text-gray-900">Mood Check</div>
            <div className="text-xs text-gray-600">Share feelings</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-sm font-medium text-gray-900">Quick Chat</div>
            <div className="text-xs text-gray-600">Send message</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-sm font-medium text-gray-900">Set Goal</div>
            <div className="text-xs text-gray-600">Plan together</div>
          </div>
        </div>
      </div>

      {/* Recent Sync History */}
      <div className="bg-white/90 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-gray-600" />
          Recent Sync Activity
        </h3>
        
        <div className="space-y-3">
          {recentSyncs.map((sync, index) => (
            <div key={sync.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                sync.partner === 'partner_a' ? 'bg-blue-100' : 'bg-pink-100'
              }`}>
                <span className="text-xl">{getMoodEmoji(sync.mood)}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">
                    {sync.partner === 'partner_a' ? 'Arjun' : 'Priya'}
                  </span>
                  <span className="text-xs text-gray-500">{formatTimeAgo(sync.timestamp)}</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">
                    Mood: <span className="font-medium">{sync.mood}/5</span>
                  </span>
                  <span className={`${getEnergyColor(sync.energy)}`}>
                    Energy: <span className="font-medium">{sync.energy}/10</span>
                  </span>
                </div>
                
                <div className="flex gap-1 mt-2">
                  {sync.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sync Insights */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-emerald-600" />
          <h3 className="text-lg font-semibold text-emerald-900">Sync Insights</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-emerald-800">{averageMoodAlignment}%</div>
            <div className="text-sm text-emerald-600">Mood Alignment</div>
            <div className="text-xs text-emerald-500 mt-1">
              {averageMoodAlignment >= 90 ? '🌟 Excellent harmony!' : 
               averageMoodAlignment >= 70 ? '💚 Good connection' : 
               '💙 Room for improvement'}
            </div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-emerald-800">{Math.max(partnerA.syncStreak, partnerB.syncStreak)}</div>
            <div className="text-sm text-emerald-600">Day Streak</div>
            <div className="text-xs text-emerald-500 mt-1">
              Keep it up! 🔥
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}