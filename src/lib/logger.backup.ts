import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';

// Simple logger configuration without transport dependencies
const logger = pino({
  level: isDevelopment ? 'debug' : 'info',
  base: {
    service: 'relationship-platform',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
});

// Enhanced logging methods
export const createContextLogger = (context: Record<string, any>) => {
  return logger.child(context);
};

// Export logger with getter pattern for compatibility
export const logger = new Proxy({} as pino.Logger, {
  get(target, prop) {
    const value = (logger as any)[prop];
    return typeof value === 'function' ? value.bind(logger) : value;
  }
});

// Activity-specific logger
export const activityLogger = createContextLogger({ module: 'relationship' });

// API logger with request tracking
export const apiLogger = createContextLogger({ module: 'api' });

// Database logger
export const dbLogger = createContextLogger({ module: 'database' });

// Auth logger
export const authLogger = createContextLogger({ module: 'auth' });

export default logger;
