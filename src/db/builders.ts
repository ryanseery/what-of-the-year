const MAX_ROUNDS = 10;
const MAX_PLAYERS = 10;

/** Session TTL in milliseconds (24 hours) */
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

/** Deterministic round weights: round 1 = 1pt, round 10 = 10pts */
export const getRoundWeight = (roundNumber: number) => roundNumber;

/** Generate a short invite code */
export const generateInviteCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

/** Build the session document data */
export const buildSession = (topic: string, year: number, inviteCode: string) => ({
  topic,
  year,
  inviteCode,
  maxRounds: MAX_ROUNDS,
  maxPlayers: MAX_PLAYERS,
  isOpen: true,
  playerCount: 1,
  activeRoundNumber: 1,
});

/** Build the host player document data */
export const buildPlayer = (name: string, avatar: string, isHost: boolean) => ({
  name,
  avatar,
  isHost,
});

/** Build a round document data */
export const buildRound = (roundNumber: number) => ({
  number: roundNumber,
  state: "pending" as const,
  weight: getRoundWeight(roundNumber),
  selectionsComplete: 0,
  startedAt: null,
  closedAt: null,
});

/** Build all round documents for a session */
export const buildAllRounds = (maxRounds: number = MAX_ROUNDS) =>
  Array.from({ length: maxRounds }, (_, i) => buildRound(i + 1));

export { MAX_ROUNDS, MAX_PLAYERS };
