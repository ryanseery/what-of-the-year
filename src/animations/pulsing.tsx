import { FC, ReactElement, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { flatten } from 'utils/styles';

interface Props {
  children: ReactElement;
}
export const Pulsing: FC<Props> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const pulse = useRef(new Animated.Value(0)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    loopRef.current = loop;
    loop.start();

    return () => {
      loopRef.current?.stop();
      loopRef.current = null;
      pulse.stopAnimation();
      pulse.setValue(0);
    };
  }, [pulse]);

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  const rootStyles = flatten([
    styles.root,
    {
      paddingBottom: insets.bottom + 16,
      paddingTop: 16,
      transform: [{ scale: pulseScale }],
    },
  ]);

  return <Animated.View style={rootStyles}>{children}</Animated.View>;
};

const styles = StyleSheet.create({
  root: { width: '100%', alignItems: 'center' },
});
