import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {Canvas, Path, Skia, Circle} from '@shopify/react-native-skia';
import {database} from '../../database/database';
import {useStore} from '../../store/useStore';
import {LightTheme, DarkTheme, Typography, Spacing, BorderRadius} from '../../constants/theme';
import {StudySession} from '../../types';

const {width} = Dimensions.get('window');

export const StatisticsScreen: React.FC = () => {
  const {settings, decks} = useStore();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = settings.theme === 'dark' ? DarkTheme : LightTheme;

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      let allSessions: StudySession[] = [];
      for (const deck of decks) {
        const deckSessions = await database.getSessionsByDeck(deck.id);
        allSessions = [...allSessions, ...deckSessions];
      }
      setSessions(allSessions);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalCardsStudied = () => {
    return sessions.reduce((sum, session) => sum + session.cardsStudied, 0);
  };

  const getTotalStudyTime = () => {
    const totalMs = sessions.reduce((sum, session) => sum + session.duration, 0);
    const hours = Math.floor(totalMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
    return {hours, minutes};
  };

  const getRetentionRate = () => {
    const totalReviews = sessions.reduce(
      (sum, session) =>
        sum + session.againCount + session.hardCount + session.goodCount + session.easyCount,
      0,
    );
    const successfulReviews = sessions.reduce(
      (sum, session) => sum + session.goodCount + session.easyCount,
      0,
    );
    return totalReviews > 0 ? Math.round((successfulReviews / totalReviews) * 100) : 0;
  };

  const studyTime = getTotalStudyTime();

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.textPrimary}, Typography.h2]}>
          Statistics
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Overview Cards */}
        <View style={styles.overviewGrid}>
          <View style={[styles.overviewCard, {backgroundColor: theme.surface}]}>
            <Text style={[styles.overviewNumber, {color: theme.primary}]}>
              {getTotalCardsStudied()}
            </Text>
            <Text style={[styles.overviewLabel, {color: theme.textSecondary}]}>
              Cards Studied
            </Text>
          </View>

          <View style={[styles.overviewCard, {backgroundColor: theme.surface}]}>
            <Text style={[styles.overviewNumber, {color: theme.success}]}>
              {getRetentionRate()}%
            </Text>
            <Text style={[styles.overviewLabel, {color: theme.textSecondary}]}>
              Retention Rate
            </Text>
          </View>

          <View style={[styles.overviewCard, {backgroundColor: theme.surface}]}>
            <Text style={[styles.overviewNumber, {color: theme.info}]}>
              {studyTime.hours}h {studyTime.minutes}m
            </Text>
            <Text style={[styles.overviewLabel, {color: theme.textSecondary}]}>
              Study Time
            </Text>
          </View>

          <View style={[styles.overviewCard, {backgroundColor: theme.surface}]}>
            <Text style={[styles.overviewNumber, {color: theme.warning}]}>
              {sessions.length}
            </Text>
            <Text style={[styles.overviewLabel, {color: theme.textSecondary}]}>
              Study Sessions
            </Text>
          </View>
        </View>

        {/* Study History */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.textPrimary}, Typography.h3]}>
            Recent Activity
          </Text>

          {sessions.length === 0 ? (
            <View style={[styles.emptyState, {backgroundColor: theme.surface}]}>
              <Text style={[styles.emptyText, {color: theme.textSecondary}]}>
                No study sessions yet. Start studying to see your statistics!
              </Text>
            </View>
          ) : (
            <View style={[styles.historyContainer, {backgroundColor: theme.surface}]}>
              {sessions.slice(0, 10).map((session, index) => {
                const deck = decks.find(d => d.id === session.deckId);
                return (
                  <View
                    key={session.id}
                    style={[
                      styles.historyItem,
                      {borderBottomColor: theme.border},
                      index === sessions.length - 1 && {borderBottomWidth: 0},
                    ]}>
                    <View style={styles.historyLeft}>
                      <Text style={[styles.historyDeckName, {color: theme.textPrimary}]}>
                        {deck?.name || 'Unknown Deck'}
                      </Text>
                      <Text style={[styles.historyDate, {color: theme.textSecondary}]}>
                        {new Date(session.startTime).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.historyRight}>
                      <Text style={[styles.historyCards, {color: theme.textPrimary}]}>
                        {session.cardsStudied} cards
                      </Text>
                      <Text style={[styles.historyXP, {color: theme.success}]}>
                        +{session.xpEarned} XP
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Deck Performance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.textPrimary}, Typography.h3]}>
            Deck Performance
          </Text>

          {decks.map(deck => {
            const masteryPercentage =
              deck.totalCards > 0 ? (deck.masteredCards / deck.totalCards) * 100 : 0;

            return (
              <View
                key={deck.id}
                style={[styles.deckPerformance, {backgroundColor: theme.surface}]}>
                <View style={styles.deckPerformanceHeader}>
                  <View style={[styles.deckColorDot, {backgroundColor: deck.color}]} />
                  <Text style={[styles.deckPerformanceName, {color: theme.textPrimary}]}>
                    {deck.name}
                  </Text>
                </View>

                <View style={styles.deckPerformanceStats}>
                  <Text style={[styles.deckPerformanceLabel, {color: theme.textSecondary}]}>
                    Mastery: {Math.round(masteryPercentage)}%
                  </Text>
                  <View
                    style={[styles.deckPerformanceBar, {backgroundColor: theme.border}]}>
                    <View
                      style={[
                        styles.deckPerformanceBarFill,
                        {width: `${masteryPercentage}%`, backgroundColor: theme.success},
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.deckPerformanceDetails}>
                  <Text style={[styles.deckPerformanceDetail, {color: theme.textSecondary}]}>
                    {deck.totalCards} total
                  </Text>
                  <Text style={[styles.deckPerformanceDetail, {color: theme.textSecondary}]}>
                    {deck.masteredCards} mastered
                  </Text>
                  <Text style={[styles.deckPerformanceDetail, {color: theme.textSecondary}]}>
                    {deck.reviewCards} due
                  </Text>
                </View>
              </View>
            );
          })}
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
    paddingTop: Spacing.xl,
  },
  title: {},
  content: {
    flex: 1,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  overviewCard: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  overviewNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  emptyState: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
  historyContainer: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  historyLeft: {},
  historyDeckName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyCards: {
    fontSize: 14,
    marginBottom: 4,
  },
  historyXP: {
    fontSize: 12,
    fontWeight: '600',
  },
  deckPerformance: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  deckPerformanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  deckColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  deckPerformanceName: {
    fontSize: 16,
    fontWeight: '500',
  },
  deckPerformanceStats: {
    marginBottom: Spacing.sm,
  },
  deckPerformanceLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  deckPerformanceBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  deckPerformanceBarFill: {
    height: '100%',
  },
  deckPerformanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  deckPerformanceDetail: {
    fontSize: 12,
  },
});
