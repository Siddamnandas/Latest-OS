'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Baby, Heart, Palette, BookOpen, Camera, Sparkles } from 'lucide-react';

interface KidsMobileActionsProps {
  onQuickAction: (action: string) => void;
}

export function KidsMobileActions({ onQuickAction }: KidsMobileActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    { id: 'kindness', label: 'Be Kind', emoji: '💖', color: 'from-pink-500 to-rose-500', icon: Heart },
    { id: 'create', label: 'Create Art', emoji: '🎨', color: 'from-purple-500 to-indigo-500', icon: Palette },
    { id: 'story', label: 'Story Time', emoji: '📚', color: 'from-blue-500 to-cyan-500', icon: BookOpen },
    { id: 'photo', label: 'Save Memory', emoji: '📸', color: 'from-yellow-500 to-orange-500', icon: Camera },
  ];

  return (
    <div className="fixed bottom-6 right-4 z-50 md:hidden">
      {/* Enhanced Quick action buttons with animations */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 space-y-4 animate-in slide-in-from-bottom duration-300">
          {quickActions.map((action, index) => (
            <div 
              key={action.id} 
              className="flex items-center gap-3 animate-in slide-in-from-right duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Badge className="bg-white/95 backdrop-blur-sm text-gray-700 shadow-xl border border-white/50 font-semibold px-3 py-1">
                {action.label}
              </Badge>
              <Button
                size="lg"
                className={`w-16 h-16 rounded-full bg-gradient-to-r ${action.color} shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/30`}
                onClick={() => {
                  onQuickAction(action.id);
                  setIsOpen(false);
                }}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl animate-bounce">{action.emoji}</span>
                </div>
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Main floating button with Leela presence */}
      <Button
        size="lg"
        className={`w-18 h-18 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 shadow-2xl transform transition-all duration-500 border-4 border-white/50 ${
          isOpen ? 'rotate-180 scale-110' : 'hover:scale-110 animate-pulse'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative">
          {isOpen ? (
            <div className="relative">
              <Sparkles className="w-8 h-8 text-white animate-spin" />
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-2xl animate-bounce">🧚‍♀️</span>
              <div className="text-xs text-white font-bold opacity-90">Leela</div>
            </div>
          )}
        </div>
      </Button>
      
      {/* Persistent celebration indicator */}
      {!isOpen && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <span className="text-xs">✨</span>
        </div>
      )}
    </div>
  );
}

export default KidsMobileActions;