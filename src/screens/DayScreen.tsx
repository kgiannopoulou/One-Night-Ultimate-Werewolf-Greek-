import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useKeepAwake } from "expo-keep-awake";
import { Screen } from "../components/Screen";
import { Button } from "../components/Button";
import { colors, typography } from "../theme/colors";
import { useGame } from "../context/GameContext";
import * as Narrator from "../narrator/Narrator";
import { DAY_LINES } from "../game/dayScript";

const DISCUSSION_SECONDS = 5 * 60;
const ONE_MINUTE_WARNING_SECONDS = 60;
const THIRTY_SECOND_WARNING_SECONDS = 30;

export default function DayScreen({ navigation }: any) {
  useKeepAwake();
  const { players, setVote, clearVotes } = useGame();
  const [phase, setPhase] = useState<"discuss" | "voting">("discuss");
  const [voterIndex, setVoterIndex] = useState(0);
  const [revealVoter, setRevealVoter] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(DISCUSSION_SECONDS);

  // Guard each narrator cue so it fires exactly once per game, even though
  // the tick effect below re-runs every second.
  const oneMinuteWarnedRef = useRef(false);
  const thirtySecondWarnedRef = useRef(false);
  const timeUpRef = useRef(false);

  const voter = players[voterIndex];

  // Discussion countdown — ticks once per second while still discussing.
  useEffect(() => {
    if (phase !== "discuss") return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // Narrator cues at 1:00 and 0:30 remaining, then force the vote at 0:00.
  useEffect(() => {
    if (phase !== "discuss") return;

    if (secondsLeft === ONE_MINUTE_WARNING_SECONDS && !oneMinuteWarnedRef.current) {
      oneMinuteWarnedRef.current = true;
      Narrator.speakLine("day_warning_60", DAY_LINES.warningOneMinute);
    }

    if (secondsLeft === THIRTY_SECOND_WARNING_SECONDS && !thirtySecondWarnedRef.current) {
      thirtySecondWarnedRef.current = true;
      Narrator.speakLine("day_warning_30", DAY_LINES.warningThirtySeconds);
    }

    if (secondsLeft === 0 && !timeUpRef.current) {
      timeUpRef.current = true;
      (async () => {
        await Narrator.speakLine("day_time_up", DAY_LINES.timeUp);
        startVoting();
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, phase]);

  useEffect(() => {
    return () => Narrator.stop();
  }, []);

  function startVoting() {
    clearVotes();
    setVoterIndex(0);
    setRevealVoter(false);
    setPhase("voting");
  }

  function castVote(targetId: string) {
    setVote(voter.id, targetId);
    if (voterIndex + 1 >= players.length) {
      navigation.navigate("Results");
      return;
    }
    setVoterIndex((i) => i + 1);
    setRevealVoter(false);
  }

  if (phase === "discuss") {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const timeLabel = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    const isUrgent = secondsLeft <= ONE_MINUTE_WARNING_SECONDS;

    return (
      <Screen scroll={false}>
        <View style={styles.center}>
          <Text style={styles.icon}>💬</Text>
          <Text style={[typography.h2, { textAlign: "center" }]}>Ξημέρωσε!</Text>
          <Text style={[typography.body, { textAlign: "center", marginTop: 12 }]}>
            Συζητήστε μεταξύ σας ποιος πιστεύετε ότι είναι Λύκος. Όταν λήξει ο χρόνος, θα ξεκινήσει
            αυτόματα η ψηφοφορία.
          </Text>
          <View style={{ height: 20 }} />
          <Text style={[styles.timer, isUrgent && styles.timerUrgent]}>{timeLabel}</Text>
          <View style={{ height: 30 }} />
          <Button label="Ξεκίνα την Ψηφοφορία" onPress={startVoting} style={{ width: "100%" }} />
        </View>
      </Screen>
    );
  }

  // voting phase
  if (!revealVoter) {
    return (
      <Screen scroll={false}>
        <View style={styles.center}>
          <Text style={styles.icon}>🗳️</Text>
          <Text style={[typography.h2, { textAlign: "center" }]}>Πέρνα το τηλέφωνο στον/στην</Text>
          <Text style={styles.bigName}>{voter.name}</Text>
          <View style={{ height: 30 }} />
          <Button
            label={`Είμαι ο/η ${voter.name}, θα ψηφίσω`}
            onPress={() => setRevealVoter(true)}
            style={{ width: "100%" }}
          />
          <Text style={[typography.dim, { marginTop: 20 }]}>
            Ψήφος {voterIndex + 1} από {players.length}
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={typography.h2}>Ποιον ψηφίζεις εκτός;</Text>
      <View style={{ gap: 10 }}>
        {players.map((p) => (
          <Pressable key={p.id} style={styles.choice} onPress={() => castVote(p.id)}>
            <Text style={styles.choiceText}>{p.name}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  icon: { fontSize: 56, marginBottom: 16 },
  bigName: { color: colors.accentAlt, fontSize: 34, fontWeight: "800", marginTop: 6 },
  timer: {
    color: colors.accentAlt,
    fontSize: 56,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  timerUrgent: { color: colors.danger },
  choice: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  choiceText: { color: colors.text, fontSize: 16, fontWeight: "600" },
});
