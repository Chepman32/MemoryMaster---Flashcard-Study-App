import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import {useStore} from '../../store/useStore';
import {LightTheme, DarkTheme, Typography, Spacing, BorderRadius} from '../../constants/theme';
import {StudySession} from '../../types';

export const SessionCompleteScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {session} = route.params as {session: StudySession};
  const {settings} = useStore();

  const theme = settings.theme === 'dark' ? DarkTheme : LightTheme;

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1);
    opacity.value = withDelay(200, withSpring(1));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  const totalCards =
    session.againCount + session.hardCount + session.goodCount + session.easyCount;
  const accuracy =
    totalCards > 0 ? ((session.goodCount + session.easyCount) / totalCards) * 100 : 0;

  const getStars = () => {
    if (accuracy >= 90) return 3;
    if (accuracy >= 70) return 2;
    return 1;
  };

  const goHome = () => {
    navigation.navigate('Home' as never);
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <Animated.View style={[styles.content, animatedStyle]}>
        {/* Success Icon */}
        <View style={[styles.iconContainer, {backgroundColor: theme.success}]}>
          <Text style={styles.iconText}>✓</Text>
        </View>

        <Text style={[styles.title, {color: theme.textPrimary}, Typography.h1]}>
          Session Complete!
        </Text>

        {/* Stars */}
        <View style={styles.starsContainer}>
          {[1, 2, 3].map(star => (
            <Text key={star} style={styles.star}>
              {star <= getStars() ? '★' : '☆'}
            </Text>
          ))}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, {backgroundColor: theme.surface}]}>
            <Text style={[styles.statNumber, {color: theme.primary}]}>
              {session.cardsStudied}
            </Text>
            <Text style={[styles.statLabel, {color: theme.textSecondary}]}>Cards Studied</Text>
          </View>

          <View style={[styles.statCard, {backgroundColor: theme.surface}]}>
            <Text style={[styles.statNumber, {color: theme.success}]}>
              {session.newCardsLearned}
            </Text>
            <Text style={[styles.statLabel, {color: theme.textSecondary}]}>New Cards</Text>
          </View>

          <View style={[styles.statCard, {backgroundColor: theme.surface}]}>
            <Text style={[styles.statNumber, {color: theme.info}]}>
              {Math.round(accuracy)}%
            </Text>
            <Text style={[styles.statLabel, {color: theme.textSecondary}]}>Accuracy</Text>
          </View>

          <View style={[styles.statCard, {backgroundColor: theme.surface}]}>
            <Text style={[styles.statNumber, {color: theme.warning}]}>
              {session.xpEarned}
            </Text>
            <Text style={[styles.statLabel, {color: theme.textSecondary}]}>XP Earned</Text>
          </View>
        </View>

        {/* Response Breakdown */}
        <View style={[styles.breakdown, {backgroundColor: theme.surface}]}>
          <Text style={[styles.breakdownTitle, {color: theme.textPrimary}, Typography.h4]}>
            Response Breakdown
          </Text>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, {backgroundColor: theme.secondary}]} />
              <Text style={[styles.breakdownText, {color: theme.textPrimary}]}>
                Again: {session.againCount}
              </Text>
            </View>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, {backgroundColor: theme.warning}]} />
              <Text style={[styles.breakdownText, {color: theme.textPrimary}]}>
                Hard: {session.hardCount}
              </Text>
            </View>
          </View>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, {backgroundColor: theme.info}]} />
              <Text style={[styles.breakdownText, {color: theme.textPrimary}]}>
                Good: {session.goodCount}
              </Text>
            </View>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, {backgroundColor: theme.success}]} />
              <Text style={[styles.breakdownText, {color: theme.textPrimary}]}>
                Easy: {session.easyCount}
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={[styles.button, {backgroundColor: theme.primary}]}
          onPress={goHome}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  iconText: {
    fontSize: 48,
    color: '#FFFFFF',
  },
  title: {
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
  },
  star: {
    fontSize: 36,
    color: '#FFD700',
    marginHorizontal: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    width: '100%',
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  breakdown: {
    width: '100%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  breakdownTitle: {
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.sm,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  breakdownText: {
    fontSize: 14,
  },
  button: {
    width: '100%',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
