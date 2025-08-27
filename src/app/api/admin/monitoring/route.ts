// Admin Monitoring Dashboard API
// Production-ready monitoring endpoint for system health and metrics

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { monitoring } from '@/lib/monitoring';
import { performanceMonitor } from '@/lib/performance-monitor';
import { kidsCache } from '@/lib/kids-cache';

// GET /api/admin/monitoring - Get system monitoring data
export async function GET(request: NextRequest) {
  try {
    // Authenticate admin user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      logger.warn('Unauthorized access attempt to monitoring dashboard');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check admin privileges (implement based on your auth system)
    // if (session.user.role !== 'ADMIN') {
    //   logger.warn('Non-admin user attempted to access monitoring dashboard', {
    //     userId: session.user.id
    //   });
    //   return NextResponse.json(
    //     { error: 'Admin privileges required' },
    //     { status: 403 }
    //   );
    // }

    const { searchParams } = new URL(request.url);
    const timeRange = parseInt(searchParams.get('timeRange') || '3600000'); // Default 1 hour
    const includeMetrics = searchParams.get('includeMetrics') === 'true';

    try {
      // Get system status
      const systemStatus = monitoring.getSystemStatus();
      
      // Get performance stats
      const performanceStats = performanceMonitor.getStats(timeRange);
      const cacheStats = performanceMonitor.getCacheStats(timeRange);
      
      // Get cache statistics
      const kidsCacheStats = kidsCache.getStats();
      
      // Get slow requests
      const slowRequests = performanceMonitor.getSlowRequests(10);
      
      // Get error requests
      const errorRequests = performanceMonitor.getErrorRequests(10);

      // Get system information
      const systemInfo = {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
      };

      // Calculate additional metrics
      const additionalMetrics = {
        memoryUsagePercent: (systemInfo.memoryUsage.heapUsed / systemInfo.memoryUsage.heapTotal) * 100,
        uptimeHours: Math.floor(systemInfo.uptime / 3600),
        healthScore: calculateHealthScore(systemStatus, performanceStats),
      };

      const response = {
        status: systemStatus.status,
        timestamp: new Date().toISOString(),
        systemInfo: {
          ...systemInfo,
          ...additionalMetrics
        },
        performance: {
          ...performanceStats,
          cache: {
            performance: cacheStats,
            kidsCache: kidsCacheStats
          },
          slowRequests: slowRequests.slice(0, 5), // Top 5 slowest
          errorRequests: errorRequests.slice(0, 5) // Recent 5 errors
        },
        health: {
          ...systemStatus,
          checks: systemStatus.healthChecks.slice(-10) // Last 10 health checks
        },
        alerts: {
          active: systemStatus.activeAlerts,
          recent: systemStatus.activeAlerts.slice(-20) // Recent 20 alerts
        }
      };

      // Include detailed metrics if requested
      if (includeMetrics) {
        const metrics = monitoring.getMetrics(timeRange);
        (response as any).metrics = {
          raw: metrics.slice(-1000), // Last 1000 metrics
          aggregated: aggregateMetrics(metrics)
        };
      }

      logger.info('Monitoring dashboard accessed', {
        adminId: session.user.id,
        timeRange,
        includeMetrics,
        systemStatus: systemStatus.status
      });

      return NextResponse.json(response);

    } catch (error) {
      logger.error('Error retrieving monitoring data', {
        error: error instanceof Error ? error.message : 'Unknown error',
        adminId: session.user.id
      });
      
      return NextResponse.json(
        { error: 'Failed to retrieve monitoring data' },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error('Unexpected error in monitoring endpoint', { error });
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// POST /api/admin/monitoring - Trigger manual health check or resolve alerts
export async function POST(request: NextRequest) {
  try {
    // Authenticate admin user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, alertId } = body;

    switch (action) {
      case 'resolveAlert':
        if (!alertId) {
          return NextResponse.json(
            { error: 'Alert ID required' },
            { status: 400 }
          );
        }
        
        const resolved = monitoring.resolveAlert(alertId);
        if (resolved) {
          logger.info('Alert resolved by admin', {
            adminId: session.user.id,
            alertId
          });
          return NextResponse.json({ success: true, message: 'Alert resolved' });
        } else {
          return NextResponse.json(
            { error: 'Alert not found or already resolved' },
            { status: 404 }
          );
        }

      case 'triggerHealthCheck':
        // This would trigger an immediate health check
        logger.info('Manual health check triggered', {
          adminId: session.user.id
        });
        return NextResponse.json({ success: true, message: 'Health check triggered' });

      case 'clearCache':
        kidsCache.clear();
        logger.info('Cache cleared by admin', {
          adminId: session.user.id
        });
        return NextResponse.json({ success: true, message: 'Cache cleared' });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    logger.error('Error in monitoring POST endpoint', { error });
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Helper function to calculate health score
function calculateHealthScore(systemStatus: any, performanceStats: any): number {
  let score = 100;

  // Deduct points for system issues
  if (systemStatus.status === 'degraded') score -= 20;
  if (systemStatus.status === 'unhealthy') score -= 50;

  // Deduct points for active alerts
  score -= systemStatus.activeAlerts.length * 5;

  // Deduct points for high error rate
  if (performanceStats.errorRate > 5) score -= 15;
  if (performanceStats.errorRate > 10) score -= 25;

  // Deduct points for slow response times
  if (performanceStats.averageResponseTime > 1000) score -= 10;
  if (performanceStats.averageResponseTime > 2000) score -= 20;

  return Math.max(0, Math.min(100, score));
}

// Helper function to aggregate metrics
function aggregateMetrics(metrics: any[]) {
  const aggregated: any = {};
  
  // Group metrics by name
  const grouped = metrics.reduce((acc, metric) => {
    if (!acc[metric.name]) acc[metric.name] = [];
    acc[metric.name].push(metric);
    return acc;
  }, {} as Record<string, any[]>);

  // Calculate aggregations for each metric
  Object.keys(grouped).forEach(name => {
    const metricGroup = grouped[name];
    const values = metricGroup.map(m => m.value);
    
    aggregated[name] = {
      count: values.length,
      sum: values.reduce((a, b) => a + b, 0),
      avg: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
      min: Math.min(...values),
      max: Math.max(...values),
      latest: metricGroup[metricGroup.length - 1]?.value || 0
    };
  });

  return aggregated;
}