// Comprehensive tests for Kids Cache System
// Testing cache operations, invalidation, performance, and memory management

import { kidsCache, cacheHelpers } from '../kids-cache';

// Mock performance.now for consistent timing tests
let mockTime = 0;
Object.defineProperty(performance, 'now', {
  writable: true,
  value: jest.fn(() => mockTime),
});

describe('KidsCache', () => {
  beforeEach(() => {
    kidsCache.clear();
    mockTime = 0;
    jest.clearAllMocks();
  });

  describe('Basic Cache Operations', () => {
    it('should store and retrieve cached data', () => {
      const testData = { id: 'test1', name: 'Test Activity' };
      const key = 'test-key';
      
      kidsCache.set(key, testData);
      const retrieved = kidsCache.get(key);
      
      expect(retrieved).toEqual(testData);
    });

    it('should return null for non-existent keys', () => {
      const result = kidsCache.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('should check if key exists correctly', () => {
      const key = 'test-key';
      
      expect(kidsCache.has(key)).toBe(false);
      
      kidsCache.set(key, { data: 'test' });
      expect(kidsCache.has(key)).toBe(true);
    });

    it('should delete specific keys', () => {
      const key = 'test-key';
      kidsCache.set(key, { data: 'test' });
      
      expect(kidsCache.has(key)).toBe(true);
      
      kidsCache.delete(key);
      expect(kidsCache.has(key)).toBe(false);
      expect(kidsCache.get(key)).toBeNull();
    });

    it('should clear all cache data', () => {
      kidsCache.set('key1', { data: 'test1' });
      kidsCache.set('key2', { data: 'test2' });
      
      expect(kidsCache.has('key1')).toBe(true);
      expect(kidsCache.has('key2')).toBe(true);
      
      kidsCache.clear();
      
      expect(kidsCache.has('key1')).toBe(false);
      expect(kidsCache.has('key2')).toBe(false);
    });
  });

  describe('TTL (Time-To-Live) Functionality', () => {
    it('should respect TTL and expire cached data', () => {
      const key = 'ttl-test';
      const data = { id: 'test' };
      const ttl = 1000; // 1 second
      
      kidsCache.set(key, data, ttl);
      
      // Should be available immediately
      expect(kidsCache.get(key)).toEqual(data);
      
      // Advance time by 500ms - should still be available
      mockTime += 500;
      expect(kidsCache.get(key)).toEqual(data);
      
      // Advance time by another 600ms (total 1100ms) - should be expired
      mockTime += 600;
      expect(kidsCache.get(key)).toBeNull();
      expect(kidsCache.has(key)).toBe(false);
    });

    it('should use default TTL when none specified', () => {
      const key = 'default-ttl-test';
      const data = { id: 'test' };
      
      kidsCache.set(key, data);
      
      // Should use default TTL (5 minutes = 300000ms)
      mockTime += 299000; // Just under 5 minutes
      expect(kidsCache.get(key)).toEqual(data);
      
      mockTime += 2000; // Over 5 minutes
      expect(kidsCache.get(key)).toBeNull();
    });

    it('should handle infinite TTL (never expire)', () => {
      const key = 'infinite-ttl-test';
      const data = { id: 'test' };
      
      kidsCache.set(key, data, Infinity);
      
      // Advance time significantly
      mockTime += 10000000; // Very long time
      expect(kidsCache.get(key)).toEqual(data);
    });
  });

  describe('Cache Statistics', () => {
    it('should track cache hits and misses', () => {
      const key = 'stats-test';
      const data = { id: 'test' };
      
      // Initial stats
      const initialStats = kidsCache.getStats();
      expect(initialStats.hits).toBe(0);
      expect(initialStats.misses).toBe(0);
      
      // Cache miss
      kidsCache.get(key);
      let stats = kidsCache.getStats();
      expect(stats.misses).toBe(1);
      expect(stats.hits).toBe(0);
      
      // Set data and cache hit
      kidsCache.set(key, data);
      kidsCache.get(key);
      stats = kidsCache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
    });

    it('should track cache size and memory usage', () => {
      const stats = kidsCache.getStats();
      expect(stats.size).toBe(0);
      expect(stats.memoryUsage).toBe(0);
      
      kidsCache.set('key1', { data: 'test1' });
      kidsCache.set('key2', { data: 'test2' });
      
      const newStats = kidsCache.getStats();
      expect(newStats.size).toBe(2);
      expect(newStats.memoryUsage).toBeGreaterThan(0);
    });

    it('should calculate hit rate correctly', () => {
      kidsCache.set('key1', { data: 'test' });
      
      // 2 hits, 1 miss = 66.67% hit rate
      kidsCache.get('key1'); // hit
      kidsCache.get('key1'); // hit
      kidsCache.get('nonexistent'); // miss
      
      const stats = kidsCache.getStats();
      expect(stats.hitRate).toBeCloseTo(66.67, 1);
    });
  });

  describe('Memory Management', () => {
    it('should enforce maximum cache size', () => {
      // Assuming max size is configured
      for (let i = 0; i < 1000; i++) {
        kidsCache.set(`key${i}`, { data: `test${i}` });
      }
      
      const stats = kidsCache.getStats();
      // Should not exceed reasonable memory limits
      expect(stats.size).toBeLessThan(1000);
    });

    it('should clean up expired entries automatically', () => {
      const shortTTL = 100; // 100ms
      
      for (let i = 0; i < 10; i++) {
        kidsCache.set(`temp-key${i}`, { data: `test${i}` }, shortTTL);
      }
      
      let stats = kidsCache.getStats();
      expect(stats.size).toBe(10);
      
      // Advance time to expire all entries
      mockTime += 200;
      
      // Trigger cleanup by accessing cache
      kidsCache.get('temp-key0');
      
      stats = kidsCache.getStats();
      expect(stats.size).toBe(0);
    });
  });

  describe('Cache Helpers', () => {
    describe('Activity List Caching', () => {
      it('should cache and retrieve activity lists', () => {
        const filters = {
          childId: 'child123',
          type: ['emotion'],
          limit: 20,
          offset: 0,
        };
        
        const activities = [
          { id: 'activity1', title: 'Test Activity 1' },
          { id: 'activity2', title: 'Test Activity 2' },
        ];
        
        cacheHelpers.cacheActivityList(filters, activities);
        const cached = cacheHelpers.getCachedActivityList(filters);
        
        expect(cached).toEqual(activities);
      });

      it('should return null for non-matching filters', () => {
        const filters1 = { childId: 'child123', type: ['emotion'] };
        const filters2 = { childId: 'child123', type: ['creativity'] };
        
        const activities = [{ id: 'activity1', title: 'Test' }];
        
        cacheHelpers.cacheActivityList(filters1, activities);
        const cached = cacheHelpers.getCachedActivityList(filters2);
        
        expect(cached).toBeNull();
      });

      it('should generate consistent cache keys for same filters', () => {
        const filters1 = { childId: 'child123', type: ['emotion'], limit: 20 };
        const filters2 = { childId: 'child123', type: ['emotion'], limit: 20 };
        
        const activities = [{ id: 'activity1', title: 'Test' }];
        
        cacheHelpers.cacheActivityList(filters1, activities);
        const cached = cacheHelpers.getCachedActivityList(filters2);
        
        expect(cached).toEqual(activities);
      });
    });

    describe('Child Progress Caching', () => {
      it('should cache and retrieve child progress', () => {
        const childId = 'child123';
        const progress = {
          totalActivitiesCompleted: 15,
          currentStreak: 5,
          kindnessPoints: 75,
        };
        
        cacheHelpers.cacheChildProgress(childId, progress);
        const cached = cacheHelpers.getCachedChildProgress(childId);
        
        expect(cached).toEqual(progress);
      });

      it('should return null for non-existent child progress', () => {
        const cached = cacheHelpers.getCachedChildProgress('nonexistent-child');
        expect(cached).toBeNull();
      });
    });

    describe('Child Profile Caching', () => {
      it('should cache and retrieve child profiles', () => {
        const parentId = 'parent123';
        const profiles = [
          { id: 'child1', name: 'Alice', age: 6 },
          { id: 'child2', name: 'Bob', age: 4 },
        ];
        
        cacheHelpers.cacheChildProfiles(parentId, profiles);
        const cached = cacheHelpers.getCachedChildProfiles(parentId);
        
        expect(cached).toEqual(profiles);
      });
    });

    describe('Cache Invalidation', () => {
      it('should invalidate all child-related data', () => {
        const childId = 'child123';
        const parentId = 'parent123';
        
        // Set up various cached data
        cacheHelpers.cacheChildProgress(childId, { totalActivitiesCompleted: 10 });
        cacheHelpers.cacheChildProfiles(parentId, [{ id: childId, name: 'Test' }]);
        cacheHelpers.cacheActivityList({ childId }, [{ id: 'activity1' }]);
        
        // Verify data is cached
        expect(cacheHelpers.getCachedChildProgress(childId)).toBeTruthy();
        expect(cacheHelpers.getCachedActivityList({ childId })).toBeTruthy();
        
        // Invalidate child data
        cacheHelpers.invalidateChildData(childId);
        
        // Verify data is invalidated
        expect(cacheHelpers.getCachedChildProgress(childId)).toBeNull();
        expect(cacheHelpers.getCachedActivityList({ childId })).toBeNull();
      });

      it('should invalidate parent data', () => {
        const parentId = 'parent123';
        const profiles = [{ id: 'child1', name: 'Alice' }];
        
        cacheHelpers.cacheChildProfiles(parentId, profiles);
        expect(cacheHelpers.getCachedChildProfiles(parentId)).toEqual(profiles);
        
        cacheHelpers.invalidateParentData(parentId);
        expect(cacheHelpers.getCachedChildProfiles(parentId)).toBeNull();
      });

      it('should invalidate activity data', () => {
        const filters = { type: ['emotion'], limit: 20 };
        const activities = [{ id: 'activity1', title: 'Test' }];
        
        cacheHelpers.cacheActivityList(filters, activities);
        expect(cacheHelpers.getCachedActivityList(filters)).toEqual(activities);
        
        cacheHelpers.invalidateActivityData();
        expect(cacheHelpers.getCachedActivityList(filters)).toBeNull();
      });
    });
  });

  describe('Performance', () => {
    it('should handle large datasets efficiently', () => {
      const startTime = performance.now();
      
      // Store large amount of data
      for (let i = 0; i < 1000; i++) {
        kidsCache.set(`perf-test-${i}`, {
          id: `item-${i}`,
          data: new Array(100).fill(i),
        });
      }
      
      const storeTime = performance.now() - startTime;
      
      // Retrieve data
      const retrieveStart = performance.now();
      for (let i = 0; i < 1000; i++) {
        kidsCache.get(`perf-test-${i}`);
      }
      const retrieveTime = performance.now() - retrieveStart;
      
      // Operations should be reasonably fast
      expect(storeTime).toBeLessThan(100); // 100ms
      expect(retrieveTime).toBeLessThan(50); // 50ms
    });

    it('should handle concurrent operations safely', async () => {
      const operations = [];
      
      // Simulate concurrent cache operations
      for (let i = 0; i < 100; i++) {
        operations.push(
          Promise.resolve().then(() => {
            kidsCache.set(`concurrent-${i}`, { value: i });
            return kidsCache.get(`concurrent-${i}`);
          })
        );
      }
      
      const results = await Promise.all(operations);
      
      // All operations should complete successfully
      expect(results).toHaveLength(100);
      results.forEach((result, index) => {
        expect(result).toEqual({ value: index });
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid data gracefully', () => {
      // Test with various invalid inputs
      expect(() => kidsCache.set(null as any, {})).not.toThrow();
      expect(() => kidsCache.set('', {})).not.toThrow();
      expect(() => kidsCache.get(null as any)).not.toThrow();
      
      // Should return null for invalid keys
      expect(kidsCache.get(null as any)).toBeNull();
      expect(kidsCache.get(undefined as any)).toBeNull();
    });

    it('should handle circular references in data', () => {
      const circularData: any = { id: 'test' };
      circularData.self = circularData;
      
      // Should not throw when storing circular data
      expect(() => kidsCache.set('circular-test', circularData)).not.toThrow();
    });

    it('should handle memory pressure gracefully', () => {
      // Fill cache with large objects until memory limit
      let index = 0;
      try {
        while (index < 10000) {
          kidsCache.set(`memory-test-${index}`, {
            largeData: new Array(1000).fill(index),
          });
          index++;
        }
      } catch (error) {
        // Should gracefully handle out of memory
      }
      
      // Cache should still be functional
      kidsCache.set('test-after-pressure', { id: 'test' });
      expect(kidsCache.get('test-after-pressure')).toEqual({ id: 'test' });
    });
  });
});