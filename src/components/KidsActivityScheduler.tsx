'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar,
  Shuffle,
  Users,
  Clock,
  Target,
  Zap,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface Parent {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface WeeklySchedule {
  weekNumber: number;
  year: number;
  days: {
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    date: Date;
    activityType: 'krishna' | 'hanuman' | 'saraswati' | null;
    assignedParent: string | null;
    targetParent: string | null; // For Krishna pranks
  }[];
}

interface ActivityAssignment {
  type: 'krishna' | 'hanuman' | 'saraswati';
  dayOfWeek: number;
  assignedParent: string;
  targetParent?: string; // Only for Krishna
  prompt: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
}

export function KidsActivityScheduler() {
  const [parents, setParents] = useState<Parent[]>([
    { id: 'mom', name: 'Mom', role: 'Parent', avatar: '👩' },
    { id: 'dad', name: 'Dad', role: 'Parent', avatar: '👨' }
  ]);

  const [currentSchedule, setCurrentSchedule] = useState<WeeklySchedule | null>(null);
  const [nextSchedule, setNextSchedule] = useState<WeeklySchedule | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [weekProgress, setWeekProgress] = useState(0);

  // Initialize schedule on component mount
  useEffect(() => {
    generateWeeklySchedule();
  }, []);

  const generateWeeklySchedule = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const schedule = createWeeklySchedule();
    setCurrentSchedule(schedule);
    
    // Generate next week's schedule
    const nextWeekSchedule = createWeeklySchedule(1);
    setNextSchedule(nextWeekSchedule);
    
    setIsGenerating(false);
    
    updateWeekProgress(schedule);
  };

  const createWeeklySchedule = (weekOffset = 0): WeeklySchedule => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + (weekOffset * 7));
    
    const weekNumber = getWeekNumber(startOfWeek);
    const year = startOfWeek.getFullYear();
    
    // Generate 3 random days for activities
    const activityDays = getRandomDays(3);
    const activityTypes = ['krishna', 'hanuman', 'saraswati'] as const;
    
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      
      const activityIndex = activityDays.indexOf(index);
      const activityType = activityIndex !== -1 ? activityTypes[activityIndex] : null;
      
      let assignedParent = null;
      let targetParent = null;
      
      if (activityType) {
        // Assign parents with rotation logic
        const parentAssignment = assignParents(activityType, weekOffset);
        assignedParent = parentAssignment.assignedParent;
        targetParent = parentAssignment.targetParent;
      }
      
      return {
        dayOfWeek: index,
        date,
        activityType,
        assignedParent,
        targetParent
      };
    });
    
    return {
      weekNumber,
      year,
      days
    };
  };

  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const getRandomDays = (count: number): number[] => {
    const days = Array.from({ length: 7 }, (_, i) => i);
    const selectedDays: number[] = [];
    
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * days.length);
      selectedDays.push(days.splice(randomIndex, 1)[0]);
    }
    
    return selectedDays.sort((a, b) => a - b);
  };

  const assignParents = (activityType: 'krishna' | 'hanuman' | 'saraswati', weekOffset: number) => {
    const weekNum = getWeekNumber(new Date()) + weekOffset;
    
    // Rotate parents based on week number to ensure fairness
    const primaryParentIndex = weekNum % parents.length;
    const secondaryParentIndex = (primaryParentIndex + 1) % parents.length;
    
    const assignedParent = parents[primaryParentIndex].id;
    
    if (activityType === 'krishna') {
      // For Krishna, one parent helps, one is targeted
      return {
        assignedParent,
        targetParent: parents[secondaryParentIndex].id
      };
    } else {
      // For Hanuman and Saraswati, only one parent is assigned
      return {
        assignedParent,
        targetParent: null
      };
    }
  };

  const updateWeekProgress = (schedule: WeeklySchedule) => {
    const completedDays = schedule.days.filter(day => {
      const today = new Date();
      const dayDate = new Date(day.date);
      return dayDate < today && day.activityType !== null;
    }).length;
    
    const totalActivityDays = schedule.days.filter(day => day.activityType !== null).length;
    const progress = totalActivityDays > 0 ? (completedDays / totalActivityDays) * 100 : 0;
    
    setWeekProgress(progress);
  };

  const getActivityPrompt = (type: 'krishna' | 'hanuman' | 'saraswati'): string => {
    const prompts = {
      krishna: [
        "Write a mysterious note and hide it for your partner to find",
        "Swap a few pairs of socks in your partner's drawer",
        "Put a fun sticker on your partner's phone case",
        "Hide a small toy in your partner's bag"
      ],
      hanuman: [
        "Organize books on the shelf like a mission",
        "Help set the table for dinner",
        "Put away toys in the living room",
        "Water the plants in the house"
      ],
      saraswati: [
        "Draw your dream house and tell your parent about it",
        "Create a story together about a magical adventure",
          "Make up a song about your family",
        "Build something with blocks and describe it"
      ]
    };
    
    const typePrompts = prompts[type];
    return typePrompts[Math.floor(Math.random() * typePrompts.length)];
  };

  const getActivityIcon = (type: 'krishna' | 'hanuman' | 'saraswati') => {
    const icons = {
      krishna: '👦',
      hanuman: '🐒',
      saraswati: '👩'
    };
    return icons[type];
  };

  const getActivityColor = (type: 'krishna' | 'hanuman' | 'saraswati') => {
    const colors = {
      krishna: 'from-purple-500 to-pink-500',
      hanuman: 'from-orange-500 to-red-500',
      saraswati: 'from-blue-500 to-indigo-500'
    };
    return colors[type];
  };

  const getDayName = (dayOfWeek: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  const getParentName = (parentId: string): string => {
    const parent = parents.find(p => p.id === parentId);
    return parent ? parent.name : 'Unknown';
  };

  const getParentAvatar = (parentId: string): string => {
    const parent = parents.find(p => p.id === parentId);
    return parent ? parent.avatar : '❓';
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date): boolean => {
    const today = new Date();
    return date < today;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Activity Scheduler</h3>
          <p className="text-sm text-gray-600">AI-powered weekly activity planning</p>
        </div>
        <Button 
          onClick={generateWeeklySchedule}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Shuffle className="w-4 h-4 mr-2" />
              Regenerate Week
            </>
          )}
        </Button>
      </div>

      {/* Week Progress */}
      {currentSchedule && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Week {currentSchedule.weekNumber} Progress</h4>
              <span className="text-sm text-gray-600">{Math.round(weekProgress)}% Complete</span>
            </div>
            <Progress value={weekProgress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Current Week Schedule */}
      {currentSchedule && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              This Week's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentSchedule.days.map((day, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isToday(day.date) 
                    ? 'border-blue-500 bg-blue-50' 
                    : isPast(day.date)
                    ? 'border-gray-200 bg-gray-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {getDayName(day.dayOfWeek).substring(0, 3)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {day.date.getDate()}/{day.date.getMonth() + 1}
                      </div>
                    </div>
                    
                    {day.activityType ? (
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r ${getActivityColor(day.activityType)} text-white`}>
                          <span className="text-lg">{getActivityIcon(day.activityType)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 capitalize">
                            {day.activityType} Day
                          </div>
                          <div className="text-sm text-gray-600">
                            {day.assignedParent && (
                              <span className="flex items-center gap-1">
                                <span>{getParentAvatar(day.assignedParent)}</span>
                                {getParentName(day.assignedParent)}
                                {day.targetParent && (
                                  <>
                                    <span>→</span>
                                    <span>{getParentAvatar(day.targetParent)}</span>
                                    {getParentName(day.targetParent)}
                                  </>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500 italic">No activity scheduled</div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isToday(day.date) && (
                      <Badge className="bg-blue-100 text-blue-700">
                        Today
                      </Badge>
                    )}
                    {day.activityType && isPast(day.date) && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
                
                {day.activityType && isToday(day.date) && (
                  <div className="mt-3 p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Today's Activity:</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {getActivityPrompt(day.activityType)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        15-30 min
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        Parent-led
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Next Week Preview */}
      {nextSchedule && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5" />
              Next Week Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {nextSchedule.days.map((day, index) => (
                <div
                  key={index}
                  className="text-center p-2 rounded-lg bg-white border"
                >
                  <div className="text-xs font-medium text-gray-600">
                    {getDayName(day.dayOfWeek).substring(0, 3)}
                  </div>
                  <div className="text-lg mb-1">
                    {day.activityType ? getActivityIcon(day.activityType) : '•'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {day.assignedParent ? getParentAvatar(day.assignedParent) : ''}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Logic Info */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">AI Scheduling Logic</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Randomly selects 3 days per week for activities</li>
                <li>• Rotates parent assignments weekly for fairness</li>
                <li>• Balances Krishna, Hanuman, and Saraswati activities</li>
                <li>• Ensures no consecutive days of same activity type</li>
                <li>• Generates age-appropriate prompts and tasks</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}