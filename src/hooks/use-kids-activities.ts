// Production-Ready Kids Activities State Management Hook
// Comprehensive state management with persistence, error handling, and optimization

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  KidsProfile, 
  BaseActivity, 
  ActivityResult, 
  UserProgress, 
  KindnessMoment, 
  StorybookEntry, 
  AppState, 
  LoadingState 
} from '@/types/kids-activities';
import { dataManager } from '@/services/data-manager';

// Custom Hook for Kids Activities State Management
export function useKidsActivities() {
  // Core State
  const [state, setState] = useState<AppState>(() => ({
    user: null,
    family: null,
    currentActivity: null,
    loading: {
      activities: false,
      profile: false,
      progress: false,
      family: false,
      storybook: false
    },
    errors: {},
    offline: !navigator.onLine,
    lastSync: null
  }));

  // Derived State
  const [activities, setActivities] = useState<BaseActivity[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [kindnessMoments, setKindnessMoments] = useState<KindnessMoment[]>([]);
  const [storybookEntries, setStorybookEntries] = useState<StorybookEntry[]>([]);
  
  // UI State
  const [celebrationEmoji, setCelebrationEmoji] = useState('🎉');
  const [showFloatingEmoji, setShowFloatingEmoji] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState('activities');

  // Refs for cleanup
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mounted = useRef(true);

  // Helper function to update loading state
  const setLoading = useCallback((key: keyof LoadingState, value: boolean) => {
    setState(prev => ({
      ...prev,
      loading: {
        ...prev.loading,
        [key]: value
      }
    }));
  }, []);

  // Helper function to set errors
  const setError = useCallback((key: string, error: string | null) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [key]: error || undefined
      }
    }));
  }, []);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading('profile', true);
        setLoading('activities', true);
        setLoading('progress', true);
        
        // Load profile
        const profile = await dataManager.getProfile();
        if (mounted.current) {
          setState(prev => ({ ...prev, user: profile }));
        }

        // Load activities
        const activitiesData = await dataManager.getActivities();
        if (mounted.current) {
          setActivities(activitiesData);
        }

        // Load progress
        const progressData = await dataManager.getProgress();
        if (mounted.current) {
          setProgress(progressData);
        }

        // Load kindness moments
        const kindnessData = await dataManager.getKindnessMoments();
        if (mounted.current) {
          setKindnessMoments(kindnessData);
        }

        // Load storybook entries
        const storybookData = await dataManager.getStorybookEntries();
        if (mounted.current) {
          setStorybookEntries(storybookData);
        }

        // Clear any initialization errors
        setError('initialization', null);
      } catch (error) {
        console.error('Failed to initialize data:', error);
        setError('initialization', 'Failed to load data. Please try again.');
      } finally {
        if (mounted.current) {
          setLoading('profile', false);
          setLoading('activities', false);
          setLoading('progress', false);
        }
      }
    };

    initializeData();

    // Set up periodic sync
    syncIntervalRef.current = setInterval(async () => {
      try {
        await dataManager.syncOfflineActions();
        setState(prev => ({ ...prev, lastSync: new Date() }));
      } catch (error) {
        console.warn('Sync failed:', error);
      }
    }, 30000); // Sync every 30 seconds

    // Cleanup on unmount
    return () => {
      mounted.current = false;
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [setLoading, setError]);

  // Online/Offline status
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, offline: false }));
      // Trigger sync when coming back online
      dataManager.syncOfflineActions();
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, offline: true }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Profile Management
  const updateProfile = useCallback(async (updates: Partial<KidsProfile>) => {
    try {
      setLoading('profile', true);
      setError('profile', null);

      const success = await dataManager.updateProfile(updates);
      if (success) {
        const updatedProfile = await dataManager.getProfile();
        setState(prev => ({ ...prev, user: updatedProfile }));
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      setError('profile', 'Failed to update profile. Please try again.');
    } finally {
      setLoading('profile', false);
    }
  }, [setLoading, setError]);

  // Activity Management
  const startActivity = useCallback((activity: BaseActivity) => {
    setState(prev => ({ ...prev, currentActivity: activity }));
    setError('activity', null);
  }, [setError]);

  const completeActivity = useCallback(async (
    activityId: string, 
    result: Partial<ActivityResult>
  ) => {
    try {
      const success = await dataManager.completeActivity(activityId, result);
      if (success) {
        // Update progress
        if (progress) {
          const updatedProgress = {
            ...progress,
            totalActivitiesCompleted: progress.totalActivitiesCompleted + 1
          };
          setProgress(updatedProgress);
          await dataManager.updateProgress(updatedProgress);
        }

        // Clear current activity
        setState(prev => ({ ...prev, currentActivity: null }));
        
        // Show celebration
        setCelebrationEmoji('🎉');
        setShowFloatingEmoji(true);
        setShowConfetti(true);
        
        setTimeout(() => {
          setShowFloatingEmoji(false);
          setShowConfetti(false);
        }, 3000);

        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to complete activity:', error);
      setError('activity', 'Failed to save activity completion.');
      return false;
    }
  }, [progress, setError]);

  // Kindness Management
  const addKindnessMoment = useCallback(async (
    description: string, 
    category: string, 
    points: number = 5
  ) => {
    try {
      const moment = await dataManager.addKindnessMoment({
        userId: state.user?.id || 'current',
        date: new Date(),
        description,
        category,
        points,
        verified: true,
        impact: 'Positive contribution to family/community',
        reflection: 'I felt good helping others'
      });

      if (moment) {
        setKindnessMoments(prev => [...prev, moment]);
        
        // Update progress
        if (progress) {
          const updatedProgress = {
            ...progress,
            kindnessPoints: progress.kindnessPoints + points
          };
          setProgress(updatedProgress);
          await dataManager.updateProgress(updatedProgress);
        }

        // Show celebration
        setCelebrationEmoji('💖');
        setShowFloatingEmoji(true);
        
        setTimeout(() => setShowFloatingEmoji(false), 2000);
        
        return moment;
      }
      return null;
    } catch (error) {
      console.error('Failed to add kindness moment:', error);
      setError('kindness', 'Failed to record kindness moment.');
      return null;
    }
  }, [state.user?.id, progress, setError]);

  // Storybook Management
  const addStorybookEntry = useCallback(async (
    title: string,
    description: string,
    type: 'activity' | 'milestone' | 'memory' | 'learning',
    participants: string[] = ['Child', 'Family']
  ) => {
    try {
      const entry = await dataManager.addStorybookEntry({
        date: new Date(),
        title,
        description,
        type,
        participants,
        media: [],
        tags: [type],
        mood: 'happy'
      });

      if (entry) {
        setStorybookEntries(prev => [...prev, entry]);
        
        // Show celebration
        setCelebrationEmoji('📚');
        setShowFloatingEmoji(true);
        setShowConfetti(true);
        
        setTimeout(() => {
          setShowFloatingEmoji(false);
          setShowConfetti(false);
        }, 3000);
        
        return entry;
      }
      return null;
    } catch (error) {
      console.error('Failed to add storybook entry:', error);
      setError('storybook', 'Failed to add memory to storybook.');
      return null;
    }
  }, [setError]);

  // Celebration Helpers
  const triggerCelebration = useCallback((
    emoji: string = '🎉', 
    showConfettiEffect: boolean = false,
    duration: number = 2000
  ) => {
    setCelebrationEmoji(emoji);
    setShowFloatingEmoji(true);
    if (showConfettiEffect) {
      setShowConfetti(true);
    }
    
    setTimeout(() => {
      setShowFloatingEmoji(false);
      if (showConfettiEffect) {
        setShowConfetti(false);
      }
    }, duration);
  }, []);

  // Progress Helpers
  const calculateKindnessLevel = useCallback(() => {
    const totalPoints = kindnessMoments.reduce((sum, moment) => sum + moment.points, 0);
    return Math.floor(totalPoints / 10) + 1; // Level up every 10 points
  }, [kindnessMoments]);

  const getWeeklyStats = useCallback(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyKindness = kindnessMoments.filter(
      moment => new Date(moment.date) > oneWeekAgo
    );
    
    const weeklyEntries = storybookEntries.filter(
      entry => new Date(entry.date) > oneWeekAgo
    );

    return {
      kindnessActions: weeklyKindness.length,
      kindnessPoints: weeklyKindness.reduce((sum, moment) => sum + moment.points, 0),
      memoriesCreated: weeklyEntries.length,
      activitiesCompleted: progress?.totalActivitiesCompleted || 0 // This would need more detailed tracking
    };
  }, [kindnessMoments, storybookEntries, progress]);

  // Data Management
  const exportData = useCallback(async () => {
    try {
      const data = await dataManager.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kids-activities-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      setError('export', 'Failed to export data.');
    }
  }, [setError]);

  const clearAllData = useCallback(async () => {
    try {
      await dataManager.cleanup();
      
      // Reset state
      setState({
        user: null,
        family: null,
        currentActivity: null,
        loading: {
          activities: false,
          profile: false,
          progress: false,
          family: false,
          storybook: false
        },
        errors: {},
        offline: !navigator.onLine,
        lastSync: null
      });
      
      setActivities([]);
      setProgress(null);
      setKindnessMoments([]);
      setStorybookEntries([]);
      
    } catch (error) {
      console.error('Failed to clear data:', error);
      setError('clear', 'Failed to clear data.');
    }
  }, [setError]);

  // Return comprehensive API
  return {
    // Core State
    state,
    activities,
    progress,
    kindnessMoments,
    storybookEntries,
    
    // UI State
    celebrationEmoji,
    showFloatingEmoji,
    showConfetti,
    activeTab,
    setActiveTab,
    
    // Profile Management
    updateProfile,
    
    // Activity Management
    startActivity,
    completeActivity,
    
    // Kindness Management
    addKindnessMoment,
    
    // Storybook Management
    addStorybookEntry,
    
    // Celebration Management
    triggerCelebration,
    setCelebrationEmoji,
    setShowFloatingEmoji,
    setShowConfetti,
    
    // Progress & Analytics
    calculateKindnessLevel,
    getWeeklyStats,
    
    // Data Management
    exportData,
    clearAllData,
    
    // Helper Properties
    isLoading: Object.values(state.loading).some(Boolean),
    hasErrors: Object.keys(state.errors).length > 0,
    isOffline: state.offline,
    totalKindnessPoints: kindnessMoments.reduce((sum, moment) => sum + moment.points, 0),
    totalMemories: storybookEntries.length,
    kindnessLevel: calculateKindnessLevel(),
    weeklyStats: getWeeklyStats()
  };
}

// Specialized hooks for specific features
export function useKindnessTracking() {
  const { kindnessMoments, addKindnessMoment, totalKindnessPoints, kindnessLevel } = useKidsActivities();
  
  return {
    moments: kindnessMoments,
    addMoment: addKindnessMoment,
    totalPoints: totalKindnessPoints,
    level: kindnessLevel,
    progress: (totalKindnessPoints % 10) / 10 * 100 // Progress to next level
  };
}

export function useStorybookTracking() {
  const { storybookEntries, addStorybookEntry, totalMemories } = useKidsActivities();
  
  return {
    entries: storybookEntries,
    addEntry: addStorybookEntry,
    totalMemories,
    recentEntries: storybookEntries.slice(-5) // Last 5 entries
  };
}

export function useActivityProgress() {
  const { progress, activities, completeActivity } = useKidsActivities();
  
  return {
    progress,
    activities,
    completeActivity,
    completionRate: progress ? (progress.totalActivitiesCompleted / activities.length) * 100 : 0
  };
}