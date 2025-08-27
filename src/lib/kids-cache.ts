// Kids Activities Caching System
// Production-ready caching for activities, progress, and achievements

import { logger } from '@/lib/logger';

// Cache configuration
const CACHE_DURATION = {
  ACTIVITIES: 5 * 60 * 1000, // 5 minutes
  CHILD_PROGRESS: 2 * 60 * 1000, // 2 minutes
  ACHIEVEMENTS: 10 * 60 * 1000, // 10 minutes
  CHILD_PROFILE: 5 * 60 * 1000, // 5 minutes
  ACTIVITY_COMPLETIONS: 1 * 60 * 1000, // 1 minute
} as const;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expires: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  invalidations: number;
  memoryUsage: number;
  size: number;
  hitRate: number;
}

class KidsActivitiesCache {
  private cache = new Map<string, CacheEntry<any>>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    invalidations: 0,
    memoryUsage: 0,
    size: 0,
    hitRate: 0
  };

  // Generate cache keys (public for helper access)
  generateKey(prefix: string, identifier: string, params?: Record<string, any>): string {
    const baseKey = `${prefix}:${identifier}`;
    if (params) {
      const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');
      return `${baseKey}:${sortedParams}`;
    }
    return baseKey;
  }

  // Set cache entry with error handling
  set<T>(key: string, data: T, duration: number = CACHE_DURATION.ACTIVITIES): void {
    if (!key || key.length === 0) {
      logger.warn('Invalid cache key provided');
      return;
    }

    try {
      const now = Date.now();
      const entry: CacheEntry<T> = {
        data,
        timestamp: now,
        expires: duration === Infinity ? Infinity : now + duration
      };
      
      this.cache.set(key, entry);
      this.updateMemoryUsage();
      
      logger.debug('Cache entry set', { key, duration, expires: entry.expires });
    } catch (error) {
      logger.error('Error setting cache entry', { key, error });
    }
  }

  // Get cache entry with error handling
  get<T>(key: string): T | null {
    if (!key || key.length === 0) {
      this.stats.misses++;
      return null;
    }

    try {
      const entry = this.cache.get(key);
      
      if (!entry) {
        this.stats.misses++;
        logger.debug('Cache miss', { key });
        return null;
      }

      const now = Date.now();
      if (entry.expires !== Infinity && now > entry.expires) {
        this.cache.delete(key);
        this.stats.misses++;
        logger.debug('Cache expired', { key, expired: now - entry.expires });
        return null;
      }

      this.stats.hits++;
      logger.debug('Cache hit', { key, age: now - entry.timestamp });
      return entry.data;
    } catch (error) {
      logger.error('Error getting cache entry', { key, error });
      this.stats.misses++;
      return null;
    }
  }

  // Check if key exists
  has(key: string): boolean {
    if (!key) return false;
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    const now = Date.now();
    if (entry.expires !== Infinity && now > entry.expires) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // Delete specific key
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.updateMemoryUsage();
      this.stats.invalidations++;
    }
    return deleted;
  }

  // Get all cache keys (for maintenance operations)
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Cache activities
  cacheActivities(filters: Record<string, any>, activities: any[]): void {
    const key = this.generateKey('activities', 'list', filters);
    this.set(key, activities, CACHE_DURATION.ACTIVITIES);
  }

  // Get cached activities
  getCachedActivities(filters: Record<string, any>): any[] | null {
    const key = this.generateKey('activities', 'list', filters);
    return this.get(key);
  }

  // Cache child progress
  cacheChildProgress(childId: string, progress: any): void {
    const key = this.generateKey('progress', childId);
    this.set(key, progress, CACHE_DURATION.CHILD_PROGRESS);
  }

  // Get cached child progress
  getCachedChildProgress(childId: string): any | null {
    const key = this.generateKey('progress', childId);
    return this.get(key);
  }

  // Cache child achievements
  cacheChildAchievements(childId: string, achievements: any[]): void {
    const key = this.generateKey('achievements', childId);
    this.set(key, achievements, CACHE_DURATION.ACHIEVEMENTS);
  }

  // Get cached child achievements
  getCachedChildAchievements(childId: string): any[] | null {
    const key = this.generateKey('achievements', childId);
    return this.get(key);
  }

  // Cache child profile
  cacheChildProfile(childId: string, profile: any): void {
    const key = this.generateKey('profile', childId);
    this.set(key, profile, CACHE_DURATION.CHILD_PROFILE);
  }

  // Get cached child profile
  getCachedChildProfile(childId: string): any | null {
    const key = this.generateKey('profile', childId);
    return this.get(key);
  }

  // Cache activity completions
  cacheActivityCompletions(childId: string, activityId: string, completions: any[]): void {
    const key = this.generateKey('completions', `${childId}:${activityId}`);
    this.set(key, completions, CACHE_DURATION.ACTIVITY_COMPLETIONS);
  }

  // Get cached activity completions
  getCachedActivityCompletions(childId: string, activityId: string): any[] | null {
    const key = this.generateKey('completions', `${childId}:${activityId}`);
    return this.get(key);
  }

  // Invalidate specific cache entries
  invalidateChildCache(childId: string): void {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (key.includes(childId)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.stats.invalidations++;
    });

    this.updateMemoryUsage();
    logger.info('Child cache invalidated', { childId, keysInvalidated: keysToDelete.length });
  }

  // Invalidate activity cache
  invalidateActivitiesCache(): void {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (key.startsWith('activities:')) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.stats.invalidations++;
    });

    this.updateMemoryUsage();
    logger.info('Activities cache invalidated', { keysInvalidated: keysToDelete.length });
  }

  // Invalidate progress cache for a child
  invalidateChildProgress(childId: string): void {
    const progressKey = this.generateKey('progress', childId);
    const achievementsKey = this.generateKey('achievements', childId);
    
    if (this.cache.delete(progressKey)) {
      this.stats.invalidations++;
    }
    if (this.cache.delete(achievementsKey)) {
      this.stats.invalidations++;
    }

    this.updateMemoryUsage();
    logger.info('Child progress cache invalidated', { childId });
  }

  // Clean expired entries
  cleanExpired(): number {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.updateMemoryUsage();
      logger.info('Expired cache entries cleaned', { cleanedCount });
    }

    return cleanedCount;
  }

  // Clear all cache
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    this.stats.invalidations += size;
    this.updateMemoryUsage();
    logger.info('Cache cleared', { entriesCleared: size });
  }

  // Update memory usage estimation with error handling
  private updateMemoryUsage(): void {
    try {
      let totalSize = 0;
      for (const [key, entry] of this.cache.entries()) {
        if (!key) continue;
        
        // Safe key size calculation
        totalSize += key.length * 2; // String overhead
        
        // Safe data size calculation with circular reference handling
        try {
          const dataSize = this.calculateDataSize(entry.data);
          totalSize += dataSize;
        } catch (error) {
          // If we can't calculate data size (e.g., circular refs), use fallback
          totalSize += 1000; // Fallback size estimate
        }
        
        totalSize += 24; // Entry overhead (timestamp, expires)
      }
      this.stats.memoryUsage = totalSize;
    } catch (error) {
      logger.error('Error calculating memory usage', { error });
      // Keep previous value or set to 0
      this.stats.memoryUsage = this.stats.memoryUsage || 0;
    }
  }

  // Safe data size calculation
  private calculateDataSize(data: any): number {
    if (data === null || data === undefined) return 0;
    
    try {
      // Use JSON.stringify with replacer to handle circular references
      const jsonString = JSON.stringify(data, this.getCircularReplacer());
      return jsonString.length * 2; // UTF-16 encoding
    } catch (error) {
      // Fallback for complex objects
      if (typeof data === 'string') return data.length * 2;
      if (typeof data === 'number') return 8;
      if (typeof data === 'boolean') return 4;
      if (Array.isArray(data)) return data.length * 100; // Rough estimate
      return 1000; // Default fallback for objects
    }
  }

  // Circular reference replacer for JSON.stringify
  private getCircularReplacer() {
    const seen = new WeakSet();
    return (key: string, value: any) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return value;
    };
  }

  // Get cache statistics
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;
    
    return {
      ...this.stats,
      size: this.cache.size,
      hitRate
    };
  }

  // Warmup cache with commonly accessed data
  async warmup(commonChildIds: string[] = []): Promise<void> {
    logger.info('Starting cache warmup', { childIds: commonChildIds.length });
    
    try {
      // This would typically involve pre-loading common data
      // For now, we'll just log the warmup attempt
      logger.info('Cache warmup completed', { 
        warmedUpChildren: commonChildIds.length,
        currentCacheSize: this.cache.size 
      });
    } catch (error) {
      logger.error('Cache warmup failed', { error });
    }
  }

  // Cache maintenance (should be called periodically)
  maintenance(): void {
    const before = this.cache.size;
    const cleaned = this.cleanExpired();
    const after = this.cache.size;
    
    logger.info('Cache maintenance completed', {
      before,
      after,
      cleaned,
      stats: this.getStats()
    });
  }
}

// Export singleton instance
export const kidsCache = new KidsActivitiesCache();

// Periodic maintenance (every 5 minutes)
if (typeof window === 'undefined') { // Server-side only
  setInterval(() => {
    kidsCache.maintenance();
  }, 5 * 60 * 1000);
}

// Helper functions for common cache operations
export const cacheHelpers = {
  // Cache activity list with filters
  cacheActivityList: (filters: any, activities: any[]) => {
    kidsCache.cacheActivities(filters, activities);
  },

  // Get cached activity list
  getCachedActivityList: (filters: any) => {
    return kidsCache.getCachedActivities(filters);
  },

  // Cache child progress
  cacheChildProgress: (childId: string, progress: any) => {
    kidsCache.cacheChildProgress(childId, progress);
  },

  // Get cached child progress
  getCachedChildProgress: (childId: string) => {
    return kidsCache.getCachedChildProgress(childId);
  },

  // Cache child profiles (for parent)
  cacheChildProfiles: (parentId: string, profiles: any[]) => {
    const key = kidsCache.generateKey('profiles', parentId);
    kidsCache.set(key, profiles, CACHE_DURATION.CHILD_PROFILE);
  },

  // Get cached child profiles
  getCachedChildProfiles: (parentId: string) => {
    const key = kidsCache.generateKey('profiles', parentId);
    return kidsCache.get(key);
  },

  // Cache and invalidate child data
  updateChildData: (childId: string, data: { progress?: any; achievements?: any; profile?: any }) => {
    if (data.progress) {
      kidsCache.cacheChildProgress(childId, data.progress);
    }
    if (data.achievements) {
      kidsCache.cacheChildAchievements(childId, data.achievements);
    }
    if (data.profile) {
      kidsCache.cacheChildProfile(childId, data.profile);
    }
  },

  // Invalidate child data after updates
  invalidateChildData: (childId: string) => {
    kidsCache.invalidateChildCache(childId);
  },

  // Invalidate parent data
  invalidateParentData: (parentId: string) => {
    const keysToDelete: string[] = [];
    
    for (const key of kidsCache.getKeys()) {
      if (key.includes(`profiles:${parentId}`)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => {
      kidsCache.delete(key);
    });
  },

  // Invalidate activity data
  invalidateActivityData: () => {
    kidsCache.invalidateActivitiesCache();
  },

  // Get all cached child data
  getCachedChildData: (childId: string) => {
    return {
      progress: kidsCache.getCachedChildProgress(childId),
      achievements: kidsCache.getCachedChildAchievements(childId),
      profile: kidsCache.getCachedChildProfile(childId)
    };
  }
};

export default kidsCache;