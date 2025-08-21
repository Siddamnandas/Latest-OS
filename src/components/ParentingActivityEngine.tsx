'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Baby, 
  Heart, 
  Star, 
  Clock, 
  Target,
  Award,
  Sparkles,
  Crown,
  Zap,
  Users,
  BookOpen,
  Palette,
  Music,
  TreePine
} from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string;
  day: number;
  category: 'bonding' | 'learning' | 'creativity' | 'wellness';
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  coins: number;
  completed: boolean;
  completedBy?: string;
  materials?: string[];
  benefits: string[];
}

export function ParentingActivityEngine() {
  const [currentDay, setCurrentDay] = useState(3);
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      title: 'Family Story Time',
      description: 'Gather for a magical storytelling session that brings everyone together',
      day: 1,
      category: 'bonding',
      duration: 30,
      difficulty: 'easy',
      coins: 30,
      completed: true,
      completedBy: 'both',
      materials: ['Story book', 'Comfortable seating'],
      benefits: ['Strengthens family bonds', 'Improves listening skills', 'Sparks imagination']
    },
    {
      id: '2',
      title: 'Nature Explorer',
      description: 'Discover the wonders of nature with an exciting outdoor adventure',
      day: 2,
      category: 'wellness',
      duration: 45,
      difficulty: 'medium',
      coins: 40,
      completed: true,
      completedBy: 'partner1',
      materials: ['Magnifying glass', 'Notebook', 'Water bottles'],
      benefits: ['Physical activity', 'Environmental awareness', 'Curiosity development']
    },
    {
      id: '3',
      title: 'Creative Art Session',
      description: 'Express creativity through collaborative art projects',
      day: 3,
      category: 'creativity',
      duration: 60,
      difficulty: 'medium',
      coins: 50,
      completed: false,
      materials: ['Art supplies', 'Paper', 'Aprons'],
      benefits: ['Self-expression', 'Fine motor skills', 'Collaboration']
    },
    {
      id: '4',
      title: 'Math Games',
      description: 'Make learning fun with engaging mathematical games',
      day: 4,
      category: 'learning',
      duration: 30,
      difficulty: 'easy',
      coins: 35,
      completed: false,
      materials: ['Game pieces', 'Counting objects'],
      benefits: ['Numeracy skills', 'Problem-solving', 'Critical thinking']
    },
    {
      id: '5',
      title: 'Family Dance Party',
      description: 'Get moving and grooving with a fun family dance session',
      day: 5,
      category: 'wellness',
      duration: 25,
      difficulty: 'easy',
      coins: 25,
      completed: false,
      materials: ['Music player', 'Fun playlist'],
      benefits: ['Physical exercise', 'Coordination', 'Joy and laughter']
    },
    {
      id: '6',
      title: 'Cooking Together',
      description: 'Learn valuable life skills while preparing a meal as a family',
      day: 6,
      category: 'learning',
      duration: 90,
      difficulty: 'hard',
      coins: 60,
      completed: false,
      materials: ['Ingredients', 'Kitchen tools', 'Recipe'],
      benefits: ['Life skills', 'Nutrition awareness', 'Teamwork']
    }
  ]);

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'bonding':
        return { 
          name: 'Bonding', 
          icon: Heart, 
          color: 'from-pink-500 to-rose-500',
          bgColor: 'bg-pink-50',
          textColor: 'text-pink-700',
          emoji: '❤️'
        };
      case 'learning':
        return { 
          name: 'Learning', 
          icon: BookOpen, 
          color: 'from-blue-500 to-cyan-500',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          emoji: '📚'
        };
      case 'creativity':
        return { 
          name: 'Creativity', 
          icon: Palette, 
          color: 'from-purple-500 to-violet-500',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-700',
          emoji: '🎨'
        };
      case 'wellness':
        return { 
          name: 'Wellness', 
          icon: TreePine, 
          color: 'from-green-500 to-emerald-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          emoji: '🌳'
        };
      default:
        return { 
          name: 'Activity', 
          icon: Star, 
          color: 'from-gray-500 to-slate-500',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          emoji: '⭐'
        };
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const completedActivities = activities.filter(a => a.completed).length;
  const totalActivities = activities.length;
  const completionRate = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;
  const dayProgress = (currentDay / 6) * 100;

  const completeActivity = (activityId: string) => {
    setActivities(prev => prev.map(activity => 
      activity.id === activityId 
        ? { ...activity, completed: true, completedBy: 'both' }
        : activity
    ));
  };

  const getDayActivities = (day: number) => {
    return activities.filter(a => a.day === day);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header with stats */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-teal-600 to-green-600 p-6 shadow-xl">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Family Adventures</h1>
              <p className="text-white/80 text-sm">6-day journey of family bonding</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center bg-white/20 backdrop-blur-lg rounded-xl p-3 min-w-[80px]">
                <div className="flex items-center gap-1">
                  <Target className="w-5 h-5 text-white" />
                  <span className="text-xl font-bold text-white">{currentDay}/6</span>
                </div>
                <span className="text-xs text-white/80">Day</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/90 font-medium">
                Day {currentDay} of 6-day journey
              </span>
              <span className="text-sm text-white/90">{dayProgress.toFixed(0)}%</span>
            </div>
            <Progress value={dayProgress} className="h-2 bg-white/30" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-lg rounded-2xl">
          <div className="p-3 text-center">
            <Baby className="w-6 h-6 mx-auto mb-1" />
            <p className="text-2xl font-bold">{completedActivities}</p>
            <p className="text-xs opacity-90">Completed</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0 shadow-lg rounded-2xl">
          <div className="p-3 text-center">
            <Users className="w-6 h-6 mx-auto mb-1" />
            <p className="text-2xl font-bold">4</p>
            <p className="text-xs opacity-90">Family Members</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg rounded-2xl">
          <div className="p-3 text-center">
            <Award className="w-6 h-6 mx-auto mb-1" />
            <p className="text-2xl font-bold">280</p>
            <p className="text-xs opacity-90">Coins Earned</p>
          </div>
        </div>
      </div>

      {/* Day Selector */}
      <div className="bg-white/90 backdrop-blur-lg border border-white/50 shadow-lg rounded-2xl">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Choose Your Day
          </h3>
          <div className="grid grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((day) => {
              const dayActivities = getDayActivities(day);
              const completedCount = dayActivities.filter(a => a.completed).length;
              const totalCount = dayActivities.length;
              const isCurrentDay = day === currentDay;
              
              return (
                <button
                  key={day}
                  onClick={() => setCurrentDay(day)}
                  className={`
                    relative p-3 rounded-xl border-2 transition-all duration-300
                    ${isCurrentDay 
                      ? 'border-purple-500 bg-purple-50 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">Day {day}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {completedCount}/{totalCount}
                    </div>
                    {completedCount === totalCount && totalCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <Star className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Current Day Activities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Day {currentDay} Activities
          </h3>
          <Badge className="bg-purple-100 text-purple-700">
            {getDayActivities(currentDay).length} activities
          </Badge>
        </div>

        {getDayActivities(currentDay).map((activity) => {
          const categoryInfo = getCategoryInfo(activity.category);
          const Icon = categoryInfo.icon;
          
          return (
            <div 
              key={activity.id} 
              className={`bg-white/90 backdrop-blur-lg border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl ${
                activity.completed ? 'ring-2 ring-green-400' : ''
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryInfo.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                        {activity.completed && (
                          <Badge className="bg-green-100 text-green-700">
                            <Star className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                      
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge className={getDifficultyColor(activity.difficulty)}>
                          {activity.difficulty}
                        </Badge>
                        <Badge variant="outline" className="border-gray-300 text-gray-600">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.duration}min
                        </Badge>
                        <Badge className="bg-yellow-100 text-yellow-700">
                          <Crown className="w-3 h-3 mr-1" />
                          +{activity.coins} coins
                        </Badge>
                      </div>
                      
                      {activity.materials && activity.materials.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-gray-700 mb-1">Materials needed:</p>
                          <div className="flex flex-wrap gap-1">
                            {activity.materials.map((material, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {material}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Benefits:</p>
                        <div className="flex flex-wrap gap-1">
                          {activity.benefits.map((benefit, index) => (
                            <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {!activity.completed && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Details
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => completeActivity(activity.id)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      Start Activity
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 rounded-2xl">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-600" />
            Journey Progress
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Overall Completion</span>
              <span className="text-sm font-medium text-gray-900">{completionRate.toFixed(0)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{completedActivities}</div>
                <div className="text-xs text-gray-600">Activities Done</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{totalActivities - completedActivities}</div>
                <div className="text-xs text-gray-600">Remaining</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}