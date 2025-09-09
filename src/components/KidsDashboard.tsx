'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sparkles, Target, MessageCircle, Star, Flower, TreePine, Award, CheckCircle2, Trophy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KindAct {
  id: string;
  category: string;
  title: string;
  description: string;
  points: number;
  icon: string;
}

export function KidsDashboard({ childProfile }: { childProfile?: any }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('today-fun');
  const [profile, setProfile] = useState({
    name: 'Alex',
    avatarEmoji: '🦋',
    stars: 145,
    level: 3,
    totalCoins: 2850,
    currentStreak: 7,
    ...childProfile
  });

  const kindActs: KindAct[] = [
    { id: '1', category: 'nature', title: 'Feed the Birds', description: 'Share breadcrumbs with birds', points: 25, icon: '🐦' },
    { id: '2', category: 'nature', title: 'Water Flowers', description: 'Give flowers a drink', points: 20, icon: '💧' },
    { id: '3', category: 'nature', title: 'Tree Hugging', description: 'Give a big hug to a tree', points: 30, icon: '🌳' },
    { id: '4', category: 'pets', title: 'Pet Care', description: 'Brush or feed pet friend', points: 25, icon: '🐕' },
    { id: '5', category: 'helping', title: 'Help Cook', description: 'Help in the kitchen', points: 35, icon: '👨‍🍳' },
    { id: '6', category: 'friends', title: 'Share Toy', description: 'Share with a friend', points: 25, icon: '🤝' },
    { id: '7', category: 'family', title: 'Family Hug', description: 'Give family hugs', points: 15, icon: '🤗' }
  ];

  const growthActivities = [
    { id: 'g1', title: 'Understanding Feelings', category: 'emotional', points: 25 },
    { id: 'g2', title: 'Making New Friends', category: 'social', points: 35 },
    { id: 'g3', title: 'Reading Adventure', category: 'learning', points: 30 },
    { id: 'g4', title: 'Gratitude Practice', category: 'spiritual', points: 20 }
  ];

  const leelaQuestions = [
    { id: 'q1', question: 'What makes you feel happy?', category: 'feelings', points: 20 },
    { id: 'q2', question: 'How can we help friends?', category: 'friends', points: 30 },
    { id: 'q3', question: 'What do you like to learn?', category: 'learning', points: 25 },
    { id: 'q4', question: 'What animal would you be?', category: 'nature', points: 35 },
    { id: 'q5', question: 'What makes a good friend?', category: 'friends', points: 35 },
    { id: 'q6', question: 'How does family time feel?', category: 'family', points: 30 }
  ];

  const rituals = [
    { id: 'r1', title: 'Morning Gratitude', category: 'morning', streak: 12, points: 15 },
    { id: 'r2', title: 'Evening Story Time', category: 'evening', streak: 8, points: 25 },
    { id: 'r3', title: 'Family Mealtime Blessing', category: 'mealtime', streak: 15, points: 20 },
    { id: 'r4', title: 'Weekly Nature Walk', category: 'connection', streak: 3, points: 40 },
    { id: 'r5', title: 'Family Meditation', category: 'connection', streak: 2, points: 30 },
    { id: 'r6', title: 'Bedtime Intention Setting', category: 'evening', streak: 5, points: 15 }
  ];

  const handleCompleteKindAct = (act: KindAct) => {
    setProfile(prev => ({
      ...prev,
      totalCoins: prev.totalCoins + act.points,
      stars: prev.stars + Math.floor(act.points / 10)
    }));

    document.dispatchEvent(new CustomEvent('gamification:action', {
      detail: { action: 'kids_activity_completed', context: { actId: act.id, points: act.points } }
    }));

    toast({
      title: `🎉 ${act.title} Complete!`,
      description: `You earned ${act.points} coins and ${Math.floor(act.points / 10)} stars!`,
    });
  };

  const handleCompleteGrowthActivity = (activity: any) => {
    setProfile(prev => ({ ...prev, totalCoins: prev.totalCoins + activity.points }));

    toast({
      title: `🌱 Growth Activity Complete!`,
      description: `Your ${activity.category} skills grew! +${activity.points} coins`,
    });
  };

  const handleLeelaResponse = (index: number) => {
    setProfile(prev => ({ ...prev, totalCoins: prev.totalCoins + leelaQuestions[index].points }));
  };

  const handleCompleteRitual = (ritual: any) => {
    setProfile(prev => ({
      ...prev,
      totalCoins: prev.totalCoins + ritual.points,
      currentStreak: Math.max(prev.currentStreak, ritual.streak + 1)
    }));

    toast({
      title: `🙏 ${ritual.title} Complete!`,
      description: `${ritual.streak + 1}-day streak! +${ritual.points} coins`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-4">

        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 rounded-3xl p-6 text-white shadow-xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{profile.avatarEmoji}</div>
              <div>
                <h1 className="text-2xl font-bold">Hello, {profile.name}!</h1>
                <p className="text-purple-100">Welcome to your magical learning journey ✨</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{profile.stars}</div>
                <div className="text-xs opacity-80">Stars</div>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">🪙 {profile.totalCoins}</div>
                <div className="text-xs opacity-80">Coins</div>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">🔥 {profile.currentStreak}</div>
                <div className="text-xs opacity-80">Day Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="today-fun" className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              Today's Fun
            </TabsTrigger>
            <TabsTrigger value="my-growth" className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              My Growth
            </TabsTrigger>
            <TabsTrigger value="ask-leela" className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              Ask Leela
            </TabsTrigger>
            <TabsTrigger value="my-stars" className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              My Stars
            </TabsTrigger>
            <TabsTrigger value="rituals" className="flex items-center gap-1">
              <Flower className="w-4 h-4" />
              Rituals
            </TabsTrigger>
            <TabsTrigger value="sacred" className="flex items-center gap-1">
              <TreePine className="w-4 h-4" />
              Sacred
            </TabsTrigger>
          </TabsList>

          {/* Today's Fun Tab */}
          <TabsContent value="today-fun" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🌈 What Kindness Shall We Do Today?</h2>
              <p className="text-gray-600">Every kind deed makes the world brighter! 💝</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kindActs.map(act => (
                <Card key={act.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-green-400 hover:scale-105">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white shadow-md">
                        <span className="text-xl">{act.icon}</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        +{act.points} pts
                      </Badge>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">{act.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{act.description}</p>
                    <Button
                      onClick={() => handleCompleteKindAct(act)}
                      className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white"
                    >
                      I'll Do This! 🎉
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Growth Tab */}
          <TabsContent value="my-growth" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🌱 My Growth Journey</h2>
              <p className="text-gray-600">Let's grow together! 🌟</p>
            </div>

            <div className="space-y-4">
              {growthActivities.map(activity => (
                <Card key={activity.id} className="border-l-4 border-l-purple-400">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-800">{activity.title}</h3>
                          <Badge className="bg-purple-100 text-purple-800">
                            🌱 {activity.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>🪙 +{activity.points} coins</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleCompleteGrowthActivity(activity)}
                        className="bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white"
                      >
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Ask Leela Tab */}
          <TabsContent value="ask-leela" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🤖 Hi! I'm Leela, Your Learning Friend</h2>
              <p className="text-gray-600">Let's explore, learn, and wonder together!</p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-4xl shadow-lg">
                🥳
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {leelaQuestions.slice(0, 6).map((question, index) => (
                <Card key={question.id} className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-blue-400">
                  <CardContent className="p-4">
                    <div className="text-center mb-2">
                      <div className={`inline-block p-2 rounded-lg mb-2 ${
                        question.category === 'feelings' ? 'bg-pink-100' :
                        question.category === 'friends' ? 'bg-green-100' :
                        question.category === 'family' ? 'bg-orange-100' :
                        question.category === 'nature' ? 'bg-blue-100' :
                        'bg-purple-100'
                      }`}>
                        <span className={`text-2xl ${
                          question.category === 'feelings' ? 'text-pink-600' :
                          question.category === 'friends' ? 'text-green-600' :
                          question.category === 'family' ? 'text-orange-600' :
                          question.category === 'nature' ? 'text-blue-600' :
                          'text-purple-600'
                        }`}>
                          {question.category === 'feelings' ? '❤️' :
                           question.category === 'friends' ? '👭' :
                           question.category === 'family' ? '👨‍👩‍👧‍👦' :
                           question.category === 'nature' ? '🌿' : '📚'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{question.question}</p>
                      <Badge className="bg-blue-100 text-blue-800">
                        +{question.points}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => handleLeelaResponse(index)}
                      className="w-full bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white"
                    >
                      Ask Me This!
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Stars Tab */}
          <TabsContent value="my-stars" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">⭐ My Stars and Achievements</h2>
              <p className="text-gray-600">Every kind action earns you stars! ✨</p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="text-center">
                <div className="text-6xl mb-2">⭐</div>
                <div className="text-4xl font-bold text-yellow-600">{profile.stars}</div>
                <div className="text-sm text-gray-500">Stars Collected</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[10, 25, 50, 100, 250, 500].map(milestone => (
                <Card key={milestone} className={`${
                  profile.stars >= milestone
                    ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300'
                    : 'bg-gray-100'
                }`}>
                  <CardContent className="p-4 text-center">
                    <div className={`text-3xl mb-2 ${
                      profile.stars >= milestone ? 'text-yellow-600' : 'text-gray-400'
                    }`}>
                      {profile.stars >= milestone ? '🏆' : '⭐'}
                    </div>
                    <h3 className={`font-bold mb-1 ${
                      profile.stars >= milestone ? 'text-yellow-800' : 'text-gray-500'
                    }`}>
                      {profile.stars >= milestone ? 'Achieved!' : `${milestone} Stars`}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {profile.stars >= milestone ? 'Great job!' : 'Keep collecting!'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Rituals Tab */}
          <TabsContent value="rituals" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🏵️ Family Ritual Garden</h2>
              <p className="text-gray-600">Beautiful practices that connect us! 🌸</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rituals.map(ritual => (
                <Card key={ritual.id} className="border-l-4 border-l-purple-400">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                        ritual.category === 'morning' ? 'bg-gradient-to-br from-orange-400 to-pink-500' :
                        ritual.category === 'evening' ? 'bg-gradient-to-br from-indigo-400 to-purple-500' :
                        ritual.category === 'mealtime' ? 'bg-gradient-to-br from-green-400 to-blue-500' :
                        'bg-gradient-to-br from-purple-400 to-pink-500'
                      }`}>
                        {
                          ritual.category === 'morning' ? '🌅' :
                          ritual.category === 'evening' ? '🌙' :
                          ritual.category === 'mealtime' ? '🍽️' : '🌸'
                        }
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-1">{ritual.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{ritual.category} ritual</p>
                        <div className="flex gap-2 text-xs">
                          <Badge className="bg-yellow-100 text-yellow-800">
                            🔥 {ritual.streak} days
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleCompleteRitual(ritual)}
                      className="w-full bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-600 text-white"
                    >
                      <Flower className="w-4 h-4 mr-2" />
                      Practice Ritual (+{ritual.points} coins)
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sacred Tab */}
          <TabsContent value="sacred" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🧘 Sacred Learning Space</h2>
              <p className="text-gray-600">Peaceful space for mindfulness! ☯️</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-purple-100 to-indigo-100 border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">🧘</div>
                  <h3 className="font-bold mb-2">Daily Mindfulness</h3>
                  <p className="text-sm text-gray-600 mb-3">"Peace begins with a smile"</p>
                  <Button size="sm" className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                    Practice 🪙 +15
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">🙏</div>
                  <h3 className="font-bold mb-2">Gratitude Moment</h3>
                  <p className="text-sm text-gray-600 mb-3">Share what you're thankful for</p>
                  <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    Practice 🪙 +15
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-100 to-orange-100 border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">🧘‍♀️</div>
                  <h3 className="font-bold mb-2">Quiet Time</h3>
                  <p className="text-sm text-gray-600 mb-3">Take a moment of peace</p>
                  <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    Practice 🪙 +15
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default KidsDashboard;
