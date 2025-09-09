import { useState, useEffect, createContext, useContext } from 'react';

export interface LakshmiTransaction {
  id: string;
  type: 'earned' | 'spent' | 'bonus';
  amount: number;
  reason: string;
  timestamp: Date;
  source: string;
  icon?: string;
  animation?: boolean;
}

export interface LakshmiQuest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'couple' | 'personal' | 'special';
  coinReward: number;
  requiredActions: string[];
  completedActions: string[];
  isCompleted: boolean;
  expiresAt?: Date;
  progress: number;
  maxProgress: number;
}

export interface LakshmiReward {
  id: string;
  name: string;
  description: string;
  icon: string;
  coinCost: number;
  category: 'premium' | 'digital' | 'physical' | 'experience';
  available: boolean;
  claimed?: boolean;
  claimDate?: Date;
}

export interface GamificationState {
  coins: number;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  coinMultiplier: number;
  streak: number;
  totalEarned: number;
  totalSpent: number;
  loginStreak: number;
  achievementsUnlocked: string[];
  activeQuests: LakshmiQuest[];
  availableRewards: LakshmiReward[];
  transactionHistory: LakshmiTransaction[];
}

// Lakshmi Coins Context
const LakshmiContext = createContext<{
  gamificationState: GamificationState;
  updateCoins: (amount: number, reason: string, source: string, type: 'earned' | 'spent' | 'bonus') => void;
  addQuest: (quest: LakshmiQuest) => void;
  completeQuest: (questId: string) => void;
  unlockReward: (rewardId: string) => Promise<boolean>;
  resetDailyQuests: () => void;
  getQuestByAction: (action: string) => LakshmiQuest | null;
} | null>(null);

export function useGamification() {
  const context = useContext(LakshmiContext);
  if (!context) {
    throw new Error('useGamification must be used within a LakshmiProvider');
  }
  return context;
}

// Lakshmi Provider Component
export function LakshmiProvider({ children }: { children: React.ReactNode }) {
  const [gamificationState, setGamificationState] = useState<GamificationState>({
    coins: 1250,
    level: 7,
    experience: 2450,
    experienceToNextLevel: 2800,
    coinMultiplier: 1.0,
    streak: 5,
    totalEarned: 2500,
    totalSpent: 1250,
    loginStreak: 12,
    achievementsUnlocked: ['first_sync', 'week_warrior', 'coin_collector'],
    activeQuests: [
      {
        id: 'daily_sync_001',
        title: 'Daily Sync Champion',
        description: 'Complete your daily romantic sync',
        type: 'daily',
        coinReward: 50,
        requiredActions: ['sync_completed'],
        completedActions: [],
        isCompleted: false,
        progress: 0,
        maxProgress: 1,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      {
        id: 'couple_memory_001',
        title: 'Memory Makers',
        description: 'Create a shared memory together',
        type: 'couple',
        coinReward: 75,
        requiredActions: ['memory_created', 'memory_shared'],
        completedActions: [],
        isCompleted: false,
        progress: 0,
        maxProgress: 2
      },
      {
        id: 'intimacy_boost_001',
        title: 'Intimacy Builder',
        description: 'Complete 3 relationship activities',
        type: 'couple',
        coinReward: 100,
        requiredActions: ['activity_completed', 'activity_completed', 'activity_completed'],
        completedActions: [],
        isCompleted: false,
        progress: 0,
        maxProgress: 3
      }
    ],
    availableRewards: [
      {
        id: 'premium_theme_001',
        name: 'Romantic Sunset Theme',
        description: 'Transform your home screen with a beautiful sunset theme',
        icon: '🌅',
        coinCost: 100,
        category: 'digital',
        available: true
      },
      {
        id: 'virtual_candlelight_001',
        name: 'Virtual Candlelight Dinner',
        description: 'A guided virtual reality ambiance experience',
        icon: '🕯️',
        coinCost: 150,
        category: 'experience',
        available: true
      },
      {
        id: 'love_letter_writer_001',
        name: 'Love Letter Writer',
        description: 'AI assistance to write beautiful love letters',
        icon: '💌',
        coinCost: 75,
        category: 'digital',
        available: true
      },
      {
        id: 'relationship_insight_001',
        name: 'Relationship Insight Report',
        description: 'Comprehensive monthly relationship analysis',
        icon: '📊',
        coinCost: 200,
        category: 'digital',
        available: true
      },
      {
        id: 'couple_photo_frame_001',
        name: 'Digital Photo Frame',
        description: 'Animated frame featuring your favorite memories',
        icon: '🖼️',
        coinCost: 125,
        category: 'digital',
        available: true
      }
    ],
    transactionHistory: [
      {
        id: 'txn_001',
        type: 'earned',
        amount: 50,
        reason: 'Completed daily sync',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        source: 'daily_sync',
        icon: '🎁',
        animation: true
      },
      {
        id: 'txn_002',
        type: 'earned',
        amount: 25,
        reason: 'Created shared memory',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        source: 'memory_creation'
      },
      {
        id: 'txn_003',
        type: 'spent',
        amount: -75,
        reason: 'Purchased love letter writer',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        source: 'reward_redemption'
      }
    ]
  });

  // Update coins with visual effects and logging
  const updateCoins = (
    amount: number,
    reason: string,
    source: string,
    type: 'earned' | 'spent' | 'bonus' = 'earned'
  ) => {
    setGamificationState(prev => {
      const newCoins = prev.coins + amount;
      const newTotalEarned = type === 'earned' ? prev.totalEarned + amount :
                           prev.totalEarned;
      const newTotalSpent = type === 'spent' ? prev.totalSpent + Math.abs(amount) :
                          prev.totalSpent;

      // Check for level up
      const newExperience = type === 'earned' ? prev.experience + Math.abs(amount) :
                        prev.experience;
      const newLevel = Math.floor(newExperience / 1000) + 1;
      const newExperienceToNextLevel = (newLevel + 1) * 1000;

      // New transaction
      const transaction: LakshmiTransaction = {
        id: `txn_${Date.now()}`,
        type,
        amount: Math.abs(amount),
        reason,
        timestamp: new Date(),
        source,
        icon: type === 'earned' ? '🪙' : type === 'spent' ? '💰' : '🛍️',
        animation: type === 'earned' || type === 'bonus'
      };

      return {
        ...prev,
        coins: Math.max(0, newCoins),
        level: newLevel,
        experience: newExperience,
        experienceToNextLevel: newExperienceToNextLevel,
        totalEarned: newTotalEarned,
        totalSpent: newTotalSpent,
        transactionHistory: [transaction, ...prev.transactionHistory.slice(0, 49)] // Keep last 50
      };
    });
  };

  // Quest management
  const addQuest = (quest: LakshmiQuest) => {
    setGamificationState(prev => ({
      ...prev,
      activeQuests: [...prev.activeQuests, quest]
    }));
  };

  const completeQuest = (questId: string) => {
    setGamificationState(prev => {
      const quest = prev.activeQuests.find(q => q.id === questId);
      if (!quest || quest.isCompleted) return prev;

      // Award coins for quest completion
      setTimeout(() => {
        updateCoins(
          quest.coinReward,
          `Quest completed: ${quest.title}`,
          'quest_completion',
          'earned'
        );
      }, 500);

      return {
        ...prev,
        activeQuests: prev.activeQuests.map(q =>
          q.id === questId
            ? { ...q, isCompleted: true, progress: q.maxProgress }
            : q
        )
      };
    });
  };

  // Reward redemption
  const unlockReward = async (rewardId: string): Promise<boolean> => {
    const reward = gamificationState.availableRewards.find(r => r.id === rewardId);
    if (!reward || gamificationState.coins < reward.coinCost) {
      return false;
    }

    // Deduct coins
    updateCoins(
      -reward.coinCost,
      `Redeemed: ${reward.name}`,
      'reward_redemption',
      'spent'
    );

    // Mark reward as claimed
    setGamificationState(prev => ({
      ...prev,
      availableRewards: prev.availableRewards.map(r =>
        r.id === rewardId
          ? { ...r, claimed: true, claimDate: new Date() }
          : r
      )
    }));

    return true;
  };

  // Reset daily quests
  const resetDailyQuests = () => {
    setGamificationState(prev => ({
      ...prev,
      activeQuests: prev.activeQuests.map(quest =>
        quest.type === 'daily'
          ? {
              ...quest,
              completedActions: [],
              isCompleted: false,
              progress: 0,
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
          : quest
      )
    }));
  };

  // Get quest that includes specific action
  const getQuestByAction = (action: string): LakshmiQuest | null => {
    return gamificationState.activeQuests.find(quest =>
      quest.requiredActions.includes(action) &&
      !quest.isCompleted &&
      quest.progress < quest.maxProgress
    ) || null;
  };

  // Complete quest actions automatically
  const completeQuestAction = (action: string) => {
    setGamificationState(prev => {
      return {
        ...prev,
        activeQuests: prev.activeQuests.map(quest => {
          if (quest.requiredActions.includes(action) &&
              !quest.isCompleted &&
              quest.progress < quest.maxProgress) {
            const completedCount = quest.completedActions.filter(a => a === action).length;
            const remainingActionIndex = quest.completedActions.length - completedCount;
            const newAction = quest.requiredActions[remainingActionIndex] || action;

            const newCompletedActions = [...quest.completedActions, newAction];
            const newProgress = Math.min(quest.maxProgress, newCompletedActions.length);

            const shouldComplete = newProgress >= quest.maxProgress;

            if (shouldComplete) {
              // Award coins when quest completes
              setTimeout(() => {
                updateCoins(
                  quest.coinReward,
                  `Quest completed: ${quest.title}`,
                  'quest_completion',
                  'earned'
                );
              }, 500);
            }

            return {
              ...quest,
              completedActions: newCompletedActions,
              progress: newProgress,
              isCompleted: shouldComplete
            };
          }
          return quest;
        })
      };
    });
  };

  // Auto-play gamification for user actions
  useEffect(() => {
    const notifyGamificationSystem = (event: CustomEvent) => {
      const { action, context } = event.detail || {};
      if (!action) return;

      // Reward different actions
      const actionRewards = {
        'sync_completed': { coins: 50, reason: 'Daily sync completed', animation: true },
        'memory_created': { coins: 25, reason: 'New memory created' },
        'memory_shared': { coins: 25, reason: 'Memory shared with partner' },
        'task_completed': { coins: 30, reason: 'Couple task completed' },
        'activity_completed': { coins: 40, reason: 'Relationship activity done' },
        'nudged_accepted': { coins: 10, reason: 'AI nudge acted upon' },
        'login_daily': { coins: 5, reason: 'Daily login bonus' }
      };

      const reward = actionRewards[action as keyof typeof actionRewards];
      if (reward) {
        updateCoins(reward.coins, reward.reason, action, 'earned');
      }

      // Update quests
      completeQuestAction(action);
    };

    document.addEventListener('gamification:action', notifyGamificationSystem as EventListener);

    return () => {
      document.removeEventListener('gamification:action', notifyGamificationSystem as EventListener);
    };
  }, []);

  const contextValue = {
    gamificationState,
    updateCoins,
    addQuest,
    completeQuest,
    unlockReward,
    resetDailyQuests,
    getQuestByAction
  };

  return (
    <LakshmiContext.Provider value={contextValue}>
      {children}
    </LakshmiContext.Provider>
  );
}

export default useGamification;
