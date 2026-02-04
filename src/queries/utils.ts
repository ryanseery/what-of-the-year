export async function handleError(api: string, response: Response) {
  const errorText = await response.text();
  throw new Error(`${api} API error (${response.status}): ${errorText || response.statusText}`);
}

export const STALE_TIME = 1000 * 60 * 5; // 5 minutes
