import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import {LightTheme, Typography} from '../../constants/theme';

const {width, height} = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({onFinish}) => {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.3);
  const titleOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo animation
    logoOpacity.value = withTiming(1, {duration: 500});
    logoScale.value = withSequence(
      withTiming(1.1, {duration: 500}),
      withTiming(1, {duration: 200}),
    );

    // Title animation
    titleOpacity.value = withDelay(
      800,
      withTiming(1, {duration: 400}),
    );

    // Tagline animation
    taglineOpacity.value = withDelay(
      1200,
      withTiming(1, {duration: 400}),
    );

    // Finish splash screen
    const timeout = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{scale: logoScale.value}],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  return (
    <View style={[styles.container, {backgroundColor: LightTheme.background}]}>
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>MM</Text>
        </View>
      </Animated.View>

      <Animated.Text
        style={[
          styles.title,
          {color: LightTheme.textPrimary},
          Typography.h1,
          titleAnimatedStyle,
        ]}>
        MemoryMaster
      </Animated.Text>

      <Animated.Text
        style={[
          styles.tagline,
          {color: LightTheme.textSecondary},
          Typography.bodyMedium,
          taglineAnimatedStyle,
        ]}>
        Master Anything Through Repetition
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: LightTheme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  title: {
    marginBottom: 8,
  },
  tagline: {
    textAlign: 'center',
  },
});
