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

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  archetype?: 'radha_krishna' | 'sita_ram' | 'shiva_shakti';
  suggestions?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  emotion?: 'happy' | 'sad' | 'angry' | 'excited' | 'anxious' | 'calm';
  confidence?: number;
  topics?: string[];
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

interface AIConversationInterfaceProps {
  sessionId?: string;
  onSessionComplete?: (summary: SessionSummary) => void;
}

export function AIConversationInterface({ sessionId, onSessionComplete }: AIConversationInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Namaste! I'm your AI relationship coach. I'm here to help you and your partner build a stronger, more harmonious relationship. How are you feeling today?",
      timestamp: new Date(),
      archetype: 'shiva_shakti',
      sentiment: 'positive',
      emotion: 'calm',
      confidence: 95,
      topics: ['greeting', 'check-in']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [currentTopic, setCurrentTopic] = useState('Initial Check-in');
  const [insights, setInsights] = useState<ConversationInsight[]>([]);
  const [sessionStartTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('chat');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const analyzeSentiment = (text: string): { sentiment: 'positive' | 'negative' | 'neutral'; confidence: number; emotion?: string } => {
    const positiveWords = ['happy', 'good', 'great', 'love', 'wonderful', 'amazing', 'excited', 'grateful', 'blessed', 'joy', 'peace'];
    const negativeWords = ['sad', 'angry', 'frustrated', 'upset', 'disappointed', 'worried', 'anxious', 'stressed', 'tired', 'overwhelmed'];
    
    const words = text.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    let sentiment: 'positive' | 'negative' | 'neutral';
    let confidence: number;
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      confidence = Math.min(90, 60 + (positiveCount - negativeCount) * 10);
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      confidence = Math.min(90, 60 + (negativeCount - positiveCount) * 10);
    } else {
      sentiment = 'neutral';
      confidence = 70;
    }
    
    // Detect specific emotions
    let emotion: string | undefined;
    if (text.toLowerCase().includes('excited') || text.toLowerCase().includes('thrilled')) {
      emotion = 'excited';
    } else if (text.toLowerCase().includes('sad') || text.toLowerCase().includes('down')) {
      emotion = 'sad';
    } else if (text.toLowerCase().includes('angry') || text.toLowerCase().includes('frustrated')) {
      emotion = 'angry';
    } else if (text.toLowerCase().includes('anxious') || text.toLowerCase().includes('worried')) {
      emotion = 'anxious';
    } else if (text.toLowerCase().includes('calm') || text.toLowerCase().includes('peace')) {
      emotion = 'calm';
    } else if (sentiment === 'positive') {
      emotion = 'happy';
    }
    
    return { sentiment, confidence, emotion };
  };

  const extractTopics = (text: string): string[] => {
    const topics = ['relationship', 'communication', 'work', 'family', 'kids', 'finances', 'health', 'romance', 'conflict', 'goals'];
    return topics.filter(topic => text.toLowerCase().includes(topic));
  };

  const generateInsights = (messages: Message[]): ConversationInsight[] => {
    const userMessages = messages.filter(m => m.type === 'user');
    const insights: ConversationInsight[] = [];
    
    if (userMessages.length >= 3) {
      const sentiments = userMessages.map(m => m.sentiment).filter(Boolean);
      const positiveCount = sentiments.filter(s => s === 'positive').length;
      const negativeCount = sentiments.filter(s => s === 'negative').length;
      
      if (positiveCount > negativeCount * 2) {
        insights.push({
          id: '1',
          type: 'strength',
          title: 'Positive Communication Pattern',
          description: 'You maintain a positive outlook in your conversations, which is great for relationship health.',
          confidence: 85,
          actionable: false,
          category: 'communication'
        });
      }
      
      if (negativeCount > positiveCount) {
        insights.push({
          id: '2',
          type: 'warning',
          title: 'Negative Sentiment Detected',
          description: 'Consider focusing on more positive aspects or seeking support for challenges.',
          confidence: 75,
          actionable: true,
          category: 'emotional'
        });
      }
    }
    
    return insights;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getArchetypeInfo = (archetype?: string) => {
    switch (archetype) {
      case 'radha_krishna':
        return { 
          name: 'Radha-Krishna', 
          emoji: '🎨', 
          color: 'bg-pink-100 text-pink-700 border-pink-200',
          description: 'Play & Romance'
        };
      case 'sita_ram':
        return { 
          name: 'Sita-Ram', 
          emoji: '⚖️', 
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          description: 'Duty & Balance'
        };
      case 'shiva_shakti':
        return { 
          name: 'Shiva-Shakti', 
          emoji: '🧘', 
          color: 'bg-purple-100 text-purple-700 border-purple-200',
          description: 'Harmony & Growth'
        };
      default:
        return { 
          name: 'Wisdom', 
          emoji: '🌟', 
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          description: 'Ancient Wisdom'
        };
    }
  };

  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Analyze user message for context
    const sentiment = analyzeSentiment(userMessage);
    const topics = extractTopics(userMessage);
    
    // Context-aware responses based on sentiment and topics
    const responses = {
      positive: [
        {
          content: "That's wonderful to hear! Your positive energy is contagious. Let's explore how we can amplify these good feelings and share them with your partner.",
          archetype: 'radha_krishna' as const,
          suggestions: ['Plan a surprise for your partner', 'Share what made you happy today', 'Express gratitude together'],
          followUp: "What specifically contributed to these positive feelings?"
        },
        {
          content: "I love hearing about your positive experiences! This is a great foundation for building even stronger connections. Let's dive deeper into what's working well.",
          archetype: 'shiva_shakti' as const,
          suggestions: ['Identify success factors', 'Create more positive moments', 'Share your joy with your partner'],
          followUp: "How can we create more moments like this in your relationship?"
        }
      ],
      negative: [
        {
          content: "I understand that things might be challenging right now. It's completely normal to face difficulties in relationships. Let's work through this together with compassion and understanding.",
          archetype: 'sita_ram' as const,
          suggestions: ['Take deep breaths together', 'Identify the core issue', 'Create a small action plan'],
          followUp: "What support do you need most right now?"
        },
        {
          content: "Thank you for being open about these challenges. It takes courage to share difficult feelings. Let's approach this with wisdom and find balanced solutions.",
          archetype: 'shiva_shakti' as const,
          suggestions: ['Practice self-compassion', 'Consider your partner\'s perspective', 'Find middle ground'],
          followUp: "What would make this situation feel more manageable?"
        }
      ],
      neutral: [
        {
          content: "Thank you for sharing that with me. Let's explore this topic together and see what insights we can uncover for your relationship journey.",
          archetype: 'shiva_shakti' as const,
          suggestions: ['Reflect on your feelings', 'Consider different perspectives', 'Set small goals'],
          followUp: "What aspect of this would you like to explore first?"
        }
      ]
    };
    
    // Topic-specific responses
    const topicResponses = {
      relationship: "Relationships are at the heart of what we do here. Every connection needs nurturing and attention to grow stronger.",
      communication: "Communication is the lifeblood of any healthy relationship. Let's explore ways to make your communication even more effective.",
      work: "Work-life balance is crucial for relationship health. Let's find ways to ensure your relationship gets the attention it deserves.",
      family: "Family dynamics can be complex and beautiful. Let's work on creating harmony and understanding in your family relationships.",
      kids: "Parenting together can be both challenging and rewarding. Let's explore how to strengthen your partnership as parents.",
      finances: "Financial matters can be a source of stress or unity in relationships. Let's approach this with wisdom and teamwork.",
      health: "Health is wealth, especially when it comes to relationships. Let's explore how to support each other's wellbeing.",
      romance: "Romance keeps the spark alive in relationships. Let's explore ways to bring more love and connection into your daily life.",
      conflict: "Conflict is natural in relationships, but how we handle it makes all the difference. Let's find constructive approaches.",
      goals: "Shared goals create powerful bonds between partners. Let's explore how to align your dreams and aspirations."
    };
    
    // Select response based on sentiment
    const sentimentResponses = responses[sentiment.sentiment] || responses.neutral;
    const selectedResponse = sentimentResponses[Math.floor(Math.random() * sentimentResponses.length)];
    
    // Add topic-specific context if relevant
    let enhancedContent = selectedResponse.content;
    if (topics.length > 0) {
      const mainTopic = topics[0];
      if (topicResponses[mainTopic as keyof typeof topicResponses]) {
        enhancedContent += " " + topicResponses[mainTopic as keyof typeof topicResponses];
      }
    }
    
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: enhancedContent,
      timestamp: new Date(),
      archetype: selectedResponse.archetype,
      sentiment: 'positive',
      emotion: 'calm',
      confidence: 90,
      suggestions: [...selectedResponse.suggestions, selectedResponse.followUp],
      topics: ['coaching', ...topics]
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Analyze user message
    const sentiment = analyzeSentiment(inputMessage);
    const topics = extractTopics(inputMessage);

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      sentiment: sentiment.sentiment,
      emotion: sentiment.emotion,
      confidence: sentiment.confidence,
      topics: topics
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Update session progress
    setSessionProgress(prev => Math.min(prev + 15, 100));

    // Generate AI response
    const aiResponse = await generateAIResponse(inputMessage);
    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);

    // Generate insights based on conversation
    const newInsights = generateInsights([...messages, userMessage, aiResponse]);
    setInsights(newInsights);

    // Update topic based on conversation flow
    if (sessionProgress < 30) {
      setCurrentTopic('Understanding Feelings');
    } else if (sessionProgress < 60) {
      setCurrentTopic('Exploring Solutions');
    } else if (sessionProgress < 90) {
      setCurrentTopic('Action Planning');
    } else {
      setCurrentTopic('Session Complete');
    }
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    // In a real app, this would integrate with speech recognition
  };

  const generateSessionSummary = (): SessionSummary => {
    const duration = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60); // in minutes
    const userMessages = messages.filter(m => m.type === 'user');
    const sentiments = userMessages.map(m => m.sentiment).filter(Boolean) as ('positive' | 'negative' | 'neutral')[];
    
    // Calculate overall sentiment
    const sentimentCounts = sentiments.reduce((acc, sentiment) => {
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const overallSentiment = sentimentCounts.positive > sentimentCounts.negative ? 'positive' : 
                           sentimentCounts.negative > sentimentCounts.positive ? 'negative' : 'neutral';
    
    // Extract key topics
    const allTopics = messages.flatMap(m => m.topics || []);
    const topicCounts = allTopics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const keyTopics = Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([topic]) => topic);
    
    // Generate recommendations
    const recommendations = [
      "Continue daily check-ins with your partner",
      "Practice active listening in conversations",
      "Schedule quality time together regularly"
    ];
    
    if (overallSentiment === 'negative') {
      recommendations.unshift("Consider seeking additional support or counseling");
    }
    
    const nextSteps = [
      "Share your insights from this session with your partner",
      "Implement one small change this week",
      "Schedule your next coaching session"
    ];
    
    return {
      duration,
      messagesCount: messages.length,
      sentiment: overallSentiment,
      keyTopics,
      insights,
      recommendations,
      nextSteps
    };
  };

  const handleVoiceCommand = (command: string, action: string) => {
    // Handle voice commands by converting them to messages
    const voiceMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `[Voice Command] ${command}`,
      timestamp: new Date(),
      sentiment: 'positive',
      emotion: 'calm',
      confidence: 90,
      topics: ['voice', 'command']
    };

    setMessages(prev => [...prev, voiceMessage]);
    
    // Generate AI response to the voice command
    generateAIResponse(command).then(aiResponse => {
      setMessages(prev => [...prev, aiResponse]);
    });

    // Update session progress
    setSessionProgress(prev => Math.min(prev + 10, 100));
  };

  const handleVoiceSessionComplete = (session: any) => {
    console.log('Voice session completed:', session);
    // Add voice session summary to insights if needed
  };

  const handleVoiceTranscriptUpdate = (transcript: string) => {
    setVoiceTranscript(transcript);
  };

  const handleSessionComplete = () => {
    const summary = generateSessionSummary();
    onSessionComplete?.(summary);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getEmotionIcon = (emotion?: string) => {
    switch (emotion) {
      case 'happy': return <Smile className="w-4 h-4" />;
      case 'sad': return <Frown className="w-4 h-4" />;
      case 'angry': return <AlertCircle className="w-4 h-4" />;
      case 'excited': return <Star className="w-4 h-4" />;
      case 'anxious': return <AlertCircle className="w-4 h-4" />;
      case 'calm': return <Meh className="w-4 h-4" />;
      default: return <Meh className="w-4 h-4" />;
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'neutral': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return <Award className="w-4 h-4 text-green-600" />;
      case 'opportunity': return <Lightbulb className="w-4 h-4 text-blue-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'pattern': return <Activity className="w-4 h-4 text-purple-600" />;
      default: return <Brain className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                  const archetypeInfo = getArchetypeInfo(message.archetype);
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 ${
                          message.type === 'user'
                            ? 'bg-purple-600 text-white rounded-br-none'
                            : `${archetypeInfo.color} rounded-bl-none`
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          {message.type === 'user' ? (
                            <User className="w-4 h-4 mt-0.5 text-purple-200" />
                          ) : (
                            <span className="text-sm">{archetypeInfo.emoji}</span>
                          )}
                          <div className="flex-1">
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <p className={`text-xs ${
                                message.type === 'user' ? 'text-purple-200' : 'text-gray-500'
                              }`}>
                                {formatTime(message.timestamp)}
                              </p>
                              {message.sentiment && (
                                <Badge variant="outline" className={`text-xs ${getSentimentColor(message.sentiment)}`}>
                                  {getEmotionIcon(message.emotion)}
                                  <span className="ml-1">{message.sentiment}</span>
                                </Badge>
                              )}
                              {message.confidence && (
                                <span className="text-xs opacity-75">
                                  {message.confidence}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {message.topics && message.topics.length > 0 && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {message.topics.map((topic, index) => (
                                <span key={index} className="text-xs bg-white/10 px-2 py-1 rounded-full">
                                  #{topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {message.suggestions && (
                          <div className="mt-3 space-y-1">
                            <p className="text-xs font-medium mb-1">Quick suggestions:</p>
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => setInputMessage(suggestion)}
                                className="block w-full text-left text-xs p-2 rounded bg-white/10 hover:bg-white/20 transition-colors"
                              >
                                💡 {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {isTyping && (
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
                    disabled={isTyping}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleVoiceToggle}
                    variant="outline"
                    size="sm"
                    className={`p-2 ${isRecording ? 'bg-red-100 border-red-300 text-red-600' : ''}`}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
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

        <TabsContent value="voice" className="space-y-4">
          <VoiceInteraction
            onVoiceCommand={handleVoiceCommand}
            onSessionComplete={handleVoiceSessionComplete}
            onTranscriptUpdate={handleVoiceTranscriptUpdate}
          />
          
          {/* Voice Transcript Integration */}
          {voiceTranscript && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Voice Transcript
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{voiceTranscript}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    onClick={() => setInputMessage(voiceTranscript)}
                    variant="outline"
                    size="sm"
                  >
                    Send to Chat
                  </Button>
                  <Button
                    onClick={() => setVoiceTranscript('')}
                    variant="outline"
                    size="sm"
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Conversation Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {insights.length > 0 ? (
                <div className="space-y-4">
                  {insights.map((insight) => (
                    <div key={insight.id} className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <Badge variant="outline" className="text-xs">
                              {insight.type}
                            </Badge>
                            <span className="text-gray-500">Confidence: {insight.confidence}%</span>
                            {insight.actionable && (
                              <Badge className="bg-blue-100 text-blue-700 text-xs">
                                Actionable
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Keep talking to generate insights about your conversation patterns.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Conversation Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{messages.length}</div>
                  <div className="text-sm text-blue-600">Total Messages</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {messages.filter(m => m.sentiment === 'positive').length}
                  </div>
                  <div className="text-sm text-green-600">Positive Messages</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Session Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60)}m
                    </div>
                    <div className="text-sm text-purple-600">Duration</div>
                  </div>
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <div className="text-2xl font-bold text-pink-600">{sessionProgress}%</div>
                    <div className="text-sm text-pink-600">Progress</div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Key Topics Discussed:</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(messages.flatMap(m => m.topics || []))).map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{topic}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="text-center">
                  <Button
                    onClick={handleSessionComplete}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Session & Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}