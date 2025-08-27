// Kids Activities Monitoring and Alerting System
// Production-ready monitoring for health, performance, and security

import { logger } from '@/lib/logger';
import { performanceMonitor } from '@/lib/performance-monitor';

// Monitoring configuration
interface MonitoringConfig {
  healthCheck: {
    enabled: boolean;
    interval: number; // in milliseconds
    endpoints: string[];
    timeout: number;
  };
  metrics: {
    enabled: boolean;
    retention: number; // in milliseconds
    batchSize: number;
  };
  alerts: {
    enabled: boolean;
    thresholds: {
      errorRate: number; // percentage
      responseTime: number; // milliseconds
      memoryUsage: number; // percentage
      diskUsage: number; // percentage
    };
    channels: Array<'email' | 'slack' | 'webhook'>;
  };
}

const defaultConfig: MonitoringConfig = {
  healthCheck: {
    enabled: true,
    interval: 30000, // 30 seconds
    endpoints: [
      '/api/kids/activities',
      '/api/kids/progress',
      '/api/kids/profile'
    ],
    timeout: 5000 // 5 seconds
  },
  metrics: {
    enabled: true,
    retention: 24 * 60 * 60 * 1000, // 24 hours
    batchSize: 100
  },
  alerts: {
    enabled: true,
    thresholds: {
      errorRate: 5, // 5%
      responseTime: 2000, // 2 seconds
      memoryUsage: 85, // 85%
      diskUsage: 90 // 90%
    },
    channels: ['email']
  }
};

// Metric types
interface Metric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
  unit?: string;
}

interface HealthCheckResult {
  endpoint: string;
  status: 'healthy' | 'unhealthy';
  responseTime: number;
  error?: string;
  timestamp: number;
}

interface AlertEvent {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  description: string;
  timestamp: number;
  resolved?: boolean;
  resolvedAt?: number;
  metadata?: Record<string, any>;
}

class MonitoringSystem {
  private config: MonitoringConfig;
  private metrics: Metric[] = [];
  private healthChecks: HealthCheckResult[] = [];
  private alerts: AlertEvent[] = [];
  private healthCheckInterval?: NodeJS.Timeout;
  private isRunning = false;

  constructor(config: Partial<MonitoringConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  // Start monitoring
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    if (this.config.healthCheck.enabled) {
      this.startHealthChecks();
    }
    
    logger.info('Monitoring system started', { config: this.config });
  }

  // Stop monitoring
  stop(): void {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    logger.info('Monitoring system stopped');
  }

  // Record metric
  recordMetric(name: string, value: number, tags?: Record<string, string>, unit?: string): void {
    if (!this.config.metrics.enabled) return;

    const metric: Metric = {
      name,
      value,
      timestamp: Date.now(),
      tags,
      unit
    };

    this.metrics.push(metric);
    
    // Clean old metrics
    this.cleanOldMetrics();
    
    // Check for alert conditions
    this.checkAlertConditions(metric);
    
    logger.debug('Metric recorded', { metric });
  }

  // Record API metrics
  recordAPIMetric(endpoint: string, method: string, statusCode: number, responseTime: number): void {
    this.recordMetric('api_request_count', 1, {
      endpoint,
      method,
      status: statusCode.toString()
    });

    this.recordMetric('api_response_time', responseTime, {
      endpoint,
      method
    }, 'ms');

    if (statusCode >= 400) {
      this.recordMetric('api_error_count', 1, {
        endpoint,
        method,
        status: statusCode.toString()
      });
    }
  }

  // Record user activity metrics
  recordUserActivity(parentId: string, action: string, childId?: string): void {
    this.recordMetric('user_activity', 1, {
      parentId,
      action,
      childId: childId || 'unknown'
    });
  }

  // Record kids activity metrics
  recordKidsActivity(activityType: string, completed: boolean, childAge?: number): void {
    this.recordMetric('kids_activity_count', 1, {
      type: activityType,
      completed: completed.toString(),
      ageGroup: childAge ? this.getAgeGroup(childAge) : 'unknown'
    });

    if (completed) {
      this.recordMetric('kids_activity_completion', 1, {
        type: activityType,
        ageGroup: childAge ? this.getAgeGroup(childAge) : 'unknown'
      });
    }
  }

  // Get age group for metrics
  private getAgeGroup(age: number): string {
    if (age <= 4) return 'toddler';
    if (age <= 6) return 'preschool';
    if (age <= 12) return 'elementary';
    return 'preteen';
  }

  // Start health checks
  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(() => {
      this.runHealthChecks();
    }, this.config.healthCheck.interval);

    // Run initial health check
    this.runHealthChecks();
  }

  // Run health checks
  private async runHealthChecks(): Promise<void> {
    const promises = this.config.healthCheck.endpoints.map(endpoint =>
      this.checkEndpointHealth(endpoint)
    );

    const results = await Promise.allSettled(promises);
    
    results.forEach((result, index) => {
      const endpoint = this.config.healthCheck.endpoints[index];
      
      if (result.status === 'fulfilled') {
        this.healthChecks.push(result.value);
        
        if (result.value.status === 'unhealthy') {
          this.createAlert('error', 'Health Check Failed', 
            `Endpoint ${endpoint} is unhealthy: ${result.value.error}`, {
              endpoint,
              responseTime: result.value.responseTime
            });
        }
      } else {
        const healthCheck: HealthCheckResult = {
          endpoint,
          status: 'unhealthy',
          responseTime: 0,
          error: result.reason?.message || 'Unknown error',
          timestamp: Date.now()
        };
        
        this.healthChecks.push(healthCheck);
        
        this.createAlert('critical', 'Health Check Failed', 
          `Health check for ${endpoint} failed: ${result.reason?.message}`, {
            endpoint
          });
      }
    });

    // Clean old health checks
    this.cleanOldHealthChecks();
  }

  // Check individual endpoint health
  private async checkEndpointHealth(endpoint: string): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.healthCheck.timeout);
      
      const response = await fetch(endpoint, {
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      return {
        endpoint,
        status: response.ok ? 'healthy' : 'unhealthy',
        responseTime,
        error: response.ok ? undefined : `HTTP ${response.status}`,
        timestamp: Date.now()
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        endpoint,
        status: 'unhealthy',
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  }

  // Create alert
  createAlert(level: AlertEvent['level'], title: string, description: string, metadata?: Record<string, any>): void {
    if (!this.config.alerts.enabled) return;

    const alert: AlertEvent = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      level,
      title,
      description,
      timestamp: Date.now(),
      metadata
    };

    this.alerts.push(alert);
    
    // Log alert
    logger[level === 'info' ? 'info' : level === 'warning' ? 'warn' : 'error'](
      'Alert created', { alert }
    );

    // Send alert (if channels configured)
    this.sendAlert(alert);
  }

  // Send alert to configured channels
  private async sendAlert(alert: AlertEvent): Promise<void> {
    for (const channel of this.config.alerts.channels) {
      try {
        switch (channel) {
          case 'email':
            await this.sendEmailAlert(alert);
            break;
          case 'slack':
            await this.sendSlackAlert(alert);
            break;
          case 'webhook':
            await this.sendWebhookAlert(alert);
            break;
        }
      } catch (error) {
        logger.error('Failed to send alert', { 
          channel, 
          alert: alert.id, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
  }

  // Send email alert (placeholder)
  private async sendEmailAlert(alert: AlertEvent): Promise<void> {
    // Implementation would depend on email service
    logger.info('Email alert sent', { alertId: alert.id });
  }

  // Send Slack alert (placeholder)
  private async sendSlackAlert(alert: AlertEvent): Promise<void> {
    // Implementation would depend on Slack webhook
    logger.info('Slack alert sent', { alertId: alert.id });
  }

  // Send webhook alert (placeholder)
  private async sendWebhookAlert(alert: AlertEvent): Promise<void> {
    // Implementation would depend on webhook URL
    logger.info('Webhook alert sent', { alertId: alert.id });
  }

  // Check alert conditions
  private checkAlertConditions(metric: Metric): void {
    const { thresholds } = this.config.alerts;

    // Check error rate
    if (metric.name === 'api_error_count') {
      const errorRate = this.calculateErrorRate();
      if (errorRate > thresholds.errorRate) {
        this.createAlert('warning', 'High Error Rate', 
          `API error rate is ${errorRate.toFixed(2)}% (threshold: ${thresholds.errorRate}%)`, {
            errorRate,
            threshold: thresholds.errorRate
          });
      }
    }

    // Check response time
    if (metric.name === 'api_response_time' && metric.value > thresholds.responseTime) {
      this.createAlert('warning', 'Slow Response Time', 
        `API response time is ${metric.value}ms (threshold: ${thresholds.responseTime}ms)`, {
          responseTime: metric.value,
          threshold: thresholds.responseTime,
          endpoint: metric.tags?.endpoint
        });
    }
  }

  // Calculate error rate
  private calculateErrorRate(): number {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    const recentMetrics = this.metrics.filter(m => 
      m.timestamp > oneHourAgo && 
      (m.name === 'api_request_count' || m.name === 'api_error_count')
    );

    const totalRequests = recentMetrics
      .filter(m => m.name === 'api_request_count')
      .reduce((sum, m) => sum + m.value, 0);

    const totalErrors = recentMetrics
      .filter(m => m.name === 'api_error_count')
      .reduce((sum, m) => sum + m.value, 0);

    return totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;
  }

  // Clean old metrics
  private cleanOldMetrics(): void {
    const cutoff = Date.now() - this.config.metrics.retention;
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
  }

  // Clean old health checks
  private cleanOldHealthChecks(): void {
    const cutoff = Date.now() - this.config.metrics.retention;
    this.healthChecks = this.healthChecks.filter(h => h.timestamp > cutoff);
  }

  // Get system status
  getSystemStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    uptime: number;
    metrics: {
      totalRequests: number;
      errorRate: number;
      avgResponseTime: number;
    };
    healthChecks: HealthCheckResult[];
    activeAlerts: AlertEvent[];
  } {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    const recentMetrics = this.metrics.filter(m => m.timestamp > oneHourAgo);
    const recentHealthChecks = this.healthChecks.filter(h => h.timestamp > oneHourAgo);
    const activeAlerts = this.alerts.filter(a => !a.resolved);

    const totalRequests = recentMetrics
      .filter(m => m.name === 'api_request_count')
      .reduce((sum, m) => sum + m.value, 0);

    const errorRate = this.calculateErrorRate();

    const responseTimes = recentMetrics
      .filter(m => m.name === 'api_response_time')
      .map(m => m.value);
    const avgResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
      : 0;

    // Determine overall status
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    
    const unhealthyChecks = recentHealthChecks.filter(h => h.status === 'unhealthy');
    const criticalAlerts = activeAlerts.filter(a => a.level === 'critical');
    
    if (criticalAlerts.length > 0 || unhealthyChecks.length > 0) {
      status = 'unhealthy';
    } else if (errorRate > this.config.alerts.thresholds.errorRate || 
               avgResponseTime > this.config.alerts.thresholds.responseTime) {
      status = 'degraded';
    }

    return {
      status,
      uptime: process.uptime() * 1000,
      metrics: {
        totalRequests,
        errorRate,
        avgResponseTime
      },
      healthChecks: recentHealthChecks,
      activeAlerts
    };
  }

  // Get metrics for dashboard
  getMetrics(timeRange: number = 60 * 60 * 1000): Metric[] {
    const cutoff = Date.now() - timeRange;
    return this.metrics.filter(m => m.timestamp > cutoff);
  }

  // Resolve alert
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert && !alert.resolved) {
      alert.resolved = true;
      alert.resolvedAt = Date.now();
      
      logger.info('Alert resolved', { alertId });
      return true;
    }
    return false;
  }
}

// Create singleton instance
export const monitoring = new MonitoringSystem();

// Start monitoring if in production
if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
  monitoring.start();
}

export default monitoring;