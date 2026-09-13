import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useKeepAwake } from "expo-keep-awake";
import { Screen } from "../components/Screen";
import { Button } from "../components/Button";
import { colors, typography } from "../theme/colors";
import { useGame } from "../context/GameContext";
import { ROLES } from "../game/roles";

export default function RevealScreen({ navigation }: any) {
  useKeepAwake();
  const { players, assignment } = useGame();
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(false);

  const player = players[index];
  const roleId = assignment[player.id];
  const role = ROLES[roleId];
  const isLast = index === players.length - 1;

  function next() {
    if (isLast) {
      navigation.navigate("Night");
      return;
    }
    setShown(false);
    setIndex((i) => i + 1);
  }

  return (
    <Screen scroll={false}>
      {!shown ? (
        <View style={styles.center}>
          <Text style={styles.passIcon}>📱</Text>
          <Text style={[typography.h2, { textAlign: "center" }]}>
            Πέρνα το τηλέφωνο στον/στην
          </Text>
          <Text style={styles.bigName}>{player.name}</Text>
          <View style={{ height: 30 }} />
          <Button
            label={`Είμαι ο/η ${player.name}`}
            onPress={() => setShown(true)}
            style={{ width: "100%" }}
          />
          <Text style={[typography.dim, { marginTop: 20, textAlign: "center" }]}>
            Παίκτης {index + 1} από {players.length}
          </Text>
        </View>
      ) : (
        <View style={styles.center}>
          <Text style={typography.dim}>Ο ρόλος σου είναι</Text>
          <View style={styles.roleCard}>
            <Text style={styles.roleIcon}>{role?.icon}</Text>
            <Text style={styles.roleName}>{role?.nameEl}</Text>
            <Text style={styles.roleDesc}>{role?.short}</Text>
          </View>
          <View style={{ height: 30 }} />
          <Button
            label={isLast ? "Το είδα — Ξεκινάει η Νύχτα" : "Το είδα — Επόμενος παίκτης"}
            onPress={next}
            style={{ width: "100%" }}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  passIcon: { fontSize: 56, marginBottom: 16 },
  roleIcon: { fontSize: 48, marginBottom: 6 },
  bigName: { color: colors.accentAlt, fontSize: 34, fontWeight: "800", marginTop: 6 },
  roleCard: {
    backgroundColor: colors.card,
    borderColor: colors.accent,
    borderWidth: 2,
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    width: "100%",
  },
  roleName: { color: colors.text, fontSize: 32, fontWeight: "800" },
  roleDesc: { color: colors.textDim, fontSize: 15, marginTop: 12, textAlign: "center" },
});
