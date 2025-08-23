'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  Plus, 
  Calendar,
  User,
  Users,
  Target,
  Star
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assignedTo: 'partner_a' | 'partner_b' | 'both';
  category: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  dueAt?: string;
  completedAt?: string;
  coins?: number;
}

export function LiveTaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedToday, setCompletedToday] = useState(0);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      // In a real app, this would fetch from API
      const sampleTasks: Task[] = [
        {
          id: '1',
          title: 'Morning Meditation Together',
          description: 'Start the day with a 10-minute meditation session',
          status: 'COMPLETED',
          assignedTo: 'both',
          category: 'DAILY',
          completedAt: new Date().toISOString(),
          coins: 15
        },
        {
          id: '2',
          title: 'Plan Weekend Date',
          description: 'Choose a special activity for this weekend',
          status: 'IN_PROGRESS',
          assignedTo: 'both',
          category: 'WEEKLY',
          dueAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          coins: 25
        },
        {
          id: '3',
          title: 'Express Daily Gratitude',
          description: 'Share three things you\'re grateful for today',
          status: 'PENDING',
          assignedTo: 'both',
          category: 'DAILY',
          coins: 10
        },
        {
          id: '4',
          title: 'Cook Together',
          description: 'Prepare dinner together and try a new recipe',
          status: 'PENDING',
          assignedTo: 'both',
          category: 'WEEKLY',
          coins: 20
        },
        {
          id: '5',
          title: 'Family Photo Session',
          description: 'Take some beautiful family photos',
          status: 'PENDING',
          assignedTo: 'partner_a',
          category: 'MONTHLY',
          coins: 50
        }
      ];
      
      setTasks(sampleTasks);
      setCompletedToday(sampleTasks.filter(t => t.status === 'COMPLETED').length);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
        return {
          ...task,
          status: newStatus,
          completedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : undefined
        };
      }
      return task;
    }));
    
    // Update completed count
    const newCompleted = tasks.filter(t => t.status === 'COMPLETED').length;
    setCompletedToday(newCompleted);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'IN_PROGRESS':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getAssigneeIcon = (assignedTo: string) => {
    switch (assignedTo) {
      case 'both':
        return <Users className="w-4 h-4 text-purple-600" />;
      case 'partner_a':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'partner_b':
        return <User className="w-4 h-4 text-pink-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'DAILY':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'WEEKLY':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'MONTHLY':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const completionPercentage = Math.round((completedToday / tasks.length) * 100) || 0;

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Task Management 📝</h2>
            <p className="text-white/80">Organize your relationship goals together</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{completedToday}</div>
            <div className="text-sm text-white/80">Completed Today</div>
          </div>
        </div>
        
        <div className="bg-white/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Daily Progress</span>
            <span className="text-sm">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2 bg-white/30" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
        <Button variant="outline" className="flex-1">
          <Calendar className="w-4 h-4 mr-2" />
          Schedule
        </Button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white/90 backdrop-blur-lg rounded-xl p-4 border border-white/50 shadow-lg transition-all duration-200 ${
              task.status === 'COMPLETED' ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleTaskStatus(task.id)}
                className="mt-1 hover:scale-110 transition-transform"
              >
                {getStatusIcon(task.status)}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`font-semibold text-gray-900 ${
                      task.status === 'COMPLETED' ? 'line-through' : ''
                    }`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}
                  </div>
                  
                  {task.coins && (
                    <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                      <Star className="w-3 h-3" />
                      {task.coins}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  <Badge className={`text-xs ${getCategoryColor(task.category)}`}>
                    {task.category}
                  </Badge>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    {getAssigneeIcon(task.assignedTo)}
                    <span>{task.assignedTo === 'both' ? 'Together' : 'Individual'}</span>
                  </div>
                  
                  {task.dueAt && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>Due {new Date(task.dueAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {tasks.filter(t => t.status === 'COMPLETED').length}
          </div>
          <div className="text-sm text-green-700">Completed</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {tasks.filter(t => t.status === 'IN_PROGRESS').length}
          </div>
          <div className="text-sm text-yellow-700">In Progress</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {tasks.filter(t => t.status === 'PENDING').length}
          </div>
          <div className="text-sm text-blue-700">Pending</div>
        </div>
      </div>
    </div>
  );
}