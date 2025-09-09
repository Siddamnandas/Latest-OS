'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Heart,
  Clock,
  Zap,
  Trash2,
  Edit3,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Star,
  Trophy,
  Map,
  Activity,
  RotateCcw,
  Book
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MicroOffer {
  id: string;
  title: string;
  description: string;
  archetype: 'radha_krishna' | 'sita_ram' | 'shiva_shakti';
  duration: number;
  targetDate: string;
  status: 'planned' | 'in_progress' | 'completed' | 'skipped';
  coins: number;
  createdAt: Date;
  completedAt?: Date;
}

interface WeeklyReflection {
  id: string;
  weekStart: Date;
  weekEnd: Date;
  overallRating: number;
  highlights: string[];
  challenges: string[];
  learnings: string[];
  nextWeekGoals: string[];
  relationshipGrowth: string;
  completedOffers: MicroOffer[];
  status: 'draft' | 'completed';
}

export function WeeklyYagnaPlan() {
  const { toast } = useToast();
  const [activePhase, setActivePhase] = useState<'plan' | 'do' | 'reflect'>('plan');
  const [currentWeekId, setCurrentWeekId] = useState<string>('');
  const [microOffers, setMicroOffers] = useState<MicroOffer[]>([]);
  const [weeklyReflection, setWeeklyReflection] = useState<Partial<WeeklyReflection>>({
    overallRating: 7,
    highlights: [],
    challenges: [],
    learnings: [],
    nextWeekGoals: [],
    relationshipGrowth: ''
  });

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    archetype: 'radha_krishna' as MicroOffer['archetype'],
    duration: 15,
    targetDate: ''
  });

  useEffect(() => {
    // Calculate current week ID (Sunday to Saturday)
    const now = new Date();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - now.getDay());
    const weekId = `week_${sunday.toISOString().split('T')[0]}`;
    setCurrentWeekId(weekId);

    // Set default target date to next Sunday
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + (7 - now.getDay() + 7));
    nextSunday.setHours(18, 0, 0, 0);

    setFormData(prev => ({
      ...prev,
      targetDate: nextSunday.toISOString().split('T')[0]
    }));

    // Load existing data
    loadWeeklyData(weekId);
  }, []);

  const loadWeeklyData = (weekId: string) => {
    const stored = localStorage.getItem(`weekly_yagna_${weekId}`);
    if (stored) {
      const data = JSON.parse(stored);
      setMicroOffers(data.offers || []);
      setWeeklyReflection(data.reflection || {});
      setActivePhase(data.activePhase || 'plan');
    }
  };

  const saveWeeklyData = () => {
    const data = {
      weekId: currentWeekId,
      offers: microOffers,
      reflection: weeklyReflection,
      activePhase,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(`weekly_yagna_${currentWeekId}`, JSON.stringify(data));
  };

  useEffect(() => {
    if (currentWeekId) {
      saveWeeklyData();
    }
  }, [microOffers, weeklyReflection, activePhase]);

  const archetypeInfo = {
    radha_krishna: {
      name: 'Radha-Krishna',
      emoji: '🎭',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      description: 'Play & Romance',
      examples: ['Have a romantic dinner', 'Plan weekend getaway', 'Request a massage']
    },
    sita_ram: {
      name: 'Sita-Ram',
      emoji: '⚖️',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      description: 'Duty & Balance',
      examples: ['Complete household chores', 'Organize family schedule', 'Update budget']
    },
    shiva_shakti: {
      name: 'Shiva-Shakti',
      emoji: '🧘',
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50',
      description: 'Wellness & Growth',
      examples: ['Morning meditation', 'Watch documentary together', 'Explore spiritual practice']
    }
  };

  const getCoinsForArchetype = (archetype: string, duration: number): number => {
    const baseCoins = {
      radha_krishna: 25,
      sita_ram: 15,
      shiva_shakti: 20
    };
    return Math.floor((baseCoins[archetype as keyof typeof baseCoins] * duration) / 15);
  };

  const handleAddMicroOffer = () => {
    if (!formData.title.trim()) return;

    const newOffer: MicroOffer = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      archetype: formData.archetype,
      duration: formData.duration,
      targetDate: formData.targetDate,
      status: 'planned',
      coins: getCoinsForArchetype(formData.archetype, formData.duration),
      createdAt: new Date()
    };

    setMicroOffers(prev => [...prev, newOffer]);
    resetForm();
    setIsCreating(false);
  };

  const handleStatusChange = (offerId: string, status: 'planned' | 'in_progress' | 'completed' | 'skipped') => {
    setMicroOffers(prev => prev.map(offer =>
      offer.id === offerId ? { ...offer, status } : offer
    ));

    if (status === 'completed') {
      // Award coins
      document.dispatchEvent(new CustomEvent('gamification:action', {
        detail: {
          action: 'weekly_goal_completed',
          context: {
            type: 'micro-offer',
            currency: 'coins',
            weekId: currentWeekId
          }
        }
      }));

      toast({
        title: "🎉 Micro-Offer Completed!",
        description: "Your relationship sacrifice has been honored",
      });
    }
  };

  const moveToNextPhase = () => {
    if (activePhase === 'plan') {
      setActivePhase('do');
    } else if (activePhase === 'do') {
      setActivePhase('reflect');
    }
  };

  const moveToPrevPhase = () => {
    if (activePhase === 'do') {
      setActivePhase('plan');
    } else if (activePhase === 'reflect') {
      setActivePhase('do');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      archetype: 'radha_krishna',
      duration: 15,
      targetDate: ''
    });
  };

  const getWeekStats = () => {
    const completed = microOffers.filter(offer => offer.status === 'completed').length;
    const inProgress = microOffers.filter(offer => offer.status === 'in_progress').length;
    const totalCoins = microOffers
      .filter(offer => offer.status === 'completed')
      .reduce((sum, offer) => sum + offer.coins, 0);

    return {
      total: microOffers.length,
      completed,
      inProgress,
      completionRate: microOffers.length > 0 ? (completed / microOffers.length) * 100 : 0,
      totalCoins
    };
  };

  const stats = getWeekStats();

  const renderPlanPhase = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
        <h3 className="font-semibold text-orange-800 mb-2">🔮 PLAN Phase</h3>
        <p className="text-sm text-orange-700 mb-3">
          Create sacred offerings for your relationship this week. Plan your micro-offers for wellness and growth.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-700">{microOffers.length}</div>
            <div className="text-xs text-orange-600">Planned Offerings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-700">{stats.totalCoins}</div>
            <div className="text-xs text-orange-600">Potential Coins</div>
          </div>
        </div>
      </div>

      {/* Archetype Selection and Offer Creation */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-600" />
            Create Micro-Offerings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Select Archetype Path</label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {Object.entries(archetypeInfo).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => setFormData(prev => ({ ...prev, archetype: key as MicroOffer['archetype'] }))}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    formData.archetype === key
                      ? `bg-gradient-to-br ${info.color} text-white shadow-lg scale-105`
                      : `bg-gray-100 hover:bg-gray-200`
                  }`}
                >
                  <div className="text-2xl mb-1">{info.emoji}</div>
                  <div className="text-sm font-medium">{info.name}</div>
                  <div className="text-xs opacity-75">{info.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Offer Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={`e.g., ${archetypeInfo[formData.archetype].examples[Math.floor(Math.random() * archetypeInfo[formData.archetype].examples.length)]}`}
              className="border-amber-200 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Duration (minutes)</label>
              <Input
                type="number"
                min="5"
                max="120"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 15 }))}
                className="border-amber-200 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Target Date</label>
              <Input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                className="border-amber-200 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex justify-between items-center bg-gradient-to-r from-amber-100 to-orange-100 p-3 rounded-lg">
            <span className="text-sm font-medium">Potential Coins:</span>
            <span className="font-bold text-yellow-600">
              +{getCoinsForArchetype(formData.archetype, formData.duration)} 🪙
            </span>
          </div>

          <Button
            onClick={handleAddMicroOffer}
            disabled={!formData.title.trim()}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
          >
            Add to Weekly Offering
          </Button>
        </CardContent>
      </Card>

      {/* List of Planned Offers */}
      {microOffers.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Planned Offerings</h4>
          {microOffers.map(offer => {
            const info = archetypeInfo[offer.archetype];
            return (
              <Card key={offer.id} className="border-l-4 border-l-amber-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${info.color} flex items-center justify-center text-white shadow-md`}>
                        <span className="text-lg">{info.emoji}</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold">{offer.title}</h5>
                        {offer.description && (
                          <p className="text-sm text-gray-600">{offer.description}</p>
                        )}
                        <div className="flex gap-2 mt-2">
                          <Badge className="text-xs">🪙 +{offer.coins}</Badge>
                          <Badge className="text-xs">⏰ {offer.duration}min</Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setMicroOffers(prev => prev.filter(o => o.id !== offer.id));
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderDoPhase = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
        <h3 className="font-semibold text-green-800 mb-2">⚡ DO Phase</h3>
        <p className="text-sm text-green-700 mb-3">
          Execute your planned offerings. Pay attention to the energy of each act.
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-green-700">{stats.completed}</div>
            <div className="text-xs text-green-600">Completed</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-700">{stats.total}</div>
            <div className="text-xs text-green-600">Total</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-700">{Math.round(stats.completionRate)}%</div>
            <div className="text-xs text-green-600">Progress</div>
          </div>
        </div>
        <div className="mt-3">
          <Progress value={stats.completionRate} className="h-2 bg-green-200" />
        </div>
      </div>

      <div className="space-y-4">
        {microOffers.map(offer => {
          const info = archetypeInfo[offer.archetype];
          return (
            <Card key={offer.id} className={`border-l-4 ${
              offer.status === 'completed' ? 'border-l-green-500 bg-green-50/50' : 'border-l-gray-300'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${info.color} flex items-center justify-center text-white shadow-md`}>
                      <span className="text-lg">{info.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-semibold">{offer.title}</h5>
                        <Badge className={offer.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}>
                          {offer.status === 'completed' ? (<><CheckCircle2 className="w-3 h-3 mr-1" /> Done</>) : 'Pending'}
                        </Badge>
                      </div>
                      {offer.description && (
                        <p className="text-sm text-gray-600">{offer.description}</p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">{info.name}</Badge>
                        <Badge className="text-xs">🪙 {offer.coins}</Badge>
                        <Badge className="text-xs">⏰ {offer.duration}min</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  {offer.status !== 'completed' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(offer.id, 'in_progress')}
                        className="flex-1"
                      >
                        Start
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(offer.id, 'completed')}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Mark Complete
                      </Button>
                    </>
                  )}
                  {offer.status === 'in_progress' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(offer.id, 'completed')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Complete Offering
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderReflectPhase = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200">
        <h3 className="font-semibold text-purple-800 mb-2">🔮 REFLECT Phase</h3>
        <p className="text-sm text-purple-700 mb-3">
          Review your week's offerings. What worked? What didn't? What did you learn?
        </p>
        <div className="text-center">
          <div className="text-xl font-bold text-purple-700 mb-1">{Math.round(stats.completionRate)}%</div>
          <div className="text-xs text-purple-600 mb-2">Weekly Completion Rate</div>
          <div className="text-sm font-medium text-purple-700">{stats.completed} of {stats.total} offerings completed</div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-purple-600" />
            Weekly Reflection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">
              Overall Week Rating (1-10)
            </Label>
            <div className="space-y-2">
              <div className="text-center">
                <span className="text-2xl font-bold text-purple-600">{weeklyReflection.overallRating || 7}</span>
                <span className="text-sm text-gray-500">/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={weeklyReflection.overallRating || 7}
                onChange={(e) => setWeeklyReflection(prev => ({ ...prev, overallRating: parseInt(e.target.value) }))}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div>
            <Label className="text-base font-medium mb-3 block">
              🌟 Top 3 Highlights
            </Label>
            {['highlight1', 'highlight2', 'highlight3'].map((_, index) => (
              <Input
                key={index}
                placeholder={`Highlight ${index + 1}...`}
                value={(weeklyReflection.highlights || [])[index] || ''}
                onChange={(e) => {
                  const newHighlights = [...(weeklyReflection.highlights || [])];
                  newHighlights[index] = e.target.value;
                  setWeeklyReflection(prev => ({ ...prev, highlights: newHighlights }));
                }}
                className="mb-2"
              />
            ))}
          </div>

          <div>
            <Label className="text-base font-medium mb-3 block">
              🤔 What Were Your Main Challenges?
            </Label>
            <Textarea
              placeholder="Describe any challenges you faced this week..."
              value={weeklyReflection.challenges?.join('\n') || ''}
              onChange={(e) => {
                const value = e.target.value;
                const challenges = value ? value.split('\n').filter(c => c.trim()) : [];
                setWeeklyReflection(prev => ({ ...prev, challenges }));
              }}
              rows={3}
            />
          </div>

          <div>
            <Label className="text-base font-medium mb-3 block">
              💡 Key Learnings and Insights
            </Label>
            <Textarea
              placeholder="What did you learn about yourself and your relationship this week?"
              value={weeklyReflection.learnings?.join('\n') || ''}
              onChange={(e) => {
                const value = e.target.value;
                const learnings = value ? value.split('\n').filter(l => l.trim()) : [];
                setWeeklyReflection(prev => ({ ...prev, learnings }));
              }}
              rows={3}
            />
          </div>

          <div>
            <Label className="text-base font-medium mb-3 block">
              🎯 Relationship Growth This Week
            </Label>
            <Textarea
              placeholder="How has your relationship evolved this week? What feels different?"
              value={weeklyReflection.relationshipGrowth || ''}
              onChange={(e) => setWeeklyReflection(prev => ({
                ...prev,
                relationshipGrowth: e.target.value
              }))}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
        <h4 className="font-semibold text-yellow-800 mb-2">Week Summary Stats</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-yellow-700">{stats.completed}</div>
            <div className="text-xs text-yellow-600">Completed</div>
          </div>
          <div>
            <div className="text-xl font-bold text-yellow-700">{stats.totalCoins}</div>
            <div className="text-xs text-yellow-600">Coins Earned</div>
          </div>
          <div>
            <div className="text-xl font-bold text-yellow-700">{Math.round(stats.completionRate)}%</div>
            <div className="text-xs text-yellow-600">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-4xl mx-auto p-4">

        {/* Phase Navigation */}
        <Tabs value={activePhase} onValueChange={(value) => setActivePhase(value as 'plan' | 'do' | 'reflect')}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="plan" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Plan
            </TabsTrigger>
            <TabsTrigger value="do" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Do
            </TabsTrigger>
            <TabsTrigger value="reflect" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reflect
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plan" className="space-y-6">
            {renderPlanPhase()}
          </TabsContent>

          <TabsContent value="do" className="space-y-6">
            {renderDoPhase()}
          </TabsContent>

          <TabsContent value="reflect" className="space-y-6">
            {renderReflectPhase()}
          </TabsContent>
        </Tabs>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={moveToPrevPhase}
            disabled={activePhase === 'plan'}
          >
            Previous Phase
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={() => setIsCreating(!isCreating)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Offer
            </Button>

            <Button
              onClick={moveToNextPhase}
              disabled={
                (activePhase === 'plan' && microOffers.length === 0) ||
                (activePhase === 'do' && stats.completionRate === 0)
              }
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {activePhase === 'reflect' ? 'Complete Week' : `Move to ${activePhase === 'plan' ? 'Do' : 'Reflect'}`}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Weekly Stats Summary */}
        {stats.total > 0 && (
          <Card className="mt-6 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Weekly Yagna Progress</h3>
                <Trophy className="w-8 h-8" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-xs opacity-75">Offerings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.completed}</div>
                  <div className="text-xs opacity-75">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{Math.round(stats.completionRate)}%</div>
                  <div className="text-xs opacity-75">Success Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">🪙 {stats.totalCoins}</div>
                  <div className="text-xs opacity-75">Coins Earned</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default WeeklyYagnaPlan;
