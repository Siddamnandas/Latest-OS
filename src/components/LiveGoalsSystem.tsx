'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { logger } from '@/lib/logger';
import { 
  Target, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Plus,
  Award,
  Heart,
  MessageCircle,
  Clock,
  Star
} from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'communication' | 'intimacy' | 'quality_time' | 'personal_growth' | 'family';
  progress: number;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  milestones: Milestone[];
  isCompleted: boolean;
  coins: number;
}

interface Milestone {
  id: string;
  title: string;
  isCompleted: boolean;
  completedAt?: string;
}

export function LiveGoalsSystem() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const sampleGoals: Goal[] = [
        {
          id: '1',
          title: 'Communication Growth',
          description: 'Improve daily communication and active listening',
          category: 'communication',
          progress: 75,
          targetValue: 30,
          currentValue: 22,
          unit: 'meaningful conversations',
          deadline: '2025-09-15',
          priority: 'high',
          coins: 100,
          isCompleted: false,
          milestones: [
            { id: '1a', title: 'Learn active listening techniques', isCompleted: true, completedAt: '2025-08-01' },
            { id: '1b', title: 'Practice daily check-ins', isCompleted: true, completedAt: '2025-08-10' },
            { id: '1c', title: 'Resolve conflicts peacefully', isCompleted: false }
          ]
        },
        {
          id: '2',
          title: 'Quality Time Together',
          description: 'Spend dedicated quality time without distractions',
          category: 'quality_time',
          progress: 60,
          targetValue: 20,
          currentValue: 12,
          unit: 'hours per week',
          deadline: '2025-12-31',
          priority: 'high',
          coins: 150,
          isCompleted: false,
          milestones: [
            { id: '2a', title: 'Plan weekly date nights', isCompleted: true, completedAt: '2025-08-05' },
            { id: '2b', title: 'Create tech-free zones', isCompleted: false },
            { id: '2c', title: 'Try new activities together', isCompleted: false }
          ]
        },
        {
          id: '3',
          title: 'Intimacy & Connection',
          description: 'Deepen emotional and physical intimacy',
          category: 'intimacy',
          progress: 85,
          targetValue: 50,
          currentValue: 42,
          unit: 'connection moments',
          deadline: '2025-10-30',
          priority: 'medium',
          coins: 200,
          isCompleted: false,
          milestones: [
            { id: '3a', title: 'Practice daily affirmations', isCompleted: true, completedAt: '2025-07-20' },
            { id: '3b', title: 'Create intimacy rituals', isCompleted: true, completedAt: '2025-08-15' },
            { id: '3c', title: 'Express gratitude daily', isCompleted: true, completedAt: '2025-08-20' }
          ]
        },
        {
          id: '4',
          title: 'Personal Growth',
          description: 'Support each other\'s individual development',
          category: 'personal_growth',
          progress: 40,
          targetValue: 10,
          currentValue: 4,
          unit: 'growth activities',
          deadline: '2025-11-30',
          priority: 'medium',
          coins: 120,
          isCompleted: false,
          milestones: [
            { id: '4a', title: 'Read relationship books together', isCompleted: true, completedAt: '2025-08-12' },
            { id: '4b', title: 'Attend workshops or seminars', isCompleted: false },
            { id: '4c', title: 'Practice meditation together', isCompleted: false }
          ]
        },
        {
          id: '5',
          title: 'Family Harmony',
          description: 'Create a loving and supportive family environment',
          category: 'family',
          progress: 90,
          targetValue: 15,
          currentValue: 13,
          unit: 'family activities',
          deadline: '2025-12-25',
          priority: 'high',
          coins: 250,
          isCompleted: false,
          milestones: [
            { id: '5a', title: 'Establish family traditions', isCompleted: true, completedAt: '2025-07-30' },
            { id: '5b', title: 'Plan regular family outings', isCompleted: true, completedAt: '2025-08-18' },
            { id: '5c', title: 'Create memory projects', isCompleted: true, completedAt: '2025-08-21' }
          ]
        }
      ];
      
      setGoals(sampleGoals);
      setLoading(false);
    } catch (error) {
      logger.error('Error fetching goals:', error);
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'communication':
        return <MessageCircle className="w-5 h-5" />;
      case 'intimacy':
        return <Heart className="w-5 h-5" />;
      case 'quality_time':
        return <Clock className="w-5 h-5" />;
      case 'personal_growth':
        return <TrendingUp className="w-5 h-5" />;
      case 'family':
        return <Award className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'communication':
        return 'from-blue-500 to-cyan-500';
      case 'intimacy':
        return 'from-pink-500 to-rose-500';
      case 'quality_time':
        return 'from-purple-500 to-violet-500';
      case 'personal_growth':
        return 'from-green-500 to-emerald-500';
      case 'family':
        return 'from-orange-500 to-amber-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const categories = [
    { id: 'all', name: 'All Goals', count: goals.length },
    { id: 'communication', name: 'Communication', count: goals.filter(g => g.category === 'communication').length },
    { id: 'intimacy', name: 'Intimacy', count: goals.filter(g => g.category === 'intimacy').length },
    { id: 'quality_time', name: 'Quality Time', count: goals.filter(g => g.category === 'quality_time').length },
    { id: 'personal_growth', name: 'Growth', count: goals.filter(g => g.category === 'personal_growth').length },
    { id: 'family', name: 'Family', count: goals.filter(g => g.category === 'family').length }
  ];

  const filteredGoals = selectedCategory === 'all' 
    ? goals 
    : goals.filter(goal => goal.category === selectedCategory);

  const overallProgress = Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length);
  const completedGoals = goals.filter(g => g.isCompleted).length;

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading goals...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Relationship Goals 🎯</h2>
            <p className="text-white/80">Track your journey together</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{overallProgress}%</div>
            <div className="text-sm text-white/80">Overall Progress</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-xl font-bold">{goals.length}</div>
            <div className="text-xs text-white/80">Active Goals</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-xl font-bold">{completedGoals}</div>
            <div className="text-xs text-white/80">Completed</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-xl font-bold">{goals.reduce((sum, g) => sum + g.coins, 0)}</div>
            <div className="text-xs text-white/80">Total Coins</div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="whitespace-nowrap"
          >
            {category.name} ({category.count})
          </Button>
        ))}
      </div>

      {/* Add Goal Button */}
      <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
        <Plus className="w-4 h-4 mr-2" />
        Add New Goal
      </Button>

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.map((goal) => (
          <div
            key={goal.id}
            className="bg-white/90 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getCategoryColor(goal.category)} flex items-center justify-center text-white shadow-lg`}>
                  {getCategoryIcon(goal.category)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{goal.title}</h3>
                  <p className="text-sm text-gray-600">{goal.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${getPriorityColor(goal.priority)}`}>
                  {goal.priority}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-yellow-600">
                  <Star className="w-3 h-3" />
                  <span>{goal.coins}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">
                  {goal.currentValue}/{goal.targetValue} {goal.unit}
                </span>
              </div>
              <Progress value={goal.progress} className="h-3" />
              <div className="text-right mt-1">
                <span className="text-sm font-bold text-gray-900">{goal.progress}%</span>
              </div>
            </div>

            {/* Milestones */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Milestones</h4>
              <div className="space-y-2">
                {goal.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center gap-2">
                    <CheckCircle 
                      className={`w-4 h-4 ${
                        milestone.isCompleted ? 'text-green-600' : 'text-gray-300'
                      }`} 
                    />
                    <span className={`text-sm ${
                      milestone.isCompleted ? 'text-gray-900 line-through' : 'text-gray-700'
                    }`}>
                      {milestone.title}
                    </span>
                    {milestone.completedAt && (
                      <span className="text-xs text-green-600">
                        ✓ {new Date(milestone.completedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
              </div>
              
              <Button 
                size="sm"
                className={`bg-gradient-to-r ${getCategoryColor(goal.category)} hover:opacity-90 text-white`}
              >
                Update Progress
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center">
        <Award className="w-8 h-8 text-green-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-green-900 mb-2">Keep Growing Together! 🌱</h3>
        <p className="text-green-700">
          You're {overallProgress}% of the way to achieving your relationship goals. 
          Every small step brings you closer to a stronger bond.
        </p>
      </div>
    </div>
  );
}