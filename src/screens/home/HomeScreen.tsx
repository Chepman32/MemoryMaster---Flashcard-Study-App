import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useStore} from '../../store/useStore';
import {database} from '../../database/database';
import {LightTheme, DarkTheme, Typography, Spacing, BorderRadius} from '../../constants/theme';
import {Deck} from '../../types';

const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.lg * 3) / 2;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const {decks, setDecks, settings} = useStore();
  const [loading, setLoading] = useState(true);
  const theme = settings.theme === 'dark' ? DarkTheme : LightTheme;

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      const loadedDecks = await database.getAllDecks();
      setDecks(loadedDecks);
    } catch (error) {
      console.error('Error loading decks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewDeck = () => {
    navigation.navigate('DeckEditor' as never, {mode: 'create'} as never);
  };

  const openDeck = (deck: Deck) => {
    navigation.navigate('DeckDetails' as never, {deckId: deck.id} as never);
  };

  const getDueCardsCount = (): number => {
    return decks.reduce((sum, deck) => sum + deck.reviewCards, 0);
  };

  const getTotalCards = (): number => {
    return decks.reduce((sum, deck) => sum + deck.totalCards, 0);
  };

  const renderDeckCard = ({item}: {item: Deck}) => (
    <TouchableOpacity
      style={[styles.deckCard, {backgroundColor: theme.surface}]}
      onPress={() => openDeck(item)}
      activeOpacity={0.7}>
      <View style={[styles.deckColorBar, {backgroundColor: item.color}]} />
      <View style={styles.deckContent}>
        <Text style={[styles.deckName, {color: theme.textPrimary}, Typography.h4]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.deckStats, {color: theme.textSecondary}, Typography.bodySmall]}>
          {item.totalCards} cards
        </Text>
        <View style={styles.deckProgress}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${item.totalCards > 0 ? (item.masteredCards / item.totalCards) * 100 : 0}%`,
                backgroundColor: theme.success,
              },
            ]}
          />
        </View>
        {item.reviewCards > 0 && (
          <Text style={[styles.dueLabel, {color: theme.warning}]}>
            {item.reviewCards} due
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, {color: theme.textPrimary}, Typography.h2]}>
          MemoryMaster
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, {backgroundColor: theme.surface}]}>
            <Text style={[styles.statNumber, {color: theme.primary}]}>{getTotalCards()}</Text>
            <Text style={[styles.statLabel, {color: theme.textSecondary}]}>Total Cards</Text>
          </View>
          <View style={[styles.statCard, {backgroundColor: theme.surface}]}>
            <Text style={[styles.statNumber, {color: theme.warning}]}>{getDueCardsCount()}</Text>
            <Text style={[styles.statLabel, {color: theme.textSecondary}]}>Due Today</Text>
          </View>
          <View style={[styles.statCard, {backgroundColor: theme.surface}]}>
            <Text style={[styles.statNumber, {color: theme.success}]}>0</Text>
            <Text style={[styles.statLabel, {color: theme.textSecondary}]}>Day Streak</Text>
          </View>
        </View>

        {/* My Decks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, {color: theme.textPrimary}, Typography.h3]}>
              My Decks
            </Text>
            <TouchableOpacity onPress={createNewDeck}>
              <Text style={[styles.addButton, {color: theme.primary}]}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {decks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, {color: theme.textSecondary}]}>
                No decks yet. Create your first deck to get started!
              </Text>
              <TouchableOpacity
                style={[styles.createButton, {backgroundColor: theme.primary}]}
                onPress={createNewDeck}>
                <Text style={styles.createButtonText}>Create Deck</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={decks}
              renderItem={renderDeckCard}
              keyExtractor={item => item.id}
              numColumns={2}
              columnWrapperStyle={styles.deckRow}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, {backgroundColor: theme.primary}]}
        onPress={createNewDeck}
        activeOpacity={0.8}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    padding: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {},
  addButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  deckRow: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  deckCard: {
    width: CARD_WIDTH,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deckColorBar: {
    height: 4,
  },
  deckContent: {
    padding: Spacing.md,
  },
  deckName: {
    marginBottom: 4,
  },
  deckStats: {
    marginBottom: Spacing.sm,
  },
  deckProgress: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: '100%',
  },
  dueLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  createButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '300',
  },
});
