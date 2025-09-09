'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Cloud,
  MapPin,
  Calendar,
  Zap,
  CheckCircle,
  X,
  Star,
  Bell,
  Heart,
  Clock,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContextualNudge {
  id: string;
  type: 'activity' | 'reminder' | 'connect' | 'reflect';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  ambientContext: string;
  suggestedTime?: string;
  confidence: number;
  reason: string;
}

interface ContextualNudgeCardProps {
  nudge: ContextualNudge;
  onDismiss: (nudgeId: string) => void;
  onAccept: (nudge: ContextualNudge) => void;
  onSnooze: (nudgeId: string) => void;
}

export function ContextualNudgeCard({ nudge, onDismiss, onAccept, onSnooze }: ContextualNudgeCardProps) {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'activity':
        return <Zap className="w-4 h-4" />;
      case 'reminder':
        return <Bell className="w-4 h-4" />;
      case 'connect':
        return <Heart className="w-4 h-4" />;
      case 'reflect':
        return <Star className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'activity':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'reminder':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'connect':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'reflect':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAccept = () => {
    onAccept(nudge);
    toast({
      title: "Nudge Accepted! 🎉",
      description: `Great! I'll help with: ${nudge.title}`,
      duration: 2000,
    });
  };

  const handleDismiss = () => {
    onDismiss(nudge.id);
    toast({
      title: "Nudge Dismissed",
      description: "I'll suggest this again later if the opportunity arises.",
      duration: 2000,
    });
  };

  const handleSnooze = () => {
    onSnooze(nudge.id);
    toast({
      title: "Nudge Snoozed",
      description: "I'll remind you again in a couple of hours.",
      duration: 2000,
    });
  };

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-lg border-l-4 ${
        nudge.priority === 'high' ? 'border-l-red-500' :
        nudge.priority === 'medium' ? 'border-l-yellow-500' :
        'border-l-green-500'
      } ${isHovered ? 'scale-105' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getTypeColor(nudge.type)}`}>
              {getTypeIcon(nudge.type)}
            </div>
            <div>
              <CardTitle className="text-lg font-bold">{nudge.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`text-xs ${getPriorityColor(nudge.priority)}`}>
                  {nudge.priority.toUpperCase()} PRIORITY
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {Math.round(nudge.confidence * 100)}% confidence
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-700 leading-relaxed">{nudge.message}</p>

        {/* Ambient Context */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
            <Cloud className="w-4 h-4" />
            Context: {nudge.ambientContext}
          </div>
          <p className="text-xs text-gray-600 mt-1">{nudge.reason}</p>
        </div>

        {/* Suggested Time */}
        {nudge.suggestedTime && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-orange-700 font-medium">
              <Clock className="w-4 h-4" />
              Suggested Time: {nudge.suggestedTime}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={handleAccept}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Do This!
          </Button>

          <Button
            variant="outline"
            onClick={handleSnooze}
            className="flex-auto"
          >
            <Clock className="w-4 h-4 mr-2" />
            Snooze
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function AmbientDataDisplay({
  ambientData,
  onSettingChange
}: {
  ambientData: any;
  onSettingChange?: (key: string, value: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Weather Display */}
      {ambientData.weather && (
        <Alert className="border-blue-200 bg-blue-50">
          <Cloud className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Current Weather: {ambientData.weather.condition.charAt(0).toUpperCase() + ambientData.weather.condition.slice(1)} •
            {ambientData.weather.temperature}°C • {ambientData.weather.humidity}% humidity
          </AlertDescription>
        </Alert>
      )}

      {/* Location Display */}
      {ambientData.location && (
        <Alert className="border-green-200 bg-green-50">
          <MapPin className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Location: {ambientData.location.city}, {ambientData.location.country} •
            {ambientData.location.timezone} timezone
          </AlertDescription>
        </Alert>
      )}

      {/* Calendar Insights */}
      {ambientData.calendar && ambientData.calendar.todayEvents.length > 0 && (
        <Alert className="border-purple-200 bg-purple-50">
          <Calendar className="w-4 h-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            Today's Schedule: {ambientData.calendar.todayEvents.length} events •
            Tomorrow: {ambientData.calendar.tomorrowEvents.length} events
          </AlertDescription>
        </Alert>
      )}

      {/* Ambient Controls */}
      {onSettingChange && (
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-gray-600">
              💡 These ambient insights are used to provide you with more personalized AI nudges and activity suggestions.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
