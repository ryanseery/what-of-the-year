export enum TOPIC_KEY {
  GAMES = "games",
  MOVIES = "movies",
  BOOKS = "books",
}

export type Topics = {
  key: TOPIC_KEY;
  label: string;
  color: string;
};

export const topics = [
  { key: TOPIC_KEY.GAMES, label: "Game", color: "black" },
  { key: TOPIC_KEY.MOVIES, label: "Movie", color: "blue" },
  { key: TOPIC_KEY.BOOKS, label: "Book", color: "green" },
];

export const getTopic = (topic?: TOPIC_KEY) => topics.find((t) => t.key === topic)!;
