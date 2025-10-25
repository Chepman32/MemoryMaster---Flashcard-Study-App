import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {FlipCard} from '../../components/animated/FlipCard';
import {SwipeableCard} from '../../components/animated/SwipeableCard';
import {database} from '../../database/database';
import {calculateNextReview, getIntervalPreviews, getDueCards} from '../../algorithms/spacedRepetition';
import {useStore} from '../../store/useStore';
import {LightTheme, DarkTheme, Typography, Spacing, BorderRadius} from '../../constants/theme';
import {Flashcard, StudySession} from '../../types';

export const StudySessionScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {settings} = useStore();
  const {deckId, mode = 'smart'} = route.params as {deckId: string; mode?: string};

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [session, setSession] = useState<StudySession | null>(null);
  const [loading, setLoading] = useState(true);

  const theme = settings.theme === 'dark' ? DarkTheme : LightTheme;
  const useSwipeMode = settings.swipeGestures;

  useEffect(() => {
    loadStudyCards();
    initializeSession();
  }, []);

  const loadStudyCards = async () => {
    try {
      const allCards = await database.getCardsByDeck(deckId);
      let studyCards: Flashcard[] = [];

      if (mode === 'smart') {
        studyCards = getDueCards(allCards);
      } else if (mode === 'practice') {
        studyCards = allCards.filter(c => c.state !== 'suspended');
      }

      // Shuffle cards
      studyCards = studyCards.sort(() => Math.random() - 0.5);
      setCards(studyCards);
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeSession = () => {
    const newSession: StudySession = {
      id: `session-${Date.now()}`,
      deckId,
      startTime: new Date(),
      cardsStudied: 0,
      newCardsLearned: 0,
      againCount: 0,
      hardCount: 0,
      goodCount: 0,
      easyCount: 0,
      duration: 0,
      xpEarned: 0,
    };
    setSession(newSession);
  };

  const handleAnswer = async (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!cards[currentIndex] || !session) return;

    const card = cards[currentIndex];
    const result = calculateNextReview(card, quality);

    // Update card
    const updatedCard: Flashcard = {
      ...card,
      easeFactor: result.easeFactor,
      interval: result.interval,
      repetitions: result.repetitions,
      dueDate: result.dueDate,
      state: result.state,
      lastReviewed: new Date(),
      updatedAt: new Date(),
    };

    await database.updateCard(updatedCard);

    // Update session stats
    const updatedSession = {...session};
    updatedSession.cardsStudied++;

    if (quality === 0 || quality === 1) updatedSession.againCount++;
    else if (quality === 2) updatedSession.hardCount++;
    else if (quality === 3 || quality === 4) updatedSession.goodCount++;
    else if (quality === 5) updatedSession.easyCount++;

    if (card.state === 'new') updatedSession.newCardsLearned++;

    updatedSession.xpEarned += quality * 10;

    setSession(updatedSession);

    // Move to next card
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      finishSession(updatedSession);
    }
  };

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    const qualityMap = {
      left: 0, // Again
      down: 2, // Hard
      up: 3, // Good
      right: 5, // Easy
    };
    handleAnswer(qualityMap[direction] as 0 | 2 | 3 | 5);
  };

  const finishSession = async (finalSession: StudySession) => {
    const endTime = new Date();
    finalSession.endTime = endTime;
    finalSession.duration = endTime.getTime() - finalSession.startTime.getTime();

    await database.createSession(finalSession);

    navigation.navigate('SessionComplete' as never, {session: finalSession} as never);
  };

  const exitSession = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={[styles.container, {backgroundColor: theme.background}]}>
        <Text style={{color: theme.textPrimary}}>Loading...</Text>
      </View>
    );
  }

  if (cards.length === 0) {
    return (
      <View style={[styles.container, {backgroundColor: theme.background}]}>
        <Text style={[styles.emptyText, {color: theme.textPrimary}]}>
          No cards to study!
        </Text>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: theme.primary}]}
          onPress={exitSession}>
          <Text style={styles.buttonText}>Back to Deck</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentCard = cards[currentIndex];
  const intervals = currentCard ? getIntervalPreviews(currentCard) : null;

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={exitSession}>
          <Text style={[styles.exitButton, {color: theme.textSecondary}]}>✕</Text>
        </TouchableOpacity>
        <Text style={[styles.progressText, {color: theme.textPrimary}]}>
          {currentIndex + 1} / {cards.length}
        </Text>
        <View style={{width: 24}} />
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressBarContainer, {backgroundColor: theme.border}]}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${((currentIndex + 1) / cards.length) * 100}%`,
              backgroundColor: theme.primary,
            },
          ]}
        />
      </View>

      {/* Card Display */}
      <View style={styles.cardContainer}>
        {useSwipeMode && isFlipped ? (
          <SwipeableCard
            content={currentCard.back}
            onSwipe={handleSwipe}
            isDarkMode={settings.theme === 'dark'}
          />
        ) : (
          <FlipCard
            front={currentCard.front}
            back={currentCard.back}
            onFlip={setIsFlipped}
            isDarkMode={settings.theme === 'dark'}
          />
        )}
      </View>

      {/* Controls */}
      {!useSwipeMode && isFlipped && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.difficultyButton, {backgroundColor: theme.secondary}]}
            onPress={() => handleAnswer(0)}>
            <Text style={styles.difficultyButtonText}>Again</Text>
            <Text style={styles.intervalText}>{intervals?.again}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.difficultyButton, {backgroundColor: theme.warning}]}
            onPress={() => handleAnswer(2)}>
            <Text style={styles.difficultyButtonText}>Hard</Text>
            <Text style={styles.intervalText}>{intervals?.hard}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.difficultyButton, {backgroundColor: theme.info}]}
            onPress={() => handleAnswer(3)}>
            <Text style={styles.difficultyButtonText}>Good</Text>
            <Text style={styles.intervalText}>{intervals?.good}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.difficultyButton, {backgroundColor: theme.success}]}
            onPress={() => handleAnswer(5)}>
            <Text style={styles.difficultyButtonText}>Easy</Text>
            <Text style={styles.intervalText}>{intervals?.easy}</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isFlipped && !useSwipeMode && (
        <TouchableOpacity
          style={[styles.showAnswerButton, {backgroundColor: theme.primary}]}
          onPress={() => setIsFlipped(true)}>
          <Text style={styles.showAnswerButtonText}>Show Answer</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  exitButton: {
    fontSize: 24,
    fontWeight: '300',
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 4,
    marginHorizontal: Spacing.lg,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  buttonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  difficultyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  intervalText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  showAnswerButton: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  showAnswerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  button: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
