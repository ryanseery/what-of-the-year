import { Timestamp, doc, serverTimestamp, writeBatch } from "firebase/firestore";

import {
  SESSION_TTL_MS,
  buildAllRounds,
  buildPlayer,
  buildSession,
  generateInviteCode,
} from "db/builders";
import { playerRef, roundRef, sessionsRef } from "db/collections";
import { db } from "db/config";

interface CreateSessionArgs {
  topic: string;
  year: number;
  uid: string;
  name: string;
  avatar: string;
}

/**
 * Creates a full session tree in Firestore:
 * - session document
 * - host player document
 * - all round documents (pending state)
 *
 * Uses a batch write so everything succeeds or fails atomically.
 * Returns the new session ID.
 */
export async function createSession({ topic, year, uid, name, avatar }: CreateSessionArgs) {
  const inviteCode = generateInviteCode();

  const newSessionRef = doc(sessionsRef());
  const sessionId = newSessionRef.id;

  const batch = writeBatch(db);

  // Session doc
  batch.set(newSessionRef, {
    ...buildSession(topic, year, inviteCode),
    createdAt: serverTimestamp(),
    expiresAt: Timestamp.fromMillis(Date.now() + SESSION_TTL_MS),
  });

  // Host player doc
  batch.set(playerRef(sessionId, uid), {
    ...buildPlayer(name, avatar, true),
    joinedAt: serverTimestamp(),
  });

  // All round docs
  const rounds = buildAllRounds();
  for (const round of rounds) {
    batch.set(roundRef(sessionId, round.number), round);
  }

  await batch.commit();

  return { sessionId, inviteCode };
}
