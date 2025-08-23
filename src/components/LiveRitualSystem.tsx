'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Clock, 
  Play, 
  CheckCircle,
  Star,
  Sparkles,
  Moon,
  Sun,
  Flame
} from 'lucide-react';

interface Ritual {
  id: string;
  title: string;
  description: string;
  archetype: 'radha_krishna' | 'sita_ram' | 'shiva_shakti';
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  coins: number;
  streak: number;
  completedToday: boolean;
  timeOfDay: 'morning' | 'evening' | 'anytime';
  steps: string[];
}

export function LiveRitualSystem() {
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [activeRitual, setActiveRitual] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRituals();
  }, []);

  const fetchRituals = async () => {
    try {
      const sampleRituals: Ritual[] = [
        {
          id: '1',
          title: 'Morning Connection',
          description: 'Start your day with love and intention together',
          archetype: 'radha_krishna',
          duration: 10,
          difficulty: 'beginner',
          coins: 20,
          streak: 7,
          completedToday: true,
          timeOfDay: 'morning',
          steps: [
            'Sit facing each other in comfortable position',
            'Take 3 deep breaths together',
            'Share your intention for the day',
            'Express one thing you love about your partner',
            'Seal with a loving embrace'
          ]
        },
        {
          id: '2',
          title: 'Evening Reflection',
          description: 'Close your day with gratitude and connection',
          archetype: 'sita_ram',
          duration: 15,
          difficulty: 'intermediate',
          coins: 25,
          streak: 5,
          completedToday: false,
          timeOfDay: 'evening',
          steps: [
            'Light a candle together',
            'Share the highlights of your day',
            'Express gratitude for 3 things',
            'Discuss one challenge and solution together',
            'Plan tomorrow\'s priorities',
            'End with meditation'
          ]
        },
        {
          id: '3',
          title: 'Sacred Union',
          description: 'Deep tantric connection for advanced practitioners',
          archetype: 'shiva_shakti',
          duration: 30,
          difficulty: 'advanced',
          coins: 50,
          streak: 2,
          completedToday: false,
          timeOfDay: 'anytime',
          steps: [
            'Create sacred space with incense',
            'Practice synchronized breathing',
            'Energy exchange through eye gazing',
            'Chakra alignment meditation',
            'Sacred touch practice',
            'Integration and grounding'
          ]
        },
        {
          id: '4',
          title: 'Playful Hearts',
          description: 'Bring joy and laughter into your relationship',
          archetype: 'radha_krishna',
          duration: 20,
          difficulty: 'beginner',
          coins: 30,
          streak: 3,
          completedToday: false,
          timeOfDay: 'anytime',
          steps: [
            'Choose a fun activity together',
            'Dance to your favorite song',
            'Share childhood memories',
            'Play a game or solve a puzzle',
            'Create something beautiful together'
          ]
        }
      ];
      
      setRituals(sampleRituals);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rituals:', error);
      setLoading(false);
    }
  };

  const getArchetypeInfo = (archetype: string) => {
    switch (archetype) {
      case 'radha_krishna':
        return {
          name: 'Radha-Krishna',
          emoji: '🎨',
          color: 'from-pink-500 to-rose-500',
          bgColor: 'bg-pink-50',
          textColor: 'text-pink-700',
          description: 'Play & Romance'
        };
      case 'sita_ram':
        return {
          name: 'Sita-Ram',
          emoji: '⚖️',
          color: 'from-blue-500 to-cyan-500',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          description: 'Duty & Balance'
        };
      case 'shiva_shakti':
        return {
          name: 'Shiva-Shakti',
          emoji: '🧘',
          color: 'from-purple-500 to-violet-500',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-700',
          description: 'Harmony & Growth'
        };
      default:
        return {
          name: 'Sacred',
          emoji: '✨',
          color: 'from-gray-500 to-slate-500',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          description: 'Ancient Wisdom'
        };
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTimeIcon = (timeOfDay: string) => {
    switch (timeOfDay) {
      case 'morning':
        return <Sun className="w-4 h-4" />;
      case 'evening':
        return <Moon className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const startRitual = (ritualId: string) => {
    setActiveRitual(ritualId);
  };

  const completeRitual = async (ritualId: string) => {
    setRituals(prev => prev.map(ritual => 
      ritual.id === ritualId 
        ? { ...ritual, completedToday: true, streak: ritual.streak + 1 }
        : ritual
    ));
    setActiveRitual(null);
  };

  const totalStreakDays = rituals.reduce((sum, ritual) => sum + ritual.streak, 0);
  const completedTodayCount = rituals.filter(r => r.completedToday).length;

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading rituals...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Sacred Rituals 🕋</h2>
            <p className="text-white/80">Deepen your spiritual connection</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{totalStreakDays}</div>
            <div className="text-sm text-white/80">Total Streak Days</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-xl font-bold">{completedTodayCount}</div>
            <div className="text-xs text-white/80">Completed Today</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-xl font-bold">{rituals.length}</div>
            <div className="text-xs text-white/80">Available Rituals</div>
          </div>
        </div>
      </div>

      {/* Active Ritual */}
      {activeRitual && (
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 border border-purple-200">
          {(() => {
            const ritual = rituals.find(r => r.id === activeRitual);
            if (!ritual) return null;
            
            return (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-purple-900">
                    🧘 Active: {ritual.title}
                  </h3>
                  <Button
                    onClick={() => completeRitual(activeRitual)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {ritual.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-purple-800">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Ritual Cards */}
      <div className="grid gap-4">
        {rituals.map((ritual) => {
          const archetypeInfo = getArchetypeInfo(ritual.archetype);
          
          return (
            <div
              key={ritual.id}
              className={`bg-white/90 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg transition-all duration-300 hover:shadow-xl ${
                ritual.completedToday ? 'ring-2 ring-green-200' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${archetypeInfo.color} flex items-center justify-center text-white text-xl shadow-lg`}>
                    {archetypeInfo.emoji}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{ritual.title}</h3>
                    <p className="text-sm text-gray-600">{ritual.description}</p>
                  </div>
                </div>
                
                {ritual.completedToday && (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Badge className={`text-xs ${archetypeInfo.bgColor} ${archetypeInfo.textColor}`}>
                  {archetypeInfo.name}
                </Badge>
                <Badge className={`text-xs ${getDifficultyColor(ritual.difficulty)}`}>
                  {ritual.difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  {getTimeIcon(ritual.timeOfDay)}
                  <span>{ritual.duration} min</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-yellow-600">
                  <Star className="w-3 h-3" />
                  <span>{ritual.coins} coins</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {ritual.streak} day streak
                  </span>
                </div>
                
                <Button
                  onClick={() => startRitual(ritual.id)}
                  disabled={ritual.completedToday || activeRitual !== null}
                  className={`${
                    ritual.completedToday 
                      ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                      : `bg-gradient-to-r ${archetypeInfo.color} hover:opacity-90 text-white`
                  }`}
                >
                  {ritual.completedToday ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Ritual
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sacred Wisdom Quote */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 text-center">
        <Sparkles className="w-8 h-8 text-amber-600 mx-auto mb-3" />
        <p className="text-amber-800 font-medium italic">
          "When two souls connect in sacred practice, they touch the divine within each other."
        </p>
        <p className="text-sm text-amber-600 mt-2">- Ancient Vedic Wisdom</p>
      </div>
    </div>
  );
}