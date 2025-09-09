'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { BalanceCompass } from './BalanceCompass';
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
  Target,
  Gift,
  Users,
  Clock,
  Home
} from 'lucide-react';

interface AssessmentAnswers {
  currentMood: string;
  energyLevel: string;
  stressLevel: string;
  relationshipSatisfaction: string;
  communicationStyle: string;
  preferredActivities: string[];
  dealBreakers: string[];
  loveLanguage: string[];
  relationshipGoals: string[];
}

interface OnboardingFlowProps {
  isOpen: boolean;
  onComplete: (results: any) => void;
  onSkip?: () => void;
}

const steps = [
  { id: 'welcome', title: 'Welcome to Latest-OS', description: 'Your AI Relationship Companion' },
  { id: 'mood', title: 'How are you feeling?', description: 'Let\'s start by understanding your current state' },
  { id: 'energy', title: 'Energy & Stress Level', description: 'Tell us about your current energy patterns' },
  { id: 'relationship', title: 'Relationship Snapshot', description: 'Share about your relationship status' },
  { id: 'preferences', title: 'What matters most?', description: 'Help us understand your relationship values' },
  { id: 'activities', title: 'Connection Activities', description: 'Which activities bring you closer?' },
  { id: 'compass', title: 'Your Balance Compass', description: 'Discover your relationship energy patterns' },
  { id: 'insights', title: 'Your Personalized Insights', description: 'Based on your responses, here\'s what we recommend' },
  { id: 'tasks', title: 'Your First Steps', description: 'Micro-tasks to strengthen your relationship' },
  { id: 'complete', title: 'Ready to Begin! 🚀', description: 'Your relationship journey starts now' }
];

export function OnboardingFlow({ isOpen, onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({
    currentMood: '',
    energyLevel: '',
    stressLevel: '',
    relationshipSatisfaction: '',
    communicationStyle: '',
    preferredActivities: [],
    dealBreakers: [],
    loveLanguage: [],
    relationshipGoals: []
  });

  const [compassBalance, setCompassBalance] = useState({
    rama: 25,
    krishna: 25,
    shiva: 25,
    lakshmi: 25
  });

  const [generatedTasks, setGeneratedTasks] = useState<Array<{
    title: string;
    description: string;
    type: string;
    estimatedTime: number;
    reward: number;
    status: string;
  }>>([]);

  // Note: do not early-return before hooks;
  // handle isOpen after hooks to satisfy Rules of Hooks.

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

  const updateAnswer = (key: keyof AssessmentAnswers, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateTasks = (): Array<{
    title: string;
    description: string;
    type: string;
    estimatedTime: number;
    reward: number;
    status: string;
  }> => {
    const tasks: Array<{
      title: string;
      description: string;
      type: string;
      estimatedTime: number;
      reward: number;
      status: string;
    }> = [];

    // Mood-based tasks
    if (answers.currentMood === 'stressed' || answers.stressLevel === 'high') {
      tasks.push({
        title: 'Take a deep breath moment',
        description: '5-minute mindfulness exercise together',
        type: 'stress-relief',
        estimatedTime: 5,
        reward: 25,
        status: 'pending'
      });
    }

    if (answers.currentMood === 'disconnected') {
      tasks.push({
        title: 'Share appreciation',
        description: 'Tell your partner 3 things you appreciate about them',
        type: 'connection',
        estimatedTime: 10,
        reward: 30,
        status: 'pending'
      });
    }

    // Communication-based tasks
    if (answers.communicationStyle === 'open') {
      tasks.push({
        title: 'Weekly check-in conversation',
        description: 'Set aside 30 minutes for deeper relationship talk',
        type: 'communication',
        estimatedTime: 30,
        reward: 50,
        status: 'pending'
      });
    }

    // Activity preference tasks
    if (answers.preferredActivities.includes('physical-touch')) {
      tasks.push({
        title: 'Cuddle session',
        description: '15 minutes of intentional physical closeness',
        type: 'affection',
        estimatedTime: 15,
        reward: 25,
        status: 'pending'
      });
    }

    if (answers.preferredActivities.includes('quality-time')) {
      tasks.push({
        title: 'Date night planning',
        description: 'Plan one meaningful activity for this week',
        type: 'planning',
        estimatedTime: 10,
        reward: 35,
        status: 'pending'
      });
    }

    // Archetype-based tasks
    const dominantArchetype = Object.entries(compassBalance)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0];

    if (dominantArchetype === 'rama') {
      tasks.push({
        title: 'Commitment ritual',
        description: 'Create a small daily commitment together',
        type: 'structure',
        estimatedTime: 5,
        reward: 20,
        status: 'pending'
      });
    }

    if (dominantArchetype === 'krishna') {
      tasks.push({
        title: 'Playful surprise',
        description: 'Plan a fun, spontaneous activity',
        type: 'fun',
        estimatedTime: 15,
        reward: 40,
        status: 'pending'
      });
    }

    if (dominantArchetype === 'shiva') {
      tasks.push({
        title: 'Growth conversation',
        description: 'Discuss personal development goals',
        type: 'growth',
        estimatedTime: 20,
        reward: 45,
        status: 'pending'
      });
    }

    if (dominantArchetype === 'lakshmi') {
      tasks.push({
        title: 'Abundance mindset',
        description: 'Practice gratitude for your relationship',
        type: 'mindfulness',
        estimatedTime: 10,
        reward: 30,
        status: 'pending'
      });
    }

    // Ensure at least 3 tasks
    while (tasks.length < 3) {
      tasks.push({
        title: 'Relationship reflection',
        description: 'Write down one thing that strengthens your bond',
        type: 'reflection',
        estimatedTime: 5,
        reward: 15,
        status: 'pending'
      });
    }

    return tasks.slice(0, 3); // Return first 3 tasks
  };

  useEffect(() => {
    if (currentStep === 8) { // Tasks step
      const tasks = generateTasks();
      setGeneratedTasks(tasks);
    }
  }, [currentStep]);

  const completeOnboarding = () => {
    const results = {
      answers,
      compassBalance,
      dominantArchetype: Object.entries(compassBalance).reduce((a, b) => a[1] > b[1] ? a : b)[0],
      generatedTasks,
      completedAt: new Date(),
      completionRate: 100
    };

    onComplete(results);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Welcome
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">💕</div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome to Latest-OS</h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              We're thrilled to be your AI relationship companion. Let's take a few minutes to personalize your experience and help strengthen your connection.
            </p>
            <div className="flex flex-col space-y-3">
              <div className="text-sm text-gray-500">This assessment will help us:</div>
              <div className="flex justify-center flex-wrap gap-2">
                <Badge className="bg-blue-100 text-blue-700">Understand your needs</Badge>
                <Badge className="bg-green-100 text-green-700">Create personalized guidance</Badge>
                <Badge className="bg-purple-100 text-purple-700">Recommend activities</Badge>
                <Badge className="bg-pink-100 text-pink-700">Strengthen your bond</Badge>
              </div>
            </div>
          </div>
        );

      case 1: // Mood Assessment
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">😊</div>
              <h3 className="text-xl font-bold mb-2">How are you feeling today?</h3>
              <p className="text-gray-600">Let's start by understanding your current emotional state</p>
            </div>

            <RadioGroup
              value={answers.currentMood}
              onValueChange={(value) => updateAnswer('currentMood', value)}
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'happy', label: 'Happy & Content', emoji: '😊', color: 'bg-green-100' },
                  { value: 'excited', label: 'Excited & Energized', emoji: '🤩', color: 'bg-yellow-100' },
                  { value: 'peaceful', label: 'Peaceful & Calm', emoji: '😌', color: 'bg-blue-100' },
                  { value: 'stressed', label: 'Stressed or Anxious', emoji: '😰', color: 'bg-red-100' },
                  { value: 'sad', label: 'Sad or Down', emoji: '😢', color: 'bg-indigo-100' },
                  { value: 'disconnected', label: 'Disconnected', emoji: '🤔', color: 'bg-purple-100' },
                  { value: 'confused', label: 'Confused or Unsure', emoji: '😕', color: 'bg-orange-100' },
                  { value: 'angry', label: 'Frustrated or Angry', emoji: '😠', color: 'bg-gray-100' }
                ].map((option) => (
                  <Label key={option.value} className={`${option.color} p-4 rounded-lg cursor-pointer border-2 hover:border-blue-300`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} />
                      <div className="text-2xl">{option.emoji}</div>
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </div>
        );

      case 2: // Energy & Stress Assessment
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Energy & Stress Levels</h3>
              <p className="text-gray-600">Tell us about your current energy patterns</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Current Energy Level</Label>
                <RadioGroup
                  value={answers.energyLevel}
                  onValueChange={(value) => updateAnswer('energyLevel', value)}
                >
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { value: 'very-high', label: 'Very High Energy - Ready to take on the world!', emoji: '⚡⚡' },
                      { value: 'high', label: 'High Energy - Feeling motivated and active', emoji: '⚡' },
                      { value: 'moderate', label: 'Moderate Energy - Balanced and productive', emoji: '🔋' },
                      { value: 'low', label: 'Low Energy - Need more rest and renewal', emoji: '🪫' },
                      { value: 'very-low', label: 'Very Low Energy - Feeling drained and exhausted', emoji: '😴' }
                    ].map((option) => (
                      <Label key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value={option.value} />
                        <div className="text-lg">{option.emoji}</div>
                        <span>{option.label}</span>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Current Stress Level</Label>
                <RadioGroup
                  value={answers.stressLevel}
                  onValueChange={(value) => updateAnswer('stressLevel', value)}
                >
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { value: 'minimal', label: 'Minimal Stress - Feeling calm and collected', emoji: '😌' },
                      { value: 'low', label: 'Low Stress - Some minor concerns', emoji: '🙂' },
                      { value: 'moderate', label: 'Moderate Stress - Manageable but present', emoji: '😐' },
                      { value: 'high', label: 'High Stress - Feeling overwhelmed regularly', emoji: '😰' },
                      { value: 'very-high', label: 'Very High Stress - Need immediate help', emoji: '😵' }
                    ].map((option) => (
                      <Label key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value={option.value} />
                        <div className="text-lg">{option.emoji}</div>
                        <span>{option.label}</span>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 3: // Relationship Snapshot
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="text-xl font-bold mb-2">Relationship Snapshot</h3>
              <p className="text-gray-600">Tell us about your relationship status and satisfaction</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">How satisfied are you with your relationship?</Label>
                <RadioGroup
                  value={answers.relationshipSatisfaction}
                  onValueChange={(value) => updateAnswer('relationshipSatisfaction', value)}
                >
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'very-satisfied', label: 'Very Satisfied', emoji: '🌟' },
                      { value: 'satisfied', label: 'Satisfied', emoji: '😊' },
                      { value: 'neutral', label: 'Neutral', emoji: '😐' },
                      { value: 'dissatisfied', label: 'Dissatisfied', emoji: '😟' },
                      { value: 'very-dissatisfied', label: 'Very Dissatisfied', emoji: '😢' },
                      { value: 'single', label: 'Single/Not in Relationship', emoji: '👤' }
                    ].map((option) => (
                      <Label key={option.value} className="<%= option.color %>flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value={option.value} />
                        <div className="text-lg">{option.emoji}</div>
                        <span>{option.label}</span>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Preferred Communication Style</Label>
                <RadioGroup
                  value={answers.communicationStyle}
                  onValueChange={(value) => updateAnswer('communicationStyle', value)}
                >
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { value: 'open', label: 'Open and Direct - I prefer clear, honest communication', emoji: '💬' },
                      { value: 'subtle', label: 'Subtle and Intuitive - I pick up on non-verbal cues', emoji: '👀' },
                      { value: 'thoughtful', label: 'Thoughtful and Reflective - I need time to process before communicating', emoji: '🤔' },
                      { value: 'expressive', label: 'Expressive and Emotional - I express feelings openly', emoji: '❤️' }
                    ].map((option) => (
                      <Label key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value={option.value} />
                        <div className="text-lg">{option.emoji}</div>
                        <span>{option.label}</span>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 4: // Relationship Preferences and Values
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">❤️</div>
              <h3 className="text-xl font-bold mb-2">What Matters Most to You?</h3>
              <p className="text-gray-600">Help us understand your relationship values and priorities</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Your Love Languages (select up to 3)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'physical-touch', label: 'Physical Touch', emoji: '🤗' },
                    { value: 'quality-time', label: 'Quality Time', emoji: '⏰' },
                    { value: 'words-affirmation', label: 'Words of Affirmation', emoji: '💬' },
                    { value: 'acts-service', label: 'Acts of Service', emoji: '🛠️' },
                    { value: 'gift-giving', label: 'Receiving Gifts', emoji: '🎁' }
                  ].map((option) => (
                    <Label key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <Checkbox
                        checked={answers.loveLanguage.includes(option.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            if (answers.loveLanguage.length < 3) {
                              updateAnswer('loveLanguage', [...answers.loveLanguage, option.value]);
                            }
                          } else {
                            updateAnswer('loveLanguage', answers.loveLanguage.filter(l => l !== option.value));
                          }
                        }}
                      />
                      <div className="text-lg">{option.emoji}</div>
                      <span>{option.label}</span>
                    </Label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Your Relationship Goals</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'commitment', label: 'Build deeper commitment', emoji: '💍' },
                    { value: 'intimacy', label: 'Increase emotional intimacy', emoji: '🫂' },
                    { value: 'fun', label: 'More fun and playfulness', emoji: '🎭' },
                    { value: 'growth', label: 'Personal growth together', emoji: '🌱' },
                    { value: 'communication', label: 'Better communication', emoji: '💬' },
                    { value: 'trust', label: 'Build stronger trust', emoji: '🤝' },
                    { value: 'adventure', label: 'New adventures together', emoji: '🌍' },
                    { value: 'balance', label: 'Better work-life balance', emoji: '⚖️' }
                  ].map((option) => (
                    <Label key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <Checkbox
                        checked={answers.relationshipGoals.includes(option.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateAnswer('relationshipGoals', [...answers.relationshipGoals, option.value]);
                          } else {
                            updateAnswer('relationshipGoals', answers.relationshipGoals.filter(g => g !== option.value));
                          }
                        }}
                      />
                      <div className="text-lg">{option.emoji}</div>
                      <span>{option.label}</span>
                    </Label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // Preferences for Connection Activities
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Connection Activities</h3>
              <p className="text-gray-600">Which activities bring you closer to your partner?</p>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">Select activities that appeal to you:</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'romantic-dinner', label: 'Romantic dinner dates', emoji: '🍽️' },
                  { value: 'physical-touch', label: 'Physical closeness', emoji: '🤗' },
                  { value: 'deep-conversation', label: 'Deep conversations', emoji: '💭' },
                  { value: 'shared-adventure', label: 'New adventures together', emoji: '🏔️' },
                  { value: 'morning-coffee', label: 'Morning routine together', emoji: '☕' },
                  { value: 'evening-wind-down', label: 'Evening wind-down rituals', emoji: '🌙' },
                  { value: 'game-night', label: 'Board games or fun activities', emoji: '🎲' },
                  { value: 'artistic-creative', label: 'Creative projects together', emoji: '🎨' },
                  { value: 'sports-activity', label: 'Sports or physical activities', emoji: '🏃' },
                  { value: 'learning-together', label: 'Learning new things together', emoji: '📚' },
                  { value: 'spiritual-connection', label: 'Spiritual or mindful practices', emoji: '🧘' },
                  { value: 'surprise-gestures', label: 'Acts of kindness and surprises', emoji: '🎁' }
                ].map((activity) => (
                  <Label key={activity.value} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <Checkbox
                      checked={answers.preferredActivities.includes(activity.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateAnswer('preferredActivities', [...answers.preferredActivities, activity.value]);
                        } else {
                          updateAnswer('preferredActivities', answers.preferredActivities.filter(a => a !== activity.value));
                        }
                      }}
                    />
                    <div className="text-lg">{activity.emoji}</div>
                    <span>{activity.label}</span>
                  </Label>
                ))}
              </div>
            </div>
          </div>
        );

      case 6: // Balance Compass
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">🧭</div>
              <h3 className="text-xl font-bold mb-2">Your Balance Compass</h3>
              <p className="text-gray-600">Discover your relationship energy patterns based on ancient wisdom</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl mb-6">
              <h4 className="font-semibold text-center mb-2">Move the sliders to reflect how these energies manifest in your relationship:</h4>
              <p className="text-sm text-center text-gray-600">
                Higher values mean that archetype is more influential in how you approach relationships.
                The compass will automatically balance the remaining 100% among the other archetypes.
              </p>
            </div>

            <BalanceCompass
              balance={compassBalance}
              onBalanceUpdate={setCompassBalance}
              interactive={true}
              size="large"
            />
          </div>
        );

      case 7: // Insights Based on Answers
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">Your Personalized Insights</h3>
              <p className="text-gray-600">Based on your responses, here's what we discovered</p>
            </div>

            <div className="grid gap-4">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">😊</div>
                    <div>
                      <h4 className="font-semibold">Current Emotional State</h4>
                      <p className="text-sm">You reported feeling <strong>{answers.currentMood}</strong> with <strong>{answers.energyLevel}</strong> energy levels.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">❤️</div>
                    <div>
                      <h4 className="font-semibold">Relationship Dynamics</h4>
                      <p className="text-sm">You prefer <strong>{answers.communicationStyle}</strong> communication and are seeking to focus on {answers.relationshipGoals.join(', ')}.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🧭</div>
                    <div>
                      <h4 className="font-semibold">Dominant Archetype</h4>
                      <p className="text-sm">Your balance compass shows you're most aligned with the <strong>{Object.entries(compassBalance).reduce((a, b) => a[1] > b[1] ? a : b)[0]}</strong> archetype, suggesting you thrive in structured approaches to building emotional intimacy.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-pink-50 to-pink-100 border-pink-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <h4 className="font-semibold">Activity Preferences</h4>
                      <p className="text-sm">You connect best through: {answers.preferredActivities.slice(0, 3).join(', ')}</p>
                      <div className="flex gap-1 mt-2">
                        {answers.loveLanguage.slice(0, 3).map((lang, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {lang.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 8: // Generated Tasks
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-bold mb-2">Your First Steps</h3>
              <p className="text-gray-600">Micro-tasks designed specifically for you based on your assessment</p>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl">
                <p className="text-sm text-orange-700">
                  💡 These tasks are tailored to your current emotional state, relationship preferences, and dominant archetype.
                  Completing them will help strengthen your relationship foundation.
                </p>
              </div>

              {generatedTasks.map((task, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{task.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {task.estimatedTime} minutes
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>🪙 {task.reward} coins reward</span>
                          <span>🏷️ {task.type}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" disabled={task.status === 'completed'}>
                          {task.status === 'completed' ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Done
                            </>
                          ) : (
                            <>
                              <Target className="w-4 h-4 mr-1" />
                              Start
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                <p className="text-sm text-green-700">
                  🎯 <strong>Total Potential Reward:</strong> {generatedTasks.reduce((sum, task) => sum + (task.status === 'completed' ? 0 : task.reward), 0)} Lakshmi Coins
                  <br/>
                  ⏰ <strong>Total Time:</strong> {generatedTasks.reduce((sum, task) => sum + (task.status === 'completed' ? 0 : task.estimatedTime), 0)} minutes
                </p>
              </div>
            </div>
          </div>
        );

      case 9: // Completion
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-3xl font-bold text-gray-900">Ready to Begin Your Journey!</h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              You're all set up with personalized insights and actionable steps to strengthen your relationship.
            </p>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">🌟 Your Onboarding Summary:</h3>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <Badge className="bg-green-100 text-green-700">Emotional state assessed</Badge>
                <Badge className="bg-blue-100 text-blue-700">Balance compass created</Badge>
                <Badge className="bg-purple-100 text-purple-700">Personal preferences captured</Badge>
                <Badge className="bg-pink-100 text-pink-700">First tasks generated</Badge>
                <Badge className="bg-yellow-100 text-yellow-700">Ready to earn coins!</Badge>
              </div>
              <p className="text-sm text-gray-700">
                🪙 <strong>+250 Lakshmi Coins</strong> bonus reward for completing your onboarding assessment!
                <br/>
                🎯 <strong>{generatedTasks.length} personalized tasks</strong> ready to help you start strong.
              </p>
            </div>

            <div className="space-y-3">
              <Button onClick={completeOnboarding} size="lg" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                🎉 Start My Relationship Journey!
              </Button>

              <div className="text-sm text-gray-500">
                Your assessment results will help Latest-OS provide the most relevant guidance and recommendations for your needs.
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentStepData = steps[currentStep];
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Progress Header */}
        <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold">{currentStepData.title}</h2>
              <p className="text-sm opacity-90">{currentStepData.description}</p>
            </div>
            {onSkip && currentStep > 0 && currentStep < steps.length - 1 && (
              <Button variant="ghost" size="sm" onClick={onSkip} className="text-white hover:bg-white/20">
                Skip
              </Button>
            )}
          </div>
          <div className="space-y-2">
            <Progress value={progressPercent} className="h-2" />
            <div className="flex justify-between text-xs opacity-80">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progressPercent)}% Complete</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        {currentStep !== 0 && currentStep !== steps.length - 1 && (
          <div className="flex justify-between p-6 border-t bg-gray-50">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button onClick={nextStep} disabled={currentStep === steps.length - 1}>
              Next Step
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OnboardingFlow;
