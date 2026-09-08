import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useKeepAwake } from "expo-keep-awake";
import { Screen } from "../components/Screen";
import { Button } from "../components/Button";
import { NightErrorBoundary } from "../components/ErrorBoundary";
import { colors, typography } from "../theme/colors";
import { useGame } from "../context/GameContext";
import { nightActingRoles, ROLES } from "../game/roles";
import { GENERAL_LINES, ROLE_LINES } from "../game/nightScript";
import { findPlayerSlotsForRole } from "../game/nightHelpers";
import { Player } from "../game/types";
import * as Narrator from "../narrator/Narrator";
import {
  SeerAction,
  RobberAction,
  TroublemakerAction,
  DrunkAction,
  InsomniacAction,
  LoneWolfAction,
} from "./nightActions";

type Stage = "intro" | "wake" | "pass" | "acting" | "sleep" | "outro";

export default function NightScreen({ navigation }: any) {
  useKeepAwake();
  const { players, selectedRoleIds, assignment, originalAssignment, swapSlots } = useGame();

  const steps = useMemo(() => nightActingRoles(selectedRoleIds), [selectedRoleIds]);
  const [stepIndex, setStepIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("intro");
  const startedRef = useRef(false);

  // Snapshotted once when a step becomes interactive, so a mid-step card
  // swap (e.g. the Drunk swapping their own card away) can never change who
  // the app thinks is currently acting.
  const [actingPlayer, setActingPlayer] = useState<Player | null>(null);

  const currentRole = steps[stepIndex];

  // Kick off intro narration once
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    (async () => {
      await Narrator.speakLine("intro", GENERAL_LINES.intro);
      if (steps.length === 0) {
        setStage("outro");
        await Narrator.speakLine("outro", GENERAL_LINES.outro);
      } else {
        setStage("wake");
      }
    })();
    return () => Narrator.stop();
  }, []);

  // Speak wake line whenever we enter a new step in "wake" stage
  useEffect(() => {
    if (stage !== "wake" || !currentRole) return;
    (async () => {
      await Narrator.speakLine(`${currentRole.id}_wake`, ROLE_LINES[currentRole.id]?.wake ?? "");
      const interaction = resolveInteraction();
      if (interaction.interactive && interaction.actor) {
        setActingPlayer(interaction.actor);
        setStage("pass");
      } else {
        // brief pause to let players self-organize (e.g. werewolves/masons look at each other)
        await new Promise((r) => setTimeout(r, 2500));
        await goToSleepStage();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, stepIndex]);

  async function goToSleepStage() {
    if (!currentRole) return;
    setStage("sleep");
    setActingPlayer(null);
    await Narrator.speakLine(`${currentRole.id}_sleep`, ROLE_LINES[currentRole.id]?.sleep ?? "");
    advanceStep();
  }

  function advanceStep() {
    const nextIndex = stepIndex + 1;
    if (nextIndex >= steps.length) {
      setStage("outro");
      Narrator.speakLine("outro", GENERAL_LINES.outro).then(() => {});
      return;
    }
    setStepIndex(nextIndex);
    setStage("wake");
  }

  // Only ever called against the ASSIGNMENT AT THE START of a step (from
  // the "wake" effect above), before any swap for this step has happened.
  function resolveInteraction() {
    if (!currentRole) return { interactive: false as const };
    const id = currentRole.id;

    if (id === "werewolf") {
      // Whenever exactly one player ends up holding a Werewolf card —
      // whether the deck had one wolf or two — that lone wolf gets to peek
      // a center card, since they'd otherwise have zero information.
      const holders = findPlayerSlotsForRole(players, assignment, "werewolf");
      if (holders.length === 1) return { interactive: true as const, actor: holders[0] };
      return { interactive: false as const };
    }
    // Mason and Minion are resolved physically at the table (open eyes /
    // raised fist), not through the app — no screen interaction needed.
    if (id === "mason" || id === "minion") {
      return { interactive: false as const };
    }
    // seer, robber, troublemaker, drunk, insomniac
    const holders = findPlayerSlotsForRole(players, assignment, id);
    if (holders.length === 1) return { interactive: true as const, actor: holders[0] };
    return { interactive: false as const };
  }

  if (stage === "outro") {
    return (
      <Screen scroll={false}>
        <View style={styles.center}>
          <Text style={styles.icon}>☀️</Text>
          <Text style={[typography.h2, { textAlign: "center" }]}>{GENERAL_LINES.outro}</Text>
          <View style={{ height: 30 }} />
          <Button label="Συνέχεια στη Συζήτηση" onPress={() => navigation.navigate("Day")} />
        </View>
      </Screen>
    );
  }

  if (stage === "intro") {
    return (
      <Screen scroll={false}>
        <View style={styles.center}>
          <Text style={styles.icon}>🌙</Text>
          <Text style={[typography.h2, { textAlign: "center" }]}>{GENERAL_LINES.intro}</Text>
        </View>
      </Screen>
    );
  }

  if (!currentRole) return null;

  if (stage === "wake" || stage === "sleep") {
    // Roles whose only copy(ies) ended up in the center this round get no
    // interactive turn — make that visible instead of silently skipping it,
    // so it doesn't look like the app just isn't letting them act.
    const canHaveHolder = !["mason", "minion"].includes(currentRole.id);
    const holderCount = findPlayerSlotsForRole(players, assignment, currentRole.id).length;
    const noOneHasIt = canHaveHolder && holderCount === 0;

    return (
      <Screen scroll={false}>
        <View style={styles.center}>
          <Text style={styles.icon}>{currentRole.icon}</Text>
          <Text style={styles.roleLabel}>{currentRole.nameEl}</Text>
          <Text style={[typography.body, { textAlign: "center", marginTop: 10 }]}>
            {stage === "wake" ? ROLE_LINES[currentRole.id]?.wake : ROLE_LINES[currentRole.id]?.sleep}
          </Text>
          {noOneHasIt && (
            <Text style={[typography.dim, { textAlign: "center", marginTop: 16 }]}>
              Κανείς παίκτης δεν έχει αυτόν τον ρόλο αυτή τη φορά — η κάρτα είναι στο κέντρο, οπότε
              δεν γίνεται καμία ενέργεια.
            </Text>
          )}
        </View>
      </Screen>
    );
  }

  if (!actingPlayer) return null;

  if (stage === "pass") {
    return (
      <Screen scroll={false}>
        <View style={styles.center}>
          <Text style={styles.icon}>📱</Text>
          <Text style={[typography.h2, { textAlign: "center" }]}>Πέρνα το τηλέφωνο στον/στην</Text>
          <Text style={styles.bigName}>{actingPlayer.name}</Text>
          <View style={{ height: 30 }} />
          <Button
            label={`Είμαι ο/η ${actingPlayer.name}`}
            onPress={() => setStage("acting")}
            style={{ width: "100%" }}
          />
        </View>
      </Screen>
    );
  }

  // stage === "acting"
  const actor = actingPlayer;
  const others = players.filter((p) => p.id !== actor.id);

  return (
    <Screen>
      <NightErrorBoundary onContinue={goToSleepStage}>
        <Text style={typography.h2}>
          {currentRole.icon} {currentRole.nameEl}
        </Text>
        <Text style={typography.dim}>{ROLES[currentRole.id]?.short}</Text>
        <View style={{ height: 10 }} />

        {currentRole.id === "seer" && (
          <SeerAction actor={actor} others={others} assignment={assignment} onDone={goToSleepStage} />
        )}

        {currentRole.id === "robber" && (
          <RobberAction
            actor={actor}
            others={others}
            assignment={assignment}
            onSwap={(targetId) => {
              swapSlots(actor.id, targetId);
              setTimeout(() => goToSleepStage(), 1800);
            }}
          />
        )}

        {currentRole.id === "troublemaker" && (
          <TroublemakerAction
            others={others}
            onSwap={(aId, bId) => swapSlots(aId, bId)}
            onDone={goToSleepStage}
          />
        )}

        {currentRole.id === "drunk" && (
          <DrunkAction onSwap={(slot) => swapSlots(actor.id, slot)} onDone={goToSleepStage} />
        )}

        {currentRole.id === "insomniac" && (
          <InsomniacAction
            originalRoleName={ROLES[originalAssignment[actor.id]]?.nameEl ?? ""}
            currentRoleName={ROLES[assignment[actor.id]]?.nameEl ?? ""}
            onDone={goToSleepStage}
          />
        )}

        {currentRole.id === "werewolf" && (
          <LoneWolfAction assignment={assignment} onDone={goToSleepStage} />
        )}
      </NightErrorBoundary>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  icon: { fontSize: 56, marginBottom: 16 },
  roleLabel: { color: colors.accentAlt, fontSize: 28, fontWeight: "800" },
  bigName: { color: colors.accentAlt, fontSize: 34, fontWeight: "800", marginTop: 6 },
});
