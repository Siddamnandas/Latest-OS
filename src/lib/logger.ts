// Temporary logger for development - avoid complex Pino issues
export const logger = {
  info: (message: string) => console.log(`[INFO] ${message}`),
  warn: (message: string) => console.warn(`[WARN] ${message}`),
  error: (message: string | object) => console.error(`[ERROR]`, message),
  debug: (message: string) => console.debug(`[DEBUG] ${message}`),
};

export const createContextLogger = (context: any) => ({
  ...logger,
  info: (message: string) => console.log(`[${context.module}] ${message}`),
  warn: (message: string) => console.warn(`[${context.module}] ${message}`),
  error: (message: string | object) => console.error(`[${context.module}]`, message),
});

// Simple loggers for different modules
export const apiLogger = createContextLogger({ module: 'api' });
export const dbLogger = createContextLogger({ module: 'database' });
export const authLogger = createContextLogger({ module: 'auth' });
export const performanceLogger = createContextLogger({ module: 'performance' });

export default logger;
