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
  Brain
} from 'lucide-react';

interface SyncActivity {
  id: string;
  type: 'sync_completed' | 'message_sent' | 'task_updated' | 'goal_achieved' | 'ritual_performed';
  title: string;
  description: string;
  timestamp: Date;
  partner: 'partner1' | 'partner2';
  priority: 'low' | 'medium' | 'high';
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
  
  const syncIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
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
          <TabsTrigger value="overview">Overview</TabsTrigger>
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