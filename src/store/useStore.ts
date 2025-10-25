import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Deck, Flashcard, UserSettings, StudySession} from '../types';

interface AppState {
  // Settings
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;

  // Decks
  decks: Deck[];
  setDecks: (decks: Deck[]) => void;
  addDeck: (deck: Deck) => void;
  updateDeck: (deck: Deck) => void;
  removeDeck: (deckId: string) => void;

  // Cards
  cards: Record<string, Flashcard[]>; // deckId -> cards
  setCards: (deckId: string, cards: Flashcard[]) => void;
  addCard: (card: Flashcard) => void;
  updateCard: (card: Flashcard) => void;
  removeCard: (cardId: string) => void;

  // Current session
  currentSession: StudySession | null;
  setCurrentSession: (session: StudySession | null) => void;

  // Stats
  totalCardsStudiedToday: number;
  studyStreak: number;
  updateDailyStats: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Default settings
      settings: {
        theme: 'auto',
        studyReminders: true,
        dailyGoal: 50,
        soundEffects: true,
        hapticFeedback: true,
        showTimer: true,
        animationSpeed: 'normal',
        swipeGestures: true,
        premiumStatus: false,
      },

      updateSettings: settings =>
        set(state => ({
          settings: {...state.settings, ...settings},
        })),

      // Decks
      decks: [],
      setDecks: decks => set({decks}),
      addDeck: deck =>
        set(state => ({
          decks: [...state.decks, deck],
        })),
      updateDeck: deck =>
        set(state => ({
          decks: state.decks.map(d => (d.id === deck.id ? deck : d)),
        })),
      removeDeck: deckId =>
        set(state => ({
          decks: state.decks.filter(d => d.id !== deckId),
          cards: Object.fromEntries(
            Object.entries(state.cards).filter(([id]) => id !== deckId),
          ),
        })),

      // Cards
      cards: {},
      setCards: (deckId, cards) =>
        set(state => ({
          cards: {...state.cards, [deckId]: cards},
        })),
      addCard: card =>
        set(state => ({
          cards: {
            ...state.cards,
            [card.deckId]: [...(state.cards[card.deckId] || []), card],
          },
        })),
      updateCard: card =>
        set(state => ({
          cards: {
            ...state.cards,
            [card.deckId]: (state.cards[card.deckId] || []).map(c =>
              c.id === card.id ? card : c,
            ),
          },
        })),
      removeCard: cardId =>
        set(state => {
          const newCards = {...state.cards};
          Object.keys(newCards).forEach(deckId => {
            newCards[deckId] = newCards[deckId].filter(c => c.id !== cardId);
          });
          return {cards: newCards};
        }),

      // Session
      currentSession: null,
      setCurrentSession: session => set({currentSession: session}),

      // Stats
      totalCardsStudiedToday: 0,
      studyStreak: 0,
      updateDailyStats: () => {
        // This would be calculated from sessions
        // Placeholder for now
      },
    }),
    {
      name: 'memorymaster-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        settings: state.settings,
        studyStreak: state.studyStreak,
        totalCardsStudiedToday: state.totalCardsStudiedToday,
      }),
    },
  ),
);
