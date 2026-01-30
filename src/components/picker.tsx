import { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

import { TOPIC_KEY, Topics } from "constants/topics";
import { createStyles, useTheme } from "utils/theme";

const ITEM_HEIGHT = 88;

interface Props {
  topics: Topics[];
  topic: TOPIC_KEY;
  onValueChange: (v: TOPIC_KEY) => void;
}

export function Picker({ topics, topic, onValueChange }: Props) {
  const styles = useStyles();
  const { theme } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const index = topics.findIndex((t) => t.key === topic);
    if (index >= 0) {
      scrollViewRef.current?.scrollTo({
        y: index * ITEM_HEIGHT,
        animated: false,
      });
    }
  }, [topic, topics]);

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, topics.length - 1));

      if (topics[clampedIndex]?.key !== topic) {
        onValueChange(topics[clampedIndex].key);
      }
    },
    [topics, topic, onValueChange],
  );

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: Platform.OS !== "web",
  });

  return (
    <View style={styles.root}>
      <View style={styles.scrollWrapper}>
        <Animated.ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onScroll={onScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollEndDrag={handleScrollEnd}
          contentContainerStyle={styles.scrollContent}
        >
          {topics.map((t, index) => {
            const inputRange = [
              (index - 2) * ITEM_HEIGHT,
              (index - 1) * ITEM_HEIGHT,
              index * ITEM_HEIGHT,
              (index + 1) * ITEM_HEIGHT,
              (index + 2) * ITEM_HEIGHT,
            ];

            const opacity = scrollY.interpolate({
              inputRange,
              outputRange: [0, 0.5, 1, 0.5, 0],
              extrapolate: "clamp",
            });

            const scale = scrollY.interpolate({
              inputRange,
              outputRange: [0.7, 0.85, 1, 0.85, 0.7],
              extrapolate: "clamp",
            });

            const rotateX = scrollY.interpolate({
              inputRange,
              outputRange: ["60deg", "30deg", "0deg", "-30deg", "-60deg"],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={t.key}
                style={[
                  styles.item,
                  {
                    opacity,
                    transform: [{ perspective: 1000 }, { scale }, { rotateX }],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.itemText,
                    { color: t.key === topic ? theme.colors.primary : theme.colors.secondary },
                  ]}
                >
                  {t.label}
                </Text>
              </Animated.View>
            );
          })}
        </Animated.ScrollView>
      </View>
    </View>
  );
}

const useStyles = createStyles((t) => ({
  root: {
    width: "100%",
  },
  scrollWrapper: {
    height: 200,
    overflow: "hidden",
  },
  scrollContent: {
    paddingVertical: ITEM_HEIGHT,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 72,
    fontWeight: t.text.weight.bold,
  },
}));
