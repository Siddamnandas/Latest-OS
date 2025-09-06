'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Heart,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Bell,
  RefreshCw,
  MessageCircle,
  Calendar,
  Target,
  TrendingUp,
  Award,
  Activity,
  Zap,
  Phone,
  Video,
  Mail,
  Gift,
  Star,
  Brain,
  Wifi,
  WifiOff,
  Cloud,
  CloudOff,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSync } from '@/hooks/useSync';
import { useLatestOSSocket } from '@/hooks/useSocket';
import { SYNC_ERROR_CODES } from '@/lib/config';

interface SyncActivity {
  id: string;
  type: 'sync_completed' | 'message_sent' | 'task_updated' | 'goal_achieved' | 'ritual_performed';
  title: string;
  description: string;
  timestamp: Date;
  partner: 'partner1' | 'partner2';
  priority: 'low' | 'medium' | 'high';
  archetypalEnergy?: 'krishna' | 'ram' | 'shiva';
  harmonyScore?: number; // How well this activity balanced relationship
}

interface SyncSession {
  id: string;
  date: Date;
  duration: number;
  mood1: number; // 1-5 scale
  mood2: number; // 1-5 scale
  energy1: number; // 1-10 scale
  energy2: number; // 1-10 scale
  topics: string[];
  actionItems: string[];
  completed: boolean;
}

interface CoupleGoal {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  progress: number;
  completed: boolean;
  category: string;
  shared: boolean;
}

interface NotificationSettings {
  syncReminders: boolean;
  taskUpdates: boolean;
  goalAchievements: boolean;
  dailyCheckins: boolean;
  moodUpdates: boolean;
  voiceMessages: boolean;
}

export function CoupleSyncSystem() {
  const { socket, isConnected } = useLatestOSSocket();
  const [syncStatus, setSyncStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [activities, setActivities] = useState<SyncActivity[]>([]);
  const [sessions, setSessions] = useState<SyncSession[]>([]);
  const [sharedGoals, setSharedGoals] = useState<CoupleGoal[]>([]);
  const [unreadCount, setUnreadCount] = useState(3);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    syncReminders: true,
    taskUpdates: true,
    goalAchievements: true,
    dailyCheckins: true,
    moodUpdates: true,
    voiceMessages: false
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [isLive, setIsLive] = useState(true);

  // Archetypal balance state
  const [archetypalBalance, setArchetypalBalance] = useState<{krishna: number, ram: number, shiva: number}>({
    krishna: Math.floor(Math.random() * 30) + 35, // 35-65%
    ram: Math.floor(Math.random() * 30) + 35,
    shiva: Math.floor(Math.random() * 30) + 35
  });
  
  const syncIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Reflect socket connection
    setSyncStatus(isConnected ? 'connected' : 'disconnected');

    // Initialize sample data
    initializeData();
    
    // Set up live sync simulation
    if (isLive) {
      syncIntervalRef.current = setInterval(() => {
        simulateLiveActivity();
      }, 10000); // Every 10 seconds
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [isLive]);

  // Live socket listeners
  useEffect(() => {
    if (!socket) return;
    const onPartnerActivity = (payload: any) => {
      const a: SyncActivity = {
        id: Date.now().toString(),
        type: 'sync_completed',
        title: 'Partner Activity',
        description: `${payload.partner} ${payload.activity}`,
        timestamp: new Date(),
        partner: 'partner2',
        priority: 'medium'
      };
      setActivities(prev => [a, ...prev]);
    };
    socket.on('partner:activity', onPartnerActivity);
    return () => {
      socket.off('partner:activity', onPartnerActivity);
    };
  }, [socket]);

  const initializeData = () => {
    // Sample sync activities
    const sampleActivities: SyncActivity[] = [
      {
        id: '1',
        type: 'sync_completed',
        title: 'Daily Sync Completed',
        description: 'Partner completed their daily sync session',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        partner: 'partner2',
        priority: 'medium'
      },
      {
        id: '2',
        type: 'task_updated',
        title: 'Task Progress Updated',
        description: 'Updated progress on "Plan weekend getaway"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        partner: 'partner1',
        priority: 'low'
      },
      {
        id: '3',
        type: 'goal_achieved',
        title: 'Goal Milestone Reached!',
        description: 'Completed "Weekly Date Night" goal for this week',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        partner: 'partner2',
        priority: 'high'
      }
    ];

    // Sample sync sessions
    const sampleSessions: SyncSession[] = [
      {
        id: '1',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
        duration: 15,
        mood1: 4,
        mood2: 4,
        energy1: 7,
        energy2: 8,
        topics: ['work-life balance', 'weekend plans', 'family time'],
        actionItems: ['Schedule date night', 'Discuss vacation plans'],
        completed: true
      },
      {
        id: '2',
        date: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        duration: 20,
        mood1: 3,
        mood2: 5,
        energy1: 6,
        energy2: 9,
        topics: ['stress management', 'communication', 'support'],
        actionItems: ['Practice active listening', 'Plan relaxing weekend'],
        completed: true
      }
    ];

    // Sample shared goals
    const sampleGoals: CoupleGoal[] = [
      {
        id: '1',
        title: 'Weekly Date Night',
        description: 'Plan and execute a special date night every week',
        targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
        progress: 85,
        completed: false,
        category: 'romance',
        shared: true
      },
      {
        id: '2',
        title: 'Financial Planning',
        description: 'Create and stick to a joint financial plan',
        targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60), // 60 days from now
        progress: 45,
        completed: false,
        category: 'finance',
        shared: true
      },
      {
        id: '3',
        title: 'Home Renovation',
        description: 'Complete living room renovation project',
        targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90), // 90 days from now
        progress: 20,
        completed: false,
        category: 'home',
        shared: true
      }
    ];

    setActivities(sampleActivities);
    setSessions(sampleSessions);
    setSharedGoals(sampleGoals);
  };

  const simulateLiveActivity = () => {
    // Simulate random live activities from partner
    const activityTypes = ['sync_completed', 'task_updated', 'goal_achieved', 'ritual_performed'];
    const titles = [
      'Quick Check-in',
      'Task Progress Updated',
      'Mood Shared',
      'Love Note Sent',
      'Daily Affirmation'
    ];
    
    const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    
    const newActivity: SyncActivity = {
      id: Date.now().toString(),
      type: randomType as any,
      title: randomTitle,
      description: `Partner just ${randomTitle.toLowerCase()}`,
      timestamp: new Date(),
      partner: Math.random() > 0.5 ? 'partner1' : 'partner2',
      priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
    };

    setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep last 10 activities
    setUnreadCount(prev => prev + 1);
    setLastSync(new Date());
  };

  const handleSyncNow = () => {
    setSyncStatus('connecting');
    if (socket) {
      socket.emit('sync:complete', { syncData: { source: 'CoupleSyncSystem', at: new Date().toISOString() } });
    }
    
    // Simulate sync process
    setTimeout(() => {
      setSyncStatus('connected');
      setLastSync(new Date());
      setUnreadCount(0);
      
      // Add sync activity
      const syncActivity: SyncActivity = {
        id: Date.now().toString(),
        type: 'sync_completed',
        title: 'Manual Sync Completed',
        description: 'All data synchronized successfully',
        timestamp: new Date(),
        partner: 'partner1',
        priority: 'medium'
      };
      
      setActivities(prev => [syncActivity, ...prev]);
    }, 2000);
  };

  const handleQuickMessage = () => {
    const messageActivity: SyncActivity = {
      id: Date.now().toString(),
      type: 'message_sent',
      title: 'Quick Message Sent',
      description: 'Sent a thinking of you message 💕',
      timestamp: new Date(),
      partner: 'partner1',
      priority: 'low'
    };
    
    setActivities(prev => [messageActivity, ...prev]);
  };

  const handleVideoCall = () => {
    const callActivity: SyncActivity = {
      id: Date.now().toString(),
      type: 'sync_completed',
      title: 'Video Call Started',
      description: 'Initiated video connection',
      timestamp: new Date(),
      partner: 'partner1',
      priority: 'high'
    };
    
    setActivities(prev => [callActivity, ...prev]);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sync_completed': return <RefreshCw className="w-4 h-4" />;
      case 'message_sent': return <MessageCircle className="w-4 h-4" />;
      case 'task_updated': return <Target className="w-4 h-4" />;
      case 'goal_achieved': return <Award className="w-4 h-4" />;
      case 'ritual_performed': return <Heart className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'sync_completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'message_sent': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'task_updated': return 'bg-green-100 text-green-700 border-green-200';
      case 'goal_achieved': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'ritual_performed': return 'bg-pink-100 text-pink-700 border-pink-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const toggleLiveSync = () => {
    setIsLive(!isLive);
    if (!isLive) {
      setSyncStatus('connected');
    }
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'connecting': return 'text-yellow-600 bg-yellow-100';
      case 'disconnected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sync Status Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6" />
              <div>
                <CardTitle className="text-lg">Couple Sync</CardTitle>
                <p className="text-sm opacity-90">
                  {syncStatus === 'connected' ? 'Connected and in sync' : 
                   syncStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleLiveSync}
                variant="secondary"
                size="sm"
                className={`bg-white/20 text-white hover:bg-white/30 ${isLive ? 'animate-pulse' : ''}`}
              >
                <Zap className="w-4 h-4 mr-1" />
                {isLive ? 'Live' : 'Offline'}
              </Button>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {unreadCount > 0 && (
                  <Bell className="w-3 h-3 mr-1 animate-bounce" />
                )}
                {unreadCount} new
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${syncStatus === 'connected' ? 'bg-green-400' : syncStatus === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
              <span className="text-sm">Last sync: {formatTime(lastSync)}</span>
            </div>
            <Button
              onClick={handleSyncNow}
              disabled={syncStatus === 'connecting'}
              className="bg-white/20 hover:bg-white/30 text-white"
              size="sm"
            >
              {syncStatus === 'connecting' ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={handleQuickMessage}
              className="flex flex-col items-center gap-2 h-auto py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs">Quick Message</span>
            </Button>
            <Button
              onClick={handleVideoCall}
              className="flex flex-col items-center gap-2 h-auto py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              <Video className="w-6 h-6" />
              <span className="text-xs">Video Call</span>
            </Button>
            <Button
              onClick={() => setActiveTab('goals')}
              className="flex flex-col items-center gap-2 h-auto py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              <Target className="w-6 h-6" />
              <span className="text-xs">Shared Goals</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="harmony">Harmony</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Sync Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-purple-500 text-white border-0">
              <CardContent className="p-4 text-center">
                <RefreshCw className="w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold">{sessions.length}</p>
                <p className="text-xs opacity-90">Sync Sessions</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold">{sharedGoals.filter(g => g.completed).length}</p>
                <p className="text-xs opacity-90">Goals Achieved</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </div>
                <Badge variant="outline" className="text-xs">
                  Live Updates {isLive && <span className="w-2 h-2 bg-green-500 rounded-full ml-1 animate-pulse"></span>}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{activity.title}</h4>
                      <p className="text-xs text-gray-600">{activity.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`text-xs ${getPriorityColor(activity.priority)}`}>
                        {activity.priority}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{formatTime(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sync Status</span>
                  <Badge className={`text-xs ${getSyncStatusColor()}`}>
                    {syncStatus === 'connected' ? 'Connected' : 
                     syncStatus === 'connecting' ? 'Connecting' : 'Disconnected'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Live Updates</span>
                  <Badge className={`text-xs ${isLive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {isLive ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Notifications</span>
                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                    {notificationSettings.syncReminders ? 'On' : 'Off'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="harmony" className="space-y-4">
          {/* Archetypal Relationship Harmony */}
          <Card className="bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 border-purple-200 shadow-lg overflow-hidden mb-6">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Partnership Archetypal Harmony 🕉️
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sacred Energy Balance</h3>
                <p className="text-gray-600">
                  Your relationship's archetypal energies in real-time harmony
                </p>
              </div>

              {/* Archetypal Balance Display */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                      💙
                    </div>
                  </div>
                  <h4 className="font-bold text-blue-800 mb-1">Krishna</h4>
                  <p className="text-sm text-blue-600 mb-2">Playful Love</p>
                  <div className="text-2xl font-bold text-blue-700">{archetypalBalance.krishna}%</div>
                  <Progress value={archetypalBalance.krishna} className="mt-2 h-2 bg-blue-200" />
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl border border-yellow-200">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                      🤝
                    </div>
                  </div>
                  <h4 className="font-bold text-yellow-800 mb-1">Ram</h4>
                  <p className="text-sm text-yellow-600 mb-2">Devoted Partnership</p>
                  <div className="text-2xl font-bold text-yellow-700">{archetypalBalance.ram}%</div>
                  <Progress value={archetypalBalance.ram} className="mt-2 h-2 bg-yellow-200" />
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                    🧘
                    </div>
                  </div>
                  <h4 className="font-bold text-purple-800 mb-1">Shiva</h4>
                  <p className="text-sm text-purple-600 mb-2">Inner Wholeness</p>
                  <div className="text-2xl font-bold text-purple-700">{archetypalBalance.shiva}%</div>
                  <Progress value={archetypalBalance.shiva} className="mt-2 h-2 bg-purple-200" />
                </div>
              </div>

              {/* Harmony Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  onClick={() => {
                    const newBalance = {
                      krishna: Math.floor(Math.random() * 20) + 70, // Boost Krishna 70-90%
                      ram: Math.floor(Math.random() * 20) + 40, // Balance Ram 40-60%
                      shiva: Math.floor(Math.random() * 20) + 40 // Balance Shiva 40-60%
                    };
                    setArchetypalBalance(newBalance);

                    const syncActivity: SyncActivity = {
                      id: Date.now().toString(),
                      type: 'ritual_performed',
                      title: 'Harmony Sync Performed',
                      description: 'Partner synchronized archetypal energies for balance',
                      timestamp: new Date(),
                      partner: 'partner2',
                      priority: 'high',
                      archetypalEnergy: 'krishna',
                      harmonyScore: 85
                    };
                    setActivities(prev => [syncActivity, ...prev]);
                  }}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Sync Energies Now
                </Button>

                <Button
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  onClick={() => {
                    const harmonySession = {
                      id: Date.now().toString(),
                      date: new Date(),
                      duration: 10,
                      mood1: 5,
                      mood2: 5,
                      energy1: 8,
                      energy2: 9,
                      topics: ['Energy balance', 'Archetypal harmony'],
                      actionItems: ['Align archetypal energies', 'Strengthen spiritual connection'],
                      completed: true
                    };
                    setSessions(prev => [harmonySession, ...prev]);
                  }}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Start Harmony Session
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Archetypal Activities Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Energy-Flow Activities
              </CardTitle>
              <p className="text-sm text-gray-600">
                Real-time archetypal energy exchanges strengthening your bond
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.slice(0, 3).map((activity, index) => (
                  <div key={activity.id} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg">
                          <span className="text-sm">
                            {activity.archetypalEnergy === 'krishna' ? '💙' :
                             activity.archetypalEnergy === 'ram' ? '🤝' : '🧘'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{activity.title}</h4>
                          <p className="text-xs text-gray-600">{activity.description}</p>
                        </div>
                      </div>
                      {activity.harmonyScore && (
                        <div className="text-center">
                          <div className={`text-sm font-bold ${
                            activity.harmonyScore >= 80 ? 'text-green-600' :
                            activity.harmonyScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {activity.harmonyScore}%
                          </div>
                          <div className="text-xs text-gray-500">Harmony</div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${
                        activity.archetypalEnergy === 'krishna' ? 'bg-blue-100 text-blue-700' :
                        activity.archetypalEnergy === 'ram' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {activity.archetypalEnergy || 'sacred'} energy
                      </Badge>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{formatTime(activity.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sacred Connection Insights */}
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-600" />
                Sacred Connection Insights 💕
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-white/80 rounded-xl border border-pink-200">
                  <h4 className="font-semibold text-pink-800 mb-2">Today's Archetypal Dance</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Your relationship is currently flowing with {Math.max(archetypalBalance.krishna, archetypalBalance.ram, archetypalBalance.shiva)}%
                    harmony. Every shared moment strengthens the sacred bond between your souls. 🥰
                  </p>
                </div>

                <div className="p-4 bg-white/80 rounded-xl border border-pink-200">
                  <h4 className="font-semibold text-purple-800 mb-2">Energy Flow Reminder</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Balance your energies like the eternal dance of Radha-Krishna. When you sync with your partner,
                    you're participating in creation itself. 🌟
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  All Activity
                </div>
                <Button
                  onClick={() => setUnreadCount(0)}
                  variant="outline"
                  size="sm"
                >
                  Mark All Read
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{activity.title}</h4>
                      <p className="text-xs text-gray-600">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${getPriorityColor(activity.priority)}`}>
                          {activity.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {activity.partner === 'partner1' ? 'You' : 'Partner'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{formatTime(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Sync Sessions History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        {new Date(session.date).toLocaleDateString()}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          {session.duration} min
                        </Badge>
                        {session.completed && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="text-sm font-medium text-blue-600">
                          Mood: {session.mood1}/5 & {session.mood2}/5
                        </p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <p className="text-sm font-medium text-green-600">
                          Energy: {session.energy1}/10 & {session.energy2}/10
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Topics:</p>
                        <div className="flex flex-wrap gap-1">
                          {session.topics.map((topic, index) => (
                            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Action Items:</p>
                        <div className="flex flex-wrap gap-1">
                          {session.actionItems.map((item, index) => (
                            <span key={index} className="text-xs bg-purple-100 px-2 py-1 rounded">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Shared Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sharedGoals.map((goal) => (
                  <div key={goal.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{goal.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          Target: {goal.targetDate.toLocaleDateString()}
                        </div>
                      </div>
                      {goal.completed && (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {goal.category}
                        </Badge>
                        {goal.shared && (
                          <Badge className="bg-purple-100 text-purple-700 text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            Shared
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
