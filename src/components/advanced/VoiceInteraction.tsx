'use client';

import { useState, useEffect, useRef } from 'react';
import { useFeatureFlag } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { logger } from '@/lib/logger';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Brain, 
  Heart, 
  Smile,
  Frown,
  Meh,
  AlertTriangle,
  Sparkles,
  MessageSquare,
  Clock,
  TrendingUp,
  Target,
  Lightbulb,
  Pause,
  Play,
  SkipForward,
  SkipBack,
  RotateCcw
} from 'lucide-react';

interface VoiceCommand {
  id: string;
  command: string;
  action: string;
  confidence: number;
  timestamp: string;
  emotion?: string;
}

interface EmotionalState {
  primary: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'stressed' | 'calm';
  confidence: number;
  secondary?: string;
  intensity: number;
  triggers?: string[];
  recommendations?: string[];
}

interface ConversationSession {
  id: string;
  startTime: string;
  duration: number;
  emotionalJourney: EmotionalState[];
  insights: {
    emotionalPatterns: string[];
    communicationStyle: string;
    connectionLevel: number;
    recommendations: string[];
  };
  voiceCommands: VoiceCommand[];
}

export function VoiceInteraction() {
  const enabled = useFeatureFlag('voice-interaction');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionalState | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationSession[]>([]);
  const [voiceCommands, setVoiceCommands] = useState<VoiceCommand[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [emotionHistory, setEmotionHistory] = useState<EmotionalState[]>([]);
  
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (!enabled) return;
    // Initialize speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const last = event.results.length - 1;
          const command = event.results[last][0].transcript;
          const confidence = event.results[last][0].confidence;

          if (event.results[last].isFinal) {
            processVoiceCommand(command, confidence);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          logger.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      }

      // Initialize speech synthesis
      synthesisRef.current = window.speechSynthesis;
    }

    // Load mock data
    loadMockData();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  const loadMockData = () => {
    const mockSessions: ConversationSession[] = [
      {
        id: 'session-1',
        startTime: '2024-01-15T10:00:00Z',
        duration: 1200,
        emotionalJourney: [
          { primary: 'neutral', confidence: 0.8, intensity: 0.3 },
          { primary: 'happy', confidence: 0.9, intensity: 0.7 },
          { primary: 'excited', confidence: 0.85, intensity: 0.8 }
        ],
        insights: {
          emotionalPatterns: ['Positive progression throughout conversation', 'High engagement levels'],
          communicationStyle: 'Open and expressive',
          connectionLevel: 85,
          recommendations: ['Continue morning check-ins', 'Express appreciation more often']
        },
        voiceCommands: [
          { id: 'cmd-1', command: 'How are you feeling today?', action: 'emotion_check', confidence: 0.95, timestamp: '10:02', emotion: 'happy' },
          { id: 'cmd-2', command: 'Tell me about your day', action: 'conversation_starter', confidence: 0.92, timestamp: '10:05', emotion: 'neutral' }
        ]
      }
    ];

    setConversationHistory(mockSessions);
    setEmotionHistory([
      { primary: 'happy', confidence: 0.9, intensity: 0.7, triggers: ['positive conversation'], recommendations: ['maintain positive energy'] },
      { primary: 'calm', confidence: 0.85, intensity: 0.4, triggers: ['meditation'], recommendations: ['continue mindfulness practice'] },
      { primary: 'excited', confidence: 0.88, intensity: 0.8, triggers: ['weekend plans'], recommendations: ['channel excitement productively'] }
    ]);
  };

  const processVoiceCommand = async (command: string, confidence: number) => {
    setIsProcessing(true);
    
    // Analyze emotion from voice command
    const emotion = await analyzeEmotion(command);
    
    const newCommand: VoiceCommand = {
      id: `cmd-${Date.now()}`,
      command,
      action: determineAction(command),
      confidence,
      timestamp: new Date().toLocaleTimeString(),
      emotion: emotion.primary
    };

    setVoiceCommands(prev => [newCommand, ...prev.slice(0, 9)]);
    setCurrentEmotion(emotion);
    setEmotionHistory(prev => [emotion, ...prev.slice(0, 19)]);

    // Execute the command
    await executeCommand(newCommand);
    
    setIsProcessing(false);
  };

  const analyzeEmotion = async (text: string): Promise<EmotionalState> => {
    // Simulate emotion analysis
    const emotions = ['happy', 'sad', 'angry', 'neutral', 'excited', 'stressed', 'calm'];
    const emotionWords = {
      happy: ['happy', 'joy', 'great', 'wonderful', 'amazing', 'love', 'excited'],
      sad: ['sad', 'down', 'upset', 'disappointed', 'hurt'],
      angry: ['angry', 'frustrated', 'mad', 'annoyed', 'upset'],
      excited: ['excited', 'thrilled', 'pumped', 'enthusiastic'],
      stressed: ['stressed', 'overwhelmed', 'anxious', 'worried'],
      calm: ['calm', 'peaceful', 'relaxed', 'serene']
    };

    let detectedEmotion = 'neutral';
    let maxScore = 0;

    Object.entries(emotionWords).forEach(([emotion, words]) => {
      const score = words.reduce((acc, word) => {
        return acc + (text.toLowerCase().includes(word) ? 1 : 0);
      }, 0);
      if (score > maxScore) {
        maxScore = score;
        detectedEmotion = emotion;
      }
    });

    return {
      primary: detectedEmotion as EmotionalState['primary'],
      confidence: Math.min(0.9, 0.5 + (maxScore * 0.1)),
      intensity: Math.min(1.0, 0.3 + (maxScore * 0.15)),
      triggers: maxScore > 0 ? [detectedEmotion] : undefined,
      recommendations: getEmotionRecommendations(detectedEmotion as EmotionalState['primary'])
    };
  };

  const getEmotionRecommendations = (emotion: EmotionalState['primary']): string[] => {
    const recommendations = {
      happy: ['Share your joy with your partner', 'Document what made you happy', 'Express gratitude'],
      sad: ['Talk about your feelings', 'Seek comfort from your partner', 'Practice self-care'],
      angry: ['Take a moment to breathe', 'Express feelings calmly', 'Identify the root cause'],
      neutral: ['Engage in meaningful conversation', 'Share daily experiences', 'Practice active listening'],
      excited: ['Channel energy into shared activities', 'Plan something special', 'Share your enthusiasm'],
      stressed: ['Practice relaxation techniques', 'Talk about stressors', 'Seek support'],
      calm: ['Enjoy the peaceful moment', 'Practice mindfulness', 'Share your calm energy']
    };

    return recommendations[emotion] || [];
  };

  const determineAction = (command: string): string => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('how are you') || lowerCommand.includes('how do you feel')) {
      return 'emotion_check';
    }
    if (lowerCommand.includes('tell me') || lowerCommand.includes('talk about')) {
      return 'conversation_starter';
    }
    if (lowerCommand.includes('help') || lowerCommand.includes('suggest')) {
      return 'request_suggestion';
    }
    if (lowerCommand.includes('analyze') || lowerCommand.includes('insight')) {
      return 'request_analysis';
    }
    if (lowerCommand.includes('stop') || lowerCommand.includes('end')) {
      return 'stop_conversation';
    }
    
    return 'general_conversation';
  };

  const executeCommand = async (command: VoiceCommand) => {
    // Simulate command execution with AI response
    let response = '';
    
    switch (command.action) {
      case 'emotion_check':
        response = `I'm doing well! I can sense you're feeling ${command.emotion}. How can I support you today?`;
        break;
      case 'conversation_starter':
        response = "I'd love to hear more about that. What's on your mind?";
        break;
      case 'request_suggestion':
        response = "Based on your current emotional state, I suggest taking a moment for deep breathing and then sharing your thoughts with your partner.";
        break;
      case 'request_analysis':
        response = "I notice you've been showing positive emotional patterns lately. Your communication has been open and your connection level is strong.";
        break;
      default:
        response = "I'm here to listen and support your relationship journey. What would you like to explore?";
    }

    if (audioEnabled && synthesisRef.current) {
      speakResponse(response);
    }
  };

  const speakResponse = (text: string) => {
    if (synthesisRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      synthesisRef.current.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'happy': return <Smile className="w-5 h-5 text-yellow-500" />;
      case 'sad': return <Frown className="w-5 h-5 text-blue-500" />;
      case 'angry': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'excited': return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'stressed': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'calm': return <Meh className="w-5 h-5 text-green-500" />;
      default: return <Meh className="w-5 h-5 text-gray-500" />;
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'happy': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'sad': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'angry': return 'bg-red-100 text-red-700 border-red-200';
      case 'excited': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'stressed': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'calm': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Voice Interaction & Emotional Intelligence</h2>
          <p className="text-gray-600">AI-powered voice commands and emotional analysis</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={audioEnabled ? 'default' : 'outline'}
            size="sm"
            onClick={toggleAudio}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Voice Control Panel */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Voice Assistant</h3>
              <p className="text-blue-100">Speak naturally, I'm listening and analyzing</p>
            </div>
            <div className="flex items-center gap-3">
              {currentEmotion && (
                <Badge className="bg-white/20 text-white">
                  {getEmotionIcon(currentEmotion.primary)}
                  <span className="ml-1 capitalize">{currentEmotion.primary}</span>
                </Badge>
              )}
              <Button
                onClick={toggleListening}
                className={`rounded-full w-12 h-12 ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-white text-blue-600 hover:bg-gray-100'}`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
            </div>
          </div>
          
          {isProcessing && (
            <div className="flex items-center gap-2 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing your voice command...
            </div>
          )}
          
          {/* Voice Command Examples */}
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-blue-100">Try saying:</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                "How are you feeling today?"
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                "Tell me about your day"
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                "Give me a relationship suggestion"
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                "Analyze our communication patterns"
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="emotions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="emotions">Emotional State</TabsTrigger>
          <TabsTrigger value="commands">Voice Commands</TabsTrigger>
          <TabsTrigger value="sessions">Conversation History</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="emotions" className="space-y-4">
          {/* Current Emotional State */}
          {currentEmotion && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Current Emotional State
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getEmotionIcon(currentEmotion.primary)}
                      <div>
                        <h4 className="font-medium text-gray-900 capitalize">{currentEmotion.primary}</h4>
                        <p className="text-sm text-gray-600">Confidence: {Math.round(currentEmotion.confidence * 100)}%</p>
                      </div>
                    </div>
                    <Badge className={getEmotionColor(currentEmotion.primary)}>
                      Intensity: {Math.round(currentEmotion.intensity * 100)}%
                    </Badge>
                  </div>
                  
                  {currentEmotion.recommendations && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Recommendations:</h5>
                      <div className="space-y-1">
                        {currentEmotion.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <Lightbulb className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Emotion History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Emotional Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emotionHistory.slice(0, 5).map((emotion, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getEmotionIcon(emotion.primary)}
                      <div>
                        <h4 className="font-medium text-gray-900 capitalize">{emotion.primary}</h4>
                        <p className="text-sm text-gray-600">
                          {Math.round(emotion.confidence * 100)}% confidence • {Math.round(emotion.intensity * 100)}% intensity
                        </p>
                      </div>
                    </div>
                    <Badge className={getEmotionColor(emotion.primary)}>
                      Recent
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commands" className="space-y-4">
          {/* Recent Voice Commands */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Recent Voice Commands
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {voiceCommands.length > 0 ? (
                  voiceCommands.map((cmd) => (
                    <div key={cmd.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">"{cmd.command}"</h4>
                          {cmd.emotion && (
                            <Badge variant="outline" className="text-xs">
                              {getEmotionIcon(cmd.emotion)}
                              <span className="ml-1 capitalize">{cmd.emotion}</span>
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Action: {cmd.action}</span>
                          <span>Confidence: {Math.round(cmd.confidence * 100)}%</span>
                          <span>{cmd.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Mic className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No voice commands yet. Start speaking to see your commands here.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Command Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Command Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Emotion Check</h4>
                  <p className="text-sm text-gray-600">"How are you feeling?", "What's your emotional state?"</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Conversation Starters</h4>
                  <p className="text-sm text-gray-600">"Tell me about your day", "Let's talk about..."</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Request Suggestions</h4>
                  <p className="text-sm text-gray-600">"Help me with...", "Give me advice on..."</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Analysis Requests</h4>
                  <p className="text-sm text-gray-600">"Analyze our patterns", "Give me insights"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          {/* Conversation Sessions */}
          <div className="grid gap-4">
            {conversationHistory.map((session) => (
              <Card key={session.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Conversation Session
                    </CardTitle>
                    <Badge variant="outline">
                      {Math.floor(session.duration / 60)} min
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Started: {new Date(session.startTime).toLocaleString()}</span>
                      <span>Connection Level: {session.insights.connectionLevel}%</span>
                    </div>
                    
                    {/* Emotional Journey */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Emotional Journey:</h5>
                      <div className="flex gap-2">
                        {session.emotionalJourney.map((emotion, index) => (
                          <Badge key={index} className={getEmotionColor(emotion.primary)}>
                            {getEmotionIcon(emotion.primary)}
                            <span className="ml-1 capitalize text-xs">{emotion.primary}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Key Insights */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Key Insights:</h5>
                      <p className="text-sm text-gray-600">{session.insights.communicationStyle}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {/* AI Emotional Intelligence Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                AI Emotional Intelligence Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Communication Patterns</h4>
                    <p className="text-sm text-gray-600">Your conversations show high emotional intelligence with excellent empathy and active listening skills.</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Emotional Awareness</h4>
                    <p className="text-sm text-gray-600">Strong emotional recognition and appropriate responses to partner's emotional states.</p>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Relationship Health Indicators</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Emotional Connection</span>
                      <div className="flex items-center gap-2">
                        <Progress value={85} className="w-20 h-2" />
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Communication Quality</span>
                      <div className="flex items-center gap-2">
                        <Progress value={92} className="w-20 h-2" />
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Emotional Intelligence</span>
                      <div className="flex items-center gap-2">
                        <Progress value={88} className="w-20 h-2" />
                        <span className="text-sm font-medium">88%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Personalized Recommendations</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <Heart className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Continue using voice commands to maintain emotional awareness</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Brain className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>Practice emotional check-ins during stressful moments</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Sparkles className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Use AI insights to deepen your emotional connection</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}