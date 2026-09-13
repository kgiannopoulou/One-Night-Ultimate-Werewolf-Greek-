import React, { createContext, useContext, useMemo, useState } from "react";
import { Assignment, Player } from "../game/types";
import { deal, makeId } from "../game/dealer";
import { ROLES } from "../game/roles";

interface GameContextValue {
  players: Player[];
  setPlayers: (players: Player[]) => void;

  selectedRoleIds: string[];
  setSelectedRoleIds: (ids: string[]) => void;

  assignment: Assignment;
  originalAssignment: Assignment;
  dealRoles: () => void;

  votes: Record<string, string>; // playerId -> voted playerId
  setVote: (voterId: string, targetId: string) => void;
  clearVotes: () => void;

  swapSlots: (a: string, b: string) => void;

  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [assignment, setAssignment] = useState<Assignment>({});
  const [originalAssignment, setOriginalAssignment] = useState<Assignment>({});
  const [votes, setVotes] = useState<Record<string, string>>({});

  function dealRoles() {
    const result = deal(players, selectedRoleIds);
    setAssignment(result);
    setOriginalAssignment(result);
  }

  function swapSlots(a: string, b: string) {
    setAssignment((prev) => {
      const next = { ...prev };
      const tmp = next[a];
      next[a] = next[b];
      next[b] = tmp;
      return next;
    });
  }

  function setVote(voterId: string, targetId: string) {
    setVotes((prev) => ({ ...prev, [voterId]: targetId }));
  }

  function clearVotes() {
    setVotes({});
  }

  function resetGame() {
    setPlayers([]);
    setSelectedRoleIds([]);
    setAssignment({});
    setOriginalAssignment({});
    setVotes({});
  }

  const value = useMemo(
    () => ({
      players,
      setPlayers,
      selectedRoleIds,
      setSelectedRoleIds,
      assignment,
      originalAssignment,
      dealRoles,
      votes,
      setVote,
      clearVotes,
      swapSlots,
      resetGame,
    }),
    [players, selectedRoleIds, assignment, originalAssignment, votes]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

export function newPlayer(name: string): Player {
  return { id: makeId(), name };
}

export function roleName(id: string): string {
  return ROLES[id]?.nameEl ?? id;
}
