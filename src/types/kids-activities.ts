// Production-Ready Kids Activities Types
// Comprehensive data models for all features

import { ReactNode } from 'react';

// Core User & Profile Types
export interface KidsProfile {
  id: string;
  name: string;
  age: number;
  ageGroup: 'toddler' | 'preschool' | 'elementary' | 'preteen';
  avatar: string;
  preferences: {
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
    favoriteActivities: ActivityType[];
    difficulty: 'easy' | 'medium' | 'hard';
    parentalControls: ParentalControls;
  };
  progress: UserProgress;
  achievements: Achievement[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ParentalControls {
  screenTimeLimit: number; // minutes per day
  allowedTimeSlots: TimeSlot[];
  contentFilters: string[];
  requireParentApproval: boolean;
  accessibilityEnabled: boolean;
  highContrastMode: boolean;
  textToSpeechEnabled: boolean;
}

export interface TimeSlot {
  start: string; // HH:MM format
  end: string;
  days: number[]; // 0-6 (Sunday-Saturday)
}

// Activity & Learning Types
export type ActivityType = 'emotion' | 'mythology' | 'creativity' | 'kindness' | 'story' | 'music' | 'movement';

export interface BaseActivity {
  id: string;
  title: string;
  description: string;
  type: ActivityType;
  difficulty: 'easy' | 'medium' | 'hard';
  ageRange: {
    min: number;
    max: number;
  };
  estimatedDuration: number; // minutes
  tags: string[];
  instructions: ActivityInstruction[];
  materials: string[];
  learningObjectives: string[];
  parentGuidance?: string;
  safetyNotes?: string[];
  accessibility: AccessibilityFeatures;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityInstruction {
  step: number;
  title: string;
  description: string;
  visualAid?: string; // image/video URL
  audioGuide?: string; // audio URL
  interactionType: 'read' | 'tap' | 'draw' | 'speak' | 'move';
}

export interface AccessibilityFeatures {
  screenReaderSupport: boolean;
  voiceNavigation: boolean;
  largeText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  audioDescriptions: boolean;
}

// Emotion Learning Types
export interface EmotionScenario extends BaseActivity {
  character: MythologicalCharacter;
  situation: string;
  emotions: EmotionData[];
  correctResponses: string[];
  discussionPrompts: string[];
  followUpActivities: string[];
}

export interface EmotionData {
  name: string;
  emoji: string;
  description: string;
  triggers: string[];
  copingStrategies: string[];
  bodySignals: string[];
}

export interface MythologicalCharacter {
  name: string;
  description: string;
  traits: string[];
  stories: string[];
  lessons: string[];
  visualRepresentation: string;
  pronunciationGuide?: string;
}

// Kindness & Character Building
export interface KindnessActivity extends BaseActivity {
  category: 'sharing' | 'helping' | 'empathy' | 'gratitude' | 'respect';
  realLifeExamples: string[];
  reflectionQuestions: string[];
  parentChildDiscussion: string[];
  communityImpact?: string;
}

export interface KindnessMoment {
  id: string;
  userId: string;
  date: Date;
  description: string;
  category: string;
  points: number;
  verified: boolean;
  photos?: string[];
  witnessedBy?: string[];
  impact: string;
  reflection: string;
  parentFeedback?: string;
}

// Mythology & Cultural Learning
export interface MythologyContent extends BaseActivity {
  character: MythologicalCharacter;
  story: Story;
  culturalContext: string;
  modernApplication: string;
  questions: Question[];
  activities: RelatedActivity[];
}

export interface Story {
  title: string;
  summary: string;
  fullNarrative: string;
  moralLesson: string;
  keyCharacters: MythologicalCharacter[];
  setting: string;
  plot: PlotPoint[];
  audioNarration?: string;
  illustrations: string[];
}

export interface PlotPoint {
  sequence: number;
  event: string;
  lesson?: string;
  emotion?: string;
}

export interface Question {
  id: string;
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hints: string[];
}

export interface RelatedActivity {
  id: string;
  title: string;
  type: ActivityType;
  description: string;
}

// Creative Expression
export interface CreativeActivity extends BaseActivity {
  medium: 'drawing' | 'music' | 'dance' | 'storytelling' | 'crafts' | 'theater';
  supplies: Supply[];
  techniques: Technique[];
  inspirationSources: string[];
  skillsBuilt: string[];
  sharingOptions: SharingOption[];
}

export interface Supply {
  name: string;
  required: boolean;
  alternatives: string[];
  safetyNotes?: string[];
}

export interface Technique {
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tutorial?: string; // video URL
  tips: string[];
}

export interface SharingOption {
  platform: 'family' | 'classroom' | 'community' | 'digital_portfolio';
  privacy: 'private' | 'family_only' | 'public';
  moderation: boolean;
}

// Progress Tracking & Analytics
export interface UserProgress {
  totalActivitiesCompleted: number;
  skillsAcquired: Skill[];
  currentStreak: number;
  longestStreak: number;
  kindnessPoints: number;
  creativityScore: number;
  emotionalIntelligenceLevel: number;
  weeklyGoals: Goal[];
  monthlyMilestones: Milestone[];
  learningPath: LearningPath;
}

export interface Skill {
  id: string;
  name: string;
  category: ActivityType;
  level: number; // 1-10
  xpRequired: number;
  currentXp: number;
  badgeEarned?: Badge;
  dateAcquired: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
  category: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: string[];
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  deadline: Date;
  category: ActivityType;
  reward?: Reward;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  dateAchieved?: Date;
  celebration?: CelebrationData;
}

export interface Reward {
  type: 'badge' | 'avatar_item' | 'special_activity' | 'certificate';
  item: string;
  description: string;
}

export interface CelebrationData {
  type: 'confetti' | 'animation' | 'sound' | 'special_message';
  content: string;
  duration: number;
}

export interface LearningPath {
  currentLevel: number;
  nextMilestone: Milestone;
  recommendedActivities: string[];
  weakAreas: string[];
  strengthAreas: string[];
  adaptiveContent: boolean;
}

// Family & Social Features
export interface FamilyGroup {
  id: string;
  name: string;
  members: FamilyMember[];
  sharedActivities: SharedActivity[];
  familyGoals: Goal[];
  storybook: FamilyStorybook;
  settings: FamilySettings;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: 'parent' | 'guardian' | 'child' | 'grandparent' | 'sibling';
  avatar: string;
  permissions: Permission[];
}

export interface Permission {
  action: string;
  allowed: boolean;
  conditions?: string[];
}

export interface SharedActivity {
  activityId: string;
  participants: string[];
  scheduledFor?: Date;
  completed: boolean;
  photos?: string[];
  notes?: string;
  rating?: number;
}

export interface FamilyStorybook {
  id: string;
  title: string;
  entries: StorybookEntry[];
  settings: StorybookSettings;
  sharing: SharingSettings;
}

export interface StorybookEntry {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: 'activity' | 'milestone' | 'memory' | 'learning';
  activityType?: ActivityType;
  participants: string[];
  media: MediaItem[];
  tags: string[];
  mood: string;
  learningOutcome?: string;
  parentReflection?: string;
  childQuote?: string;
}

export interface MediaItem {
  type: 'photo' | 'video' | 'audio' | 'drawing';
  url: string;
  caption?: string;
  timestamp: Date;
  createdBy: string;
}

export interface StorybookSettings {
  autoCapture: boolean;
  includeProgress: boolean;
  privacyLevel: 'private' | 'family' | 'extended_family';
  exportFormat: 'pdf' | 'digital' | 'print';
}

export interface SharingSettings {
  allowSharing: boolean;
  approvalRequired: boolean;
  platforms: string[];
  watermark: boolean;
}

export interface FamilySettings {
  timeZone: string;
  language: string;
  currency: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  safety: SafetySettings;
}

// System & Technical Types
export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  scheduleReminders: boolean;
  achievementAlerts: boolean;
  weeklyReports: boolean;
}

export interface PrivacySettings {
  dataCollection: boolean;
  analytics: boolean;
  thirdPartySharing: boolean;
  locationTracking: boolean;
  voiceRecording: boolean;
}

export interface SafetySettings {
  contentModeration: boolean;
  inappropriateContentFilter: boolean;
  cyberbullyingDetection: boolean;
  emergencyContacts: string[];
  safetyPhrases: string[];
}

// AI & Personalization
export interface AIPersonalization {
  userId: string;
  learningStyle: LearningStyleData;
  adaptiveContent: AdaptiveContent;
  recommendations: Recommendation[];
  insights: LearningInsight[];
  predictions: LearningPrediction[];
}

export interface LearningStyleData {
  visual: number; // 0-100
  auditory: number;
  kinesthetic: number;
  readingWriting: number;
  social: number;
  solitary: number;
}

export interface AdaptiveContent {
  difficultyAdjustment: number; // -2 to +2
  contentPacing: 'slow' | 'normal' | 'fast';
  repetitionNeeded: boolean;
  preferredFormat: 'text' | 'audio' | 'video' | 'interactive';
  attentionSpan: number; // minutes
}

export interface Recommendation {
  type: 'activity' | 'skill' | 'goal' | 'break';
  content: string;
  reasoning: string;
  priority: 'low' | 'medium' | 'high';
  timing: 'now' | 'today' | 'this_week' | 'later';
}

export interface LearningInsight {
  category: string;
  insight: string;
  confidence: number; // 0-100
  actionable: boolean;
  recommendations: string[];
  dataPoints: number;
}

export interface LearningPrediction {
  skill: string;
  projectedLevel: number;
  timeToAchieve: number; // days
  confidence: number;
  prerequisites: string[];
}

// API & State Management Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
  message?: string;
  timestamp: Date;
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
  stack?: string;
}

export interface LoadingState {
  activities: boolean;
  profile: boolean;
  progress: boolean;
  family: boolean;
  storybook: boolean;
}

export interface AppState {
  user: KidsProfile | null;
  family: FamilyGroup | null;
  currentActivity: BaseActivity | null;
  loading: LoadingState;
  errors: Record<string, string>;
  offline: boolean;
  lastSync: Date | null;
}

// Component Props Types
export interface ActivityCardProps {
  activity: BaseActivity;
  onStart: (activity: BaseActivity) => void;
  onComplete: (activity: BaseActivity, result: ActivityResult) => void;
  disabled?: boolean;
  showProgress?: boolean;
}

export interface ActivityResult {
  activityId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  completed: boolean;
  score?: number;
  answers?: Record<string, any>;
  reflection?: string;
  parentFeedback?: string;
  media?: MediaItem[];
}

// Utility Types
export type ActivityFilter = {
  type?: ActivityType[];
  difficulty?: ('easy' | 'medium' | 'hard')[];
  duration?: {
    min: number;
    max: number;
  };
  ageRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
  completed?: boolean;
};

export type SortOption = 'name' | 'difficulty' | 'duration' | 'age' | 'popularity' | 'recent';

export type ViewMode = 'grid' | 'list' | 'carousel';

// Theme & Customization
export interface ThemeData {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  animations: boolean;
  sounds: boolean;
  haptics: boolean;
}

export interface CustomizationOptions {
  theme: ThemeData;
  language: string;
  voiceSettings: VoiceSettings;
  displaySettings: DisplaySettings;
}

export interface VoiceSettings {
  enabled: boolean;
  voice: string;
  speed: number; // 0.5-2.0
  pitch: number; // 0.5-2.0
  volume: number; // 0-100
}

// Legacy interface aliases for backward compatibility
export type MythologicalQuestion = MythologyContent;
export interface ThemedDay {
  id: string;
  name: string;
  character: string;
  essence: string;
  color: string;
  icon: React.ReactNode;
  description: string;
  parentRole: string;
}
export interface KrishnaPrank {
  id: string;
  title: string;
  helperParent: string;
  targetParent: string;
  prompt: string;
  instructions: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
}
export interface HanumanTask {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  materials: string[];
  celebrationPrompt: string;
}
export type SaraswatiCreative = CreativeActivity;

export interface DisplaySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  contrast: 'normal' | 'high';
  colorBlindSupport: boolean;
  reducedMotion: boolean;
  darkMode: boolean;
}