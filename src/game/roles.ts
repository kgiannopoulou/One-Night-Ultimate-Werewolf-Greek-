// Role definitions for One Night Ultimate Werewolf ("Λύκοι μια Νύχτα")
// Based on the base game's 16-card role pool.

export type Team = "werewolf" | "village" | "tanner";

export interface RoleDef {
  id: string;
  nameEl: string; // Greek display name
  icon: string; // emoji standing in for the role's card art
  team: Team;
  /** How many copies exist in the standard base-game pool */
  poolCount: number;
  /** Order in which this role wakes at night. Roles sharing a step wake together. Undefined = no night action. */
  wakeOrder?: number;
  short: string; // one-line Greek description shown during role select / reveal
}

export const ROLES: Record<string, RoleDef> = {
  werewolf: {
    id: "werewolf",
    nameEl: "Λύκος",
    icon: "🐺",
    team: "werewolf",
    poolCount: 2,
    wakeOrder: 10,
    short: "Ξύπνα τη νύχτα και δες ποιοι άλλοι είναι Λύκοι.",
  },
  minion: {
    id: "minion",
    nameEl: "Τσιράκι",
    icon: "😈",
    team: "werewolf",
    poolCount: 1,
    wakeOrder: 20,
    short: "Ξέρεις ποιοι είναι οι Λύκοι, αλλά αυτοί δεν ξέρουν εσένα.",
  },
  mason: {
    id: "mason",
    nameEl: "Μασόνος",
    icon: "🧱",
    team: "village",
    poolCount: 2,
    wakeOrder: 30,
    short: "Ξύπνα τη νύχτα και δες ποιος άλλος είναι Μασόνος.",
  },
  seer: {
    id: "seer",
    nameEl: "Μάντισσα",
    icon: "🔮",
    team: "village",
    poolCount: 1,
    wakeOrder: 40,
    short: "Δες την κάρτα ενός παίκτη ή δύο κάρτες του κέντρου.",
  },
  robber: {
    id: "robber",
    nameEl: "Κλέφτης",
    icon: "🗡️",
    team: "village",
    poolCount: 1,
    wakeOrder: 50,
    short: "Αντάλλαξε την κάρτα σου με άλλου παίκτη και δες τη νέα σου κάρτα.",
  },
  troublemaker: {
    id: "troublemaker",
    nameEl: "Ταραξίας",
    icon: "🎭",
    team: "village",
    poolCount: 1,
    wakeOrder: 60,
    short: "Αντάλλαξε τις κάρτες δύο άλλων παικτών, χωρίς να τις δεις.",
  },
  drunk: {
    id: "drunk",
    nameEl: "Μεθύστακας",
    icon: "🍺",
    team: "village",
    poolCount: 1,
    wakeOrder: 70,
    short: "Αντάλλαξε την κάρτα σου με μία από το κέντρο, χωρίς να τη δεις.",
  },
  insomniac: {
    id: "insomniac",
    nameEl: "Ξάγρυπνος",
    icon: "👁️",
    team: "village",
    poolCount: 1,
    wakeOrder: 80,
    short: "Δες ξανά την κάρτα σου στο τέλος, για να δεις αν άλλαξε.",
  },
  hunter: {
    id: "hunter",
    nameEl: "Κυνηγός",
    icon: "🏹",
    team: "village",
    poolCount: 1,
    wakeOrder: undefined,
    short: "Αν ψηφιστείς εκτός, όποιον ψήφισες εσύ βγαίνει κι αυτός εκτός.",
  },
  tanner: {
    id: "tanner",
    nameEl: "Απόβλητος",
    icon: "💀",
    team: "tanner",
    poolCount: 1,
    wakeOrder: undefined,
    short: "Δεν θέλεις να ζήσεις. Κερδίζεις μόνο αν σε ψηφίσουν εκτός.",
  },
  villager: {
    id: "villager",
    nameEl: "Χωρικός",
    icon: "🌾",
    team: "village",
    poolCount: 3,
    wakeOrder: undefined,
    short: "Καμία νυχτερινή ικανότητα. Απλά ψήφισε σωστά το πρωί.",
  },
};

export const ROLE_LIST: RoleDef[] = Object.values(ROLES);

/** Roles that actually take a turn during the night phase, in wake order. */
export function nightActingRoles(roleIds: string[]): RoleDef[] {
  const unique = Array.from(new Set(roleIds));
  return unique
    .map((id) => ROLES[id])
    .filter((r): r is RoleDef => !!r && r.wakeOrder !== undefined)
    .sort((a, b) => (a.wakeOrder! - b.wakeOrder!));
}
