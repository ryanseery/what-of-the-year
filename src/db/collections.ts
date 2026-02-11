import { collection, doc } from "firebase/firestore";

import { db } from "db/config";

// --- Collection references ---

export const sessionsRef = () => collection(db, "sessions");

export const sessionRef = (sessionId: string) => doc(db, "sessions", sessionId);

export const playersRef = (sessionId: string) => collection(db, "sessions", sessionId, "players");

export const playerRef = (sessionId: string, uid: string) =>
  doc(db, "sessions", sessionId, "players", uid);

export const roundsRef = (sessionId: string) => collection(db, "sessions", sessionId, "rounds");

export const roundRef = (sessionId: string, roundNumber: number) =>
  doc(db, "sessions", sessionId, "rounds", String(roundNumber));

export const selectionsRef = (sessionId: string, roundNumber: number) =>
  collection(db, "sessions", sessionId, "rounds", String(roundNumber), "selections");

export const selectionRef = (sessionId: string, roundNumber: number, uid: string) =>
  doc(db, "sessions", sessionId, "rounds", String(roundNumber), "selections", uid);
