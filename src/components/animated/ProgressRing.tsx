import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Canvas, Path, Skia, vec} from '@shopify/react-native-skia';
import {useSharedValue, withTiming, useDerivedValue} from 'react-native-reanimated';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 100,
  strokeWidth = 10,
  color = '#667EEA',
  backgroundColor = '#E2E8F0',
  showPercentage = true,
}) => {
  const animatedProgress = useSharedValue(0);

  React.useEffect(() => {
    animatedProgress.value = withTiming(progress, {duration: 1000});
  }, [progress]);

  const center = size / 2;
  const radius = (size - strokeWidth) / 2;

  const path = useDerivedValue(() => {
    const sweepAngle = (animatedProgress.value / 100) * 360;
    const p = Skia.Path.Make();
    p.addArc(
      {
        x: strokeWidth / 2,
        y: strokeWidth / 2,
        width: size - strokeWidth,
        height: size - strokeWidth,
      },
      -90,
      sweepAngle,
    );
    return p;
  });

  return (
    <View style={[styles.container, {width: size, height: size}]}>
      <Canvas style={{width: size, height: size}}>
        {/* Background circle */}
        <Path
          path={Skia.Path.Make().addCircle(center, center, radius)}
          color={backgroundColor}
          style="stroke"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <Path path={path} color={color} style="stroke" strokeWidth={strokeWidth} strokeCap="round" />
      </Canvas>
      {showPercentage && (
        <View style={styles.textContainer}>
          <Text style={styles.percentageText}>{Math.round(progress)}%</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
