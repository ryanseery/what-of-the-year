import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTopic } from 'constants/topics';

export default function Topic() {
  const { topic } = useLocalSearchParams<{ topic?: string }>();

  const color = getTopic(topic);

  return (
    <SafeAreaView style={styles.root}>
      <Text style={[styles.text, { color }]}>{topic}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 56,
    fontWeight: 'bold',
  },
});
