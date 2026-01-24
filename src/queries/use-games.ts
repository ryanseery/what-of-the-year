import { useQuery } from '@tanstack/react-query';
import { TOPIC_KEY } from 'constants/topics';

const IGDB_API_URL = process.env.EXPO_PUBLIC_IGDB_API_URL;
const CLIENT_ID = process.env.EXPO_PUBLIC_IGDB_CLIENT_ID || '';
const ACCESS_TOKEN = process.env.EXPO_PUBLIC_IGDB_ACCESS_TOKEN || '';

interface Game {
  id: number;
  name: string;
  cover?: {
    id: number;
    url: string;
  };
  rating?: number;
  first_release_date?: number;
  summary?: string;
}

async function getGamesForYear(): Promise<Game[]> {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1).getTime() / 1000;
  const endDate = new Date(currentYear, 11, 31).getTime() / 1000;

  const response = await fetch(`${IGDB_API_URL}/games`, {
    method: 'POST',
    headers: {
      'Client-ID': CLIENT_ID,
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'text/plain',
    },
    body: `
      fields name, cover.url, rating, first_release_date, summary;
      where first_release_date >= ${startDate} & first_release_date < ${endDate};
      sort rating desc;
      limit 500;
    `,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `IGDB API error (${response.status}): ${errorText || response.statusText}`,
    );
  }

  const data = await response.json();

  return data;
}

export function useGames(enabled: boolean = false) {
  return useQuery({
    queryKey: [TOPIC_KEY.GAMES],
    queryFn: () => getGamesForYear(),
    staleTime: 0, // Disable caching during development
    enabled,
  });
}
