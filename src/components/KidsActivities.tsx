'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Star,
  Smile,
  Book,
  Palette,
  Music,
  Trophy,
  Gift,
  CheckCircle,
  Calendar,
  Clock,
  Users,
  Target,
  Award,
  Sparkles,
  Play,
  Brush,
  Baby,
  Brain,
  Feather,
  Plus,
  Camera
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { InteractiveConfetti } from '@/components/InteractiveConfetti';
import { FloatingEmoji } from '@/components/FloatingEmoji';

// Simple state management hook
const useSimpleKidsState = () => {
  const [state, setState] = useState({
    totalKindnessPoints: 25,
    wisdomPoints: 15,
    creativityPoints: 20,
    storybookEntries: [] as any[],
    emotionProgress: {} as Record<string, number>,
    mythologyProgress: {} as Record<string, number>,
    currentTab: 'activities',
    celebrationEmoji: '🎉',
    showFloatingEmoji: false,
    showConfetti: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Computed values
  const totalMemories = state.storybookEntries.length;
  const kindnessLevel = Math.floor(state.totalKindnessPoints / 10);
  const weeklyStats = {
    kindnessActions: state.totalKindnessPoints,
    storiesCreated: totalMemories,
    emotionsLearned: Object.keys(state.emotionProgress).length
  };
  
  // Initialize from localStorage only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setState(prev => ({
        ...prev,
        totalKindnessPoints: parseInt(localStorage.getItem('totalKindnessPoints') || '25'),
        wisdomPoints: parseInt(localStorage.getItem('wisdomPoints') || '15'),
        creativityPoints: parseInt(localStorage.getItem('creativityPoints') || '20'),
        storybookEntries: JSON.parse(localStorage.getItem('storybookEntries') || '[]'),
        emotionProgress: JSON.parse(localStorage.getItem('emotionProgress') || '{}'),
        mythologyProgress: JSON.parse(localStorage.getItem('mythologyProgress') || '{}'),
      }));
    }
  }, []);
  
  const addKindnessMoment = async (description: string, category: string, points: number = 1) => {
    try {
      setIsLoading(true);
      const newTotal = state.totalKindnessPoints + points;
      setState(prev => ({ ...prev, totalKindnessPoints: newTotal }));
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('totalKindnessPoints', newTotal.toString());
      }
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const addStorybookEntry = async (title: string, description: string, type: string, participants: string[]) => {
    try {
      setIsLoading(true);
      const newEntry = {
        id: Date.now().toString(),
        title,
        description,
        type,
        participants,
        timestamp: new Date().toISOString()
      };
      
      const newEntries = [...state.storybookEntries, newEntry];
      setState(prev => ({ ...prev, storybookEntries: newEntries }));
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('storybookEntries', JSON.stringify(newEntries));
      }
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const triggerCelebration = (emoji: string, showConfetti: boolean, duration: number) => {
    setState(prev => ({ 
      ...prev, 
      celebrationEmoji: emoji, 
      showFloatingEmoji: true,
      showConfetti 
    }));
    setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        showFloatingEmoji: false,
        showConfetti: false 
      }));
    }, duration);
  };
  
  const setActiveTab = (tab: string) => {
    setState(prev => ({ ...prev, currentTab: tab }));
  };
  
  return {
    ...state,
    totalMemories,
    kindnessLevel,
    weeklyStats,
    activeTab: state.currentTab,
    isLoading,
    setState,
    addKindnessMoment,
    addStorybookEntry,
    triggerCelebration,
    setActiveTab
  };
};

export function KidsActivities() {
  // Use simplified state management
  const {
    isLoading,
    totalKindnessPoints,
    totalMemories,
    kindnessLevel,
    weeklyStats,
    celebrationEmoji,
    showFloatingEmoji,
    showConfetti,
    activeTab,
    storybookEntries,
    triggerCelebration,
    addKindnessMoment,
    addStorybookEntry,
    setActiveTab
  } = useSimpleKidsState();
  
  const { toast } = useToast();
  
  // Local state for UI elements that don't need persistence
  const [selectedEmotion, setSelectedEmotion] = useState<any>(null);
  const [showSecondaryActivities, setShowSecondaryActivities] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  
  // Mock selected child for demo purposes
  const selectedChild = { id: 'demo-child', name: 'Demo Child' };
  
  // Combined loading state
  const isButtonLoading = isLoading || localLoading;
  const setIsLoading = setLocalLoading;
  
  // Quick action handler for mobile interface
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'kindness':
        triggerCelebration('❤️', true, 3000);
        addKindnessMoment('Quick kindness action', 'mobile', 1);
        break;
      case 'story':
        triggerCelebration('📚', false, 2000);
        addStorybookEntry('Quick story', 'Mobile story creation', 'quick', ['child']);
        break;
      default:
        triggerCelebration('🎉', false, 2000);
    }
  };
  
  // Simplified static data with proper object structures
  const emotionScenarios = [
    {
      id: '1',
      title: 'The Lost Toy',
      description: 'A little bear lost his favorite toy',
      character: { name: 'Bear', emoji: '🧸' },
      emotions: [
        { name: 'Sad', emoji: '😢' },
        { name: 'Upset', emoji: '😞' },
        { name: 'Disappointed', emoji: '😔' },
        { name: 'Worried', emoji: '😟' }
      ],
      difficulty: 'easy',
      ageRange: '3-6 years',
      duration: '10 minutes'
    }
  ];
  
  const mythologicalQuestions = [
    {
      id: '1',
      character: { name: 'Krishna', emoji: '🪈', visualRepresentation: '🪈' },
      story: "Krishna's Flute",
      title: "Krishna's Musical Wisdom",
      description: 'Learn about Krishna\'s musical wisdom',
      question: 'Why did Krishna love to play the flute?',
      answer: 'Because music brings joy and happiness to everyone',
      difficulty: 'easy'
    }
  ];
  
  const themedDays = [
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
  
  const currentDay = 'krishna'; // This could be randomized or based on the day

  // Simplified activity handlers
  const handleEmotionSelect = (emotion: string, emoji: string) => {
    setSelectedEmotion(emotion);
    triggerCelebration(emoji, false, 3000);
    toast({
      title: "Emotion Selected! 🎭",
      description: `You chose ${emoji} ${emotion} - Great emotional vocabulary building!`,
      duration: 3000,
    });
  };

  const handleKindnessMoment = async (description: string, category: string, points?: number) => {
    const kindnessPoints = points || Math.floor(Math.random() * 10) + 1;
    const success = await addKindnessMoment(description, category, kindnessPoints);
    
    if (success) {
      toast({
        title: "Kindness Recorded! 🌟",
        description: `Great job! You earned ${kindnessPoints} kindness points.`,
        duration: 3000,
      });
    }
  };

  const handleMythologicalAnswer = (questionId: string, answer: string) => {
    const question = mythologicalQuestions.find(q => q.id === questionId);
    if (question) {
      triggerCelebration('📚', false, 4000);
      toast({
        title: "Great Answer! 📚",
        description: `You know about ${question.character}! ${question.answer}`,
        duration: 4000,
      });
    }
  };

  const handlePrankComplete = async (prankId: string) => {
    const success = await addStorybookEntry(
      'Krishna Prank Adventure',
      'Had fun with a playful Krishna-style prank!',
      'activity',
      ['Child', 'Parent']
    );
    
    if (success) {
      toast({
        title: "Prank Complete! 😄",
        description: "What a fun Krishna-style adventure!",
        duration: 3000,
      });
    }
  };

  const handleTaskComplete = async (taskId: string) => {
    const success = await addStorybookEntry(
      'Hanuman Helper Task',
      'Completed a helpful task like Hanuman!',
      'activity',
      ['Child', 'Parent']
    );
    
    if (success) {
      toast({
        title: "Task Complete! 🎉",
        description: "Great job being helpful like Hanuman!",
        duration: 3000,
      });
    }
  };

  const handleCreativeComplete = async (creativeId: string) => {
    const success = await addStorybookEntry(
      'Saraswati Creative Time',
      'Created something beautiful inspired by Saraswati!',
      'activity',
      ['Child', 'Parent']
    );
    
    if (success) {
      toast({
        title: "Creation Complete! 🎨",
        description: "Beautiful Saraswati-inspired creativity!",
        duration: 3000,
      });
    }
  };

  // Helper functions
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const startCreativeActivity = async () => {
    try {
      setIsLoading(true);
      
      // Create comprehensive creative activity data
      const creativeActivities = [
        {
          id: `creative_${Date.now()}`,
          type: 'drawing',
          title: 'Magical Art Creation 🎨',
          description: 'Create a beautiful drawing inspired by your imagination!',
          materials: ['Paper', 'Crayons', 'Colored pencils', 'Markers'],
          instructions: ['Think of something that makes you happy', 'Draw your idea on paper', 'Use lots of colors!', 'Show your family when done'],
          points: 15
        },
        {
          id: `creative_${Date.now() + 1}`,
          type: 'music',
          title: 'Family Concert 🎵',
          description: 'Create music and perform for your family!',
          materials: ['Voice', 'Toy instruments', 'Kitchen utensils as drums'],
          instructions: ['Choose a favorite song', 'Practice singing or humming', 'Add rhythm with hands or utensils', 'Perform for family'],
          points: 12
        },
        {
          id: `creative_${Date.now() + 2}`,
          type: 'storytelling',
          title: 'Story Creator 📖',
          description: 'Tell an amazing story about magical adventures!',
          materials: ['Your imagination', 'Voice', 'Props (optional)'],
          instructions: ['Think of a hero character', 'Create a magical problem to solve', 'Tell the story with excitement', 'Act out different characters'],
          points: 18
        },
        {
          id: `creative_${Date.now() + 3}`,
          type: 'crafts',
          title: 'Craft Master 🔨',
          description: 'Build something amazing with everyday materials!',
          materials: ['Cardboard', 'Tape', 'String', 'Recyclable items'],
          instructions: ['Imagine what to build', 'Gather materials safely', 'Create your masterpiece', 'Explain how it works'],
          points: 20
        }
      ];
      
      // Select random creative activity
      const selectedActivity = creativeActivities[Math.floor(Math.random() * creativeActivities.length)];
      
      // Show activity start celebration
      triggerCelebration('🎨', true, 6000);
      toast({
        title: `${selectedActivity.title} Started! 🎨`,
        description: selectedActivity.description,
        duration: 6000,
      });
      
      // Show materials and instructions
      setTimeout(() => {
        toast({
          title: "What You'll Need: 📝",
          description: `Materials: ${selectedActivity.materials.join(', ')}`,
          duration: 5000,
        });
      }, 2000);
      
      setTimeout(() => {
        toast({
          title: "Let's Get Started! 🚀",
          description: selectedActivity.instructions[0],
          duration: 4000,
        });
      }, 4000);
      
      // Save creative activity to localStorage
      const creativeProgress = JSON.parse(localStorage.getItem('creativeProgress') || '[]');
      const activityRecord = {
        ...selectedActivity,
        startedAt: new Date(),
        status: 'in_progress',
        childId: 'demo-child'
      };
      creativeProgress.push(activityRecord);
      localStorage.setItem('creativeProgress', JSON.stringify(creativeProgress));
      
      // Create storybook entry for the creative activity
      const entry = await addStorybookEntry(
        selectedActivity.title,
        `Started ${selectedActivity.description} - This will be an amazing creative adventure!`,
        'activity',
        ['Child', 'Parent']
      );
      
      if (entry) {
        // Award initial points for starting
        const creativityPoints = parseInt(localStorage.getItem('creativityPoints') || '0');
        const newPoints = creativityPoints + 5; // Starting bonus
        localStorage.setItem('creativityPoints', newPoints.toString());
        
        // Set completion reminder
        setTimeout(() => {
          triggerCelebration('🏆', true, 8000);
          toast({
            title: "Creative Masterpiece! 🏆",
            description: `Amazing work! You've earned ${selectedActivity.points} creativity points! Don't forget to save your creation!`,
            duration: 8000,
          });
          
          // Award completion points
          const finalPoints = parseInt(localStorage.getItem('creativityPoints') || '0') + selectedActivity.points;
          localStorage.setItem('creativityPoints', finalPoints.toString());
          
          // Update activity status
          const updatedProgress = JSON.parse(localStorage.getItem('creativeProgress') || '[]');
          const activityIndex = updatedProgress.findIndex((a: any) => a.id === selectedActivity.id);
          if (activityIndex !== -1) {
            updatedProgress[activityIndex].status = 'completed';
            updatedProgress[activityIndex].completedAt = new Date();
            updatedProgress[activityIndex].pointsEarned = selectedActivity.points;
            localStorage.setItem('creativeProgress', JSON.stringify(updatedProgress));
          }
          
          // Check for creativity milestones
          if (finalPoints >= 100) {
            setTimeout(() => {
              triggerCelebration('👑', true, 10000);
              toast({
                title: "Creativity Royalty! 👑",
                description: "You've earned 100+ creativity points! You're officially a Creative Genius!",
                duration: 8000,
              });
            }, 2000);
          }
          
        }, 45000); // 45 seconds for demo
      }
      
    } catch (error) {
      console.error('Failed to start creative activity:', error);
      toast({
        title: "Oops! 😅",
        description: "Something went wrong with the creative activity. Let's try again!",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startDevelopmentTracking = async () => {
    try {
      setIsLoading(true);
      
      // Comprehensive progress calculation
      const calculateTotalProgress = () => {
        const kindnessPoints = parseInt(localStorage.getItem('kindnessPoints') || '0');
        const creativityPoints = parseInt(localStorage.getItem('creativityPoints') || '0');
        const learningPoints = parseInt(localStorage.getItem('learningPoints') || '0');
        const coachingPoints = parseInt(localStorage.getItem('coachingPoints') || '0');
        const mythologyPoints = parseInt(localStorage.getItem('mythologyPoints') || '0');
        const memoryPoints = parseInt(localStorage.getItem('memoryPoints') || '0');
        const mobileActions = parseInt(localStorage.getItem('totalMobileActions') || '0');
        
        const emotionProgress = JSON.parse(localStorage.getItem('emotionProgress') || '{}');
        const kindnessProgress = JSON.parse(localStorage.getItem('kindnessProgress') || '{}');
        const mythologyProgress = JSON.parse(localStorage.getItem('mythologyProgress') || '{}');
        const creativeProgress = JSON.parse(localStorage.getItem('creativeProgress') || '[]');
        
        return {
          totalPoints: kindnessPoints + creativityPoints + learningPoints + coachingPoints + mythologyPoints + memoryPoints,
          skillBreakdown: {
            kindness: kindnessPoints,
            creativity: creativityPoints,
            learning: learningPoints,
            coaching: coachingPoints,
            mythology: mythologyPoints,
            memory: memoryPoints
          },
          activityCounts: {
            emotions: Object.keys(emotionProgress).length,
            kindnessActs: Object.values(kindnessProgress).reduce((sum: number, count: any) => sum + count, 0),
            mythologyLearned: Object.keys(mythologyProgress).length,
            creativeMade: creativeProgress.length,
            mobileActions: mobileActions
          }
        };
      };
      
      const progress = calculateTotalProgress();
      
      // Calculate achievement level
      const getAchievementLevel = (totalPoints: number) => {
        if (totalPoints >= 500) return { level: 'Legendary Master', emoji: '👑', color: 'from-yellow-400 to-orange-400' };
        if (totalPoints >= 300) return { level: 'Super Champion', emoji: '🏆', color: 'from-purple-400 to-pink-400' };
        if (totalPoints >= 150) return { level: 'Rising Star', emoji: '🌟', color: 'from-blue-400 to-cyan-400' };
        if (totalPoints >= 75) return { level: 'Bright Learner', emoji: '🌱', color: 'from-green-400 to-emerald-400' };
        return { level: 'Getting Started', emoji: '🚀', color: 'from-gray-400 to-gray-600' };
      };
      
      const achievement = getAchievementLevel(progress.totalPoints);
      
      // Show comprehensive progress
      triggerCelebration('🧠', false, 4000);
      toast({
        title: "Development Tracking! 🧠",
        description: `Let's explore your amazing learning journey and celebrate your growth!`,
        duration: 6000,
      });
      
      // Show total progress overview
      setTimeout(() => {
        triggerCelebration(achievement.emoji, true, 8000);
        toast({
          title: `${achievement.level} ${achievement.emoji}`,
          description: `Total Progress: ${progress.totalPoints} points across ${Object.values(progress.activityCounts).reduce((sum, count) => sum + count, 0)} activities!`,
          duration: 8000,
        });
      }, 2000);
      
      // Show skill breakdown
      setTimeout(() => {
        const topSkill = Object.entries(progress.skillBreakdown).reduce((max, [skill, points]) => 
          points > max.points ? { skill, points } : max, { skill: 'kindness', points: 0 }
        );
        
        toast({
          title: "Your Strongest Skill! 🎨",
          description: `${topSkill.skill.charAt(0).toUpperCase() + topSkill.skill.slice(1)} is your superpower with ${topSkill.points} points!`,
          duration: 6000,
        });
      }, 4000);
      
      // Show detailed progress report
      setTimeout(() => {
        const progressReport = [
          `💖 Kindness: ${progress.skillBreakdown.kindness} points`,
          `🎨 Creativity: ${progress.skillBreakdown.creativity} points`,
          `📚 Learning: ${progress.skillBreakdown.learning} points`,
          `🧚‍♀️ Coaching: ${progress.skillBreakdown.coaching} points`,
          `🏰 Mythology: ${progress.skillBreakdown.mythology} points`,
          `📸 Memories: ${progress.skillBreakdown.memory} points`
        ];
        
        triggerCelebration('📈', true, 10000);
        toast({
          title: "Complete Progress Report! 📈",
          description: progressReport.join(' | '),
          duration: 8000,
        });
      }, 6000);
      
      // Calculate next goals outside setTimeout for later use
      const nextGoals: string[] = [];
      if (progress.skillBreakdown.kindness < 50) nextGoals.push('💖 Reach 50 kindness points');
      if (progress.skillBreakdown.creativity < 75) nextGoals.push('🎨 Create 75 creativity points');
      if (progress.skillBreakdown.learning < 100) nextGoals.push('📚 Earn 100 learning points');
      if (progress.activityCounts.mobileActions < 25) nextGoals.push('📱 Complete 25 mobile actions');
      
      // Calculate and show next goals
      setTimeout(() => {
        if (nextGoals.length > 0) {
          toast({
            title: "Next Adventure Goals! 🎯",
            description: `Keep growing: ${nextGoals.slice(0, 2).join(' & ')}`,
            duration: 7000,
          });
        } else {
          toast({
            title: "Master Achievement! 👑",
            description: "You've mastered all areas! You're truly amazing! Keep exploring new adventures!",
            duration: 6000,
          });
        }
      }, 8000);
      
      // Save progress tracking session
      const progressSessions = JSON.parse(localStorage.getItem('progressTrackingSessions') || '[]');
      const newProgressSession = {
        id: Date.now(),
        timestamp: new Date(),
        totalPoints: progress.totalPoints,
        achievementLevel: achievement.level,
        skillBreakdown: progress.skillBreakdown,
        activityCounts: progress.activityCounts,
        nextGoals: nextGoals.slice(0, 3) // Store up to 3 next goals
      };
      progressSessions.push(newProgressSession);
      localStorage.setItem('progressTrackingSessions', JSON.stringify(progressSessions));
      
      // Award progress tracking points
      const progressPoints = parseInt(localStorage.getItem('progressTrackingPoints') || '0') + 25;
      localStorage.setItem('progressTrackingPoints', progressPoints.toString());
      
      // Final celebration for checking progress
      setTimeout(() => {
        triggerCelebration('🎆', true, 12000);
        toast({
          title: "Progress Champion! 🎆",
          description: "You earned 25 progress points for tracking your development! Self-reflection is a superpower!",
          duration: 8000,
        });
      }, 10000);
      
    } catch (error) {
      console.error('Failed to track development:', error);
      toast({
        title: "Oops! 😅",
        description: "Something went wrong with progress tracking. Let's try again!",
        duration: 3000,
      });
    } finally {
      setTimeout(() => setIsLoading(false), 3000);
    }
  };

  const startAICoaching = () => {
    triggerCelebration('✨', false, 4000);
    toast({
      title: "AI Coach Ready! ✨",
      description: "Your personal parenting assistant is here to help!",
      duration: 4000,
    });
  };

  const viewFamilyMilestones = () => {
    triggerCelebration('🏆', false, 4000);
    toast({
      title: "Family Milestones! 🏆",
      description: "Celebrating all your family's amazing achievements!",
      duration: 4000,
    });
  };

  const saveKindnessMemory = async () => {
    const moment = await addKindnessMoment('Custom kindness memory', 'Custom');
    
    if (moment) {
      toast({
        title: "Memory Saved! 📸",
        description: "Your special kindness moment has been added to the family story!",
        duration: 3000,
      });
    }
  };

  const addFirstMemory = async () => {
    try {
      setIsLoading(true);
      
      // Create a magical first memory
      const firstMemory = {
        id: `memory_${Date.now()}`,
        title: "My First Magical Adventure! 🎆",
        description: "Today I started my amazing journey with Leela and discovered so many wonderful things! This is where my story begins.",
        date: new Date(),
        type: 'milestone',
        participants: ['Child', 'Leela'],
        media: [],
        emoji: '🌟',
        category: 'first_adventure'
      };
      
      // Add to storybook entries using the hook
      const entry = await addStorybookEntry(
        firstMemory.title,
        firstMemory.description,
        'milestone',
        firstMemory.participants
      );
      
      if (!entry) {
        throw new Error('Failed to add storybook entry');
      }
      
      // Celebrate!
      triggerCelebration('📚', true, 6000);
      toast({
        title: "First Memory Created! 📚",
        description: "Welcome to your magical storybook adventure! Every memory makes your story more special.",
        duration: 6000,
      });
      
      // Add achievement for first memory
      const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
      if (!achievements.some(a => a.id === 'first_memory')) {
        achievements.push({
          id: 'first_memory',
          name: 'Story Starter',
          description: 'Created your very first family memory!',
          icon: '📚',
          earnedAt: new Date(),
          rarity: 'special'
        });
        localStorage.setItem('achievements', JSON.stringify(achievements));
        
        setTimeout(() => {
          toast({
            title: "Achievement Unlocked! 🏆",
            description: "Story Starter - You've begun your magical journey!",
            duration: 4000,
          });
        }, 1000);
      }
      
    } catch (error) {
      console.error('Failed to create first memory:', error);
      toast({
        title: "Oops! 😅",
        description: "Let's try creating your memory again!",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading) {
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
                  <div className="text-2xl font-bold text-pink-600 mb-1">{totalKindnessPoints}</div>
                  <div className="text-sm text-pink-700 font-semibold">Kindness Stars ⭐</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center border border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">{totalMemories}</div>
                  <div className="text-xs text-gray-600">Memories 📚</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kindness Jar - Enhanced with Clear Separation */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-1 border-2 border-emerald-200 shadow-lg mb-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-none">
              <CardContent className="p-6 sm:p-8 relative overflow-hidden">
                {/* Celebration Effects */}
                {totalKindnessPoints >= 10 && (
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
                  <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-300 transform hover:scale-105 transition-all duration-300">
                    <div className="text-4xl sm:text-5xl font-bold text-emerald-600 animate-pulse mb-2">{totalKindnessPoints}</div>
                    <div className="text-lg text-emerald-700 font-semibold mb-3">Kindness Stars</div>
                    <div className="flex justify-center space-x-1 mb-2">
                      {[...Array(Math.min(Math.floor(totalKindnessPoints / 3), 5))].map((_, i) => (
                        <span key={i} className="text-2xl animate-bounce" style={{animationDelay: `${i * 0.2}s`}}>⭐</span>
                      ))}
                    </div>
                    {totalKindnessPoints >= 10 && (
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
                      style={{ width: `${Math.min((totalKindnessPoints / 15) * 100, 100)}%` }}
                    >
                      <div className="h-full bg-gradient-to-r from-white/30 to-transparent rounded-full animate-pulse"></div>
                    </div>
                    {totalKindnessPoints >= 15 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-bold text-sm animate-bounce">🎆 Full!</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Keep spreading love! 🌟</span>
                    <span className="font-semibold">{Math.min((totalKindnessPoints / 15) * 100, 100).toFixed(0)}% to Kindness Master</span>
                  </div>
                </div>
                
                {/* Single Clear CTA - Secondary Action */}
                <div className="text-center">
                  <Button 
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        
                        // Available kindness activities
                        const kindnessActivities = [
                          { action: 'Helped a friend with homework 📚', category: 'Learning Support', points: 8 },
                          { action: 'Shared my snack with someone 🍎', category: 'Sharing', points: 6 },
                          { action: 'Said something nice to make someone smile 😊', category: 'Kind Words', points: 7 },
                          { action: 'Helped clean up without being asked 🧹', category: 'Helping Out', points: 9 },
                          { action: 'Gave someone a hug when they were sad 🤗', category: 'Emotional Support', points: 10 },
                          { action: 'Let someone go first in line 🚶‍♂️', category: 'Courtesy', points: 5 },
                          { action: 'Helped carry something heavy 💪', category: 'Physical Help', points: 8 },
                          { action: 'Listened when someone needed to talk 👂', category: 'Being There', points: 9 }
                        ];
                        
                        // Select random kindness activity
                        const randomActivity = kindnessActivities[Math.floor(Math.random() * kindnessActivities.length)];
                        
                        // Add the kindness moment
                        await handleKindnessMoment(randomActivity.action, randomActivity.category, randomActivity.points);
                        
                        // Show celebration
                        triggerCelebration('🌟', true, 6000);
                        
                        // Show success message
                        toast({
                          title: "Kindness Recorded! 🌟",
                          description: `Amazing! ${randomActivity.action} earned you ${randomActivity.points} kindness points!`,
                          duration: 5000,
                        });
                        
                        // Save kindness progress
                        const kindnessProgress = JSON.parse(localStorage.getItem('kindnessProgress') || '{}');
                        kindnessProgress[randomActivity.category] = (kindnessProgress[randomActivity.category] || 0) + 1;
                        localStorage.setItem('kindnessProgress', JSON.stringify(kindnessProgress));
                        
                        // Check for kindness achievements
                        const totalKindnessActs = Object.values(kindnessProgress).reduce((sum: number, count: any) => sum + count, 0);
                        
                        if (totalKindnessActs === 5) {
                          setTimeout(() => {
                            triggerCelebration('🏆', true, 8000);
                            toast({
                              title: "Kindness Champion! 🏆",
                              description: "You've completed 5 kind acts! You're spreading so much love and joy!",
                              duration: 6000,
                            });
                          }, 2000);
                        }
                        
                        if (totalKindnessActs === 10) {
                          setTimeout(() => {
                            triggerCelebration('👑', true, 10000);
                            toast({
                              title: "Kindness Royalty! 👑",
                              description: "10 kind acts! You're officially a Kindness King/Queen! The world is brighter because of you!",
                              duration: 8000,
                            });
                          }, 3000);
                        }
                        
                      } catch (error) {
                        console.error('Failed to add kind act:', error);
                        toast({
                          title: "Oops! 😅",
                          description: "Something went wrong. Let's try being kind again!",
                          duration: 3000,
                        });
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg transform hover:scale-105 transition-all duration-300 rounded-xl text-base py-3 px-6 font-semibold min-h-[48px] w-full sm:w-auto touch-manipulation"
                    aria-label="Add your kind act for today"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Recording...
                      </div>
                    ) : (
                      '🌟 Add Kind Act'
                    )}
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
                    <div 
                      key={scenario.id} 
                      className="bg-white rounded-lg p-3 border border-blue-100 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-95"
                      onClick={async () => {
                        try {
                          // Start the emotion recognition game
                          setIsLoading(true);
                          
                          // Show the scenario
                          triggerCelebration('🎭', false, 3000);
                          toast({
                            title: `${scenario.title} 🎭`,
                            description: `Help ${scenario.character.name} understand their feelings! Can you choose the right emotion?`,
                            duration: 5000,
                          });
                          
                          // Simulate emotion selection (in real app, would show interactive modal)
                          setTimeout(() => {
                            const selectedEmotion = scenario.emotions[Math.floor(Math.random() * scenario.emotions.length)];
                            
                            // Show success
                            triggerCelebration(selectedEmotion.emoji, true, 4000);
                            toast({
                              title: `Great Choice! ${selectedEmotion.emoji}`,
                              description: `You helped ${scenario.character.name} feel ${selectedEmotion.name}! That was very thoughtful.`,
                              duration: 4000,
                            });
                            
                            // Add points and save progress
                            const progress = JSON.parse(localStorage.getItem('emotionProgress') || '{}');
                            progress[scenario.id] = {
                              completed: true,
                              selectedEmotion: selectedEmotion.name,
                              completedAt: new Date(),
                              points: 10
                            };
                            localStorage.setItem('emotionProgress', JSON.stringify(progress));
                            
                            // Update kindness points
                            const currentPoints = parseInt(localStorage.getItem('kindnessPoints') || '0');
                            localStorage.setItem('kindnessPoints', (currentPoints + 10).toString());
                            
                            setIsLoading(false);
                          }, 2000);
                          
                        } catch (error) {
                          console.error('Failed to start emotion game:', error);
                          toast({
                            title: "Oops! 😅",
                            description: "Let's try the emotion game again!",
                            duration: 3000,
                          });
                          setIsLoading(false);
                        }
                      }}
                    >
                      <h5 className="text-sm font-medium text-blue-900 mb-2">{scenario.title}</h5>
                      <p className="text-xs text-blue-700 mb-2">👶 Help {scenario.character.name} understand their feelings!</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {scenario.emotions.slice(0, 3).map((emotion, index) => (
                          <span key={index} className="text-xs bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-2 py-1 rounded-full hover:scale-105 transition-transform">
                            {emotion.emoji} {emotion.name}
                          </span>
                        ))}
                        <span className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                          🎯 Click to Play!
                        </span>
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
                    <div 
                      key={question.id} 
                      className="bg-white rounded-lg p-3 border border-yellow-100 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-95"
                      onClick={async () => {
                        try {
                          // Start the mythology quiz
                          setIsLoading(true);
                          
                          // Show the question
                          triggerCelebration('📚', false, 3000);
                          toast({
                            title: `Mythology Quest! 📚`,
                            description: `Let's learn about ${question.character.name}! ${question.question || 'Discover the story'}`,
                            duration: 5000,
                          });
                          
                          // Show interactive learning experience
                          setTimeout(() => {
                            triggerCelebration('🧠', false, 4000);
                            toast({
                              title: `Wisdom Unlocked! 🧠`,
                              description: `${question.answer}`,
                              duration: 6000,
                            });
                            
                            // Award points for learning
                            const mythologyPoints = parseInt(localStorage.getItem('mythologyPoints') || '0');
                            const newPoints = mythologyPoints + 10;
                            localStorage.setItem('mythologyPoints', newPoints.toString());
                            
                            // Save learning progress
                            const mythologyProgress = JSON.parse(localStorage.getItem('mythologyProgress') || '{}');
                            mythologyProgress[question.character.name] = (mythologyProgress[question.character.name] || 0) + 1;
                            localStorage.setItem('mythologyProgress', JSON.stringify(mythologyProgress));
                            
                            // Show achievement
                            setTimeout(() => {
                              triggerCelebration('🏆', true, 5000);
                              toast({
                                title: `Story Master! 🏆`,
                                description: `You earned 10 wisdom points learning about ${question.character.name}! Total: ${newPoints} points`,
                                duration: 4000,
                              });
                            }, 2000);
                            
                            // Check for milestone achievements
                            if (newPoints >= 50) {
                              setTimeout(() => {
                                triggerCelebration('👑', true, 8000);
                                toast({
                                  title: "Mythology Master! 👑",
                                  description: "You've earned 50+ wisdom points! You're becoming a real story expert!",
                                  duration: 6000,
                                });
                              }, 4000);
                            }
                            
                          }, 3000);
                          
                        } catch (error) {
                          console.error('Failed to start mythology quest:', error);
                          toast({
                            title: "Oops! 😅",
                            description: "Something went wrong with the story. Let's try again!",
                            duration: 3000,
                          });
                        } finally {
                          setTimeout(() => setIsLoading(false), 1000);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{question.character.visualRepresentation}</span>
                          <div>
                            <div className="font-medium text-sm text-gray-900">{question.character.name}</div>
                            <div className="text-xs text-gray-600">{question.title}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">
                            📚 Learn
                          </span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                            +10 pts
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 italic">{question.description}</p>
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
                      <Smile className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 mb-3">
                  <p className="text-xs sm:text-sm text-purple-800 font-medium">
                    🎭 Playful pranks and joyful moments!
                  </p>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md btn-enhanced text-sm py-3 min-h-[48px] active:scale-95 transition-all duration-200 touch-manipulation"
                  aria-label="Start today's adventure activity"
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      // Start the current themed day activity
                      const currentDayData = themedDays.find(d => d.id === currentDay);
                      if (currentDayData) {
                        // Create an activity completion record
                        const startTime = new Date();
                        const activityData = {
                          childId: selectedChild?.id || 'demo-child',
                          activityId: currentDayData.id,
                          startTime: startTime.toISOString(),
                          endTime: new Date(startTime.getTime() + 30 * 60000).toISOString(), // 30 minutes later
                          completed: false,
                          answers: {},
                          media: []
                        };
                        
                        // Show immediate feedback
                        triggerCelebration('🚀', true, 5000);
                        toast({
                          title: `${currentDayData.name} Started! 🚀`,
                          description: `Let's have an amazing ${currentDayData.name.toLowerCase()} adventure together!`,
                          duration: 5000,
                        });
                        
                        // Store in localStorage for demo purposes
                        const currentActivities = JSON.parse(localStorage.getItem('currentActivities') || '[]');
                        currentActivities.push({
                          ...activityData,
                          title: currentDayData.name,
                          status: 'in_progress',
                          startedAt: new Date()
                        });
                        localStorage.setItem('currentActivities', JSON.stringify(currentActivities));
                        
                        // Set timer for completion reminder
                        setTimeout(() => {
                          toast({
                            title: "Time to Complete! 🎉",
                            description: "Great job! Ready to finish your adventure?",
                            duration: 3000,
                          });
                        }, 30000); // 30 seconds for demo
                      }
                    } catch (error) {
                      console.error('Failed to start activity:', error);
                      toast({
                        title: "Oops! 😅",
                        description: "Something went wrong. Let's try again!",
                        duration: 3000,
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Starting...
                    </div>
                  ) : (
                    'Start Adventure'
                  )}
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
                                  🎭
                                </span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{entry.title}</h4>
                                <Badge className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200">
                                  📚 Story
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{entry.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{new Date(entry.date).toLocaleDateString()}</span>
                              <span>{entry.participants.join(', ')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="rounded-xl hover:shadow-md transition-all duration-200"
                            onClick={async () => {
                              try {
                                setIsLoading(true);
                                
                                // Simulate photo capture
                                triggerCelebration('📸', false, 3000);
                                toast({
                                  title: "Photo Added! 📸",
                                  description: "Your special moment has been captured and added to the family storybook!",
                                  duration: 4000,
                                });
                                
                                // Update the storybook entry with photo
                                const photos = JSON.parse(localStorage.getItem('storybookPhotos') || '[]');
                                const newPhoto = {
                                  id: `photo_${Date.now()}`,
                                  entryId: entry.id,
                                  type: 'photo',
                                  caption: `Beautiful moment from ${entry.title}`,
                                  timestamp: new Date(),
                                  addedBy: 'Child'
                                };
                                photos.push(newPhoto);
                                localStorage.setItem('storybookPhotos', JSON.stringify(photos));
                                
                                // Award points for adding photos
                                const memoryPoints = parseInt(localStorage.getItem('memoryPoints') || '0');
                                const newPoints = memoryPoints + 8;
                                localStorage.setItem('memoryPoints', newPoints.toString());
                                
                                setTimeout(() => {
                                  triggerCelebration('🌟', true, 4000);
                                  toast({
                                    title: "Memory Master! 🌟",
                                    description: `You earned 8 memory points! Your storybook is getting more beautiful! Total: ${newPoints} points`,
                                    duration: 4000,
                                  });
                                }, 1500);
                                
                              } catch (error) {
                                console.error('Failed to add photo:', error);
                                toast({
                                  title: "Oops! 😅",
                                  description: "Couldn't add the photo. Let's try again!",
                                  duration: 3000,
                                });
                              } finally {
                                setIsLoading(false);
                              }
                            }}
                          >
                            <Camera className="w-4 h-4 mr-1" />
                            Add Photo
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="rounded-xl hover:shadow-md transition-all duration-200"
                            onClick={async () => {
                              try {
                                setIsLoading(true);
                                
                                // Simulate video recording
                                triggerCelebration('🎥', false, 4000);
                                toast({
                                  title: "Video Recording! 🎥",
                                  description: "Ready to record a special video message for your family storybook!",
                                  duration: 5000,
                                });
                                
                                // Simulate recording process
                                setTimeout(() => {
                                  triggerCelebration('🎉', true, 5000);
                                  toast({
                                    title: "Video Saved! 🎉",
                                    description: "Your video has been added to the family memories! Everyone will love watching it!",
                                    duration: 5000,
                                  });
                                  
                                  // Save video record
                                  const videos = JSON.parse(localStorage.getItem('storybookVideos') || '[]');
                                  const newVideo = {
                                    id: `video_${Date.now()}`,
                                    entryId: entry.id,
                                    type: 'video',
                                    title: `Video from ${entry.title}`,
                                    duration: '0:30',
                                    timestamp: new Date(),
                                    addedBy: 'Child'
                                  };
                                  videos.push(newVideo);
                                  localStorage.setItem('storybookVideos', JSON.stringify(videos));
                                  
                                  // Award points for video
                                  const memoryPoints = parseInt(localStorage.getItem('memoryPoints') || '0');
                                  const newPoints = memoryPoints + 12;
                                  localStorage.setItem('memoryPoints', newPoints.toString());
                                  
                                  setTimeout(() => {
                                    toast({
                                      title: "Video Star! 🎆",
                                      description: `Amazing! You earned 12 memory points for your video! Total: ${newPoints} points`,
                                      duration: 4000,
                                    });
                                  }, 1000);
                                  
                                }, 3000);
                                
                              } catch (error) {
                                console.error('Failed to add video:', error);
                                toast({
                                  title: "Oops! 😅",
                                  description: "Couldn't record the video. Let's try again!",
                                  duration: 3000,
                                });
                              } finally {
                                setTimeout(() => setIsLoading(false), 3500);
                              }
                            }}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Add Video
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="rounded-xl hover:shadow-md transition-all duration-200"
                            onClick={async () => {
                              try {
                                setIsLoading(true);
                                
                                // Create a special memory reflection
                                triggerCelebration('💖', false, 3000);
                                toast({
                                  title: "Remembering Together! 💖",
                                  description: "Let's take a moment to appreciate this beautiful memory and what it means to our family!",
                                  duration: 5000,
                                });
                                
                                // Show reflection prompts
                                setTimeout(() => {
                                  const reflectionPrompts = [
                                    "What made this moment special?",
                                    "How did it make you feel?",
                                    "What did you learn from this experience?",
                                    "Why is this important to remember?"
                                  ];
                                  
                                  const randomPrompt = reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)];
                                  
                                  toast({
                                    title: "Think About This: 🤔",
                                    description: randomPrompt,
                                    duration: 6000,
                                  });
                                  
                                  // Save reflection
                                  const reflections = JSON.parse(localStorage.getItem('storybookReflections') || '[]');
                                  const newReflection = {
                                    id: `reflection_${Date.now()}`,
                                    entryId: entry.id,
                                    prompt: randomPrompt,
                                    timestamp: new Date(),
                                    addedBy: 'Child',
                                    importance: 'high'
                                  };
                                  reflections.push(newReflection);
                                  localStorage.setItem('storybookReflections', JSON.stringify(reflections));
                                  
                                  // Award reflection points
                                  const memoryPoints = parseInt(localStorage.getItem('memoryPoints') || '0');
                                  const newPoints = memoryPoints + 10;
                                  localStorage.setItem('memoryPoints', newPoints.toString());
                                  
                                  setTimeout(() => {
                                    triggerCelebration('🎨', true, 6000);
                                    toast({
                                      title: "Thoughtful Remembering! 🎨",
                                      description: `Beautiful reflection! You earned 10 memory points for thinking deeply about this moment! Total: ${newPoints} points`,
                                      duration: 5000,
                                    });
                                  }, 2000);
                                  
                                }, 2000);
                                
                              } catch (error) {
                                console.error('Failed to add reflection:', error);
                                toast({
                                  title: "Oops! 😅",
                                  description: "Couldn't save the reflection. Let's try again!",
                                  duration: 3000,
                                });
                              } finally {
                                setTimeout(() => setIsLoading(false), 2500);
                              }
                            }}
                          >
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
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        triggerCelebration('😊', true, 3000);
                        
                        // Start an interactive feelings session
                        const feelingsPrompts = [
                          "How are you feeling right now? 😊",
                          "What makes you feel happy? 🌈",
                          "When do you feel most loved? 💖",
                          "What would you do if a friend was sad? 🤗"
                        ];
                        
                        const randomPrompt = feelingsPrompts[Math.floor(Math.random() * feelingsPrompts.length)];
                        
                        toast({ 
                          title: "Leela is here! 😊", 
                          description: "Let's explore feelings together! Remember, all emotions are like different colors - they make life beautiful!" 
                        });
                        
                        // Simulate AI coaching session
                        setTimeout(() => {
                          toast({
                            title: "Let's Talk About Feelings! 🌈",
                            description: randomPrompt,
                            duration: 6000,
                          });
                          
                          // Save the coaching session
                          const sessions = JSON.parse(localStorage.getItem('leelaCoachingSessions') || '[]');
                          sessions.push({
                            id: Date.now(),
                            type: 'feelings',
                            prompt: randomPrompt,
                            timestamp: new Date(),
                            completed: true
                          });
                          localStorage.setItem('leelaCoachingSessions', JSON.stringify(sessions));
                          
                          // Award coaching points
                          const coachingPoints = parseInt(localStorage.getItem('coachingPoints') || '0');
                          localStorage.setItem('coachingPoints', (coachingPoints + 15).toString());
                          
                        }, 2000);
                        
                        setTimeout(() => {
                          // No need to manually reset, triggerCelebration handles timing
                          setIsLoading(false);
                        }, 3000);
                        
                      } catch (error) {
                        console.error('Failed to start feelings session:', error);
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                  >
                    <span className="text-3xl animate-bounce">😊</span>
                    <span className="text-sm font-semibold">Understanding Feelings</span>
                  </Button>
                  
                  <Button 
                    className="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white rounded-2xl p-6 h-auto flex flex-col items-center gap-3 shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95"
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        
                        // Enhanced story coaching with comprehensive interaction
                        const storyQuestions = [
                          {
                            category: 'Character Building',
                            question: "If you were a superhero, what would your special power be and how would you help others?",
                            follow_up: "That's amazing! Tell me about a time when you helped someone in real life!",
                            wisdom: "Every act of kindness is a real superpower! 🦸‍♂️"
                          },
                          {
                            category: 'Mythology Wisdom',
                            question: "Which mythological character would you want to be friends with and why?",
                            follow_up: "What qualities do they have that you admire?",
                            wisdom: "The heroes we admire show us the qualities we want to grow in ourselves! 🌟"
                          },
                          {
                            category: 'Creative Thinking',
                            question: "If you could create a magical world, what would make it special?",
                            follow_up: "How would the creatures and people in your world treat each other?",
                            wisdom: "Your imagination is the key to endless possibilities! 🗝️"
                          },
                          {
                            category: 'Problem Solving',
                            question: "If two friends were fighting, how would you help them become friends again?",
                            follow_up: "What would you say to help them understand each other?",
                            wisdom: "Peacemakers are among the most important people in the world! 🕊️"
                          }
                        ];
                        
                        const selectedQuestion = storyQuestions[Math.floor(Math.random() * storyQuestions.length)];
                        
                        triggerCelebration('📚', false, 4000);
                        
                        // Initial question
                        toast({ 
                          title: `Story Time with Leela! 📚`, 
                          description: `${selectedQuestion.category}: ${selectedQuestion.question}`,
                          duration: 8000,
                        });
                        
                        // Simulate thinking time and follow-up
                        setTimeout(() => {
                          triggerCelebration('🤔', false, 4000);
                          toast({
                            title: "Thinking Time! 🤔",
                            description: selectedQuestion.follow_up,
                            duration: 6000,
                          });
                        }, 3000);
                        
                        // Share wisdom and award points
                        setTimeout(() => {
                          triggerCelebration('🎆', true, 6000);
                          toast({
                            title: "Leela's Wisdom! 🎆",
                            description: selectedQuestion.wisdom,
                            duration: 6000,
                          });
                          
                          // Save coaching session with enhanced data
                          const sessions = JSON.parse(localStorage.getItem('leelaCoachingSessions') || '[]');
                          const newSession = {
                            id: Date.now(),
                            type: 'story_questions',
                            category: selectedQuestion.category,
                            question: selectedQuestion.question,
                            follow_up: selectedQuestion.follow_up,
                            wisdom: selectedQuestion.wisdom,
                            timestamp: new Date(),
                            completed: true,
                            pointsEarned: 20
                          };
                          sessions.push(newSession);
                          localStorage.setItem('leelaCoachingSessions', JSON.stringify(sessions));
                          
                          // Award story coaching points
                          const coachingPoints = parseInt(localStorage.getItem('coachingPoints') || '0');
                          const newPoints = coachingPoints + 20;
                          localStorage.setItem('coachingPoints', newPoints.toString());
                          
                          // Show achievement
                          setTimeout(() => {
                            toast({
                              title: "Story Master Points! 🏆",
                              description: `Amazing storytelling discussion! You earned 20 coaching points! Total: ${newPoints} points`,
                              duration: 5000,
                            });
                            
                            // Check for story master achievement
                            if (newPoints >= 100) {
                              setTimeout(() => {
                                triggerCelebration('👑', true, 10000);
                                toast({
                                  title: "Story Master Champion! 👑",
                                  description: "100+ coaching points! You're becoming a true storytelling champion!",
                                  duration: 8000,
                                });
                              }, 2000);
                            }
                          }, 1500);
                        }, 6000);
                        
                      } catch (error) {
                        console.error('Failed to start story session:', error);
                        toast({
                          title: "Oops! 😅",
                          description: "Something went wrong with story time. Let's try again!",
                          duration: 3000,
                        });
                      } finally {
                        setTimeout(() => {
                          // triggerCelebration handles timing automatically
                          setIsLoading(false);
                        }, 2500);
                      }
                    }}
                    disabled={isLoading}
                  >
                    <span className="text-3xl animate-bounce delay-200">📚</span>
                    <span className="text-sm font-semibold">Story Questions</span>
                  </Button>
                  
                  <Button 
                    className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white rounded-2xl p-6 h-auto flex flex-col items-center gap-3 shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95"
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        
                        // Enhanced learning assistance with personalized help
                        const learningHelps = [
                          {
                            subject: 'Reading Skills',
                            tip: "When you read, imagine you're watching a movie in your mind! Picture the characters and places. It makes reading so much more fun! 🎬",
                            activity: "Try reading a story and drawing your favorite scene!",
                            skill_built: "visualization and comprehension",
                            points: 15
                          },
                          {
                            subject: 'Math Magic',
                            tip: "Numbers are like building blocks! When you add, you're building something bigger. When you subtract, you're taking pieces away. 🧩",
                            activity: "Count things around you - toys, books, or snacks!",
                            skill_built: "number sense and problem solving",
                            points: 18
                          },
                          {
                            subject: 'Science Wonder',
                            tip: "Science is all about asking 'Why?' and 'How?' You're already a scientist when you're curious! 🔬",
                            activity: "Look outside and ask one question about something you see!",
                            skill_built: "curiosity and observation",
                            points: 16
                          },
                          {
                            subject: 'Memory Power',
                            tip: "Your brain is like a super computer! The more you practice remembering, the stronger it gets! 🧠",
                            activity: "Try remembering 3 things you learned today and share them!",
                            skill_built: "memory and recall",
                            points: 14
                          },
                          {
                            subject: 'Focus Training',
                            tip: "Focus is like a muscle - the more you exercise it, the stronger it gets! Start with small tasks and work your way up! 🎦",
                            activity: "Pick one activity and give it your full attention for 5 minutes!",
                            skill_built: "concentration and attention",
                            points: 17
                          }
                        ];
                        
                        const selectedHelp = learningHelps[Math.floor(Math.random() * learningHelps.length)];
                        
                        triggerCelebration('🌱', false, 4000);
                        
                        // Show learning tip
                        toast({ 
                          title: `Learning with Leela! 🌱`, 
                          description: `${selectedHelp.subject}: ${selectedHelp.tip}`,
                          duration: 8000,
                        });
                        
                        // Show activity suggestion
                        setTimeout(() => {
                          triggerCelebration('🎆', false, 4000);
                          toast({
                            title: "Let's Practice! 🎆",
                            description: selectedHelp.activity,
                            duration: 6000,
                          });
                        }, 3000);
                        
                        // Show skill development and award points
                        setTimeout(() => {
                          triggerCelebration('🏆', true, 6000);
                          toast({
                            title: "Skill Building! 🏆",
                            description: `Great! You're developing ${selectedHelp.skill_built}! Keep practicing and you'll become amazing at this!`,
                            duration: 6000,
                          });
                          
                          // Save learning session
                          const learningSessions = JSON.parse(localStorage.getItem('leelaLearningSessions') || '[]');
                          const newLearningSession = {
                            id: Date.now(),
                            type: 'learning_help',
                            subject: selectedHelp.subject,
                            tip: selectedHelp.tip,
                            activity: selectedHelp.activity,
                            skill_built: selectedHelp.skill_built,
                            timestamp: new Date(),
                            completed: true,
                            pointsEarned: selectedHelp.points
                          };
                          learningSessions.push(newLearningSession);
                          localStorage.setItem('leelaLearningSessions', JSON.stringify(learningSessions));
                          
                          // Award learning points
                          const learningPoints = parseInt(localStorage.getItem('learningPoints') || '0');
                          const newLearningPoints = learningPoints + selectedHelp.points;
                          localStorage.setItem('learningPoints', newLearningPoints.toString());
                          
                          // Show achievement notification
                          setTimeout(() => {
                            toast({
                              title: "Learning Points Earned! 🌟",
                              description: `Wonderful learning! You earned ${selectedHelp.points} learning points! Total: ${newLearningPoints} points`,
                              duration: 5000,
                            });
                            
                            // Check for learning master achievement
                            if (newLearningPoints >= 150) {
                              setTimeout(() => {
                                triggerCelebration('🧪', true, 10000);
                                toast({
                                  title: "Learning Superhero! 🧪",
                                  description: "150+ learning points! You're officially a Learning Superhero! Your brain is getting super strong!",
                                  duration: 8000,
                                });
                              }, 2000);
                            }
                          }, 1500);
                        }, 6000);
                        
                      } catch (error) {
                        console.error('Failed to start learning session:', error);
                        toast({
                          title: "Oops! 😅",
                          description: "Something went wrong with learning help. Let's try again!",
                          duration: 3000,
                        });
                      } finally {
                        setTimeout(() => {
                          // triggerCelebration handles timing automatically
                          setIsLoading(false);
                        }, 2500);
                      }
                    }}
                    disabled={isLoading}
                  >
                    <span className="text-3xl animate-bounce delay-500">🌱</span>
                    <span className="text-sm font-semibold">Learning Help</span>
                  </Button>
                  
                  <Button 
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white rounded-2xl p-6 h-auto flex flex-col items-center gap-3 shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95"
                    onClick={() => {
                      triggerCelebration('😄', true, 3000);
                      toast({ 
                        title: "Fun Time with Leela! 😄", 
                        description: "Laughter is the best magic! It makes everything brighter and more wonderful. Let's create some joy together!" 
                      });
                    }}
                  >
                    <span className="text-3xl animate-bounce delay-700">😄</span>
                    <span className="text-sm font-semibold">Just for Fun</span>
                  </Button>
                  
                  <Button 
                    className="bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl p-6 h-auto flex flex-col items-center gap-3 shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95 sm:col-span-2"
                    onClick={() => {
                      triggerCelebration('📝', true, 3000);
                      toast({ 
                        title: "Homework Helper Leela! 📝", 
                        description: "Don't worry! Every question is a chance to grow smarter. Let's solve this together step by step! I believe in you! 🌟" 
                      });
                    }}
                  >
                    <span className="text-4xl animate-bounce delay-900">📝</span>
                    <span className="text-lg font-bold">Help with Homework</span>
                    <span className="text-xs opacity-90">Math, Reading, Science & More!</span>
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
                      triggerCelebration('✨', false, 2000);
                      toast({ 
                        title: "More Wisdom Coming! ✨", 
                        description: "Leela has so many magical insights to share with you!" 
                      });
                      // triggerCelebration handles timing automatically
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
                  <div className="text-xl sm:text-2xl font-bold text-yellow-800 mt-1">{totalKindnessPoints}</div>
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
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    
                    // Calculate comprehensive achievements
                    const calculateAllAchievements = () => {
                      const kindnessPoints = parseInt(localStorage.getItem('kindnessPoints') || '0');
                      const creativityPoints = parseInt(localStorage.getItem('creativityPoints') || '0');
                      const learningPoints = parseInt(localStorage.getItem('learningPoints') || '0');
                      const coachingPoints = parseInt(localStorage.getItem('coachingPoints') || '0');
                      const mythologyPoints = parseInt(localStorage.getItem('mythologyPoints') || '0');
                      const memoryPoints = parseInt(localStorage.getItem('memoryPoints') || '0');
                      const mobileActions = parseInt(localStorage.getItem('totalMobileActions') || '0');
                      const progressTracking = parseInt(localStorage.getItem('progressTrackingPoints') || '0');
                      
                      const totalAchievementPoints = kindnessPoints + creativityPoints + learningPoints + 
                                                    coachingPoints + mythologyPoints + memoryPoints + 
                                                    (mobileActions * 2) + progressTracking;
                      
                      const achievements: Array<{type: string, title: string, level: number | string}> = [];
                      
                      // Individual skill achievements
                      if (kindnessPoints >= 25) achievements.push({ type: 'kindness', title: 'Heart of Gold 💖', level: kindnessPoints });
                      if (creativityPoints >= 50) achievements.push({ type: 'creativity', title: 'Creative Genius 🎨', level: creativityPoints });
                      if (learningPoints >= 75) achievements.push({ type: 'learning', title: 'Learning Champion 📚', level: learningPoints });
                      if (coachingPoints >= 40) achievements.push({ type: 'coaching', title: 'Wisdom Seeker 🧚‍♀️', level: coachingPoints });
                      if (mythologyPoints >= 30) achievements.push({ type: 'mythology', title: 'Story Master 🏰', level: mythologyPoints });
                      if (memoryPoints >= 35) achievements.push({ type: 'memory', title: 'Memory Keeper 📸', level: memoryPoints });
                      if (mobileActions >= 15) achievements.push({ type: 'mobile', title: 'Mobile Master 📱', level: mobileActions });
                      
                      // Super achievements
                      if (totalAchievementPoints >= 200) achievements.push({ type: 'super', title: 'Super Champion 🏆', level: totalAchievementPoints });
                      if (totalAchievementPoints >= 500) achievements.push({ type: 'legendary', title: 'Legendary Hero 👑', level: totalAchievementPoints });
                      
                      // Special combination achievements
                      if (kindnessPoints >= 20 && creativityPoints >= 20) {
                        achievements.push({ type: 'combo', title: 'Kind Creator 🌈', level: 'Special' });
                      }
                      if (learningPoints >= 30 && coachingPoints >= 20) {
                        achievements.push({ type: 'combo', title: 'Wise Learner 🧙‍♂️', level: 'Special' });
                      }
                      
                      return { achievements, totalPoints: totalAchievementPoints };
                    };
                    
                    const result = calculateAllAchievements();
                    
                    // Start massive celebration
                    triggerCelebration('🎉', true, 3000);
                    
                    // Show main celebration
                    toast({ 
                      title: "You're Absolutely Amazing! 🎉", 
                      description: `${result.totalPoints} total achievement points across ${result.achievements.length} major achievements! You're incredible!`,
                      duration: 8000,
                    });
                    
                    // Show individual achievements
                    if (result.achievements.length > 0) {
                      setTimeout(() => {
                        const randomAchievement = result.achievements[Math.floor(Math.random() * result.achievements.length)];
                        triggerCelebration('🏆', true, 8000);
                        toast({
                          title: `Special Achievement! 🏆`,
                          description: `${randomAchievement.title} - Level: ${randomAchievement.level}! You've earned this amazing badge!`,
                          duration: 6000,
                        });
                      }, 2000);
                      
                      // Show achievement count
                      setTimeout(() => {
                        triggerCelebration('🎆', true, 10000);
                        toast({
                          title: "Achievement Master! 🎆",
                          description: `You've unlocked ${result.achievements.length} special achievements! Each one shows how amazing you are!`,
                          duration: 7000,
                        });
                      }, 4000);
                      
                      // Show motivational message
                      setTimeout(() => {
                        const motivationalMessages = [
                          "You make the world brighter with your kindness! 🌟",
                          "Your creativity inspires everyone around you! 🎨",
                          "Your curiosity and learning spirit are incredible! 📚",
                          "You're growing into such a wonderful person! 🌱",
                          "Your family is so proud of all you've accomplished! 💖"
                        ];
                        
                        const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
                        
                        triggerCelebration('💖', true, 12000);
                        toast({
                          title: "From Leela with Love! 🧚‍♀️",
                          description: randomMessage,
                          duration: 8000,
                        });
                      }, 7000);
                      
                    } else {
                      // Encouraging message for new users
                      setTimeout(() => {
                        toast({
                          title: "Your Journey Starts Here! 🎆",
                          description: "Every expert was once a beginner! Keep exploring, learning, and being kind. Amazing achievements await you!",
                          duration: 6000,
                        });
                      }, 2000);
                    }
                    
                    // Save celebration session
                    const celebrations = JSON.parse(localStorage.getItem('celebrationSessions') || '[]');
                    const celebrationSession = {
                      id: Date.now(),
                      timestamp: new Date(),
                      totalPoints: result.totalPoints,
                      achievementsCount: result.achievements.length,
                      achievements: result.achievements,
                      celebrationType: 'full_achievement_review'
                    };
                    celebrations.push(celebrationSession);
                    localStorage.setItem('celebrationSessions', JSON.stringify(celebrations));
                    
                    // Award celebration points
                    const celebrationPoints = parseInt(localStorage.getItem('celebrationPoints') || '0') + 50;
                    localStorage.setItem('celebrationPoints', celebrationPoints.toString());
                    
                    // Final special message
                    setTimeout(() => {
                      triggerCelebration('👑', true, 15000);
                      toast({
                        title: "Celebration Champion! 👑",
                        description: `You earned 50 celebration points for reviewing your achievements! Self-celebration is a superpower! Total celebration points: ${celebrationPoints}`,
                        duration: 8000,
                      });
                    }, 9000);
                    
                  } catch (error) {
                    console.error('Failed to celebrate achievements:', error);
                    toast({
                      title: "Oops! 😅",
                      description: "Something went wrong with the celebration. But you're still amazing!",
                      duration: 3000,
                    });
                  } finally {
                    setTimeout(() => {
                      // triggerCelebration handles timing automatically
                      setIsLoading(false);
                    }, 12000);
                  }
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Celebrating...
                  </div>
                ) : (
                  '🎆 Celebrate My Success!'
                )}
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

      {/* Mobile actions will be added back when KidsMobileActions component is available */}
    </div>
  </div>
  );
}