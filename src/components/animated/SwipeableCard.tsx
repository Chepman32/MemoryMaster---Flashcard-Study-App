import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {PanGestureHandler, PanGestureHandlerGestureEvent} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {LightTheme, DarkTheme, Typography, BorderRadius, Spacing} from '../../constants/theme';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const ROTATION_ANGLE = 30;

type SwipeDirection = 'left' | 'right' | 'up' | 'down';

interface SwipeableCardProps {
  content: string;
  onSwipe: (direction: SwipeDirection) => void;
  isDarkMode?: boolean;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  content,
  onSwipe,
  isDarkMode = false,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const theme = isDarkMode ? DarkTheme : LightTheme;

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {startX: number; startY: number}
  >({
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;
    },
    onEnd: event => {
      const absX = Math.abs(translateX.value);
      const absY = Math.abs(translateY.value);

      if (absX > SWIPE_THRESHOLD || absY > SWIPE_THRESHOLD) {
        // Determine direction
        let direction: SwipeDirection;
        if (absX > absY) {
          direction = translateX.value > 0 ? 'right' : 'left';
        } else {
          direction = translateY.value > 0 ? 'down' : 'up';
        }

        // Animate off screen
        const exitX = direction === 'left' ? -SCREEN_WIDTH : direction === 'right' ? SCREEN_WIDTH : 0;
        const exitY = direction === 'up' ? -SCREEN_HEIGHT : direction === 'down' ? SCREEN_HEIGHT : 0;

        translateX.value = withTiming(exitX, {duration: 200}, () => {
          runOnJS(onSwipe)(direction);
        });
        translateY.value = withTiming(exitY, {duration: 200});
      } else {
        // Return to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-ROTATION_ANGLE, 0, ROTATION_ANGLE],
      Extrapolate.CLAMP,
    );

    const scale = interpolate(
      Math.abs(translateX.value) + Math.abs(translateY.value),
      [0, SWIPE_THRESHOLD],
      [1, 0.95],
      Extrapolate.CLAMP,
    );

    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {rotate: `${rotation}deg`},
        {scale},
      ],
    };
  });

  const leftIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolate.CLAMP);
    return {opacity};
  });

  const rightIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolate.CLAMP);
    return {opacity};
  });

  const upIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateY.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolate.CLAMP);
    return {opacity};
  });

  const downIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateY.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolate.CLAMP);
    return {opacity};
  });

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style={[
            styles.card,
            {backgroundColor: theme.cardFront, shadowColor: theme.shadow},
            animatedStyle,
          ]}>
          {/* Swipe Indicators */}
          <Animated.View style={[styles.indicator, styles.leftIndicator, leftIndicatorStyle]}>
            <Text style={[styles.indicatorText, {color: theme.secondary}]}>Again</Text>
          </Animated.View>

          <Animated.View style={[styles.indicator, styles.rightIndicator, rightIndicatorStyle]}>
            <Text style={[styles.indicatorText, {color: theme.success}]}>Easy</Text>
          </Animated.View>

          <Animated.View style={[styles.indicator, styles.upIndicator, upIndicatorStyle]}>
            <Text style={[styles.indicatorText, {color: theme.info}]}>Good</Text>
          </Animated.View>

          <Animated.View style={[styles.indicator, styles.downIndicator, downIndicatorStyle]}>
            <Text style={[styles.indicatorText, {color: theme.warning}]}>Hard</Text>
          </Animated.View>

          {/* Card Content */}
          <Text style={[styles.cardText, {color: theme.textPrimary}, Typography.cardFront]}>
            {content}
          </Text>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: SCREEN_WIDTH * 0.9,
    height: 400,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardText: {
    textAlign: 'center',
  },
  indicator: {
    position: 'absolute',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  leftIndicator: {
    left: Spacing.md,
    top: Spacing.md,
  },
  rightIndicator: {
    right: Spacing.md,
    top: Spacing.md,
  },
  upIndicator: {
    top: Spacing.md,
    alignSelf: 'center',
  },
  downIndicator: {
    bottom: Spacing.md,
    alignSelf: 'center',
  },
  indicatorText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
