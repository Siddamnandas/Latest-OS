'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp, RefreshCw, Heart, Star, Zap } from 'lucide-react';

interface RasaBalanceWheelProps {
  balance: {
    play: number;
    duty: number;
    balance: number;
  };
  onRebalance: () => void;
}

export function RasaBalanceWheel({ balance, onRebalance }: RasaBalanceWheelProps) {
  const getArchetypeInfo = (type: keyof typeof balance) => {
    switch (type) {
      case 'play':
        return { 
          name: 'Radha-Krishna', 
          emoji: '🎨', 
          color: 'bg-pink-500',
          gradient: 'from-pink-500 to-rose-500',
          bgColor: 'bg-pink-50',
          textColor: 'text-pink-700',
          borderColor: 'border-pink-200',
          description: 'Play & Romance'
        };
      case 'duty':
        return { 
          name: 'Sita-Ram', 
          emoji: '⚖️', 
          color: 'bg-blue-500',
          gradient: 'from-blue-500 to-cyan-500',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
          description: 'Duty & Balance'
        };
      case 'balance':
        return { 
          name: 'Shiva-Shakti', 
          emoji: '🧘', 
          color: 'bg-purple-500',
          gradient: 'from-purple-500 to-violet-500',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-700',
          borderColor: 'border-purple-200',
          description: 'Harmony & Growth'
        };
    }
  };

  const getBalanceStatus = () => {
    const values = Object.values(balance);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const spread = max - min;
    
    if (spread <= 15) return { status: 'balanced', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200', message: 'Perfect Balance! 🌟' };
    if (spread <= 30) return { status: 'slight', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', message: 'Slightly Off Balance ⚖️' };
    return { status: 'imbalanced', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200', message: 'Needs Attention 💡' };
  };

  const balanceStatus = getBalanceStatus();
  
  const lowestArchetype = (Object.entries(balance) as [keyof typeof balance, number][])
    .reduce((min, [key, value]) => value < min[1] ? [key, value] : min, ['play', balance.play])[0];

  const lowestInfo = getArchetypeInfo(lowestArchetype);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Your Rasa Balance
          </h3>
          <p className={`text-sm font-medium ${balanceStatus.color}`}>
            {balanceStatus.message}
          </p>
        </div>
        <Badge variant="outline" className={`bg-white ${balanceStatus.borderColor} ${balanceStatus.color} flex items-center gap-1`}>
          <TrendingUp className="w-3 h-3" />
          Updated Today
        </Badge>
      </div>

      {/* Enhanced Visual Balance Wheel */}
      <div className="relative">
        <div className="w-56 h-56 mx-auto relative">
          {/* Outer glowing ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 blur-xl opacity-30 animate-pulse"></div>
          
          {/* Main wheel container */}
          <div className="absolute inset-2 rounded-full bg-white shadow-2xl">
            <div className="w-full h-full rounded-full relative overflow-hidden">
              {/* Play segment */}
              <div 
                className="absolute top-0 left-0 w-full h-full origin-center"
                style={{
                  transform: `rotate(${balance.play * 3.6}deg)`,
                  background: `conic-gradient(
                    from 0deg,
                    rgb(236 72 153) 0deg,
                    rgb(244 63 94) ${balance.play * 3.6}deg,
                    transparent ${balance.play * 3.6}deg
                  )`
                }}
              ></div>
              
              {/* Duty segment */}
              <div 
                className="absolute top-0 left-0 w-full h-full origin-center"
                style={{
                  transform: `rotate(${(balance.play + balance.duty) * 3.6}deg)`,
                  background: `conic-gradient(
                    from ${balance.play * 3.6}deg,
                    rgb(59 130 246) ${balance.play * 3.6}deg,
                    rgb(6 182 212) ${(balance.play + balance.duty) * 3.6}deg,
                    transparent ${(balance.play + balance.duty) * 3.6}deg
                  )`
                }}
              ></div>
              
              {/* Balance segment */}
              <div 
                className="absolute top-0 left-0 w-full h-full origin-center"
                style={{
                  transform: `rotate(${(balance.play + balance.duty + balance.balance) * 3.6}deg)`,
                  background: `conic-gradient(
                    from ${(balance.play + balance.duty) * 3.6}deg,
                    rgb(147 51 234) ${(balance.play + balance.duty) * 3.6}deg,
                    rgb(124 58 237) ${(balance.play + balance.duty + balance.balance) * 3.6}deg,
                    transparent ${(balance.play + balance.duty + balance.balance) * 3.6}deg
                  )`
                }}
              ></div>
            </div>
            
            {/* Center circle with glass effect */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-white to-gray-50 rounded-full border-4 border-white shadow-xl flex items-center justify-center backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg">
                <Target className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Balance Breakdown */}
      <div className="space-y-4">
        {Object.entries(balance).map(([type, percentage]) => {
          const info = getArchetypeInfo(type as keyof typeof balance);
          return (
            <div key={type} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-lg">{info.emoji}</span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">{info.name}</span>
                    <p className="text-xs text-gray-600">{info.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${info.gradient} transition-all duration-1000 ease-out`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-10 text-right">{percentage}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rebalance Suggestion */}
      {balanceStatus.status !== 'balanced' && (
        <div className={`${lowestInfo.bgColor} rounded-xl p-4 border ${lowestInfo.borderColor} transform hover:scale-105 transition-all duration-300`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${lowestInfo.gradient} flex items-center justify-center text-white shadow-md`}>
              <Star className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-gray-900">Rebalance Suggestion</h4>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            Focus more on <span className={`font-semibold ${lowestInfo.textColor}`}>{lowestInfo.name}</span> activities to restore harmony.
          </p>
          <Button 
            onClick={onRebalance}
            className={`w-full bg-gradient-to-r ${lowestInfo.gradient} hover:opacity-90 text-white font-semibold py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200`}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Get Suggestions
          </Button>
        </div>
      )}
    </div>
  );
}