'use client';

import { useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  Mic,
  Type,
  Video,
  Upload,
  X,
  Loader2,
  Sparkles,
  Heart,
  Target,
  Gift,
  Eye,
  EyeOff,
  ChevronRight
} from 'lucide-react';

const memorySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['text', 'audio', 'video', 'image']),
  memory_type: z.enum(['kindness', 'storybook', 'general']).optional(),
  tags: z.array(z.string()).optional(),
  is_private: z.boolean().optional(),
});

type MemoryFormData = z.infer<typeof memorySchema>;

interface MemoryRecordingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MemoryRecordingModal({ open, onOpenChange }: MemoryRecordingModalProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'type' | 'capture' | 'details' | 'review'>('type');
  const [selectedType, setSelectedType] = useState<'text' | 'audio' | 'video' | 'image'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);

  const memoryTypes = [
    {
      id: 'text' as const,
      label: 'Text Memory',
      icon: Type,
      description: 'Write about a special moment',
      color: 'bg-blue-100 text-blue-600 border-blue-200'
    },
    {
      id: 'audio' as const,
      label: 'Voice Recording',
      icon: Mic,
      description: 'Record your thoughts',
      color: 'bg-green-100 text-green-600 border-green-200'
    },
    {
      id: 'image' as const,
      label: 'Photo Memory',
      icon: Camera,
      description: 'Capture a visual memory',
      color: 'bg-purple-100 text-purple-600 border-purple-200'
    },
    {
      id: 'video' as const,
      label: 'Video Memory',
      icon: Video,
      description: 'Record a video moment',
      color: 'bg-orange-100 text-orange-600 border-orange-200'
    },
  ];

  const form = useForm<MemoryFormData>({
    resolver: zodResolver(memorySchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      type: 'text',
      memory_type: undefined,
      tags: [],
      is_private: false,
    },
  });

  // Memory creation mutation
  const createMemoryMutation = useMutation({
    mutationFn: async (data: MemoryFormData) => {
      const response = await axios.post('/api/memories', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: 'Memory Created! ✨',
        description: data.insights?.message || 'Your memory has been saved successfully.',
      });

      // Reset form and state
      form.reset();
      setCurrentStep('type');
      setSelectedType('text');
      setUploadedFile(null);
      setPreviewUrl(null);
      setIsRecording(false);
      setRecordingTime(0);
      setAiInsights(null);

      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error('Error creating memory:', error);
      toast({
        title: 'Error Creating Memory',
        description: error?.response?.data?.error || 'Failed to save memory. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // AI processing for content
  const processContentWithAI = useCallback(async (content: string) => {
    setIsProcessingAI(true);
    try {
      // Simulate AI processing (in production, this would call an AI service)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock AI insights
      const insights = {
        emotion: content.length > 50 ? 'positive' : 'neutral',
        keyThemes: ['connection', 'growth', 'family'],
        suggestedTitle: content.split('.')[0] || 'Captured Moment',
        recommendations: ['Add personal context', 'Consider sharing with partner'],
        confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
      };

      setAiInsights(insights);

      // Auto-fill title suggestion
      if (!form.getValues('title')) {
        form.setValue('title', insights.suggestedTitle);
      }

      // Auto-suggest memory type
      const suggestedType = content.toLowerCase().includes('kind') ? 'kindness' :
                           content.toLowerCase().includes('story') ? 'storybook' : 'general';
      form.setValue('memory_type', suggestedType);

    } catch (error) {
      console.error('AI processing error:', error);
      setAiInsights(null);
    } finally {
      setIsProcessingAI(false);
    }
  }, [form]);

  const handleTypeSelection = (type: 'text' | 'audio' | 'video' | 'image') => {
    setSelectedType(type);
    form.setValue('type', type);
    setCurrentStep('capture');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Auto-set content to filename or placeholder
    form.setValue('content', file.name);

    // Process with AI if it's text content
    if (selectedType === 'text') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        processContentWithAI(text);
      };
      reader.readAsText(file);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);

    // Start recording timer
    recordingTimer.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    // In production, this would start actual recording
    toast({
      title: 'Recording Started',
      description: 'Speak about your memory...',
    });
  };

  const stopRecording = () => {
    setIsRecording(false);

    if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
    }

    // In production, this would save the audio file
    form.setValue('content', `Audio recording (${recordingTime}s)`);

    toast({
      title: 'Recording Saved',
      description: `Recorded for ${recordingTime} seconds`,
    });
  };

  const onSubmit = (data: MemoryFormData) => {
    if (currentStep === 'capture' && aiInsights?.suggestedTitle) {
      // Move to details if we have AI suggestions
      setCurrentStep('details');
      return;
    }

    if (currentStep === 'details') {
      // Move to review
      setCurrentStep('review');
      return;
    }

    // Final submission
    createMemoryMutation.mutate(data);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'type':
        return (
          <div className="grid grid-cols-2 gap-4">
            {memoryTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeSelection(type.id)}
                className="p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-center"
              >
                <type.icon className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold text-gray-900 mb-1">{type.label}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </button>
            ))}
          </div>
        );

      case 'capture':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {selectedType === 'text' && <Type className="w-5 h-5" />}
                  {selectedType === 'audio' && <Mic className="w-5 h-5" />}
                  {selectedType === 'video' && <Video className="w-5 h-5" />}
                  {selectedType === 'image' && <Camera className="w-5 h-5" />}
                  Capture Your {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Memory
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedType === 'text' && (
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What happened?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share your memory here..."
                            className="min-h-[150px]"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              if (e.target.value.length > 10) {
                                processContentWithAI(e.target.value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {selectedType === 'audio' && (
                  <div className="text-center space-y-4">
                    {!isRecording ? (
                      <Button
                        size="lg"
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={startRecording}
                      >
                        <Mic className="w-5 h-5 mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-6xl animate-pulse">🎤</div>
                        <div className="text-2xl font-bold text-red-600">
                          {recordingTime} s
                        </div>
                        <Progress value={(recordingTime / 60) * 100} className="w-full" />
                        <Button
                          size="lg"
                          variant="destructive"
                          onClick={stopRecording}
                        >
                          Stop Recording
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {(selectedType === 'image' || selectedType === 'video') && (
                  <div className="text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={selectedType === 'image' ? 'image/*' : 'video/*'}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    {!uploadedFile ? (
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-32 w-32 rounded-full border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50"
                      >
                        <div className="flex flex-col items-center">
                          {selectedType === 'image' ? <Camera className="w-8 h-8" /> : <Video className="w-8 h-8" />}
                          <span className="mt-2">Upload</span>
                        </div>
                      </Button>
                    ) : (
                      <div className="relative">
                        {previewUrl && (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg mx-auto"
                          />
                        )}
                        <button
                          onClick={() => {
                            setUploadedFile(null);
                            setPreviewUrl(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {aiInsights && (
                  <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        AI Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Badge variant="outline" className="mr-2">
                        {aiInsights.emotion} emotion
                      </Badge>
                      {aiInsights.keyThemes.map((theme: string) => (
                        <Badge key={theme} variant="secondary" className="mr-1">
                          {theme}
                        </Badge>
                      ))}
                      <div className="text-sm text-gray-600 mt-2">
                        Suggested title: "{aiInsights.suggestedTitle}"
                      </div>
                    </CardContent>
                  </Card>
                )}

                {isProcessingAI && (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="ml-2">Processing with AI...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'details':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Memory Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Give your memory a title..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add more context..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="memory_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Memory Type</FormLabel>
                      <div className="flex gap-2 flex-wrap">
                        {[
                          { value: 'general', label: 'General', icon: Heart },
                          { value: 'kindness', label: 'Kindness', icon: Gift },
                          { value: 'storybook', label: 'Storybook', icon: Target },
                        ].map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => field.onChange(type.value)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                              field.value === type.value
                                ? 'bg-purple-500 text-white border-purple-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                            }`}
                          >
                            <type.icon className="w-4 h-4" />
                            {type.label}
                          </button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_private"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="flex items-center gap-2 cursor-pointer">
                          {field.value ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          Private Memory
                        </FormLabel>
                        <p className="text-sm text-gray-600">
                          Keep this memory private and don't share with your partner
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        );

      case 'review':
        const formData = form.getValues();
        return (
          <Card>
            <CardHeader>
              <CardTitle>Review Memory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">{formData.title}</h3>
                <p className="text-sm text-gray-600">{formData.description}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{formData.type}</Badge>
                  {formData.memory_type && (
                    <Badge variant="secondary">{formData.memory_type}</Badge>
                  )}
                  {formData.is_private && (
                    <Badge className="bg-gray-500">Private</Badge>
                  )}
                </div>
              </div>

              {aiInsights && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Insights
                  </h4>
                  <p className="text-sm text-green-700">
                    Based on analysis, this appears to be a {aiInsights.emotion} memory
                    focused on: {aiInsights.keyThemes.join(', ')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
            <Heart className="w-6 h-6" />
            Create Memory
          </DialogTitle>
          <p className="text-gray-600">Capture and preserve your cherished moments</p>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-4 py-4">
          {[
            { id: 'type', label: 'Choose Type' },
            { id: 'capture', label: 'Capture' },
            { id: 'details', label: 'Details' },
            { id: 'review', label: 'Review' },
          ].map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  (currentStep === step.id || ['type', 'capture', 'details'].includes(currentStep)) ||
                  (currentStep === 'review' && ['type', 'capture', 'details'].includes(step.id))
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              <span className="ml-2 text-sm hidden sm:block">{step.label}</span>
              {index < 3 && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
            </div>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {renderStepContent()}

            <DialogFooter className="gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              {currentStep !== 'type' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (currentStep === 'review') setCurrentStep('details');
                    else if (currentStep === 'details') setCurrentStep('capture');
                    else if (currentStep === 'capture') setCurrentStep('type');
                  }}
                >
                  Back
                </Button>
              )}

              <Button
                type="submit"
                disabled={createMemoryMutation.isPending}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {createMemoryMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </div>
                ) : currentStep === 'type' ? (
                  'Continue'
                ) : currentStep === 'capture' ? (
                  'Add Details'
                ) : currentStep === 'details' ? (
                  'Review'
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Create Memory
                  </div>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
