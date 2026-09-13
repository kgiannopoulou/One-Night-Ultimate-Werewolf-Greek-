import { Assignment, Player } from "./types";

export const CENTER_SLOTS = ["center-0", "center-1", "center-2"];

export function countInDeck(selectedRoleIds: string[], roleId: string): number {
  return selectedRoleIds.filter((id) => id === roleId).length;
}

export function findPlayerSlotsForRole(
  players: Player[],
  assignment: Assignment,
  roleId: string
): Player[] {
  return players.filter((p) => assignment[p.id] === roleId);
}
