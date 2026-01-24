export const topics = [
  { key: 'games', label: 'Game', color: 'black' },
  { key: 'movies', label: 'Movie', color: 'blue' },
  { key: 'books', label: 'Book', color: 'green' },
];

export const getTopic = (topic?: string) =>
  topics.find((t) => t.key === topic)!;
