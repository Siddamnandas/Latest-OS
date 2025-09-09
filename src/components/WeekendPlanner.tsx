'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Calendar,
  MapPin,
  Clock,
  Heart,
  Sun,
  Moon,
  Star,
  Zap,
  Sparkles,
  CheckCircle2,
  XCircle,
  Send,
  Loader2,
  Shuffle,
  RefreshCw,
  Edit3,
  Save,
  Trash2,
  Users,
  TreePine
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WeekendActivity {
  id: string;
  title: string;
  description: string;
  timeSuggestion: string;
  duration: number;
  location: string;
  category: 'adventure' | 'romance' | 'relaxation' | 'cuisine' | 'culture' | 'nature';
  cost: 'free' | 'low' | 'medium' | 'high';
  weatherDependent: boolean;
  romanceLevel: 1 | 2 | 3 | 4 | 5;
  intensity: 'relaxed' | 'moderate' | 'active';
  points: number;
}

interface WeekendPlan {
  id: string;
  activities: WeekendActivity[];
  totalPoints: number;
  romanceScore: number;
  weatherGoodScore: number;
  estimatedCost: string;
  totalDuration: number;
  createdAt: Date;
  status: 'draft' | 'sent' | 'accepted' | 'completed';
  partnerFeedback?: string;
}

interface WeekendPreferences {
  romanceLevel: number;
  activityType: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'all-day';
  budget: 'free' | 'low' | 'medium' | 'high';
  weather: 'any' | 'good';
  location: 'local' | 'small-trip' | 'any';
}

export function WeekendPlanner({ partnerInfo = { name: "Priya", isOnline: true } }) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<WeekendPlan | null>(null);
  const [showPlanCustomization, setShowPlanCustomization] = useState(false);
  const [editingActivity, setEditingActivity] = useState<WeekendActivity | null>(null);
  const [customActivity, setCustomActivity] = useState<Partial<WeekendActivity>>({
    title: '',
    description: '',
    timeSuggestion: '',
    duration: 60,
    location: ''
  });

  const [preferences, setPreferences] = useState<WeekendPreferences>({
    romanceLevel: 3,
    activityType: 'mixed',
    timeOfDay: 'afternoon',
    budget: 'medium',
    weather: 'any',
    location: 'local'
  });

  // Pre-generated activity pools for different categories
  const activityPool: WeekendActivity[] = [
    // Romance Activities
    {
      id: 'r1',
      title: 'Romantic Dinner at Sunset',
      description: 'Watch the sunset over candles and great food together',
      timeSuggestion: 'Saturday Evening',
      duration: 90,
      location: 'Restaurant with outdoor seating',
      category: 'romance',
      cost: 'medium',
      weatherDependent: true,
      romanceLevel: 5,
      intensity: 'relaxed',
      points: 50
    },
    {
      id: 'r2',
      title: 'Candlelit Picnic',
      description: 'Pack a picnic basket and enjoy nature in your special spot',
      timeSuggestion: 'Saturday Afternoon',
      duration: 120,
      location: 'Local park or beach',
      category: 'romance',
      cost: 'low',
      weatherDependent: true,
      romanceLevel: 4,
      intensity: 'relaxed',
      points: 40
    },
    {
      id: 'r3',
      title: 'Stars & Stories Night',
      description: 'Stargaze while sharing your favorite love stories',
      timeSuggestion: 'Saturday Evening',
      duration: 90,
      location: 'Backyard or hilltop',
      category: 'romance',
      cost: 'free',
      weatherDependent: false,
      romanceLevel: 4,
      intensity: 'relaxed',
      points: 35
    },

    // Adventure Activities
    {
      id: 'a1',
      title: 'Day Hike Adventure',
      description: 'Explore a scenic trail and discover hidden gems',
      timeSuggestion: 'Sunday Morning',
      duration: 180,
      location: 'Local hiking trails',
      category: 'adventure',
      cost: 'free',
      weatherDependent: true,
      romanceLevel: 3,
      intensity: 'active',
      points: 60
    },
    {
      id: 'a2',
      title: 'Kayaking or Paddleboarding',
      description: 'Navigate peaceful waters and enjoy the flow',
      timeSuggestion: 'Saturday Afternoon',
      duration: 120,
      location: 'Lake or river',
      category: 'adventure',
      cost: 'medium',
      weatherDependent: true,
      romanceLevel: 3,
      intensity: 'moderate',
      points: 50
    },
    {
      id: 'a3',
      title: 'City Exploration Quest',
      description: 'Create a scavenger hunt through nearby neighborhoods',
      timeSuggestion: 'Saturday Afternoon',
      duration: 150,
      location: 'Downtown area',
      category: 'adventure',
      cost: 'low',
      weatherDependent: false,
      romanceLevel: 2,
      intensity: 'moderate',
      points: 45
    },

    // Relaxation Activities
    {
      id: 'rx1',
      title: 'Spa Day at Home',
      description: 'Create homemade face masks and give massage treatments',
      timeSuggestion: 'Sunday Afternoon',
      duration: 90,
      location: 'At home',
      category: 'relaxation',
      cost: 'low',
      weatherDependent: false,
      romanceLevel: 4,
      intensity: 'relaxed',
      points: 35
    },
    {
      id: 'rx2',
      title: 'Forest Bathing Walk',
      description: 'Practice mindful nature immersion slowly',
      timeSuggestion: 'Sunday Morning',
      duration: 60,
      location: 'Nearby woods or park',
      category: 'relaxation',
      cost: 'free',
      weatherDependent: false,
      romanceLevel: 3,
      intensity: 'relaxed',
      points: 25
    },
    {
      id: 'rx3',
      title: 'Couple\'s Meditation Session',
      description: 'Guide each other through peaceful meditation',
      timeSuggestion: 'Saturday Morning',
      duration: 45,
      location: 'Quiet corner at home',
      category: 'relaxation',
      cost: 'free',
      weatherDependent: false,
      romanceLevel: 4,
      intensity: 'relaxed',
      points: 30
    },

    // Cuisine Activities
    {
      id: 'c1',
      title: 'Cook-off Competition',
      description: 'Challenge each other to create the best dish',
      timeSuggestion: 'Saturday Evening',
      duration: 120,
      location: 'Home kitchen',
      category: 'cuisine',
      cost: 'medium',
      weatherDependent: false,
      romanceLevel: 3,
      intensity: 'moderate',
      points: 55
    },
    {
      id: 'c2',
      title: 'Farmers Market Adventure',
      description: 'Shop for fresh ingredients and try new foods',
      timeSuggestion: 'Saturday Morning',
      duration: 90,
      location: 'Local farmers market',
      category: 'cuisine',
      cost: 'low',
      weatherDependent: false,
      romanceLevel: 2,
      intensity: 'moderate',
      points: 35
    },
    {
      id: 'c3',
      title: 'Wine Tasting & Discussion',
      description: 'Sample wines and discuss flavors and aromas',
      timeSuggestion: 'Saturday Evening',
      duration: 120,
      location: 'Home or local winery',
      category: 'cuisine',
      cost: 'high',
      weatherDependent: false,
      romanceLevel: 4,
      intensity: 'relaxed',
      points: 65
    },

    // Culture Activities
    {
      id: 'cu1',
      title: 'Local Museum Visit',
      description: 'Explore art, history, and culture together',
      timeSuggestion: 'Sunday Afternoon',
      duration: 90,
      location: 'Local museum or art gallery',
      category: 'culture',
      cost: 'low',
      weatherDependent: false,
      romanceLevel: 2,
      intensity: 'moderate',
      points: 40
    },
    {
      id: 'cu2',
      title: 'Theater or Concert Night',
      description: 'Enjoy live music, comedy, or theater performance',
      timeSuggestion: 'Saturday Evening',
      duration: 150,
      location: 'Theater or concert hall',
      category: 'culture',
      cost: 'high',
      weatherDependent: false,
      romanceLevel: 4,
      intensity: 'relaxed',
      points: 70
    },
    {
      id: 'cu3',
      title: 'Street Art Walking Tour',
      description: 'Discover local murals and artistic expressions',
      timeSuggestion: 'Saturday Afternoon',
      duration: 90,
      location: 'Downtown or art district',
      category: 'culture',
      cost: 'free',
      weatherDependent: false,
      romanceLevel: 2,
      intensity: 'moderate',
      points: 30
    },

    // Nature Activities
    {
      id: 'n1',
      title: 'Sunset Beach Walk',
      description: 'Stroll hand in hand as the sun sets',
      timeSuggestion: 'Sunday Evening',
      duration: 60,
      location: 'Beach or waterfront',
      category: 'nature',
      cost: 'free',
      weatherDependent: true,
      romanceLevel: 5,
      intensity: 'relaxed',
      points: 45
    },
    {
      id: 'n2',
      title: 'Birdwatching Adventure',
      description: 'Learn about local birds and their songs',
      timeSuggestion: 'Sunday Morning',
      duration: 90,
      location: 'Park or nature area',
      category: 'nature',
      cost: 'free',
      weatherDependent: true,
      romanceLevel: 2,
      intensity: 'relaxed',
      points: 20
    },
    {
      id: 'n3',
      title: 'Campfire Storytelling',
      description: 'Share stories and dreams under the stars',
      timeSuggestion: 'Saturday Evening',
      duration: 120,
      location: 'Backyard or campsite',
      category: 'nature',
      cost: 'low',
      weatherDependent: true,
      romanceLevel: 4,
      intensity: 'relaxed',
      points: 40
    }
  ];

  const generateWeekendPlan = () => {
    setIsGenerating(true);

    // Simulate AI plan generation (could be replaced with actual AI integration)
    setTimeout(() => {
      const selectedActivities: WeekendActivity[] = [];

      // Filter activities based on preferences
      let filteredActivities = activityPool;

      if (preferences.activityType !== 'mixed') {
        filteredActivities = filteredActivities.filter(a => a.category === preferences.activityType);
      }

      if (preferences.budget !== 'free') {
        filteredActivities = filteredActivities.filter(a => a.cost === preferences.budget);
      }

      if (preferences.weather !== 'any') {
        filteredActivities = filteredActivities.filter(a => !a.weatherDependent);
      }

      // Select diverse activities (1 from each category if available)
      const categories = ['romance', 'adventure', 'relaxation', 'cuisine'];
      categories.forEach(category => {
        const categoryActivities = filteredActivities.filter(a => a.category === category);
        if (categoryActivities.length > 0) {
          const randomActivity = categoryActivities[Math.floor(Math.random() * categoryActivities.length)];
          if (!selectedActivities.find(a => a.id === randomActivity.id)) {
            selectedActivities.push(randomActivity);
          }
        }
      });

      // Ensure we have at least 3 activities
      while (selectedActivities.length < 3 && filteredActivities.length > selectedActivities.length) {
        const remainingActivities = filteredActivities.filter(a => !selectedActivities.find(sa => sa.id === a.id));
        if (remainingActivities.length > 0) {
          const randomActivity = remainingActivities[Math.floor(Math.random() * remainingActivities.length)];
          selectedActivities.push(randomActivity);
        }
      }

      const totalPoints = selectedActivities.reduce((sum, a) => sum + a.points, 0);
      const romanceScore = Math.round(selectedActivities.reduce((sum, a) => sum + a.romanceLevel, 0) / selectedActivities.length);
      const weatherGoodScore = Math.round(selectedActivities.filter(a => !a.weatherDependent).length / selectedActivities.length * 100);
      const totalDuration = selectedActivities.reduce((sum, a) => sum + a.duration, 0);

      const newPlan: WeekendPlan = {
        id: Date.now().toString(),
        activities: selectedActivities,
        totalPoints,
        romanceScore,
        weatherGoodScore,
        estimatedCost: preferences.budget,
        totalDuration,
        createdAt: new Date(),
        status: 'draft'
      };

      setCurrentPlan(newPlan);
      setIsGenerating(false);
      setShowPlanCustomization(true);

      toast({
        title: "✨ Weekend Plan Generated!",
        description: `Your ${selectedActivities.length} activity plan is ready! Romance score: ${romanceScore}/5`,
      });
    }, 2000);
  };

  const regeneratePlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Add variety to regeneration
      const newPreferences = {
        ...preferences,
        activityType: ['mixed', 'romance', 'adventure', 'relaxation', 'cuisine'][Math.floor(Math.random() * 5)]
      };
      setPreferences(newPreferences);

      setTimeout(() => {
        generateWeekendPlan();
      }, 500);
    }, 1000);
  };

  const sendPlanToPartner = () => {
    if (!currentPlan) return;

    const updatedPlan = {
      ...currentPlan,
      status: 'sent' as const
    };

    setCurrentPlan(updatedPlan);

    toast({
      title: "💕 Plan Sent to Priya!",
      description: "She'll receive it for review and acceptance",
    });

    // In a real app, this would send the plan via API/socket
    document.dispatchEvent(new CustomEvent('gamification:action', {
      detail: {
        action: 'weekend_plan_shared',
        context: {
          planId: updatedPlan.id,
          activitiesCount: updatedPlan.activities.length,
          totalPoints: updatedPlan.totalPoints
        }
      }
    }));
  };

  const handleCompletePlan = () => {
    if (!currentPlan) return;

    const completedPlan = {
      ...currentPlan,
      status: 'completed' as const
    };

    setCurrentPlan(completedPlan);

    // Award coins for completion
    document.dispatchEvent(new CustomEvent('gamification:action', {
      detail: {
        action: 'weekend_plan_completed',
        context: {
          planId: completedPlan.id,
          activitiesCount: completedPlan.activities.length,
          totalPoints: completedPlan.totalPoints
        }
      }
    }));

    toast({
      title: `🎉 Weekend Completed! +${currentPlan.totalPoints} coins`,
      description: "Amazing weekend together! New memories created 💕",
    });
  };

  const replaceActivity = (oldActivity: WeekendActivity) => {
    if (!currentPlan) return;

    const filteredPool = activityPool.filter(a =>
      a.category !== oldActivity.category &&
      !currentPlan.activities.find(ca => ca.id === a.id)
    );

    if (filteredPool.length > 0) {
      const randomActivity = filteredPool[Math.floor(Math.random() * filteredPool.length)];
      const updatedActivities = currentPlan.activities.map(a =>
        a.id === oldActivity.id ? randomActivity : a
      );

      setCurrentPlan(prev => prev ? {
        ...prev,
        activities: updatedActivities,
        totalPoints: updatedActivities.reduce((sum, a) => sum + a.points, 0),
        romanceScore: Math.round(updatedActivities.reduce((sum, a) => sum + a.romanceLevel, 0) / updatedActivities.length)
      } : null);
    }
  };

  const addCustomActivity = () => {
    if (!currentPlan || !customActivity.title) return;

    const newActivity: WeekendActivity = {
      id: Date.now().toString(),
      title: customActivity.title,
      description: customActivity.description || '',
      timeSuggestion: customActivity.timeSuggestion || 'Flexible',
      duration: customActivity.duration || 60,
      location: customActivity.location || 'TBD',
      category: customActivity.category as WeekendActivity['category'] || 'romance',
      cost: 'medium',
      weatherDependent: false,
      romanceLevel: 3,
      intensity: 'moderate',
      points: 30
    };

    const updatedActivities = [...currentPlan.activities, newActivity];

    setCurrentPlan(prev => prev ? {
      ...prev,
      activities: updatedActivities,
      totalPoints: updatedActivities.reduce((sum, a) => sum + a.points, 0),
      romanceScore: Math.round(updatedActivities.reduce((sum, a) => sum + a.romanceLevel, 0) / updatedActivities.length),
      totalDuration: updatedActivities.reduce((sum, a) => sum + a.duration, 0)
    } : null);

    setCustomActivity({
      title: '',
      description: '',
      timeSuggestion: '',
      duration: 60,
      location: ''
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      romance: <Heart className="w-5 h-5 text-pink-500" />,
      adventure: <MapPin className="w-5 h-5 text-orange-500" />,
      relaxation: <Sun className="w-5 h-5 text-green-500" />,
      cuisine: <Star className="w-5 h-5 text-red-500" />,
      culture: <Sparkles className="w-5 h-5 text-purple-500" />,
      nature: <TreePine className="w-5 h-5 text-green-600" />
    };
    return icons[category as keyof typeof icons] || <Calendar className="w-5 h-5 text-gray-500" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      romance: 'border-pink-300 bg-pink-50',
      adventure: 'border-orange-300 bg-orange-50',
      relaxation: 'border-green-300 bg-green-50',
      cuisine: 'border-red-300 bg-red-50',
      culture: 'border-purple-300 bg-purple-50',
      nature: 'border-green-300 bg-green-100'
    };
    return colors[category as keyof typeof colors] || 'border-gray-300 bg-gray-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100">
      <div className="max-w-6xl mx-auto p-4">

        {/* Header */}
        <div className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 rounded-3xl p-6 text-white shadow-xl mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">✨ ONE-TAP WEEKEND PLANNER</h1>
            <p className="text-purple-100 mb-4">Let us create magical weekend memories together!</p>

            {!currentPlan && (
              <div className="space-y-4 max-w-md mx-auto">
                <Button
                  onClick={generateWeekendPlan}
                  disabled={isGenerating}
                  className="w-full py-4 text-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 border-2 border-white"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Planning Your Perfect Weekend...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Generate Weekend Plan ✨
                    </>
                  )}
                </Button>

                <p className="text-sm text-purple-100">
                  One tap creates a personalized romantic weekend tailored to your connection
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Current Plan Display */}
        {currentPlan && !showPlanCustomization && (
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-purple-600" />
                  <span>Your Perfect Weekend Plan</span>
                  <Badge className="bg-purple-100 text-purple-800">
                    {currentPlan.activities.length} activities
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={regeneratePlan}
                    className="text-purple-600 border-purple-300"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Regenerate
                  </Button>
                  <Button
                    onClick={() => setShowPlanCustomization(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Customize Plan
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Plan Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl">
                  <div className="text-2xl font-bold text-pink-600 mb-1">❤️ {currentPlan.romanceScore}/5</div>
                  <div className="text-sm text-pink-700">Romance Level</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 mb-1">⏰ {Math.round(currentPlan.totalDuration / 60)}h</div>
                  <div className="text-sm text-green-700">Total Time</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">+$ {currentPlan.totalPoints}</div>
                  <div className="text-sm text-yellow-700">Coin Reward</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 mb-1">🌤️ {currentPlan.weatherGoodScore}%</div>
                  <div className="text-sm text-blue-700">Weather Ready</div>
                </div>
              </div>

              {/* Activities List */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Weekend Activities</h3>
                {currentPlan.activities.map((activity, index) => (
                  <Card key={activity.id} className={`border-2 ${getCategoryColor(activity.category)} shadow-md`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-white/70 flex items-center justify-center">
                            {getCategoryIcon(activity.category)}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-lg font-bold text-gray-800">{activity.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                  Activity {index + 1}
                                </Badge>
                              </div>
                              <p className="text-gray-600 mb-3">{activity.description}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span>{activity.timeSuggestion}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span>{activity.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4 text-red-500" />
                              <span>{'❤️'.repeat(activity.romanceLevel)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span>{activity.duration}min</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                {currentPlan.status === 'draft' && (
                  <>
                    <Button
                      onClick={() => setShowPlanCustomization(true)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Customize
                    </Button>
                    <Button
                      onClick={regeneratePlan}
                      variant="outline"
                      className="flex-1"
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                    <Button
                      onClick={sendPlanToPartner}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send to Priya
                    </Button>
                  </>
                )}

                {currentPlan.status === 'sent' && (
                  <>
                    <Badge className="bg-yellow-100 text-yellow-800 px-4 py-2">
                      <Clock className="w-4 h-4 mr-1" />
                      Awaiting Priya's Response
                    </Badge>
                    <Button
                      onClick={handleCompletePlan}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark Completed (+{currentPlan.totalPoints} coins)
                    </Button>
                  </>
                )}

                {currentPlan.status === 'accepted' && (
                  <Button
                    onClick={handleCompletePlan}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Complete Weekend Magic! (+{currentPlan.totalPoints} coins)
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plan Customization Dialog */}
        <Dialog open={showPlanCustomization} onOpenChange={setShowPlanCustomization}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-purple-600" />
                Customize Your Weekend Plan
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Add Custom Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add Custom Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Activity Title</Label>
                    <Input
                      value={customActivity.title}
                      onChange={(e) => setCustomActivity(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Romantic Movie Marathon"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={customActivity.description}
                      onChange={(e) => setCustomActivity(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your perfect weekend activity..."
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Time Suggestion</Label>
                      <Input
                        value={customActivity.timeSuggestion}
                        onChange={(e) => setCustomActivity(prev => ({ ...prev, timeSuggestion: e.target.value }))}
                        placeholder="e.g., Saturday Afternoon"
                      />
                    </div>
                    <div>
                      <Label>Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={customActivity.duration}
                        onChange={(e) => setCustomActivity(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                        placeholder="90"
                      />
                    </div>
                  </div>
                  <Button onClick={addCustomActivity} disabled={!customActivity.title}>
                    Add Custom Activity
                  </Button>
                </CardContent>
              </Card>

              {/* Current Activities with Replace Option */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Current Activities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentPlan?.activities.map(activity => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(activity.category)}
                        <span className="font-medium">{activity.title}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => replaceActivity(activity)}
                      >
                        Replace
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowPlanCustomization(false)}>
                  Done Customizing
                </Button>
                <Button
                  onClick={sendPlanToPartner}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                >
                  Share Plan with Priya ✨
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default WeekendPlanner;
