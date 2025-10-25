import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import {useStore} from '../../store/useStore';
import {LightTheme, DarkTheme, Typography, BorderRadius, Spacing} from '../../constants/theme';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const CARD_HEIGHT = 400;

interface FlipCardProps {
  front: string;
  back: string;
  onFlip?: (isFlipped: boolean) => void;
  isDarkMode?: boolean;
}

export const FlipCard: React.FC<FlipCardProps> = ({front, back, onFlip, isDarkMode = false}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const rotateY = useSharedValue(0);
  const theme = isDarkMode ? DarkTheme : LightTheme;

  const flipCard = () => {
    const newValue = isFlipped ? 0 : 180;
    rotateY.value = withTiming(newValue, {duration: 400}, finished => {
      if (finished) {
        runOnJS(setIsFlipped)(!isFlipped);
        if (onFlip) {
          runOnJS(onFlip)(!isFlipped);
        }
      }
    });
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotateY.value, [0, 180], [0, 180]);
    const opacity = interpolate(rotateY.value, [0, 90, 180], [1, 0, 0]);

    return {
      transform: [{perspective: 1000}, {rotateY: `${rotateValue}deg`}],
      opacity,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotateY.value, [0, 180], [180, 360]);
    const opacity = interpolate(rotateY.value, [0, 90, 180], [0, 0, 1]);

    return {
      transform: [{perspective: 1000}, {rotateY: `${rotateValue}deg`}],
      opacity,
    };
  });

  return (
    <Pressable onPress={flipCard} style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {backgroundColor: theme.cardFront, shadowColor: theme.shadow},
          frontAnimatedStyle,
        ]}>
        <Text style={[styles.cardText, {color: theme.textPrimary}, Typography.cardFront]}>
          {front}
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.card,
          styles.cardBack,
          {backgroundColor: theme.cardBack, shadowColor: theme.shadow},
          backAnimatedStyle,
        ]}>
        <Text style={[styles.cardText, {color: theme.textPrimary}, Typography.cardBack]}>
          {back}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: 'center',
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: BorderRadius.lg,
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardBack: {
    position: 'absolute',
  },
  cardText: {
    textAlign: 'center',
  },
});
