export enum TOPIC_KEY {
  GAMES = "games",
  MOVIES = "movies",
  BOOKS = "books",
}

export type Topics = {
  value: TOPIC_KEY;
  label: string;
};

export const topics = [
  { value: TOPIC_KEY.GAMES, label: "Game" },
  { value: TOPIC_KEY.MOVIES, label: "Movie" },
  { value: TOPIC_KEY.BOOKS, label: "Book" },
];

export const getTopic = (topic?: TOPIC_KEY) => topics.find((t) => t.value === topic)!;
