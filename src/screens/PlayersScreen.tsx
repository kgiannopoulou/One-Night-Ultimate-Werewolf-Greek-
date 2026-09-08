import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "../components/Screen";
import { Button } from "../components/Button";
import { colors, typography } from "../theme/colors";
import { newPlayer, useGame } from "../context/GameContext";
import { Player } from "../game/types";

export default function PlayersScreen({ navigation }: any) {
  const { players, setPlayers } = useGame();
  const [name, setName] = useState("");

  function addPlayer() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPlayers([...players, newPlayer(trimmed)]);
    setName("");
  }

  function removePlayer(id: string) {
    setPlayers(players.filter((p) => p.id !== id));
  }

  const canContinue = players.length >= 3;

  return (
    <Screen>
      <Text style={typography.h2}>Παίκτες</Text>
      <Text style={typography.dim}>
        Προσθέστε τουλάχιστον 3 παίκτες. Το τηλέφωνο θα περνάει από χέρι σε χέρι.
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Όνομα παίκτη"
          placeholderTextColor={colors.textDim}
          style={styles.input}
          onSubmitEditing={addPlayer}
          returnKeyType="done"
        />
        <Button label="+" onPress={addPlayer} style={styles.addBtn} />
      </View>

      <View style={{ gap: 10 }}>
        {players.map((p: Player, i: number) => (
          <View key={p.id} style={styles.playerRow}>
            <Text style={styles.playerText}>
              {i + 1}. {p.name}
            </Text>
            <Text style={styles.remove} onPress={() => removePlayer(p.id)}>
              Αφαίρεση
            </Text>
          </View>
        ))}
        {players.length === 0 && (
          <Text style={typography.dim}>Δεν έχετε προσθέσει παίκτες ακόμα.</Text>
        )}
      </View>

      <View style={{ height: 20 }} />
      <Button
        label={`Συνέχεια (${players.length} παίκτες)`}
        disabled={!canContinue}
        onPress={() => navigation.navigate("Roles")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  inputRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 16,
  },
  addBtn: { paddingHorizontal: 20 },
  playerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  playerText: { color: colors.text, fontSize: 16, fontWeight: "600" },
  remove: { color: colors.accent, fontSize: 14, fontWeight: "600" },
});
