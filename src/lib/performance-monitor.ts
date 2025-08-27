// Kids Activities Performance Monitoring
// Production-ready performance tracking and optimization

import { logger } from '@/lib/logger';

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  context?: Record<string, any>;
  success?: boolean;
  error?: string;
}

interface PerformanceStats {
  totalRequests: number;
  averageResponseTime: number;
  slowestRequest: number;
  fastestRequest: number;
  errorRate: number;
  last24Hours: PerformanceMetric[];
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000; // Keep last 1000 metrics
  private slowRequestThreshold = 1000; // 1 second

  // Track API performance
  trackAPI(name: string, duration: number, context?: Record<string, any>, success = true, error?: string) {
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
      context,
      success,
      error
    };

    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log slow requests
    if (duration > this.slowRequestThreshold) {
      logger.warn('Slow API request detected', {
        endpoint: name,
        duration,
        context,
        timestamp: metric.timestamp
      });
    }

    // Log errors
    if (!success) {
      logger.error('API request failed', {
        endpoint: name,
        duration,
        error,
        context,
        timestamp: metric.timestamp
      });
    }

    // Log successful requests at debug level
    logger.debug('API request completed', {
      endpoint: name,
      duration,
      success,
      context
    });
  }

  // Track database operations
  trackDatabase(operation: string, duration: number, context?: Record<string, any>, success = true, error?: string) {
    this.trackAPI(`db:${operation}`, duration, context, success, error);
  }

  // Track cache operations
  trackCache(operation: string, hit: boolean, duration?: number) {
    const metric: PerformanceMetric = {
      name: `cache:${operation}`,
      duration: duration || 0,
      timestamp: Date.now(),
      context: { hit },
      success: true
    };

    this.metrics.push(metric);

    logger.debug('Cache operation', {
      operation,
      hit,
      duration: duration || 0
    });
  }

  // Get performance statistics
  getStats(timeRange?: number): PerformanceStats {
    const now = Date.now();
    const cutoff = timeRange ? now - timeRange : now - (24 * 60 * 60 * 1000); // Last 24 hours by default
    
    const recentMetrics = this.metrics.filter(m => m.timestamp > cutoff);
    const apiMetrics = recentMetrics.filter(m => !m.name.startsWith('cache:'));
    
    if (apiMetrics.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        slowestRequest: 0,
        fastestRequest: 0,
        errorRate: 0,
        last24Hours: []
      };
    }

    const durations = apiMetrics.map(m => m.duration);
    const errors = apiMetrics.filter(m => !m.success);

    return {
      totalRequests: apiMetrics.length,
      averageResponseTime: durations.reduce((a, b) => a + b, 0) / durations.length,
      slowestRequest: Math.max(...durations),
      fastestRequest: Math.min(...durations),
      errorRate: (errors.length / apiMetrics.length) * 100,
      last24Hours: recentMetrics
    };
  }

  // Get cache statistics
  getCacheStats(timeRange?: number): { hits: number; misses: number; hitRate: string } {
    const now = Date.now();
    const cutoff = timeRange ? now - timeRange : now - (24 * 60 * 60 * 1000);
    
    const cacheMetrics = this.metrics.filter(m => 
      m.name.startsWith('cache:') && m.timestamp > cutoff
    );

    const hits = cacheMetrics.filter(m => m.context?.hit === true).length;
    const misses = cacheMetrics.filter(m => m.context?.hit === false).length;
    const total = hits + misses;

    return {
      hits,
      misses,
      hitRate: total > 0 ? `${((hits / total) * 100).toFixed(2)}%` : '0%'
    };
  }

  // Get slow requests
  getSlowRequests(limit = 10): PerformanceMetric[] {
    return this.metrics
      .filter(m => m.duration > this.slowRequestThreshold)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  // Get error requests
  getErrorRequests(limit = 10): PerformanceMetric[] {
    return this.metrics
      .filter(m => !m.success)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // Generate performance report
  generateReport(): {
    stats: PerformanceStats;
    cacheStats: ReturnType<typeof this.getCacheStats>;
    slowRequests: PerformanceMetric[];
    errorRequests: PerformanceMetric[];
    recommendations: string[];
  } {
    const stats = this.getStats();
    const cacheStats = this.getCacheStats();
    const slowRequests = this.getSlowRequests(5);
    const errorRequests = this.getErrorRequests(5);
    
    const recommendations: string[] = [];

    // Generate recommendations based on metrics
    if (stats.averageResponseTime > 500) {
      recommendations.push('Average response time is high. Consider optimizing database queries or adding more caching.');
    }

    if (stats.errorRate > 5) {
      recommendations.push('Error rate is high. Check for common error patterns and implement fixes.');
    }

    if (parseFloat(cacheStats.hitRate) < 70) {
      recommendations.push('Cache hit rate is low. Review caching strategy and increase cache duration for stable data.');
    }

    if (slowRequests.length > 0) {
      recommendations.push('Multiple slow requests detected. Review the slowest endpoints for optimization opportunities.');
    }

    return {
      stats,
      cacheStats,
      slowRequests,
      errorRequests,
      recommendations
    };
  }

  // Clear old metrics
  cleanup(maxAge = 24 * 60 * 60 * 1000): number {
    const cutoff = Date.now() - maxAge;
    const before = this.metrics.length;
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
    const cleaned = before - this.metrics.length;

    if (cleaned > 0) {
      logger.info('Performance metrics cleaned up', { cleaned, remaining: this.metrics.length });
    }

    return cleaned;
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Helper function to time async operations
export async function timeAsync<T>(
  name: string, 
  operation: () => Promise<T>, 
  context?: Record<string, any>
): Promise<T> {
  const start = performance.now();
  let success = true;
  let error: string | undefined;
  
  try {
    const result = await operation();
    return result;
  } catch (err) {
    success = false;
    error = err instanceof Error ? err.message : 'Unknown error';
    throw err;
  } finally {
    const duration = performance.now() - start;
    performanceMonitor.trackAPI(name, duration, context, success, error);
  }
}

// Helper function to time database operations
export async function timeDatabase<T>(
  operation: string,
  dbOperation: () => Promise<T>,
  context?: Record<string, any>
): Promise<T> {
  const start = performance.now();
  let success = true;
  let error: string | undefined;
  
  try {
    const result = await dbOperation();
    return result;
  } catch (err) {
    success = false;
    error = err instanceof Error ? err.message : 'Unknown error';
    throw err;
  } finally {
    const duration = performance.now() - start;
    performanceMonitor.trackDatabase(operation, duration, context, success, error);
  }
}

// Periodic cleanup (every hour)
if (typeof window === 'undefined') { // Server-side only
  setInterval(() => {
    performanceMonitor.cleanup();
  }, 60 * 60 * 1000);
}

export default performanceMonitor;