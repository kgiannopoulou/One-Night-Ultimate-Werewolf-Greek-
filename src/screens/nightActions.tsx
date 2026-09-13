import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { colors, typography } from "../theme/colors";
import { ROLES } from "../game/roles";
import { Assignment, Player } from "../game/types";
import { CENTER_SLOTS } from "../game/nightHelpers";

function Choice({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.choice} onPress={onPress}>
      <Text style={styles.choiceText}>{label}</Text>
    </Pressable>
  );
}

function RevealBox({ text }: { text: string }) {
  return (
    <View style={styles.revealBox}>
      <Text style={styles.revealText}>{text}</Text>
    </View>
  );
}

// ---------- Seer ----------
export function SeerAction({
  actor,
  others,
  assignment,
  onDone,
}: {
  actor: Player;
  others: Player[];
  assignment: Assignment;
  onDone: () => void;
}) {
  const [mode, setMode] = useState<"choose" | "player" | "center" | "result">("choose");
  const [result, setResult] = useState("");
  const [centerPicked, setCenterPicked] = useState<string[]>([]);

  if (mode === "choose") {
    return (
      <View style={{ gap: 12 }}>
        <Choice label="Δες την κάρτα ενός παίκτη" onPress={() => setMode("player")} />
        <Choice label="Δες δύο κάρτες από το κέντρο" onPress={() => setMode("center")} />
      </View>
    );
  }
  if (mode === "player") {
    return (
      <View style={{ gap: 12 }}>
        {others.map((p) => (
          <Choice
            key={p.id}
            label={p.name}
            onPress={() => {
              const role = ROLES[assignment[p.id]];
              setResult(`${p.name}: ${role?.nameEl}`);
              setMode("result");
            }}
          />
        ))}
      </View>
    );
  }
  if (mode === "center") {
    if (centerPicked.length < 2) {
      const remaining = CENTER_SLOTS.filter((s) => !centerPicked.includes(s));
      return (
        <View style={{ gap: 12 }}>
          <Text style={typography.dim}>
            Επίλεξε {2 - centerPicked.length} ακόμα κάρτ{2 - centerPicked.length === 1 ? "α" : "ες"} από το κέντρο
          </Text>
          {remaining.map((s, i) => (
            <Choice
              key={s}
              label={`Κάρτα κέντρου #${CENTER_SLOTS.indexOf(s) + 1}`}
              onPress={() => {
                const next = [...centerPicked, s];
                setCenterPicked(next);
                if (next.length === 2) {
                  const text = next
                    .map((slot) => `Κάρτα #${CENTER_SLOTS.indexOf(slot) + 1}: ${ROLES[assignment[slot]]?.nameEl}`)
                    .join("\n");
                  setResult(text);
                  setMode("result");
                }
              }}
            />
          ))}
        </View>
      );
    }
  }
  return (
    <View style={{ gap: 16 }}>
      <RevealBox text={result} />
      <Button label="Το είδα" onPress={onDone} />
    </View>
  );
}

// ---------- Robber ----------
export function RobberAction({
  actor,
  others,
  assignment,
  onSwap,
}: {
  actor: Player;
  others: Player[];
  assignment: Assignment;
  onSwap: (targetId: string, newRoleName: string) => void;
}) {
  const [result, setResult] = useState<string | null>(null);

  if (result) {
    return (
      <View style={{ gap: 16 }}>
        <RevealBox text={`Η νέα σου κάρτα είναι: ${result}`} />
      </View>
    );
  }

  return (
    <View style={{ gap: 12 }}>
      <Text style={typography.dim}>Με ποιον θέλεις να ανταλλάξεις κάρτα;</Text>
      {others.map((p) => (
        <Choice
          key={p.id}
          label={p.name}
          onPress={() => {
            const newRole = ROLES[assignment[p.id]]?.nameEl ?? "";
            setResult(newRole);
            onSwap(p.id, newRole);
          }}
        />
      ))}
    </View>
  );
}

// ---------- Troublemaker ----------
export function TroublemakerAction({
  others,
  onSwap,
  onDone,
}: {
  others: Player[];
  onSwap: (aId: string, bId: string) => void;
  onDone: () => void;
}) {
  const [first, setFirst] = useState<Player | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <View style={{ gap: 16 }}>
        <RevealBox text="Οι δύο κάρτες αντάλλαξαν θέση. Εσύ δεν είδες τίποτα." />
        <Button label="Συνέχεια" onPress={onDone} />
      </View>
    );
  }

  if (!first) {
    return (
      <View style={{ gap: 12 }}>
        <Text style={typography.dim}>Επίλεξε τον πρώτο παίκτη</Text>
        {others.map((p) => (
          <Choice key={p.id} label={p.name} onPress={() => setFirst(p)} />
        ))}
      </View>
    );
  }

  const remaining = others.filter((p) => p.id !== first.id);
  return (
    <View style={{ gap: 12 }}>
      <Text style={typography.dim}>Επίλεξε τον δεύτερο παίκτη (θα ανταλλάξει με {first.name})</Text>
      {remaining.map((p) => (
        <Choice
          key={p.id}
          label={p.name}
          onPress={() => {
            onSwap(first.id, p.id);
            setDone(true);
          }}
        />
      ))}
    </View>
  );
}

// ---------- Drunk ----------
export function DrunkAction({
  onSwap,
  onDone,
}: {
  onSwap: (centerSlot: string) => void;
  onDone: () => void;
}) {
  const [done, setDone] = useState(false);
  if (done) {
    return (
      <View style={{ gap: 16 }}>
        <RevealBox text="Αντάλλαξες την κάρτα σου με μία από το κέντρο. Δεν ξέρεις ποια είναι τώρα." />
        <Button label="Συνέχεια" onPress={onDone} />
      </View>
    );
  }
  return (
    <View style={{ gap: 12 }}>
      <Text style={typography.dim}>Επίλεξε μια κάρτα από το κέντρο για ανταλλαγή (χωρίς να τη δεις)</Text>
      {CENTER_SLOTS.map((s, i) => (
        <Choice
          key={s}
          label={`Κάρτα κέντρου #${i + 1}`}
          onPress={() => {
            onSwap(s);
            setDone(true);
          }}
        />
      ))}
    </View>
  );
}

// ---------- Insomniac ----------
export function InsomniacAction({
  originalRoleName,
  currentRoleName,
  onDone,
}: {
  originalRoleName: string;
  currentRoleName: string;
  onDone: () => void;
}) {
  const changed = originalRoleName !== currentRoleName;
  const text = changed
    ? `Η κάρτα σου ΑΛΛΑΞΕ κατά τη διάρκεια της νύχτας! Τώρα είσαι: ${currentRoleName}`
    : `Η κάρτα σου ΔΕΝ άλλαξε. Είσαι ακόμα: ${currentRoleName}`;
  return (
    <View style={{ gap: 16 }}>
      <RevealBox text={text} />
      <Button label="Το είδα" onPress={onDone} />
    </View>
  );
}

// ---------- Lone Werewolf ----------
export function LoneWolfAction({
  assignment,
  onDone,
}: {
  assignment: Assignment;
  onDone: () => void;
}) {
  const [result, setResult] = useState<string | null>(null);
  if (result) {
    return (
      <View style={{ gap: 16 }}>
        <RevealBox text={result} />
        <Button label="Συνέχεια" onPress={onDone} />
      </View>
    );
  }
  return (
    <View style={{ gap: 12 }}>
      <Text style={typography.dim}>
        Είσαι ο μοναδικός Λύκος. Μπορείς να δεις μία κάρτα από το κέντρο.
      </Text>
      {CENTER_SLOTS.map((s, i) => (
        <Choice
          key={s}
          label={`Κάρτα κέντρου #${i + 1}`}
          onPress={() => setResult(`Κάρτα #${i + 1}: ${ROLES[assignment[s]]?.nameEl}`)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  choice: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  choiceText: { color: colors.text, fontSize: 16, fontWeight: "600" },
  revealBox: {
    backgroundColor: colors.card,
    borderColor: colors.accent,
    borderWidth: 2,
    borderRadius: 16,
    padding: 22,
  },
  revealText: { color: colors.text, fontSize: 18, fontWeight: "700", textAlign: "center" },
});
