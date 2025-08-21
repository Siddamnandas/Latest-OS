'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RasaBalanceWheel } from '@/components/RasaBalanceWheel';
import { 
  Heart, 
  Clock, 
  Star, 
  Play, 
  Pause,
  Sparkles,
  Award,
  Target,
  Zap,
  Crown,
  Flame,
  CheckCircle,
  BarChart3,
  Brain,
  Mic,
  Activity,
  TrendingUp
} from 'lucide-react';

interface Ritual {
  id: string;
  title: string;
  description: string;
  archetype: 'radha_krishna' | 'sita_ram' | 'shiva_shakti';
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  coins: number;
  completed: boolean;
  streak: number;
  lastCompleted?: string;
  steps: string[];
}

export function RitualSystem() {
  const [rituals, setRituals] = useState<Ritual[]>([
    {
      id: '1',
      title: 'Morning Connection',
      description: 'Start your day with intention and connection',
      archetype: 'sita_ram',
      duration: 15,
      difficulty: 'easy',
      coins: 25,
      completed: true,
      streak: 5,
      lastCompleted: '2024-01-15',
      steps: [
        'Share gratitude for 3 things',
        'Set daily intentions together',
        'Plan one act of kindness'
      ]
    },
    {
      id: '2',
      title: 'Evening Unwind',
      description: 'Release the day\'s stress and reconnect emotionally',
      archetype: 'radha_krishna',
      duration: 20,
      difficulty: 'medium',
      coins: 35,
      completed: false,
      streak: 0,
      steps: [
        '10-minute tech-free time',
        'Share highs and lows',
        'Express appreciation'
      ]
    },
    {
      id: '3',
      title: 'Weekly Balance Check',
      description: 'Review and harmonize your relationship balance',
      archetype: 'shiva_shakti',
      duration: 30,
      difficulty: 'hard',
      coins: 50,
      completed: false,
      streak: 0,
      steps: [
        'Review weekly achievements',
        'Discuss balance concerns',
        'Set goals for next week'
      ]
    }
  ]);

  const [activeRitual, setActiveRitual] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState('balance');
  
  // Rasa Balance state
  const [rasaBalance, setRasaBalance] = useState({
    play: 35,
    duty: 40,
    balance: 25
  });

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
          name: 'Wisdom', 
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
      case 'easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '⚡';
    if (streak >= 1) return '✨';
    return '';
  };

  const completedRituals = rituals.filter(r => r.completed).length;
  const totalRituals = rituals.length;
  const completionRate = totalRituals > 0 ? (completedRituals / totalRituals) * 100 : 0;

  const startRitual = (ritualId: string) => {
    setActiveRitual(ritualId);
    setCurrentStep(0);
  };

  const completeRitualStep = () => {
    const ritual = rituals.find(r => r.id === activeRitual);
    if (ritual && currentStep < ritual.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete ritual
      setRituals(prev => prev.map(r => 
        r.id === activeRitual 
          ? { 
              ...r, 
              completed: true, 
              streak: r.streak + 1,
              lastCompleted: new Date().toISOString().split('T')[0]
            }
          : r
      ));
      setActiveRitual(null);
      setCurrentStep(0);
    }
  };

  const handleRebalance = () => {
    // Handle rasa rebalance logic
    console.log('Rasa rebalance requested');
    // Update balance based on ritual completions or other factors
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header with stats */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 p-6 shadow-xl">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Sacred Rituals</h1>
              <p className="text-white/80 text-sm">Ancient wisdom for modern love</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center bg-white/20 backdrop-blur-lg rounded-xl p-3 min-w-[80px]">
                <div className="flex items-center gap-1">
                  <Heart className="w-5 h-5 text-white" />
                  <span className="text-xl font-bold text-white">{completionRate.toFixed(0)}%</span>
                </div>
                <span className="text-xs text-white/80">Mastered</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/90 font-medium">
                {completedRituals} of {totalRituals} rituals mastered
              </span>
              <span className="text-sm text-white/90">{completionRate.toFixed(0)}%</span>
            </div>
            <Progress value={completionRate} className="h-2 bg-white/30" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white border-0 shadow-lg rounded-2xl">
          <div className="p-3 text-center">
            <Heart className="w-6 h-6 mx-auto mb-1" />
            <p className="text-2xl font-bold">{completedRituals}</p>
            <p className="text-xs opacity-90">Mastered</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-violet-500 text-white border-0 shadow-lg rounded-2xl">
          <div className="p-3 text-center">
            <Flame className="w-6 h-6 mx-auto mb-1" />
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs opacity-90">Day Streak</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg rounded-2xl">
          <div className="p-3 text-center">
            <Award className="w-6 h-6 mx-auto mb-1" />
            <p className="text-2xl font-bold">350</p>
            <p className="text-xs opacity-90">Coins Earned</p>
          </div>
        </div>
      </div>

      {/* Active Ritual Modal */}
      {activeRitual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 bg-white/95 backdrop-blur-lg border-0 shadow-2xl rounded-2xl">
            <div className="p-6">
              {(() => {
                const ritual = rituals.find(r => r.id === activeRitual);
                if (!ritual) return null;
                
                const archetypeInfo = getArchetypeInfo(ritual.archetype);
                
                return (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${archetypeInfo.color} flex items-center justify-center text-white shadow-lg mb-3`}>
                        <span className="text-2xl">{archetypeInfo.emoji}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{ritual.title}</h3>
                      <p className="text-sm text-gray-600">{ritual.description}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Step {currentStep + 1} of {ritual.steps.length}</span>
                        <Badge className="bg-purple-100 text-purple-700">
                          <Clock className="w-3 h-3 mr-1" />
                          {ritual.duration}min
                        </Badge>
                      </div>
                      <Progress value={((currentStep + 1) / ritual.steps.length) * 100} className="h-2" />
                    </div>
                    
                    <div className="bg-purple-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Current Step:</h4>
                      <p className="text-gray-700">{ritual.steps[currentStep]}</p>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveRitual(null)}
                        className="flex-1"
                      >
                        Exit
                      </Button>
                      <Button 
                        onClick={completeRitualStep}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      >
                        {currentStep < ritual.steps.length - 1 ? 'Next Step' : 'Complete Ritual'}
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rituals">Rituals</TabsTrigger>
          <TabsTrigger value="balance" className="relative">
            Balance
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
          </TabsTrigger>
          <TabsTrigger value="wellness">Wellness</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
        </TabsList>

        <TabsContent value="rituals" className="space-y-4">
          {/* Ritual List */}
          <div className="space-y-4">
        {rituals.map((ritual) => {
          const archetypeInfo = getArchetypeInfo(ritual.archetype);
          
          return (
            <div 
              key={ritual.id} 
              className={`bg-white/90 backdrop-blur-lg border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl ${
                ritual.completed ? 'ring-2 ring-green-400' : ''
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${archetypeInfo.color} flex items-center justify-center text-white shadow-lg`}>
                      <span className="text-xl">{archetypeInfo.emoji}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{ritual.title}</h4>
                        {ritual.completed && (
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Mastered
                          </Badge>
                        )}
                        {ritual.streak > 0 && (
                          <Badge className="bg-orange-100 text-orange-700">
                            {getStreakEmoji(ritual.streak)} {ritual.streak} day streak
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{ritual.description}</p>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getDifficultyColor(ritual.difficulty)}>
                          {ritual.difficulty}
                        </Badge>
                        <Badge variant="outline" className="border-gray-300 text-gray-600">
                          <Clock className="w-3 h-3 mr-1" />
                          {ritual.duration}min
                        </Badge>
                        <Badge className="bg-yellow-100 text-yellow-700">
                          <Star className="w-3 h-3 mr-1" />
                          +{ritual.coins} coins
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Details
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => startRitual(ritual.id)}
                    className={`flex-1 ${
                      ritual.completed 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                    }`}
                  >
                    {ritual.completed ? (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        Repeat
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-1" />
                        Start Ritual
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
        </TabsContent>

        <TabsContent value="balance" className="space-y-4">
          {/* Rasa Balance Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Your Rasa Balance
              </h2>
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Updated Today
              </Badge>
            </div>
            
            <RasaBalanceWheel 
              balance={rasaBalance}
              onRebalance={handleRebalance}
            />
            
            {/* Balance Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🎨</span>
                    <h4 className="font-medium text-gray-900">Radha-Krishna Energy</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Focus on play, romance, and creative expression to strengthen this aspect.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Current: {rasaBalance.play}%</span>
                    <Button size="sm" variant="outline" className="text-xs">
                      Boost
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">⚖️</span>
                    <h4 className="font-medium text-gray-900">Sita-Ram Harmony</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Your duty and balance are well-developed. Maintain this stability.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Current: {rasaBalance.duty}%</span>
                    <Button size="sm" variant="outline" className="text-xs">
                      Maintain
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🧘</span>
                    <h4 className="font-medium text-gray-900">Shiva-Shakti Growth</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Focus on harmony and spiritual growth to enhance this area.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Current: {rasaBalance.balance}%</span>
                    <Button size="sm" variant="outline" className="text-xs">
                      Grow
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">⭐</span>
                    <h4 className="font-medium text-gray-900">Balance Tips</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Perfect balance comes from nurturing all three aspects equally.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Status: Balanced</span>
                    <Button size="sm" variant="outline" className="text-xs">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="wellness" className="space-y-4">
          {/* Wellness Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Relationship Wellness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">85/100</div>
                  <Progress value={85} className="h-2 mb-3" />
                  <p className="text-gray-700">Your relationship wellness score is excellent!</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Wellness Tips</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Practice daily gratitude</li>
                        <li>• Maintain open communication</li>
                        <li>• Support each other's growth</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Recommended Activities</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Weekly check-ins</li>
                        <li>• Shared meditation</li>
                        <li>• Couples yoga</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice" className="space-y-4">
          {/* Voice Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Voice Interaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <Mic className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Voice-Powered Rituals</h3>
                  <p className="text-gray-600 mb-4">Use voice commands to guide your rituals hands-free</p>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Start Voice Session
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800">Voice Commands</span>
                      </div>
                      <p className="text-sm text-green-700">"Start morning ritual", "Next step", "Complete ritual"</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800">AI Guidance</span>
                      </div>
                      <p className="text-sm text-yellow-700">Real-time voice coaching and feedback</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}