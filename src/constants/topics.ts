export const topics = [
  { key: 'Game', color: 'black' },
  { key: 'Movie', color: 'blue' },
  { key: 'Book', color: 'green' },
];

export function getTopic(topic?: string) {
  const config = topics.find((t) => t.key === topic);

  return config?.color ?? 'black';
}
