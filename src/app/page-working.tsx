'use client';

import { useState } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { DailySyncCard } from '@/components/DailySyncCard';
import { AISuggestionCard } from '@/components/AISuggestionCard';
import { RasaBalanceWheel } from '@/components/RasaBalanceWheel';
import { TaskList } from '@/components/TaskList';
import { RitualCard } from '@/components/RitualCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  List, 
  Heart, 
  Users, 
  Settings, 
  TrendingUp, 
  Award,
  Sparkles,
  Target,
  Calendar,
  Star,
  Coins,
  Bell
} from 'lucide-react';

// Sample data
const sampleTasks = [
  {
    id: '1',
    title: 'Morning meditation together',
    description: 'Start the day with a 10-minute meditation session',
    assignedTo: 'both' as const,
    category: 'couple' as const,
    priority: 'medium' as const,
    estimatedTime: 10,
    completed: false,
    coins: 15,
    recurring: true
  },
  {
    id: '2',
    title: 'Prepare kids\' lunch boxes',
    description: 'Make healthy lunch boxes for the children',
    assignedTo: 'user' as const,
    category: 'parenting' as const,
    priority: 'high' as const,
    estimatedTime: 20,
    dueDate: new Date().toISOString(),
    completed: true,
    coins: 20
  },
  {
    id: '3',
    title: 'Grocery shopping',
    description: 'Weekly grocery shopping for the family',
    assignedTo: 'partner' as const,
    category: 'household' as const,
    priority: 'medium' as const,
    estimatedTime: 45,
    completed: false,
    coins: 25
  }
];

const sampleRituals = [
  {
    id: '1',
    name: 'Sacred Conversation',
    description: 'A heart-to-heart conversation where both partners share their feelings, dreams, and concerns without judgment.',
    archetype: 'radha_krishna' as const,
    duration: 30,
    frequency: 'daily' as const,
    difficulty: 'easy' as const,
    completedToday: false,
    streak: 5,
    coins: 30,
    steps: [
      'Find a quiet, comfortable space',
      'Set aside distractions (phones, TV)',
      'Take 3 deep breaths together',
      'Share one thing you\'re grateful for',
      'Discuss your feelings openly',
      'End with a hug or loving gesture'
    ],
    benefits: ['Deeper connection', 'Better communication', 'Emotional intimacy', 'Stress reduction']
  },
  {
    id: '2',
    name: 'Duty Balance Check',
    description: 'Review and balance household responsibilities to ensure fair distribution of duties.',
    archetype: 'sita_ram' as const,
    duration: 15,
    frequency: 'weekly' as const,
    difficulty: 'medium' as const,
    completedToday: true,
    streak: 12,
    coins: 25,
    steps: [
      'List all household tasks',
      'Discuss current workload',
      'Identify imbalances',
      'Redistribute tasks fairly',
      'Set up a schedule',
      'Commit to the new balance'
    ],
    benefits: ['Fair workload', 'Reduced resentment', 'Better teamwork', 'Harmony at home']
  }
];

const sampleSuggestion = {
  type: 'ritual' as const,
  archetype: 'radha_krishna' as const,
  title: 'Evening Gratitude Practice',
  description: 'Based on your recent stress levels and communication patterns, a daily gratitude practice could help strengthen your bond and reduce tension.',
  actionSteps: [
    'Set aside 5 minutes before bed',
    'Share 3 things you\'re grateful for about each other',
    'End with a loving affirmation',
    'Practice consistently for 21 days'
  ],
  estimatedDuration: 300,
  rewardCoins: 20,
  reasoning: {
    trigger: 'increased_stress',
    severity: 7,
    factors: ['work_pressure', 'communication_gap', 'lack_quality_time']
  }
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [dailySyncCompleted, setDailySyncCompleted] = useState(false);
  const [tasks, setTasks] = useState(sampleTasks);
  const [rituals, setRituals] = useState(sampleRituals);
  const [rasaBalance, setRasaBalance] = useState({
    play: 35,
    duty: 45,
    balance: 20
  });

  const handleTaskToggle = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleAddTask = () => {
    // Placeholder for add task functionality
    console.log('Add task clicked');
  };

  const handleCompleteSync = (data: any) => {
    setDailySyncCompleted(true);
    console.log('Daily sync completed:', data);
  };

  const handleAcceptSuggestion = () => {
    console.log('Suggestion accepted');
  };

  const handleLaterSuggestion = () => {
    console.log('Suggestion postponed');
  };

  const handleTellMeMore = () => {
    console.log('Tell me more clicked');
  };

  const handleRebalance = () => {
    console.log('Rebalance clicked');
  };

  const handleStartRitual = (ritualId: string) => {
    console.log('Starting ritual:', ritualId);
  };

  const handleCompleteRitual = (ritualId: string) => {
    setRituals(rituals.map(ritual => 
      ritual.id === ritualId ? { ...ritual, completedToday: true, streak: ritual.streak + 1 } : ritual
    ));
  };

  const renderHomeTab = () => (
    <div className="space-y-6 pb-20">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Good Morning, Priya! 🌅</h1>
            <p className="text-purple-100">Ready to strengthen your bond today?</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-yellow-300">
              <Coins className="w-5 h-5" />
              <span className="font-bold">1,250</span>
            </div>
            <p className="text-xs text-purple-200">Lakshmi Coins</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-2xl font-bold">7</div>
            <div className="text-xs">Day Streak</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-2xl font-bold">85%</div>
            <div className="text-xs">Sync Rate</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs">Rituals Done</div>
          </div>
        </div>
      </div>

      {/* Daily Sync */}
      {!dailySyncCompleted && (
        <DailySyncCard onCompleteSync={handleCompleteSync} />
      )}

      {/* AI Suggestion */}
      <AISuggestionCard 
        suggestion={sampleSuggestion}
        onAccept={handleAcceptSuggestion}
        onLater={handleLaterSuggestion}
        onTellMe={handleTellMeMore}
      />

      {/* Rasa Balance Wheel */}
      <Card className="w-full">
        <CardContent className="p-6">
          <RasaBalanceWheel balance={rasaBalance} onRebalance={handleRebalance} />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Start Ritual</h3>
            <p className="text-xs text-gray-600">Connect deeply</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Set Goal</h3>
            <p className="text-xs text-gray-600">Grow together</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTasksTab = () => (
    <div className="space-y-6 pb-20">
      <TaskList 
        tasks={tasks}
        onTaskToggle={handleTaskToggle}
        onAddTask={handleAddTask}
      />
    </div>
  );

  const renderRitualsTab = () => (
    <div className="space-y-6 pb-20">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sacred Rituals</h2>
        <p className="text-gray-600">Ancient wisdom for modern relationships</p>
      </div>
      
      <div className="space-y-4">
        {rituals.map(ritual => (
          <RitualCard
            key={ritual.id}
            ritual={ritual}
            onStart={handleStartRitual}
            onComplete={handleCompleteRitual}
          />
        ))}
      </div>
    </div>
  );

  const renderFamilyTab = () => (
    <div className="space-y-6 pb-20">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Family Hub</h2>
        <p className="text-gray-600">Manage your family activities and goals</p>
      </div>
      
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Family Goals</h3>
            <Badge className="bg-purple-100 text-purple-700">
              3 Active
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Weekend Family Time</h4>
              <Progress value={75} className="h-2 mb-2" />
              <p className="text-sm text-gray-600">75% complete - 3 of 4 weeks done</p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Healthy Eating Habits</h4>
              <Progress value={40} className="h-2 mb-2" />
              <p className="text-sm text-gray-600">40% complete - 8 of 20 days done</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Diwali Celebration</p>
                <p className="text-sm text-gray-600">Nov 12, 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Family Movie Night</p>
                <p className="text-sm text-gray-600">Every Friday</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
          PK
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Priya Kumar</h2>
        <p className="text-gray-600">Growing stronger with Raj</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Achievements</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-xs text-gray-600">7 Day Streak</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-xs text-gray-600">Love Master</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600">Goal Setter</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Settings</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Partner Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar Sync
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {activeTab === 'home' && renderHomeTab()}
          {activeTab === 'tasks' && renderTasksTab()}
          {activeTab === 'rituals' && renderRitualsTab()}
          {activeTab === 'family' && renderFamilyTab()}
          {activeTab === 'profile' && renderProfileTab()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200">
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}