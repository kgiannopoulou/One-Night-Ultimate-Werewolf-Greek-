import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { Button } from "../components/Button";
import { colors, typography } from "../theme/colors";
import { useGame } from "../context/GameContext";
import { ROLE_LIST } from "../game/roles";
import { recommendedDeck } from "../game/rolePresets";

function countsFromIds(ids: string[]): Record<string, number> {
  const c: Record<string, number> = {};
  for (const id of ids) c[id] = (c[id] ?? 0) + 1;
  return c;
}

function idsFromCounts(counts: Record<string, number>): string[] {
  const ids: string[] = [];
  for (const [id, n] of Object.entries(counts)) {
    for (let i = 0; i < n; i++) ids.push(id);
  }
  return ids;
}

export default function RolesScreen({ navigation }: any) {
  const { players, selectedRoleIds, setSelectedRoleIds, dealRoles } = useGame();
  const target = players.length + 3;

  const [counts, setCounts] = useState<Record<string, number>>(() =>
    selectedRoleIds.length ? countsFromIds(selectedRoleIds) : countsFromIds(recommendedDeck(target))
  );

  const total = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts]);

  useEffect(() => {
    setSelectedRoleIds(idsFromCounts(counts));
  }, [counts]);

  function change(id: string, delta: number, max: number) {
    setCounts((prev) => {
      const cur = prev[id] ?? 0;
      const next = Math.max(0, Math.min(max, cur + delta));
      return { ...prev, [id]: next };
    });
  }

  function applyRecommended() {
    setCounts(countsFromIds(recommendedDeck(target)));
  }

  const canContinue = total === target;

  return (
    <Screen>
      <Text style={typography.h2}>Επιλογή Ρόλων</Text>
      <Text style={typography.dim}>
        Χρειάζεστε ακριβώς {target} κάρτες ({players.length} παίκτες + 3 στο κέντρο). Έχετε
        επιλέξει: {total}.
      </Text>

      <Button label="Προτεινόμενη σύνθεση" variant="secondary" onPress={applyRecommended} />

      <View style={{ gap: 10 }}>
        {ROLE_LIST.map((role) => {
          const n = counts[role.id] ?? 0;
          return (
            <View key={role.id} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.roleName}>
                  {role.icon} {role.nameEl}
                </Text>
                <Text style={styles.roleShort}>{role.short}</Text>
              </View>
              <View style={styles.stepper}>
                <Pressable
                  onPress={() => change(role.id, -1, role.poolCount)}
                  style={styles.stepBtn}
                >
                  <Text style={styles.stepBtnText}>−</Text>
                </Pressable>
                <Text style={styles.stepValue}>{n}</Text>
                <Pressable
                  onPress={() => change(role.id, 1, role.poolCount)}
                  style={styles.stepBtn}
                >
                  <Text style={styles.stepBtnText}>+</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>

      <View style={{ height: 12 }} />
      <Button
        label={canContinue ? "Μοίρασμα Ρόλων" : `Χρειάζονται ${target - total} ακόμα κάρτες`}
        disabled={!canContinue}
        onPress={() => {
          dealRoles();
          navigation.navigate("Reveal");
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  roleName: { color: colors.text, fontSize: 16, fontWeight: "700" },
  roleShort: { color: colors.textDim, fontSize: 13, marginTop: 2 },
  stepper: { flexDirection: "row", alignItems: "center", gap: 10 },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.bgAlt,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBtnText: { color: colors.text, fontSize: 18, fontWeight: "700" },
  stepValue: { color: colors.text, fontSize: 16, fontWeight: "700", minWidth: 18, textAlign: "center" },
});
