import {
  type Session,
  sessionsTable,
  type User,
  usersTable,
} from "~/database/schema.server";

import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { db } from "~/database/index.server";
import { sha256 } from "@oslojs/crypto/sha2";
import { eq } from "drizzle-orm";

export const sessionService = {
  generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
  },

  async create(token: string, userId: string): Promise<Session> {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token))
    );
    const session: Session = {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    };
    await db.insert(sessionsTable).values(session);
    return session;
  },

  async validateSessionToken(
    sessionId: string
  ): Promise<SessionValidationResult> {
    // const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    // console.log(sessionId, token, "088417243d0dca029ee6a8a9f460e467065ced851e2a8965c3cdd3dae8015708")
    const result = await db
      .select({ user: usersTable, session: sessionsTable })
      .from(sessionsTable)
      .innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
      .where(eq(sessionsTable.id, sessionId));
    if (result.length < 1) {
      return { session: null, user: null };
    }
    const { user, session } = result[0];
    if (Date.now() >= session.expiresAt.getTime()) {
      await db.delete(sessionsTable).where(eq(sessionsTable.id, session.id));
      return { session: null, user: null };
    }
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
      session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
      await db
        .update(sessionsTable)
        .set({
          expiresAt: session.expiresAt,
        })
        .where(eq(sessionsTable.id, session.id));
    }
    return { session, user };
  },

  async invalidate(sessionId: string): Promise<void> {
    await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
  },

  async invalidateAll(userId: string): Promise<void> {
    await db.delete(sessionsTable).where(eq(sessionsTable.userId, userId));
  },
};

type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
