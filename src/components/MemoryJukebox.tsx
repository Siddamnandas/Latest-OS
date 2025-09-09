'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Camera,
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Heart,
  Share2,
  Download,
  Star,
  Clock,
  MapPin,
  Users,
  Sparkles,
  Plus,
  X,
  Volume2,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Memory {
  id: string;
  type: 'photo' | 'audio' | 'text' | 'video';
  title: string;
  description: string;
  content: string | File;
  thumbnail?: string;
  duration?: number;
  createdAt: Date;
  tags: string[];
  emotion: string;
  location?: string;
  withPartner: boolean;
  isAiWoven: boolean;
  aiInsights?: {
    themes: string[];
    emotionalScore: number;
    suggestedReminders: string[];
    connectionStrength: number;
  };
}

interface MemoryJukeboxProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MemoryJukebox({ isOpen, onClose }: MemoryJukeboxProps) {
  const { toast } = useToast();
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: '1',
      type: 'audio',
      title: 'Baby\'s First Laugh',
      description: 'That magical moment when our little angel first laughed ✨',
      content: 'recording1.mp3',
      duration: 45,
      createdAt: new Date('2024-01-15'),
      tags: ['laughter', 'baby', 'magical'],
      emotion: 'joy',
      location: 'Home',
      withPartner: true,
      isAiWoven: true,
      aiInsights: {
        themes: ['family', 'joy', 'milestone'],
        emotionalScore: 9.2,
        suggestedReminders: ['Celebrate monthly milestones', 'Create more laughter moments'],
        connectionStrength: 9.5
      }
    },
    {
      id: '2',
      type: 'photo',
      title: 'Beach Sunset',
      description: 'Our first beach walk in Mumbai, watching the sun set over the Arabian Sea 🌅',
      content: 'beach-sunset.jpg',
      thumbnail: '🌅',
      createdAt: new Date('2024-02-20'),
      tags: ['beach', 'sunset', 'romantic'],
      emotion: 'peaceful',
      location: 'Juhu Beach, Mumbai',
      withPartner: true,
      isAiWoven: false
    }
  ]);

  const [activeTab, setActiveTab] = useState('view');
  const [captureType, setCaptureType] = useState<'photo' | 'audio' | 'text'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [showAddMemory, setShowAddMemory] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoStreamRef = useRef<MediaRecorder | null>(null);

  const [newMemory, setNewMemory] = useState({
    title: '',
    description: '',
    tags: '',
    emotion: 'happy',
    withPartner: true
  });

  // Audio recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(blob);

        const newMem: Memory = {
          id: Date.now().toString(),
          type: 'audio',
          title: newMemory.title || `Audio Memory - ${new Date().toLocaleDateString()}`,
          description: newMemory.description,
          content: audioUrl,
          duration: recordingTime,
          createdAt: new Date(),
          tags: newMemory.tags.split(',').filter(t => t.trim()),
          emotion: newMemory.emotion,
          location: 'Captured',
          withPartner: newMemory.withPartner,
          isAiWoven: false
        };

        setMemories(prev => [newMem, ...prev]);
        toast({
          title: "Memory Recorded! 🎙️",
          description: "Your audio memory has been saved.",
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      toast({
        title: "Recording Started 🎤",
        description: "Speak your heart, your memory is being captured!",
      });

    } catch (error) {
      toast({
        title: "Recording Failed",
        description: "Please check microphone permissions.",
        variant: "destructive"
      });
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const capturePhoto = () => {
    // Simulate photo capture
    const newMem: Memory = {
      id: Date.now().toString(),
      type: 'photo',
      title: newMemory.title || `Photo Memory - ${new Date().toLocaleDateString()}`,
      description: newMemory.description,
      content: 'simulated-photo.jpg',
      thumbnail: '📸',
      createdAt: new Date(),
      tags: newMemory.tags.split(',').filter(t => t.trim()),
      emotion: newMemory.emotion,
      location: 'Captured',
      withPartner: newMemory.withPartner,
      isAiWoven: false
    };

    setMemories(prev => [newMem, ...prev]);
    toast({
      title: "Photo Captured! 📸",
      description: "Your memory has been saved.",
    });

    setShowAddMemory(false);
  };

  const createTextMemory = () => {
    if (!newMemory.title || !newMemory.description) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and description for your memory.",
        variant: "destructive"
      });
      return;
    }

    const newMem: Memory = {
      id: Date.now().toString(),
      type: 'text',
      title: newMemory.title,
      description: newMemory.description,
      content: newMemory.description,
      createdAt: new Date(),
      tags: newMemory.tags.split(',').filter(t => t.trim()),
      emotion: newMemory.emotion,
      location: 'Digital',
      withPartner: newMemory.withPartner,
      isAiWoven: false
    };

    setMemories(prev => [newMem, ...prev]);
    toast({
      title: "Memory Created! ✍️",
      description: "Your written memory has been saved.",
    });

    // Reset form
    setNewMemory({
      title: '',
      description: '',
      tags: '',
      emotion: 'happy',
      withPartner: true
    });

    setShowAddMemory(false);
  };

  const playAudio = (memoryId: string) => {
    // Simulate audio playback
    setIsPlaying(isPlaying === memoryId ? null : memoryId);
    toast({
      title: isPlaying === memoryId ? "Audio Paused" : "Playing Audio...",
      description: "Enjoying your precious memory!",
    });
  };

  const weaveMemory = (memoryId: string) => {
    // Simulate AI weaving
    setMemories(prev => prev.map(mem =>
      mem.id === memoryId
        ? {
            ...mem,
            isAiWoven: true,
            aiInsights: {
              themes: ['joy', 'connection', 'growth'],
              emotionalScore: Math.random() * 2 + 8,
              suggestedReminders: [
                'Revisit this memory regularly',
                'Celebrate similar moments',
                'Share with loved ones'
              ],
              connectionStrength: Math.random() * 2 + 8
            }
          }
        : mem
    ));

    toast({
      title: "AI Memory Woven! ✨",
      description: "AI has analyzed and enhanced your memory with insights.",
    });
  };

  const getEmotionColor = (emotion: string) => {
    const colors = {
      joy: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      peaceful: 'bg-blue-100 text-blue-800 border-blue-300',
      romantic: 'bg-pink-100 text-pink-800 border-pink-300',
      excited: 'bg-purple-100 text-purple-800 border-purple-300',
      happy: 'bg-green-100 text-green-800 border-green-300'
    };
    return colors[emotion as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      photo: <ImageIcon className="w-4 h-4" />,
      audio: <Volume2 className="w-4 h-4" />,
      text: <FileText className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons] || <Sparkles className="w-4 h-4" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              🎵 Memory Jukebox
            </h2>
            <p className="text-gray-600">Our collection of precious moments together</p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="view">View Memories</TabsTrigger>
            <TabsTrigger value="capture">Capture New</TabsTrigger>
            <TabsTrigger value="ai-weave">AI Memory Weaver</TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">{memories.length} Memories</span>
              <Button onClick={() => setShowAddMemory(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Memory
              </Button>
            </div>

            <div className="grid gap-4">
              {memories.map((memory) => (
                <Card key={memory.id} className="hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                          {memory.type === 'photo' ? memory.thumbnail :
                           memory.type === 'audio' ? '🎵' :
                           memory.type === 'text' ? '📝' : '⭐'}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{memory.title}</h3>
                            <Badge className={getEmotionColor(memory.emotion)}>
                              {memory.emotion}
                            </Badge>
                            {memory.isAiWoven && (
                              <Badge className="bg-purple-100 text-purple-700">
                                AI Woven ✨
                              </Badge>
                            )}
                          </div>

                          <p className="text-gray-600 text-sm mb-3">{memory.description}</p>

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {memory.createdAt.toLocaleDateString()}
                            </div>
                            {memory.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {memory.location}
                              </div>
                            )}
                            {memory.withPartner && (
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                With Partner
                              </div>
                            )}
                            {memory.duration && (
                              <Badge variant="outline">
                                {Math.floor(memory.duration / 60)}:{(memory.duration % 60).toString().padStart(2, '0')}
                              </Badge>
                            )}
                          </div>

                          {memory.aiInsights && (
                            <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                              <div className="flex items-center gap-1 mb-2">
                                <Sparkles className="w-3 h-3 text-purple-600" />
                                <span className="text-xs font-medium text-purple-700">AI Memory Insights</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>Emotional Score: {memory.aiInsights.emotionalScore.toFixed(1)}/10</div>
                                <div>Connection Strength: {memory.aiInsights.connectionStrength.toFixed(1)}/10</div>
                              </div>
                              <div className="mt-2">
                                <span className="text-xs font-medium text-purple-700">Suggested Reminders:</span>
                                <ul className="text-xs text-gray-600 mt-1">
                                  {memory.aiInsights.suggestedReminders.slice(0, 2).map((reminder, idx) => (
                                    <li key={idx} className="flex items-center gap-1">
                                      <Star className="w-2 h-2" />
                                      {reminder}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {memory.tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {memory.tags.slice(0, 3).map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {memory.type === 'audio' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => playAudio(memory.id)}
                          >
                            {isPlaying === memory.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                        )}

                        {!memory.isAiWoven && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => weaveMemory(memory.id)}
                            className="text-purple-600 border-purple-300"
                          >
                            <Sparkles className="w-4 h-4" />
                          </Button>
                        )}

                        <Button size="sm" variant="outline">
                          <Heart className="w-4 h-4" />
                        </Button>

                        <Button size="sm" variant="outline">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="capture" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant={captureType === 'photo' ? 'default' : 'outline'}
                onClick={() => setCaptureType('photo')}
                className="flex flex-col gap-2 h-24"
              >
                <Camera className="w-6 h-6" />
                <span className="text-sm">Photo</span>
              </Button>

              <Button
                variant={captureType === 'audio' ? 'default' : 'outline'}
                onClick={() => setCaptureType('audio')}
                className="flex flex-col gap-2 h-24"
              >
                <Mic className="w-6 h-6" />
                <span className="text-sm">Audio</span>
              </Button>

              <Button
                variant={captureType === 'text' ? 'default' : 'outline'}
                onClick={() => setCaptureType('text')}
                className="flex flex-col gap-2 h-24"
              >
                <FileText className="w-6 h-6" />
                <span className="text-sm">Text</span>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getTypeIcon(captureType)}
                  {captureType === 'photo' ? 'Capture Photo' :
                   captureType === 'audio' ? 'Record Audio' :
                   'Write Memory'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {captureType === 'text' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Memory Title</label>
                      <Input
                        value={newMemory.title}
                        onChange={(e) => setNewMemory(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="What's this memory about?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        value={newMemory.description}
                        onChange={(e) => setNewMemory(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Share the details..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                      <Input
                        value={newMemory.tags}
                        onChange={(e) => setNewMemory(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="joyful, romantic, family"
                      />
                    </div>

                    <Button onClick={createTextMemory} className="w-full" disabled={!newMemory.title || !newMemory.description}>
                      Create Memory ✍️
                    </Button>
                  </>
                ) : captureType === 'audio' ? (
                  <div className="text-center space-y-4">
                    <div className="text-4xl mb-4">
                      {isRecording ? '🎤' : '🎵'}
                    </div>

                    {isRecording && (
                      <div className="text-2xl font-mono font-bold text-red-600">
                        {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                      </div>
                    )}

                    {!isRecording ? (
                      <Button onClick={startAudioRecording} className="bg-red-600 hover:bg-red-700">
                        <Mic className="w-5 h-5 mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <Button onClick={stopAudioRecording} className="bg-gray-600 hover:bg-gray-700">
                        <Square className="w-5 h-5 mr-2" />
                        Stop Recording
                      </Button>
                    )}

                    <Input
                      value={newMemory.title}
                      onChange={(e) => setNewMemory(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Give your recording a title..."
                      className="text-center"
                    />
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="text-6xl mb-4">📸</div>
                    <div className="bg-gray-100 w-full h-32 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Camera would be active here</span>
                    </div>
                    <Button onClick={capturePhoto} className="bg-green-600 hover:bg-green-700">
                      <Camera className="w-5 h-5 mr-2" />
                      Capture Memory
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-weave" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-purple-600" />
                  AI Memory Weaver
                </CardTitle>
                <p className="text-sm text-gray-600">Let AI analyze and enhance your memories with intelligent insights</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {memories.filter(m => !m.isAiWoven).length > 0 ? (
                  <>
                    <p className="text-sm text-gray-700">
                      {memories.filter(m => !m.isAiWoven).length} memories ready for AI weaving:
                    </p>

                    <div className="grid gap-3">
                      {memories.filter(m => !m.isAiWoven).slice(0, 3).map((memory) => (
                        <div key={memory.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{memory.title}</h4>
                            <p className="text-sm text-gray-600">{memory.createdAt.toLocaleDateString()}</p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => weaveMemory(memory.id)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Weave
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">All Memories AI Woven! ✨</h3>
                    <p className="text-gray-600">Your memories have been analyzed and enhanced with AI insights.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
