'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Flame, 
  Star, 
  Trophy, 
  Sparkles, 
  Gift,
  Target,
  Heart,
  Zap
} from 'lucide-react';

interface StreakCelebrationProps {
  streak: number;
  coins: number;
  onClose: () => void;
}

export function StreakCelebration({ streak, coins, onClose }: StreakCelebrationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationStep(1), 500);
    const timer2 = setTimeout(() => setAnimationStep(2), 1000);
    const timer3 = setTimeout(() => setAnimationStep(3), 1500);
    const timer4 = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onClose]);

  if (!isVisible) return null;

  const getAchievementMessage = () => {
    if (streak >= 30) return "Amazing! You're a relationship master! 🏆";
    if (streak >= 14) return "Incredible! Two weeks of dedication! ⭐";
    if (streak >= 7) return "Wonderful! One week strong! 🔥";
    if (streak >= 3) return "Great start! Keep it going! 💪";
    return "Welcome back! Let's build something amazing! ✨";
  };

  const getRewardCoins = () => {
    if (streak >= 30) return 100;
    if (streak >= 14) return 50;
    if (streak >= 7) return 30;
    if (streak >= 3) return 20;
    return 10;
  };

  const rewardCoins = getRewardCoins();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`transform transition-all duration-1000 ${
        animationStep === 0 ? 'scale-0 opacity-0' :
        animationStep === 1 ? 'scale-110 opacity-100' :
        animationStep === 2 ? 'scale-100' :
        'scale-95 opacity-0'
      }`}>
        <Card className="w-80 mx-auto bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white shadow-2xl">
          <CardContent className="p-6 text-center">
            {/* Animated Icons */}
            <div className="relative mb-4">
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                animationStep >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`}>
                <Flame className="w-16 h-16 text-orange-300 animate-pulse" />
              </div>
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                animationStep >= 2 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`}>
                <Star className="w-16 h-16 text-yellow-300 animate-bounce" />
              </div>
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                animationStep >= 3 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`}>
                <Trophy className="w-16 h-16 text-yellow-400 animate-pulse" />
              </div>
            </div>

            {/* Streak Counter */}
            <div className="mb-4">
              <div className="text-4xl font-bold mb-2 animate-pulse">
                {streak} Days
              </div>
              <div className="text-lg font-medium mb-1">
                {getAchievementMessage()}
              </div>
            </div>

            {/* Rewards */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center gap-2">
                <Gift className="w-5 h-5 text-yellow-300" />
                <span className="text-sm">Daily Reward:</span>
                <Badge variant="secondary" className="bg-yellow-400 text-yellow-900">
                  +{rewardCoins} Lakshmi Coins
                </Badge>
              </div>
              
              {streak >= 7 && (
                <div className="flex items-center justify-center gap-2">
                  <Target className="w-5 h-5 text-green-300" />
                  <span className="text-sm">Weekly Bonus:</span>
                  <Badge variant="secondary" className="bg-green-400 text-green-900">
                    +{rewardCoins * 2} Coins
                  </Badge>
                </div>
              )}
            </div>

            {/* Progress to Next Milestone */}
            <div className="mb-6">
              <div className="text-sm mb-2 opacity-90">Next Milestone:</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(streak % 7) * 14.28}%` }}
                  ></div>
                </div>
                <span className="text-xs">{7 - (streak % 7)} days</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={onClose}
              >
                Awesome!
              </Button>
              <Button 
                size="sm"
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-yellow-900"
              >
                Share <Sparkles className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* Floating Emojis */}
            <div className="absolute -top-4 -right-4 text-2xl animate-bounce">✨</div>
            <div className="absolute -bottom-4 -left-4 text-2xl animate-bounce" style={{animationDelay: '0.5s'}}>💖</div>
            <div className="absolute -top-4 -left-4 text-2xl animate-bounce" style={{animationDelay: '1s'}}>⚡</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}