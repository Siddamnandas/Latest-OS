'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle,
  Clock,
  User,
  Plus,
  Filter,
  Target,
  Star,
  Zap,
  Crown,
  Award,
  BarChart3,
  Brain,
  Sparkles,
  TrendingUp,
  Calendar,
  Shuffle,
  RefreshCw
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: 'partner1' | 'partner2' | 'both';
  category: string;
  priority: 'low' | 'medium' | 'high';
  estimatedTime: number;
  coins: number;
  completed: boolean;
  createdAt: string;
  archetypalAffinity?: 'krishna' | 'ram' | 'shiva';
  archetypalTags?: string[];
  suggestedBy?: 'user' | 'archetypal-ai';
}

export function TaskManagement() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Plan weekend getaway',
      description: 'Research and book a romantic weekend destination',
      assignedTo: 'both',
      category: 'romance',
      priority: 'high',
      estimatedTime: 120,
      coins: 50,
      completed: false,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Grocery shopping',
      description: 'Buy ingredients for dinner party',
      assignedTo: 'partner1',
      category: 'household',
      priority: 'medium',
      estimatedTime: 45,
      coins: 20,
      completed: true,
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      title: 'Kids homework help',
      description: 'Assist children with their school assignments',
      assignedTo: 'partner2',
      category: 'parenting',
      priority: 'high',
      estimatedTime: 60,
      coins: 30,
      completed: false,
      createdAt: '2024-01-15'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'my' | 'completed' | 'pending'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: 'both' as 'partner1' | 'partner2' | 'both',
    category: 'household',
    priority: 'medium' as 'low' | 'medium' | 'high',
    estimatedTime: 30,
    archetypalAffinity: 'krishna' as 'krishna' | 'ram' | 'shiva'
  });

  const [archetypeFilter, setArchetypeFilter] = useState<string>('all');
  const [showLoadBalancer, setShowLoadBalancer] = useState(false);

  interface LoadBalancerSuggestion {
    type: 'reassignment' | 'general';
    message: string;
    taskId?: string;
    newAssignee?: string;
    timeSaved?: number;
  }

  const [loadBalancerSuggestions, setLoadBalancerSuggestions] = useState<LoadBalancerSuggestion[]>([]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAssignedToColor = (assignedTo: string) => {
    switch (assignedTo) {
      case 'partner1': return 'bg-blue-100 text-blue-700';
      case 'partner2': return 'bg-pink-100 text-pink-700';
      case 'both': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAssignedToLabel = (assignedTo: string) => {
    switch (assignedTo) {
      case 'partner1': return 'You';
      case 'partner2': return 'Partner';
      case 'both': return 'Both';
      default: return 'Unassigned';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'pending' && task.completed) return false;
    if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;
    return true;
  });

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const addNewTask = () => {
    if (newTask.title.trim() === '') return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      category: newTask.category,
      priority: newTask.priority,
      estimatedTime: newTask.estimatedTime,
      coins: newTask.priority === 'high' ? 50 : newTask.priority === 'medium' ? 30 : 20,
      completed: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setTasks(prev => [task, ...prev]);
    setNewTask({
      title: '',
      description: '',
      assignedTo: 'both',
      category: 'household',
      priority: 'medium',
      estimatedTime: 30,
      archetypalAffinity: 'krishna'
    });
    setShowAddTask(false);
  };

  const startTask = (taskId: string) => {
    // Simulate starting a task
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      // Mark task as in progress or provide feedback
      console.log(`Starting task: ${task.title}\nEstimated time: ${task.estimatedTime} minutes`);

      // Show toast or visual feedback
      const event = new CustomEvent('taskStarted', { detail: { taskId, task } });
      window.dispatchEvent(event);

      // Update task status to reflect it's being worked on
      setTasks(prev => prev.map(t =>
        t.id === taskId
          ? { ...t, status: 'in_progress' }
          : t
      ));
    }
  };

  const editTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setNewTask({
        title: task.title,
        description: task.description,
        assignedTo: task.assignedTo,
        category: task.category,
        priority: task.priority,
        estimatedTime: task.estimatedTime,
        archetypalAffinity: task.archetypalAffinity || 'krishna'
      });
      setShowAddTask(true);
    }
  };

  const analyzeAndBalanceLoad = () => {
    const pendingTasks = tasks.filter(t => !t.completed);

    if (pendingTasks.length === 0) {
      alert('All tasks are already completed! No balancing needed. 🎉');
      return;
    }

    // Calculate current workload distribution
    const partner1Tasks = pendingTasks.filter(t => t.assignedTo === 'partner1' || t.assignedTo === 'both');
    const partner2Tasks = pendingTasks.filter(t => t.assignedTo === 'partner2' || t.assignedTo === 'both');

    const partner1Time = partner1Tasks.reduce((sum, t) => sum + t.estimatedTime, 0);
    const partner2Time = partner2Tasks.reduce((sum, t) => sum + t.estimatedTime, 0);

    // Generate balancing suggestions
    const suggestions: any[] = [];
    const imbalanceThreshold = 20; // 20 minutes difference threshold

    if (Math.abs(partner1Time - partner2Time) > imbalanceThreshold) {
      const heavierPartner = partner1Time > partner2Time ? 'You' : 'Partner';
      const lighterPartner = partner1Time > partner2Time ? 'Partner' : 'You';

      const heavyTasks = partner1Time > partner2Time ?
        partner1Tasks.filter(t => t.assignedTo !== 'both') :
        partner2Tasks.filter(t => t.assignedTo !== 'both');

      // Find low-time tasks to suggest swapping
      const lowPriorityTasks = heavyTasks
        .filter(t => t.estimatedTime < 30)
        .sort((a, b) => a.estimatedTime - b.estimatedTime);

      if (lowPriorityTasks.length > 0) {
        const taskToReassign = lowPriorityTasks[0];
        suggestions.push({
          type: 'reassignment',
          message: `${heavierPartner} has ${partner1Time > partner2Time ? partner1Time - partner2Time : partner2Time - partner1Time} more minutes. Suggest reassign "${taskToReassign.title}" to ${lighterPartner}?`,
          taskId: taskToReassign.id,
          newAssignee: partner1Time > partner2Time ? 'partner2' : 'partner1',
          timeSaved: taskToReassign.estimatedTime
        });
      }
    }

    // Add general suggestions
    if (suggestions.length === 0) {
      suggestions.push({
        type: 'general',
        message: 'Task distribution looks balanced! Good job maintaining fairness. 💝',
        taskId: null,
        newAssignee: null
      });
    }

    setLoadBalancerSuggestions(suggestions);
    setShowLoadBalancer(true);
  };

  const applyLoadBalancerSuggestion = (suggestion: any) => {
    if (suggestion.type === 'reassignment' && suggestion.taskId) {
      setTasks(prev => prev.map(task =>
        task.id === suggestion.taskId
          ? { ...task, assignedTo: suggestion.newAssignee }
          : task
      ));

      alert(`✅ Task reassigned! ${suggestion.timeSaved} minutes redistributed for better balance.`);
      setShowLoadBalancer(false);
      setLoadBalancerSuggestions([]);
    }
  };

  const workloads = {
    partner1: tasks.filter(t => !t.completed && (t.assignedTo === 'partner1' || t.assignedTo === 'both'))
      .reduce((sum, t) => sum + t.estimatedTime, 0),
    partner2: tasks.filter(t => !t.completed && (t.assignedTo === 'partner2' || t.assignedTo === 'both'))
      .reduce((sum, t) => sum + t.estimatedTime, 0),
    both: tasks.filter(t => !t.completed && t.assignedTo === 'both')
      .reduce((sum, t) => sum + t.estimatedTime, 0)
  };

  return (
    <div className="p-4 space-y-6">
      {/* Load Balancer Modal */}
      {showLoadBalancer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Shuffle className="w-5 h-5 text-orange-600" />
                AI Load Balancer
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowLoadBalancer(false)}>
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              {/* Current Workload Stats */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Current Workload</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">You:</span>
                    <span className="font-semibold text-blue-600">{workloads.partner1} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Partner:</span>
                    <span className="font-semibold text-cyan-600">{workloads.partner2} min</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-sm font-medium text-gray-900">Difference:</span>
                    <span className={`font-bold ${Math.abs(workloads.partner1 - workloads.partner2) > 30 ? 'text-red-600' : 'text-green-600'}`}>
                      {Math.abs(workloads.partner1 - workloads.partner2)} min
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Suggestions */}
              <div className="space-y-3">
                {loadBalancerSuggestions.map((suggestion: LoadBalancerSuggestion, index) => (
                  <div key={index} className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        🧠
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 mb-2">AI Suggestion</h5>
                        <p className="text-sm text-gray-700">{suggestion.message}</p>
                        {suggestion.type === 'reassignment' && (
                          <div className="mt-3 flex gap-2">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                              onClick={() => applyLoadBalancerSuggestion(suggestion)}
                            >
                              Apply
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-300"
                              onClick={() => setShowLoadBalancer(false)}
                            >
                              Keep As Is
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <p className="text-sm text-gray-700 text-center">
                  "Perfect balance comes from communication, not calculation" 💕
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header with stats */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 p-6 shadow-xl">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Task Management</h1>
              <p className="text-white/80 text-sm">Fair tasks, stronger relationship</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center bg-white/20 backdrop-blur-lg rounded-xl p-3 min-w-[80px]">
                <div className="flex items-center gap-1">
                  <Target className="w-5 h-5 text-white" />
                  <span className="text-xl font-bold text-white">{completionRate.toFixed(0)}%</span>
                </div>
                <span className="text-xs text-white/80">Complete</span>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/90 font-medium">
                {completedTasks} of {totalTasks} tasks completed
              </span>
              <span className="text-sm text-white/90">{completionRate.toFixed(0)}%</span>
            </div>
            <Progress value={completionRate} className="h-2 bg-white/30" />
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="ai-suggestions">AI Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-lg rounded-2xl">
              <div className="p-3 text-center">
                <CheckCircle className="w-6 h-6 mx-auto mb-1" />
                <p className="text-2xl font-bold">{completedTasks}</p>
                <p className="text-xs opacity-90">Completed</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg rounded-2xl">
              <div className="p-3 text-center">
                <Clock className="w-6 h-6 mx-auto mb-1" />
                <p className="text-2xl font-bold">{totalTasks - completedTasks}</p>
                <p className="text-xs opacity-90">Pending</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg rounded-2xl">
              <div className="p-3 text-center">
                <Award className="w-6 h-6 mx-auto mb-1" />
                <p className="text-2xl font-bold">150</p>
                <p className="text-xs opacity-90">Coins Earned</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/90 backdrop-blur-lg border border-white/50 shadow-lg rounded-2xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h3>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white" onClick={() => analyzeAndBalanceLoad()}>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Balance Load
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white" onClick={() => setShowAddTask(true)}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Task
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {['all', 'my', 'pending', 'completed'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                      filter === f
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div 
                key={task.id} 
                className={`bg-white/90 backdrop-blur-lg border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl ${
                  task.completed ? 'opacity-75' : ''
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all duration-200 ${
                          task.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-purple-400'
                        }`}
                      >
                        {task.completed && <CheckCircle className="w-4 h-4" />}
                      </button>
                      
                      <div className="flex-1">
                        <h4 className={`font-semibold text-gray-900 ${task.completed ? 'line-through' : ''}`}>
                          {task.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge className={getAssignedToColor(task.assignedTo)}>
                            <User className="w-3 h-3 mr-1" />
                            {getAssignedToLabel(task.assignedTo)}
                          </Badge>
                          <Badge variant="outline" className="border-gray-300 text-gray-600">
                            <Clock className="w-3 h-3 mr-1" />
                            {task.estimatedTime}min
                          </Badge>
                          <Badge className="bg-yellow-100 text-yellow-700">
                            <Star className="w-3 h-3 mr-1" />
                            +{task.coins}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {!task.completed && (
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={() => editTask(task.id)}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                        onClick={() => startTask(task.id)}
                      >
                        Start Task
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 rounded-2xl">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">All tasks completed!</h3>
                <p className="text-gray-600 mb-4">Great job! You've completed all your tasks.</p>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white" onClick={() => setShowAddTask(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Task
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Analytics Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Task Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">85%</div>
                    <div className="text-sm text-blue-600">Completion Rate</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">2.5</div>
                    <div className="text-sm text-green-600">Avg Tasks/Day</div>
                  </div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">Excellent Balance!</div>
                  <p className="text-gray-600">Tasks are well-distributed between partners</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-suggestions" className="space-y-4">
          {/* AI Suggestions Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Task Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium">Smart Suggestion</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    Based on your patterns, consider scheduling grocery shopping for weekends when you both have more time.
                  </p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Apply Suggestion
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800">Efficiency Tip</span>
                      </div>
                      <p className="text-sm text-green-700">Batch similar tasks together to save time</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800">Timing Suggestion</span>
                      </div>
                      <p className="text-sm text-yellow-700">Schedule high-priority tasks in the morning</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add New Task</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddTask(false)}>
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Assigned To</label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask(prev => ({ ...prev, assignedTo: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="both">Both</option>
                    <option value="partner1">You</option>
                    <option value="partner2">Partner</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="household">Household</option>
                    <option value="romance">Romance</option>
                    <option value="parenting">Parenting</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Time (minutes)</label>
                  <input
                    type="number"
                    value={newTask.estimatedTime}
                    onChange={(e) => setNewTask(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) || 30 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="5"
                    max="300"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddTask(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                onClick={addNewTask}
              >
                Add Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
