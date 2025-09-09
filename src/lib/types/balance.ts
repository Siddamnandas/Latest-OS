export interface ArchetypeBalance {
  krishna: number;
  ram: number;
  shiva: number;
}

export interface BalanceAssessment {
  id: string;
  coupleId: string;
  assessedAt: Date;
  balance: ArchetypeBalance;
  totalScore: number;
  recommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BalanceAnswer {
  questionId: string;
  archetype: 'krishna' | 'ram' | 'shiva';
  score: number;
  weight: number;
}

export interface BalanceQuestion {
  id: string;
  category: string;
  question: string;
  options: Array<{
    text: string;
    archetype: 'krishna' | 'ram' | 'shiva';
    score: number;
  }>;
  weight: number;
}

export interface BalanceRecommendations {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
}

export interface RasaBalance {
  krishna: number; // Joy, play, romance
  sira: number;    // Sorrow, intensity, depth
  hasya: number;   // Laughter, comedy, lightness
  adbhuta: number; // Wonder, amazement
  raudra: number;  // Anger, intensity
  bhayanaka: number; // Fear, terror
  vira: number;    // Heroism, bravery
  karuna: number;  // Compassion, sympathy
  santi: number;   // Peace, equanimity
}

export interface ArchetypalHealthData {
  balance: ArchetypeBalance;
  health: 'excellent' | 'good' | 'fair' | 'concerning' | 'poor';
  dominantArchetype: 'krishna' | 'ram' | 'shiva';
  imbalanceAreas: string[];
  recommendations: string[];
  lastUpdated: Date;
}
