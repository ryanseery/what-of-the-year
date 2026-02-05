export enum TOPIC_KEY {
  GAMES = "games",
  MOVIES = "movies",
  BOOKS = "books",
}

export type Topics = {
  key: TOPIC_KEY;
  label: string;
};

export const topics = [
  { key: TOPIC_KEY.GAMES, label: "Game" },
  { key: TOPIC_KEY.MOVIES, label: "Movie" },
  { key: TOPIC_KEY.BOOKS, label: "Book" },
];

export const getTopic = (topic?: TOPIC_KEY) => topics.find((t) => t.key === topic)!;
