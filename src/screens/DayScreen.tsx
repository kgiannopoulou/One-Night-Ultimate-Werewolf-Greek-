import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useKeepAwake } from "expo-keep-awake";
import { Screen } from "../components/Screen";
import { Button } from "../components/Button";
import { colors, typography } from "../theme/colors";
import { useGame } from "../context/GameContext";

export default function DayScreen({ navigation }: any) {
  useKeepAwake();
  const { players, setVote, clearVotes } = useGame();
  const [phase, setPhase] = useState<"discuss" | "voting">("discuss");
  const [voterIndex, setVoterIndex] = useState(0);
  const [revealVoter, setRevealVoter] = useState(false);

  const voter = players[voterIndex];

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
    return (
      <Screen scroll={false}>
        <View style={styles.center}>
          <Text style={styles.icon}>💬</Text>
          <Text style={[typography.h2, { textAlign: "center" }]}>Ξημέρωσε!</Text>
          <Text style={[typography.body, { textAlign: "center", marginTop: 12 }]}>
            Συζητήστε μεταξύ σας ποιος πιστεύετε ότι είναι Λύκος. Όταν είστε έτοιμοι, ξεκινήστε την
            ψηφοφορία.
          </Text>
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
  choice: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  choiceText: { color: colors.text, fontSize: 16, fontWeight: "600" },
});
