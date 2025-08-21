'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Heart, 
  Brain, 
  Users, 
  Target,
  Lightbulb,
  Clock,
  Star,
  Zap
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'strength' | 'opportunity' | 'trend' | 'milestone';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
  category: string;
  timestamp: string;
}

interface RelationshipInsightsProps {
  insights: Insight[];
  onAction: (insightId: string) => void;
}

export function RelationshipInsights({ insights, onAction }: RelationshipInsightsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [animatingInsight, setAnimatingInsight] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All', icon: Brain, color: 'bg-purple-100 text-purple-700' },
    { id: 'communication', label: 'Communication', icon: Heart, color: 'bg-pink-100 text-pink-700' },
    { id: 'emotional', label: 'Emotional', icon: Star, color: 'bg-yellow-100 text-yellow-700' },
    { id: 'practical', label: 'Practical', icon: Target, color: 'bg-blue-100 text-blue-700' },
    { id: 'growth', label: 'Growth', icon: TrendingUp, color: 'bg-green-100 text-green-700' },
  ];

  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === selectedCategory);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return <Star className="w-5 h-5 text-yellow-500" />;
      case 'opportunity': return <Lightbulb className="w-5 h-5 text-blue-500" />;
      case 'trend': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'milestone': return <Heart className="w-5 h-5 text-pink-500" />;
      default: return <Brain className="w-5 h-5 text-purple-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAction = (insightId: string) => {
    setAnimatingInsight(insightId);
    setTimeout(() => {
      onAction(insightId);
      setAnimatingInsight(null);
    }, 300);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Relationship Insights
          </h3>
          <p className="text-sm text-gray-600">Personalized analysis powered by your relationship data</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          Updated Today
        </Badge>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 ${selectedCategory === category.id ? 'bg-purple-600' : ''}`}
            >
              <Icon className="w-4 h-4 mr-1" />
              {category.label}
            </Button>
          );
        })}
      </div>

      {/* Insights Grid */}
      <div className="grid gap-4">
        {filteredInsights.map((insight) => (
          <Card 
            key={insight.id}
            className={`transition-all duration-300 hover:shadow-md ${
              animatingInsight === insight.id ? 'scale-95 opacity-50' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-50">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className={getImpactColor(insight.impact)}>
                    {insight.impact} impact
                  </Badge>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(insight.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">AI Confidence</span>
                  <span className="text-xs font-medium">{insight.confidence}%</span>
                </div>
                <Progress value={insight.confidence} className="h-2" />
              </div>

              {/* Action Button */}
              {insight.actionable && (
                <Button 
                  size="sm" 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => handleAction(insight.id)}
                >
                  Explore This Insight
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredInsights.length === 0 && (
        <Card className="bg-gray-50">
          <CardContent className="p-8 text-center">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="font-medium text-gray-700 mb-2">No insights yet</h4>
            <p className="text-sm text-gray-500">
              Complete more activities to unlock personalized AI insights about your relationship.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}