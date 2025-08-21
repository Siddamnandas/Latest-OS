'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Camera, 
  Video, 
  FileText, 
  Image as ImageIcon,
  X,
  Clock,
  Save,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MemoryRecorderProps {
  onSave: (memory: {
    type: 'text' | 'audio' | 'video' | 'image';
    content: string;
    title: string;
    description?: string;
    tags: string[];
    duration?: number;
  }) => void;
  onCancel: () => void;
}

export function MemoryRecorder({ onSave, onCancel }: MemoryRecorderProps) {
  const [recordingType, setRecordingType] = useState<'text' | 'audio' | 'video' | 'image'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  // Timer for recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setMediaBlob(audioBlob);
        setMediaUrl(URL.createObjectURL(audioBlob));
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to record audio memories",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
      setMediaBlob(file);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags(prev => [...prev, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please add a title for your memory",
        variant: "destructive",
      });
      return;
    }

    if (recordingType === 'text' && !content.trim()) {
      toast({
        title: "Content Required",
        description: "Please add some content for your memory",
        variant: "destructive",
      });
      return;
    }

    if ((recordingType === 'audio' || recordingType === 'video' || recordingType === 'image') && !mediaBlob) {
      toast({
        title: "Media Required",
        description: "Please record or upload media for your memory",
        variant: "destructive",
      });
      return;
    }

    const memoryData = {
      type: recordingType,
      content: recordingType === 'text' ? content : mediaUrl,
      title,
      description: description || undefined,
      tags,
      duration: recordingType !== 'text' ? recordingTime : undefined,
    };

    onSave(memoryData);
  };

  const resetRecorder = () => {
    setMediaBlob(null);
    setMediaUrl('');
    setRecordingTime(0);
    setContent('');
    setTitle('');
    setDescription('');
    setTags([]);
    setCurrentTag('');
    setIsRecording(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Create New Memory</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Recording Type Selection */}
        <div className="flex gap-3 justify-center">
          {[
            { type: 'text', icon: FileText, label: 'Text' },
            { type: 'audio', icon: Mic, label: 'Audio' },
            { type: 'video', icon: Video, label: 'Video' },
            { type: 'image', icon: ImageIcon, label: 'Photo' },
          ].map(({ type, icon: Icon, label }) => (
            <Button
              key={type}
              variant={recordingType === type ? 'default' : 'outline'}
              className="flex flex-col gap-2 h-auto py-4 px-6"
              onClick={() => {
                setRecordingType(type as any);
                resetRecorder();
              }}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <Input
            placeholder="Memory title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg"
          />
          
          <Textarea
            placeholder="Describe this memory (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          {recordingType === 'text' && (
            <Textarea
              placeholder="Write your memory here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="min-h-[120px]"
            />
          )}

          {recordingType === 'audio' && (
            <div className="space-y-4">
              {!isRecording && !mediaUrl && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Click to start recording audio</p>
                  <Button onClick={startAudioRecording} className="bg-red-500 hover:bg-red-600">
                    <Mic className="w-4 h-4 mr-2" />
                    Start Recording
                  </Button>
                </div>
              )}

              {isRecording && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="font-medium text-red-700">Recording...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-red-500" />
                        <span className="font-mono text-red-700">{formatTime(recordingTime)}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button onClick={stopRecording} className="bg-red-500 hover:bg-red-600">
                        <Square className="w-4 h-4 mr-2" />
                        Stop Recording
                      </Button>
                    </div>

                    {/* Audio visualization */}
                    <div className="mt-4 space-y-2">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-1 bg-red-300 rounded-full"
                          style={{
                            width: `${Math.random() * 60 + 20}%`,
                            animation: 'pulse 0.5s ease-in-out infinite',
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {mediaUrl && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium">Audio Recording</span>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{formatTime(recordingTime)}</span>
                      </div>
                    </div>
                    
                    <audio controls className="w-full" src={mediaUrl} />
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={resetRecorder}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Re-record
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {recordingType === 'video' && (
            <div className="space-y-4">
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Video recording coming soon!</p>
                <Button disabled>
                  <Video className="w-4 h-4 mr-2" />
                  Record Video
                </Button>
              </div>
            </div>
          )}

          {recordingType === 'image' && (
            <div className="space-y-4">
              {!mediaUrl ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Upload a photo for this memory</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button asChild>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Camera className="w-4 h-4 mr-2" />
                      Upload Photo
                    </label>
                  </Button>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium">Photo</span>
                      <Button variant="outline" size="sm" onClick={resetRecorder}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                    
                    <img
                      src={mediaUrl}
                      alt="Memory preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add tags..."
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              className="flex-1"
            />
            <Button variant="outline" onClick={addTag}>
              Add
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Badge key={tag} variant="secondary" className="cursor-pointer">
                #{tag}
                <X 
                  className="w-3 h-3 ml-1 hover:text-red-500" 
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Save Memory
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}