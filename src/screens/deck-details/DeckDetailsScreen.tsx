import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {database} from '../../database/database';
import {useStore} from '../../store/useStore';
import {LightTheme, DarkTheme, Typography, Spacing, BorderRadius} from '../../constants/theme';
import {Deck, Flashcard} from '../../types';
import {getDueCards} from '../../algorithms/spacedRepetition';

export const DeckDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {deckId} = route.params as {deckId: string};
  const {settings} = useStore();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = settings.theme === 'dark' ? DarkTheme : LightTheme;

  useEffect(() => {
    loadDeckData();
  }, [deckId]);

  const loadDeckData = async () => {
    try {
      const deckData = await database.getDeck(deckId);
      const cardsData = await database.getCardsByDeck(deckId);

      setDeck(deckData);
      setCards(cardsData);
    } catch (error) {
      console.error('Error loading deck:', error);
    } finally {
      setLoading(false);
    }
  };

  const startStudySession = () => {
    navigation.navigate('StudySession' as never, {deckId, mode: 'smart'} as never);
  };

  const practiceAll = () => {
    navigation.navigate('StudySession' as never, {deckId, mode: 'practice'} as never);
  };

  const addCard = () => {
    navigation.navigate('CardEditor' as never, {deckId, mode: 'create'} as never);
  };

  const editCard = (card: Flashcard) => {
    navigation.navigate('CardEditor' as never, {deckId, cardId: card.id, mode: 'edit'} as never);
  };

  const deleteCard = async (cardId: string) => {
    Alert.alert('Delete Card', 'Are you sure you want to delete this card?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await database.deleteCard(cardId);
          loadDeckData();
        },
      },
    ]);
  };

  const renderCardItem = ({item}: {item: Flashcard}) => (
    <TouchableOpacity
      style={[styles.cardItem, {backgroundColor: theme.surface}]}
      onPress={() => editCard(item)}
      onLongPress={() => deleteCard(item.id)}>
      <View style={styles.cardContent}>
        <Text style={[styles.cardFront, {color: theme.textPrimary}]} numberOfLines={2}>
          {item.front}
        </Text>
        <Text style={[styles.cardBack, {color: theme.textSecondary}]} numberOfLines={1}>
          {item.back}
        </Text>
        <View style={styles.cardMeta}>
          <Text style={[styles.cardState, {color: theme.textSecondary}]}>{item.state}</Text>
          {item.state !== 'new' && (
            <Text style={[styles.cardInterval, {color: theme.textSecondary}]}>
              Next: {Math.round(item.interval)}d
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading || !deck) {
    return (
      <View style={[styles.container, {backgroundColor: theme.background}]}>
        <Text style={{color: theme.textPrimary}}>Loading...</Text>
      </View>
    );
  }

  const dueCards = getDueCards(cards);

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      {/* Header */}
      <View style={[styles.header, {backgroundColor: deck.color}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.deckName, Typography.h2]}>{deck.name}</Text>
        {deck.description && (
          <Text style={styles.deckDescription}>{deck.description}</Text>
        )}
      </View>

      <ScrollView>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, {backgroundColor: theme.surface}]}>
            <Text style={[styles.statNumber, {color: theme.textPrimary}]}>
              {deck.totalCards}
            </Text>
            <Text style={[styles.statLabel, {color: theme.textSecondary}]}>Total</Text>
          </View>
          <View style={[styles.statBox, {backgroundColor: theme.surface}]}>
            <Text style={[styles.statNumber, {color: theme.info}]}>{deck.newCards}</Text>
            <Text style={[styles.statLabel, {color: theme.textSecondary}]}>New</Text>
          </View>
          <View style={[styles.statBox, {backgroundColor: theme.surface}]}>
            <Text style={[styles.statNumber, {color: theme.warning}]}>
              {deck.learningCards}
            </Text>
            <Text style={[styles.statLabel, {color: theme.textSecondary}]}>Learning</Text>
          </View>
          <View style={[styles.statBox, {backgroundColor: theme.surface}]}>
            <Text style={[styles.statNumber, {color: theme.success}]}>
              {deck.masteredCards}
            </Text>
            <Text style={[styles.statLabel, {color: theme.textSecondary}]}>Mastered</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, {backgroundColor: theme.primary}]}
            onPress={startStudySession}
            disabled={dueCards.length === 0}>
            <Text style={styles.primaryButtonText}>
              Study Now ({dueCards.length} due)
            </Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity
              style={[styles.secondaryButton, {borderColor: theme.primary}]}
              onPress={practiceAll}>
              <Text style={[styles.secondaryButtonText, {color: theme.primary}]}>
                Practice All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.secondaryButton, {borderColor: theme.primary}]}
              onPress={addCard}>
              <Text style={[styles.secondaryButtonText, {color: theme.primary}]}>
                Add Card
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cards List */}
        <View style={styles.cardsSection}>
          <Text style={[styles.sectionTitle, {color: theme.textPrimary}, Typography.h3]}>
            Cards ({cards.length})
          </Text>

          {cards.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, {color: theme.textSecondary}]}>
                No cards yet. Add your first card to get started!
              </Text>
            </View>
          ) : (
            <FlatList
              data={cards}
              renderItem={renderCardItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xxl,
  },
  backButton: {
    marginBottom: Spacing.sm,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
  },
  deckName: {
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
  },
  deckDescription: {
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  actionsContainer: {
    padding: Spacing.lg,
  },
  primaryButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardsSection: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  cardItem: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  cardContent: {},
  cardFront: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  cardBack: {
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardState: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  cardInterval: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
  },
});
