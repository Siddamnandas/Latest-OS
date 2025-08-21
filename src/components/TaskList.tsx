'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  User, 
  Users, 
  Star, 
  Plus,
  Filter,
  Calendar,
  Target
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: 'user' | 'partner' | 'both';
  category: 'household' | 'parenting' | 'personal' | 'couple';
  priority: 'low' | 'medium' | 'high';
  estimatedTime: number; // in minutes
  dueDate?: string;
  completed: boolean;
  coins: number;
  recurring?: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
  onAddTask: () => void;
}

export function TaskList({ tasks, onTaskToggle, onAddTask }: TaskListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;
    if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;
    return true;
  });

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'household':
        return { name: 'Household', emoji: '🏠', color: 'bg-blue-100 text-blue-700' };
      case 'parenting':
        return { name: 'Parenting', emoji: '👶', color: 'bg-pink-100 text-pink-700' };
      case 'personal':
        return { name: 'Personal', emoji: '🧘', color: 'bg-purple-100 text-purple-700' };
      case 'couple':
        return { name: 'Couple', emoji: '💕', color: 'bg-red-100 text-red-700' };
      default:
        return { name: 'Other', emoji: '📋', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'high':
        return { name: 'High', color: 'bg-red-100 text-red-700' };
      case 'medium':
        return { name: 'Medium', color: 'bg-yellow-100 text-yellow-700' };
      case 'low':
        return { name: 'Low', color: 'bg-green-100 text-green-700' };
      default:
        return { name: 'Normal', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const getAssignedToIcon = (assignedTo: string) => {
    switch (assignedTo) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'partner':
        return <User className="w-4 h-4" />;
      case 'both':
        return <Users className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Smart Tasks</h3>
          <p className="text-sm text-gray-600">Fair task management for couples</p>
        </div>
        <Button onClick={onAddTask} size="sm" className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-1" />
          Add Task
        </Button>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Daily Progress</span>
            <span className="text-sm font-bold text-purple-700">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2 mb-2" />
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>{completedTasks} of {totalTasks} tasks completed</span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {tasks.reduce((sum, task) => task.completed ? sum + task.coins : sum, 0)} coins earned
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className="flex-shrink-0"
        >
          All ({tasks.length})
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('active')}
          className="flex-shrink-0"
        >
          Active ({tasks.filter(t => !t.completed).length})
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('completed')}
          className="flex-shrink-0"
        >
          Completed ({completedTasks})
        </Button>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'household', 'parenting', 'personal', 'couple'].map(category => {
          const info = getCategoryInfo(category);
          return (
            <Button
              key={category}
              variant={categoryFilter === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter(category)}
              className="flex-shrink-0"
            >
              {category === 'all' ? 'All' : info.emoji} {category === 'all' ? '' : info.name}
            </Button>
          );
        })}
      </div>

      {/* Task List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <Card className="border-dashed border-gray-300">
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No tasks found</p>
              <p className="text-sm text-gray-400">Add a new task to get started</p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map(task => {
            const categoryInfo = getCategoryInfo(task.category);
            const priorityInfo = getPriorityInfo(task.priority);
            
            return (
              <Card 
                key={task.id} 
                className={`transition-all duration-200 hover:shadow-md ${
                  task.completed ? 'opacity-75 bg-gray-50' : 'bg-white'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-5 mt-1">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => onTaskToggle(task.id)}
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0 flex-1">
                          <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.title}
                          </h4>
                          <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                            {task.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {task.recurring && (
                            <Badge variant="outline" className="text-xs">
                              🔄 Recurring
                            </Badge>
                          )}
                          <Badge className={`text-xs ${priorityInfo.color}`}>
                            {priorityInfo.name}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {getAssignedToIcon(task.assignedTo)}
                            <span className="capitalize">{task.assignedTo}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <span className={categoryInfo.color}>
                              {categoryInfo.emoji}
                            </span>
                            <span>{categoryInfo.name}</span>
                          </div>
                          
                          {task.estimatedTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{task.estimatedTime}m</span>
                            </div>
                          )}
                          
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 text-purple-600 font-medium">
                          <Star className="w-3 h-3" />
                          <span>{task.coins}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}