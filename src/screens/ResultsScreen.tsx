import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { Button } from "../components/Button";
import { colors, typography } from "../theme/colors";
import { useGame } from "../context/GameContext";
import { ROLES } from "../game/roles";

export default function ResultsScreen({ navigation }: any) {
  const { players, assignment, votes, resetGame } = useGame();

  const { eliminated, winner, tally } = useMemo(() => {
    const tally: Record<string, number> = {};
    players.forEach((p) => (tally[p.id] = 0));
    Object.values(votes).forEach((targetId) => {
      tally[targetId] = (tally[targetId] ?? 0) + 1;
    });
    const maxVotes = Math.max(0, ...Object.values(tally));
    const eliminated =
      maxVotes > 0 ? players.filter((p) => tally[p.id] === maxVotes) : [];

    const eliminatedRoleIds = eliminated.map((p) => assignment[p.id]);
    const werewolves = players.filter((p) => ROLES[assignment[p.id]]?.team === "werewolf" && assignment[p.id] === "werewolf");
    const tannerKilled = eliminatedRoleIds.includes("tanner");
    const werewolfKilled = eliminatedRoleIds.includes("werewolf");

    let winner: "tanner" | "village" | "werewolf";
    if (tannerKilled) {
      winner = "tanner";
    } else if (werewolfKilled) {
      winner = "village";
    } else if (werewolves.length === 0 && eliminated.length === 0) {
      winner = "village";
    } else {
      winner = "werewolf";
    }

    return { eliminated, winner, tally };
  }, [players, assignment, votes]);

  const winnerLabel =
    winner === "tanner"
      ? "Ο Απόβλητος κερδίζει!"
      : winner === "village"
      ? "Το Χωριό κερδίζει!"
      : "Οι Λύκοι κερδίζουν!";

  return (
    <Screen>
      <View style={styles.center}>
        <Text style={styles.icon}>{winner === "werewolf" ? "🐺" : winner === "tanner" ? "🥃" : "🏆"}</Text>
        <Text style={[typography.title, { textAlign: "center" }]}>{winnerLabel}</Text>
      </View>

      <View style={{ height: 10 }} />
      <Text style={typography.h2}>Ποιον ψήφισε ο κόσμος</Text>
      <View style={{ gap: 8 }}>
        {eliminated.length === 0 && (
          <Text style={typography.dim}>Κανείς δεν πήρε τις περισσότερες ψήφους / ισοπαλία γενική.</Text>
        )}
        {eliminated.map((p) => (
          <Text key={p.id} style={styles.eliminatedText}>
            ❌ {p.name} — ήταν {ROLES[assignment[p.id]]?.nameEl} ({tally[p.id]} ψήφοι)
          </Text>
        ))}
      </View>

      <View style={{ height: 10 }} />
      <Text style={typography.h2}>Τελικοί ρόλοι όλων</Text>
      <View style={{ gap: 8 }}>
        {players.map((p) => (
          <View key={p.id} style={styles.roleRow}>
            <Text style={styles.playerName}>{p.name}</Text>
            <Text style={styles.roleText}>
              {ROLES[assignment[p.id]]?.icon} {ROLES[assignment[p.id]]?.nameEl}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ height: 20 }} />
      <Button
        label="Νέο Παιχνίδι"
        onPress={() => {
          resetGame();
          navigation.navigate("Home");
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", paddingVertical: 20 },
  icon: { fontSize: 56, marginBottom: 10 },
  eliminatedText: { color: colors.text, fontSize: 15 },
  roleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  playerName: { color: colors.text, fontSize: 15, fontWeight: "700" },
  roleText: { color: colors.accentAlt, fontSize: 15, fontWeight: "700" },
});
