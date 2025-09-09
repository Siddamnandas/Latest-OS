'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Heart, Clock, Zap, Trash2, Edit3, CheckCircle2, ArrowRight } from 'lucide-react';

interface MicroOffer {
  id: string;
  title: string;
  description: string;
  archetype: 'radha_krishna' | 'sita_ram' | 'shiva_shakti';
  duration: number;
  targetDate: string;
  status: 'planned' | 'completed';
  coins: number;
}

export function WeeklyYagnaPlan() {
  const [microOffers, setMicroOffers] = useState<MicroOffer[]>([]);
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
    // Set default target date to next Sunday
    const now = new Date();
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + (7 - now.getDay() + 7));
    nextSunday.setHours(18, 0, 0, 0); // 6 PM next Sunday
    setFormData(prev => ({
      ...prev,
      targetDate: nextSunday.toISOString().split('T')[0]
    }));
  }, []);

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
      coins: getCoinsForArchetype(formData.archetype, formData.duration)
    };

    setMicroOffers(prev => [...prev, newOffer]);
    resetForm();
    setIsCreating(false);
  };

  const handleEditMicroOffer = (offer: MicroOffer) => {
    setEditingId(offer.id);
    setFormData({
      title: offer.title,
      description: offer.description,
      archetype: offer.archetype,
      duration: offer.duration,
      targetDate: offer.targetDate
    });
  };

  const handleSaveEdit = () => {
    if (!editingId || !formData.title.trim()) return;

    setMicroOffers(prev => prev.map(offer =>
      offer.id === editingId ? {
        ...offer,
        title: formData.title,
        description: formData.description,
        archetype: formData.archetype,
        duration: formData.duration,
        targetDate: formData.targetDate,
        coins: getCoinsForArchetype(formData.archetype, formData.duration)
      } : offer
    ));

    resetForm();
    setEditingId(null);
  };

  const handleDeleteMicroOffer = (id: string) => {
    setMicroOffers(prev => prev.filter(offer => offer.id !== id));
    resetForm();
  };

  const handleCompleteMicroOffer = (id: string) => {
    setMicroOffers(prev => prev.map(offer =>
      offer.id === id
        ? { ...offer, status: 'completed' }
        : offer
    ));
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

  const getArchetypeStats = () => {
    return Object.keys(archetypeInfo).map(archetype => {
      const count = microOffers.filter(offer => offer.archetype === archetype).length;
      return { archetype, count };
    });
  };

  const completedCount = microOffers.filter(offer => offer.status === 'completed').length;
  const totalCoins = microOffers
    .filter(offer => offer.status === 'completed')
    .reduce((sum, offer) => sum + offer.coins, 0);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-6 shadow-xl">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Weekly Yagna Plan</h1>
              <p className="text-white/80 text-sm">Sacred offerings for this week's relationship growth</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3 text-center">
                <span className="text-xl font-bold text-white">{completedCount}/{microOffers.length}</span>
                <p className="text-xs text-white/80">Sacrifices</p>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3 text-center">
                <span className="text-xl font-bold text-white">{totalCoins}</span>
                <p className="text-xs text-white/80">Coins Earned</p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/90 font-medium">Weekly Progress</span>
              <span className="text-sm text-white/90">
                {microOffers.length > 0 ? Math.round((completedCount / microOffers.length) * 100) : 0}%
              </span>
            </div>
            <Progress
              value={microOffers.length > 0 ? (completedCount / microOffers.length) * 100 : 0}
              className="h-2 bg-white/30"
            />
          </div>
        </div>
      </div>

      {/* Archetype Stats */}
      {microOffers.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {getArchetypeStats().map(({ archetype, count }) => {
            const info = archetypeInfo[archetype as keyof typeof archetypeInfo];
            return (
              <Card key={archetype} className={`bg-gradient-to-br ${info.color} text-white border-0`}>
                <CardContent className="p-3 text-center">
                  <span className="text-xl mb-1 block">{info.emoji}</span>
                  <p className="text-sm font-bold">{count}</p>
                  <p className="text-xs opacity-90">{info.name}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Micro-offers List */}
      {microOffers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">This Week's Sacrifices</h2>
            <Badge className="bg-amber-100 text-amber-800">
              🔥 {microOffers.length} Planned
            </Badge>
          </div>

          {microOffers.map((offer) => {
            const info = archetypeInfo[offer.archetype];
            return (
              <Card key={offer.id} className={`border-l-4 ${
                offer.status === 'completed'
                  ? 'border-l-green-500 bg-green-50/50'
                  : `border-l-${info.color.split('-')[1]}-500`
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${info.color} flex items-center justify-center text-white shadow-md`}>
                        <span className="text-xl">{info.emoji}</span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900">{offer.title}</h4>
                          {offer.status === 'completed' && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>

                        {offer.description && (
                          <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
                        )}

                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {info.name} - {info.description}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-700">
                            <Clock className="w-3 h-3 mr-1" />
                            {offer.duration}min
                          </Badge>
                          <Badge className="bg-yellow-100 text-yellow-700">
                            <span className="mr-1">🪙</span>
                            +{offer.coins}
                          </Badge>
                        </div>

                        <p className="text-xs text-gray-500">
                          Sacrificial target: {new Date(offer.targetDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditMicroOffer(offer)}
                        className="h-8 px-3"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteMicroOffer(offer.id)}
                        className="h-8 px-3 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {offer.status !== 'completed' && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        onClick={() => handleCompleteMicroOffer(offer.id)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark Complete
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              {editingId ? 'Edit Micro-Offer' : 'Create Micro-Offer'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Archetype
              </label>
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
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Micro-Offer Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder={`e.g., ${archetypeInfo[formData.archetype].examples[0]}`}
                className="border-amber-200 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Description (Optional)
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe how this offering will strengthen your relationship..."
                rows={2}
                className="border-amber-200 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Duration (minutes)
                </label>
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
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Target Date
                </label>
                <Input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                  className="border-amber-200 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span>Estimated Coins:</span>
                <span className="font-bold text-yellow-600">
                  +{getCoinsForArchetype(formData.archetype, formData.duration)} 🪙
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsCreating(false);
                  setEditingId(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={editingId ? handleSaveEdit : handleAddMicroOffer}
                disabled={!formData.title.trim()}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                {editingId ? 'Save Changes' : 'Create Offering'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Button */}
      <div className="fixed bottom-24 right-6">
        <Button
          onClick={() => setIsCreating(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
