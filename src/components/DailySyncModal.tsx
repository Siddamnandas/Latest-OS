'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Heart,
  Smile,
  Frown,
  Meh,
  Zap,
  Wind,
  Sun,
  Moon,
  Star,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Trophy,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Users,
  Award,
  Gift
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DailySyncData {
  date: Date;
  mood: string;
  energyLevel: string;
  stressLevel: string;
  connectionQuality: string;
  partnerMood?: string;
  highlights: string;
  concerns: string;
  gratitude: string;
  goals: string[];
  relationshipRating: number;
  syncCompleted: boolean;
  syncTime: number; // in seconds
}

interface DailySyncModalProps {
  isOpen: boolean;
  onComplete: (data: DailySyncData) => void;
  onClose: () => void;
  partnerName?: string;
  previousData?: Partial<DailySyncData>;
}

interface SyncStep {
  id: string;
  title: string;
  subtitle: string;
  component: React.ReactNode;
}

export function DailySyncModal({ isOpen, onComplete, onClose, partnerName = "Priya", previousData }: DailySyncModalProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [syncData, setSyncData] = useState<Partial<DailySyncData>>({
    date: new Date(),
    mood: '',
    energyLevel: '',
    stressLevel: '',
    connectionQuality: '',
    partnerMood: '',
    highlights: '',
    concerns: '',
    gratitude: '',
    goals: [],
    relationshipRating: 5,
    syncCompleted: false,
    syncTime: 0,
    ...previousData
  });
  const [syncStartTime, setSyncStartTime] = useState<Date>(new Date());
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSyncStartTime(new Date());
      setCurrentStep(0);
      setShowCelebration(false);
    }
  }, [isOpen]);

  // Auto-save progress
  useEffect(() => {
    if (syncData.date) {
      localStorage.setItem(`sync_progress_${syncData.date.toDateString()}`, JSON.stringify(syncData));
    }
  }, [syncData]);

  const calculateSyncTime = () => {
    return Math.round((new Date().getTime() - syncStartTime.getTime()) / 1000);
  };

  const updateSyncData = (key: keyof DailySyncData, value: any) => {
    setSyncData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeSync = () => {
    const finalSyncTime = calculateSyncTime();
    const completeData: DailySyncData = {
      ...syncData,
      syncCompleted: true,
      syncTime: finalSyncTime,
      date: new Date()
    } as DailySyncData;

    setShowCelebration(true);

    // Award coins based on sync completion
    document.dispatchEvent(new CustomEvent('gamification:action', {
      detail: {
        action: 'sync_completed',
        context: {
          syncTime: finalSyncTime,
          mood: syncData.mood,
          relationshipRating: syncData.relationshipRating
        }
      }
    }));

    setTimeout(() => {
      onComplete(completeData);
      onClose();
    }, 2000);
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  const steps: SyncStep[] = [
    {
      id: 'welcome',
      title: 'Daily Sync',
      subtitle: `Let's check in together, ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.`,
      component: renderWelcomeStep()
    },
    {
      id: 'mood',
      title: 'How are you feeling today?',
      subtitle: 'Your mood influences everything in your relationships.',
      component: renderMoodStep()
    },
    {
      id: 'energy',
      title: 'Energy & Presence',
      subtitle: 'How much energy do you have for connection today?',
      component: renderEnergyStep()
    },
    {
      id: 'connection',
      title: 'Our Connection',
      subtitle: 'How strong is your sense of connection today?',
      component: renderConnectionStep()
    },
    {
      id: 'reflection',
      title: "Today's Reflections",
      subtitle: 'Share your thoughts, feelings, and appreciations.',
      component: renderReflectionStep()
    },
    {
      id: 'goals',
      title: 'Tomorrow\'s Intentions',
      subtitle: 'What\'s one thing you\'d like to focus on?',
      component: renderGoalsStep()
    },
    {
      id: 'complete',
      title: 'Sync Complete!',
      subtitle: 'Well done! Your sync is complete.',
      component: renderCompleteStep()
    }
  ];

  function renderWelcomeStep() {
    return (
      <div className="text-center space-y-6 p-6">
        <div className="text-6xl mb-4">♥️</div>
        <h2 className="text-2xl font-bold text-gray-900">Daily Relationship Sync</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          A daily check-in to reflect, connect, and grow in our relationship.
          This takes about <strong>2-3 minutes</strong> and helps us stay aligned and connected.
        </p>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span>Reflect daily</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-pink-600" />
              <span>Strengthen connection</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span>Earn rewards</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          💡 Pro tip: The daily sync gets easier with practice and strengthens over time.
        </div>
      </div>
    );
  }

  function renderMoodStep() {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-4">😊</div>
          <p className="text-gray-600">Rate how you're feeling today</p>
        </div>

        <RadioGroup
          value={syncData.mood}
          onValueChange={(value) => updateSyncData('mood', value)}
        >
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'excellent', label: 'Excellent', emoji: '🌟', desc: 'Feeling amazing, best day ever!' },
              { value: 'great', label: 'Great', emoji: '😊', desc: 'Feeling really good today' },
              { value: 'good', label: 'Good', emoji: '🙂', desc: 'Stable and positive' },
              { value: 'okay', label: 'Okay', emoji: '😐', desc: 'Not great, but not bad' },
              { value: 'tired', label: 'Tired', emoji: '😴', desc: 'Feeling drained today' },
              { value: 'stressed', label: 'Stressed', emoji: '😰', desc: 'Feeling overwhelmed or anxious' },
              { value: 'sad', label: 'Sad', emoji: '😢', desc: 'Feeling down or disappointed' },
              { value: 'frustrated', label: 'Frustrated', emoji: '😠', desc: 'Irritated or angry' }
            ].map((option) => (
              <Label key={option.value} className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
                <RadioGroupItem value={option.value} />
                <div className="text-xl">{option.emoji}</div>
                <div className="text-left flex-1">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.desc}</div>
                </div>
              </Label>
            ))}
          </div>
        </RadioGroup>
      </div>
    );
  }

  function renderEnergyStep() {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-4">⚡</div>
          <p className="text-gray-600">How much energy do you have for connection today?</p>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">Overall Energy Level</Label>
            <RadioGroup
              value={syncData.energyLevel}
              onValueChange={(value) => updateSyncData('energyLevel', value)}
            >
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'very-high', label: 'Very High Energy', emoji: '⚡⚡', desc: 'Ready to tackle anything!' },
                  { value: 'high', label: 'High Energy', emoji: '⚡', desc: 'Feeling active and engaged' },
                  { value: 'moderate', label: 'Moderate Energy', emoji: '🔋', desc: 'Steady and available' },
                  { value: 'low', label: 'Low Energy', emoji: '🪫', desc: 'Need gentle, low-demand connection' },
                  { value: 'very-low', label: 'Very Low Energy', emoji: '😴', desc: 'Prefer hands-off, low-interaction' },
                  { value: 'recharging', label: 'Recharging', emoji: '🔄', desc: 'Rest and recovery mode' }
                ].map((option) => (
                  <Label key={option.value} className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value={option.value} />
                    <div className="text-xl">{option.emoji}</div>
                    <div className="text-left flex-1">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.desc}</div>
                    </div>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium mb-3 block">Stress Level</Label>
            <RadioGroup
              value={syncData.stressLevel}
              onValueChange={(value) => updateSyncData('stressLevel', value)}
            >
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'none', label: 'No Stress', emoji: '😌', desc: 'Feeling calm and at peace' },
                    { value: 'low', label: 'Low Stress', emoji: '🙂', desc: 'Minor concerns but manageable' },
                    { value: 'moderate', label: 'Moderate Stress', emoji: '😐', desc: 'Some stress, can handle it' },
                    { value: 'high', label: 'High Stress', emoji: '😰', desc: 'Feeling overwhelmed' }
                  ].map((option) => (
                    <Label key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value={option.value} />
                      <div className="text-lg">{option.emoji}</div>
                      <div className="text-left flex-1">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.desc}</div>
                      </div>
                    </Label>
                  ))}
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    );
  }

  function renderConnectionStep() {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-4">❤️</div>
          <p className="text-gray-600">How connected do you feel?</p>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">Rate your connection strength today</Label>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Disconnected</span>
                <span>Super Connected</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={syncData.relationshipRating || 5}
                onChange={(e) => updateSyncData('relationshipRating', parseInt(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-base font-medium mb-3 block">Partner's Mood (if you know)</Label>
            <RadioGroup
              value={syncData.partnerMood}
              onValueChange={(value) => updateSyncData('partnerMood', value)}
            >
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'happy', label: 'Happy', emoji: '😊' },
                  { value: 'neutral', label: 'Neutral', emoji: '😐' },
                  { value: 'tired', label: 'Tired', emoji: '😴' },
                  { value: 'stressed', label: 'Stressed', emoji: '😰' },
                  { value: 'dont-know', label: "Don't Know", emoji: '❓' }
                ].map((option) => (
                  <Label key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value={option.value} />
                    <div className="text-lg">{option.emoji}</div>
                    <span className="font-medium">{option.label}</span>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    );
  }

  function renderReflectionStep() {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-4">✍️</div>
          <p className="text-gray-600">Take a moment to reflect on your day</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="highlights" className="text-base font-medium block mb-2">
              <span className="flex items-center gap-2">
                🌟 What went well today?
              </span>
            </Label>
            <Textarea
              id="highlights"
              value={syncData.highlights}
              onChange={(e) => updateSyncData('highlights', e.target.value)}
              placeholder="Share your positive moments, achievements, or joys from today..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="gratitude" className="text-base font-medium block mb-2">
              <span className="flex items-center gap-2">
                🙏 One thing I'm grateful for
              </span>
            </Label>
            <Textarea
              id="gratitude"
              value={syncData.gratitude}
              onChange={(e) => updateSyncData('gratitude', e.target.value)}
              placeholder="What are you thankful for today? (Big or small - they all count!)"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="concerns" className="text-base font-medium block mb-2">
              <span className="flex items-center gap-2">
                🤔 Any concerns or struggles?
              </span>
            </Label>
            <Textarea
              id="concerns"
              value={syncData.concerns}
              onChange={(e) => updateSyncData('concerns', e.target.value)}
              placeholder="Is there anything weighing on your mind? (Optional - sharing helps!)..."
              rows={2}
            />
          </div>
        </div>
      </div>
    );
  }

  function renderGoalsStep() {
    const goalOptions = [
      "Focus on quality time together",
      "Be more patient and understanding",
      "Express appreciation more often",
      "Complete one loving gesture",
      "Have an open, honest conversation",
      "Make someone else's day better",
      "Take care of myself better",
      "Learn something new",
      "Be present in the moment",
      "Reach out to a friend or family member"
    ];

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🎯</div>
          <p className="text-gray-600">What's one intention for tomorrow?</p>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium mb-3 block">
            <span className="flex items-center gap-2">
              🌱 Choose or create a personal intention:
            </span>
          </Label>

          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
            {goalOptions.map((goal, index) => (
              <Label key={index} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="goal"
                  value={goal}
                  checked={syncData.goals?.includes(goal) || false}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (e.target.checked) {
                      updateSyncData('goals', [value]);
                    }
                  }}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>{goal}</span>
              </Label>
            ))}
          </div>

          <div className="border-t pt-4">
            <Label htmlFor="custom-goal" className="text-base font-medium block mb-2">
              Or create a custom intention:
            </Label>
            <Input
              id="custom-goal"
              value={syncData.goals?.[0] && !goalOptions.includes(syncData.goals[0]) ? syncData.goals[0] : ''}
              onChange={(e) => {
                if (e.target.value.trim()) {
                  updateSyncData('goals', [e.target.value]);
                } else if (syncData.goals?.[0] && !goalOptions.includes(syncData.goals[0])) {
                  updateSyncData('goals', []);
                }
              }}
              placeholder="What's your intention for tomorrow? (e.g., 'Listen more attentively')"
            />
          </div>
        </div>
      </div>
    );
  }

  function renderCompleteStep() {
    return (
      <div className="text-center space-y-6 p-6">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900">You've Completed Your Daily Sync!</h2>
        <p className="text-lg text-gray-600">
          Great job! You've taken an important step in nurturing your relationship.
        </p>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">🌟 Sync Summary:</h3>
          <div className="space-y-2 text-left max-w-sm mx-auto">
            <div className="flex justify-between">
              <span>Mood:</span>
              <Badge variant="outline" className="capitalize">{syncData.mood}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Energy:</span>
              <Badge variant="outline" className="capitalize">{syncData.energyLevel?.replace('-', ' ')}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Connection:</span>
              <Badge variant="outline">{syncData.relationshipRating}/10</Badge>
            </div>
            <div className="flex justify-between">
              <span>Sync Time:</span>
              <Badge variant="outline">{calculateSyncTime()}s</Badge>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
          <p className="text-sm">
            🎯 <strong>Tomorrow's Intention:</strong> {syncData.goals?.[0] || 'Reflect on what brings you joy'}
          </p>
        </div>

        <div className="text-sm text-gray-500">
          💰 <strong>Daily sync bonus:</strong> You've earned <strong>50 Lakshmi Coins</strong> for completing your sync!
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-white mt-4">Sync Complete!</h2>
            <p className="text-white/80 text-lg mt-2">+50 Lakshmi Coins earned</p>
          </div>
        </div>
      )}

      {/* Main Modal */}
      <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold">{currentStepData.title}</h1>
                <p className="text-sm opacity-90">{currentStepData.subtitle}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <Progress value={getProgressPercentage()} className="h-2" />
            <div className="flex justify-between text-xs opacity-80 mt-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(getProgressPercentage())}% Complete</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {currentStepData.component}
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={completeSync}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8"
                >
                  Complete Daily Sync
                  <Trophy className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !syncData.mood) ||
                    (currentStep === 2 && !syncData.energyLevel) ||
                    (currentStep === 3 && syncData.relationshipRating === undefined)
                  }
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  Next Step
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>

            <div className="text-xs text-gray-500 text-center mt-3">
              Step {currentStep + 1} of {steps.length} • {Math.round(getProgressPercentage())}% Complete
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DailySyncModal;
