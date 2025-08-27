// Production-ready logging system
// Structured logging with different levels and outputs

// @ts-ignore - pino module export compatibility
import pino from 'pino';

// Logger configuration based on environment
const isDevelopment = process.env.NODE_ENV === 'development';

// More robust browser detection
const isBrowser = (() => {
  try {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  } catch {
    return false;
  }
})();

// Check if we're in a server environment
const isServer = (() => {
  try {
    return typeof process !== 'undefined' && process.versions && process.versions.node;
  } catch {
    return false;
  }
})();

// Create logger configuration with safe fallbacks
const createLoggerConfig = () => {
  const baseConfig = {
    level: (isServer && process.env.LOG_LEVEL) || (isDevelopment ? 'debug' : 'info'),
    
    // Base configuration with safe property access
    base: {
      pid: isServer && !isBrowser ? (process?.pid || undefined) : undefined,
      hostname: isServer && !isBrowser ? (process?.env?.HOSTNAME || 'unknown') : undefined,
      service: 'kids-activities',
      version: isServer ? (process?.env?.npm_package_version || '1.0.0') : '1.0.0',
      environment: isServer ? (process?.env?.NODE_ENV || 'development') : 'browser'
    },
    
    // Timestamp configuration
    timestamp: pino.stdTimeFunctions.isoTime,
    
    // Error serialization
    serializers: {
      error: pino.stdSerializers.err,
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res
    },
    
    // Redact sensitive information
    redact: {
      paths: [
        'password',
        'token',
        'authorization',
        'cookie',
        'encryptionKey',
        '*.password',
        '*.token',
        '*.encryptionKey'
      ],
      censor: '[REDACTED]'
    }
  };

  // Only add transport in Node.js server environment during development
  // Avoid any transport configuration in browser or when pino-pretty might not be available
  if (isServer && !isBrowser && isDevelopment) {
    try {
      // Check if we're in a webpack bundled environment (like Next.js app router)
      // where pino-pretty transport might not work properly
      const isWebpackBundled = typeof __webpack_require__ !== 'undefined' || 
                              (globalThis as any).__webpack_public_path__ !== undefined;
      
      if (!isWebpackBundled) {
        // Only add transport if we can safely access it and not in webpack
        return {
          ...baseConfig,
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname'
            }
          }
        };
      }
    } catch (error) {
      // If transport setup fails, fall back to base config
      console.warn('Failed to setup pino-pretty transport, using base logger:', error);
    }
  }

  return baseConfig;
};

// Create logger with lazy initialization to avoid transport issues
let _logger: pino.Logger | null = null;

const getLogger = (): pino.Logger => {
  if (!_logger) {
    _logger = pino(createLoggerConfig());
  }
  return _logger;
};

// Export logger with getter
export const logger = new Proxy({} as pino.Logger, {
  get(target, prop) {
    const loggerInstance = getLogger();
    const value = (loggerInstance as any)[prop];
    return typeof value === 'function' ? value.bind(loggerInstance) : value;
  }
});


// Enhanced logging methods with context
export const createContextLogger = (context: Record<string, any>) => {
  return logger.child(context);
};

// Activity-specific logger
export const activityLogger = createContextLogger({ module: 'kids-activities' });

// API logger with request tracking
export const apiLogger = createContextLogger({ module: 'api' });

// Performance logger
export const performanceLogger = createContextLogger({ module: 'performance' });

// Security logger
export const securityLogger = createContextLogger({ module: 'security' });

// Database logger
export const dbLogger = createContextLogger({ module: 'database' });

// Cache logger
export const cacheLogger = createContextLogger({ module: 'cache' });

// Auth logger
export const authLogger = createContextLogger({ module: 'auth' });

// Monitoring logger
export const monitoringLogger = createContextLogger({ module: 'monitoring' });

// Helper function to log API requests
export const logAPIRequest = (req: any, res: any, responseTime: number) => {
  const level = res.status >= 400 ? 'error' : res.status >= 300 ? 'warn' : 'info';
  
  apiLogger[level]({
    method: req.method,
    url: req.url,
    statusCode: res.status,
    responseTime,
    userAgent: req.headers['user-agent'],
    ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress,
    contentLength: res.headers['content-length']
  }, `${req.method} ${req.url} ${res.status} - ${responseTime}ms`);
};

// Helper function to log database operations
export const logDBOperation = (operation: string, table: string, duration: number, error?: any) => {
  if (error) {
    dbLogger.error({
      operation,
      table,
      duration,
      error: error.message || error
    }, `DB ${operation} on ${table} failed after ${duration}ms`);
  } else {
    dbLogger.info({
      operation,
      table,
      duration
    }, `DB ${operation} on ${table} completed in ${duration}ms`);
  }
};

// Helper function to log authentication events
export const logAuthEvent = (event: string, userId?: string, success: boolean = true, details?: any) => {
  const level = success ? 'info' : 'warn';
  
  authLogger[level]({
    event,
    userId,
    success,
    ...details
  }, `Auth event: ${event} - ${success ? 'Success' : 'Failed'}`);
};

// Helper function to log security events
export const logSecurityEvent = (event: string, severity: 'low' | 'medium' | 'high' | 'critical', details: any) => {
  const level = severity === 'critical' ? 'error' : severity === 'high' ? 'warn' : 'info';
  
  securityLogger[level]({
    event,
    severity,
    ...details
  }, `Security event: ${event}`);
};

// Helper function to log performance metrics
export const logPerformanceMetric = (metric: string, value: number, unit: string, tags?: Record<string, string>) => {
  performanceLogger.info({
    metric,
    value,
    unit,
    tags
  }, `Performance: ${metric} = ${value}${unit}`);
};

// Helper function to log cache operations
export const logCacheOperation = (operation: string, key: string, hit: boolean, duration?: number) => {
  cacheLogger.info({
    operation,
    key,
    hit,
    duration
  }, `Cache ${operation}: ${key} - ${hit ? 'HIT' : 'MISS'}${duration ? ` (${duration}ms)` : ''}`);
};

// Helper function to log monitoring events
export const logMonitoringEvent = (event: string, data: any) => {
  monitoringLogger.info({
    event,
    ...data
  }, `Monitoring: ${event}`);
};

// Helper function to create child logger with request context
export const createRequestLogger = (requestId: string, userId?: string) => {
  return logger.child({
    requestId,
    userId
  });
};

// Graceful shutdown logging
process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully');
});

process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully');
});

// Unhandled rejection logging
process.on('unhandledRejection', (reason, promise) => {
  logger.error({
    reason,
    promise
  }, 'Unhandled Promise Rejection');
});

// Uncaught exception logging
process.on('uncaughtException', (error) => {
  logger.fatal({
    error: error.message,
    stack: error.stack
  }, 'Uncaught Exception');
  process.exit(1);
});

export default logger;

