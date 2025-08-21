'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Sparkles, 
  Target, 
  Heart, 
  Clock, 
  TrendingUp,
  Users,
  Lightbulb,
  Zap,
  Star,
  CheckCircle,
  RefreshCw,
  Filter,
  BarChart3
} from 'lucide-react';
import { MagicButton } from '@/components/MagicButton';
import { InteractiveConfetti } from '@/components/InteractiveConfetti';
import { FloatingEmoji } from '@/components/FloatingEmoji';
import { RelationshipInsightsDashboard } from '@/components/RelationshipInsightsDashboard';
import { useToast } from '@/hooks/use-toast';

interface AISuggestion {
  id: string;
  type: 'relationship' | 'parenting' | 'personal_growth' | 'conflict_resolution' | 'intimacy';
  title: string;
  description: string;
  context: string;
  actionSteps: string[];
  expectedOutcome: string;
  timeCommitment: string;
  difficulty: 'easy' | 'medium' | 'hard';
  priority: 'high' | 'medium' | 'low';
  rasaAlignment: 'radha_krishna' | 'sita_ram' | 'shiva_shakti';
  aiConfidence: number;
  tags: string[];
  createdAt: string;
  applied: boolean;
  feedback?: {
    rating: number;
    comment: string;
    helpful: boolean;
  };
}

interface SuggestionFilter {
  type: string[];
  difficulty: string[];
  priority: string[];
  rasaAlignment: string[];
}

export function AISuggestionEngine() {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFloatingEmoji, setShowFloatingEmoji] = useState(false);
  const [celebrationEmoji, setCelebrationEmoji] = useState('💡');
  const [activeTab, setActiveTab] = useState('suggestions');
  const [filters, setFilters] = useState<SuggestionFilter>({
    type: [],
    difficulty: [],
    priority: [],
    rasaAlignment: []
  });
  const { toast } = useToast();

  useEffect(() => {
    initializeSuggestions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [suggestions, filters]);

  const initializeSuggestions = () => {
    const mockSuggestions: AISuggestion[] = [
      {
        id: '1',
        type: 'relationship',
        title: 'Weekly Gratitude Practice',
        description: 'Establish a weekly gratitude sharing ritual to strengthen emotional connection',
        context: 'Based on your communication patterns showing 85% positive interactions',
        actionSteps: [
          'Set aside 15 minutes every Sunday evening',
          'Share 3 things you appreciate about each other',
          'Write these down in a shared gratitude journal',
          'Reflect on how these appreciations made you feel'
        ],
        expectedOutcome: 'Increased emotional intimacy and positive communication patterns',
        timeCommitment: '15 minutes/week',
        difficulty: 'easy',
        priority: 'high',
        rasaAlignment: 'radha_krishna',
        aiConfidence: 92,
        tags: ['communication', 'gratitude', 'ritual', 'emotional_connection'],
        createdAt: '2024-01-15T10:30:00Z',
        applied: false
      },
      {
        id: '2',
        type: 'parenting',
        title: 'Mindful Parenting Check-in',
        description: 'Daily brief check-in about parenting challenges and successes',
        context: 'Your parenting stress levels have increased by 20% this week',
        actionSteps: [
          'Create a 5-minute end-of-day parenting ritual',
          'Share one parenting win and one challenge',
          'Brainstorm solutions together for challenges',
          'Acknowledge each other\'s parenting efforts'
        ],
        expectedOutcome: 'Reduced parenting stress and more coordinated parenting approach',
        timeCommitment: '5 minutes/day',
        difficulty: 'easy',
        priority: 'high',
        rasaAlignment: 'sita_ram',
        aiConfidence: 88,
        tags: ['parenting', 'stress_reduction', 'coordination', 'daily_ritual'],
        createdAt: '2024-01-15T14:20:00Z',
        applied: false
      },
      {
        id: '3',
        type: 'personal_growth',
        title: 'Individual Growth Vision Setting',
        description: 'Set personal growth goals that align with your relationship vision',
        context: 'Analysis shows strong individual growth but needs better alignment with shared goals',
        actionSteps: [
          'Individual reflection on personal growth areas',
          'Share growth goals with partner',
          'Identify how personal goals support relationship goals',
          'Create accountability system for growth goals'
        ],
        expectedOutcome: 'Better aligned personal and relationship growth trajectories',
        timeCommitment: '1 hour setup, 30 minutes/week review',
        difficulty: 'medium',
        priority: 'medium',
        rasaAlignment: 'shiva_shakti',
        aiConfidence: 85,
        tags: ['personal_growth', 'goal_setting', 'alignment', 'vision'],
        createdAt: '2024-01-15T09:15:00Z',
        applied: false
      },
      {
        id: '4',
        type: 'intimacy',
        title: 'Emotional Vulnerability Practice',
        description: 'Practice sharing deeper emotions and fears in a safe space',
        context: 'Emotional intimacy indicators show room for deeper connection',
        actionSteps: [
          'Create a safe space conversation ritual',
          'Practice sharing one fear or vulnerability',
          'Listen without judgment or trying to fix',
          'Express appreciation for partner\'s vulnerability'
        ],
        expectedOutcome: 'Deeper emotional connection and increased trust',
        timeCommitment: '30 minutes/week',
        difficulty: 'medium',
        priority: 'high',
        rasaAlignment: 'radha_krishna',
        aiConfidence: 90,
        tags: ['intimacy', 'vulnerability', 'trust', 'emotional_connection'],
        createdAt: '2024-01-15T16:45:00Z',
        applied: false
      },
      {
        id: '5',
        type: 'conflict_resolution',
        title: 'Preventive Conflict Strategy',
        description: 'Identify potential conflict areas and create preventive strategies',
        context: 'Pattern analysis shows recurring conflicts around financial decisions',
        actionSteps: [
          'Map out common conflict triggers together',
          'Create early warning signs for escalating conflicts',
          'Establish calm-down protocols for both partners',
          'Schedule regular financial planning meetings'
        ],
        expectedOutcome: 'Reduced conflict frequency and more constructive resolution',
        timeCommitment: '2 hours setup, 1 hour/week maintenance',
        difficulty: 'hard',
        priority: 'high',
        rasaAlignment: 'sita_ram',
        aiConfidence: 87,
        tags: ['conflict_prevention', 'financial_planning', 'communication', 'strategy'],
        createdAt: '2024-01-15T11:30:00Z',
        applied: false
      }
    ];

    setSuggestions(mockSuggestions);
    setFilteredSuggestions(mockSuggestions);
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = suggestions;

    if (filters.type.length > 0) {
      filtered = filtered.filter(s => filters.type.includes(s.type));
    }
    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(s => filters.difficulty.includes(s.difficulty));
    }
    if (filters.priority.length > 0) {
      filtered = filtered.filter(s => filters.priority.includes(s.priority));
    }
    if (filters.rasaAlignment.length > 0) {
      filtered = filtered.filter(s => filters.rasaAlignment.includes(s.rasaAlignment));
    }

    setFilteredSuggestions(filtered);
  };

  const generateNewSuggestions = async () => {
    setGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newSuggestion: AISuggestion = {
      id: Date.now().toString(),
      type: 'relationship',
      title: 'AI-Generated Personalized Suggestion',
      description: 'Fresh suggestion based on your latest relationship patterns and goals',
      context: 'Real-time analysis of your recent activities and sync data',
      actionSteps: [
        'Review your recent relationship activities',
        'Identify patterns and areas for improvement',
        'Create a personalized action plan',
        'Track progress and adjust as needed'
      ],
      expectedOutcome: 'Improved relationship satisfaction and goal achievement',
      timeCommitment: 'Variable based on suggestion',
      difficulty: 'medium',
      priority: 'high',
      rasaAlignment: 'radha_krishna',
      aiConfidence: 95,
      tags: ['personalized', 'ai_generated', 'real_time', 'adaptive'],
      createdAt: new Date().toISOString(),
      applied: false
    };

    setSuggestions(prev => [newSuggestion, ...prev]);
    setGenerating(false);
    
    setCelebrationEmoji('✨');
    setShowFloatingEmoji(true);
    
    toast({
      title: "New AI Suggestion Generated! 🤖",
      description: "Fresh personalized insight based on your latest data",
      duration: 3000,
    });
    
    setTimeout(() => setShowFloatingEmoji(false), 2000);
  };

  const applySuggestion = (suggestionId: string) => {
    setSuggestions(prev => 
      prev.map(suggestion => 
        suggestion.id === suggestionId 
          ? { ...suggestion, applied: true }
          : suggestion
      )
    );
    
    setCelebrationEmoji('🎯');
    setShowFloatingEmoji(true);
    setShowConfetti(true);
    
    toast({
      title: "Suggestion Applied! 🎉",
      description: "Great job taking action on the AI suggestion!",
      duration: 3000,
    });
    
    setTimeout(() => setShowFloatingEmoji(false), 2000);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const toggleFilter = (filterType: keyof SuggestionFilter, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'relationship': return <Heart className="w-4 h-4" />;
      case 'parenting': return <Users className="w-4 h-4" />;
      case 'personal_growth': return <TrendingUp className="w-4 h-4" />;
      case 'conflict_resolution': return <Zap className="w-4 h-4" />;
      case 'intimacy': return <Star className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'relationship': return 'from-pink-500 to-red-500';
      case 'parenting': return 'from-blue-500 to-cyan-500';
      case 'personal_growth': return 'from-green-500 to-emerald-500';
      case 'conflict_resolution': return 'from-orange-500 to-red-500';
      case 'intimacy': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRasaInfo = (rasa: string) => {
    switch (rasa) {
      case 'radha_krishna': return { name: 'Radha-Krishna', emoji: '🎭', color: 'from-purple-500 to-pink-500' };
      case 'sita_ram': return { name: 'Sita-Ram', emoji: '⚖️', color: 'from-blue-500 to-indigo-500' };
      case 'shiva_shakti': return { name: 'Shiva-Shakti', emoji: '🕉️', color: 'from-orange-500 to-red-500' };
      default: return { name: 'Wisdom', emoji: '🌟', color: 'from-gray-500 to-slate-500' };
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Interactive Elements */}
      <InteractiveConfetti trigger={showConfetti} />
      <FloatingEmoji emoji={celebrationEmoji} trigger={showFloatingEmoji} />

      {/* Header */}
      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Insights & Suggestions</h1>
            <p className="text-gray-600 text-sm">Personalized guidance for your relationship journey</p>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="suggestions" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
            <Sparkles className="w-4 h-4 mr-2" />
            Suggestions
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
            <BarChart3 className="w-4 h-4 mr-2" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-6">
          <div className="flex justify-end">
            <MagicButton 
              onClick={generateNewSuggestions}
              disabled={generating}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {generating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {generating ? 'Generating...' : 'Generate New'}
            </MagicButton>
          </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">{suggestions.length}</div>
            <div className="text-sm text-blue-600">Total Suggestions</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{suggestions.filter(s => s.applied).length}</div>
            <div className="text-sm text-green-600">Applied</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-700">
              {Math.round(suggestions.reduce((sum, s) => sum + s.aiConfidence, 0) / suggestions.length)}%
            </div>
            <div className="text-sm text-purple-600">Avg. AI Confidence</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-600" />
            <h3 className="font-medium text-gray-900">Filters</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
              <div className="flex flex-wrap gap-1">
                {['relationship', 'parenting', 'personal_growth', 'conflict_resolution', 'intimacy'].map(type => (
                  <button
                    key={type}
                    onClick={() => toggleFilter('type', type)}
                    className={`px-2 py-1 rounded-full text-xs transition-all ${
                      filters.type.includes(type)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Difficulty</label>
              <div className="flex flex-wrap gap-1">
                {['easy', 'medium', 'hard'].map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => toggleFilter('difficulty', difficulty)}
                    className={`px-2 py-1 rounded-full text-xs transition-all ${
                      filters.difficulty.includes(difficulty)
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Priority</label>
              <div className="flex flex-wrap gap-1">
                {['high', 'medium', 'low'].map(priority => (
                  <button
                    key={priority}
                    onClick={() => toggleFilter('priority', priority)}
                    className={`px-2 py-1 rounded-full text-xs transition-all ${
                      filters.priority.includes(priority)
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Rasa Alignment</label>
              <div className="flex flex-wrap gap-1">
                {['radha_krishna', 'sita_ram', 'shiva_shakti'].map(rasa => (
                  <button
                    key={rasa}
                    onClick={() => toggleFilter('rasaAlignment', rasa)}
                    className={`px-2 py-1 rounded-full text-xs transition-all ${
                      filters.rasaAlignment.includes(rasa)
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {getRasaInfo(rasa).emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions List */}
      <div className="space-y-4">
        {filteredSuggestions.map((suggestion) => {
          const rasaInfo = getRasaInfo(suggestion.rasaAlignment);
          
          return (
            <Card key={suggestion.id} className={`overflow-hidden card-hover-lift interactive-card ${
              suggestion.applied ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-white'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getTypeColor(suggestion.type)} text-white`}>
                      {getTypeIcon(suggestion.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{suggestion.title}</h3>
                      <p className="text-sm text-gray-600">{suggestion.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getDifficultyColor(suggestion.difficulty)}>
                          {suggestion.difficulty}
                        </Badge>
                        <Badge className={getPriorityColor(suggestion.priority)}>
                          {suggestion.priority} priority
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {suggestion.timeCommitment}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {rasaInfo.emoji} {rasaInfo.name}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {suggestion.applied && (
                    <Badge className="bg-green-100 text-green-700">
                      ✓ Applied
                    </Badge>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-500" />
                    AI Context:
                  </h4>
                  <p className="text-sm text-gray-700">{suggestion.context}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-gray-500">
                      AI Confidence: {suggestion.aiConfidence}%
                    </div>
                    <Progress value={suggestion.aiConfidence} className="w-24 h-2" />
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 mb-3">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    Action Steps:
                  </h4>
                  <ol className="space-y-1">
                    {suggestion.actionSteps.map((step, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-blue-500 font-medium">{index + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-green-50 rounded-lg p-3 mb-3">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    Expected Outcome:
                  </h4>
                  <p className="text-sm text-gray-700">{suggestion.expectedOutcome}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {suggestion.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {!suggestion.applied && (
                    <MagicButton 
                      size="sm"
                      onClick={() => applySuggestion(suggestion.id)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Apply Suggestion
                    </MagicButton>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredSuggestions.length === 0 && (
        <Card className="bg-gray-50">
          <CardContent className="p-8 text-center">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No suggestions match your filters</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filter criteria to see more suggestions</p>
            <Button 
              variant="outline" 
              onClick={() => setFilters({ type: [], difficulty: [], priority: [], rasaAlignment: [] })}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <RelationshipInsightsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}