// Sync-specific error codes
export const SYNC_ERROR_CODES = {
  // Connection errors
  WEBSOCKET_CONNECTION_FAILED: 'SYNC_001',
  WEBSOCKET_TIMEOUT: 'SYNC_002',
  WEBSOCKET_CLOSED_UNEXPECTEDLY: 'SYNC_003',
  NETWORK_CONNECTION_LOST: 'SYNC_004',

  // Synchronization errors
  DATA_CONFLICT: 'SYNC_010',
  SYNC_TIMEOUT: 'SYNC_011',
  INVALID_DATA_STRUCTURE: 'SYNC_012',
  SYNC_QUEUE_FULL: 'SYNC_013',

  // Authentication errors
  SESSION_EXPIRED: 'SYNC_020',
  PARTNER_NOT_AVAILABLE: 'SYNC_021',
  COUPLE_AUTH_FAILED: 'SYNC_022',

  // Rate limiting errors
  RATE_LIMIT_EXCEEDED: 'SYNC_030',
  TOO_MANY_REQUESTS: 'SYNC_031',

  // System errors
  STORAGE_FULL: 'SYNC_040',
  BACKGROUND_WORKER_FAILED: 'SYNC_041',
  REALTIME_UPDATE_FAILED: 'SYNC_042',
} as const;

export type SyncErrorCode = typeof SYNC_ERROR_CODES[keyof typeof SYNC_ERROR_CODES];

// Sync constants
export const SYNC_CONSTANTS = {
  WEBSOCKET_RECONNECT_DELAY: [1000, 2000, 5000, 10000, 30000], // Progressive backoff: 1s, 2s, 5s, 10s, 30s
  MAX_RECONNECT_ATTEMPTS: 10,
  SYNC_TIMEOUT: 30000, // 30 seconds
  HEARTBEAT_INTERVAL: 30000, // 30 seconds
  QUEUE_MAX_SIZE: 100,
  BATCH_SYNC_SIZE: 50,
  OFFLINE_DETECTION_DELAY: 5000, // 5 seconds
  ACTIVITY_LIVE_UPDATE_INTERVAL: 10000, // 10 seconds
  DRAFT_SAVE_INTERVAL: 5000, // 5 seconds for draft saving
} as const;

// Media recording error codes
export const MEDIA_ERROR_CODES = {
  // Permission errors
  MICROPHONE_PERMISSION_DENIED: 'MEDIA_001',
  CAMERA_PERMISSION_DENIED: 'MEDIA_002',
  MEDIA_PERMISSION_BLOCKED: 'MEDIA_003',

  // Recording errors
  AUDIO_RECORDING_FAILED: 'MEDIA_010',
  VIDEO_RECORDING_FAILED: 'MEDIA_011',
  PHOTO_CAPTURE_FAILED: 'MEDIA_012',
  MEDIA_TOO_LARGE: 'MEDIA_013',

  // Network/API errors
  UPLOAD_TIMEOUT: 'MEDIA_020',
  UPLOAD_FAILED: 'MEDIA_021',
  UPLOAD_ABORTED: 'MEDIA_022',
  NETWORK_ERROR: 'MEDIA_023',

  // Validation errors
  INVALID_FILE_TYPE: 'MEDIA_030',
  NO_MEDIA_DATA: 'MEDIA_031',
  CORRUPTED_MEDIA: 'MEDIA_032',
  EMPTY_CONTENT: 'MEDIA_033',

  // System errors
  MEMORY_LEAK_DETECTED: 'MEDIA_040',
  BROWSER_NOT_SUPPORTED: 'MEDIA_041',
  STORAGE_FULL: 'MEDIA_042',
} as const;

export type MediaErrorCode = typeof MEDIA_ERROR_CODES[keyof typeof MEDIA_ERROR_CODES];

// Media recording constants
export const MEDIA_CONSTANTS = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_RECORDING_TIME: 10 * 60 * 1000, // 10 minutes
  VIDEO_QUALITY: { width: 1280, height: 720 },
  AUDIO_QUALITY: { sampleRate: 44100, channels: 2 },
  UPLOAD_TIMEOUT: 30000, // 30 seconds
  COMPRESSION_QUALITY: 0.8,
  CHUNK_SIZE: 1024 * 512, // 512KB chunks
} as const;

// UI Feedback messages
export const MEDIA_MESSAGES = {
  SUCCESS: {
    [MEDIA_ERROR_CODES.MICROPHONE_PERMISSION_DENIED]: 'Microphone ready for recording',
    [MEDIA_ERROR_CODES.CAMERA_PERMISSION_DENIED]: 'Camera ready for capturing',
    DEFAULT: 'Media recorded successfully',
  },
  ERROR: {
    [MEDIA_ERROR_CODES.MICROPHONE_PERMISSION_DENIED]: 'Please allow microphone access to record audio memories',
    [MEDIA_ERROR_CODES.CAMERA_PERMISSION_DENIED]: 'Please allow camera access to record video/photo memories',
    [MEDIA_ERROR_CODES.MEDIA_PERMISSION_BLOCKED]: 'Media permissions were blocked. Please check browser settings',
    [MEDIA_ERROR_CODES.MEDIA_TOO_LARGE]: 'File size exceeds 100MB limit. Please reduce size',
    [MEDIA_ERROR_CODES.UPLOAD_TIMEOUT]: 'Upload timeout. Please check connection and retry',
    [MEDIA_ERROR_CODES.UPLOAD_FAILED]: 'Upload failed. Please save as draft and retry',
    [MEDIA_ERROR_CODES.NETWORK_ERROR]: 'Network error. Please check connection',
    [MEDIA_ERROR_CODES.BROWSER_NOT_SUPPORTED]: 'Browser not supported. Please use a modern browser',
    DEFAULT: 'An unexpected error occurred',
  },
  WARNING: {
    [MEDIA_ERROR_CODES.UPLOAD_TIMEOUT]: 'Slow upload detected. Consider using smaller file',
    DEFAULT: 'Please complete current action before proceeding',
  },
} as const;

// GAMIFICATION Error codes
export const GAMIFICATION_ERROR_CODES = {
  // Calculation errors
  GAMI_001: 'Achievement calculation failed',
  GAMI_002: 'Experience calculation error',
  GAMI_003: 'Level progression error',
  GAMI_004: 'Reward calculation failed',

  // Transaction errors
  GAMI_010: 'Insufficient coins',
  GAMI_011: 'Reward redemption failed',
  GAMI_012: 'Transaction validation error',
  GAMI_013: 'Inventory update error',

  // Achievement errors
  GAMI_020: 'Achievement unlock failed',
  GAMI_021: 'Progress update error',
  GAMI_022: 'Badge awarding error',
  GAMI_023: 'Milestone calculation error',

  // Leaderboard errors
  GAMI_030: 'Ranking calculation failed',
  GAMI_031: 'Leaderboard update error',
  GAMI_032: 'Score validation error',
  GAMI_033: 'Position calculation error',

  // System errors
  GAMI_040: 'Worker calculation timeout',
  GAMI_041: 'Storage update failed',
  GAMI_042: 'Cache synchronization error',
  GAMI_043: 'Background task failed',
} as const;

export type GamificationErrorCode = typeof GAMIFICATION_ERROR_CODES[keyof typeof GAMIFICATION_ERROR_CODES];

// Gamification constants
export const GAMIFICATION_CONSTANTS = {
  // Experience calculations
  BASE_XP_PER_LEVEL: 100,
  XP_MULTIPLIER: 1.2,
  MAX_LEVEL: 50,
  LEVELUP_ANIMATION_DURATION: 2000,

  // Achievement settings
  ACHIEVEMENT_BATCH_SIZE: 10,
  PROGRESS_SAVE_INTERVAL: 5000,
  MILESTONE_CALCULATION_TIMEOUT: 5000,

  // Reward system
  QUEUE_MAX_SIZE: 50,
  TRANSACTION_TIMEOUT: 30000,
  REDUNDANCY_CHECK_INTERVAL: 30000,
  INVENTORY_REFRESH_RATE: 60000,

  // Leaderboard
  LEADERBOARD_UPDATE_INTERVAL: 15000,
  BATCH_SIZE_LARGE: 100,
  BATCH_SIZE_MEDIUM: 50,
  BATCH_SIZE_SMALL: 25,

  // Worker settings
  CALCULATION_TIMEOUT: 30000,
  WORKER_MESSAGE_TIMEOUT: 15000,
  BATCH_PROCESSING_LIMIT: 100,

  // Synchronization
  SYNC_INTERVAL: 30000,
  OFFLINE_CACHE_MAX_SIZE: 1000,
  QUEUE_PERSISTENCE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

import { envsafe, str } from 'envsafe';
import { z } from 'zod';
import { UnleashClient } from 'unleash-proxy-client';

// Validate and parse environment variables
const rawEnv = envsafe({
  DATABASE_URL: str({
    desc: 'Database connection string',
    default: '',
    allowEmpty: true,
  }),
  NEXTAUTH_SECRET: str({
    desc: 'Secret used by NextAuth',
    default: 'placeholder',
    allowEmpty: true,
  }),
  UNLEASH_URL: str({
    desc: 'URL of the Unleash proxy',
    default: '',
    allowEmpty: true,
  }),
  UNLEASH_CLIENT_KEY: str({
    desc: 'Client key for the Unleash proxy',
    default: '',
    allowEmpty: true,
  }),
  SENTRY_DSN: str({
    desc: 'Sentry DSN for error tracking',
    allowEmpty: true,
    default: '',
  }),
});

const envSchema = z.object({
  DATABASE_URL: z.string().optional().or(z.literal('')).transform(val => val || 'postgresql://default'),
  NEXTAUTH_SECRET: z.string().optional().or(z.literal('placeholder')),
  UNLEASH_URL: z.string().optional(),
  UNLEASH_CLIENT_KEY: z.string().optional(),
  SENTRY_DSN: z.string().url().optional().or(z.literal('')),
});

export const env = envSchema.parse(rawEnv);

export const featureClient =
  env.UNLEASH_URL && env.UNLEASH_CLIENT_KEY
    ? new UnleashClient({
        url: env.UNLEASH_URL,
        clientKey: env.UNLEASH_CLIENT_KEY,
        appName: 'latest-os',
      })
    : undefined;

featureClient?.start();
