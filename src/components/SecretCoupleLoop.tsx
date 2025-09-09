'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Heart,
  Send,
  Sparkles,
  Gamepad2,
  MapPin,
  Clock,
  Moon,
  Sun,
  Star,
  Zap,
  Shield,
  EyeOff
} from 'lucide-react';

interface IntimacyNudge {
  id: string;
  type: 'affection' | 'memory' | 'appreciation' | 'desire';
  message: string;
  mood: 'romantic' | 'playful' | 'sweet' | 'passionate';
  sent: boolean;
  timestamp: string;
}

interface RomanticChallenge {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'spicy';
  category: 'communication' | 'touch' | 'adventure' | 'playful';
  completed: boolean;
  unlocksIntimacyLevel?: boolean;
}

interface LoveGesture {
  id: string;
  type: 'hug' | 'kiss' | 'touch' | 'compliment';
  emoji: string;
  description: string;
  energy: 'soft' | 'medium' | 'intense';
}

interface IntimacyLevel {
  id: string;
  level: number;
  title: string;
  description: string;
  requiredChallenges: number;
  unlockedGestures: string[];
  moodAmbiences: string[];
}

export function SecretCoupleLoop() {
  const [activeTab, setActiveTab] = useState('nudges');
  const [showNewNudge, setShowNewNudge] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<RomanticChallenge | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const [intimacyNudges] = useState<IntimacyNudge[]>([
    {
      id: '1',
      type: 'affection',
      message: 'Thinking of you right now... ❤️',
      mood: 'sweet',
      sent: false,
      timestamp: 'just now'
    },
    {
      id: '2',
      type: 'desire',
      message: 'Can\'t wait to be close to you tonight... 🔥',
      mood: 'passionate',
      sent: false,
      timestamp: '2 mins ago'
    }
  ]);

  const romanticChallenges: RomanticChallenge[] = [
    {
      id: '1',
      title: 'Whisper Secrets',
      description: 'Each person shares 3 secrets, one truth and two confessions you\'d never tell anyone else',
      duration: '20 minutes',
      difficulty: 'medium' as const,
      category: 'communication' as const,
      completed: false
    },
    {
      id: '2',
      title: 'Blindfolded Trust',
      description: 'One partner is blindfolded, the other leads them through a gentle touch exploration',
      duration: '15 minutes',
      difficulty: 'spicy' as const,
      category: 'touch' as const,
      completed: false
    },
    {
      id: '3',
      title: 'Memory Lane',
      description: 'Visit your favorite memories together - recreate or reminisce about three special moments',
      duration: '30 minutes',
      difficulty: 'easy' as const,
      category: 'communication' as const,
      completed: false
    }
  ];

  const loveGestures: LoveGesture[] = [
    { id: 'hug', type: 'hug', emoji: '🤗', description: 'Virtual hug', energy: 'soft' as const },
    { id: 'kiss', type: 'kiss', emoji: '😘', description: 'Sweet kiss', energy: 'medium' as const },
    { id: 'longing', type: 'touch', emoji: '💫', description: 'Missing you touch', energy: 'medium' as const },
    { id: 'passion', type: 'touch', emoji: '🔥', description: 'Passionate touch', energy: 'intense' as const },
    { id: 'compliment', type: 'compliment', emoji: '💝', description: 'Sweet compliment', energy: 'soft' as const }
  ];

  const romanceGames = [
    {
      title: 'Two Truths & The Third Alternative',
      description: 'Each person shares two truths about themselves and one "what if" scenario',
      duration: '15 min',
      players: '2'
    },
    {
      title: 'Sensory Exploration',
      description: 'Blindfolded partner experiences different touches, guessing what they are',
      duration: '20 min',
      players: '2'
    },
    {
      title: 'Future Visions',
      description: 'Share dreams for your life together and create a vision board digitally',
      duration: '25 min',
      players: '2'
    }
  ];

  const dateIdeas = [
    {
      title: 'Indoors Picnic',
      description: 'Create a picnic atmosphere in your living room with blankets, candles, and favorite foods',
      category: 'cozy',
      effort: 'low'
    },
    {
      title: 'Dance in the Dark',
      description: 'Turn off the lights, put on slow music, and dance with only touch as your guide',
      category: 'romantic',
      effort: 'low'
    },
    {
      title: 'Hand Massage Ritual',
      description: 'Give each other slow, mindful hand massages while sharing your day',
      category: 'intimate',
      effort: 'low'
    }
  ];

  const sendNudge = (nudge: IntimacyNudge) => {
    alert(`💌 "${nudge.message}" sent to your partner!`);
    // In real app, this would call an API to send the nudge
  };

  const startChallenge = (challenge: RomanticChallenge) => {
    setActiveChallenge(challenge);
    setShowChallenge(true);

    // Set a timer for the challenge duration
    const duration = parseInt(challenge.duration) || 15; // Default 15 min
    setTimeLeft(duration);

    // Countdown timer
    const interval = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          clearInterval(interval);
          setShowChallenge(false);
          setActiveChallenge(null);
          alert('🎊 Challenge time complete! How did it go?');
          return 0;
        }
        return time - 1;
      });
    }, 60000); // Update every minute
  };

  const sendLoveGesture = (gesture: LoveGesture) => {
    alert(`${gesture.emoji} "${gesture.description}" sent to your partner!`);
  };

  const moodAmbiences = ['Romantic Evening 🌙', 'Playful Afternoon ☀️', 'Cozy Night In 🔥', 'Tender Morning 🌅'];

  const intimacyLevels: IntimacyLevel[] = [
    {
      id: 'level1',
      level: 1,
      title: 'Tender Connection',
      description: 'Building emotional closeness through gentle communication',
      requiredChallenges: 2,
      unlockedGestures: ['hug', 'compliment'],
      moodAmbiences: ['Romantic Evening 🌙', 'Cozy Night In 🔥']
    },
    {
      id: 'level2',
      level: 2,
      title: 'Deep Intimacy',
      description: 'Exploring sensual connection with trust and playfulness',
      requiredChallenges: 4,
      unlockedGestures: ['hug', 'kiss', 'longing', 'compliment'],
      moodAmbiences: ['Romantic Evening 🌙', 'Playful Afternoon ☀️', 'Cozy Night In 🔥']
    },
    {
      id: 'level3',
      level: 3,
      title: 'Passionate Bond',
      description: 'Unlocking passionate intimacy through challenge and discovery',
      requiredChallenges: 6,
      unlockedGestures: ['hug', 'kiss', 'longing', 'passion', 'compliment'],
      moodAmbiences: ['Romantic Evening 🌙', 'Playful Afternoon ☀️', 'Cozy Night In 🔥', 'Tender Morning 🌅']
    }
  ];

  const privateMemories = [
    {
      id: 'mem1',
      title: 'First Kiss',
      description: 'That magical moment when our lips first touched',
      date: '3 months ago',
      mood: 'romantic',
      sharedWithPartner: true
    },
    {
      id: 'mem2',
      title: 'Sunset Beach Walk',
      description: 'Watching the sun set over the ocean, hand in hand',
      date: '2 weeks ago',
      mood: 'peaceful',
      sharedWithPartner: true
    },
    {
      id: 'mem3',
      title: 'Candlelit Surprise',
      description: 'You surprised me with candles and my favorite song',
      date: 'Last week',
      mood: 'romantic',
      sharedWithPartner: true
    }
  ];

  const [currentIntimacyLevel, setCurrentIntimacyLevel] = useState(2); // Default to level 2
  const [completedChallenges, setCompletedChallenges] = useState(4); // User has completed 4 challenges
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>('Romantic Evening 🌙');

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-400 p-6 shadow-xl">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Secret Couple Loop</h1>
              <p className="text-white/80 text-sm">Private intimacy, just for us 💕</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/20 backdrop-blur-lg rounded-full px-3 py-1 flex items-center gap-1">
                <EyeOff className="w-3 h-3 text-white" />
                <span className="text-xs text-white">Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Timer Modal */}
      {showChallenge && activeChallenge && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center">
            <Clock className="w-16 h-16 text-pink-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{activeChallenge.title}</h3>
            <p className="text-gray-600 mb-4">{activeChallenge.description}</p>

            <div className="bg-pink-50 rounded-lg p-4 mb-4">
              <div className="text-3xl font-bold text-pink-600">{timeLeft}</div>
              <div className="text-sm text-gray-600">minutes remaining</div>
            </div>

            <p className="text-sm text-gray-600">
              Difficulty: <Badge className={`ml-1 ${
                activeChallenge.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                activeChallenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {activeChallenge.difficulty}
              </Badge>
            </p>
          </div>
        </div>
      )}

      {/* Intimacy Level Status */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              <span className="font-medium">Intimacy Level</span>
            </div>
            <Badge className="bg-pink-100 text-pink-700">
              Level {currentIntimacyLevel}
            </Badge>
          </div>
          <div className="relative bg-pink-100 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
              style={{ width: `${(completedChallenges / intimacyLevels[currentIntimacyLevel - 1].requiredChallenges) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {completedChallenges}/{intimacyLevels[currentIntimacyLevel - 1].requiredChallenges} challenges completed
          </p>
          <p className="text-xs text-pink-700 mt-1">
            {intimacyLevels[currentIntimacyLevel - 1].description}
          </p>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {[
          { id: 'nudges', label: 'Nudges 💕', icon: Send },
          { id: 'memories', label: 'Memories 💭', icon: Heart },
          { id: 'challenges', label: 'Challenges ⚡', icon: Star },
          { id: 'games', label: 'Games 🎮', icon: Gamepad2 },
          { id: 'dates', label: 'Date Ideas 📅', icon: MapPin }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-3 rounded-xl border transition-all duration-200 flex items-center justify-center gap-1 ${
              activeTab === tab.id
                ? 'bg-pink-500 text-white border-pink-500'
                : 'bg-white border-gray-200 hover:bg-pink-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Areas */}
      <div className="space-y-6">
        {activeTab === 'nudges' && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Intimacy Nudges</h2>
              <Button
                onClick={() => setShowNewNudge(true)}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Send Nudge
              </Button>
            </div>

            {/* Quick Gestures */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Love Gestures
                  <Badge className="bg-pink-100 text-pink-700 text-xs">
                    {loveGestures.filter(g => intimacyLevels[currentIntimacyLevel - 1].unlockedGestures.includes(g.id)).length} unlocked
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {loveGestures.map((gesture) => {
                    const isUnlocked = intimacyLevels[currentIntimacyLevel - 1].unlockedGestures.includes(gesture.id);
                    return (
                      <button
                        key={gesture.id}
                        onClick={isUnlocked ? () => sendLoveGesture(gesture) : undefined}
                        disabled={!isUnlocked}
                        className={`p-3 rounded-xl transition-all duration-200 flex flex-col items-center gap-1 ${
                          isUnlocked
                            ? 'bg-pink-50 hover:bg-pink-100 cursor-pointer'
                            : 'bg-gray-100 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <span className="text-2xl">{gesture.emoji}</span>
                        <span className={`text-xs font-medium ${isUnlocked ? 'text-gray-700' : 'text-gray-500'}`}>
                          {gesture.description}
                        </span>
                        <Badge variant={isUnlocked ? "outline" : "secondary"} className="text-xs">
                          {isUnlocked ? gesture.energy : `Level ${currentIntimacyLevel + 1}`}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Nudge Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {intimacyNudges.map((nudge) => (
                    <div key={nudge.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{nudge.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${
                            nudge.mood === 'romantic' ? 'bg-red-100 text-red-700' :
                            nudge.mood === 'playful' ? 'bg-yellow-100 text-yellow-700' :
                            nudge.mood === 'sweet' ? 'bg-pink-100 text-pink-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {nudge.mood}
                          </Badge>
                          <span className="text-xs text-gray-500">{nudge.timestamp}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => sendNudge(nudge)}
                        className="bg-pink-500 hover:bg-pink-600"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'memories' && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Our Private Memories</h2>
              <Button
                onClick={() => alert('✨ Add a new intimate memory with your partner!')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Heart className="w-4 h-4 mr-1" />
                Add Memory
              </Button>
            </div>

            <div className="space-y-3">
              {privateMemories.map((memory) => (
                <Card key={memory.id} className="border-2 hover:border-pink-300 transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{memory.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{memory.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${
                            memory.mood === 'romantic' ? 'bg-red-100 text-red-700' :
                            memory.mood === 'peaceful' ? 'bg-blue-100 text-blue-700' :
                            'bg-pink-100 text-pink-700'
                          }`}>
                            {memory.mood}
                          </Badge>
                          <span className="text-xs text-gray-500">{memory.date}</span>
                          {memory.sharedWithPartner && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              🌙 Shared
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="text-center text-gray-500 text-sm py-8">
                <Heart className="w-12 h-12 text-pink-200 mx-auto mb-2" />
                <p>Add special memories you share with your partner!</p>
                <p className="text-xs text-gray-400 mt-1">Only you two will ever see these</p>
              </div>
            </div>

            {/* Mood Ambience Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-indigo-600" />
                  Set Romantic Atmosphere
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {intimacyLevels[currentIntimacyLevel - 1].moodAmbiences.map((mood) => (
                    <button
                      key={mood}
                      onClick={() => {
                        setSelectedMood(mood);
                        alert(`🌟 "${mood}" atmosphere activated! Candles, music, and soft lighting... 💕`);
                      }}
                      className={`p-3 rounded-lg border text-sm transition-all duration-200 ${
                        selectedMood === mood
                          ? 'bg-pink-500 text-white border-pink-500'
                          : 'bg-pink-50 text-gray-700 border-pink-200 hover:bg-pink-100'
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'challenges' && (
          <>
            <h2 className="text-xl font-bold text-gray-900">Romantic Challenges</h2>
            <div className="grid gap-4">
              {romanticChallenges.map((challenge) => (
                <Card key={challenge.id} className="border-2 hover:border-pink-300 transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                        <Badge className={`mr-2 ${
                          challenge.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                          challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {challenge.difficulty}
                        </Badge>
                        <Badge className="mr-2 bg-gray-100 text-gray-700 capitalize">
                          {challenge.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{challenge.duration}</div>
                        <div className="text-xs text-gray-500">{challenge.category}</div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-3">{challenge.description}</p>

                    <Button
                      onClick={() => startChallenge(challenge)}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Start Challenge
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === 'games' && (
          <>
            <h2 className="text-xl font-bold text-gray-900">Romantic Games</h2>
            <div className="grid gap-4">
              {romanceGames.map((game, index) => (
                <Card key={index} className="border-2 hover:border-purple-300 transition-all duration-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{game.title}</h3>
                    <p className="text-gray-600 mb-3">{game.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>⏱️ {game.duration}</span>
                      <span>👥 {game.players} players</span>
                    </div>
                    <Button
                      onClick={() => alert(`🎉 Starting "${game.title}"! Have fun! 💕`)}
                      className="mt-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                    >
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Play Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === 'dates' && (
          <>
            <h2 className="text-xl font-bold text-gray-900">Private Date Ideas</h2>
            <div className="grid gap-4">
              {dateIdeas.map((date, index) => (
                <Card key={index} className="border-2 hover:border-blue-300 transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{date.title}</h3>
                      <Badge className={`capitalize ${
                        date.effort === 'low' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {date.effort} effort
                      </Badge>
                    </div>
                    <Badge className="mb-3 bg-blue-100 text-blue-700 capitalize">
                      {date.category}
                    </Badge>
                    <p className="text-gray-600">{date.description}</p>
                    <Button
                      onClick={() => alert(`💕 Planning "${date.title}" tonight! 🌙`)}
                      className="mt-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Plan This Date
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Private & Secure</span>
        </div>
        <p className="text-xs text-gray-600">
          All these features are private between you and your partner. No social sharing or external access.
        </p>
      </div>

      {/* Quick Mood Setter */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => alert('🌙 Setting romantic atmosphere... soft lights activated! 💕')}
          className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white"
        >
          <Moon className="w-4 h-4 mr-2" />
          Evening Mood
        </Button>
        <Button
          onClick={() => alert('☀️ Setting playful mood... fun lights activated! 🎈')}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
        >
          <Sun className="w-4 h-4 mr-2" />
          Playful Mood
        </Button>
      </div>

      {/* New Nudge Modal */}
      {showNewNudge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Create Intimacy Nudge</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowNewNudge(false)}>
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="What's on your heart?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              />

              <div className="grid grid-cols-2 gap-2">
                {['Sweet 💕', 'Romantic 🌹', 'Playful 🎈', 'Passionate 🔥'].map((mood) => (
                  <button
                    key={mood}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-300 transition-colors"
                  >
                    {mood}
                  </button>
                ))}
              </div>

              <Button
                onClick={() => {
                  alert('💖 Nudge sent successfully!');
                  setShowNewNudge(false);
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
              >
                Send Nudge 💕
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
