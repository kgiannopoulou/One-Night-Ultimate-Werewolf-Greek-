import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { colors, typography } from "../theme/colors";
import { ROLE_LIST } from "../game/roles";

const TEAM_LABEL: Record<string, string> = {
  werewolf: "Ομάδα Λύκων",
  village: "Ομάδα Χωριού",
  tanner: "Μοναχικός",
};

export default function RolesInfoScreen() {
  return (
    <Screen>
      <Text style={typography.h2}>Οι Ρόλοι</Text>
      <View style={{ gap: 10 }}>
        {ROLE_LIST.map((role) => (
          <View key={role.id} style={styles.row}>
            <View style={styles.headerRow}>
              <Text style={styles.roleName}>
                {role.icon} {role.nameEl}
              </Text>
              <Text style={styles.team}>{TEAM_LABEL[role.team]}</Text>
            </View>
            <Text style={styles.desc}>{role.short}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  roleName: { color: colors.text, fontSize: 16, fontWeight: "700" },
  team: { color: colors.accentAlt, fontSize: 12, fontWeight: "600" },
  desc: { color: colors.textDim, fontSize: 13, marginTop: 6 },
});
