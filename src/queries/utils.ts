export async function handleError(api: string, response: Response) {
  const errorText = await response.text();
  throw new Error(
    `${api} API error (${response.status}): ${errorText || response.statusText}`,
  );
}

// Disable caching during development
export const STALE_TIME = 0;
