import { afterEach, describe, expect, it, mock } from "bun:test";

import { MAX_ROUNDS } from "../builders";

// --- Mock Firestore and config BEFORE importing createSession ---
const mockSet = mock(() => {});
const mockCommit = mock(() => Promise.resolve());

mock.module("db/config", () => ({
  db: {},
}));

mock.module("firebase/firestore", () => ({
  Timestamp: {
    fromMillis: (ms: number) => ({ _type: "timestamp", ms }),
  },
  doc: (_collection: unknown) => ({ id: "mock-session-id" }),
  collection: (...segments: string[]) => ({ path: segments.join("/") }),
  writeBatch: () => ({
    set: mockSet,
    commit: mockCommit,
  }),
  serverTimestamp: () => ({ _type: "serverTimestamp" }),
  runTransaction: () => Promise.resolve(),
  increment: (n: number) => ({ _type: "increment", value: n }),
}));

// Import AFTER mocks are registered
const { createSession } = await import("../create-session");

describe("createSession", () => {
  afterEach(() => {
    mockSet.mockClear();
    mockCommit.mockClear();
  });

  it("returns a sessionId and inviteCode", async () => {
    const result = await createSession({
      topic: "games",
      year: 2025,
      uid: "user-123",
      name: "Ryan",
      avatar: "seed-abc",
    });

    expect(result.sessionId).toBe("mock-session-id");
    expect(result.inviteCode).toBeString();
    expect(result.inviteCode).toHaveLength(6);
  });

  it("creates exactly 1 session + 1 player + 10 rounds in the batch", async () => {
    await createSession({
      topic: "movies",
      year: 2024,
      uid: "user-456",
      name: "Guest",
      avatar: "seed-xyz",
    });

    // 1 session + 1 player + 10 rounds = 12 batch.set calls
    expect(mockSet).toHaveBeenCalledTimes(1 + 1 + MAX_ROUNDS);
  });

  it("commits the batch exactly once", async () => {
    await createSession({
      topic: "books",
      year: 2023,
      uid: "user-789",
      name: "Test",
      avatar: "seed-123",
    });

    expect(mockCommit).toHaveBeenCalledTimes(1);
  });

  it("sets session doc with correct topic and year", async () => {
    await createSession({
      topic: "games",
      year: 2025,
      uid: "user-123",
      name: "Ryan",
      avatar: "seed-abc",
    });

    const sessionCall = (mockSet.mock.calls as unknown[][])[0];
    const sessionData = sessionCall?.[1] as unknown as Record<string, unknown>;

    expect(sessionData.topic).toBe("games");
    expect(sessionData.year).toBe(2025);
    expect(sessionData.isOpen).toBe(true);
    expect(sessionData.playerCount).toBe(1);
    expect(sessionData.activeRoundNumber).toBe(1);
    expect(sessionData.createdAt).toEqual({ _type: "serverTimestamp" });
    expect(sessionData.expiresAt).toHaveProperty("ms");
  });

  it("sets player doc with host flag", async () => {
    await createSession({
      topic: "games",
      year: 2025,
      uid: "user-123",
      name: "Ryan",
      avatar: "seed-abc",
    });

    const playerCall = (mockSet.mock.calls as unknown[][])[1];
    const playerData = playerCall?.[1] as unknown as Record<string, unknown>;

    expect(playerData.name).toBe("Ryan");
    expect(playerData.avatar).toBe("seed-abc");
    expect(playerData.isHost).toBe(true);
    expect(playerData.joinedAt).toEqual({ _type: "serverTimestamp" });
  });

  it("creates rounds numbered 1 through 10 with correct weights", async () => {
    await createSession({
      topic: "games",
      year: 2025,
      uid: "user-123",
      name: "Ryan",
      avatar: "seed-abc",
    });

    // Rounds are calls index 2..11 (after session + player)
    for (let i = 0; i < MAX_ROUNDS; i++) {
      const roundCall = (mockSet.mock.calls as unknown[][])[2 + i];
      const roundData = roundCall?.[1] as unknown as Record<string, unknown>;

      expect(roundData.number).toBe(i + 1);
      expect(roundData.weight).toBe(i + 1);
      expect(roundData.state).toBe("pending");
      expect(roundData.selectionsComplete).toBe(0);
    }
  });
});
