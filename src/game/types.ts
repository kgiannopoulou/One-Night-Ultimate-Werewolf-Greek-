export interface Player {
  id: string;
  name: string;
}

/** A "slot" is either a player id, or "center-0" | "center-1" | "center-2" */
export type Slot = string;

export interface Assignment {
  [slot: string]: string; // slot -> roleId
}

export type GamePhase =
  | "players"
  | "roles"
  | "reveal"
  | "night"
  | "day"
  | "results";

export interface NightLogEntry {
  roleId: string;
  actorSlot: Slot;
  detail: string;
}
