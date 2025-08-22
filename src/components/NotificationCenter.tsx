'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Clock, 
  Heart, 
  MessageCircle, 
  Target, 
  Users, 
  Brain,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings,
  Plus,
  Trash2,
  Filter,
  Search
} from 'lucide-react';
import { MagicButton } from '@/components/MagicButton';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'reminder' | 'insight' | 'achievement' | 'sync_request' | 'coaching_session' | 'daily_checkin';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  action?: {
    label: string;
    onClick: () => void;
  };
  data?: any;
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  type: 'daily_sync' | 'date_night' | 'coaching_session' | 'goal_review' | 'family_time';
  time: string;
  days: string[];
  enabled: boolean;
  lastTriggered?: Date;
  nextTrigger?: Date;
}

interface NotificationPreference {
  type: string;
  enabled: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notifications');
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');
  const { toast } = useToast();

  useEffect(() => {
    initializeNotificationData();
  }, []);

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      generateRandomNotification();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const initializeNotificationData = () => {
    // Mock notifications
    const notificationsData: Notification[] = [
      {
        id: '1',
        type: 'daily_checkin',
        title: 'Daily Sync Reminder',
        message: 'Time for your daily relationship check-in with your partner',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
        priority: 'high',
        action: {
          label: 'Start Sync',
          onClick: () => handleNotificationAction('daily_sync')
        }
      },
      {
        id: '2',
        type: 'insight',
        title: 'New AI Insight Available',
        message: 'AI has identified a pattern in your communication that could improve your relationship',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
        priority: 'medium',
        action: {
          label: 'View Insight',
          onClick: () => handleNotificationAction('view_insight')
        }
      },
      {
        id: '3',
        type: 'achievement',
        title: 'Achievement Unlocked! 🎉',
        message: 'You\'ve completed 7 days of daily syncs - consistency champion!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true,
        priority: 'medium'
      },
      {
        id: '4',
        type: 'sync_request',
        title: 'Partner Sync Request',
        message: 'Your partner wants to sync their daily progress with you',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: false,
        priority: 'high',
        action: {
          label: 'Sync Now',
          onClick: () => handleNotificationAction('partner_sync')
        }
      },
      {
        id: '5',
        type: 'coaching_session',
        title: 'Coaching Session Reminder',
        message: 'Your weekly AI coaching session is scheduled for tomorrow at 7:00 PM',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: true,
        priority: 'medium',
        action: {
          label: 'View Details',
          onClick: () => handleNotificationAction('coaching_details')
        }
      }
    ];

    // Mock reminders
    const remindersData: Reminder[] = [
      {
        id: '1',
        title: 'Daily Relationship Sync',
        description: 'Daily check-in to share feelings and coordinate tasks',
        type: 'daily_sync',
        time: '20:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        enabled: true,
        lastTriggered: new Date(Date.now() - 24 * 60 * 60 * 1000),
        nextTrigger: new Date(Date.now() + 2 * 60 * 60 * 1000)
      },
      {
        id: '2',
        title: 'Date Night Reminder',
        description: 'Weekly dedicated time for romance and connection',
        type: 'date_night',
        time: '19:00',
        days: ['saturday'],
        enabled: true,
        lastTriggered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        nextTrigger: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        title: 'AI Coaching Session',
        description: 'Weekly session with AI relationship coach',
        type: 'coaching_session',
        time: '19:00',
        days: ['sunday'],
        enabled: true,
        lastTriggered: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        nextTrigger: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        title: 'Goal Review',
        description: 'Monthly review of relationship goals and progress',
        type: 'goal_review',
        time: '15:00',
        days: ['1'], // First day of month
        enabled: true,
        lastTriggered: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        nextTrigger: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      }
    ];

    // Mock preferences
    const preferencesData: NotificationPreference = {
      type: 'all',
      enabled: true,
      pushEnabled: true,
      emailEnabled: false,
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00'
      }
    };

    setNotifications(notificationsData);
    setReminders(remindersData);
    setPreferences(preferencesData);
    setLoading(false);
  };

  const generateRandomNotification = () => {
    const randomNotifications = [
      {
        type: 'insight' as const,
        title: 'Relationship Pattern Detected',
        message: 'AI noticed increased positive communication patterns this week',
        priority: 'low' as const
      },
      {
        type: 'achievement' as const,
        title: 'Milestone Reached! 🌟',
        message: 'You\'ve completed 50 AI coaching sessions',
        priority: 'medium' as const
      },
      {
        type: 'reminder' as const,
        title: 'Weekly Goal Check',
        message: 'Time to review your weekly relationship goals',
        priority: 'medium' as const
      }
    ];

    const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)]!;
    
    const newNotification: Notification = {
      id: Date.now().toString(),
      ...randomNotification,
      timestamp: new Date(),
      read: false,
      ...(randomNotification.type === 'insight' && {
        action: {
          label: 'View Details',
          onClick: () => handleNotificationAction('view_insight'),
        },
      }),
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleNotificationAction = (actionType: string) => {
    toast({
      title: "Action Completed! ✨",
      description: `Successfully handled ${actionType.replace('_', ' ')}`,
      duration: 3000,
    });
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    toast({
      title: "All Marked as Read! 📫",
      description: "All notifications have been marked as read",
      duration: 3000,
    });
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  const toggleReminder = (reminderId: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === reminderId 
          ? { ...reminder, enabled: !reminder.enabled }
          : reminder
      )
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder': return <Clock className="w-4 h-4" />;
      case 'insight': return <Brain className="w-4 h-4" />;
      case 'achievement': return <CheckCircle className="w-4 h-4" />;
      case 'sync_request': return <Users className="w-4 h-4" />;
      case 'coaching_session': return <MessageCircle className="w-4 h-4" />;
      case 'daily_checkin': return <Heart className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'reminder': return 'bg-blue-100 text-blue-700';
      case 'insight': return 'bg-purple-100 text-purple-700';
      case 'achievement': return 'bg-green-100 text-green-700';
      case 'sync_request': return 'bg-orange-100 text-orange-700';
      case 'coaching_session': return 'bg-indigo-100 text-indigo-700';
      case 'daily_checkin': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'daily_sync': return <Heart className="w-4 h-4" />;
      case 'date_night': return <Calendar className="w-4 h-4" />;
      case 'coaching_session': return <MessageCircle className="w-4 h-4" />;
      case 'goal_review': return <Target className="w-4 h-4" />;
      case 'family_time': return <Users className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'high') return notification.priority === 'high';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

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

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
              <Bell className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Notification Center</h1>
            <p className="text-gray-600 text-sm">Stay connected with your relationship journey</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white">
              {unreadCount} unread
            </Badge>
          )}
          <MagicButton className="bg-gradient-to-r from-blue-500 to-purple-500">
            <Plus className="w-4 h-4 mr-2" />
            Add Reminder
          </MagicButton>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-1 bg-red-500 text-white text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="reminders" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
            <Clock className="w-4 h-4 mr-2" />
            Reminders
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {/* Filter Controls */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className="text-xs"
              >
                All ({notifications.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
                className="text-xs"
              >
                Unread ({unreadCount})
              </Button>
              <Button
                variant={filter === 'high' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('high')}
                className="text-xs"
              >
                High Priority
              </Button>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Mark All Read
                </Button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-600">You're all caught up! No new notifications to show.</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
                    !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  } ${getPriorityColor(notification.priority)} border-l-4`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{notification.timestamp.toLocaleTimeString()}</span>
                            <span>{notification.timestamp.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {notification.action && (
                          <Button 
                            size="sm" 
                            onClick={notification.action.onClick}
                            className="text-xs"
                          >
                            {notification.action.label}
                          </Button>
                        )}
                        {!notification.read && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs"
                          >
                            Mark Read
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <Card key={reminder.id} className="bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                        {getReminderIcon(reminder.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {reminder.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {reminder.days.join(', ')}
                          </span>
                          {reminder.nextTrigger && (
                            <span className="flex items-center gap-1">
                              Next: {reminder.nextTrigger.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={reminder.enabled}
                        onCheckedChange={() => toggleReminder(reminder.id)}
                      />
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          {preferences && (
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Enable Notifications</h3>
                    <p className="text-sm text-gray-600">Receive notifications about your relationship</p>
                  </div>
                  <Switch
                    checked={preferences.enabled}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => prev ? { ...prev, enabled: checked } : null)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Push Notifications</h3>
                    <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                  </div>
                  <Switch
                    checked={preferences.pushEnabled}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => prev ? { ...prev, pushEnabled: checked } : null)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive email summaries and updates</p>
                  </div>
                  <Switch
                    checked={preferences.emailEnabled}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => prev ? { ...prev, emailEnabled: checked } : null)
                    }
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Quiet Hours</h3>
                      <p className="text-sm text-gray-600">Limit notifications during specific hours</p>
                    </div>
                    <Switch
                      checked={preferences.quietHours.enabled}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => prev ? { 
                          ...prev, 
                          quietHours: { ...prev.quietHours, enabled: checked } 
                        } : null)
                      }
                    />
                  </div>

                  {preferences.quietHours.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Start Time</label>
                        <input
                          type="time"
                          value={preferences.quietHours.start}
                          onChange={(e) => 
                            setPreferences(prev => prev ? { 
                              ...prev, 
                              quietHours: { ...prev.quietHours, start: e.target.value } 
                            } : null)
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">End Time</label>
                        <input
                          type="time"
                          value={preferences.quietHours.end}
                          onChange={(e) => 
                            setPreferences(prev => prev ? { 
                              ...prev, 
                              quietHours: { ...prev.quietHours, end: e.target.value } 
                            } : null)
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}