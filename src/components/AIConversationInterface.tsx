'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, Mic, MicOff, Heart, Brain, Lightbulb, Target, 
  Clock, CheckCircle, Sparkles, MessageCircle, User,
  TrendingUp, Award, Calendar, BookOpen, Activity,
  Smile, Frown, Meh, AlertCircle, Star, Volume2
} from 'lucide-react';
import { VoiceInteraction } from '@/components/VoiceInteraction';

type Emotion =
  | "happy"
  | "sad"
  | "angry"
  | "calm"
  | "neutral";

type EmotionScore = {
  label: Emotion;
  score: number; // 0..1
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  // Optional, must be omitted when absent (never written as undefined)
  emotions?: EmotionScore[];
};

type UIState = {
  // Optional value: omit the key when not set; never assign undefined
  activeEmotion?: Emotion;
  thinking: boolean;
};

function mergeDefined<T extends Record<string, unknown>>(base: T, patch: Partial<T>): T {
  // Only write keys whose value is not undefined (to satisfy exactOptionalPropertyTypes)
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined) out[k] = v;
  }
  return out as T;
}

interface ConversationInsight {
  id: string;
  type: 'pattern' | 'opportunity' | 'strength' | 'warning';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  category: string;
}

interface SessionSummary {
  duration: number;
  messagesCount: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  keyTopics: string[];
  insights: ConversationInsight[];
  recommendations: string[];
  nextSteps: string[];
}

type AIConversationProps = {
  initialEmotion?: Emotion;                          // optional
  onEmotionChange?: (e: Emotion | undefined) => void; // may clear
  onSessionComplete?: (summary: any) => void;
};

export function AIConversationInterface(props: AIConversationProps) {
  const { initialEmotion, onEmotionChange, onSessionComplete } = props;
  const [ui, setUi] = useState<UIState>({ thinking: false });
  // messages can begin empty; emotion is omitted by default
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [currentTopic, setCurrentTopic] = useState('Initial Check-in');
  const [insights, setInsights] = useState<ConversationInsight[]>([]);
  const [sessionStartTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('chat');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialEmotion) {
      setUi(prev => mergeDefined(prev, { activeEmotion: initialEmotion }));
    }
  }, [initialEmotion]);

  const currentEmotion: Emotion | undefined = ui.activeEmotion;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  function setEmotion(e?: Emotion) {
    if (e) {
      setUi(prev => mergeDefined(prev, { activeEmotion: e }));
    } else {
      // remove the key entirely when clearing
      setUi(prev => {
        const { activeEmotion, ...rest } = prev;
        return rest; // activeEmotion omitted
      });
    }
  }

  function attachEmotionsToLastMessage(emotions?: EmotionScore[]) {
    setMessages(prev => {
      const lastMessage = prev[prev.length - 1];

      // If a last message exists, update it. Otherwise, return the state unchanged.
      // This truthiness check is a robust way to guard against empty arrays.
      if (lastMessage) {
        const updatedLast: ChatMessage = {
            id: lastMessage.id,
            role: lastMessage.role,
            content: lastMessage.content,
            ...(emotions && emotions.length > 0 && { emotions: emotions }),
        };
        return [...prev.slice(0, -1), updatedLast];
      }

      return prev;
    });
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setUi(prev => mergeDefined(prev, { thinking: true }));

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));

    const aiResponse: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: "This is a simulated AI response.",
    };

    setMessages(prev => [...prev, aiResponse]);
    setUi(prev => mergeDefined(prev, { thinking: false }));
  };

    const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const generateSessionSummary = (): SessionSummary => {
    const duration = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60); // in minutes
    
    return {
      duration,
      messagesCount: messages.length,
      sentiment: 'neutral',
      keyTopics: [],
      insights: [],
      recommendations: [],
      nextSteps: []
    };
  };

  const handleSessionComplete = () => {
    const summary = generateSessionSummary();
    onSessionComplete?.(summary);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 space-y-4">
      {/* Session Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6" />
              <div>
                <CardTitle className="text-lg">AI Coaching Session</CardTitle>
                <p className="text-sm opacity-90">{currentTopic}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white">
              <Clock className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Progress value={sessionProgress} className="h-2 bg-white/20" />
          <p className="text-xs mt-1 opacity-75">Session Progress: {sessionProgress}%</p>
        </CardContent>
      </Card>

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col space-y-4">
          {/* Messages Container */}
          <Card className="flex-1 flex flex-col">
            <CardContent className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => {
                  return (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 ${
                          message.role === 'user'
                            ? 'bg-purple-600 text-white rounded-br-none'
                            : 'bg-gray-100 rounded-bl-none'
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          {message.role === 'user' ? (
                            <User className="w-4 h-4 mt-0.5 text-purple-200" />
                          ) : (
                            <Sparkles className="w-4 h-4 mt-0.5 text-purple-600" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {ui.thinking && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-none p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-500">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            
            <Separator />
            
            {/* Input Area */}
            <div className="p-4">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share your thoughts, feelings, or ask for guidance..."
                    className="min-h-[60px] resize-none border-purple-200 focus:border-purple-400"
                    disabled={ui.thinking}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => {}}
                    variant="outline"
                    size="sm"
                    className={`p-2 ${isRecording ? 'bg-red-100 border-red-300 text-red-600' : ''}`}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || ui.thinking}
                    className="bg-purple-600 hover:bg-purple-700 p-2"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {sessionProgress >= 90 && (
                <div className="mt-3 text-center">
                  <Button
                    onClick={handleSessionComplete}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Session
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}