// Priority order used to build a recommended deck of a given size.
// Mirrors the physical base-game's 16-card pool.
const PRIORITY: string[] = [
  "werewolf",
  "werewolf",
  "seer",
  "robber",
  "troublemaker",
  "drunk",
  "insomniac",
  "minion",
  "mason",
  "mason",
  "tanner",
  "hunter",
  "villager",
  "villager",
  "villager",
];

/** Returns a recommended list of roleIds (length = targetCount) for a given player count + 3 */
export function recommendedDeck(targetCount: number): string[] {
  return PRIORITY.slice(0, Math.min(targetCount, PRIORITY.length));
}

export const MAX_POOL = PRIORITY.length;
