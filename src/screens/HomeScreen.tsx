import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { Button } from "../components/Button";
import { colors, typography } from "../theme/colors";
import { useGame } from "../context/GameContext";

export default function HomeScreen({ navigation }: any) {
  const { resetGame } = useGame();

  return (
    <Screen scroll={false}>
      <View style={styles.center}>
        <Text style={styles.moon}>🌕</Text>
        <Text style={[typography.title, styles.title]}>Λύκοι μια Νύχτα</Text>
        <Text style={[typography.dim, styles.subtitle]}>
          Ψηφιακός αφηγητής για το One Night Ultimate Werewolf — στα Ελληνικά
        </Text>

        <View style={{ height: 40 }} />

        <Button
          label="Νέο Παιχνίδι"
          onPress={() => {
            resetGame();
            navigation.navigate("Players");
          }}
          style={{ width: "100%" }}
        />
        <View style={{ height: 12 }} />
        <Button
          label="Κανόνες Ρόλων"
          variant="secondary"
          onPress={() => navigation.navigate("RolesInfo")}
          style={{ width: "100%" }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  moon: { fontSize: 64, marginBottom: 12 },
  title: { textAlign: "center" },
  subtitle: { textAlign: "center", marginTop: 8, maxWidth: 320 },
});
