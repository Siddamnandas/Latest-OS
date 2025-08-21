'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Clock, 
  Star, 
  Calendar, 
  Users,
  Sparkles,
  Play,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

interface Ritual {
  id: string;
  name: string;
  description: string;
  archetype: 'radha_krishna' | 'sita_ram' | 'shiva_shakti';
  duration: number; // in minutes
  frequency: 'daily' | 'weekly' | 'monthly';
  difficulty: 'easy' | 'medium' | 'hard';
  completedToday: boolean;
  streak: number;
  coins: number;
  steps: string[];
  benefits: string[];
  lastCompleted?: string;
}

interface RitualCardProps {
  ritual: Ritual;
  onStart: (ritualId: string) => void;
  onComplete: (ritualId: string) => void;
}

export function RitualCard({ ritual, onStart, onComplete }: RitualCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getArchetypeInfo = (archetype: string) => {
    switch (archetype) {
      case 'radha_krishna':
        return { 
          name: 'Radha-Krishna', 
          emoji: '🎨', 
          color: 'bg-pink-100 text-pink-700 border-pink-200',
          gradient: 'from-pink-500 to-rose-500',
          description: 'Play & Romance'
        };
      case 'sita_ram':
        return { 
          name: 'Sita-Ram', 
          emoji: '⚖️', 
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          gradient: 'from-blue-500 to-cyan-500',
          description: 'Duty & Balance'
        };
      case 'shiva_shakti':
        return { 
          name: 'Shiva-Shakti', 
          emoji: '🧘', 
          color: 'bg-purple-100 text-purple-700 border-purple-200',
          gradient: 'from-purple-500 to-violet-500',
          description: 'Harmony & Growth'
        };
      default:
        return { 
          name: 'Wisdom', 
          emoji: '🌟', 
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          gradient: 'from-gray-500 to-slate-500',
          description: 'Ancient Wisdom'
        };
    }
  };

  const getDifficultyInfo = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return { name: 'Easy', color: 'bg-green-100 text-green-700' };
      case 'medium':
        return { name: 'Medium', color: 'bg-yellow-100 text-yellow-700' };
      case 'hard':
        return { name: 'Hard', color: 'bg-red-100 text-red-700' };
      default:
        return { name: 'Normal', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const archetypeInfo = getArchetypeInfo(ritual.archetype);
  const difficultyInfo = getDifficultyInfo(ritual.difficulty);

  const handleStart = () => {
    onStart(ritual.id);
  };

  const handleComplete = () => {
    onComplete(ritual.id);
  };

  return (
    <Card className={`w-full transition-all duration-300 hover:shadow-lg ${
      ritual.completedToday ? 'bg-green-50 border-green-200' : 'bg-white'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${archetypeInfo.gradient} flex items-center justify-center text-white shadow-lg`}>
              <span className="text-xl">{archetypeInfo.emoji}</span>
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-gray-900">
                {ritual.name}
              </CardTitle>
              <p className="text-sm text-gray-600">{archetypeInfo.description}</p>
            </div>
          </div>
          
          {ritual.completedToday && (
            <CheckCircle className="w-6 h-6 text-green-600" />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          {ritual.description}
        </p>

        {/* Ritual Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{ritual.duration} min</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 capitalize">{ritual.frequency}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{ritual.streak} day streak</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-purple-600 font-medium">+{ritual.coins} coins</span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">{ritual.streak} days</span>
          </div>
          <Progress value={Math.min(ritual.streak * 10, 100)} className="h-2" />
        </div>

        {/* Tags */}
        <div className="flex gap-2">
          <Badge className={`text-xs ${archetypeInfo.color}`}>
            {archetypeInfo.name}
          </Badge>
          <Badge className={`text-xs ${difficultyInfo.color}`}>
            {difficultyInfo.name}
          </Badge>
          {ritual.completedToday && (
            <Badge className="text-xs bg-green-100 text-green-700">
              Completed Today
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {ritual.completedToday ? (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide Details' : 'View Details'}
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide Details' : 'Learn More'}
              </Button>
              <Button 
                onClick={handleStart}
                className={`flex-1 bg-gradient-to-r ${archetypeInfo.gradient} hover:opacity-90 text-white`}
              >
                <Play className="w-4 h-4 mr-1" />
                Start
              </Button>
            </>
          )}
        </div>

        {/* Detailed View */}
        {showDetails && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            {/* Steps */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Steps:</h4>
              <ol className="text-sm text-gray-600 space-y-1">
                {ritual.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-600 font-medium mt-0.5">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Benefits */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
              <div className="flex flex-wrap gap-2">
                {ritual.benefits.map((benefit, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                  >
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Last Completed */}
            {ritual.lastCompleted && (
              <div className="text-sm text-gray-600">
                Last completed: {new Date(ritual.lastCompleted).toLocaleDateString()}
              </div>
            )}

            {/* Complete Button (if not completed today) */}
            {!ritual.completedToday && (
              <Button 
                onClick={handleComplete}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Completed
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}