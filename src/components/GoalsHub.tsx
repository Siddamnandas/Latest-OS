'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Target, Calendar, TrendingUp, Award, Plus, CheckCircle, Clock, Edit, Trash2, Star } from 'lucide-react';
import { ArchetypalHealthCard } from '@/components/ArchetypalHealthCard';
import { useToast } from '@/hooks/use-toast';

interface Goal {
  id: number;
  title: string;
  description: string;
  category: string;
  progress: number;
  targetDate: string;
  completed: boolean;
  milestones: Array<{
    id: number;
    title: string;
    completed: boolean;
  }>;
}

interface NewGoal {
  title: string;
  description: string;
  category: string;
  targetDate: string;
  milestones: string[];
}

export function GoalsHub() {
  const [activeTab, setActiveTab] = useState('couple');
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [showGoalDetails, setShowGoalDetails] = useState<number | null>(null);
  const [newGoal, setNewGoal] = useState<NewGoal>({
    title: '',
    description: '',
    category: '',
    targetDate: '',
    milestones: ['']
  });
  const [goals, setGoals] = useState<{
    couple: Goal[];
    family: Goal[];
    personal: Goal[];
  }>({} as any);
  const { toast } = useToast();
  
  // Initialize goals data
  useState(() => {
    const coupleGoals: Goal[] = [
      {
        id: 1,
        title: 'Weekly Date Night',
        description: 'Plan a special date night every week',
        category: 'romance',
        progress: 75,
        targetDate: '2024-01-31',
        completed: false,
        milestones: [
          { id: 1, title: 'Research date ideas', completed: true },
          { id: 2, title: 'Book venue', completed: true },
          { id: 3, title: 'Plan activities', completed: false },
        ]
      },
      {
        id: 2,
        title: 'Financial Planning',
        description: 'Create a joint financial plan for the year',
        category: 'finance',
        progress: 40,
        targetDate: '2024-02-15',
        completed: false,
        milestones: [
          { id: 1, title: 'Review current finances', completed: true },
          { id: 2, title: 'Set savings goals', completed: false },
          { id: 3, title: 'Create budget', completed: false },
        ]
      },
      {
        id: 3,
        title: 'Home Improvement',
        description: 'Renovate the living room',
        category: 'home',
        progress: 20,
        targetDate: '2024-03-30',
        completed: false,
        milestones: [
          { id: 1, title: 'Design planning', completed: true },
          { id: 2, title: 'Get quotes', completed: false },
          { id: 3, title: 'Start renovation', completed: false },
        ]
      }
    ];
    
    const familyGoals: Goal[] = [
      {
        id: 1,
        title: 'Family Vacation',
        description: 'Plan and go on a family vacation',
        category: 'travel',
        progress: 60,
        targetDate: '2024-04-15',
        completed: false,
        milestones: [
          { id: 1, title: 'Choose destination', completed: true },
          { id: 2, title: 'Book flights', completed: true },
          { id: 3, title: 'Plan itinerary', completed: false },
        ]
      },
      {
        id: 2,
        title: 'Home Garden',
        description: 'Create a family garden project',
        category: 'home',
        progress: 30,
        targetDate: '2024-05-01',
        completed: false,
        milestones: [
          { id: 1, title: 'Design garden layout', completed: true },
          { id: 2, title: 'Prepare soil', completed: false },
          { id: 3, title: 'Plant seeds', completed: false },
        ]
      }
    ];
    
    const personalGoals: Goal[] = [
      {
        id: 1,
        title: 'Learn New Skill',
        description: 'Complete an online course',
        category: 'personal',
        progress: 80,
        targetDate: '2024-02-28',
        completed: false,
        milestones: [
          { id: 1, title: 'Choose course', completed: true },
          { id: 2, title: 'Complete modules 1-5', completed: true },
          { id: 3, title: 'Final project', completed: false },
        ]
      },
      {
        id: 2,
        title: 'Health & Fitness',
        description: 'Achieve personal fitness goals',
        category: 'health',
        progress: 50,
        targetDate: '2024-06-30',
        completed: false,
        milestones: [
          { id: 1, title: 'Join gym', completed: true },
          { id: 2, title: 'Create workout plan', completed: true },
          { id: 3, title: '3 months consistent', completed: false },
        ]
      }
    ];

    setGoals({ couple: coupleGoals, family: familyGoals, personal: personalGoals });
    return goals;
  });

  // Create new goal function
  const createGoal = () => {
    if (!newGoal.title || !newGoal.description || !newGoal.category || !newGoal.targetDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const goalToAdd: Goal = {
      id: Date.now(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      progress: 0,
      targetDate: newGoal.targetDate,
      completed: false,
      milestones: newGoal.milestones.filter(m => m.trim()).map((m, index) => ({
        id: index + 1,
        title: m,
        completed: false
      }))
    };

    setGoals(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab as keyof typeof prev], goalToAdd]
    }));

    // Reset form
    setNewGoal({
      title: '',
      description: '',
      category: '',
      targetDate: '',
      milestones: ['']
    });
    setShowNewGoalModal(false);

    toast({
      title: "Goal Created! 🎯",
      description: `${goalToAdd.title} has been added to your ${activeTab} goals`,
    });
  };

  // Toggle milestone completion
  const toggleMilestone = (goalId: number, milestoneId: number) => {
    setGoals(prev => ({
      ...prev,
      [activeTab]: prev[activeTab as keyof typeof prev].map(goal => {
        if (goal.id === goalId) {
          const updatedMilestones = goal.milestones.map(milestone => 
            milestone.id === milestoneId 
              ? { ...milestone, completed: !milestone.completed }
              : milestone
          );
          
          // Update progress based on completed milestones
          const completedCount = updatedMilestones.filter(m => m.completed).length;
          const progress = Math.round((completedCount / updatedMilestones.length) * 100);
          
          return {
            ...goal,
            milestones: updatedMilestones,
            progress,
            completed: progress === 100
          };
        }
        return goal;
      })
    }));

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }

    toast({
      title: "Milestone Updated! ✅",
      description: "Great progress on your goal!",
    });
  };

  // Update goal progress manually
  const updateProgress = (goalId: number, newProgress: number) => {
    setGoals(prev => ({
      ...prev,
      [activeTab]: prev[activeTab as keyof typeof prev].map(goal => 
        goal.id === goalId 
          ? { ...goal, progress: newProgress, completed: newProgress === 100 }
          : goal
      )
    }));

    toast({
      title: "Progress Updated! 📈",
      description: `Goal progress updated to ${newProgress}%`,
    });
  };

  // Add new milestone to existing goal
  const addMilestone = (goalId: number, milestoneTitle: string) => {
    if (!milestoneTitle.trim()) return;

    setGoals(prev => ({
      ...prev,
      [activeTab]: prev[activeTab as keyof typeof prev].map(goal => {
        if (goal.id === goalId) {
          const newMilestone = {
            id: Math.max(...goal.milestones.map(m => m.id), 0) + 1,
            title: milestoneTitle,
            completed: false
          };
          return {
            ...goal,
            milestones: [...goal.milestones, newMilestone]
          };
        }
        return goal;
      })
    }));

    toast({
      title: "Milestone Added! 🎯",
      description: "New milestone added to your goal",
    });
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'romance': return '💕';
      case 'finance': return '💰';
      case 'home': return '🏠';
      case 'travel': return '✈️';
      case 'personal': return '📚';
      case 'health': return '💪';
      default: return '🎯';
    }
  };
  
  const getGoalsByType = (type: string): Goal[] => {
    return goals[type as keyof typeof goals] || [];
  };
  
  const currentGoals = getGoalsByType(activeTab);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Goals 🎯</h1>
          <p className="text-gray-600">Track and achieve your family's dreams</p>
        </div>
        <Dialog open={showNewGoalModal} onOpenChange={setShowNewGoalModal}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter goal title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your goal"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={newGoal.category} onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="romance">Romance 💕</SelectItem>
                      <SelectItem value="finance">Finance 💰</SelectItem>
                      <SelectItem value="home">Home 🏠</SelectItem>
                      <SelectItem value="travel">Travel ✈️</SelectItem>
                      <SelectItem value="personal">Personal 📚</SelectItem>
                      <SelectItem value="health">Health 💪</SelectItem>
                      <SelectItem value="family">Family 👨‍👩‍👧‍👦</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetDate">Target Date *</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Milestones</Label>
                {newGoal.milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Milestone ${index + 1}`}
                      value={milestone}
                      onChange={(e) => {
                        const updated = [...newGoal.milestones];
                        updated[index] = e.target.value;
                        setNewGoal(prev => ({ ...prev, milestones: updated }));
                      }}
                    />
                    {index === newGoal.milestones.length - 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setNewGoal(prev => ({ ...prev, milestones: [...prev.milestones, ''] }))}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowNewGoalModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={createGoal} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Create Goal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="couple">Couple Goals</TabsTrigger>
          <TabsTrigger value="family">Family Goals</TabsTrigger>
          <TabsTrigger value="personal">Personal Goals</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {currentGoals.map((goal) => (
            <Card key={goal.id} className="w-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getCategoryIcon(goal.category)}</span>
                    <div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                  </div>
                  {goal.completed && (
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Target: {new Date(goal.targetDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {goal.milestones.filter(m => m.completed).length}/{goal.milestones.length} milestones
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Milestones:</h4>
                  {goal.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center gap-2 text-sm">
                      <button
                        onClick={() => toggleMilestone(goal.id, milestone.id)}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          milestone.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-purple-400'
                        }`}
                      >
                        {milestone.completed && <CheckCircle className="w-3 h-3" />}
                      </button>
                      <span className={milestone.completed ? 'text-gray-500 line-through' : 'text-gray-700'}>
                        {milestone.title}
                      </span>
                    </div>
                  ))}
                </div>
                
                {!goal.completed && (
                  <div className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-4 h-4 mr-1" />
                          Update Progress
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Progress: {goal.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Current Progress: {goal.progress}%</Label>
                            <Progress value={goal.progress} className="h-3" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newProgress">New Progress (%)</Label>
                            <Input
                              id="newProgress"
                              type="number"
                              min="0"
                              max="100"
                              defaultValue={goal.progress}
                              onBlur={(e) => {
                                const newProgress = parseInt(e.target.value);
                                if (newProgress >= 0 && newProgress <= 100) {
                                  updateProgress(goal.id, newProgress);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog open={showGoalDetails === goal.id} onOpenChange={(open) => setShowGoalDetails(open ? goal.id : null)}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                          <Star className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <span className="text-xl">{getCategoryIcon(goal.category)}</span>
                            {goal.title}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-700">{goal.description}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Progress</Label>
                              <div className="flex items-center gap-2">
                                <Progress value={goal.progress} className="flex-1 h-3" />
                                <span className="text-sm font-medium">{goal.progress}%</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Target Date</Label>
                              <p className="text-sm text-gray-600">{new Date(goal.targetDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Milestones ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length} completed)</Label>
                            <div className="space-y-2">
                              {goal.milestones.map((milestone) => (
                                <div key={milestone.id} className="flex items-center gap-3 p-2 border rounded-lg">
                                  <button
                                    onClick={() => toggleMilestone(goal.id, milestone.id)}
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                      milestone.completed
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : 'border-gray-300 hover:border-purple-400'
                                    }`}
                                  >
                                    {milestone.completed && <CheckCircle className="w-3 h-3" />}
                                  </button>
                                  <span className={`flex-1 ${
                                    milestone.completed ? 'text-gray-500 line-through' : 'text-gray-700'
                                  }`}>
                                    {milestone.title}
                                  </span>
                                  {milestone.completed && (
                                    <Badge className="bg-green-100 text-green-700 text-xs">
                                      ✓ Done
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t">
                            <Button 
                              onClick={() => setShowGoalDetails(null)} 
                              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                              Close Details
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {currentGoals.length === 0 && (
            <Card className="w-full">
              <CardContent className="p-8 text-center">
                <Target className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No {activeTab} goals yet</h3>
                <p className="text-gray-600 mb-4">Create your first {activeTab} goal to get started on your journey</p>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  onClick={() => setShowNewGoalModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Goal
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Archetypal Goal Insights */}
      <div className="space-y-4">
        <ArchetypalHealthCard
          balance={{ krishna: 65, ram: 45, shiva: 30 }}
          compact={true}
          onRebalance={() => {
            toast({
              title: 'Archetypal Goal Suggestions',
              description: 'Create goals aligned with your archetypal balance',
            });
          }}
        />

        {/* Archetypal Goal Suggestions */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-600" />
              Archetypal Goal Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">💙</span>
                  <span className="font-medium text-blue-700">Krishna Goals</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">Enhance playful love</p>
                <Button
                  size="sm"
                  className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700"
                  onClick={() => setShowNewGoalModal(true)}
                >
                  + Plan Adventure
                </Button>
              </div>

              <div className="p-3 bg-white rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🤝</span>
                  <span className="font-medium text-yellow-700">Ram Goals</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">Strengthen partnership</p>
                <Button
                  size="sm"
                  className="w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                  onClick={() => setShowNewGoalModal(true)}
                >
                  + Family Project
                </Button>
              </div>

              <div className="p-3 bg-white rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🧘</span>
                  <span className="font-medium text-purple-700">Shiva Goals</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">Cultivate inner peace</p>
                <Button
                  size="sm"
                  className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700"
                  onClick={() => setShowNewGoalModal(true)}
                >
                  + Solo Practice
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goal Insights */}
      <Card className="w-full bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            Goal Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Object.values(goals).flat().length}
              </div>
              <div className="text-sm text-gray-600">Total Goals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(goals).flat().filter(g => g.completed).length}
              </div>
              <div className="text-sm text-gray-600">Completed Goals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Object.values(goals).flat().length > 0 
                  ? Math.round(Object.values(goals).flat().reduce((sum, g) => sum + g.progress, 0) / Object.values(goals).flat().length)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600">Average Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
