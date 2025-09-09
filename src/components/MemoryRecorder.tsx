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
  Trash2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { MEDIA_CONSTANTS, MEDIA_ERROR_CODES, MEDIA_MESSAGES } from '@/lib/config';

interface MemoryRecorderProps {
  coupleId?: string;
  onSuccess?: (memory: any) => void;
  onCancel: () => void;
}

export function MemoryRecorder({ coupleId, onSuccess, onCancel }: MemoryRecorderProps) {
  const [recordingType, setRecordingType] = useState<'text' | 'audio' | 'video' | 'image'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [isCameraMode, setIsCameraMode] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  // Initialize media upload hook
  const uploadHook = useMediaUpload({
    onSuccess: (data: any) => {
      toast({
        title: "Memory Saved! 🎉",
        description: "Your memory has been saved successfully",
        duration: 3000,
      });

      // Reset form
      resetRecorder();

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error: string, canRetry: boolean) => {
      toast({
        title: "Upload Error",
        description: error,
        variant: "destructive",
        duration: 5000,
      });

      if (canRetry) {
        toast({
          title: "Retry Available",
          description: "You can click Save again to retry the upload",
          duration: 3000,
        });
      }
    },
  });

  // Timer for recording with memory leak prevention
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          // Prevent excessive recording time (10 minutes max)
          const newTime = prev + 1;
          if (newTime > 600) { // 10 minutes * 60 seconds
            stopRecording();
            toast({
              title: "Recording Limit Reached",
              description: "Recording automatically stopped after 10 minutes",
              variant: "destructive",
            });
            return prev;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    // Cleanup on component unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Force cleanup of media streams and resources
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          try {
            track.stop();
          } catch (e) {
            console.warn('Error cleaning up media track:', e);
          }
        });
        streamRef.current = null;
      }

      // Clean up any blob URLs to prevent memory leaks
      if (mediaUrl && mediaUrl.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(mediaUrl);
        } catch (e) {
          console.warn('Error revoking object URL:', e);
        }
      }
    };
  }, [isRecording, recordingTime]);

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

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      streamRef.current = stream;

      // Set up video preview
      setMediaUrl(''); // Clear any previous recording

      toast({
        title: "Camera Ready 📹",
        description: "Click 'Record' to start capturing your video memory",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera and microphone access to record video memories",
        variant: "destructive",
      });
    }
  };

  const startRecording = () => {
    if (streamRef.current) {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm;codecs=vp9'
      });

      mediaRecorderRef.current = mediaRecorder;
      videoChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        videoChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        if (videoChunksRef.current.length > 0) {
          const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
          setMediaBlob(videoBlob);
          setMediaUrl(URL.createObjectURL(videoBlob));
        }

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      toast({
        title: "Recording Started 🎬",
        description: "Capturing your special memory...",
        duration: 2000,
      });
    }
  };

  const cancelVideoRecording = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsRecording(false);
    setRecordingTime(0);
    setMediaUrl('');
    setMediaBlob(null);

    toast({
      title: "Recording Cancelled ❌",
      description: "Video recording has been cancelled",
      duration: 2000,
    });
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

  const handleSave = async () => {
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

    // For text-only memories, handle directly without upload hook
    if (recordingType === 'text') {
      setIsSaving(true);

      try {
        const formData = new FormData();
        formData.append('type', recordingType);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('tags', JSON.stringify(tags));
        formData.append('sentiment', 'positive');
        formData.append('partners', JSON.stringify(['current_user']));
        formData.append('is_private', 'false');

        if (description) {
          formData.append('description', description);
        }

        if (coupleId) {
          formData.append('couple_id', coupleId);
        }

        const success = await uploadHook.uploadFile(
          new Blob(), // Empty blob for text-only
          '/api/memories',
          {
            type: recordingType,
            title,
            content,
            tags: JSON.stringify(tags),
            sentiment: 'positive',
            partners: JSON.stringify(['current_user']),
            is_private: 'false',
            description: description || '',
            couple_id: coupleId || '',
          }
        );

        if (!success) {
          throw new Error('Upload failed');
        }

      } catch (error) {
        console.error('Error saving text memory:', error);
        toast({
          title: "Error Saving Memory",
          description: error instanceof Error ? error.message : 'Failed to save memory',
          variant: "destructive",
          duration: 5000,
        });
        setIsSaving(false);
      }
      return;
    }

    // For media-based memories, use the upload hook
    if (mediaBlob) {
      // Validate media first
      const isValid = await uploadHook.validateMedia(mediaBlob);

      if (!isValid) {
        toast({
          title: "Invalid Media File",
          description: MEDIA_MESSAGES.ERROR[MEDIA_ERROR_CODES.INVALID_FILE_TYPE] || "The selected file is not supported",
          variant: "destructive",
        });
        return;
      }

      // Generate file with proper name and type
      const extension = recordingType === 'audio' ? 'wav' : recordingType === 'image' ? 'jpg' : 'webm';
      const fileName = `memory.${extension}`;

      const formData = {
        type: recordingType,
        title,
        tags: JSON.stringify(tags),
        sentiment: 'positive',
        partners: JSON.stringify(['current_user']),
        is_private: 'false',
        description: description || '',
        couple_id: coupleId || '',
      };

      await uploadHook.uploadFile(mediaBlob, '/api/memories', formData);
    }
  };

  const resetRecorder = () => {
    // Stop any active camera streams
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setMediaBlob(null);
    setMediaUrl('');
    setRecordingTime(0);
    setContent('');
    setTitle('');
    setDescription('');
    setTags([]);
    setCurrentTag('');
    setIsRecording(false);
    setIsCameraMode(false);
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
              {!isRecording && !mediaUrl && !streamRef.current && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Click to start video recording</p>
                  <Button onClick={startVideoRecording} className="bg-red-500 hover:bg-red-600">
                    <Video className="w-4 h-4 mr-2" />
                    Start Recording
                  </Button>
                </div>
              )}

              {streamRef.current && !mediaBlob && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium">Camera Preview</div>
                      </div>
                      {isRecording && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-red-500" />
                          <span className="font-mono text-red-700">{formatTime(recordingTime)}</span>
                        </div>
                      )}
                    </div>

                    <video
                      ref={(video) => {
                        if (video && streamRef.current) {
                          video.srcObject = streamRef.current;
                        }
                      }}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-64 bg-gray-100 rounded-lg mb-4"
                    />

                    <div className="flex justify-center gap-4">
                      {!isRecording ? (
                        <Button
                          onClick={() => startRecording()}
                          className="bg-red-500 hover:bg-red-600 px-6"
                        >
                          <Square className="w-4 h-4 mr-2" />
                          Record
                        </Button>
                      ) : (
                        <Button
                          onClick={stopRecording}
                          className="bg-red-600 hover:bg-red-700 px-6"
                        >
                          <Square className="w-4 h-4 mr-2" />
                          Stop
                        </Button>
                      )}

                      <Button
                        onClick={cancelVideoRecording}
                        variant="outline"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>

                    {isRecording && (
                      <div className="mt-4">
                        <div className="w-full bg-red-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-xs text-center text-red-600 mt-2">Recording in progress...</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {mediaUrl && recordingType === 'video' && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium">Video Recording</span>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{formatTime(recordingTime)}</span>
                      </div>
                    </div>

                    <video controls className="w-full h-64 bg-gray-100 rounded-lg mb-4" src={mediaUrl} />

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

          {recordingType === 'image' && (
            <div className="space-y-4">
              {!isCameraMode && !mediaUrl ? (
                <div className="space-y-4">
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Choose how to add your photo</p>
                    <div className="flex gap-3 justify-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button asChild variant="outline">
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Upload Photo
                        </label>
                      </Button>
                      <Button
                        onClick={async () => {
                          try {
                            const stream = await navigator.mediaDevices.getUserMedia({
                              video: { width: 1280, height: 720 }
                            });
                            streamRef.current = stream;
                            setIsCameraMode(true);
                            setMediaUrl(''); // Clear any existing media

                            toast({
                              title: "Camera Ready 📸",
                              description: "Smile! Let me snap your photo memory!",
                              duration: 3000,
                            });
                          } catch (error) {
                            toast({
                              title: "Camera Access Denied",
                              description: "Please allow camera access to take photos",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Take Photo
                      </Button>
                    </div>
                  </div>
                </div>
              ) : isCameraMode && !mediaBlob ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">Camera Preview</span>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <Button
                        onClick={() => {
                          if (streamRef.current) {
                            streamRef.current.getTracks().forEach(track => track.stop());
                            streamRef.current = null;
                          }
                          setIsCameraMode(false);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>

                    <video
                      ref={(video) => {
                        if (video && streamRef.current) {
                          video.srcObject = streamRef.current;
                          video.play();
                        }
                      }}
                      autoPlay
                      playsInline
                      className="w-full h-64 bg-gray-100 rounded-lg mb-4 object-cover"
                    />

                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={async () => {
                          const video = document.querySelector('video') as HTMLVideoElement;
                          if (video && streamRef.current) {
                            const canvas = document.createElement('canvas');
                            const context = canvas.getContext('2d')!;

                            // Use video dimensions
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;

                            // Draw the current video frame
                            context.drawImage(video, 0, 0);

                            // Convert to blob
                            canvas.toBlob((blob) => {
                              if (blob) {
                                setMediaBlob(blob);
                                setMediaUrl(URL.createObjectURL(blob));
                                setIsCameraMode(false);

                                // Stop camera stream
                                if (streamRef.current) {
                                  streamRef.current.getTracks().forEach(track => track.stop());
                                  streamRef.current = null;
                                }

                                toast({
                                  title: "Photo Taken! 📸",
                                  description: "Look at that beautiful memory!",
                                  duration: 3000,
                                });
                              }
                            }, 'image/jpeg', 0.9);
                          }
                        }}
                        className="bg-white text-black border-4 border-white rounded-full w-16 h-16 p-0 shadow-lg hover:scale-105 transform transition-all"
                      >
                        <Camera className="w-8 h-8" />
                      </Button>

                      <Button
                        onClick={() => {
                          // Stop camera and return to selection
                          if (streamRef.current) {
                            streamRef.current.getTracks().forEach(track => track.stop());
                            streamRef.current = null;
                          }
                          setIsCameraMode(false);
                        }}
                        variant="outline"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
          <Button onClick={handleSave} className="flex-1" disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Memory'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
