'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Coins, 
  Flame, 
  Star, 
  Crown,
  Gift,
  Target,
  Zap,
  Award,
  Sparkles
} from 'lucide-react';

interface CoinStreakAnimationProps {
  coins: number;
  streak: number;
  onCoinClick: () => void;
  onStreakClick: () => void;
}

export function CoinStreakAnimation({ coins, streak, onCoinClick, onStreakClick }: CoinStreakAnimationProps) {
  const [isCoinAnimating, setIsCoinAnimating] = useState(false);
  const [isStreakAnimating, setIsStreakAnimating] = useState(false);
  const [showCoinParticles, setShowCoinParticles] = useState(false);
  const [showStreakParticles, setShowStreakParticles] = useState(false);

  const handleCoinClick = () => {
    setIsCoinAnimating(true);
    setShowCoinParticles(true);
    onCoinClick();
    
    setTimeout(() => {
      setIsCoinAnimating(false);
      setShowCoinParticles(false);
    }, 1000);
  };

  const handleStreakClick = () => {
    setIsStreakAnimating(true);
    setShowStreakParticles(true);
    onStreakClick();
    
    setTimeout(() => {
      setIsStreakAnimating(false);
      setShowStreakParticles(false);
    }, 1000);
  };

  const getStreakLevel = (streak: number) => {
    if (streak >= 30) return { level: 'Legendary', color: 'text-yellow-600', emoji: '🔥' };
    if (streak >= 14) return { level: 'Epic', color: 'text-purple-600', emoji: '⚡' };
    if (streak >= 7) return { level: 'Hot', color: 'text-orange-600', emoji: '✨' };
    if (streak >= 3) return { level: 'Warm', color: 'text-blue-600', emoji: '🌟' };
    return { level: 'New', color: 'text-gray-600', emoji: '🌱' };
  };

  const getCoinLevel = (coins: number) => {
    if (coins >= 1000) return { level: 'Wealthy', color: 'text-yellow-600', emoji: '💰' };
    if (coins >= 500) return { level: 'Rich', color: 'text-green-600', emoji: '💎' };
    if (coins >= 250) return { level: 'Prosperous', color: 'text-blue-600', emoji: '🪙' };
    if (coins >= 100) return { level: 'Growing', color: 'text-purple-600', emoji: '🌱' };
    return { level: 'Starting', color: 'text-gray-600', emoji: '🌟' };
  };

  const streakInfo = getStreakLevel(streak);
  const coinInfo = getCoinLevel(coins);

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Coin Card */}
      <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden rounded-2xl">
        {/* Animated background particles */}
        {showCoinParticles && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`
                }}
              />
            ))}
          </div>
        )}
        
        <div className="p-4 text-center" onClick={handleCoinClick}>
          <div className={`relative mb-3 ${isCoinAnimating ? 'animate-bounce' : ''}`}>
            <div className="w-12 h-12 mx-auto bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
              <Coins className={`w-6 h-6 ${isCoinAnimating ? 'animate-spin' : ''}`} />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
              <span className="text-xs">{coinInfo.emoji}</span>
            </div>
          </div>
          
          <div className="text-2xl font-bold mb-1">{coins}</div>
          <div className="text-xs opacity-90 mb-2">Lakshmi Coins</div>
          <Badge className="bg-white/20 text-white border-white/30 text-xs">
            {coinInfo.level}
          </Badge>
        </div>
      </div>

      {/* Streak Card */}
      <div className="relative bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden rounded-2xl">
        {/* Animated background particles */}
        {showStreakParticles && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`
                }}
              />
            ))}
          </div>
        )}
        
        <div className="p-4 text-center" onClick={handleStreakClick}>
          <div className={`relative mb-3 ${isStreakAnimating ? 'animate-pulse' : ''}`}>
            <div className="w-12 h-12 mx-auto bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
              <Flame className={`w-6 h-6 ${isStreakAnimating ? 'animate-bounce' : ''}`} />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
              <span className="text-xs">{streakInfo.emoji}</span>
            </div>
          </div>
          
          <div className="text-2xl font-bold mb-1">{streak}</div>
          <div className="text-xs opacity-90 mb-2">Day Streak</div>
          <Badge className="bg-white/20 text-white border-white/30 text-xs">
            {streakInfo.level}
          </Badge>
        </div>
      </div>
    </div>
  );
}