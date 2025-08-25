// Production-Ready Data Services
// Comprehensive state management, API integration, and persistent storage

import { 
  KidsProfile, 
  BaseActivity, 
  ActivityResult, 
  FamilyGroup, 
  StorybookEntry, 
  UserProgress,
  KindnessMoment,
  EmotionScenario,
  MythologyContent,
  CreativeActivity,
  APIResponse,
  AppState,
  LoadingState
} from '@/types/kids-activities';

// Local Storage Keys
const STORAGE_KEYS = {
  USER_PROFILE: 'kids_activities_profile',
  FAMILY_DATA: 'kids_activities_family',
  PROGRESS: 'kids_activities_progress',
  SETTINGS: 'kids_activities_settings',
  OFFLINE_QUEUE: 'kids_activities_offline_queue',
  LAST_SYNC: 'kids_activities_last_sync',
  STORYBOOK: 'kids_activities_storybook',
  KINDNESS_MOMENTS: 'kids_activities_kindness',
  ACHIEVEMENTS: 'kids_activities_achievements'
} as const;

// API Endpoints
const API_ENDPOINTS = {
  PROFILE: '/api/kids/profile',
  ACTIVITIES: '/api/kids/activities',
  PROGRESS: '/api/kids/progress',
  FAMILY: '/api/kids/family',
  STORYBOOK: '/api/kids/storybook',
  ACHIEVEMENTS: '/api/kids/achievements',
  SYNC: '/api/kids/sync'
} as const;

// Error Types
export class KidsActivityError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'KidsActivityError';
  }
}

// Local Storage Service
export class LocalStorageService {
  private static instance: LocalStorageService;

  static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  private isAvailable(): boolean {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  set<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) return false;
    
    try {
      const serialized = JSON.stringify({
        data: value,
        timestamp: Date.now(),
        version: '1.0'
      });
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('LocalStorage set error:', error);
      return false;
    }
  }

  get<T>(key: string): T | null {
    if (!this.isAvailable()) return null;
    
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      return parsed.data;
    } catch (error) {
      console.error('LocalStorage get error:', error);
      return null;
    }
  }

  remove(key: string): boolean {
    if (!this.isAvailable()) return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('LocalStorage remove error:', error);
      return false;
    }
  }

  clear(): boolean {
    if (!this.isAvailable()) return false;
    
    try {
      // Only clear our app's keys
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('LocalStorage clear error:', error);
      return false;
    }
  }

  getStorageInfo(): { used: number; available: number; percentage: number } {
    if (!this.isAvailable()) {
      return { used: 0, available: 0, percentage: 0 };
    }

    let used = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) used += item.length;
    });

    // Estimate available space (most browsers allow ~5-10MB)
    const estimated = 5 * 1024 * 1024; // 5MB in bytes
    const percentage = (used / estimated) * 100;

    return {
      used,
      available: estimated - used,
      percentage: Math.min(percentage, 100)
    };
  }
}

// API Service
export class APIService {
  private baseURL: string;
  private retryAttempts: number;
  private retryDelay: number;

  constructor(baseURL = '', retryAttempts = 3, retryDelay = 1000) {
    this.baseURL = baseURL;
    this.retryAttempts = retryAttempts;
    this.retryDelay = retryDelay;
  }

  private async retry<T>(
    fn: () => Promise<T>,
    attempts: number = this.retryAttempts
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (attempts > 1) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.retry(fn, attempts - 1);
      }
      throw error;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    return this.retry(async () => {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new KidsActivityError(
          `API Error: ${response.statusText}`,
          `HTTP_${response.status}`,
          { url, status: response.status }
        );
      }

      const data = await response.json();
      return {
        success: true,
        data,
        timestamp: new Date()
      };
    });
  }

  async getProfile(userId: string): Promise<APIResponse<KidsProfile>> {
    return this.request(`${API_ENDPOINTS.PROFILE}/${userId}`);
  }

  async updateProfile(profile: Partial<KidsProfile>): Promise<APIResponse<KidsProfile>> {
    return this.request(API_ENDPOINTS.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(profile)
    });
  }

  async getActivities(filters?: any): Promise<APIResponse<BaseActivity[]>> {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.request(`${API_ENDPOINTS.ACTIVITIES}${queryParams}`);
  }

  async submitActivityResult(result: ActivityResult): Promise<APIResponse<void>> {
    return this.request(`${API_ENDPOINTS.ACTIVITIES}/result`, {
      method: 'POST',
      body: JSON.stringify(result)
    });
  }

  async getProgress(userId: string): Promise<APIResponse<UserProgress>> {
    return this.request(`${API_ENDPOINTS.PROGRESS}/${userId}`);
  }

  async getFamilyData(familyId: string): Promise<APIResponse<FamilyGroup>> {
    return this.request(`${API_ENDPOINTS.FAMILY}/${familyId}`);
  }

  async addStorybookEntry(entry: Omit<StorybookEntry, 'id'>): Promise<APIResponse<StorybookEntry>> {
    return this.request(API_ENDPOINTS.STORYBOOK, {
      method: 'POST',
      body: JSON.stringify(entry)
    });
  }

  async syncData(lastSyncTime?: Date): Promise<APIResponse<any>> {
    const queryParams = lastSyncTime ? `since=${lastSyncTime.toISOString()}` : '';
    return this.request(`${API_ENDPOINTS.SYNC}${queryParams ? '?' + queryParams : ''}`);
  }
}

// Data Manager - Central data coordination
export class DataManager {
  private storage: LocalStorageService;
  private api: APIService;
  private offlineQueue: any[];
  private syncInProgress: boolean;

  constructor() {
    this.storage = LocalStorageService.getInstance();
    this.api = new APIService();
    this.offlineQueue = this.storage.get(STORAGE_KEYS.OFFLINE_QUEUE) || [];
    this.syncInProgress = false;
  }

  // Profile Management
  async getProfile(): Promise<KidsProfile | null> {
    // Try local first
    let profile = this.storage.get<KidsProfile>(STORAGE_KEYS.USER_PROFILE);
    
    if (!profile) {
      try {
        // Fallback to API if online
        const response = await this.api.getProfile('current');
        if (response.success && response.data) {
          profile = response.data;
          this.storage.set(STORAGE_KEYS.USER_PROFILE, profile);
        }
      } catch (error) {
        console.warn('Failed to fetch profile from API:', error);
      }
    }

    return profile;
  }

  async updateProfile(updates: Partial<KidsProfile>): Promise<boolean> {
    try {
      const currentProfile = await this.getProfile();
      if (!currentProfile) return false;

      const updatedProfile = { ...currentProfile, ...updates, updatedAt: new Date() };
      
      // Update local storage immediately
      this.storage.set(STORAGE_KEYS.USER_PROFILE, updatedProfile);
      
      // Queue for API sync
      this.queueAction('updateProfile', updatedProfile);
      
      return true;
    } catch (error) {
      console.error('Failed to update profile:', error);
      return false;
    }
  }

  // Activity Management
  async getActivities(): Promise<BaseActivity[]> {
    // Return mock data for now - in production this would fetch from API/storage
    return this.generateMockActivities();
  }

  async completeActivity(activityId: string, result: Partial<ActivityResult>): Promise<boolean> {
    try {
      const fullResult: ActivityResult = {
        activityId,
        userId: 'current', // Would be actual user ID
        startTime: new Date(),
        endTime: new Date(),
        completed: true,
        ...result
      };

      // Store locally
      const results = this.storage.get<ActivityResult[]>('activity_results') || [];
      results.push(fullResult);
      this.storage.set('activity_results', results);

      // Queue for API sync
      this.queueAction('submitActivityResult', fullResult);

      return true;
    } catch (error) {
      console.error('Failed to complete activity:', error);
      return false;
    }
  }

  // Progress Tracking
  async getProgress(): Promise<UserProgress> {
    const stored = this.storage.get<UserProgress>(STORAGE_KEYS.PROGRESS);
    if (stored) return stored;

    // Generate initial progress
    const initialProgress: UserProgress = {
      totalActivitiesCompleted: 0,
      skillsAcquired: [],
      currentStreak: 0,
      longestStreak: 0,
      kindnessPoints: 0,
      creativityScore: 0,
      emotionalIntelligenceLevel: 1,
      weeklyGoals: [],
      monthlyMilestones: [],
      learningPath: {
        currentLevel: 1,
        nextMilestone: {
          id: '1',
          title: 'First Steps',
          description: 'Complete your first activity',
          achieved: false
        },
        recommendedActivities: [],
        weakAreas: [],
        strengthAreas: [],
        adaptiveContent: true
      }
    };

    this.storage.set(STORAGE_KEYS.PROGRESS, initialProgress);
    return initialProgress;
  }

  async updateProgress(updates: Partial<UserProgress>): Promise<boolean> {
    try {
      const currentProgress = await this.getProgress();
      const updatedProgress = { ...currentProgress, ...updates };
      
      this.storage.set(STORAGE_KEYS.PROGRESS, updatedProgress);
      this.queueAction('updateProgress', updatedProgress);
      
      return true;
    } catch (error) {
      console.error('Failed to update progress:', error);
      return false;
    }
  }

  // Kindness Moments
  async addKindnessMoment(moment: Omit<KindnessMoment, 'id'>): Promise<KindnessMoment | null> {
    try {
      const newMoment: KindnessMoment = {
        ...moment,
        id: `kindness_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const moments = this.storage.get<KindnessMoment[]>(STORAGE_KEYS.KINDNESS_MOMENTS) || [];
      moments.push(newMoment);
      this.storage.set(STORAGE_KEYS.KINDNESS_MOMENTS, moments);

      // Update progress
      const progress = await this.getProgress();
      await this.updateProgress({
        kindnessPoints: progress.kindnessPoints + moment.points
      });

      this.queueAction('addKindnessMoment', newMoment);
      return newMoment;
    } catch (error) {
      console.error('Failed to add kindness moment:', error);
      return null;
    }
  }

  async getKindnessMoments(): Promise<KindnessMoment[]> {
    return this.storage.get<KindnessMoment[]>(STORAGE_KEYS.KINDNESS_MOMENTS) || [];
  }

  // Storybook Management
  async addStorybookEntry(entry: Omit<StorybookEntry, 'id'>): Promise<StorybookEntry | null> {
    try {
      const newEntry: StorybookEntry = {
        ...entry,
        id: `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const storybook = this.storage.get<StorybookEntry[]>(STORAGE_KEYS.STORYBOOK) || [];
      storybook.push(newEntry);
      this.storage.set(STORAGE_KEYS.STORYBOOK, storybook);

      this.queueAction('addStorybookEntry', newEntry);
      return newEntry;
    } catch (error) {
      console.error('Failed to add storybook entry:', error);
      return null;
    }
  }

  async getStorybookEntries(): Promise<StorybookEntry[]> {
    return this.storage.get<StorybookEntry[]>(STORAGE_KEYS.STORYBOOK) || [];
  }

  // Offline Support
  private queueAction(action: string, data: any): void {
    this.offlineQueue.push({
      action,
      data,
      timestamp: Date.now(),
      id: `${action}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
    this.storage.set(STORAGE_KEYS.OFFLINE_QUEUE, this.offlineQueue);
  }

  async syncOfflineActions(): Promise<boolean> {
    if (this.syncInProgress || this.offlineQueue.length === 0) {
      return true;
    }

    this.syncInProgress = true;

    try {
      const successfulActions: string[] = [];
      
      for (const queuedAction of this.offlineQueue) {
        try {
          switch (queuedAction.action) {
            case 'updateProfile':
              await this.api.updateProfile(queuedAction.data);
              break;
            case 'submitActivityResult':
              await this.api.submitActivityResult(queuedAction.data);
              break;
            case 'addStorybookEntry':
              await this.api.addStorybookEntry(queuedAction.data);
              break;
            // Add more action handlers as needed
          }
          successfulActions.push(queuedAction.id);
        } catch (error) {
          console.warn(`Failed to sync action ${queuedAction.action}:`, error);
        }
      }

      // Remove successfully synced actions
      this.offlineQueue = this.offlineQueue.filter(
        action => !successfulActions.includes(action.id)
      );
      this.storage.set(STORAGE_KEYS.OFFLINE_QUEUE, this.offlineQueue);
      this.storage.set(STORAGE_KEYS.LAST_SYNC, new Date());

      return true;
    } catch (error) {
      console.error('Sync failed:', error);
      return false;
    } finally {
      this.syncInProgress = false;
    }
  }

  // Data Export/Import
  async exportData(): Promise<string> {
    const data = {
      profile: this.storage.get(STORAGE_KEYS.USER_PROFILE),
      progress: this.storage.get(STORAGE_KEYS.PROGRESS),
      kindness: this.storage.get(STORAGE_KEYS.KINDNESS_MOMENTS),
      storybook: this.storage.get(STORAGE_KEYS.STORYBOOK),
      settings: this.storage.get(STORAGE_KEYS.SETTINGS),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.profile) this.storage.set(STORAGE_KEYS.USER_PROFILE, data.profile);
      if (data.progress) this.storage.set(STORAGE_KEYS.PROGRESS, data.progress);
      if (data.kindness) this.storage.set(STORAGE_KEYS.KINDNESS_MOMENTS, data.kindness);
      if (data.storybook) this.storage.set(STORAGE_KEYS.STORYBOOK, data.storybook);
      if (data.settings) this.storage.set(STORAGE_KEYS.SETTINGS, data.settings);

      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // Cleanup and Maintenance
  async cleanup(): Promise<void> {
    const storageInfo = this.storage.getStorageInfo();
    
    // If storage is over 80% full, clean up old data
    if (storageInfo.percentage > 80) {
      const oldEntries = this.storage.get<StorybookEntry[]>(STORAGE_KEYS.STORYBOOK) || [];
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - 6); // Keep last 6 months
      
      const recentEntries = oldEntries.filter(entry => 
        new Date(entry.date) > cutoffDate
      );
      
      this.storage.set(STORAGE_KEYS.STORYBOOK, recentEntries);
    }
  }

  // Mock Data Generation (for development)
  private generateMockActivities(): BaseActivity[] {
    return [
      {
        id: 'emotion_1',
        title: 'The Happy Bunny',
        description: 'Help the bunny understand different emotions',
        type: 'emotion',
        difficulty: 'easy',
        ageRange: { min: 3, max: 6 },
        estimatedDuration: 10,
        tags: ['emotions', 'animals', 'empathy'],
        instructions: [
          {
            step: 1,
            title: 'Meet the Bunny',
            description: 'Look at the bunny and guess how it feels',
            interactionType: 'tap'
          }
        ],
        materials: [],
        learningObjectives: ['Emotion recognition', 'Empathy development'],
        accessibility: {
          screenReaderSupport: true,
          voiceNavigation: true,
          largeText: true,
          highContrast: true,
          reducedMotion: false,
          audioDescriptions: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'kindness_1',
        title: 'Helping Hands',
        description: 'Learn about helping others through simple acts',
        type: 'kindness',
        difficulty: 'easy',
        ageRange: { min: 4, max: 8 },
        estimatedDuration: 15,
        tags: ['kindness', 'helping', 'community'],
        instructions: [
          {
            step: 1,
            title: 'Find Someone to Help',
            description: 'Look around and find someone who needs help',
            interactionType: 'tap'
          }
        ],
        materials: [],
        learningObjectives: ['Kindness', 'Social awareness'],
        accessibility: {
          screenReaderSupport: true,
          voiceNavigation: true,
          largeText: true,
          highContrast: true,
          reducedMotion: false,
          audioDescriptions: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
}

// State Management Hook Helper
export const createInitialAppState = (): AppState => ({
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

// Export singleton instance
export const dataManager = new DataManager();