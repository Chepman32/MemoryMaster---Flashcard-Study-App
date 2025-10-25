export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  hint?: string;
  tags?: string[];
  imageUrl?: string;
  audioUrl?: string;
  cardType: 'basic' | 'reversed' | 'cloze' | 'image-occlusion' | 'type-answer';

  // Spaced Repetition
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueDate: Date;
  lastReviewed?: Date;
  state: 'new' | 'learning' | 'young' | 'mature' | 'relearning' | 'suspended';

  createdAt: Date;
  updatedAt: Date;
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color: string;
  tags?: string[];

  // Stats
  totalCards: number;
  newCards: number;
  learningCards: number;
  reviewCards: number;
  masteredCards: number;

  // Settings
  newCardsPerDay: number;
  maxReviewsPerDay: number;

  createdAt: Date;
  updatedAt: Date;
  lastStudied?: Date;
}

export interface StudySession {
  id: string;
  deckId: string;
  startTime: Date;
  endTime?: Date;
  cardsStudied: number;
  newCardsLearned: number;

  // Results
  againCount: number;
  hardCount: number;
  goodCount: number;
  easyCount: number;

  duration: number; // milliseconds
  xpEarned: number;
}

export interface DifficultyResponse {
  quality: 0 | 1 | 2 | 3 | 4 | 5;
  label: 'again' | 'hard' | 'good' | 'easy';
}

export interface StudyStats {
  date: Date;
  cardsStudied: number;
  timeSpent: number;
  retentionRate: number;
  newCards: number;
  reviewCards: number;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  studyReminders: boolean;
  dailyGoal: number;
  soundEffects: boolean;
  hapticFeedback: boolean;
  showTimer: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  swipeGestures: boolean;
  premiumStatus: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
