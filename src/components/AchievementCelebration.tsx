'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Star, 
  Crown, 
  Zap, 
  Gift,
  Target,
  Award,
  Sparkles,
  CheckCircle,
  X
} from 'lucide-react';

interface AchievementCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: {
    title: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    coins: number;
  };
}

export function AchievementCelebration({ isOpen, onClose, achievement }: AchievementCelebrationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getRarityColors = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return {
          bg: 'from-gray-400 to-gray-600',
          border: 'border-gray-400',
          text: 'text-gray-700',
          badge: 'bg-gray-100 text-gray-700'
        };
      case 'rare':
        return {
          bg: 'from-blue-400 to-blue-600',
          border: 'border-blue-400',
          text: 'text-blue-700',
          badge: 'bg-blue-100 text-blue-700'
        };
      case 'epic':
        return {
          bg: 'from-purple-400 to-purple-600',
          border: 'border-purple-400',
          text: 'text-purple-700',
          badge: 'bg-purple-100 text-purple-700'
        };
      case 'legendary':
        return {
          bg: 'from-yellow-400 to-orange-500',
          border: 'border-yellow-400',
          text: 'text-yellow-700',
          badge: 'bg-yellow-100 text-yellow-700'
        };
      default:
        return {
          bg: 'from-gray-400 to-gray-600',
          border: 'border-gray-400',
          text: 'text-gray-700',
          badge: 'bg-gray-100 text-gray-700'
        };
    }
  };

  const rarityColors = getRarityColors(achievement.rarity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-br from-yellow-400 to-pink-400 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <div className={`w-full max-w-md mx-4 bg-white/95 backdrop-blur-lg border-0 shadow-2xl transform transition-all duration-500 rounded-2xl ${
        isAnimating ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
      }`}>
        <div className="p-6 text-center">
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Achievement icon with animation */}
          <div className={`relative mb-6 ${isAnimating ? 'animate-bounce' : ''}`}>
            <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${rarityColors.bg} flex items-center justify-center text-white text-4xl shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300`}>
              {achievement.icon}
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
              <Star className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Achievement title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Achievement Unlocked!
          </h2>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {achievement.title}
          </h3>
          <p className="text-gray-600 mb-4">
            {achievement.description}
          </p>

          {/* Rarity badge */}
          <Badge className={`${rarityColors.badge} mb-4 text-sm font-medium px-3 py-1`}>
            <Crown className="w-3 h-3 mr-1" />
            {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
          </Badge>

          {/* Rewards */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Rewards</p>
                  <p className="text-sm text-gray-600">+{achievement.coins} coins</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Added to your achievements</span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Later
            </Button>
            <Button 
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Awesome!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}