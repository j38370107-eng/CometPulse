export const PREFIX = "c!";
export const XP_COOLDOWN_MS = 60_000;
export const XP_MIN = 15;
export const XP_MAX = 25;

export function randomXP(): number {
  return Math.floor(Math.random() * (XP_MAX - XP_MIN + 1)) + XP_MIN;
}

export function xpForLevel(level: number): number {
  return level === 0 ? 0 : 5 * level * level + 50 * level + 100;
}

export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 0; i < level; i++) total += xpForLevel(i);
  return total;
}

export function levelFromTotalXP(totalXP: number): number {
  let level = 0;
  let accumulated = 0;
  while (true) {
    const needed = xpForLevel(level);
    if (accumulated + needed > totalXP) break;
    accumulated += needed;
    level++;
  }
  return level;
}

export function xpInCurrentLevel(totalXP: number, level: number): number {
  return totalXP - totalXpForLevel(level);
}

export function progressBar(current: number, max: number, length = 14): string {
  const filled = Math.round((current / max) * length);
  const empty = length - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}

export function medalFor(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `**#${rank}**`;
}
