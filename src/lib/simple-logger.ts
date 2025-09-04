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

export { logger };
