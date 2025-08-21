'use client';

import { useState, useEffect } from 'react';
import { useFeatureFlag } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Brain, 
  Target, 
  Calendar, 
  Star, 
  Clock,
  CheckCircle,
  Play,
  Pause,
  Award,
  TrendingUp,
  Users,
  Sparkles,
  BookOpen,
  Activity,
  Lightbulb
} from 'lucide-react';

interface WellnessProgram {
  id: string;
  title: string;
  description: string;
  category: 'communication' | 'intimacy' | 'conflict_resolution' | 'shared_goals' | 'stress_management';
  duration: number; // in days
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  isActive: boolean;
  isCompleted: boolean;
  dailyActivities: Array<{
    day: number;
    title: string;
    description: string;
    isCompleted: boolean;
    timeRequired: number; // in minutes
    benefits: string[];
  }>;
  milestones: Array<{
    title: string;
    day: number;
    reward: string;
    isAchieved: boolean;
  }>;
  estimatedBenefits: string[];
  prerequisites?: string[];
}

export function WellnessPrograms() {
  const enabled = useFeatureFlag('wellness-programs');
  const [programs, setPrograms] = useState<WellnessProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProgram, setActiveProgram] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const fetchPrograms = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPrograms([
        {
          id: 'comm-mastery',
          title: 'Communication Mastery',
          description: 'Transform your communication patterns and build deeper understanding',
          category: 'communication',
          duration: 21,
          difficulty: 'intermediate',
          progress: 65,
          isActive: true,
          isCompleted: false,
          dailyActivities: [
            {
              day: 1,
              title: 'Active Listening Practice',
              description: 'Practice reflective listening with your partner for 15 minutes',
              isCompleted: true,
              timeRequired: 15,
              benefits: ['Improved understanding', 'Better empathy']
            },
            {
              day: 2,
              title: 'Expression Exercise',
              description: 'Share your feelings using "I" statements',
              isCompleted: true,
              timeRequired: 20,
              benefits: ['Clearer expression', 'Reduced conflict']
            },
            {
              day: 3,
              title: 'Non-verbal Awareness',
              description: 'Focus on body language and tone of voice',
              isCompleted: false,
              timeRequired: 15,
              benefits: ['Enhanced connection', 'Better understanding']
            }
          ],
          milestones: [
            { title: 'First Week Complete', day: 7, reward: '50 Lakshmi Coins', isAchieved: true },
            { title: 'Communication Pro', day: 14, reward: '100 Lakshmi Coins', isAchieved: false },
            { title: 'Mastery Achieved', day: 21, reward: 'Communication Badge', isAchieved: false }
          ],
          estimatedBenefits: [
            '85% improvement in communication clarity',
            '70% reduction in misunderstandings',
            '90% increase in emotional connection'
          ],
          prerequisites: ['Daily sync consistency']
        },
        {
          id: 'intimacy-deepening',
          title: 'Intimacy Deepening',
          description: 'Reignite passion and build deeper emotional and physical connection',
          category: 'intimacy',
          duration: 14,
          difficulty: 'beginner',
          progress: 30,
          isActive: false,
          isCompleted: false,
          dailyActivities: [
            {
              day: 1,
              title: 'Quality Time Setup',
              description: 'Create dedicated time for connection without distractions',
              isCompleted: false,
              timeRequired: 30,
              benefits: ['Dedicated connection time', 'Reduced stress']
            }
          ],
          milestones: [
            { title: 'Connection Starter', day: 3, reward: '30 Lakshmi Coins', isAchieved: false },
            { title: 'Intimacy Builder', day: 7, reward: '75 Lakshmi Coins', isAchieved: false },
            { title: 'Deep Connection', day: 14, reward: 'Intimacy Badge', isAchieved: false }
          ],
          estimatedBenefits: [
            '60% increase in emotional intimacy',
            '50% improvement in physical connection',
            '80% better relationship satisfaction'
          ]
        },
        {
          id: 'stress-management',
          title: 'Stress Management Together',
          description: 'Learn to manage stress as a team and support each other better',
          category: 'stress_management',
          duration: 28,
          difficulty: 'advanced',
          progress: 0,
          isActive: false,
          isCompleted: false,
          dailyActivities: [
            {
              day: 1,
              title: 'Stress Assessment',
              description: 'Identify individual and shared stress triggers',
              isCompleted: false,
              timeRequired: 25,
              benefits: ['Stress awareness', 'Better understanding']
            }
          ],
          milestones: [
            { title: 'Stress Awareness', day: 7, reward: '40 Lakshmi Coins', isAchieved: false },
            { title: 'Coping Strategies', day: 14, reward: '80 Lakshmi Coins', isAchieved: false },
            { title: 'Stress Masters', day: 28, reward: 'Wellness Badge', isAchieved: false }
          ],
          estimatedBenefits: [
            '75% reduction in stress-related conflicts',
            '90% better stress support',
            '85% improvement in overall well-being'
          ],
          prerequisites: ['Communication Mastery recommended']
        }
      ]);
      setLoading(false);
    };

    fetchPrograms();
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'communication':
        return { 
          name: 'Communication', 
          icon: Brain, 
          color: 'bg-blue-100 text-blue-700',
          borderColor: 'border-blue-200'
        };
      case 'intimacy':
        return { 
          name: 'Intimacy', 
          icon: Heart, 
          color: 'bg-pink-100 text-pink-700',
          borderColor: 'border-pink-200'
        };
      case 'conflict_resolution':
        return { 
          name: 'Conflict Resolution', 
          icon: Target, 
          color: 'bg-green-100 text-green-700',
          borderColor: 'border-green-200'
        };
      case 'shared_goals':
        return { 
          name: 'Shared Goals', 
          icon: Users, 
          color: 'bg-purple-100 text-purple-700',
          borderColor: 'border-purple-200'
        };
      case 'stress_management':
        return { 
          name: 'Stress Management', 
          icon: Activity, 
          color: 'bg-orange-100 text-orange-700',
          borderColor: 'border-orange-200'
        };
      default:
        return { 
          name: 'Wellness', 
          icon: Sparkles, 
          color: 'bg-gray-100 text-gray-700',
          borderColor: 'border-gray-200'
        };
    }
  };

  const getDifficultyInfo = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return { 
          name: 'Beginner', 
          color: 'bg-green-100 text-green-700',
          level: 1
        };
      case 'intermediate':
        return { 
          name: 'Intermediate', 
          color: 'bg-yellow-100 text-yellow-700',
          level: 2
        };
      case 'advanced':
        return { 
          name: 'Advanced', 
          color: 'bg-red-100 text-red-700',
          level: 3
        };
      default:
        return { 
          name: 'All Levels', 
          color: 'bg-gray-100 text-gray-700',
          level: 0
        };
    }
  };

  const toggleProgram = (programId: string) => {
    setPrograms(prev => prev.map(program => 
      program.id === programId 
        ? { ...program, isActive: !program.isActive }
        : { ...program, isActive: false }
    ));
    setActiveProgram(activeProgram === programId ? null : programId);
  };

  const completeActivity = (programId: string, day: number) => {
    setPrograms(prev => prev.map(program => {
      if (program.id === programId) {
        const updatedActivities = program.dailyActivities.map(activity =>
          activity.day === day ? { ...activity, isCompleted: true } : activity
        );
        const completedCount = updatedActivities.filter(a => a.isCompleted).length;
        const newProgress = (completedCount / updatedActivities.length) * 100;
        
        return {
          ...program,
          dailyActivities: updatedActivities,
          progress: newProgress
        };
      }
      return program;
    }));
  };

  const filteredPrograms = selectedCategory === 'all' 
    ? programs 
    : programs.filter(program => program.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Wellness Programs</h2>
          <p className="text-gray-600">Personalized programs to strengthen your relationship</p>
        </div>
        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          <Award className="w-3 h-3 mr-1" />
          {programs.filter(p => p.isCompleted).length} Completed
        </Badge>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'communication', 'intimacy', 'conflict_resolution', 'shared_goals', 'stress_management'].map((category) => {
          const info = getCategoryInfo(category);
          const Icon = info.icon;
          return (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Icon className="w-4 h-4" />
              {category === 'all' ? 'All Programs' : info.name}
            </Button>
          );
        })}
      </div>

      <Tabs defaultValue="programs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="programs">Available Programs</TabsTrigger>
          <TabsTrigger value="active">Active Program</TabsTrigger>
          <TabsTrigger value="progress">Your Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-4">
          <div className="grid gap-4">
            {filteredPrograms.map((program) => {
              const categoryInfo = getCategoryInfo(program.category);
              const difficultyInfo = getDifficultyInfo(program.difficulty);
              const Icon = categoryInfo.icon;

              return (
                <Card key={program.id} className={`transition-all duration-300 hover:shadow-lg ${program.isActive ? 'ring-2 ring-purple-500' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{program.title}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{program.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={difficultyInfo.color}>
                          {difficultyInfo.name}
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {program.duration} days
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress */}
                      {program.progress > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm text-gray-600">{Math.round(program.progress)}%</span>
                          </div>
                          <Progress value={program.progress} className="h-2" />
                        </div>
                      )}

                      {/* Benefits */}
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Expected Benefits
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {program.estimatedBenefits.slice(0, 3).map((benefit, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Prerequisites */}
                      {program.prerequisites && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Prerequisites
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {program.prerequisites.map((prereq, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {prereq}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => toggleProgram(program.id)}
                          className="flex-1"
                          variant={program.isActive ? 'outline' : 'default'}
                        >
                          {program.isActive ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Start Program
                            </>
                          )}
                        </Button>
                        {program.progress > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveProgram(program.id)}
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {programs.find(p => p.isActive) ? (
            <div className="space-y-6">
              {programs.filter(p => p.isActive).map((program) => (
                <div key={program.id} className="space-y-4">
                  {/* Program Header */}
                  <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{program.title}</h3>
                          <p className="text-purple-100">{program.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{Math.round(program.progress)}%</div>
                          <div className="text-sm text-purple-100">Complete</div>
                        </div>
                      </div>
                      <Progress value={program.progress} className="h-3 bg-white/20" />
                    </CardContent>
                  </Card>

                  {/* Today's Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Today's Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {program.dailyActivities.find(a => !a.isCompleted) ? (
                        <div className="space-y-4">
                          {program.dailyActivities
                            .filter(a => !a.isCompleted)
                            .slice(0, 1)
                            .map((activity) => (
                              <div key={activity.day} className="p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                  </div>
                                  <Badge variant="outline">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {activity.timeRequired} min
                                  </Badge>
                                </div>
                                <div className="space-y-2">
                                  <h5 className="text-sm font-medium text-gray-700">Benefits:</h5>
                                  <div className="flex flex-wrap gap-1">
                                    {activity.benefits.map((benefit, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {benefit}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <Button
                                  onClick={() => completeActivity(program.id, activity.day)}
                                  className="w-full mt-4"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Mark Complete
                                </Button>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                          <h4 className="text-lg font-medium text-gray-900 mb-2">Program Complete!</h4>
                          <p className="text-gray-600">Congratulations on finishing this wellness program!</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Upcoming Milestones */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Upcoming Milestones
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {program.milestones
                          .filter(m => !m.isAchieved)
                          .slice(0, 3)
                          .map((milestone) => (
                            <div key={milestone.title} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                              <div>
                                <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                                <p className="text-sm text-gray-600">Day {milestone.day}</p>
                              </div>
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                                {milestone.reward}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Program</h3>
                  <p className="text-gray-600 mb-4">Start a wellness program to begin your journey</p>
                  <Button onClick={() => setSelectedCategory('all')}>
                    Browse Programs
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid gap-6">
            {/* Overall Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Your Wellness Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {programs.filter(p => p.isCompleted).length}
                    </div>
                    <div className="text-sm text-gray-600">Programs Completed</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {programs.filter(p => p.isActive).length}
                    </div>
                    <div className="text-sm text-gray-600">Active Programs</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {programs.reduce((sum, p) => sum + p.progress, 0) / programs.length || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Average Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completed Programs */}
            {programs.filter(p => p.isCompleted).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    Completed Programs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {programs
                      .filter(p => p.isCompleted)
                      .map((program) => {
                        const categoryInfo = getCategoryInfo(program.category);
                        const Icon = categoryInfo.icon;
                        
                        return (
                          <div key={program.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{program.title}</h4>
                                <p className="text-sm text-gray-600">{categoryInfo.name}</p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-yellow-50 rounded-lg text-center">
                    <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900">First Steps</h4>
                    <p className="text-sm text-gray-600">Completed your first activity</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <Brain className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900">Communication Pro</h4>
                    <p className="text-sm text-gray-600">7 days of consistent practice</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}