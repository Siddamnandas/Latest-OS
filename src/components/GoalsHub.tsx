'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Calendar, TrendingUp, Award, Plus, CheckCircle, Clock } from 'lucide-react';

export function GoalsHub() {
  const [activeTab, setActiveTab] = useState('couple');
  
  // Mock data for couple goals
  const coupleGoals = [
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
  
  // Mock data for family goals
  const familyGoals = [
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
  
  // Mock data for personal goals
  const personalGoals = [
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
  
  const getGoalsByType = (type: string) => {
    switch (type) {
      case 'couple': return coupleGoals;
      case 'family': return familyGoals;
      case 'personal': return personalGoals;
      default: return [];
    }
  };
  
  const currentGoals = getGoalsByType(activeTab);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Goals</h1>
          <p className="text-gray-600">Track and achieve your family's dreams</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
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
                      {milestone.completed ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={milestone.completed ? 'text-gray-500 line-through' : 'text-gray-700'}>
                        {milestone.title}
                      </span>
                    </div>
                  ))}
                </div>
                
                {!goal.completed && (
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Update Progress
                    </Button>
                    <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                      View Details
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {currentGoals.length === 0 && (
            <Card className="w-full">
              <CardContent className="p-8 text-center">
                <Target className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No goals yet</h3>
                <p className="text-gray-600 mb-4">Create your first goal to get started</p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Goal
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
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
              <div className="text-2xl font-bold text-purple-600">7</div>
              <div className="text-sm text-gray-600">Active Goals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-600">Completed This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">68%</div>
              <div className="text-sm text-gray-600">Average Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}