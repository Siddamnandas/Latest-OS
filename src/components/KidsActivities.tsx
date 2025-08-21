'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  // Emotion Explorers
  Baby,
  Book,
  
  // Mythological Characters
  Feather,
  
  // Krishna Prank
  Smile,
  Laugh,
  
  // Hanuman Helper
  CheckCircle,
  
  // Saraswati Creative
  Brush,
  
  // General
  Target,
  Heart,
  Clock,
  Users,
  Play,
  Camera,
  Plus,
  Gift,
  BarChart3,
  Brain,
  Sparkles,
  TrendingUp,
  Calendar,
  Activity,
  Trophy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InteractiveConfetti } from '@/components/InteractiveConfetti';
import { MagicButton } from '@/components/MagicButton';
import { FloatingEmoji } from '@/components/FloatingEmoji';

interface EmotionScenario {
  id: string;
  title: string;
  description: string;
  character: string;
  situation: string;
  emotions: string[];
  emojis: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

interface KindnessMoment {
  id: string;
  date: Date;
  description: string;
  category: string;
  points: number;
  verified: boolean;
}

interface MythologicalQuestion {
  id: string;
  character: string;
  question: string;
  answer: string;
  context: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ThemedDay {
  id: string;
  name: string;
  character: string;
  essence: string;
  color: string;
  icon: React.ReactNode;
  description: string;
  parentRole: string;
}

interface KrishnaPrank {
  id: string;
  title: string;
  helperParent: string;
  targetParent: string;
  prompt: string;
  instructions: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
}

interface HanumanTask {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  materials: string[];
  celebrationPrompt: string;
}

interface SaraswatiCreative {
  id: string;
  title: string;
  description: string;
  category: string;
  materials: string[];
  prompts: string[];
  estimatedTime: string;
  reflectionQuestions: string[];
}

interface FamilyStorybookEntry {
  id: string;
  date: Date;
  type: 'krishna' | 'hanuman' | 'saraswati';
  title: string;
  description: string;
  photo?: string;
  video?: string;
  notes?: string;
  participants: string[];
}

export function KidsActivities() {
  const [emotionScenarios, setEmotionScenarios] = useState<EmotionScenario[]>([]);
  const [kindnessMoments, setKindnessMoments] = useState<KindnessMoment[]>([]);
  const [mythologicalQuestions, setMythologicalQuestions] = useState<MythologicalQuestion[]>([]);
  const [themedDays, setThemedDays] = useState<ThemedDay[]>([]);
  const [krishnaPranks, setKrishnaPranks] = useState<KrishnaPrank[]>([]);
  const [hanumanTasks, setHanumanTasks] = useState<HanumanTask[]>([]);
  const [saraswatiCreatives, setSaraswatiCreatives] = useState<SaraswatiCreative[]>([]);
  const [storybookEntries, setStorybookEntries] = useState<FamilyStorybookEntry[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [kindnessPoints, setKindnessPoints] = useState(0);
  const [currentDay, setCurrentDay] = useState('');
  const [activeTab, setActiveTab] = useState('activities');
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFloatingEmoji, setShowFloatingEmoji] = useState(false);
  const [celebrationEmoji, setCelebrationEmoji] = useState('🎉');
  const { toast } = useToast();

  useEffect(() => {
    // Initialize all data
    initializeData();
  }, []);

  const initializeData = () => {
    // Emotion Explorers Scenarios
    const emotionScenariosData: EmotionScenario[] = [
      {
        id: '1',
        title: 'The Lost Toy',
        description: 'A little bear lost his favorite toy',
        character: 'Bear',
        situation: 'Lost favorite toy',
        emotions: ['Sad', 'Upset', 'Disappointed', 'Worried'],
        emojis: ['😢', '😞', '😔', '😟'],
        difficulty: 'easy'
      },
      {
        id: '2',
        title: 'The Birthday Surprise',
        description: 'Rabbit gets a surprise birthday party',
        character: 'Rabbit',
        situation: 'Surprise party',
        emotions: ['Happy', 'Excited', 'Surprised', 'Grateful'],
        emojis: ['😊', '😄', '😲', '🙏'],
        difficulty: 'easy'
      },
      {
        id: '3',
        title: 'The Rainy Day',
        description: 'Fox cannot play outside because of rain',
        character: 'Fox',
        situation: 'Cannot play outside',
        emotions: ['Bored', 'Disappointed', 'Sad', 'Frustrated'],
        emojis: ['😑', '😞', '😢', '😤'],
        difficulty: 'medium'
      }
    ];

    // Kindness Moments (Sample)
    const kindnessMomentsData: KindnessMoment[] = [
      {
        id: '1',
        date: new Date(),
        description: 'Shared toys with friend',
        category: 'Sharing',
        points: 5,
        verified: true
      },
      {
        id: '2',
        date: new Date(),
        description: 'Helped mom with dishes',
        category: 'Helping',
        points: 8,
        verified: true
      }
    ];

    // Mythological Questions
    const mythologicalQuestionsData: MythologicalQuestion[] = [
      {
        id: '1',
        character: 'Krishna',
        question: 'Why did Krishna love to play the flute?',
        answer: 'Because music brings joy and happiness to everyone',
        context: 'Krishna\'s flute music made all the cows and villagers happy',
        difficulty: 'easy'
      },
      {
        id: '2',
        character: 'Hanuman',
        question: 'Why was Hanuman so strong?',
        answer: 'Because he had unwavering faith and devotion',
        context: 'Hanuman\'s strength came from his pure heart and devotion to Rama',
        difficulty: 'medium'
      },
      {
        id: '3',
        character: 'Saraswati',
        question: 'Why does Saraswati hold a veena?',
        answer: 'Because music and knowledge create harmony in the world',
        context: 'Saraswati\'s veena represents the music of knowledge and wisdom',
        difficulty: 'medium'
      }
    ];

    // Themed Days
    const themedDaysData: ThemedDay[] = [
      {
        id: 'krishna',
        name: 'Krishna Prank Day',
        character: 'Krishna',
        essence: 'Play & joy',
        color: 'from-purple-500 to-pink-500',
        icon: <Smile className="w-5 h-5" />,
        description: 'The child becomes Krishna and does pranks with parents',
        parentRole: 'Help or be the target'
      },
      {
        id: 'hanuman',
        name: 'Hanuman Helper Day',
        character: 'Hanuman',
        essence: 'Service & contribution',
        color: 'from-orange-500 to-red-500',
        icon: <CheckCircle className="w-5 h-5" />,
        description: 'The child takes responsibility and does helpful tasks',
        parentRole: 'Encourage task'
      },
      {
        id: 'saraswati',
        name: 'Saraswati Creative Day',
        character: 'Saraswati',
        essence: 'Creativity & curiosity',
        color: 'from-blue-500 to-indigo-500',
        icon: <Brush className="w-5 h-5" />,
        description: 'Parents and child do creative activities together',
        parentRole: 'Facilitate & engage'
      }
    ];

    // Krishna Pranks
    const krishnaPranksData: KrishnaPrank[] = [
      {
        id: '1',
        title: 'The Mysterious Note',
        helperParent: 'Mom',
        targetParent: 'Dad',
        prompt: 'Help your child write a mysterious note and hide it for Dad to find',
        instructions: [
          'Write a fun, mysterious message together',
          'Hide it where Dad will find it during the day',
          'Keep it light and fun',
          'Enjoy Dad\'s surprised reaction together'
        ],
        difficulty: 'easy',
        estimatedTime: '15 minutes'
      },
      {
        id: '2',
        title: 'The Sock Swap',
        helperParent: 'Dad',
        targetParent: 'Mom',
        prompt: 'Help your child swap a few pairs of socks in Mom\'s drawer',
        instructions: [
          'Choose colorful, fun socks',
          'Swap 2-3 pairs in Mom\'s drawer',
          'Be there when Mom discovers it',
          'Laugh together about the fun mix-up'
        ],
        difficulty: 'easy',
        estimatedTime: '10 minutes'
      }
    ];

    // Hanuman Tasks
    const hanumanTasksData: HanumanTask[] = [
      {
        id: '1',
        title: 'Book Organization Mission',
        description: 'Organize your books like a true Hanuman helper',
        category: 'Organization',
        difficulty: 'easy',
        estimatedTime: '20 minutes',
        materials: ['Books', 'Shelf space'],
        celebrationPrompt: 'Great job organizing! You\'re as helpful as Hanuman!'
      },
      {
        id: '2',
        title: 'Toy Tidy Up',
        description: 'Help organize the toys in the living room',
        category: 'Cleaning',
        difficulty: 'easy',
        estimatedTime: '15 minutes',
        materials: ['Toys', 'Storage containers'],
        celebrationPrompt: 'Wonderful work! You\'re a true helper like Hanuman!'
      }
    ];

    // Saraswati Creatives
    const saraswatiCreativesData: SaraswatiCreative[] = [
      {
        id: '1',
        title: 'Dream House Drawing',
        description: 'Draw your dream house and tell your parent about it',
        category: 'Drawing',
        materials: ['Paper', 'Colors', 'Pencils'],
        prompts: [
          'What rooms would you have?',
          'What special features would make it fun?',
          'Who would live there with you?'
        ],
        estimatedTime: '30 minutes',
        reflectionQuestions: [
          'What was the most fun part of your dream house?',
          'What would you do if you lived there?'
        ]
      },
      {
        id: '2',
        title: 'Story Creation',
        description: 'Create a story together with your child',
        category: 'Storytelling',
        materials: ['Paper', 'Pencils', 'Imagination'],
        prompts: [
          'Who would be the main character?',
          'What adventure would they go on?',
          'How would the story end?'
        ],
        estimatedTime: '25 minutes',
        reflectionQuestions: [
          'What was your favorite part of the story?',
          'What would you like to create a story about next time?'
        ]
      }
    ];

    // Family Storybook Entries
    const storybookEntriesData: FamilyStorybookEntry[] = [
      {
        id: '1',
        date: new Date(),
        type: 'krishna',
        title: 'The Great Note Adventure',
        description: 'Had fun writing mysterious notes and hiding them',
        participants: ['Child', 'Mom']
      },
      {
        id: '2',
        date: new Date(),
        type: 'hanuman',
        title: 'Book Organization Mission',
        description: 'Successfully organized all books on the shelf',
        participants: ['Child', 'Dad']
      }
    ];

    setEmotionScenarios(emotionScenariosData);
    setKindnessMoments(kindnessMomentsData);
    setMythologicalQuestions(mythologicalQuestionsData);
    setThemedDays(themedDaysData);
    setKrishnaPranks(krishnaPranksData);
    setHanumanTasks(hanumanTasksData);
    setSaraswatiCreatives(saraswatiCreativesData);
    setStorybookEntries(storybookEntriesData);
    
    // Calculate kindness points
    const totalPoints = kindnessMomentsData.reduce((sum, moment) => sum + moment.points, 0);
    setKindnessPoints(totalPoints);
    
    // Set current day (randomized daily selection)
    const availableDays = ['krishna', 'hanuman', 'saraswati'];
    const randomDay = availableDays[Math.floor(Math.random() * availableDays.length)];
    setCurrentDay(randomDay);
    
    setLoading(false);
  };

  const handleEmotionSelect = (emotion: string, emoji: string) => {
    setSelectedEmotion(emotion);
    setCelebrationEmoji(emoji);
    setShowFloatingEmoji(true);
    toast({
      title: "Emotion Selected! 🎭",
      description: `You chose ${emoji} ${emotion} - Great emotional vocabulary building!`,
      duration: 3000,
    });
    setTimeout(() => setShowFloatingEmoji(false), 2000);
  };

  const handleKindnessMoment = (description: string, category: string) => {
    const newMoment: KindnessMoment = {
      id: Date.now().toString(),
      date: new Date(),
      description,
      category,
      points: Math.floor(Math.random() * 10) + 1,
      verified: true
    };
    
    setKindnessMoments(prev => [...prev, newMoment]);
    setKindnessPoints(prev => prev + newMoment.points);
    setCelebrationEmoji('💖');
    setShowFloatingEmoji(true);
    
    toast({
      title: "Kindness Recorded! 🌟",
      description: `Great job! You earned ${newMoment.points} kindness points.`,
      duration: 3000,
    });
    setTimeout(() => setShowFloatingEmoji(false), 2000);
  };

  const handleMythologicalAnswer = (questionId: string, answer: string) => {
    const question = mythologicalQuestions.find(q => q.id === questionId);
    if (question) {
      setCelebrationEmoji('📚');
      setShowFloatingEmoji(true);
      toast({
        title: "Great Answer! 📚",
        description: `You know about ${question.character}! ${question.answer}`,
        duration: 4000,
      });
      setTimeout(() => setShowFloatingEmoji(false), 2000);
    }
  };

  const handlePrankComplete = (prankId: string) => {
    const prank = krishnaPranks.find(p => p.id === prankId);
    if (prank) {
      const newEntry: FamilyStorybookEntry = {
        id: Date.now().toString(),
        date: new Date(),
        type: 'krishna',
        title: prank.title,
        description: `Had fun with ${prank.helperParent} and ${prank.targetParent}`,
        participants: ['Child', prank.helperParent, prank.targetParent]
      };
      
      setStorybookEntries(prev => [...prev, newEntry]);
      setCelebrationEmoji('😄');
      setShowFloatingEmoji(true);
      setShowConfetti(true);
      
      toast({
        title: "Prank Complete! 😄",
        description: "What a fun Krishna-style adventure!",
        duration: 3000,
      });
      setTimeout(() => setShowFloatingEmoji(false), 2000);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleTaskComplete = (taskId: string) => {
    const task = hanumanTasks.find(t => t.id === taskId);
    if (task) {
      const newEntry: FamilyStorybookEntry = {
        id: Date.now().toString(),
        date: new Date(),
        type: 'hanuman',
        title: task.title,
        description: task.description,
        participants: ['Child', 'Parent']
      };
      
      setStorybookEntries(prev => [...prev, newEntry]);
      setCelebrationEmoji('🎉');
      setShowFloatingEmoji(true);
      
      toast({
        title: "Task Complete! 🎉",
        description: task.celebrationPrompt,
        duration: 3000,
      });
      setTimeout(() => setShowFloatingEmoji(false), 2000);
    }
  };

  const handleCreativeComplete = (creativeId: string) => {
    const creative = saraswatiCreatives.find(c => c.id === creativeId);
    if (creative) {
      const newEntry: FamilyStorybookEntry = {
        id: Date.now().toString(),
        date: new Date(),
        type: 'saraswati',
        title: creative.title,
        description: creative.description,
        participants: ['Child', 'Parent']
      };
      
      setStorybookEntries(prev => [...prev, newEntry]);
      setCelebrationEmoji('🎨');
      setShowFloatingEmoji(true);
      setShowConfetti(true);
      
      toast({
        title: "Creation Complete! 🎨",
        description: "Beautiful Saraswati-inspired creativity!",
        duration: 3000,
      });
      setTimeout(() => setShowFloatingEmoji(false), 2000);
      setTimeout(() => setShowConfetti(false), 3000);
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

  const getCharacterColor = (character: string) => {
    switch (character) {
      case 'Krishna': return 'bg-purple-100 text-purple-700';
      case 'Hanuman': return 'bg-orange-100 text-orange-700';
      case 'Saraswati': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
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

      {/* Animated Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Kids & Family Activities
        </h1>
        <p className="text-gray-600">Fun, learning, and growth for the whole family</p>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
          <TabsTrigger value="ai-coaching">AI Coach</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="space-y-4">
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                  <Baby className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Kids Activities</h1>
                <p className="text-gray-600 text-sm">Mythology adventures for emotional intelligence</p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-lg opacity-40 animate-ping"></div>
                <div className="relative bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-full">
                  <Gift className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

      {/* Animated Kindness Jar Meter */}
      <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-6 relative overflow-hidden">
          {/* Floating hearts animation */}
          <div className="absolute top-2 right-2 animate-bounce">
            <div className="text-2xl opacity-30">💖</div>
          </div>
          <div className="absolute top-8 right-8 animate-bounce delay-300">
            <div className="text-xl opacity-20">💕</div>
          </div>
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-pink-300 rounded-full blur-lg opacity-50 animate-pulse"></div>
                <div className="relative w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center transform hover:scale-110 transition-all duration-200">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Kindness Jar</h3>
                <p className="text-sm text-gray-600">Building emotional intelligence</p>
              </div>
            </div>
            <div className="text-center bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg p-3 min-w-[100px] transform hover:scale-105 transition-all duration-200">
              <div className="text-3xl font-bold text-pink-600 animate-pulse">{kindnessPoints}</div>
              <div className="text-sm text-pink-600 font-medium">Kindness Points</div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="relative">
              <Progress value={Math.min(kindnessPoints * 10, 100)} className="h-4 bg-pink-200 overflow-hidden" />
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-1000 ease-out animate-pulse"
                style={{ width: `${Math.min(kindnessPoints * 10, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>Keep being kind!</span>
              <span>{Math.min(kindnessPoints * 10, 100)}% full</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => handleKindnessMoment('Shared toys with friend', 'Sharing')}
              className="flex-1 bg-pink-500 hover:bg-pink-600 btn-enhanced"
            >
              Shared Toys
            </Button>
            <Button 
              onClick={() => handleKindnessMoment('Helped with dinner', 'Helping')}
              className="flex-1 bg-pink-500 hover:bg-pink-600 btn-enhanced"
            >
              Helped Parents
            </Button>
            <Button 
              onClick={() => handleKindnessMoment('Comforted sad friend', 'Comforting')}
              className="flex-1 bg-pink-500 hover:bg-pink-600 btn-enhanced"
            >
              Comforted Friend
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
            {/* Daily Games Card */}
            <Card className="flex-shrink-0 w-80 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 card-hover-lift interactive-card">
              <CardContent className="p-4 relative overflow-hidden">
                {/* Floating emoji */}
                <div className="absolute top-2 right-2 animate-bounce">
                  <div className="text-xl opacity-20">🎭</div>
                </div>
                
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">Daily Games</h4>
                    <p className="text-xs text-gray-600 font-medium">Emotional learning</p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-300 rounded-full blur-lg opacity-50 animate-pulse"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center transform hover:scale-110 transition-all duration-200">
                      <Baby className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {emotionScenarios.slice(0, 2).map((scenario) => (
                    <div key={scenario.id} className="bg-white rounded-lg p-3 border border-blue-100 hover:shadow-md transition-all duration-200">
                      <h5 className="text-sm font-medium text-blue-900">{scenario.title}</h5>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {scenario.emotions.slice(0, 3).map((emotion, index) => (
                          <span key={index} className="text-xs bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-2 py-1 rounded-full hover:scale-105 transition-transform">
                            {scenario.emojis[index]} {emotion}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mythology Facts Card */}
            <Card className="flex-shrink-0 w-80 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 card-hover-lift interactive-card">
              <CardContent className="p-4 relative overflow-hidden">
                {/* Floating emoji */}
                <div className="absolute top-2 right-2 animate-bounce">
                  <div className="text-xl opacity-20">📚</div>
                </div>
                
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">Mythology Facts</h4>
                    <p className="text-xs text-gray-600 font-medium">Ancient wisdom</p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-300 rounded-full blur-lg opacity-50 animate-pulse"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center transform hover:scale-110 transition-all duration-200">
                      <Feather className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {mythologicalQuestions.slice(0, 2).map((question) => (
                    <div key={question.id} className="bg-white rounded-lg p-3 border border-yellow-100 hover:shadow-md transition-all duration-200">
                      <h5 className="text-sm font-medium text-yellow-900">{question.question}</h5>
                      <p className="text-xs text-yellow-800 mt-1 font-medium">{question.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Today's Activity Card */}
            <Card className="flex-shrink-0 w-80 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 card-hover-lift interactive-card">
              <CardContent className="p-4 relative overflow-hidden">
                {/* Floating emoji */}
                <div className="absolute top-2 right-2 animate-bounce">
                  <div className="text-xl opacity-20">🎯</div>
                </div>
                
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">Today's Activity</h4>
                    <p className="text-xs text-gray-600 font-medium">
                      {themedDays.find(d => d.id === currentDay)?.name || 'Special Day'}
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-300 rounded-full blur-lg opacity-50 animate-pulse"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center transform hover:scale-110 transition-all duration-200 animate-bounce">
                      {currentDay === 'krishna' && <Smile className="w-6 h-6 text-white" />}
                      {currentDay === 'hanuman' && <CheckCircle className="w-6 h-6 text-white" />}
                      {currentDay === 'saraswati' && <Brush className="w-6 h-6 text-white" />}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 mb-3">
                  <p className="text-sm text-purple-800 font-medium">
                    {currentDay === 'krishna' && '🎭 Playful pranks and joyful moments!'}
                    {currentDay === 'hanuman' && '💪 Strong helper tasks for family!'}
                    {currentDay === 'saraswati' && '🎨 Creative expression and learning!'}
                  </p>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md btn-enhanced">
                  Start Adventure
                </Button>
              </CardContent>
            </Card>
          </div>

        {/* Enhanced Kindness Jar Section */}
        <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Kindness Jar</h3>
                  <p className="text-sm text-gray-600">Building emotional intelligence through kindness</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-pink-600">{kindnessPoints}</div>
                <div className="text-sm text-pink-600">Kindness Points</div>
              </div>
            </div>
            
            <div className="mb-4">
              <Progress value={Math.min(kindnessPoints * 10, 100)} className="h-3" />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Keep being kind!</span>
                <span>{Math.min(kindnessPoints * 10, 100)}% full</span>
              </div>
            </div>
            
            <div className="flex gap-2 mb-4">
              <Button 
                onClick={() => handleKindnessMoment('Shared toys with friend', 'Sharing')}
                className="flex-1 bg-pink-500 hover:bg-pink-600"
              >
                Shared Toys
              </Button>
              <Button 
                onClick={() => handleKindnessMoment('Helped with dinner', 'Helping')}
                className="flex-1 bg-pink-500 hover:bg-pink-600"
              >
                Helped Parents
              </Button>
              <Button 
                onClick={() => handleKindnessMoment('Comforted sad friend', 'Comforting')}
                className="flex-1 bg-pink-500 hover:bg-pink-600"
              >
                Comforted Friend
              </Button>
            </div>

            {/* Add Memory Section */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Add a Kindness Memory</h4>
              <div className="space-y-3">
                <Textarea 
                  placeholder="Describe the kind act..." 
                  className="min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Camera className="w-4 h-4 mr-2" />
                    Add Photo
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    Add Video
                  </Button>
                  <Button size="sm" className="flex-1 bg-pink-500 hover:bg-pink-600">
                    <Heart className="w-4 h-4 mr-2" />
                    Save Memory
                  </Button>
                </div>
              </div>
            </div>

            {/* Recent Kindness Moments */}
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Recent Kindness Moments</h4>
              <div className="space-y-2">
                {kindnessMoments.slice(0, 3).map((moment) => (
                  <div key={moment.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{moment.description}</p>
                        <p className="text-xs text-gray-500">{moment.category} • +{moment.points} points</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <Camera className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Play className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Storybook Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Family Storybook</h3>
              <p className="text-sm text-gray-600">Capture your mythology-inspired adventures</p>
            </div>
            <Badge variant="outline" className="text-xs">
              <Gift className="w-3 h-3 mr-1" />
              {storybookEntries.length} memories
            </Badge>
          </div>

          {storybookEntries.length === 0 ? (
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Start Your Family Story</h4>
                <p className="text-gray-600 mb-4">
                  Complete activities to start building your family's mythology-inspired storybook!
                </p>
                <Button className="bg-purple-500 hover:bg-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Memory
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {storybookEntries.map((entry) => (
                <Card key={entry.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{entry.title}</h4>
                          <Badge className={getCharacterColor(entry.type)}>
                            {entry.type === 'krishna' ? '👦 Krishna' : 
                             entry.type === 'hanuman' ? '🐒 Hanuman' : '👩 Saraswati'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{entry.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{entry.date.toLocaleDateString()}</span>
                          <span>{entry.participants.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Camera className="w-4 h-4 mr-1" />
                        Add Photo
                      </Button>
                      <Button size="sm" variant="outline">
                        <Play className="w-4 h-4 mr-1" />
                        Add Video
                      </Button>
                      <Button size="sm" variant="outline">
                        <Heart className="w-4 h-4 mr-1" />
                        Remember
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Main Content - Horizontal Layout */}
        <div className="space-y-6">
          {/* Daily Games & Activities Section - Horizontal */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Today's Adventures</h3>
              <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:scale-105 transition-transform">
                <Target className="w-3 h-3 mr-1" />
                Fun learning every day
              </Badge>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex gap-4 overflow-x-auto pb-2 horizontal-scroll">
              {/* Daily Games Card */}
              <Card className="flex-shrink-0 w-64 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Book className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Daily Games</h4>
                      <p className="text-xs text-gray-600">Fun & learning</p>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Play Now
                  </Button>
                </CardContent>
              </Card>

              {/* Kindness Challenges Card */}
              <Card className="flex-shrink-0 w-64 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-pink-100">
                      <Heart className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Kindness Challenges</h4>
                      <p className="text-xs text-gray-600">Spread love & joy</p>
                    </div>
                  </div>
                  <Button className="w-full bg-pink-600 hover:bg-pink-700">
                    Start Challenge
                  </Button>
                </CardContent>
              </Card>

              {/* Mythological Stories Card */}
              <Card className="flex-shrink-0 w-64 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-orange-100">
                      <Feather className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Mythological Stories</h4>
                      <p className="text-xs text-gray-600">Ancient wisdom tales</p>
                    </div>
                  </div>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Read Stories
                  </Button>
                </CardContent>
              </Card>

              {/* Creative Activities Card */}
              <Card className="flex-shrink-0 w-64 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <Brush className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Creative Activities</h4>
                      <p className="text-xs text-gray-600">Art & craft fun</p>
                    </div>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Create Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        </TabsContent>

        <TabsContent value="development" className="space-y-4">
          {/* Development Content */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Child Development Tracking</h3>
                <p className="text-gray-600 mb-4">Monitor your children's growth and development milestones</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Track Development
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-coaching" className="space-y-4">
          {/* AI Coaching Content */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI Parenting Coach</h3>
                <p className="text-gray-600 mb-4">Get personalized AI-powered parenting advice and insights</p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Start Coaching Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          {/* Milestones Content */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Family Milestones</h3>
                <p className="text-gray-600 mb-4">Celebrate and track important family achievements</p>
                <Button className="bg-yellow-600 hover:bg-yellow-700">
                  View Milestones
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}