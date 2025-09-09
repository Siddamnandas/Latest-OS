'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Compass,
  Heart,
  Brain,
  Zap,
  Shield,
  Target,
  Users,
  Star,
  TrendingUp,
  ChevronRight,
  RotateCcw,
  CheckCircle
} from 'lucide-react';

interface ArchetypeBalance {
  rama: number;       // Duty & Honor (Structure, Discipline)
  krishna: number;    // Love & Play (Creativity, Joy, Connection)
  shiva: number;      // Power & Transformation (Inner Strength, Growth)
  lakshmi: number;    // Prosperity & Abundance (Harmony, Sensuality)
}

interface BalanceCompassProps {
  balance?: ArchetypeBalance;
  onBalanceUpdate?: (balance: ArchetypeBalance) => void;
  interactive?: boolean;
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
}

export function BalanceCompass({
  balance = { rama: 25, krishna: 25, shiva: 25, lakshmi: 25 },
  onBalanceUpdate,
  interactive = true,
  size = 'large',
  showLabels = true
}: BalanceCompassProps) {
  const [currentBalance, setCurrentBalance] = useState<ArchetypeBalance>(balance);

  const archetypes = [
    {
      key: 'rama' as keyof ArchetypeBalance,
      name: 'Rama',
      icon: Target,
      color: 'bg-blue-500',
      description: 'Duty & Honor',
      traits: ['Discipline', 'Structure', 'Responsibility'],
      symbol: '⚡'
    },
    {
      key: 'krishna' as keyof ArchetypeBalance,
      name: 'Krishna',
      icon: Heart,
      color: 'bg-pink-500',
      description: 'Love & Play',
      traits: ['Connection', 'Joy', 'Creativity'],
      symbol: '💕'
    },
    {
      key: 'shiva' as keyof ArchetypeBalance,
      name: 'Shiva',
      icon: Zap,
      color: 'bg-purple-500',
      description: 'Power & Growth',
      traits: ['Transformation', 'Strength', 'Wisdom'],
      symbol: '🔥'
    },
    {
      key: 'lakshmi' as keyof ArchetypeBalance,
      name: 'Lakshmi',
      icon: Star,
      color: 'bg-gold-500',
      description: 'Prosperity & Flow',
      traits: ['Harmony', 'Abundance', 'Sensuality'],
      symbol: '✨'
    }
  ];

  useEffect(() => {
    if (onBalanceUpdate) {
      onBalanceUpdate(currentBalance);
    }
  }, [currentBalance, onBalanceUpdate]);

  const updateArchetypeValue = (archetype: keyof ArchetypeBalance, newValue: number) => {
    if (!interactive) return;

    const clampedValue = Math.max(0, Math.min(50, newValue));
    const totalRemaining = 100 - clampedValue;
    const otherArchetypes = ['rama', 'krishna', 'shiva', 'lakshmi'].filter(key =>
      key !== archetype
    ) as (keyof ArchetypeBalance)[];

    // Redistribute remaining points
    const redistributedValue = totalRemaining / otherArchetypes.length;

    setCurrentBalance(prev => {
      const newBalance = {
        ...prev,
        [archetype]: clampedValue
      };

      // Adjust other archetypes to maintain 100% total
      otherArchetypes.forEach(key => {
        newBalance[key] = redistributedValue;
      });

      return newBalance as ArchetypeBalance;
    });
  };

  const getCompassSize = () => {
    switch (size) {
      case 'small':
        return 'w-32 h-32';
      case 'medium':
        return 'w-48 h-48';
      case 'large':
        return 'w-64 h-64';
      default:
        return 'w-64 h-64';
    }
  };

  const getDominantArchetype = () => {
    let dominant = 'rama';
    let maxValue = 0;

    Object.entries(currentBalance).forEach(([key, value]) => {
      if (value > maxValue) {
        maxValue = value;
        dominant = key;
      }
    });

    return archetypes.find(a => a.key === dominant);
  };

  const dominant = getDominantArchetype();

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Compass className="w-6 h-6" />
          Relationship Balance Compass
        </CardTitle>
        <p className="text-sm text-gray-600">
          Discover your dominant relationship archetype and energy patterns
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Dominant Archetype Display */}
        {dominant && (
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <div className="text-2xl mb-2">{dominant.symbol}</div>
            <h3 className="font-bold text-lg">{dominant.name} Energy</h3>
            <p className="text-sm text-gray-600">{dominant.description}</p>
            <div className="flex gap-1 mt-2 justify-center">
              {dominant.traits.map((trait, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {trait}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Compass Visualization */}
        <div className="flex justify-center">
          <div className={`${getCompassSize()} relative rounded-full bg-gradient-to-br from-gray-50 to-gray-200 border-4 border-gray-300 shadow-xl`}>
            {/* Compass Center */}
            <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center border-2 border-gray-200">
              <Star className="w-4 h-4 text-yellow-500" />
            </div>

            {/* Archetype Positions */}
            {archetypes.map((archetype, index) => {
              const angle = (360 / archetypes.length) * index;
              const radius = size === 'large' ? 24 : size === 'medium' ? 18 : 12;
              const x = radius * Math.cos((angle - 90) * Math.PI / 180);
              const y = radius * Math.sin((angle - 90) * Math.PI / 180);

              return (
                <div
                  key={archetype.key}
                  className={`absolute w-8 h-8 ${archetype.color} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg`}
                  style={{
                    left: `calc(50% + ${x}px - 16px)`,
                    top: `calc(50% + ${y}px - 16px)`,
                  }}
                >
                  {archetype.symbol}
                </div>
              );
            })}
          </div>
        </div>

        {/* Balance Indicators */}
        <div className="space-y-3">
          {archetypes.map((archetype) => {
            const IconComponent = archetype.icon;
            const value = currentBalance[archetype.key];

            return (
              <div key={archetype.key} className="space-y-2">
                {showLabels && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      <span className="font-medium">{archetype.name}</span>
                    </div>
                    <Badge variant="outline">{value}%</Badge>
                  </div>
                )}

                {interactive ? (
                  <div
                    className="relative bg-gray-200 rounded-full h-3 cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      updateArchetypeValue(archetype.key, percent * 50);
                    }}
                  >
                    <div
                      className={`${archetype.color} h-full rounded-full transition-all duration-300`}
                      style={{ width: `${(value / 50) * 100}%` }}
                    />
                    <div
                      className="absolute -top-1 w-4 h-5 bg-white border-2 border-gray-300 rounded-full shadow-md cursor-move"
                      style={{
                        left: `${(value / 50) * 100}%`,
                        transform: 'translateX(-50%)'
                      }}
                    />
                  </div>
                ) : (
                  <Progress value={(value / 50) * 100} className="h-3" />
                )}

                <div className="flex justify-between text-xs text-gray-500">
                  <span>{archetype.traits[0]}</span>
                  <span>{archetype.traits[1]}</span>
                  <span>{archetype.traits[2]}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Balance Insights */}
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
          <div className="text-center">
            <h4 className="font-semibold text-indigo-900 mb-2">Balance Insights</h4>
            <p className="text-sm text-indigo-700">
              Your dominant {dominant?.name} energy ({Math.round(currentBalance[dominant?.key as keyof ArchetypeBalance] || 0)}%)
              suggests you thrive in {dominant?.description.toLowerCase()} patterns.
            </p>
          </div>
        </div>

        {/* Archetype Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {archetypes.map((archetype) => (
            <Card key={archetype.key} className="border-0 bg-gray-50">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 ${archetype.color} rounded-full`} />
                  <span className="font-medium text-sm">{archetype.name}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {archetype.description}: Focus on {archetype.traits.slice(0, 2).join(' and ')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default BalanceCompass;
