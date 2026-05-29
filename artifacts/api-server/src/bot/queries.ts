import { db } from "./db.js";
import { userData } from "./schema.js";
import { eq, and, desc } from "drizzle-orm";
import { levelFromTotalXP, totalXpForLevel } from "./leveling.js";

export async function getOrCreateUser(userId: string, guildId: string) {
  const existing = await db.query.userData.findFirst({
    where: and(eq(userData.userId, userId), eq(userData.guildId, guildId)),
  });
  if (existing) return existing;

  const [created] = await db
    .insert(userData)
    .values({ userId, guildId })
    .returning();
  return created;
}

export async function addXP(
  userId: string,
  guildId: string,
  xpAmount: number
): Promise<{ user: typeof userData.$inferSelect; leveledUp: boolean; newLevel: number }> {
  const user = await getOrCreateUser(userId, guildId);
  const newXP = user.xp + xpAmount;
  const newLevel = levelFromTotalXP(newXP);
  const leveledUp = newLevel > user.level;

  const [updated] = await db
    .update(userData)
    .set({ xp: newXP, level: newLevel, messageCount: user.messageCount + 1, updatedAt: new Date() })
    .where(and(eq(userData.userId, userId), eq(userData.guildId, guildId)))
    .returning();

  return { user: updated, leveledUp, newLevel };
}

export async function setUserXP(userId: string, guildId: string, xp: number) {
  const level = levelFromTotalXP(xp);
  await db
    .insert(userData)
    .values({ userId, guildId, xp, level })
    .onConflictDoUpdate({
      target: [userData.userId, userData.guildId],
      set: { xp, level, updatedAt: new Date() },
    });
}

export async function setUserLevel(userId: string, guildId: string, level: number) {
  const xp = totalXpForLevel(level);
  await db
    .insert(userData)
    .values({ userId, guildId, xp, level })
    .onConflictDoUpdate({
      target: [userData.userId, userData.guildId],
      set: { xp, level, updatedAt: new Date() },
    });
}

export async function getLeaderboard(guildId: string, limit = 10) {
  return db.query.userData.findMany({
    where: eq(userData.guildId, guildId),
    orderBy: [desc(userData.xp)],
    limit,
  });
}

export async function getUserRank(userId: string, guildId: string): Promise<number> {
  const all = await db.query.userData.findMany({
    where: eq(userData.guildId, guildId),
    orderBy: [desc(userData.xp)],
    columns: { userId: true },
  });
  const idx = all.findIndex((u) => u.userId === userId);
  return idx === -1 ? -1 : idx + 1;
}
