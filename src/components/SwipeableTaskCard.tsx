'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Check, X, MoreVertical, Star, Clock, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  category: string;
  assigned_to: string;
  due_at?: string;
  created_at: string;
}

interface SwipeableTaskCardProps {
  task: Task;
  onComplete: (taskId: string) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onEdit: (task: Task) => void;
  onToggleFavorite?: (taskId: string) => void;
  isLoading?: boolean;
}

export const SwipeableTaskCard: React.FC<SwipeableTaskCardProps> = ({
  task,
  onComplete,
  onDelete,
  onEdit,
  onToggleFavorite,
  isLoading = false
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const maxSwipeDistance = 100;

  const handleComplete = async () => {
    if (task.status === 'COMPLETED' || isCompleting) return;
    
    setIsCompleting(true);
    try {
      await onComplete(task.id);
      console.info('Task completed via swipe gesture', { taskId: task.id });
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 50, 50]);
      }
      } catch (error) {
        console.error('Failed to complete task', { error, taskId: task.id });
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      await onDelete(task.id);
      console.info('Task deleted via swipe gesture', { taskId: task.id });
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
    } catch (error) {
      console.error('Failed to delete task', { error, taskId: task.id });
      setIsDeleting(false);
    }
  };

  const getSwipeProgress = () => {
    return Math.abs(swipeOffset) / maxSwipeDistance;
  };

  const getSwipeAction = () => {
    if (swipeOffset > 50 && task.status !== 'COMPLETED') {
      return 'complete';
    } else if (swipeOffset < -50) {
      return 'delete';
    }
    return null;
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays > 0) return `Due in ${diffDays} days`;
    return `Overdue by ${Math.abs(diffDays)} days`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'PENDING': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const swipeAction = getSwipeAction();
  const progress = getSwipeProgress();

  return (
    <div className="relative overflow-hidden">
      {/* Background action indicators */}
      <div className="absolute inset-0 flex">
        {/* Complete action (right swipe) */}
        {task.status !== 'COMPLETED' && (
          <div 
            className={`flex items-center justify-center bg-green-500 text-white transition-all duration-200 ${
              swipeOffset > 0 ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ width: Math.max(0, swipeOffset) }}
          >
            <Check className="w-6 h-6" />
          </div>
        )}
        
        {/* Delete action (left swipe) */}
        <div className="flex-1" />
        <div 
          className={`flex items-center justify-center bg-red-500 text-white transition-all duration-200 ${
            swipeOffset < 0 ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ width: Math.max(0, -swipeOffset) }}
        >
          <X className="w-6 h-6" />
        </div>
      </div>

      {/* Main card */}
      <Card
        ref={cardRef}
        className={`transition-all duration-200 cursor-pointer ${
          swipeAction === 'complete' ? 'bg-green-50 border-green-200' :
          swipeAction === 'delete' ? 'bg-red-50 border-red-200' : ''
        } ${
          isCompleting || isDeleting ? 'opacity-70' : ''
        }`}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          touchAction: 'pan-y'
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`font-medium text-sm truncate ${
                  task.status === 'COMPLETED' ? 'line-through text-gray-500' : ''
                }`}>
                  {task.title}
                </h3>
                {task.status === 'COMPLETED' && (
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                )}
              </div>
              
              {task.description && (
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getStatusColor(task.status)} variant="secondary">
                  {task.status.replace('_', ' ').toLowerCase()}
                </Badge>
                
                <Badge variant="outline" className="text-xs">
                  {task.category}
                </Badge>
                
                {task.assigned_to && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <User className="w-3 h-3" />
                    <span>{task.assigned_to}</span>
                  </div>
                )}
                
                {task.due_at && (
                  <div className={`flex items-center gap-1 text-xs ${
                    new Date(task.due_at) < new Date() ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    <Clock className="w-3 h-3" />
                    <span>{formatDueDate(task.due_at)}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 ml-2">
              {onToggleFavorite && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onToggleFavorite(task.id)}
                >
                  <Star className="w-4 h-4" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowActions(!showActions)}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Swipe hint */}
          {progress > 0.3 && !isCompleting && !isDeleting && (
            <div className="mt-2 text-xs text-center animate-pulse">
              {swipeAction === 'complete' && '👉 Release to complete'}
              {swipeAction === 'delete' && '👈 Release to delete'}
            </div>
          )}
          
          {/* Loading states */}
          {(isCompleting || isDeleting) && (
            <div className="mt-2 text-xs text-center text-gray-500">
              {isCompleting && '✅ Completing task...'}
              {isDeleting && '🗑️ Deleting task...'}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Action menu overlay */}
      {showActions && (
        <div
          className="fixed inset-0 bg-gray-700 bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setShowActions(false)}
        >
          <div className="bg-white rounded-lg p-4 m-4 max-w-sm w-full">
            <h3 className="font-medium mb-3">Task Actions</h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  onEdit(task);
                  setShowActions(false);
                }}
              >
                Edit Task
              </Button>
              
              {task.status !== 'COMPLETED' && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    handleComplete();
                    setShowActions(false);
                  }}
                >
                  Mark Complete
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600"
                onClick={() => {
                  handleDelete();
                  setShowActions(false);
                }}
              >
                Delete Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
