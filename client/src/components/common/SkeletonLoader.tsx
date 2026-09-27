import React from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

export const SkeletonLoader: React.FC = () => {
  const opacity = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, styles.headerBox, { opacity }]} />
      <Animated.View style={[styles.box, styles.judgeBox, { opacity }]} />
      <Animated.View style={[styles.box, styles.timerBox, { opacity }]} />
      <Animated.View style={[styles.box, styles.gridBox, { opacity }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    backgroundColor: COLORS.screenBg,
  },
  box: {
    backgroundColor: '#E2E8F0',
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  headerBox: {
    height: 160,
  },
  judgeBox: {
    height: 90,
  },
  timerBox: {
    height: 50,
  },
  gridBox: {
    height: 120,
  },
});
