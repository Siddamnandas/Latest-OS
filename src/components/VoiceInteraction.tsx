'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { logger } from '@/lib/logger';
import { 
  Mic, MicOff, Volume2, VolumeX, Play, Pause, 
  RotateCcw, Clock, MessageSquare, Brain, Sparkles,
  AlertCircle, CheckCircle, Loader2
} from 'lucide-react';

interface VoiceCommand {
  id: string;
  command: string;
  action: string;
  confidence: number;
  timestamp: Date;
}

interface VoiceSession {
  id: string;
  duration: number;
  commands: VoiceCommand[];
  transcript: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  emotions: string[];
}

interface VoiceInteractionProps {
  onVoiceCommand?: (command: string, action: string) => void;
  onSessionComplete?: (session: VoiceSession) => void;
  onTranscriptUpdate?: (transcript: string) => void;
}

export function VoiceInteraction({ 
  onVoiceCommand, 
  onSessionComplete, 
  onTranscriptUpdate 
}: VoiceInteractionProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [sessionTime, setSessionTime] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [detectedSentiment, setDetectedSentiment] = useState<'positive' | 'negative' | 'neutral'>('neutral');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();
  const sessionTimerRef = useRef<NodeJS.Timeout>();

  // Voice command patterns
  const commandPatterns = [
    { regex: /how are you|how do you feel/i, action: 'status_check', response: "I'm doing great! Ready to help you with your relationship journey." },
    { regex: /help me|i need help/i, action: 'request_help', response: "I'm here to help! What would you like assistance with?" },
    { regex: /daily sync|let's sync/i, action: 'start_sync', response: "Starting your daily sync session. How are you feeling today?" },
    { regex: /add task|create task/i, action: 'add_task', response: "I'll help you add a new task. What would you like to add?" },
    { regex: /show goals|my goals/i, action: 'show_goals', response: "Here are your current relationship goals." },
    { regex: /rituals|start ritual/i, action: 'show_rituals', response: "Let's explore some relationship rituals you can practice." },
    { regex: /kids|children|parenting/i, action: 'kids_activities', response: "Here are some great activities for you and your kids." },
    { regex: /insights|analytics/i, action: 'show_insights', response: "Let me show you your relationship insights and analytics." },
    { regex: /stop|end session|goodbye/i, action: 'end_session', response: "Thank you for the conversation! Have a wonderful day!" },
    { regex: /thank you|thanks/i, action: 'gratitude', response: "You're very welcome! I'm always here to help." }
  ];

  // Emotion detection keywords
  const emotionKeywords = {
    happy: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'blessed'],
    sad: ['sad', 'upset', 'disappointed', 'down', 'blue', 'hurting'],
    angry: ['angry', 'frustrated', 'mad', 'annoyed', 'upset', 'irritated'],
    anxious: ['worried', 'anxious', 'nervous', 'stressed', 'overwhelmed', 'concerned'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'content', 'at ease']
  };

  useEffect(() => {
    // Initialize audio context for visual feedback
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, []);

  const startListening = async () => {
    try {
      setIsListening(true);
      setSessionTime(0);
      
      // Start session timer
      sessionTimerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);

      // Simulate audio level animation
      const animateAudioLevel = () => {
        if (isListening) {
          // Simulate audio levels with random values
          const level = Math.random() * 100;
          setAudioLevel(level);
          animationRef.current = requestAnimationFrame(animateAudioLevel);
        }
      };
      animateAudioLevel();

      // Simulate voice recognition with random phrases
      const simulateVoiceInput = async () => {
        if (!isListening) return;

        const phrases = [
          "Hi, I'm feeling good today",
          "Can you help me with my relationship goals?",
          "I'd like to start our daily sync",
          "Show me some insights about our communication",
          "Thank you for your help"
        ];

        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        
        // Simulate processing delay
        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Add to transcript
        const newTranscript = transcript + (transcript ? ' ' : '') + randomPhrase;
        setTranscript(newTranscript);
        onTranscriptUpdate?.(newTranscript);
        
        // Process for commands and emotions
        processVoiceInput(randomPhrase);
        
        setIsProcessing(false);

        // Schedule next input if still listening
        if (isListening) {
          setTimeout(simulateVoiceInput, 3000 + Math.random() * 4000);
        }
      };

      // Start simulation after a short delay
      setTimeout(simulateVoiceInput, 2000);

    } catch (error) {
      logger.error('Error starting voice recognition:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setIsProcessing(false);
    setAudioLevel(0);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
    }

    // Complete session
    if (sessionTime > 0 || commands.length > 0) {
      const session: VoiceSession = {
        id: Date.now().toString(),
        duration: sessionTime,
        commands,
        transcript,
        sentiment: detectedSentiment,
        emotions: currentEmotion ? [currentEmotion] : []
      };
      onSessionComplete?.(session);
    }
  };

  const processVoiceInput = (input: string) => {
    // Detect emotions
    const detectedEmotions = detectEmotions(input);
    if (detectedEmotions.length > 0) {
      setCurrentEmotion(detectedEmotions[0]);
    }

    // Detect sentiment
    const sentiment = detectSentiment(input);
    setDetectedSentiment(sentiment);

    // Check for commands
    for (const pattern of commandPatterns) {
      if (pattern.regex.test(input)) {
        const command: VoiceCommand = {
          id: Date.now().toString(),
          command: input,
          action: pattern.action,
          confidence: 85 + Math.random() * 15, // Simulate confidence 85-100%
          timestamp: new Date()
        };
        
        setCommands(prev => [...prev, command]);
        onVoiceCommand?.(input, pattern.action);
        
        // Simulate voice response
        if (voiceEnabled) {
          speakResponse(pattern.response);
        }
        
        break;
      }
    }
  };

  const detectEmotions = (text: string): string[] => {
    const detected: string[] = [];
    const words = text.toLowerCase();
    
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => words.includes(keyword))) {
        detected.push(emotion);
      }
    }
    
    return detected;
  };

  const detectSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
    const positiveWords = ['good', 'great', 'happy', 'love', 'wonderful', 'amazing', 'thank', 'help'];
    const negativeWords = ['bad', 'sad', 'angry', 'frustrated', 'disappointed', 'worried', 'problem'];
    
    const words = text.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'angry': return '😠';
      case 'anxious': return '😰';
      case 'calm': return '😌';
      default: return '😐';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'neutral': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const clearSession = () => {
    setTranscript('');
    setCommands([]);
    setSessionTime(0);
    setCurrentEmotion(null);
    setDetectedSentiment('neutral');
  };

  return (
    <div className="space-y-6">
      {/* Voice Control Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mic className="w-6 h-6" />
              <div>
                <CardTitle className="text-lg">Voice Interaction</CardTitle>
                <p className="text-sm opacity-90">
                  {isListening ? 'Listening...' : 'Tap to start voice conversation'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                variant="secondary"
                size="sm"
                className="bg-white/20 text-white hover:bg-white/30"
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(sessionTime)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Audio Level Visualizer */}
          {isListening && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-white h-full transition-all duration-100 ease-out"
                    style={{ width: `${audioLevel}%` }}
                  ></div>
                </div>
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
              <p className="text-xs opacity-75">Audio Level: {Math.round(audioLevel)}%</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Voice Interface */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Voice Control Button */}
            <div className="text-center">
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                className={`w-24 h-24 rounded-full text-lg font-semibold transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                }`}
              >
                {isProcessing ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : isListening ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                {isProcessing ? 'Processing...' : isListening ? 'Tap to stop' : 'Tap to speak'}
              </p>
            </div>

            {/* Emotion and Sentiment Display */}
            {(currentEmotion || detectedSentiment !== 'neutral') && (
              <div className="flex items-center justify-center gap-4">
                {currentEmotion && (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    <span className="mr-2">{getEmotionIcon(currentEmotion)}</span>
                    {currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}
                  </Badge>
                )}
                <Badge variant="outline" className={`text-lg px-4 py-2 ${getSentimentColor(detectedSentiment)}`}>
                  {detectedSentiment.charAt(0).toUpperCase() + detectedSentiment.slice(1)}
                </Badge>
              </div>
            )}

            {/* Live Transcript */}
            {transcript && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Live Transcript
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
                  <p className="text-sm text-gray-700">{transcript}</p>
                </div>
              </div>
            )}

            {/* Recognized Commands */}
            {commands.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Recognized Commands
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {commands.map((command) => (
                    <div key={command.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{command.command}</p>
                        <p className="text-xs text-gray-600">Action: {command.action}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {Math.round(command.confidence)}%
                        </Badge>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Voice Commands Reference */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Available Voice Commands
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {commandPatterns.slice(0, 6).map((pattern, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                    <code className="text-blue-600">"{pattern.command}"</code>
                    <p className="text-gray-600 mt-1">→ {pattern.action.replace('_', ' ')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={clearSession}
                variant="outline"
                size="sm"
                disabled={isListening || isProcessing}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button
                onClick={() => speakResponse("Hello! I'm ready to help you with your relationship journey.")}
                variant="outline"
                size="sm"
                disabled={!voiceEnabled || isListening || isProcessing}
              >
                <Play className="w-4 h-4 mr-2" />
                Test Voice
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}