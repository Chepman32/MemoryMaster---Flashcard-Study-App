import {Flashcard, DifficultyResponse} from '../types';

/**
 * SM-2 Spaced Repetition Algorithm
 * Based on SuperMemo 2 algorithm
 */

const MIN_EASE_FACTOR = 1.3;
const MAX_EASE_FACTOR = 2.5;
const INITIAL_EASE_FACTOR = 2.5;

export interface SM2Result {
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueDate: Date;
  state: Flashcard['state'];
}

/**
 * Calculate next review parameters using SM-2 algorithm
 */
export function calculateNextReview(
  card: Flashcard,
  quality: DifficultyResponse['quality'],
): SM2Result {
  const {easeFactor, interval, repetitions} = card;

  let newEaseFactor = easeFactor;
  let newInterval = interval;
  let newRepetitions = repetitions;
  let state: Flashcard['state'] = card.state;

  // Update ease factor based on quality
  newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEaseFactor = Math.max(MIN_EASE_FACTOR, Math.min(MAX_EASE_FACTOR, newEaseFactor));

  // Failed card (quality < 3)
  if (quality < 3) {
    newRepetitions = 0;
    newInterval = 1; // Review again tomorrow
    state = card.state === 'new' ? 'learning' : 'relearning';
  } else {
    // Successful recall
    newRepetitions = repetitions + 1;

    if (newRepetitions === 1) {
      newInterval = 1; // 1 day
      state = 'learning';
    } else if (newRepetitions === 2) {
      newInterval = 6; // 6 days
      state = 'young';
    } else {
      // Calculate interval using SM-2 formula
      newInterval = Math.round(interval * newEaseFactor);

      // Apply quality modifier
      if (quality === 5) {
        // Easy - increase interval
        newInterval = Math.round(newInterval * 1.3);
      } else if (quality === 2) {
        // Hard - decrease interval
        newInterval = Math.round(newInterval * 1.2);
      }

      // Determine state based on interval
      if (newInterval >= 21) {
        state = 'mature';
      } else {
        state = 'young';
      }
    }
  }

  // Apply fuzz factor to spread reviews
  if (newInterval > 7) {
    const fuzzRange = Math.max(1, Math.floor(newInterval * 0.05));
    const fuzz = Math.floor(Math.random() * (fuzzRange * 2 + 1)) - fuzzRange;
    newInterval = Math.max(1, newInterval + fuzz);
  }

  // Calculate due date
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + newInterval);

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    dueDate,
    state,
  };
}

/**
 * Get interval preview for each difficulty button
 */
export function getIntervalPreviews(card: Flashcard): {
  again: string;
  hard: string;
  good: string;
  easy: string;
} {
  const again = calculateNextReview(card, 0);
  const hard = calculateNextReview(card, 2);
  const good = calculateNextReview(card, 3);
  const easy = calculateNextReview(card, 5);

  const formatInterval = (days: number): string => {
    if (days < 1) return '< 1d';
    if (days === 1) return '1d';
    if (days < 30) return `${days}d`;
    if (days < 365) return `${Math.round(days / 30)}mo`;
    return `${Math.round(days / 365)}y`;
  };

  return {
    again: formatInterval(again.interval),
    hard: formatInterval(hard.interval),
    good: formatInterval(good.interval),
    easy: formatInterval(easy.interval),
  };
}

/**
 * Initialize a new card with default SM-2 values
 */
export function initializeCard(cardData: Partial<Flashcard>): Flashcard {
  return {
    id: cardData.id || generateId(),
    deckId: cardData.deckId || '',
    front: cardData.front || '',
    back: cardData.back || '',
    hint: cardData.hint,
    tags: cardData.tags || [],
    imageUrl: cardData.imageUrl,
    audioUrl: cardData.audioUrl,
    cardType: cardData.cardType || 'basic',
    easeFactor: INITIAL_EASE_FACTOR,
    interval: 0,
    repetitions: 0,
    dueDate: new Date(),
    state: 'new',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Get cards due for review
 */
export function getDueCards(cards: Flashcard[]): Flashcard[] {
  const now = new Date();
  return cards.filter(card => new Date(card.dueDate) <= now && card.state !== 'suspended');
}

/**
 * Get new cards for learning
 */
export function getNewCards(cards: Flashcard[], limit: number): Flashcard[] {
  return cards.filter(card => card.state === 'new').slice(0, limit);
}

/**
 * Calculate retention rate for a deck
 */
export function calculateRetentionRate(sessions: any[]): number {
  if (sessions.length === 0) return 0;

  const totalReviews = sessions.reduce(
    (sum, session) =>
      sum + session.againCount + session.hardCount + session.goodCount + session.easyCount,
    0,
  );

  const successfulReviews = sessions.reduce(
    (sum, session) => sum + session.goodCount + session.easyCount,
    0,
  );

  return totalReviews > 0 ? (successfulReviews / totalReviews) * 100 : 0;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
