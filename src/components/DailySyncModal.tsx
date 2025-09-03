'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Heart, Battery, MessageSquare, Sparkles, TrendingUp, Target, Zap } from 'lucide-react';

const syncSchema = z.object({
  mood_score: z.number().min(1).max(5),
  energy_level: z.number().min(1).max(10),
  mood_tags: z.array(z.string()).optional(),
  context_notes: z.string().optional(),
  sync_with_partner: z.boolean().optional(),
});

type SyncFormData = z.infer<typeof syncSchema>;

interface DailySyncModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DailySyncModal({ open, onOpenChange }: DailySyncModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [partnerSyncStatus, setPartnerSyncStatus] = useState<'pending' | 'completed' | 'none'>('none');

  const form = useForm<SyncFormData>({
    resolver: zodResolver(syncSchema),
    defaultValues: {
      mood_score: 3,
      energy_level: 5,
      mood_tags: [],
      context_notes: '',
      sync_with_partner: false,
    },
  });

  // Mood score options with emojis
  const moodOptions = [
    { value: 1, emoji: '😔', label: 'Very Low', description: 'Feeling down', color: 'text-red-500' },
    { value: 2, emoji: '😐', label: 'Low', description: 'A bit off', color: 'text-orange-500' },
    { value: 3, emoji: '🙂', label: 'Okay', description: 'Just fine', color: 'text-yellow-500' },
    { value: 4, emoji: '😊', label: 'Good', description: 'Feeling good', color: 'text-green-500' },
    { value: 5, emoji: '😃', label: 'Excellent', description: 'Amazing day', color: 'text-purple-500' },
  ];

  // Available mood tags
  const availableMoodTags = [
    'happy', 'excited', 'stressed', 'tired', 'peaceful', 'anxious',
    'loved', 'motivated', 'grateful', 'overwhelmed', 'content', 'hopeful',
    'frustrated', 'relaxed', 'optimistic', 'worried', 'blessed', 'confused'
  ];

  // Fetch sync history for statistics
  const { data: syncHistory } = useQuery({
    queryKey: ['sync-history'],
    queryFn: async () => {
      const response = await axios.get('/api/sync');
      return response.data;
    },
    enabled: open,
  });

  // Create sync mutation
  const createSyncMutation = useMutation({
    mutationFn: async (data: SyncFormData) => {
      const response = await axios.post('/api/sync', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch sync data
      queryClient.invalidateQueries({ queryKey: ['sync-history'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });

      toast({
        title: 'Daily Sync Completed! 🎉',
        description: `Mood: ${data.mood_score}/5, Energy: ${data.energy_level}/10`,
      });

      // Simulate partner sync if requested
      if (form.watch('sync_with_partner')) {
        setTimeout(() => {
          setPartnerSyncStatus('completed');
          toast({
            title: 'Partner Notification Sent! 💕',
            description: 'Your partner has been notified of your sync',
          });
        }, 1500);
        setPartnerSyncStatus('pending');
      }

      // Reset form and close modal
      form.reset();
      setTimeout(() => {
        onOpenChange(false);
        setPartnerSyncStatus('none');
      }, 3000);
    },
    onError: (error: any) => {
      console.error('Error creating sync:', error);

      const errorMessage = error?.response?.data?.error || 'Failed to sync';
      const validationErrors = error?.response?.data?.details;

      if (validationErrors) {
        Object.entries(validationErrors).forEach(([field, messages]) => {
          form.setError(field as keyof SyncFormData, {
            message: Array.isArray(messages) ? messages[0].message : messages,
          });
        });
      } else {
        toast({
          title: 'Sync Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    },
  });

  const toggleMoodTag = (tag: string) => {
    const currentTags = form.getValues('mood_tags') || [];
    if (currentTags.includes(tag)) {
      form.setValue('mood_tags', currentTags.filter(t => t !== tag));
    } else {
      form.setValue('mood_tags', [...currentTags, tag]);
    }
  };

  const onSubmit = (data: SyncFormData) => {
    createSyncMutation.mutate(data);
  };

  const currentMood = moodOptions.find(option => option.value === form.watch('mood_score'));
  const selectedTags = form.watch('mood_tags') || [];

  // Calculate mood improvement trend
  const recentMoodTrend = syncHistory?.syncs?.[0]?.mood_score || 0;
  const currentMoodScore = form.watch('mood_score');
  const moodChange = currentMoodScore - recentMoodTrend;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            Daily Sync
          </DialogTitle>
          <p className="text-gray-600">
            Share your emotional state and connect with your partner 💕
          </p>
        </DialogHeader>

        {(syncHistory?.stats && syncHistory.stats.totalSyncs > 0) && (
          <Card className="mb-4 border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-md flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Your Sync Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Average Mood</p>
                  <p className="font-bold text-blue-600">{syncHistory.stats.averageMood}/5</p>
                </div>
                <div>
                  <p className="text-gray-600">Energy Level</p>
                  <p className="font-bold text-purple-600">{syncHistory.stats.averageEnergy}/10</p>
                </div>
                <div>
                  <p className="text-gray-600">Sync Frequency</p>
                  <Badge variant="outline" className={`text-xs ${
                    syncHistory.stats.syncFrequency === 'Excellent' ? 'border-green-400 text-green-700' :
                    syncHistory.stats.syncFrequency === 'Good' ? 'border-blue-400 text-blue-700' :
                    syncHistory.stats.syncFrequency === 'Fair' ? 'border-yellow-400 text-yellow-700' :
                    'border-red-400 text-red-700'
                  }`}>
                    {syncHistory.stats.syncFrequency}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-600">Current Streak</p>
                  <p className="font-bold text-orange-600 flex items-center gap-1">
                    {syncHistory.stats.streak} days 🔥
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Mood Score Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  How are you feeling today?
                </CardTitle>
                {moodChange !== 0 && (
                  <p className="text-sm text-gray-600">
                    {moodChange > 0 ? '📈' : '📉'}
                    {Math.abs(moodChange)} point {moodChange > 0 ? 'improvement' : 'decline'} from yesterday
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="mood_score"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-5 gap-3">
                        {moodOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => field.onChange(option.value)}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                              field.value === option.value
                                ? 'border-purple-400 bg-purple-50 shadow-lg'
                                : 'border-gray-200 bg-white hover:border-purple-200'
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-4xl mb-2">{option.emoji}</div>
                              <div className="font-semibold">{option.label}</div>
                              <div className="text-xs text-gray-600">{option.description}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Energy Level Slider */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Battery className="w-5 h-5 text-green-500" />
                  What's your energy level?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="energy_level"
                  render={({ field }) => (
                    <FormItem>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Low Energy</span>
                          <span className="font-bold text-lg text-green-600 flex items-center gap-1">
                            {field.value}/10
                            {field.value >= 8 ? '⚡' : field.value >= 6 ? '🔋' : '🪫'}
                          </span>
                          <span>High Energy</span>
                        </div>
                        <Slider
                          min={1}
                          max={10}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="w-full"
                        />
                        <div className="text-center text-sm">
                          {field.value <= 3 ? 'Feeling drained today' :
                           field.value <= 7 ? 'Moderate energy levels' :
                           'Ready to conquer the world!'}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Mood Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  What emotions are you feeling? (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="mood_tags"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {availableMoodTags.slice(0, 12).map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleMoodTag(tag)}
                            className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
                              selectedTags.includes(tag)
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        Selected: {selectedTags.map(tag => tag).join(', ') || 'None'}
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Context Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-500" />
                  Context Notes (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="context_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Any particular reason for how you're feeling today? Work stress, family events, health, etc."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Partner Sync */}
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="sync_with_partner"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium cursor-pointer">
                          <div className="flex items-center gap-2">
                            💕 Notify Partner
                            <span className="text-xs text-gray-500">
                              Send your sync to help them understand your mood better
                            </span>
                          </div>
                        </FormLabel>
                        {/* Partner sync status */}
                        {partnerSyncStatus === 'pending' && (
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Notifying partner...
                          </div>
                        )}
                        {partnerSyncStatus === 'completed' && (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            ✓ Partner notified successfully
                          </div>
                        )}
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={createSyncMutation.isPending || partnerSyncStatus === 'pending'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white min-w-[120px]"
              >
                {createSyncMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : partnerSyncStatus === 'pending' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Notifying...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Complete Sync
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
