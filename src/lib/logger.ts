import pino from 'pino';

// Determine environment and desired log level
const env = process.env.NODE_ENV || 'development';
const level = process.env.LOG_LEVEL || (env === 'production' ? 'info' : 'debug');

// Base logger options shared across environments
const options: pino.LoggerOptions = {
  level,
  timestamp: pino.stdTimeFunctions.isoTime,
};

// In the browser (including the service worker) pino automatically falls back
// to `pino/browser` which logs via `console`. We enable pretty output in
// development when running on the server by configuring the `pino-pretty`
// transport. In production we write logs to a file which can then be rotated or
// collected by an external log aggregator.
if (typeof window === 'undefined') {
  if (env === 'production') {
    options.transport = {
      target: 'pino/file',
      options: {
        destination: process.env.LOG_FILE || './logs/app.log',
        mkdir: true,
      },
    };
  } else {
    options.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
      },
    };
  }
} else {
  // When running in the browser, output structured objects for easier reading
  options.browser = { asObject: true };
}

export const logger = pino(options);

export default logger;

