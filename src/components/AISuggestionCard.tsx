'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Clock, Target, Info, Heart, Star, Zap } from 'lucide-react';

interface AISuggestionCardProps {
  suggestion: {
    type: 'ritual' | 'task' | 'activity';
    archetype: 'radha_krishna' | 'sita_ram' | 'shiva_shakti';
    title: string;
    description: string;
    actionSteps: string[];
    estimatedDuration: number;
    rewardCoins: number;
    reasoning: {
      trigger: string;
      severity: number;
      factors: string[];
    };
  };
  onAccept: () => void;
  onLater: () => void;
  onTellMe: () => void;
}

export function AISuggestionCard({ suggestion, onAccept, onLater, onTellMe }: AISuggestionCardProps) {
  const getArchetypeInfo = (archetype: string) => {
    switch (archetype) {
      case 'radha_krishna':
        return { 
          name: 'Radha-Krishna', 
          emoji: '🎨', 
          color: 'from-pink-500 to-rose-500',
          bgColor: 'bg-pink-50',
          textColor: 'text-pink-700',
          borderColor: 'border-pink-200',
          description: 'Play & Romance'
        };
      case 'sita_ram':
        return { 
          name: 'Sita-Ram', 
          emoji: '⚖️', 
          color: 'from-blue-500 to-cyan-500',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
          description: 'Duty & Balance'
        };
      case 'shiva_shakti':
        return { 
          name: 'Shiva-Shakti', 
          emoji: '🧘', 
          color: 'from-purple-500 to-violet-500',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-700',
          borderColor: 'border-purple-200',
          description: 'Harmony & Growth'
        };
      default:
        return { 
          name: 'Wisdom', 
          emoji: '✨', 
          color: 'from-gray-500 to-slate-500',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
          description: 'Ancient Wisdom'
        };
    }
  };

  const archetypeInfo = getArchetypeInfo(suggestion.archetype);

  return (
    <div className="w-full bg-white/90 backdrop-blur-lg border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group rounded-2xl">
      {/* Gradient accent border */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${archetypeInfo.color}`}></div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`relative`}>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${archetypeInfo.color} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-xl">{archetypeInfo.emoji}</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-2 h-2 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{suggestion.title}</h3>
              <p className="text-sm text-gray-600">{archetypeInfo.description}</p>
            </div>
          </div>
          <Badge className={`bg-gradient-to-r ${archetypeInfo.color} text-white border-0 shadow-lg`}>
            <Sparkles className="w-3 h-3 mr-1 animate-pulse" />
            AI Suggestion
          </Badge>
        </div>

        <p className="text-gray-700 mb-4 leading-relaxed text-sm">
          {suggestion.description}
        </p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 bg-blue-50 rounded-full px-3 py-1">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">{suggestion.estimatedDuration / 60} min</span>
          </div>
          <div className="flex items-center gap-2 bg-yellow-50 rounded-full px-3 py-1">
            <Target className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">+{suggestion.rewardCoins} coins</span>
          </div>
        </div>

        <div className={`${archetypeInfo.bgColor} rounded-xl p-4 mb-4 border ${archetypeInfo.borderColor}`}>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            Quick Steps:
          </h4>
          <ol className="text-sm text-gray-700 space-y-2">
            {suggestion.actionSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${archetypeInfo.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {index + 1}
                </div>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={onAccept}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Zap className="w-4 h-4 mr-2" />
            Try Now
          </Button>
          <Button 
            variant="outline" 
            onClick={onLater}
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-xl"
          >
            Later
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onTellMe}
            className="px-3 py-3 rounded-xl hover:bg-gray-100"
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}