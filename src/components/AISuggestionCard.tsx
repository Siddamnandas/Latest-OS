'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Clock, Target, Info, Heart, Star, Zap } from 'lucide-react';
import { MythologicalWisdom } from '@/components/MythologicalWisdom';

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
    archetypalBalance?: {
      krishna: number;
      ram: number;
      shiva: number;
    };
    targetArchetype?: 'krishna' | 'ram' | 'shiva';
  };
  onAccept: () => void;
  onLater: () => void;
  onTellMe: () => void;
}

export function AISuggestionCard({ suggestion, onAccept, onLater, onTellMe }: AISuggestionCardProps) {
  const [showWisdom, setShowWisdom] = useState(false);
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

        {/* Archetypal Reasoning Section */}
        {suggestion.archetypalBalance && (
          <div className="space-y-3 mb-4">
            <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              Archetypal Intelligence:
            </h4>

            {/* Balance Display */}
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(suggestion.archetypalBalance).map(([archetype, percentage]) => {
                const archInfo = getArchetypeInfo(archetype === 'krishna' ? 'radha_krishna' :
                    archetype === 'ram' ? 'sita_ram' : 'shiva_shakti');
                return (
                  <div key={archetype}
                    className={`text-center p-2 rounded-lg ${archInfo.bgColor} border ${archInfo.borderColor}`}>
                    <div className={`text-xs font-medium capitalize ${archInfo.textColor}`}>
                      {archetype}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {percentage}%
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Archetypal Reasoning */}
            {suggestion.targetArchetype && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 border border-purple-200">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-medium text-purple-700">Why this suggestion?</span><br />
                  Your relationship needs more {suggestion.targetArchetype} energy.
                  This practice strengthens {
                    suggestion.targetArchetype === 'krishna' ? 'playful connection' :
                    suggestion.targetArchetype === 'ram' ? 'devoted partnership' : 'inner wholeness'
                  } 🌟
                </p>
              </div>
            )}
          </div>
        )}

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
            onClick={() => setShowWisdom(true)}
            className="px-3 py-3 rounded-xl hover:bg-gray-100"
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mythological Wisdom Modal */}
      {showWisdom && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Sacred Archetypal Wisdom 🕉️</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWisdom(false)}
                >
                  ✕
                </Button>
              </div>
              <MythologicalWisdom
                context={suggestion.targetArchetype}
                onWisdomShared={(wisdom) => {
                  // Handle wisdom shared
                  setShowWisdom(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
