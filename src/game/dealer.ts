import { Assignment, Player } from "./types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Deals roleIds (length must equal players.length + 3) randomly across
 * player slots and 3 center slots.
 */
export function deal(players: Player[], roleIds: string[]): Assignment {
  if (roleIds.length !== players.length + 3) {
    throw new Error(
      `Role count (${roleIds.length}) must equal players (${players.length}) + 3`
    );
  }
  const shuffled = shuffle(roleIds);
  const assignment: Assignment = {};
  players.forEach((p, i) => {
    assignment[p.id] = shuffled[i];
  });
  assignment["center-0"] = shuffled[players.length];
  assignment["center-1"] = shuffled[players.length + 1];
  assignment["center-2"] = shuffled[players.length + 2];
  return assignment;
}

export function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}
