// Temporary logger for development - avoid complex Pino issues
export const logger = {
  info: (...args: any[]) => console.log(`[INFO]`, ...args),
  warn: (...args: any[]) => console.warn(`[WARN]`, ...args),
  error: (...args: any[]) => console.error(`[ERROR]`, ...args),
  debug: (...args: any[]) => console.debug(`[DEBUG]`, ...args),
};

export const createContextLogger = (context: any) => ({
  ...logger,
  info: (...args: any[]) => console.log(`[${context.module}]`, ...args),
  warn: (...args: any[]) => console.warn(`[${context.module}]`, ...args),
  error: (...args: any[]) => console.error(`[${context.module}]`, ...args),
});

// Simple loggers for different modules
export const apiLogger = createContextLogger({ module: 'api' });
export const dbLogger = createContextLogger({ module: 'database' });
export const authLogger = createContextLogger({ module: 'auth' });
export const performanceLogger = createContextLogger({ module: 'performance' });

export default logger;
