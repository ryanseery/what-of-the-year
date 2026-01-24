import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTopic, TOPIC_KEY } from 'constants/topics';
import { useGames } from 'queries/use-games';

export default function Topic() {
  const { topic } = useLocalSearchParams<{ topic?: TOPIC_KEY }>();
  const determinedTopic = getTopic(topic);

  const { data, isLoading, error } = useGames(
    determinedTopic.key === TOPIC_KEY.GAMES,
  );

  console.log({
    data,
    isLoading,
    error,
  });

  return (
    <SafeAreaView style={styles.root}>
      <Text style={[styles.text, { color: determinedTopic.color }]}>
        {determinedTopic.label}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 56,
    fontWeight: 'bold',
  },
});
