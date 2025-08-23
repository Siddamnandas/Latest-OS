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
import { KidsMobileActions } from '@/components/KidsMobileActions';

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
  const [showSecondaryActivities, setShowSecondaryActivities] = useState(false);
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

  // Add new activity handlers
  const startDailyGame = () => {
    const games = emotionScenarios;
    const randomGame = games[Math.floor(Math.random() * games.length)];
    setSelectedEmotion(null);
    setCelebrationEmoji('🎲');
    setShowFloatingEmoji(true);
    toast({
      title: "Game Started! 🎲",
      description: `Let's play "${randomGame.title}" - Help ${randomGame.character} with their emotions!`,
      duration: 4000,
    });
    setTimeout(() => setShowFloatingEmoji(false), 2000);
  };

  const startKindnessChallenge = () => {
    const challenges = [
      "Share a toy with a friend",
      "Help mom or dad with a task", 
      "Say something nice to someone",
      "Help someone who is sad",
      "Clean up without being asked"
    ];
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    setCelebrationEmoji('💖');
    setShowFloatingEmoji(true);
    toast({
      title: "Kindness Challenge! 💖",
      description: `Today's challenge: ${randomChallenge}`,
      duration: 5000,
    });
    setTimeout(() => setShowFloatingEmoji(false), 2000);
  };

  const readMythologicalStory = () => {
    const stories = mythologicalQuestions;
    const randomStory = stories[Math.floor(Math.random() * stories.length)];
    setCelebrationEmoji('📚');
    setShowFloatingEmoji(true);
    toast({
      title: "Story Time! 📚",
      description: `Let's learn about ${randomStory.character}: ${randomStory.context}`,
      duration: 6000,
    });
    setTimeout(() => setShowFloatingEmoji(false), 2000);
  };

  const startCreativeActivity = () => {
    const activities = saraswatiCreatives;
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    setCelebrationEmoji('🎨');
    setShowFloatingEmoji(true);
    toast({
      title: "Creative Time! 🎨",
      description: `Let's create: ${randomActivity.title}`,
      duration: 5000,
    });
    setTimeout(() => setShowFloatingEmoji(false), 2000);
  };

  const startDevelopmentTracking = () => {
    setCelebrationEmoji('🧠');
    setShowFloatingEmoji(true);
    toast({
      title: "Development Tracking! 🧠",
      description: "Let's track your child's amazing growth and milestones!",
      duration: 4000,
    });
    setTimeout(() => setShowFloatingEmoji(false), 2000);
  };

  const startAICoaching = () => {
    setCelebrationEmoji('✨');
    setShowFloatingEmoji(true);
    toast({
      title: "AI Coach Ready! ✨",
      description: "Your personal parenting assistant is here to help!",
      duration: 4000,
    });
    setTimeout(() => setShowFloatingEmoji(false), 2000);
  };

  const viewFamilyMilestones = () => {
    setCelebrationEmoji('🏆');
    setShowFloatingEmoji(true);
    toast({
      title: "Family Milestones! 🏆",
      description: "Celebrating all your family's amazing achievements!",
      duration: 4000,
    });
    setTimeout(() => setShowFloatingEmoji(false), 2000);
  };

  const saveKindnessMemory = () => {
    const newMoment: KindnessMoment = {
      id: Date.now().toString(),
      date: new Date(),
      description: "Custom kindness memory",
      category: "Custom",
      points: 10,
      verified: true
    };
    
    setKindnessMoments(prev => [...prev, newMoment]);
    setKindnessPoints(prev => prev + newMoment.points);
    setCelebrationEmoji('📸');
    setShowFloatingEmoji(true);
    
    toast({
      title: "Memory Saved! 📸",
      description: "Your special kindness moment has been added to the family story!",
      duration: 3000,
    });
    setTimeout(() => setShowFloatingEmoji(false), 2000);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'kindness':
        handleKindnessMoment('Quick kindness moment! 💖', 'Quick Action');
        break;
      case 'create':
        startCreativeActivity();
        break;
      case 'story':
        readMythologicalStory();
        break;
      case 'photo':
        addFirstMemory();
        break;
      default:
        break;
    }
  };

  const addFirstMemory = () => {
    const newEntry: FamilyStorybookEntry = {
      id: Date.now().toString(),
      date: new Date(),
      type: 'krishna',
      title: 'Our First Adventure',
      description: 'Started our mythology-inspired family journey!',
      participants: ['Family']
    };
    
    setStorybookEntries(prev => [...prev, newEntry]);
    setCelebrationEmoji('📚');
    setShowFloatingEmoji(true);
    setShowConfetti(true);
    
    toast({
      title: "First Memory Added! 📚",
      description: "Welcome to your family's mythology-inspired storybook!",
      duration: 4000,
    });
    setTimeout(() => setShowFloatingEmoji(false), 2000);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const getCharacterColor = (type: 'krishna' | 'hanuman' | 'saraswati') => {
    switch (type) {
      case 'krishna':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hanuman':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'saraswati':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-3 sm:p-4">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Cute loading header */}
          <div className="text-center mb-6">
            <div className="animate-bounce mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto flex items-center justify-center shadow-lg">
                <Baby className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="animate-pulse space-y-2">
              <div className="h-6 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mx-auto w-48"></div>
              <div className="h-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full mx-auto w-32"></div>
            </div>
          </div>
          
          {/* Cute loading cards */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
                <div className="animate-pulse flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-xl flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full w-3/4"></div>
                    <div className="h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <p className="text-purple-600 font-medium animate-pulse">Loading magical activities... ✨</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-3 sm:p-4">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Interactive Elements */}
        <InteractiveConfetti trigger={showConfetti} />
        <FloatingEmoji emoji={celebrationEmoji} trigger={showFloatingEmoji} />

        {/* Enhanced Header with AI Companion & Clear Hierarchy */}
        <div className="text-center mb-6 sm:mb-8">
          {/* AI Companion Welcome */}
          <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-3xl p-4 sm:p-6 mb-6 relative overflow-hidden">
            <div className="absolute top-2 right-2 animate-bounce">
              <div className="text-lg opacity-30">✨</div>
            </div>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300">
                  <span className="text-2xl sm:text-3xl">🧚‍♀️</span>
                </div>
              </div>
              <div className="text-left">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Hi! I'm Leela ✨</h2>
                <p className="text-sm sm:text-base text-gray-600">Your magical learning buddy!</p>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 border border-white/50">
              <p className="text-sm sm:text-base text-gray-700 font-medium">
                🌟 Ready for today's adventure? Let's learn, play, and grow together!
              </p>
            </div>
          </div>

          {/* Main Title with Better Spacing */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              Family Learning Adventures
            </h1>
            <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
              Discover emotions, create stories, and build kindness together
            </p>
          </div>
        </div>

        {/* Streamlined Mobile-Optimized Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-white/90 backdrop-blur-sm shadow-xl border border-white/50 rounded-3xl p-2 mx-auto max-w-2xl">
            <TabsTrigger value="activities" className="text-xs sm:text-sm font-semibold rounded-2xl py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
              <Baby className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Today's Fun
            </TabsTrigger>
            <TabsTrigger value="development" className="text-xs sm:text-sm font-semibold rounded-2xl py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
              <Brain className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              My Growth
            </TabsTrigger>
            <TabsTrigger value="ai-coaching" className="text-xs sm:text-sm font-semibold rounded-2xl py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Ask Leela
            </TabsTrigger>
            <TabsTrigger value="milestones" className="text-xs sm:text-sm font-semibold rounded-2xl py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              My Stars
            </TabsTrigger>
          </TabsList>

        <TabsContent value="activities" className="space-y-4">
          {/* Today's Journey Dashboard - Hero Section */}
          <Card className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 border-purple-300 shadow-xl overflow-hidden mb-6">
            <CardContent className="p-6 sm:p-8 relative">
              {/* Leela's Prominent Presence */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <span className="text-3xl sm:text-4xl animate-bounce">🧚‍♀️</span>
                  </div>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Good Morning! ✨</h2>
                  <p className="text-lg sm:text-xl text-gray-700 mb-2">I'm Leela, your magical learning buddy!</p>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg">
                    <p className="text-sm sm:text-base text-gray-700 font-medium">
                      🌟 Ready for today's Krishna Prank adventure? Let's create joyful moments together!
                    </p>
                  </div>
                </div>
              </div>

              {/* Today's Main Action - Clear Hero CTA */}
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Today's Adventure</h3>
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 border border-blue-200 mb-4">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <span className="text-3xl animate-bounce">🎭</span>
                    <h4 className="text-lg sm:text-xl font-bold text-blue-900">Krishna Prank Day</h4>
                  </div>
                  <p className="text-blue-800 mb-4">Create playful, loving moments with family through gentle pranks and laughter!</p>
                  <Button 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-xl transform hover:scale-105 transition-all duration-300 rounded-2xl text-lg py-4 px-8 font-bold min-h-[56px] w-full sm:w-auto"
                    aria-label="Start today's Krishna Prank adventure"
                  >
                    🎭 Start Today's Adventure!
                  </Button>
                </div>
              </div>

              {/* Progress Summary - Condensed */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-pink-200 to-rose-200 rounded-xl p-4 text-center border border-pink-300">
                  <div className="text-2xl font-bold text-pink-600 mb-1">{kindnessPoints}</div>
                  <div className="text-sm text-pink-700 font-semibold">Kindness Stars ⭐</div>
                </div>
                <div className="bg-gradient-to-r from-yellow-200 to-amber-200 rounded-xl p-4 text-center border border-yellow-300">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">{storybookEntries.length}</div>
                  <div className="text-sm text-yellow-700 font-semibold">Memories 📚</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kindness Jar - Enhanced with Clear Separation */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-1 border-2 border-emerald-200 shadow-lg mb-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-none">
              <CardContent className="p-6 sm:p-8 relative overflow-hidden">
                {/* Celebration Effects */}
                {kindnessPoints >= 10 && (
                  <>
                    <div className="absolute top-2 right-2 animate-bounce">
                      <div className="text-3xl opacity-60">🎆</div>
                    </div>
                    <div className="absolute top-6 right-8 animate-bounce delay-300">
                      <div className="text-2xl opacity-50">✨</div>
                    </div>
                    <div className="absolute bottom-2 left-2 animate-bounce delay-500">
                      <div className="text-2xl opacity-40">🌈</div>
                    </div>
                  </>
                )}
                
                {/* Header with Achievement Celebration */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center transform hover:scale-110 transition-all duration-300 shadow-xl">
                        <Heart className="w-8 h-8 text-white animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">My Kindness Jar</h3>
                      <p className="text-sm sm:text-base text-gray-600">Every kind act fills my heart! 💕</p>
                    </div>
                  </div>
                  
                  {/* Achievement Display with Celebration */}
                  <div className="bg-gradient-to-r from-emerald-200 to-teal-200 rounded-2xl p-6 border border-emerald-300 transform hover:scale-105 transition-all duration-300">
                    <div className="text-4xl sm:text-5xl font-bold text-emerald-600 animate-pulse mb-2">{kindnessPoints}</div>
                    <div className="text-lg text-emerald-700 font-semibold mb-3">Kindness Stars</div>
                    <div className="flex justify-center space-x-1 mb-2">
                      {[...Array(Math.min(Math.floor(kindnessPoints / 3), 5))].map((_, i) => (
                        <span key={i} className="text-2xl animate-bounce" style={{animationDelay: `${i * 0.2}s`}}>⭐</span>
                      ))}
                    </div>
                    {kindnessPoints >= 10 && (
                      <div className="text-emerald-700 font-bold animate-pulse">
                        🎉 Amazing! You're a Kindness Champion!
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Progress Bar with Enhanced Feedback */}
                <div className="mb-6">
                  <div className="relative bg-emerald-200 rounded-full h-6 overflow-hidden shadow-inner border border-emerald-300">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                      style={{ width: `${Math.min((kindnessPoints / 15) * 100, 100)}%` }}
                    >
                      <div className="h-full bg-gradient-to-r from-white/30 to-transparent rounded-full animate-pulse"></div>
                    </div>
                    {kindnessPoints >= 15 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-bold text-sm animate-bounce">🎆 Full!</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Keep spreading love! 🌟</span>
                    <span className="font-semibold">{Math.min((kindnessPoints / 15) * 100, 100).toFixed(0)}% to Kindness Master</span>
                  </div>
                </div>
                
                {/* Single Clear CTA - Secondary Action */}
                <div className="text-center">
                  <Button 
                    onClick={() => handleKindnessMoment('Shared love with family today! 💕', 'Daily Love')}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg transform hover:scale-105 transition-all duration-300 rounded-xl text-base py-3 px-6 font-semibold min-h-[48px] w-full sm:w-auto touch-manipulation"
                    aria-label="Add your kind act for today"
                  >
                    🌟 Add Kind Act
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">Record your daily kindness moment</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Activities - Clear Module Separation */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-1 border-2 border-amber-200 shadow-lg mb-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <span className="text-2xl">🎮</span>
                  Learning & Fun
                </h3>
                <p className="text-gray-600">Explore emotions, stories, and creative activities</p>
              </div>
              
              {/* Mobile-Optimized Activity Cards Carousel */}
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {/* Mobile-Optimized Daily Games Card */}
            <Card className="flex-shrink-0 w-full sm:w-72 md:w-80 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 card-hover-lift interactive-card snap-start">
              <CardContent className="p-4 sm:p-3 md:p-4 relative overflow-hidden">
                {/* Floating emoji */}
                <div className="absolute top-2 right-2 animate-bounce">
                  <div className="text-lg sm:text-xl opacity-20">🎭</div>
                </div>
                
                <div className="flex items-center justify-between mb-4 sm:mb-3 relative z-10 gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight">Daily Games</h4>
                    <p className="text-xs sm:text-xs text-gray-600 font-medium mt-1">Emotional learning</p>
                  </div>
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-blue-300 rounded-full blur-lg opacity-50 animate-pulse"></div>
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center transform hover:scale-110 transition-all duration-200">
                      <Baby className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
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

            {/* Mobile-Optimized Mythology Facts Card */}
            <Card className="flex-shrink-0 w-full sm:w-72 md:w-80 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 card-hover-lift interactive-card snap-start">
              <CardContent className="p-4 sm:p-3 md:p-4 relative overflow-hidden">
                {/* Floating emoji */}
                <div className="absolute top-2 right-2 animate-bounce">
                  <div className="text-lg sm:text-xl opacity-20">📚</div>
                </div>
                
                <div className="flex items-center justify-between mb-4 sm:mb-3 relative z-10 gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight">Mythology Facts</h4>
                    <p className="text-xs sm:text-xs text-gray-600 font-medium mt-1">Ancient wisdom</p>
                  </div>
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-yellow-300 rounded-full blur-lg opacity-50 animate-pulse"></div>
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center transform hover:scale-110 transition-all duration-200">
                      <Feather className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
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
            <Card className="flex-shrink-0 w-full sm:w-72 md:w-80 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 card-hover-lift interactive-card snap-start">
              <CardContent className="p-3 sm:p-4 relative overflow-hidden">
                {/* Floating emoji */}
                <div className="absolute top-2 right-2 animate-bounce">
                  <div className="text-lg sm:text-xl opacity-20">🎯</div>
                </div>
                
                <div className="flex items-center justify-between mb-4 sm:mb-3 relative z-10 gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight">Today's Activity</h4>
                    <p className="text-xs sm:text-xs text-gray-600 font-medium mt-1">
                      {themedDays.find(d => d.id === currentDay)?.name || 'Special Day'}
                    </p>
                  </div>
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-purple-300 rounded-full blur-lg opacity-50 animate-pulse"></div>
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center transform hover:scale-110 transition-all duration-200 animate-bounce">
                      {currentDay === 'krishna' && <Smile className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                      {currentDay === 'hanuman' && <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                      {currentDay === 'saraswati' && <Brush className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 mb-3">
                  <p className="text-xs sm:text-sm text-purple-800 font-medium">
                    {currentDay === 'krishna' && '🎭 Playful pranks and joyful moments!'}
                    {currentDay === 'hanuman' && '💪 Strong helper tasks for family!'}
                    {currentDay === 'saraswati' && '🎨 Creative expression and learning!'}
                  </p>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md btn-enhanced text-sm py-3 min-h-[48px] active:scale-95 transition-all duration-200 touch-manipulation"
                  aria-label="Start today's adventure activity"
                >
                  Start Adventure
                </Button>
              </CardContent>
            </Card>
          </div>
            </div>
          </div>

          {/* Family Storybook - Enhanced Module with Thumbnails */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-1 border-2 border-indigo-200 shadow-lg mb-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <span className="text-2xl">📚</span>
                  Family Storybook
                </h3>
                <p className="text-gray-600">Your magical memories and adventures</p>
              </div>

              {storybookEntries.length === 0 ? (
                <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-purple-300 rounded-full blur-xl opacity-50 animate-pulse"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
                        <Book className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Start Your Family Story</h4>
                    <p className="text-gray-600 mb-4">
                      Complete activities to start building your family's mythology-inspired storybook!
                    </p>
                    <Button 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transform hover:scale-105 transition-all duration-300 rounded-xl" 
                      onClick={addFirstMemory}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Memory
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {storybookEntries.map((entry) => (
                    <Card key={entry.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border border-indigo-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            {/* Enhanced with thumbnail avatars */}
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-lg">
                                  {entry.type === 'krishna' ? '🎭' : 
                                   entry.type === 'hanuman' ? '💪' : '🎨'}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{entry.title}</h4>
                                <Badge className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200">
                                  {entry.type === 'krishna' ? '👦 Krishna' : 
                                   entry.type === 'hanuman' ? '🐒 Hanuman' : '👩 Saraswati'}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{entry.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{entry.date.toLocaleDateString()}</span>
                              <span>{entry.participants.join(', ')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <Button size="sm" variant="outline" className="rounded-xl hover:shadow-md transition-all duration-200">
                            <Camera className="w-4 h-4 mr-1" />
                            Add Photo
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-xl hover:shadow-md transition-all duration-200">
                            <Play className="w-4 h-4 mr-1" />
                            Add Video
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-xl hover:shadow-md transition-all duration-200">
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
          </div>

          {/* Leela's Wisdom Corner - Interactive Chat */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-1 border-2 border-rose-200 shadow-lg">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-rose-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
                    <span className="text-2xl animate-bounce">🧚‍♀️</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Leela's Wisdom Corner</h3>
                  <p className="text-gray-600">Daily tips and magical guidance</p>
                </div>
              </div>
              
              {/* Chat bubble with daily wisdom */}
              <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl p-4 border border-rose-200 relative">
                <div className="absolute -left-2 top-4 w-4 h-4 bg-gradient-to-r from-rose-100 to-pink-100 transform rotate-45 border-l border-b border-rose-200"></div>
                <p className="text-gray-700 italic">
                  "🌟 Did you know? When we help others, it makes our hearts sparkle with joy! Today, try helping someone in your family and watch how it makes you feel! ✨"
                </p>
                <p className="text-right text-sm text-gray-500 mt-2 font-medium">- Leela 🧚‍♀️</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="development" className="space-y-4 sm:space-y-6">
          {/* Enhanced Development Content with Safety Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Growth Tracking */}
            <Card className="bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200 border-blue-300 shadow-lg overflow-hidden">
              <CardContent className="p-6 text-center relative">
                <div className="absolute top-2 right-2 animate-bounce">
                  <div className="text-lg opacity-30">🌱</div>
                </div>
                
                <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 mx-auto mb-4 transform hover:scale-110 transition-all duration-300" />
                
                <h3 className="text-lg sm:text-xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  🌱 My Growth Journey
                </h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  Track learning milestones and celebrate achievements!
                </p>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-blue-200 shadow-md">
                    <div className="text-lg sm:text-xl font-bold text-blue-600">15 🏆</div>
                    <div className="text-xs text-gray-600">Skills Learned</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-purple-200 shadow-md">
                    <div className="text-lg sm:text-xl font-bold text-purple-600">8 ⭐</div>
                    <div className="text-xs text-gray-600">Goals Reached</div>
                  </div>
                </div>
                
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg transform hover:scale-105 transition-all duration-200 rounded-xl"
                  onClick={startDevelopmentTracking}
                >
                  📈 See My Progress!
                </Button>
              </CardContent>
            </Card>

            {/* Safety & Parental Controls */}
            <Card className="bg-gradient-to-br from-green-100 via-emerald-100 to-green-200 border-green-300 shadow-lg overflow-hidden">
              <CardContent className="p-6 text-center relative">
                <div className="absolute top-2 right-2 animate-bounce">
                  <div className="text-lg opacity-30">🔒</div>
                </div>
                
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl sm:text-3xl">🔒</span>
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  🔒 Safe Learning
                </h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  Parent-approved content with accessibility features
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between bg-white/80 rounded-lg p-2 text-sm">
                    <span>👥 Parent Controls</span>
                    <span className="text-green-600 font-semibold">Active</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/80 rounded-lg p-2 text-sm">
                    <span>🔍 Screen Reader</span>
                    <span className="text-green-600 font-semibold">Ready</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/80 rounded-lg p-2 text-sm">
                    <span>🎨 High Contrast</span>
                    <span className="text-blue-600 font-semibold">Available</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="border-green-500 text-green-700 hover:bg-green-50"
                >
                  ⚙️ Safety Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Age-Appropriate Personalization */}
          <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎆</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Personalized for You!</h3>
                  <p className="text-sm text-gray-600">Activities adapted to your learning style</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 text-center border border-orange-200">
                  <div className="text-2xl mb-2">👶</div>
                  <div className="text-sm font-medium text-gray-700">Age 3-5</div>
                  <div className="text-xs text-gray-500">Simple & Visual</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-orange-200">
                  <div className="text-2xl mb-2">🧒</div>
                  <div className="text-sm font-medium text-gray-700">Age 6-8</div>
                  <div className="text-xs text-gray-500">Interactive & Fun</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-orange-200">
                  <div className="text-2xl mb-2">🧑</div>
                  <div className="text-sm font-medium text-gray-700">Age 9+</div>
                  <div className="text-xs text-gray-500">Creative & Deep</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-coaching" className="space-y-4 sm:space-y-6">
          {/* Enhanced AI Coaching with Leela Character */}
          <Card className="bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-200 border-purple-300 shadow-lg overflow-hidden">
            <CardContent className="p-6 sm:p-8 relative">
              {/* Leela's presence throughout */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300">
                    <span className="text-3xl animate-bounce">🧚‍♀️</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Ask Leela Anything!</h2>
                  <p className="text-gray-600">Your magical learning companion is here to help ✨</p>
                </div>
              </div>
              
              {/* Interactive Chat Area with Leela's coaching */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-lg mb-6 min-h-[200px]">
                <div className="space-y-4">
                  {/* Leela's Welcome Message */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">🧚‍♀️</span>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 flex-1 border border-purple-100 shadow-sm">
                      <p className="text-sm text-gray-700">
                        "Hi there! I'm Leela, and I love helping kids learn and grow! 🌟 Ask me about emotions, stories, or anything that makes you curious!"
                      </p>
                    </div>
                  </div>
                  
                  {/* Micro-coaching bubbles */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">🧚‍♀️</span>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 flex-1 border border-blue-100 shadow-sm">
                      <p className="text-sm text-gray-700">
                        "🌈 Did you know that when you're feeling sad, it's like rain for your heart? And just like rain helps flowers grow, feeling sad sometimes helps us understand ourselves better!"
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">🧚‍♀️</span>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 flex-1 border border-green-100 shadow-sm">
                      <p className="text-sm text-gray-700">
                        "🎆 Every time you help someone, magic happens! Your kindness creates invisible sparkles that make the whole world a bit brighter. What kindness magic will you create today?"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Help Topics with Animations */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-center">What can Leela help you with today?</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button 
                    className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white rounded-2xl p-6 h-auto flex flex-col items-center gap-3 shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95"
                    onClick={() => {
                      setCelebrationEmoji('😊');
                      setShowFloatingEmoji(true);
                      setShowConfetti(true);
                      toast({ 
                        title: "Leela is here! 😊", 
                        description: "Let's explore feelings together! Remember, all emotions are like different colors - they make life beautiful!" 
                      });
                      setTimeout(() => {
                        setShowFloatingEmoji(false);
                        setShowConfetti(false);
                      }, 3000);
                    }}
                  >
                    <span className="text-3xl animate-bounce">😊</span>
                    <span className="text-sm font-semibold">Understanding Feelings</span>
                  </Button>
                  
                  <Button 
                    className="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white rounded-2xl p-6 h-auto flex flex-col items-center gap-3 shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95"
                    onClick={() => {
                      setCelebrationEmoji('📚');
                      setShowFloatingEmoji(true);
                      toast({ 
                        title: "Story Time with Leela! 📚", 
                        description: "I know amazing stories about brave heroes and kind hearts! Which character would you like to learn about?" 
                      });
                      setTimeout(() => setShowFloatingEmoji(false), 2000);
                    }}
                  >
                    <span className="text-3xl animate-bounce delay-200">📚</span>
                    <span className="text-sm font-semibold">Story Questions</span>
                  </Button>
                  
                  <Button 
                    className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white rounded-2xl p-6 h-auto flex flex-col items-center gap-3 shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95"
                    onClick={() => {
                      setCelebrationEmoji('🌱');
                      setShowFloatingEmoji(true);
                      toast({ 
                        title: "Learning with Leela! 🌱", 
                        description: "Every day you learn something new, you grow stronger and wiser! What would you like to discover today?" 
                      });
                      setTimeout(() => setShowFloatingEmoji(false), 2000);
                    }}
                  >
                    <span className="text-3xl animate-bounce delay-500">🌱</span>
                    <span className="text-sm font-semibold">Learning Help</span>
                  </Button>
                  
                  <Button 
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white rounded-2xl p-6 h-auto flex flex-col items-center gap-3 shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95"
                    onClick={() => {
                      setCelebrationEmoji('😄');
                      setShowFloatingEmoji(true);
                      setShowConfetti(true);
                      toast({ 
                        title: "Fun Time with Leela! 😄", 
                        description: "Laughter is the best magic! It makes everything brighter and more wonderful. Let's create some joy together!" 
                      });
                      setTimeout(() => {
                        setShowFloatingEmoji(false);
                        setShowConfetti(false);
                      }, 3000);
                    }}
                  >
                    <span className="text-3xl animate-bounce delay-700">😄</span>
                    <span className="text-sm font-semibold">Just for Fun</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Enhanced Leela's Tips & Wisdom with Illustrated Elements */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-300 rounded-full blur-lg opacity-50 animate-pulse"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-xl">
                    <span className="text-2xl">💡</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Leela's Daily Wisdom</h3>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-yellow-200 shadow-lg relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-2 right-2 animate-bounce">
                  <div className="text-2xl opacity-20">✨</div>
                </div>
                <div className="absolute bottom-2 left-2 animate-bounce delay-500">
                  <div className="text-lg opacity-15">🌈</div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3 animate-pulse">🌟</div>
                  <p className="text-gray-700 italic text-sm sm:text-base leading-relaxed">
                    "Did you know? When we're kind to others, our hearts grow bigger and stronger! Just like a muscle that gets stronger when we exercise it. Try one kind act today and feel your heart sparkle! ✨"
                  </p>
                  <p className="text-right text-sm text-gray-500 mt-4 font-medium">- Leela 🧚‍♀️</p>
                </div>
                
                {/* Interactive wisdom button */}
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    className="bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300 text-yellow-700 hover:from-yellow-200 hover:to-orange-200 rounded-xl transform hover:scale-105 transition-all duration-200"
                    onClick={() => {
                      setCelebrationEmoji('✨');
                      setShowFloatingEmoji(true);
                      toast({ 
                        title: "More Wisdom Coming! ✨", 
                        description: "Leela has so many magical insights to share with you!" 
                      });
                      setTimeout(() => setShowFloatingEmoji(false), 2000);
                    }}
                  >
                    💭 Get More Wisdom
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4 sm:space-y-6">
          {/* Enhanced Rewards & Celebrations */}
          <Card className="bg-gradient-to-br from-yellow-100 via-orange-100 to-red-200 border-yellow-300 shadow-lg overflow-hidden">
            <CardContent className="p-6 sm:p-8 text-center relative">
              {/* Celebration animations */}
              <div className="absolute top-2 right-2 animate-bounce">
                <div className="text-2xl opacity-40">🎉</div>
              </div>
              <div className="absolute top-2 left-2 animate-bounce delay-300">
                <div className="text-lg opacity-30">⭐</div>
              </div>
              <div className="absolute bottom-2 left-2 animate-bounce delay-500">
                <div className="text-lg opacity-35">🎆</div>
              </div>
              <div className="absolute bottom-2 right-2 animate-bounce delay-700">
                <div className="text-xl opacity-40">🏆</div>
              </div>
              
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-40 animate-pulse"></div>
                <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-600 mx-auto relative transform hover:scale-110 transition-all duration-300" />
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold mb-3 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                🎆 My Amazing Stars!
              </h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Look at all the wonderful things you've achieved! You're a star! 🌟
              </p>
              
              {/* Enhanced Achievement Showcase */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-yellow-200 shadow-lg transform hover:scale-105 transition-all duration-200">
                  <div className="text-3xl mb-2 animate-bounce">🌟</div>
                  <div className="text-sm sm:text-base font-bold text-yellow-700">Kindness Stars</div>
                  <div className="text-xl sm:text-2xl font-bold text-yellow-800 mt-1">{kindnessPoints}</div>
                  <div className="text-xs text-gray-600">acts of kindness</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-orange-200 shadow-lg transform hover:scale-105 transition-all duration-200">
                  <div className="text-3xl mb-2 animate-bounce delay-300">🏅</div>
                  <div className="text-sm sm:text-base font-bold text-orange-700">Learning Medals</div>
                  <div className="text-xl sm:text-2xl font-bold text-orange-800 mt-1">8</div>
                  <div className="text-xs text-gray-600">skills mastered</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-red-200 shadow-lg transform hover:scale-105 transition-all duration-200 sm:col-span-3 lg:col-span-1">
                  <div className="text-3xl mb-2 animate-bounce delay-500">🌈</div>
                  <div className="text-sm sm:text-base font-bold text-red-700">Magic Moments</div>
                  <div className="text-xl sm:text-2xl font-bold text-red-800 mt-1">{storybookEntries.length}</div>
                  <div className="text-xs text-gray-600">memories created</div>
                </div>
              </div>
              
              {/* Celebration Button */}
              <Button 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-xl transform hover:scale-105 transition-all duration-300 rounded-2xl text-lg py-4 px-8 font-bold"
                onClick={() => {
                  setShowConfetti(true);
                  setCelebrationEmoji('🎉');
                  setShowFloatingEmoji(true);
                  toast({ 
                    title: "You're Amazing! 🎉", 
                    description: `Look at all your ${kindnessPoints + storybookEntries.length + 8} achievements! You're a superstar!` 
                  });
                  setTimeout(() => {
                    setShowFloatingEmoji(false);
                    setShowConfetti(false);
                  }, 3000);
                }}
              >
                🎆 Celebrate My Success!
              </Button>
            </CardContent>
          </Card>
          
          {/* Next Goals & Motivation */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🎯</span>
                <h3 className="text-lg font-bold text-gray-900">What's Next?</h3>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white rounded-2xl p-4 border border-purple-200 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Help 5 more friends</div>
                    <div className="text-sm text-gray-600">2 out of 5 completed 😊</div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full flex items-center justify-center">
                    <span className="text-lg">🤝</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-4 border border-purple-200 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Learn 3 new stories</div>
                    <div className="text-sm text-gray-600">1 out of 3 completed 📚</div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full flex items-center justify-center">
                    <span className="text-lg">📚</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-4 border border-purple-200 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Create 2 artworks</div>
                    <div className="text-sm text-gray-600">Ready to start! 🎨</div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full flex items-center justify-center">
                    <span className="text-lg">🎨</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Mobile-only floating actions */}
      <KidsMobileActions onQuickAction={handleQuickAction} />
    </div>
  </div>
  );
}