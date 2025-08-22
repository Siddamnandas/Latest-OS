'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Baby, 
  Heart, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Target, 
  Award,
  Plus,
  ChevronRight,
  Clock,
  Star,
  CheckCircle
} from 'lucide-react';

interface Child {
  id: string;
  name: string;
  age: number;
  avatar: string;
  milestones: ChildMilestone[];
  activities: ChildActivity[];
  developmentScore: number;
}

interface ChildMilestone {
  id: string;
  title: string;
  category: 'physical' | 'cognitive' | 'emotional' | 'social';
  ageAchieved: number;
  date: string;
  isAchieved: boolean;
  importance: 'low' | 'medium' | 'high';
}

interface ChildActivity {
  id: string;
  title: string;
  type: 'learning' | 'play' | 'family' | 'routine';
  duration: number;
  completed: boolean;
  date: string;
  participants: string[];
}

interface FamilyIntegrationProps {
  children: Child[];
  onAddChild: () => void;
  onLogActivity: (childId: string, activity: Partial<ChildActivity>) => void;
}

export function FamilyIntegration({ children, onAddChild, onLogActivity }: FamilyIntegrationProps) {
  const [selectedChild, setSelectedChild] = useState(children[0]);
  const [activeTab, setActiveTab] = useState('overview');

  if (!selectedChild) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <Baby className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <h3 className="text-lg font-semibold">No children found</h3>
          <p className="text-sm text-gray-500 mb-4">Add a child to get started.</p>
          <Button onClick={onAddChild} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Child
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getMilestoneIcon = (category: string) => {
    switch (category) {
      case 'physical': return '🏃';
      case 'cognitive': return '🧠';
      case 'emotional': return '💝';
      case 'social': return '👥';
      default: return '⭐';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'learning': return '📚';
      case 'play': return '🎮';
      case 'family': return '👨‍👩‍👧‍👦';
      case 'routine': return '🔄';
      default: return '📅';
    }
  };

  const getDevelopmentColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMilestoneColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const upcomingMilestones = selectedChild.milestones.filter(m => !m.isAchieved);
  const recentActivities = selectedChild.activities.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Child Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Children</h3>
            <Button onClick={onAddChild} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Child
            </Button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`flex flex-col items-center p-3 rounded-lg border min-w-[100px] transition-all ${
                  selectedChild.id === child.id 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Avatar className="w-12 h-12 mb-2">
                  <AvatarImage src={child.avatar} />
                  <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{child.name}</span>
                <span className="text-xs text-gray-500">{child.age}y</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Development Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Development Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Development</span>
                  <span className={`text-lg font-bold ${getDevelopmentColor(selectedChild.developmentScore)}`}>
                    {selectedChild.developmentScore}%
                  </span>
                </div>
                <Progress value={selectedChild.developmentScore} className="h-3" />
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedChild.milestones.filter(m => m.isAchieved).length}
                    </div>
                    <div className="text-sm text-gray-600">Milestones Achieved</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedChild.activities.filter(a => a.completed).length}
                    </div>
                    <div className="text-sm text-gray-600">Activities Completed</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Upcoming Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingMilestones.slice(0, 3).map((milestone) => (
                  <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getMilestoneIcon(milestone.category)}</span>
                      <div>
                        <div className="font-medium">{milestone.title}</div>
                        <div className="text-sm text-gray-500">Expected: {milestone.ageAchieved} months</div>
                      </div>
                    </div>
                    <Badge className={getMilestoneColor(milestone.importance)}>
                      {milestone.importance}
                    </Badge>
                  </div>
                ))}
                {upcomingMilestones.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>All milestones achieved! 🎉</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getActivityIcon(activity.type)}</span>
                      <div>
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-sm text-gray-500">{activity.duration} min</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {activity.completed && <CheckCircle className="w-4 h-4 text-green-600" />}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedChild.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getMilestoneIcon(milestone.category)}</span>
                      <div>
                        <div className="font-medium">{milestone.title}</div>
                        <div className="text-sm text-gray-500">
                          {milestone.category.charAt(0).toUpperCase() + milestone.category.slice(1)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getMilestoneColor(milestone.importance)}>
                        {milestone.importance}
                      </Badge>
                      {milestone.isAchieved ? (
                        <Badge className="bg-green-100 text-green-700">Achieved</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Activity Log</span>
                <Button size="sm" onClick={() => onLogActivity(selectedChild.id, {})}>
                  <Plus className="w-4 h-4 mr-2" />
                  Log Activity
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedChild.activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                      <div>
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-sm text-gray-500">
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} • {activity.duration} min
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                      {activity.completed && <CheckCircle className="w-4 h-4 text-green-600" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                AI Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium mb-2">Development Focus Areas</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Based on {selectedChild.name}'s current progress, we recommend focusing on:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-purple-100 text-purple-700">Language Development</Badge>
                    <Badge className="bg-purple-100 text-purple-700">Social Skills</Badge>
                    <Badge className="bg-purple-100 text-purple-700">Motor Skills</Badge>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Activity Suggestions</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Daily reading sessions (15-20 minutes)</li>
                    <li>• Interactive play with peers</li>
                    <li>• Outdoor physical activities</li>
                    <li>• Creative expression through art</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium mb-2">Parenting Tips</h4>
                  <p className="text-sm text-gray-700">
                    Encourage independence while providing support. Celebrate small achievements 
                    and maintain consistent routines for optimal development.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}