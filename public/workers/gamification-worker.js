// Web Worker for Gamification Calculations
// This prevents main thread blocking for complex calculations

interface GamificationMessage {
  id: string;
  action: 'CALCULATE_LEVEL' | 'PROCESS_ACHIEVEMENTS' | 'UPDATE_LEADERBOARD' | 'CALCULATE_REWARDS' | 'BATCH_PROCESS';
  data?: {
    experience?: number;
    level?: number;
    achievements?: AchievementData[];
    leaderboard?: LeaderboardData[];
    transactions?: TransactionData[];
    userId?: string;
    batchData?: any[];
  };
}

interface AchievementData {
  id: string;
  progress: number;
  maxProgress: number;
  type: string;
  unlockCriteria: any;
  unlockedAt?: number;
}

interface LeaderboardData {
  userId: string;
  score: number;
  rank: number;
  changedAt: number;
}

interface TransactionData {
  userId: string;
  amount: number;
  type: 'earn' | 'spend';
  reason: string;
  timestamp: number;
}

interface GamificationResponse {
  id: string;
  success: boolean;
  type: 'CALCULATION' | 'ACHIEVEMENT' | 'LEADERBOARD' | 'REWARDS' | 'BATCH';
  error?: string;
  data?: any;
  timestamp: number;
  processingTime: number;
}

// Cached data for calculations
let achievementCache = new Map<string, AchievementData>();
let leaderboardCache = new Map<string, LeaderboardData[]>();
let calculationQueue: GamificationMessage[] = [];

// Constants (inline for worker)
const BASE_XP_PER_LEVEL = 100;
const XP_MULTIPLIER = 1.2;
const MAX_LEVEL = 50;

function calculateLevel(experience: number): { level: number; nextLevelXP: number; progress: number } {
  const rawLevel = Math.floor(experience / BASE_XP_PER_LEVEL);
  const level = Math.min(Math.max(1, Math.floor(rawLevel * XP_MULTIPLIER)), MAX_LEVEL);

  const xpForCurrentLevel = Math.floor((level - 1) / XP_MULTIPLIER) * BASE_XP_PER_LEVEL;
  const xpForNextLevel = Math.floor(level / XP_MULTIPLIER) * BASE_XP_PER_LEVEL;

  const progress = ((experience - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  return {
    level: Math.min(level, MAX_LEVEL),
    nextLevelXP: xpForNextLevel,
    progress: Math.min(progress, 100),
  };
}

function processAchievements(achievements: AchievementData[]): AchievementData[] {
  const processed: AchievementData[] = [];

  achievements.forEach(achievement => {
    // Check if achievement should be unlocked
    const isUnlocked = checkAchievementUnlock(achievement);

    if (isUnlocked) {
      processed.push({
        ...achievement,
        progress: achievement.maxProgress, // Mark as complete
        unlockedAt: Date.now(),
      });

      // Update cache
      achievementCache.set(achievement.id, { ...achievement, progress: achievement.maxProgress });
    } else {
      processed.push(achievement);
    }
  });

  return processed;
}

function checkAchievementUnlock(achievement: AchievementData): boolean {
  const { type, progress, maxProgress, unlockCriteria } = achievement;

  // Different unlock logic based on type
  switch (type) {
    case 'progress':
      return progress >= maxProgress;

    case 'milestone':
      return progress === unlockCriteria?.target;

    case 'streak':
      return progress >= unlockCriteria?.requiredStreak;

    case 'cumulative':
      return progress >= unlockCriteria?.totalRequired;

    default:
      return false;
  }
}

function updateLeaderboard(newScores: LeaderboardData[]): LeaderboardData[] {
  // Merge with cached leaderboard
  const currentCache = leaderboardCache.get('global') || [];
  const merged = [...currentCache];

  // Update or add new scores
  newScores.forEach(newScore => {
    const existingIndex = merged.findIndex(score => score.userId === newScore.userId);

    if (existingIndex >= 0) {
      merged[existingIndex] = newScore;
    } else {
      merged.push(newScore);
    }
  });

  // Sort by score (descending)
  merged.sort((a, b) => b.score - a.score);

  // Update ranks
  merged.forEach((score, index) => {
    score.rank = index + 1;
  });

  // Cache results
  leaderboardCache.set('global', merged);

  return merged;
}

function calculateRewards(transactions: TransactionData[]): any {
  const summary = {
    totalEarned: 0,
    totalSpent: 0,
    netGain: 0,
    recentTransactions: [] as TransactionData[],
    balance: 0,
  };

  // Calculate totals
  transactions.forEach(tx => {
    if (tx.type === 'earn') {
      summary.totalEarned += tx.amount;
      summary.balance += tx.amount;
    } else if (tx.type === 'spend') {
      summary.totalSpent += tx.amount;
      summary.balance -= tx.amount;
    }
  });

  summary.netGain = summary.totalEarned - summary.totalSpent;

  // Recent transactions (last 10)
  summary.recentTransactions = transactions
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);

  return summary;
}

function batchProcess(queue: GamificationMessage[]): GamificationResponse[] {
  const results: GamificationResponse[] = [];
  const startTime = performance.now();

  queue.forEach((message, index) => {
    try {
      const result = processMessage(message);
      results.push(result);
    } catch (error) {
      results.push({
        id: message.id,
        success: false,
        type: 'BATCH',
        error: `Processing failed: ${error}`,
        timestamp: Date.now(),
        processingTime: performance.now() - startTime,
      });
    }
  });

  return results;
}

function processMessage(message: GamificationMessage): GamificationResponse {
  const processingStart = performance.now();
  const startTime = Date.now();

  let result: any;
  let type: GamificationResponse['type'];

  try {
    switch (message.action) {
      case 'CALCULATE_LEVEL':
        const levelResult = calculateLevel(message.data!.experience || 0);
        result = levelResult;
        type = 'CALCULATION';
        break;

      case 'PROCESS_ACHIEVEMENTS':
        const processedAchievements = processAchievements(message.data!.achievements || []);
        result = processedAchievements;
        type = 'ACHIEVEMENT';
        break;

      case 'UPDATE_LEADERBOARD':
        const updatedLeaderboard = updateLeaderboard(message.data!.leaderboard || []);
        result = updatedLeaderboard;
        type = 'LEADERBOARD';
        break;

      case 'CALCULATE_REWARDS':
        const rewardSummary = calculateRewards(message.data!.transactions || []);
        result = rewardSummary;
        type = 'REWARDS';
        break;

      default:
        throw new Error(`Unknown action: ${message.action}`);
    }

    return {
      id: message.id,
      success: true,
      type,
      data: result,
      timestamp: startTime,
      processingTime: performance.now() - processingStart,
    };

  } catch (error) {
    return {
      id: message.id,
      success: false,
      type: 'CALCULATION',
      error: error instanceof Error ? error.message : 'Calculation failed',
      timestamp: startTime,
      processingTime: performance.now() - processingStart,
    };
  }
}

function postMessage(response: GamificationResponse) {
  (self as any).postMessage(response);
}

// Message handler
self.addEventListener('message', (event: MessageEvent<GamificationMessage>) => {
  const { id, action, data } = event.data;

  if (action === 'BATCH_PROCESS' && data?.batchData) {
    // Handle batch processing
    const queue = data.batchData as GamificationMessage[];
    const results = batchProcess(queue);

    postMessage({
      id,
      success: true,
      type: 'BATCH',
      data: results,
      timestamp: Date.now(),
      processingTime: 0,
    });
  } else {
    // Handle single message
    const result = processMessage(event.data);
    postMessage(result);
  }
});

// Auto-cleanup stale cache data
setInterval(() => {
  // Clear old achievement data (older than 30 minutes)
  const now = Date.now();
  const maxAge = 30 * 60 * 1000;

  achievementCache.forEach((data, key) => {
    if (data.unlockedAt && now - data.unlockedAt > maxAge) {
      achievementCache.delete(key);
    }
  });

  // Clear old leaderboard data (older than 1 hour)
  const cacheAge = 60 * 60 * 1000;
  leaderboardCache.forEach((data, key) => {
    const oldestTimestamp = Math.min(...data.map(d => d.changedAt || 0));
    if (now - oldestTimestamp > cacheAge) {
      leaderboardCache.delete(key);
    }
  });
}, 60000); // Every minute
