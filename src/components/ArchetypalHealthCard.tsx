'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp, Heart, ChevronDown, ChevronUp } from 'lucide-react';

interface ArchetypalBalance {
  krishna: number;
  ram: number;
  shiva: number;
}

interface ArchetypalHealthCardProps {
  balance?: ArchetypalBalance;
  onRebalance?: () => void;
  compact?: boolean;
}

export function ArchetypalHealthCard({
  balance = { krishna: 65, ram: 45, shiva: 30 },
  onRebalance,
  compact = false
}: ArchetypalHealthCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getArchetypeInfo = (type: keyof ArchetypalBalance) => {
    switch (type) {
      case 'krishna':
        return {
          name: 'Krishna',
          fullName: 'Playful Love',
          emoji: '💙',
          color: 'bg-blue-500',
          gradient: 'from-blue-500 to-cyan-500',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          description: 'Joy, spontaneity, romance'
        };
      case 'ram':
        return {
          name: 'Ram',
          fullName: 'Devoted Partnership',
          emoji: '🤝',
          color: 'bg-yellow-500',
          gradient: 'from-yellow-500 to-orange-500',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          description: 'Commitment, service, partnership'
        };
      case 'shiva':
        return {
          name: 'Shiva',
          fullName: 'Individual Wholeness',
          emoji: '🧘',
          color: 'bg-purple-500',
          gradient: 'from-purple-500 to-violet-500',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-700',
          description: 'Inner peace, self-awareness'
        };
    }
  };

  const getOverallHealth = () => {
    const values = Object.values(balance);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const spread = max - min;

    if (spread <= 10) return 'Excellent Balance';
    if (spread <= 20) return 'Good Balance';
    if (spread <= 30) return 'Needs Attention';
    return 'Significant Imbalance';
  };

  const getHealthColor = () => {
    const health = getOverallHealth();
    switch (health) {
      case 'Excellent Balance': return 'text-green-700 bg-green-50';
      case 'Good Balance': return 'text-blue-700 bg-blue-50';
      case 'Needs Attention': return 'text-yellow-700 bg-yellow-50';
      case 'Significant Imbalance': return 'text-red-700 bg-red-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  const sortedArchetypes = Object.entries(balance)
    .sort(([,a], [,b]) => b - a)
    .map(([key, value]) => ({ key: key as keyof ArchetypalBalance, value }));

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-all duration-300 border-purple-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Relationship Balance
              </h3>
              <p className="text-sm text-gray-600">Sacred Archetypal Harmony</p>
            </div>
          </div>
          <Badge className={`px-3 py-1 rounded-full text-xs font-medium ${getHealthColor()}`}>
            <TrendingUp className="w-3 h-3 mr-1" />
            {getOverallHealth()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Archetypal Balance Display */}
        <div className="grid grid-cols-3 gap-3">
          {sortedArchetypes.map(({ key, value }) => {
            const info = getArchetypeInfo(key);
            return (
              <div
                key={key}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200 text-center"
              >
                <div className={`w-8 h-8 mx-auto mb-2 bg-gradient-to-br ${info.gradient} rounded-lg flex items-center justify-center text-white shadow-md`}>
                  <span className="text-lg">{info.emoji}</span>
                </div>
                <div className={`text-xl font-bold ${info.textColor}`}>
                  {value}%
                </div>
                <div className="text-xs font-medium text-gray-700">
                  {info.name}
                </div>
                {!compact && (
                  <div className="text-xs text-gray-500 mt-1 leading-tight">
                    {info.description.split(', ')[0]}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Expandable Details */}
        {expanded && !compact && (
          <div className="space-y-3 pt-3 border-t border-gray-200">
            {Object.entries(balance).map(([type, percentage]) => {
              const info = getArchetypeInfo(type as keyof ArchetypalBalance);
              return (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{info.emoji}</span>
                      <span className="font-medium text-gray-900">{info.name}</span>
                      <span className="text-sm text-gray-500">({info.fullName})</span>
                    </div>
                    <span className={`font-bold ${info.textColor}`}>{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 bg-gradient-to-r ${info.gradient} rounded-full transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">{info.description}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                See Details
              </>
            )}
          </Button>

          {onRebalance && (
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              onClick={onRebalance}
            >
              <Target className="w-4 h-4 mr-1" />
              Rebalance
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ArchetypalHealthCard;
