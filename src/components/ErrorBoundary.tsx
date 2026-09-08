import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "./Button";
import { colors, typography } from "../theme/colors";

interface Props {
  children: React.ReactNode;
  onContinue: () => void;
}

interface State {
  hasError: boolean;
}

/**
 * Catches any unexpected render crash during a night action (rather than
 * showing a blank white screen) and lets the game move on to the next step
 * instead of getting stuck.
 */
export class NightErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("Night step crashed, recovering:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.center}>
          <Text style={styles.icon}>⚠️</Text>
          <Text style={[typography.h2, { textAlign: "center" }]}>
            Κάτι πήγε στραβά σε αυτό το βήμα
          </Text>
          <View style={{ height: 20 }} />
          <Button
            label="Συνέχεια"
            onPress={() => {
              this.setState({ hasError: false });
              this.props.onContinue();
            }}
            style={{ width: "100%" }}
          />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  icon: { fontSize: 56, marginBottom: 16 },
});
